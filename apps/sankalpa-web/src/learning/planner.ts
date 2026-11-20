import { allTopicManifests, manifestSubjects } from './manifest'
import { localDate, revisionBuckets, weakTopicIds } from './engine'
import type { LearningState, PlannerSettings, StudyPlanItem, StudyTaskKind } from './types'

export const defaultPlannerSettings = (): PlannerSettings => ({ dailyMinutes: 270, subjectPriorities: { cpp: 3, backend: 2, 'engineering-math': 2 } })
const topicSubject = (topicId: string) => manifestSubjects.find(subject => subject.modules.some(module => module.topics.some(topic => topic.id === topicId)))
const key = (item: Pick<StudyPlanItem,'date'|'topicId'|'kind'>) => `${item.date}|${item.topicId}|${item.kind ?? 'theory'}`

export function generateStudyPlan(state: LearningState, date = localDate(), id: () => string = () => crypto.randomUUID(), createdAt = new Date().toISOString()): StudyPlanItem[] {
  const settings = state.plannerSettings ?? defaultPlannerSettings(); const existing = new Set(state.plan.map(key)); const weak = new Set(weakTopicIds(state)); const candidates: Array<{ topicId: string; kind: StudyTaskKind; score: number; title: string }> = []
  for (const revision of [...revisionBuckets(state.revisions, date).overdue, ...revisionBuckets(state.revisions, date).dueToday]) candidates.push({ topicId: revision.topicId, kind:'revision', score:100, title:`Review ${allTopicManifests.find(topic => topic.id === revision.topicId)?.title ?? revision.topicId}` })
  for (const subject of manifestSubjects) { const priority = settings.subjectPriorities[subject.id] ?? 0; if (!priority) continue; for (const module of subject.modules) for (const topic of module.topics) { if (topic.maturity === 'outline') continue; const progress = state.progress[topic.id]; const base = priority * 10 + (weak.has(topic.id) ? 30 : 0); if (!progress?.completedLessons.length) candidates.push({topicId:topic.id,kind:'theory',score:base+3,title:`Learn ${topic.title}`}); if (topic.mcqIds.length) candidates.push({topicId:topic.id,kind:'practice',score:base+2,title:`Practice ${topic.title}`}); if (topic.codingIds.length) candidates.push({topicId:topic.id,kind:'coding',score:base+1,title:`Code ${topic.title}`}) } }
  const unique = new Map<string, typeof candidates[number]>(); for (const candidate of candidates) { const candidateKey = `${candidate.topicId}|${candidate.kind}`; if (!unique.has(candidateKey) || unique.get(candidateKey)!.score < candidate.score) unique.set(candidateKey,candidate) }
  let remaining = Math.max(0, settings.dailyMinutes - planMinutes(state.plan, date)); const result: StudyPlanItem[] = []; for (const candidate of [...unique.values()].sort((a,b) => b.score-a.score || a.topicId.localeCompare(b.topicId) || a.kind.localeCompare(b.kind))) { const minutes = candidate.kind === 'revision' ? 30 : candidate.kind === 'coding' ? 60 : 45; const identity = `${date}|${candidate.topicId}|${candidate.kind}`; if (existing.has(identity) || minutes > remaining) continue; result.push({id:id(),topicId:candidate.topicId,date,minutes,done:false,kind:candidate.kind,title:candidate.title,source:'recommended',createdAt}); remaining -= minutes; if (remaining < 30) break }
  return result
}

export function planMinutes(items: StudyPlanItem[], date: string) { return items.filter(item => item.date === date).reduce((sum,item) => sum + item.minutes,0) }
export function subjectForTopic(topicId: string) { return topicSubject(topicId) }
