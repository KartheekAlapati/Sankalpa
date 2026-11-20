import type { AuthoredQuestion, LearningState } from './types'

export function validHttpUrl(value?: string) { if (!value) return true; try { const url=new URL(value); return url.protocol==='https:' || url.protocol==='http:' } catch { return false } }
export function validDriveUrl(value?: string) { if (!value) return true; try { const url=new URL(value); return url.protocol==='https:' && (url.hostname==='drive.google.com' || url.hostname==='docs.google.com') } catch { return false } }

export function questionErrors(question: Pick<AuthoredQuestion,'type'|'statement'|'options'|'answer'|'explanation'|'sourceUrl'>) {
  const errors:string[]=[]; if (!question.statement.trim()) errors.push('Problem statement is required.'); if (!question.explanation.trim()) errors.push('Explanation is required.'); if (!validHttpUrl(question.sourceUrl)) errors.push('Source URL must use HTTP or HTTPS.')
  if (question.type==='single-answer' && (question.options.length<2 || question.answer.length!==1 || !question.options.includes(question.answer[0]))) errors.push('A single-answer MCQ needs at least two options and exactly one matching answer.')
  if (question.type==='multiple-answer' && (question.options.length<2 || question.answer.length<1 || question.answer.some(answer=>!question.options.includes(answer)))) errors.push('A multiple-answer MCQ needs matching option answers.')
  if (question.type==='true-false' && (question.answer.length!==1 || !['True','False'].includes(question.answer[0]))) errors.push('True/false answer must be True or False.')
  if (!question.answer.length || question.answer.some(answer=>!answer.trim())) errors.push('At least one validated answer is required.')
  return errors
}

export function saveAuthoredQuestion(state: LearningState, question: AuthoredQuestion) {
  const errors=questionErrors(question); if (question.status==='published' && errors.length) throw new Error(errors.join(' ')); if (!validHttpUrl(question.sourceUrl)) throw new Error('Source URL must use HTTP or HTTPS.'); const existing=state.authoredQuestions.find(item=>item.id===question.id)
  if (existing && state.attempts.some(attempt=>attempt.questionId===existing.id)) { const oldGrade=JSON.stringify([existing.type,existing.statement,existing.options,existing.answer]); const newGrade=JSON.stringify([question.type,question.statement,question.options,question.answer]); if (oldGrade!==newGrade) throw new Error('This question has attempt history. Archive it and create a new question ID before changing its grading meaning.') }
  return { ...state, authoredQuestions: existing ? state.authoredQuestions.map(item=>item.id===question.id?{...question,revision:item.revision+1}:item) : [...state.authoredQuestions,question] }
}

export function publishedSingleMcqs(state: LearningState) { return state.authoredQuestions.filter(item=>item.status==='published' && item.type==='single-answer' && questionErrors(item).length===0).map(item=>({ id:item.id,prompt:item.statement,options:item.options,answer:item.options.indexOf(item.answer[0]),explanation:item.explanation,difficulty:item.difficulty })) }
