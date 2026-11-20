import type { Entity, FocusSession } from '../domain/models'
import type { CaptureRequest, EntityMutation } from './permanent-repository'

// Explicit ephemeral adapter: no localStorage, remote writes, or private data in caches.
let entities: Entity[] = []
let sessions: FocusSession[] = []
const plans = new Map<string, Set<string>>()
const receipts = new Map<string, { fingerprint: string; id: string }>()
const ownerId = 'session-preview'
export const today = () => new Date().toLocaleDateString('en-CA')
export const repository = {
  async list(): Promise<Entity[]> { return entities.map(e => ({ ...e, scheduledDate: plans.get(e.id)?.has(today()) ? today() : undefined })) },
  async capture(request: CaptureRequest) {
    const { requestId, kind, planDate: scheduledDate } = request
    const trimmed = request.title.trim()
    if (!requestId) throw new Error('Capture request identity required.')
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify([trimmed, kind, scheduledDate ?? null])))
    const fingerprint = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('')
    const receipt = receipts.get(requestId)
    if (receipt) {
      if (receipt.fingerprint !== fingerprint) throw new Error('Request identity already used with another payload')
      return { entity_id: receipt.id, replayed: true, deleted: !entities.some(e => e.id === receipt.id) }
    }
    if (!trimmed || trimmed.length > 500) throw new Error('Enter between 1 and 500 characters.')
    if (!['inbox', 'task', 'note', 'idea', 'link', 'reminder'].includes(kind)) throw new Error('Invalid category.')
    if (scheduledDate && entities.filter(e => plans.get(e.id)?.has(scheduledDate)).length >= 3) throw new Error('Your three priorities are set. Keep this in the inbox or make room first.')
    const now = new Date().toISOString()
    const entity: Entity = { id: crypto.randomUUID(), ownerId, title: trimmed, kind, body: '', createdAt: now, updatedAt: now, scheduledDate }
    entities = [...entities, entity]
    plans.set(entity.id, new Set(scheduledDate ? [scheduledDate] : []))
    receipts.set(requestId, { fingerprint, id: entity.id })
    return { entity_id: entity.id, replayed: false, deleted: false }
  },
  async update(id: string, mutation: EntityMutation) {
    const entity = entities.find(e => e.id === id)
    if (!entity) throw new Error('This item is no longer available.')
    const patch = mutation.fields ?? {}
    const next = { ...entity, ...patch }
    if (!next.title.trim() || next.title.length > 500) throw new Error('Enter between 1 and 500 characters.')
    if (!['inbox', 'task', 'note', 'idea', 'link', 'reminder'].includes(next.kind)) throw new Error('Invalid category.')
    if (patch.projectId) throw new Error('Project linking requires a permanent account.')
    const command = mutation.scheduling ?? { action: 'unchanged' }
    const dates = new Set(plans.get(id))
    const destination = command.action === 'add' ? command.date : command.action === 'move' ? command.toDate : undefined
    if (destination) {
      if (next.completedAt) throw new Error('Completed records cannot be scheduled')
      if (!dates.has(destination) && entities.filter(e => e.id !== id && plans.get(e.id)?.has(destination)).length >= 3) throw new Error('Three priorities are enough. Make room before adding another.')
      dates.add(destination)
    }
    if (command.action === 'remove') dates.delete(command.date)
    if (command.action === 'move' && command.fromDate !== command.toDate) dates.delete(command.fromDate)
    if (next.completedAt && !entity.completedAt) dates.clear()
    // Commit only after all checks, mirroring the database's transaction boundary.
    plans.set(id, dates)
    entities = entities.map(e => e.id === id ? { ...next, updatedAt: new Date().toISOString() } : e)
  },
  async remove(id: string) {
    if (!entities.some(e => e.id === id)) throw new Error('This item is no longer available.')
    entities = entities.filter(e => e.id !== id); plans.delete(id)
    sessions = sessions.filter(s => s.entityId !== id)
  },
  async focusSessions() { return sessions.map(s => ({ ...s })) },
  async saveFocus(entityId: string, startedAt: string, elapsedSeconds: number, outcome: FocusSession['outcome']) {
    if (!entities.some(e => e.id === entityId)) throw new Error('Select an existing task or topic.')
    const now = new Date().toISOString()
    sessions = [...sessions, { id: crypto.randomUUID(), ownerId, entityId, startedAt, endedAt: now, elapsedSeconds, outcome, createdAt: now, updatedAt: now }]
  },
}
