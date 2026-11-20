import { LEARNING_STATE_VERSION } from './types'
import type { AuthoredLesson, AuthoredQuestion, CodingAttempt, EducationalResource, LearningState, McqAttempt, PracticeSession, QuestionAttempt, RevisionTask, StudyEvent, StudyPlanItem, TopicProgress, TopicStatus } from './types'
import { defaultPlannerSettings } from './planner'

export const learningStorageKey = 'sankalpa-learning-v4'
const previousStorageKeys = ['sankalpa-learning-v3', 'sankalpa-learning-v2']
const legacyStorageKey = 'sankalpa-learning-v1'
export const emptyLearningState = (): LearningState => ({ version: LEARNING_STATE_VERSION, progress: {}, plan: [], plannerSettings: defaultPlannerSettings(), attempts: [], revisions: [], history: [], taskLinks: [], sessions: [], resources: [], authoredLessons: [], authoredQuestions: [] })
const statuses: TopicStatus[] = ['not-started', 'learning', 'revising', 'mastered']
const mistakes = ['none', 'concept', 'boundary', 'complexity', 'syntax', 'misread', 'other']
const languages = ['cpp', 'python', 'java', 'javascript']
const isStringArray = (value: unknown): value is string[] => Array.isArray(value) && value.every(item => typeof item === 'string')
const optionalString = (value: unknown) => value === undefined || typeof value === 'string'
const date = (value: unknown) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
const timestamp = (value: unknown) => typeof value === 'string' && !Number.isNaN(Date.parse(value))
const uniqueIds = (items: Array<{ id: string }>) => new Set(items.map(item => item.id)).size === items.length
const optionalUrl = (value: unknown) => value === undefined || (typeof value === 'string' && /^https?:\/\//i.test(value))
export function defaultProgress(): TopicProgress { return { status: 'not-started', checked: [], completedLessons: [], note: '', mcqAttempts: 0, mcqCorrect: 0 } }

function validateProgress(value: unknown): value is TopicProgress {
  if (!value || typeof value !== 'object') return false
  const item = value as Partial<TopicProgress>
  return !!item.status && statuses.includes(item.status) && isStringArray(item.checked) && isStringArray(item.completedLessons) && typeof item.note === 'string' && item.note.length <= 10000
    && Number.isInteger(item.mcqAttempts) && item.mcqAttempts! >= 0 && Number.isInteger(item.mcqCorrect) && item.mcqCorrect! >= 0 && item.mcqCorrect! <= item.mcqAttempts!
    && optionalString(item.revisedAt) && optionalString(item.nextRevision)
}
function validatePlan(value: unknown): value is StudyPlanItem[] { return Array.isArray(value) && value.every(item => !!item && typeof item === 'object' && typeof item.id === 'string' && typeof item.topicId === 'string' && date(item.date) && Number.isInteger(item.minutes) && item.minutes > 0 && item.minutes <= 1440 && typeof item.done === 'boolean' && (item.kind === undefined || ['theory','practice','coding','revision'].includes(item.kind)) && optionalString(item.title) && (item.source === undefined || ['recommended','manual'].includes(item.source)) && (item.createdAt === undefined || timestamp(item.createdAt))) && uniqueIds(value) }
function validatePlannerSettings(value: unknown) { if (!value || typeof value !== 'object') return false; const item=value as LearningState['plannerSettings']; return Number.isInteger(item.dailyMinutes) && item.dailyMinutes>=60 && item.dailyMinutes<=720 && !!item.subjectPriorities && typeof item.subjectPriorities==='object' && !Array.isArray(item.subjectPriorities) && Object.values(item.subjectPriorities).every(priority=>Number.isInteger(priority)&&priority>=0&&priority<=3) }
function baseAttempt(value: unknown) {
  if (!value || typeof value !== 'object') return false
  const item = value as Partial<QuestionAttempt>
  return typeof item.id === 'string' && timestamp(item.attemptedAt) && typeof item.topicId === 'string' && typeof item.questionId === 'string' && Number.isInteger(item.attemptNumber) && item.attemptNumber! > 0 && mistakes.includes(item.mistake!) && typeof item.personalExplanation === 'string' && item.personalExplanation.length <= 5000 && ['open', 'reviewed'].includes(item.reviewStatus!)
}
function validateAttempt(value: unknown): value is QuestionAttempt {
  if (!baseAttempt(value)) return false
  const item = value as Partial<QuestionAttempt>
  if (item.kind === 'mcq') { const mcq = item as Partial<McqAttempt>; return Number.isInteger(mcq.selectedAnswer) && mcq.selectedAnswer! >= 0 && typeof mcq.correct === 'boolean' }
  if (item.kind === 'coding') { const coding = item as Partial<CodingAttempt>; return typeof coding.submittedCode === 'string' && coding.submittedCode.length <= 100000 && languages.includes(coding.language!) && typeof coding.executionNotes === 'string' && coding.executionNotes.length <= 10000 && ['draft', 'attempted', 'completed'].includes(coding.completionStatus!) }
  return false
}
function validateRevision(value: unknown): value is RevisionTask { if (!value || typeof value !== 'object') return false; const item = value as Partial<RevisionTask>; return typeof item.id === 'string' && typeof item.topicId === 'string' && timestamp(item.createdAt) && date(item.dueDate) && ['incorrect-answer', 'weak-topic', 'manual', 'topic-review'].includes(item.reason!) && ['open', 'reviewed'].includes(item.status!) && (item.completedAt === undefined || timestamp(item.completedAt)) }
function validateEvent(value: unknown): value is StudyEvent { if (!value || typeof value !== 'object') return false; const item = value as Partial<StudyEvent>; return typeof item.id === 'string' && typeof item.topicId === 'string' && timestamp(item.occurredAt) && ['lesson-completed', 'mcq-attempted', 'coding-attempted', 'review-completed', 'today-task-created'].includes(item.type!) && typeof item.detail === 'string' }
function validateSession(value: unknown): value is PracticeSession { if (!value || typeof value !== 'object') return false; const item = value as Partial<PracticeSession>; return typeof item.id === 'string' && timestamp(item.createdAt) && ['learn', 'practice', 'revision', 'test'].includes(item.mode!) && optionalString(item.subjectId) && optionalString(item.moduleId) && isStringArray(item.topicIds) && isStringArray(item.questionIds) && Number.isInteger(item.currentQuestionIndex) && item.currentQuestionIndex! >= 0 && item.currentQuestionIndex! <= Math.max(0, item.questionIds.length - 1) && isStringArray(item.completedQuestionIds) && !!item.answers && typeof item.answers === 'object' && !Array.isArray(item.answers) && Object.values(item.answers).every(answer => Number.isInteger(answer) && answer >= 0) && optionalString(item.startedAt) && optionalString(item.completedAt) && ['ready', 'active', 'completed'].includes(item.status!) }
function validateResource(value: unknown): value is EducationalResource { if (!value || typeof value !== 'object') return false; const item=value as Partial<EducationalResource>; return typeof item.id==='string' && typeof item.title==='string' && item.title.length>0 && item.title.length<=500 && typeof item.description==='string' && typeof item.subjectId==='string' && optionalString(item.moduleId) && isStringArray(item.topicIds) && ['pdf','website','documentation','video','textbook','practice-platform','question-paper','pyq','notes','other'].includes(item.type!) && optionalUrl(item.sourceUrl) && optionalUrl(item.driveUrl) && optionalString(item.localFileName) && (item.localFileType===undefined || item.localFileType==='application/pdf') && ['available','unavailable','unknown'].includes(item.availability!) && typeof item.downloaded==='boolean' && (item.verifiedAt===undefined || date(item.verifiedAt)) && typeof item.copyright==='string' && typeof item.license==='string' && isStringArray(item.tags) && typeof item.bookmarked==='boolean' && typeof item.notes==='string' && timestamp(item.createdAt) && timestamp(item.updatedAt) }
function validateAuthoredLesson(value: unknown): value is AuthoredLesson { if (!value || typeof value !== 'object') return false; const item=value as Partial<AuthoredLesson>; return typeof item.id==='string' && typeof item.topicId==='string' && typeof item.title==='string' && item.title.length>0 && Number.isInteger(item.durationMinutes) && item.durationMinutes!>0 && item.durationMinutes!<=600 && isStringArray(item.objectives) && isStringArray(item.theory) && Array.isArray(item.examples) && item.examples.every(example=>!!example&&typeof example.title==='string'&&typeof example.problem==='string'&&isStringArray(example.walkthrough)&&typeof example.result==='string') && isStringArray(item.prerequisites) && isStringArray(item.codeSnippets) && isStringArray(item.dryRuns) && isStringArray(item.externalReferences) && item.externalReferences.every(optionalUrl) && ['draft','published'].includes(item.status!) && timestamp(item.createdAt) && timestamp(item.updatedAt) }
function validateAuthoredQuestion(value: unknown): value is AuthoredQuestion { if (!value || typeof value !== 'object') return false; const item=value as Partial<AuthoredQuestion>; const structurallyValid=typeof item.id==='string' && typeof item.topicId==='string' && ['single-answer','multiple-answer','true-false','code-output','numerical','short-answer','coding'].includes(item.type!) && ['Easy','Medium','Hard'].includes(item.difficulty!) && typeof item.statement==='string' && isStringArray(item.options) && isStringArray(item.answer) && typeof item.explanation==='string' && isStringArray(item.hints) && typeof item.sourceTitle==='string' && optionalUrl(item.sourceUrl) && ['draft','published','archived'].includes(item.status!) && Number.isInteger(item.revision) && item.revision!>0 && timestamp(item.createdAt) && timestamp(item.updatedAt); if(!structurallyValid)return false; if(item.status!=='published')return true; if(!item.statement!.trim()||!item.explanation!.trim()||!item.answer!.length)return false; if(item.type==='single-answer')return item.options!.length>=2&&item.answer!.length===1&&item.options!.includes(item.answer![0]); if(item.type==='multiple-answer')return item.options!.length>=2&&item.answer!.every(answer=>item.options!.includes(answer)); if(item.type==='true-false')return item.answer!.length===1&&['True','False'].includes(item.answer![0]); return true }

export function validateLearningState(value: unknown): LearningState {
  if (!value || typeof value !== 'object') throw new Error('This is not a supported Sankalpa Learning OS export.')
  const candidate = value as Partial<LearningState>
  if (candidate.version !== LEARNING_STATE_VERSION || !candidate.progress || typeof candidate.progress !== 'object' || Array.isArray(candidate.progress) || !validatePlan(candidate.plan) || !Array.isArray(candidate.attempts) || !Array.isArray(candidate.revisions) || !Array.isArray(candidate.history) || !Array.isArray(candidate.taskLinks) || !Array.isArray(candidate.sessions)) throw new Error('This is not a supported Sankalpa Learning OS export.')
  const resources = candidate.resources ?? []; const authoredLessons = candidate.authoredLessons ?? []; const authoredQuestions = candidate.authoredQuestions ?? []
  if (!Object.keys(candidate.progress).every(key => key.length > 0 && validateProgress(candidate.progress![key]))) throw new Error('The learning export contains invalid topic progress.')
  if (!candidate.attempts.every(validateAttempt) || !uniqueIds(candidate.attempts)) throw new Error('The learning export contains invalid or duplicate attempts.')
  if (!candidate.revisions.every(validateRevision) || !uniqueIds(candidate.revisions)) throw new Error('The learning export contains invalid or duplicate revisions.')
  if (!candidate.history.every(validateEvent) || !uniqueIds(candidate.history)) throw new Error('The learning export contains invalid or duplicate study history.')
  if (!candidate.taskLinks.every(item => !!item && typeof item.id === 'string' && typeof item.topicId === 'string' && typeof item.requestId === 'string' && optionalString(item.entityId) && timestamp(item.createdAt) && date(item.planDate) && optionalString(item.revisionId) && optionalString(item.planItemId) && ['pending', 'confirmed'].includes(item.status) && (item.status !== 'confirmed' || typeof item.entityId === 'string')) || !uniqueIds(candidate.taskLinks) || new Set(candidate.taskLinks.map(item => item.requestId)).size !== candidate.taskLinks.length) throw new Error('The learning export contains invalid or duplicate task links.')
  if (!candidate.sessions.every(validateSession) || !uniqueIds(candidate.sessions)) throw new Error('The learning export contains invalid or duplicate practice sessions.')
  if (!Array.isArray(resources) || !resources.every(validateResource) || !uniqueIds(resources)) throw new Error('The learning export contains invalid or duplicate resources.')
  if (!Array.isArray(authoredLessons) || !authoredLessons.every(validateAuthoredLesson) || !uniqueIds(authoredLessons)) throw new Error('The learning export contains invalid or duplicate authored lessons.')
  if (!Array.isArray(authoredQuestions) || !authoredQuestions.every(validateAuthoredQuestion) || !uniqueIds(authoredQuestions)) throw new Error('The learning export contains invalid or duplicate authored questions.')
  const plannerSettings = candidate.plannerSettings ?? defaultPlannerSettings()
  if (!validatePlannerSettings(plannerSettings)) throw new Error('The learning export contains invalid planner settings.')
  return { ...candidate, plannerSettings, resources, authoredLessons, authoredQuestions } as LearningState
}

function migrateOlder(value: unknown): LearningState | null {
  if (!value || typeof value !== 'object' || ![1, 2, 3].includes((value as { version?: number }).version ?? 0)) return null
  const source = value as Partial<LearningState> & { progress?: Record<string, Partial<TopicProgress>>; plan?: unknown }
  if (!source.progress || typeof source.progress !== 'object' || !validatePlan(source.plan)) return null
  const progress = Object.fromEntries(Object.entries(source.progress).map(([id, item]) => [id, { ...defaultProgress(), ...item, completedLessons: item.completedLessons ?? [] }]))
  try { return validateLearningState({ ...emptyLearningState(), progress, plan: source.plan, attempts: source.attempts ?? [], revisions: source.revisions ?? [], history: source.history ?? [], taskLinks: source.taskLinks ?? [] }) } catch { return null }
}
export function loadLearningState(): LearningState {
  try {
    const current = localStorage.getItem(learningStorageKey); if (current) return validateLearningState(JSON.parse(current))
    for (const key of [...previousStorageKeys, legacyStorageKey]) { const migrated = migrateOlder(JSON.parse(localStorage.getItem(key) ?? 'null')); if (migrated) { saveLearningState(migrated); return migrated } }
  } catch { /* Corrupt device state is isolated to this feature. */ }
  return emptyLearningState()
}
export function saveLearningState(value: LearningState) { localStorage.setItem(learningStorageKey, JSON.stringify(validateLearningState(value))) }
export function serializeLearningState(state: LearningState, exportedAt = new Date().toISOString()) { return JSON.stringify({ kind: 'sankalpa-learning-export', exportedAt, state: validateLearningState(state) }, null, 2) }
export function serializeEducationalContent(state: LearningState, exportedAt = new Date().toISOString()) { const valid=validateLearningState(state); return JSON.stringify({ kind:'sankalpa-educational-content-export', exportedAt, version:LEARNING_STATE_VERSION, resources:valid.resources, authoredLessons:valid.authoredLessons, authoredQuestions:valid.authoredQuestions },null,2) }
export function parseLearningImport(value: unknown): LearningState {
  if (!value || typeof value !== 'object' || (value as { kind?: unknown }).kind !== 'sankalpa-learning-export') throw new Error('Choose a Sankalpa Learning OS JSON export.')
  const state = (value as { state?: unknown }).state
  if (state && typeof state === 'object' && [1, 2, 3].includes((state as { version?: number }).version ?? 0)) {
    if ((state as { version?: number }).version === 3) { const attempts = (state as { attempts?: Array<{ id?: string }> }).attempts; if (Array.isArray(attempts) && new Set(attempts.map(item => item.id)).size !== attempts.length) throw new Error('The learning export contains invalid or duplicate attempts.') }
    const migrated = migrateOlder(state); if (migrated) return migrated
    throw new Error('The learning export contains invalid topic progress.')
  }
  return validateLearningState(state)
}
export function downloadLearningState(state: LearningState) { const blob = new Blob([serializeLearningState(state)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `sankalpa-learning-${new Date().toISOString().slice(0, 10)}.json`; link.click(); URL.revokeObjectURL(url) }
export function downloadEducationalContent(state: LearningState) { const blob=new Blob([serializeEducationalContent(state)],{type:'application/json'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=`sankalpa-educational-content-${new Date().toISOString().slice(0,10)}.json`;link.click();URL.revokeObjectURL(url) }
