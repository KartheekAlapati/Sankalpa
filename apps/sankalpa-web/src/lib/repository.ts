import { permanentRepository, today as permanentToday } from './permanent-repository'
import { repository as previewRepository, today as previewToday } from './preview-repository'
import { previewMode } from './mode'

// Explicit development choice; save/configuration failures never select memory.
export const repository: typeof permanentRepository = previewMode ? {
  ...permanentRepository, ...previewRepository,
  async startFocus() { return { id: crypto.randomUUID(), startedAt: new Date().toISOString() } },
} : permanentRepository
export const today = previewMode ? previewToday : permanentToday
