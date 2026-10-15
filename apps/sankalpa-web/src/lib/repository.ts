import type { CaptureKind, Entity, FocusSession } from '../domain/models'

// Explicit ephemeral adapter: no localStorage, remote writes, or private data in caches.
let entities: Entity[] = []
let sessions: FocusSession[] = []
const ownerId = 'session-preview'
export const today = () => new Date().toLocaleDateString('en-CA')
export const repository = {
  async list(): Promise<Entity[]> { return entities.map(e => ({ ...e })) },
  async capture(title: string, kind: CaptureKind = 'inbox', scheduledDate?: string) {
    const trimmed = title.trim()
    if (!trimmed || trimmed.length > 500) throw new Error('Enter between 1 and 500 characters.')
    if (scheduledDate && entities.filter(e => e.scheduledDate === scheduledDate && !e.completedAt).length >= 3) throw new Error('Your three priorities are set. Keep this in the inbox or make room first.')
    const now = new Date().toISOString()
    const entity: Entity = { id: crypto.randomUUID(), ownerId, title: trimmed, kind, body: '', createdAt: now, updatedAt: now, scheduledDate }
    entities = [...entities, entity]
    return entity
  },
  async update(id: string, patch: Partial<Pick<Entity, 'kind' | 'scheduledDate' | 'completedAt'>>) {
    const entity = entities.find(e => e.id === id)
    if (!entity) throw new Error('This item is no longer available.')
    if (patch.scheduledDate && entities.filter(e => e.id !== id && e.scheduledDate === patch.scheduledDate && !e.completedAt).length >= 3) throw new Error('Three priorities are enough. Make room before adding another.')
    entities = entities.map(e => e.id === id ? { ...e, ...patch, updatedAt: new Date().toISOString() } : e)
  },
  async focusSessions() { return sessions.map(s => ({ ...s })) },
  async saveFocus(entityId: string, startedAt: string, elapsedSeconds: number, outcome: FocusSession['outcome']) {
    if (!entities.some(e => e.id === entityId)) throw new Error('Select an existing task or topic.')
    const now = new Date().toISOString()
    sessions = [...sessions, { id: crypto.randomUUID(), ownerId, entityId, startedAt, endedAt: now, elapsedSeconds, outcome, createdAt: now, updatedAt: now }]
  },
}
