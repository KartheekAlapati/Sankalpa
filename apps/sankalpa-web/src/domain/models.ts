export type UUID = string
export type ISODate = string
export type CaptureKind = 'inbox' | 'task' | 'note' | 'idea' | 'link' | 'reminder'
export type LifeArea = 'learning' | 'career' | 'fitness' | 'health' | 'finances' | 'spirituality' | 'personal'
export interface OwnedRecord { id: UUID; ownerId: UUID; createdAt: string; updatedAt: string }
// One canonical entity is reclassified in place; a task/note is never duplicated on processing.
export interface Entity extends OwnedRecord {
  title: string; kind: CaptureKind; body: string; area?: LifeArea; projectId?: UUID
  scheduledDate?: ISODate; completedAt?: string; estimateMinutes?: number
}
export interface Project extends OwnedRecord { title: string; area: LifeArea; status: 'active' | 'paused' | 'complete'; goalId?: UUID }
export interface Goal extends OwnedRecord { title: string; targetDate?: ISODate; area: LifeArea }
export interface Mission extends OwnedRecord { title: string; projectId: UUID; status: 'planned' | 'active' | 'complete' }
export interface Relationship extends OwnedRecord { sourceId: UUID; targetId: UUID; type: 'related' | 'supports' | 'references' | 'depends_on' }
export interface DailyPlan extends OwnedRecord { date: ISODate; priorityIds: UUID[]; capacityMinutes: number; sankalp?: string }
export interface FocusSession extends OwnedRecord { entityId: UUID; startedAt: string; endedAt: string; elapsedSeconds: number; outcome: 'complete' | 'stopped' }
export interface Habit extends OwnedRecord { title: string; area: LifeArea; cadence: 'daily' | 'weekly'; sensitive: boolean }
export interface HabitEntry extends OwnedRecord { habitId: UUID; date: ISODate; value: boolean }
export interface JournalEntry extends OwnedRecord { date: ISODate; body: string; sensitive: boolean }
export interface FileRecord extends OwnedRecord { entityId: UUID; storagePath: string; mimeType: string; bytes: number }
export interface Review extends OwnedRecord { periodStart: ISODate; periodEnd: ISODate; reflection: string }
export interface Milestone extends OwnedRecord { title: string; occurredOn: ISODate; entityId?: UUID }
export interface CalendarEvent extends OwnedRecord { title: string; startsAt: string; endsAt: string; entityId?: UUID; source: 'manual' | 'google' }
export interface IraGrant extends OwnedRecord { scopes: Array<'entities:read' | 'entities:write' | 'plans:read'>; expiresAt: string; revokedAt?: string }
