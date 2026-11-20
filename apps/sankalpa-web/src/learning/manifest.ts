import { generatedLearningManifest } from './curriculum/manifest.generated'
import type { LearningTrack } from './types'

export type ContentMaturity = 'outline' | 'study-ready'
export interface LessonManifest { id: string; title: string }
export interface TopicManifest { id: string; title: string; summary: string; prerequisiteTopicIds: string[]; crossLinkTopicIds: string[]; maturity: ContentMaturity; contentModule: string; lessons: LessonManifest[]; mcqIds: string[]; codingIds: string[] }
export interface ModuleManifest { id: string; title: string; description: string; topics: TopicManifest[] }
export interface SubjectManifest { id: string; title: string; code: string; description: string; semester?: number; tracks: LearningTrack[]; modules: ModuleManifest[] }
export interface TrackManifest { id: LearningTrack; title: string; subtitle: string }
export interface LearningManifest { schemaVersion: 4; generatedFrom: string; tracks: TrackManifest[]; subjects: SubjectManifest[] }

export const learningManifest = generatedLearningManifest as unknown as LearningManifest
export const manifestSubjects = learningManifest.subjects
export const manifestTracks = learningManifest.tracks
export const allTopicManifests = manifestSubjects.flatMap(subject => subject.modules.flatMap(module => module.topics))
const topicIndex = new Map(allTopicManifests.map(topic => [topic.id, topic]))
const subjectIndex = new Map(manifestSubjects.map(subject => [subject.id, subject]))

export function getTopicManifest(topicId: string) { return topicIndex.get(topicId) }
export function getSubjectManifest(subjectId: string) { return subjectIndex.get(subjectId) }
export function subjectForManifestTopic(topicId: string) { return manifestSubjects.find(subject => subject.modules.some(module => module.topics.some(topic => topic.id === topicId))) }
export function moduleForManifestTopic(topicId: string) { return manifestSubjects.flatMap(subject => subject.modules).find(module => module.topics.some(topic => topic.id === topicId)) }

export function validateLearningManifest(manifest: LearningManifest = learningManifest) {
  if (manifest.schemaVersion !== 4) throw new Error('Learning manifest schema must remain version 4.')
  const subjectIds = manifest.subjects.map(subject => subject.id); if (new Set(subjectIds).size !== subjectIds.length) throw new Error('Duplicate manifest subject ID.')
  const moduleIds = manifest.subjects.flatMap(subject => subject.modules.map(module => module.id)); if (new Set(moduleIds).size !== moduleIds.length) throw new Error('Duplicate manifest module ID.')
  const topics = manifest.subjects.flatMap(subject => subject.modules.flatMap(module => module.topics)); const ids = topics.map(topic => topic.id); const known = new Set(ids)
  if (known.size !== ids.length) throw new Error('Duplicate manifest topic ID.')
  for (const topic of topics) {
    if (!['outline', 'study-ready'].includes(topic.maturity)) throw new Error(`Invalid maturity for ${topic.id}.`)
    if (!topic.contentModule) throw new Error(`Missing content mapping for ${topic.id}.`)
    for (const linked of [...topic.prerequisiteTopicIds, ...topic.crossLinkTopicIds]) if (!known.has(linked)) throw new Error(`Unknown topic link ${topic.id}->${linked}.`)
    if (topic.maturity === 'outline' && (topic.mcqIds.length || topic.codingIds.length)) throw new Error(`Outline ${topic.id} contains graded content metadata.`)
  }
  const lessonIds = topics.flatMap(topic => topic.lessons.map(lesson => lesson.id))
  const questionIds = topics.flatMap(topic => [...topic.mcqIds, ...topic.codingIds])
  if (new Set(lessonIds).size !== lessonIds.length) throw new Error('Duplicate manifest lesson ID.')
  if (new Set(questionIds).size !== questionIds.length) throw new Error('Duplicate manifest question ID.')
  const active = new Set<string>(), done = new Set<string>()
  const visit = (id: string) => { if (active.has(id)) throw new Error(`Prerequisite cycle at ${id}.`); if (done.has(id)) return; active.add(id); for (const next of topicIndex.get(id)?.prerequisiteTopicIds ?? []) visit(next); active.delete(id); done.add(id) }
  ids.forEach(visit)
  return true
}

validateLearningManifest()
