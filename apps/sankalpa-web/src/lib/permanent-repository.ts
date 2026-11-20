import type { CaptureKind, Entity, FocusSession } from '../domain/models'
import type { Database, EntityRow, FocusRow, LifeRow } from './database.types'
import { getSupabaseClient } from './supabase'

export type LifeTable = 'goals' | 'projects' | 'missions'
type TableName = keyof Database['public']['Tables']
export type EntityPatch = Partial<Pick<Entity, 'title' | 'body' | 'kind' | 'projectId' | 'completedAt'>>
export type SchedulingCommand = { action: 'unchanged' } | { action: 'add' | 'remove'; date: string } | { action: 'move'; fromDate: string; toDate: string }
export type EntityMutation = { fields?: EntityPatch; scheduling?: SchedulingCommand }
export type CaptureRequest = { requestId: string; title: string; kind: CaptureKind; planDate?: string }
export class CaptureOutcomeError extends Error {
  constructor(message: string, public readonly uncertain: boolean) { super(message) }
}
let timezone = 'Asia/Kolkata'
export const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: timezone }).format(new Date())
function failure(error: { message: string; code?: string; status?: number }) {
  if (error.code === '42501' || error.status === 403) return new Error('Permission denied. Your changes were not saved.')
  if (error.code === '23503') return new Error('A linked record is missing or belongs to another account.')
  if (error.code === '23505') return new Error('This record or priority slot already exists. Refresh and try again.')
  if (error.code === '23514') return new Error(error.message)
  return new Error(error.message || 'Request failed. Refresh to check the current state before retrying.')
}
async function connected() {
  if (!navigator.onLine) throw new Error('Offline. Reconnect before checking or saving account records.')
  const db = getSupabaseClient()
  const { data, error } = await db.auth.getUser()
  if (error || !data.user) {
    if (error?.status === 401 || error?.status === 403 || !error) await db.auth.signOut({ scope: 'local' })
    throw new Error(error?.message ?? 'Your session expired. Sign in again.')
  }
  return { db, owner: data.user.id }
}
async function rows<T extends TableName>(table: T): Promise<Database['public']['Tables'][T]['Row'][]> {
  const { db, owner } = await connected()
  const result: unknown[] = []
  for (let offset = 0; ; offset += 500) {
    const { data, error } = await db.from(table).select('*').filter('owner_id', 'eq', owner).order('id').range(offset, offset + 499)
    if (error) throw failure(error)
    result.push(...data)
    if (data.length < 500) break
  }
  return result as Database['public']['Tables'][T]['Row'][]
}
const entity = (r: EntityRow, scheduledDate?: string): Entity => ({ id: r.id, ownerId: r.owner_id, createdAt: r.created_at, updatedAt: r.updated_at, title: r.title, body: r.body, kind: r.kind as CaptureKind, projectId: r.project_id ?? undefined, completedAt: r.completed_at ?? undefined, estimateMinutes: r.estimate_minutes ?? undefined, scheduledDate })
const focus = (r: FocusRow): FocusSession => ({ id: r.id, ownerId: r.owner_id, createdAt: r.created_at, updatedAt: r.updated_at, entityId: r.entity_id, startedAt: r.started_at, endedAt: r.ended_at!, elapsedSeconds: r.elapsed_seconds, outcome: r.outcome as FocusSession['outcome'] })
export const permanentRepository = {
  async profile() {
    const { db, owner } = await connected()
    const { error } = await db.from('profiles').upsert({ id: owner, owner_id: owner }, { onConflict: 'id', ignoreDuplicates: true })
    if (error) throw failure(error)
    const { data, error: readError } = await db.from('profiles').select('*').eq('id', owner).single()
    if (readError) throw failure(readError)
    timezone = data.timezone
    return data
  },
  async setTimezone(value: string) {
    const { db, owner } = await connected()
    const { error } = await db.from('profiles').update({ timezone: value }).eq('id', owner).select('id').single()
    if (error) throw failure(error)
    timezone = value
  },
  async list() {
    await permanentRepository.profile()
    const [entities, plans, priorities] = await Promise.all([rows('entities'), rows('daily_plans'), rows('daily_priorities')])
    const plan = plans.find(p => p.plan_date === today())
    return entities.map(r => entity(r, priorities.some(p => p.plan_id === plan?.id && p.entity_id === r.id) ? today() : undefined))
  },
  async capture(request: CaptureRequest) {
    const { db } = await connected()
    try {
      const { data, error, status } = await db.rpc('capture_entity_once', { p_request_id: request.requestId, p_title: request.title.trim(), p_kind: request.kind, ...(request.planDate ? { p_plan_date: request.planDate } : {}) })
      if (error) {
        const sqlRejection = /^[0-9A-Z]{5}$/.test(error.code) && !error.code.startsWith('08') && error.code !== '40003'
        const rejected = sqlRejection || (error.code.startsWith('PGRST') && status < 500) || (status >= 400 && status < 500 && status !== 408)
        throw new CaptureOutcomeError(rejected ? failure(error).message : 'Save outcome is uncertain. Retry this same capture to check its result.', !rejected)
      }
      if (!data || typeof data.entity_id !== 'string' || typeof data.deleted !== 'boolean' || typeof data.replayed !== 'boolean') throw new CaptureOutcomeError('Save outcome is uncertain. Retry this same capture to check its result.', true)
      return data
    } catch (error) {
      if (error instanceof CaptureOutcomeError) throw error
      throw new CaptureOutcomeError('Save outcome is uncertain. Retry this same capture to check its result.', true)
    }
  },
  async update(id: string, mutation: EntityMutation) {
    const { db } = await connected()
    const fields = { ...mutation.fields, ...('projectId' in (mutation.fields ?? {}) ? { projectId: mutation.fields!.projectId || null } : {}), ...('completedAt' in (mutation.fields ?? {}) ? { completedAt: mutation.fields!.completedAt || null } : {}) }
    const { error } = await db.rpc('mutate_entity', { p_entity_id: id, p_fields: fields, p_schedule: mutation.scheduling ?? { action: 'unchanged' } })
    if (error) throw failure(error)
  },
  async remove(id: string) {
    const { db, owner } = await connected()
    const { data, error } = await db.from('entities').delete().eq('id', id).eq('owner_id', owner).select('id').single()
    if (error || !data) throw failure(error ?? { message: 'Record unavailable.' })
  },
  async life(table: LifeTable) { return rows(table) },
  async saveLife(table: LifeTable, value: Partial<LifeRow>) {
    const { db, owner } = await connected()
    const { data, error } = await db.from(table).upsert({ ...value, owner_id: owner }).select().single()
    if (error) throw failure(error)
    return data
  },
  async removeLife(table: LifeTable, id: string) {
    const { db, owner } = await connected()
    const { error } = await db.from(table).delete().eq('id', id).eq('owner_id', owner).select('id').single()
    if (error) throw failure(error)
  },
  async intention() { return (await rows('daily_plans')).find(p => p.plan_date === today())?.sankalp ?? '' },
  async saveIntention(sankalp: string) {
    const { db, owner } = await connected()
    const { error } = await db.from('daily_plans').upsert({ owner_id: owner, plan_date: today(), sankalp }, { onConflict: 'owner_id,plan_date' })
    if (error) throw failure(error)
  },
  async focusSessions() { return (await rows('focus_sessions')).filter(r => r.ended_at).map(focus) },
  async startFocus(entityId: string) {
    const { db } = await connected(); const { data, error } = await db.rpc('start_focus', { p_entity_id: entityId })
    if (error) throw failure(error)
    return { id: data.id, startedAt: data.started_at }
  },
  async saveFocus(_entityId: string, _startedAt: string, elapsedSeconds: number, _outcome: FocusSession['outcome'], sessionId?: string) {
    void [_entityId, _startedAt, _outcome]
    if (!sessionId) throw new Error('Start a server-timed focus session before saving.')
    const { db } = await connected(); const { error } = await db.rpc('finish_focus', { p_session_id: sessionId, p_elapsed_seconds: elapsedSeconds })
    if (error) throw failure(error)
  },
  async exportAccount() {
    const { db } = await connected(); const { data, error } = await db.rpc('export_account')
    if (error) throw failure(error)
    return data
  },
}
