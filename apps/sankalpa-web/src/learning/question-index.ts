import { generatedQuestionIndex } from './curriculum/question-index.generated'
import { allTopicManifests, manifestSubjects } from './manifest'
import type { AuthoredQuestion, LearningState, Mcq } from './types'

export type IndexedQuestionType = 'mcq' | 'coding'
export interface QuestionIndexEntry {
  id: string
  topicId: string
  subjectId: string
  moduleId: string
  type: IndexedQuestionType
  difficulty: 'Easy' | 'Medium' | 'Hard'
  title?: string
  contentModule: string
}

export const builtInQuestionIndex = generatedQuestionIndex as readonly QuestionIndexEntry[]
const byId = new Map(builtInQuestionIndex.map(question => [question.id, question]))
const topicOwners = new Map(manifestSubjects.flatMap(subject => subject.modules.flatMap(module => module.topics.map(topic => [topic.id, { subjectId: subject.id, moduleId: module.id }] as const))))

export function getQuestionIndexEntry(questionId: string) { return byId.get(questionId) }
export function authoredMcq(question: AuthoredQuestion): Mcq | undefined {
  if (question.status !== 'published' || question.type !== 'single-answer' || question.answer.length !== 1) return undefined
  const answer = question.options.indexOf(question.answer[0])
  if (answer < 0) return undefined
  return { id: question.id, prompt: question.statement, options: question.options, answer, explanation: question.explanation, difficulty: question.difficulty }
}
export function questionIndex(state?: LearningState): QuestionIndexEntry[] {
  if (!state) return [...builtInQuestionIndex]
  const authored = state.authoredQuestions.flatMap(question => {
    if (!authoredMcq(question)) return []
    const owner = topicOwners.get(question.topicId)
    return owner ? [{ id: question.id, topicId: question.topicId, subjectId: owner.subjectId, moduleId: owner.moduleId, type: 'mcq' as const, difficulty: question.difficulty, contentModule: 'authored' }] : []
  })
  return [...builtInQuestionIndex, ...authored]
}

export function validateQuestionIndex() {
  const ids = builtInQuestionIndex.map(question => question.id)
  if (new Set(ids).size !== ids.length) throw new Error('Duplicate global question index ID.')
  const topics = new Map(allTopicManifests.map(topic => [topic.id, topic]))
  for (const question of builtInQuestionIndex) {
    const topic = topics.get(question.topicId)
    if (!topic) throw new Error(`Question ${question.id} has an unknown topic owner.`)
    const owned = question.type === 'mcq' ? topic.mcqIds : topic.codingIds
    if (!owned.includes(question.id)) throw new Error(`Question ${question.id} disagrees with its topic manifest.`)
    if (question.contentModule !== topic.contentModule) throw new Error(`Question ${question.id} has a stale content mapping.`)
  }
  const manifestIds = allTopicManifests.flatMap(topic => [...topic.mcqIds, ...topic.codingIds])
  if (manifestIds.length !== ids.length || manifestIds.some(id => !byId.has(id))) throw new Error('Global question index coverage differs from the curriculum manifest.')
  return true
}

validateQuestionIndex()
