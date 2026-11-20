import { localDate, weakTopicIds } from './engine'
import { allTopicManifests, manifestSubjects } from './manifest'
import { authoredMcq, questionIndex } from './question-index'
import type { LearningSearchResult, LearningState, QuestionFilter, QuestionRef } from './types'

export const questionBank = (state?: LearningState): QuestionRef[] => questionIndex(state).filter(item => item.type === 'mcq').map(item => ({
  id: item.id, subjectId: item.subjectId, moduleId: item.moduleId, topicId: item.topicId, difficulty: item.difficulty,
  question: state ? state.authoredQuestions.map(authoredMcq).find(question => question?.id === item.id) : undefined,
}))
export function seededOrder<T extends { id: string }>(items: T[], seed: number) { return [...items].sort((a, b) => hash(`${seed}:${a.id}`) - hash(`${seed}:${b.id}`) || a.id.localeCompare(b.id)) }
function hash(value: string) { let result = 2166136261; for (const char of value) { result ^= char.charCodeAt(0); result = Math.imul(result, 16777619) } return result >>> 0 }
export function selectQuestions(state: LearningState, filter: QuestionFilter, count = Number.MAX_SAFE_INTEGER, seed = 1) {
  const weak = new Set(weakTopicIds(state)); const attempted = new Set(state.attempts.filter(item => item.kind === 'mcq').map(item => item.questionId)); const incorrect = new Set(state.attempts.filter(item => item.kind === 'mcq' && !item.correct).map(item => item.questionId)); const due = new Set(state.revisions.filter(item => item.status === 'open' && item.dueDate <= localDate()).map(item => item.topicId))
  return seededOrder(questionBank(state).filter(item => (!filter.subjectId || item.subjectId === filter.subjectId) && (!filter.moduleId || item.moduleId === filter.moduleId) && (!filter.topicId || item.topicId === filter.topicId) && (!filter.difficulty || item.difficulty === filter.difficulty) && (!filter.weakTopics || weak.has(item.topicId)) && (!filter.previouslyIncorrect || incorrect.has(item.id)) && (!filter.neverAttempted || !attempted.has(item.id)) && (!filter.dueRevision || due.has(item.topicId))), seed).slice(0, count)
}
export function searchLearning(query: string): LearningSearchResult[] {
  const term = query.trim().toLowerCase(); if (!term) return []
  const out: LearningSearchResult[] = []
  for (const subject of manifestSubjects) {
    if (`${subject.title} ${subject.code}`.toLowerCase().includes(term)) out.push({ id: subject.id, type: 'subject', title: subject.title, context: subject.code, subjectId: subject.id })
    for (const module of subject.modules) {
      if (`${module.title} ${module.description}`.toLowerCase().includes(term)) out.push({ id: module.id, type: 'module', title: module.title, context: subject.title, subjectId: subject.id, moduleId: module.id })
      for (const topic of module.topics) {
        if (`${topic.title} ${topic.summary}`.toLowerCase().includes(term)) out.push({ id: topic.id, type: 'topic', title: topic.title, context: `${subject.title} · ${module.title}`, subjectId: subject.id, moduleId: module.id, topicId: topic.id })
        for (const lesson of topic.lessons) if (lesson.title.toLowerCase().includes(term)) out.push({ id: lesson.id, type: 'lesson', title: lesson.title, context: topic.title, subjectId: subject.id, moduleId: module.id, topicId: topic.id, lessonId: lesson.id })
      }
    }
  }
  for (const question of questionIndex()) if (question.type === 'coding' && question.title?.toLowerCase().includes(term)) {
    const topic = allTopicManifests.find(item => item.id === question.topicId)
    out.push({ id: question.id, type: 'coding', title: question.title, context: topic?.title ?? question.topicId, subjectId: question.subjectId, moduleId: question.moduleId, topicId: question.topicId, questionId: question.id })
  }
  return out
}
