import type { LearningTrack, Subject, SyllabusModule, Topic } from '../types'

export function outlineTopic(id: string, title: string, prerequisites: string[] = [], crossLinks: string[] = []): Topic {
  return { id, title, summary: `${title} curriculum map. Detailed reviewed lessons are not yet published.`, prerequisiteTopicIds: prerequisites, crossLinkTopicIds: crossLinks, lessons: [], checklist: [], mcqs: [], coding: [], resources: [] }
}

export function module(id: string, title: string, topics: Topic[]): SyllabusModule {
  return { id, title, description: `Structured coverage of ${title}.`, topics }
}

export function subject(id: string, title: string, code: string, tracks: LearningTrack[], modules: SyllabusModule[], semester?: number): Subject {
  return { id, title, code, tracks, semester, description: `A navigable curriculum for ${title}. Outline-only topics are clearly distinguished from reviewed lessons.`, modules }
}
