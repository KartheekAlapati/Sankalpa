import { getTopicManifest } from './manifest'
import { generatedContentLoaders } from './curriculum/topic-loaders.generated'
import type { AuthoredQuestion, Mcq, Topic } from './types'

type ContentModule = Record<string, unknown>
const topicCache = new Map<string, Topic>()
const pendingTopics = new Map<string, Promise<Topic>>()
const pendingModules = new Map<string, Promise<ContentModule>>()

const isTopic = (value: unknown): value is Topic => !!value && typeof value === 'object' && typeof (value as Topic).id === 'string' && Array.isArray((value as Topic).lessons) && Array.isArray((value as Topic).mcqs) && Array.isArray((value as Topic).coding)
const outlineTopic = (topic: NonNullable<ReturnType<typeof getTopicManifest>>): Topic => ({
  id: topic.id, title: topic.title, summary: topic.summary,
  prerequisiteTopicIds: topic.prerequisiteTopicIds, crossLinkTopicIds: topic.crossLinkTopicIds,
  lessons: topic.lessons.map(lesson => ({ id: lesson.id, title: lesson.title, durationMinutes: 10, objectives: [`Identify what ${topic.title} covers and when to study it`], theory: ['This is an outline-only roadmap entry. It is not marked as complete reviewed curriculum.'], examples: [] })),
  checklist: [`I can identify the prerequisites for ${topic.title}.`], mcqs: [], coding: [], resources: [],
})

async function loadModule(moduleId: string): Promise<ContentModule> {
  const pending = pendingModules.get(moduleId); if (pending) return pending
  const loader = generatedContentLoaders[moduleId]
  if (!loader) throw new Error(`Content module “${moduleId}” is unavailable. The application may need to be refreshed after an update.`)
  const request = loader().catch(error => { pendingModules.delete(moduleId); throw error })
  pendingModules.set(moduleId, request)
  return request
}

export function getCachedTopicContent(topicId: string) { return topicCache.get(topicId) }

export function loadTopicContent(topicId: string): Promise<Topic> {
  const cached = topicCache.get(topicId); if (cached) return Promise.resolve(cached)
  const manifest = getTopicManifest(topicId)
  if (!manifest) return Promise.reject(new Error(`Unknown learning topic “${topicId}”.`))
  if (manifest.contentModule === 'outline') {
    const topic = outlineTopic(manifest); topicCache.set(topicId, topic); return Promise.resolve(topic)
  }
  const pending = pendingTopics.get(topicId); if (pending) return pending
  const request = loadModule(manifest.contentModule).then(module => {
    const legacy = 'generatedLegacyTopics' in module ? (module.generatedLegacyTopics as Record<string, Topic>)[topicId] : undefined
    const topic: Topic | undefined = legacy ?? Object.values(module).find((value): value is Topic => isTopic(value) && value.id === topicId)
    if (!topic) throw new Error(`Content module did not provide topic “${topicId}”.`)
    topicCache.set(topicId, topic); return topic
  }).finally(() => pendingTopics.delete(topicId))
  pendingTopics.set(topicId, request); return request
}

export function preloadTopicContent(topicId: string) { return loadTopicContent(topicId).then(() => undefined) }
export async function loadTopicContents(topicIds: Iterable<string>) { return Promise.all([...new Set(topicIds)].map(loadTopicContent)) }
export async function hydrateMcqs(questionIds: Iterable<string>, authoredQuestions: AuthoredQuestion[] = []) {
  const { authoredMcq, getQuestionIndexEntry } = await import('./question-index')
  const ids = [...new Set(questionIds)]
  const authored = new Map(authoredQuestions.flatMap(question => { const mcq = authoredMcq(question); return mcq ? [[mcq.id, mcq] as const] : [] }))
  const topicIds = ids.flatMap(id => { const entry = getQuestionIndexEntry(id); return entry?.type === 'mcq' ? [entry.topicId] : [] })
  const topics = await loadTopicContents(topicIds)
  const builtIn = new Map(topics.flatMap(topic => topic.mcqs.map(question => [question.id, question] as const)))
  return new Map(ids.flatMap(id => { const question: Mcq | undefined = authored.get(id) ?? builtIn.get(id); return question ? [[id, question] as const] : [] }))
}
