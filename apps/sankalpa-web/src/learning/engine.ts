import type { LearningState, QuestionAttempt, RevisionTask } from './types'
import { allTopicManifests, manifestSubjects } from './manifest'
import { questionIndex } from './question-index'

export const REVISION_ALGORITHM = 'Incorrect answers: 1 day. Correct/reviewed work: 3, 7, 14, then 30 days based on completed reviews. Manual dates are used exactly. This is a deterministic planning aid, not a scientifically optimal schedule.'
export const localDate = (value = new Date()) => value.toLocaleDateString('en-CA')
export const addDays = (date: string, count: number) => { const value = new Date(`${date}T12:00:00`); value.setDate(value.getDate() + count); return localDate(value) }

export function nextRevisionDate(state: LearningState, topicId: string, correct: boolean, fromDate = localDate()) {
  if (!correct) return addDays(fromDate, 1)
  const completed = state.revisions.filter(item => item.topicId === topicId && item.status === 'reviewed').length
  return addDays(fromDate, [3, 7, 14, 30][Math.min(completed, 3)])
}

export function revisionBuckets(revisions: RevisionTask[], date = localDate()) {
  const open = revisions.filter(item => item.status === 'open')
  return {
    overdue: open.filter(item => item.dueDate < date),
    dueToday: open.filter(item => item.dueDate === date),
    upcoming: open.filter(item => item.dueDate > date),
    completed: revisions.filter(item => item.status === 'reviewed'),
  }
}

export function topicAccuracy(attempts: QuestionAttempt[], topicId: string) {
  const gradable = attempts.filter(item => item.topicId === topicId && item.kind === 'mcq')
  return gradable.length ? gradable.filter(item => item.kind === 'mcq' && item.correct).length / gradable.length : null
}

export function weakTopicIds(state: LearningState) {
  const ids = new Set(state.attempts.map(item => item.topicId))
  return [...ids].filter(id => { const attempts = state.attempts.filter(item => item.topicId === id && item.kind === 'mcq'); const accuracy = topicAccuracy(state.attempts, id); return attempts.length >= 2 && accuracy !== null && accuracy < 0.6 })
}

export function progressMetrics(state: LearningState, date = localDate()) {
  const mcq = state.attempts.filter(item => item.kind === 'mcq')
  const correct = mcq.filter(item => item.kind === 'mcq' && item.correct).length
  const completedCoding = new Set(state.attempts.filter(item => item.kind === 'coding' && item.completionStatus === 'completed').map(item => item.questionId)).size
  return {
    lessonsCompleted: Object.values(state.progress).reduce((sum, item) => sum + item.completedLessons.length, 0),
    questionsAttempted: new Set(state.attempts.map(item => item.questionId)).size,
    totalAttempts: state.attempts.length,
    accuracy: mcq.length ? Math.round((correct / mcq.length) * 100) : null,
    codingCompleted: completedCoding,
    weakTopics: weakTopicIds(state).length,
    revisionsDue: revisionBuckets(state.revisions, date).overdue.length + revisionBuckets(state.revisions, date).dueToday.length,
    studyEvents: state.history.length,
  }
}

export function analyticsV2(state: LearningState, date = localDate()) {
  const mcq = state.attempts.filter(item => item.kind === 'mcq'); const first = [...mcq].sort((a, b) => a.attemptedAt.localeCompare(b.attemptedAt)).filter((item, index, all) => all.findIndex(other => other.questionId === item.questionId) === index)
  const codingTotal = questionIndex(state).filter(question => question.type === 'coding').length
  const codingDone = new Set(state.attempts.filter(item => item.kind === 'coding' && item.completionStatus === 'completed').map(item => item.questionId)).size
  const reviewed = state.revisions.filter(item => item.status === 'reviewed'); const successfulReviews = reviewed.filter(review => { const after = state.attempts.filter((item): item is Extract<QuestionAttempt, { kind: 'mcq' }> => item.topicId === review.topicId && item.kind === 'mcq' && item.attemptedAt >= (review.completedAt ?? review.createdAt)); return after.at(-1)?.correct === true }).length
  const completion = manifestSubjects.map(subject => ({ subjectId: subject.id, title: subject.title, percent: percent(subject.modules.flatMap(module => module.topics.flatMap(topic => topic.lessons.map(lesson => state.progress[topic.id]?.completedLessons.includes(lesson.id) ?? false)))), modules: subject.modules.map(module => ({ moduleId: module.id, title: module.title, percent: percent(module.topics.flatMap(topic => topic.lessons.map(lesson => state.progress[topic.id]?.completedLessons.includes(lesson.id) ?? false))) })) }))
  return { subjectCompletion: completion, firstAttemptAccuracy: ratio(first.filter(item => item.correct).length, first.length), overallAccuracy: ratio(mcq.filter(item => item.correct).length, mcq.length), revisionSuccessRate: ratio(successfulReviews, reviewed.length), codingCompletion: ratio(codingDone, codingTotal), revisionBacklog: revisionBuckets(state.revisions, date).overdue.length + revisionBuckets(state.revisions, date).dueToday.length, unresolvedMistakes: mcq.filter(item => !item.correct && item.reviewStatus === 'open').length, sessionHistory: state.sessions.filter(item => item.status === 'completed') }
}
const ratio = (part: number, total: number) => total ? Math.round(part / total * 100) : null
const percent = (values: boolean[]) => values.length ? Math.round(values.filter(Boolean).length / values.length * 100) : 0
export function mistakeNotebook(state: LearningState) { const index = new Map(questionIndex(state).map(item => [item.id, item])); return state.attempts.filter((item): item is Extract<QuestionAttempt, { kind: 'mcq' }> => item.kind === 'mcq' && !item.correct).map(item => ({ ...item, questionMeta: index.get(item.questionId) })) }
export function codingDashboard(state: LearningState) {
  const topics = new Map(allTopicManifests.map(topic => [topic.id, topic]))
  const subjects = new Map(manifestSubjects.map(subject => [subject.id, subject]))
  return questionIndex(state).filter(question => question.type === 'coding').map(question => {
    const attempts = state.attempts.filter(item => item.kind === 'coding' && item.questionId === question.id); const latest = attempts.at(-1)
    return { subject: subjects.get(question.subjectId)?.title ?? question.subjectId, topic: topics.get(question.topicId)?.title ?? question.topicId, topicId: question.topicId, question: { id: question.id, title: question.title ?? question.id, difficulty: question.difficulty }, attempts: attempts.length, latest, category: !latest ? 'not-started' : latest.kind === 'coding' ? latest.completionStatus : 'not-started', solutionNote: latest?.personalExplanation ? 'added' : 'missing' }
  })
}
