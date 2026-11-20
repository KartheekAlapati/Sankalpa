export const CONTENT_SCHEMA_VERSION = 4 as const
export const LEARNING_STATE_VERSION = 4 as const

export type LearningTrack = 'btech-cse' | 'gate-cs' | 'gate-da'
export type TopicStatus = 'not-started' | 'learning' | 'revising' | 'mastered'
export type ProgrammingLanguage = 'cpp' | 'python' | 'java' | 'javascript'
export interface WorkedExample { title: string; problem: string; walkthrough: string[]; result: string }
export interface PracticeExercise { id: string; title: string; prompt: string; difficulty: 'Easy' | 'Medium' | 'Hard'; hints: string[]; solution: string; explanation: string }
export interface Mcq { id: string; prompt: string; options: string[]; answer: number; explanation: string; difficulty?: 'Easy' | 'Medium' | 'Hard' }
export interface CodingQuestion { id: string; title: string; prompt: string; difficulty: 'Easy' | 'Medium' | 'Hard'; language: ProgrammingLanguage; starter: string; examples: Array<{ input: string; output: string }>; hints: string[]; referenceSolution: string }
export interface LearningResource { title: string; url: string; kind: 'drive-pdf' | 'web' }
export type ResourceType = 'pdf' | 'website' | 'documentation' | 'video' | 'textbook' | 'practice-platform' | 'question-paper' | 'pyq' | 'notes' | 'other'
export type ResourceAvailability = 'available' | 'unavailable' | 'unknown'
export interface EducationalResource { id: string; title: string; description: string; subjectId: string; moduleId?: string; topicIds: string[]; type: ResourceType; sourceUrl?: string; driveUrl?: string; localFileName?: string; localFileType?: 'application/pdf'; availability: ResourceAvailability; downloaded: boolean; verifiedAt?: string; copyright: string; license: string; tags: string[]; bookmarked: boolean; notes: string; createdAt: string; updatedAt: string }
export interface Lesson { id: string; title: string; durationMinutes: number; objectives: string[]; theory: string[]; examples: WorkedExample[] }
export interface AuthoredLesson extends Lesson { topicId: string; prerequisites: string[]; codeSnippets: string[]; dryRuns: string[]; externalReferences: string[]; status: 'draft' | 'published'; createdAt: string; updatedAt: string }
export interface Topic { id: string; title: string; summary: string; prerequisiteTopicIds?: string[]; crossLinkTopicIds?: string[]; lessons: Lesson[]; checklist: string[]; mcqs: Mcq[]; coding: CodingQuestion[]; resources: LearningResource[]; commonMistakes?: string[]; revisionGuidance?: string[]; practiceExercises?: PracticeExercise[] }
export interface SyllabusModule { id: string; title: string; description: string; topics: Topic[] }
export interface Subject { id: string; title: string; code: string; description: string; semester?: number; tracks: LearningTrack[]; modules: SyllabusModule[] }
export interface SyllabusCatalog { schemaVersion: typeof CONTENT_SCHEMA_VERSION; subjects: Subject[] }
export interface TopicProgress { status: TopicStatus; checked: string[]; completedLessons: string[]; note: string; mcqAttempts: number; mcqCorrect: number; revisedAt?: string; nextRevision?: string }
export type StudyTaskKind = 'theory' | 'practice' | 'coding' | 'revision'
export interface StudyPlanItem { id: string; topicId: string; date: string; minutes: number; done: boolean; kind?: StudyTaskKind; title?: string; source?: 'recommended' | 'manual'; createdAt?: string }
export interface PlannerSettings { dailyMinutes: number; subjectPriorities: Record<string, number> }
export type MistakeClassification = 'none' | 'concept' | 'boundary' | 'complexity' | 'syntax' | 'misread' | 'other'
export type ReviewStatus = 'open' | 'reviewed'
export interface AttemptBase { id: string; attemptedAt: string; topicId: string; questionId: string; attemptNumber: number; mistake: MistakeClassification; personalExplanation: string; reviewStatus: ReviewStatus }
export interface McqAttempt extends AttemptBase { kind: 'mcq'; selectedAnswer: number; correct: boolean }
export interface CodingAttempt extends AttemptBase { kind: 'coding'; submittedCode: string; language: ProgrammingLanguage; executionNotes: string; completionStatus: 'draft' | 'attempted' | 'completed' }
export type QuestionAttempt = McqAttempt | CodingAttempt
export interface RevisionTask { id: string; topicId: string; createdAt: string; dueDate: string; reason: 'incorrect-answer' | 'weak-topic' | 'manual' | 'topic-review'; status: ReviewStatus; completedAt?: string }
export interface StudyEvent { id: string; topicId: string; occurredAt: string; type: 'lesson-completed' | 'mcq-attempted' | 'coding-attempted' | 'review-completed' | 'today-task-created'; detail: string }
export interface LearningTaskLink { id: string; topicId: string; revisionId?: string; planItemId?: string; requestId: string; entityId?: string; createdAt: string; planDate: string; status: 'pending' | 'confirmed' }
export type AuthoredQuestionType = 'single-answer' | 'multiple-answer' | 'true-false' | 'code-output' | 'numerical' | 'short-answer' | 'coding'
export type AuthoringStatus = 'draft' | 'published' | 'archived'
export interface AuthoredQuestion { id: string; topicId: string; type: AuthoredQuestionType; difficulty: 'Easy' | 'Medium' | 'Hard'; statement: string; options: string[]; answer: string[]; explanation: string; hints: string[]; sourceTitle: string; sourceUrl?: string; status: AuthoringStatus; revision: number; createdAt: string; updatedAt: string }
export type PracticeMode = 'learn' | 'practice' | 'revision' | 'test'
export interface SessionSummary { answered: number; unanswered: number; correct?: number; scorePercent?: number; topicBreakdown?: Record<string, { attempted: number; correct: number }> }
export interface PracticeSession { id: string; createdAt: string; mode: PracticeMode; subjectId?: string; moduleId?: string; topicIds: string[]; questionIds: string[]; currentQuestionIndex: number; completedQuestionIds: string[]; answers: Record<string, number>; startedAt?: string; completedAt?: string; status: 'ready' | 'active' | 'completed'; summary?: SessionSummary }
export interface LearningState { version: typeof LEARNING_STATE_VERSION; progress: Record<string, TopicProgress>; plan: StudyPlanItem[]; plannerSettings: PlannerSettings; attempts: QuestionAttempt[]; revisions: RevisionTask[]; history: StudyEvent[]; taskLinks: LearningTaskLink[]; sessions: PracticeSession[]; resources: EducationalResource[]; authoredLessons: AuthoredLesson[]; authoredQuestions: AuthoredQuestion[] }
export interface QuestionFilter { subjectId?: string; moduleId?: string; topicId?: string; difficulty?: 'Easy' | 'Medium' | 'Hard'; weakTopics?: boolean; previouslyIncorrect?: boolean; neverAttempted?: boolean; dueRevision?: boolean }
export interface QuestionRef { id: string; subjectId: string; moduleId: string; topicId: string; difficulty: 'Easy' | 'Medium' | 'Hard'; question?: Mcq }
export interface LearningSearchResult { id: string; type: 'subject' | 'module' | 'topic' | 'lesson' | 'mcq' | 'coding'; title: string; context: string; subjectId: string; moduleId?: string; topicId?: string; lessonId?: string; questionId?: string }
