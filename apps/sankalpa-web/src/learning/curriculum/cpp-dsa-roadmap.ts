import type { SyllabusModule, Topic } from '../types'
import { cppProgramStructure } from '../content/cpp/program-structure'
import { cppMemory } from '../content/cpp/memory'
import { cppStrings } from '../content/cpp/strings'
import { dsaComplexity } from '../content/cpp/complexity'
import { dsaRecursionBasics } from '../content/cpp/recursion'
import { dsaRecursionVariants } from '../content/cpp/recursion-variants'
import { dsaRecurrences } from '../content/cpp/recurrences'
import { dsaPrefixSums } from '../content/cpp/prefix-sums'
import { dsaDifferenceArrays } from '../content/cpp/difference-arrays'
import { dsaSlidingWindow } from '../content/cpp/sliding-window'
import { dsaTwoDimensionalArrays } from '../content/cpp/two-dimensional-arrays'
import { dsaSinglyLinkedLists } from '../content/cpp/singly-linked-lists'
import { dsaDoublyCircularLinkedLists } from '../content/cpp/doubly-circular-linked-lists'
import { dsaStacks } from '../content/cpp/stacks'
import { dsaQueuesDeques } from '../content/cpp/queues-deques'
import { dsaAdvancedSorting } from '../content/cpp/advanced-sorting'
import { dsaBinaryTrees } from '../content/cpp/binary-trees'
import { dsaBinarySearchTrees } from '../content/cpp/binary-search-trees'
import { dsaTreePatterns } from '../content/cpp/tree-patterns'
import { cppIntroduction } from '../content/cpp/introduction'
import { cppEnvironment } from '../content/cpp/environment'
import { cppBasicIo } from '../content/cpp/basic-io'
import { dsaPhysicalLogical } from '../content/cpp/data-structure-models'
import { dsaAbstractDataTypes } from '../content/cpp/abstract-data-types'
import { dsaArrayOperations } from '../content/cpp/array-operations'
import { dsaBinarySearchAnswer } from '../content/cpp/binary-search-answer'
import { dsaHeaps } from '../content/cpp/heaps'
import { dsaPriorityQueues } from '../content/cpp/priority-queues'
import { dsaTopK } from '../content/cpp/top-k'
import { dsaKWayMerge } from '../content/cpp/k-way-merge'
import { dsaRunningMedian } from '../content/cpp/running-median'
import { dsaGraphFundamentals } from '../content/cpp/graph-fundamentals'
import { dsaBreadthFirstSearch } from '../content/cpp/breadth-first-search'
import { dsaDepthFirstSearch } from '../content/cpp/depth-first-search'
import { dsaDisjointSetUnion } from '../content/cpp/disjoint-set-union'
import { dsaMinimumSpanningTrees } from '../content/cpp/minimum-spanning-trees'
import { dsaKruskal } from '../content/cpp/kruskal'
import { dsaPrim } from '../content/cpp/prim'
import { dsaTopologicalSorting } from '../content/cpp/topological-sorting'
import { dsaDijkstraShortestPath } from '../content/cpp/dijkstra-shortest-path'
import { dsaStronglyConnectedComponents } from '../content/cpp/strongly-connected-components'
import { dsaKosaraju } from '../content/cpp/kosaraju'
import { dsaTarjanScc } from '../content/cpp/tarjan-scc'
import { dsaBellmanFord } from '../content/cpp/bellman-ford'
import { dsaNegativeCycles } from '../content/cpp/negative-cycles'

export type CourseMappingStatus = 'verified' | 'inferred' | 'unmapped'
export interface CourseMapping { topicId: string; course: 'Tutedude DSA'; label: string; status: CourseMappingStatus }

const outline = (id: string, title: string, prerequisites: string[] = [], summary?: string, crossLinks: string[] = []): Topic => ({
  id, title, prerequisiteTopicIds: prerequisites, crossLinkTopicIds: crossLinks,
  summary: summary ?? `${title} is mapped in the C++/DSA roadmap. Reviewed lessons and questions will be added in a later content batch.`,
  lessons: [{ id: `${id}-overview`, title: 'Roadmap overview', durationMinutes: 10, objectives: [`Identify what ${title} covers and when to study it`], theory: [`This is an outline-only roadmap entry. It is not marked as a complete lesson.`], examples: [] }],
  checklist: [`I can identify the prerequisites for ${title}.`], mcqs: [], coding: [], resources: [],
})

export const tutedudeMappings: CourseMapping[] = [
  ['cpp-introduction','Introduction to the Course'], ['cpp-environment','Setting Up the Environment'],
  ['cpp-static-memory','Static Memory Allocation'], ['cpp-dynamic-memory','Dynamic Memory Allocation'],
  ['dsa-physical-logical','Physical and Logical Data Structures'], ['dsa-adt','Abstract Data Types'],
  ['dsa-complexity','Space and Time Complexity'], ['dsa-recursion-basics','How Recursion Works'],
  ['dsa-recursion-stack','Recursion and the Call Stack'], ['dsa-recurrences','Recurrence Relations'],
  ['dsa-recursion-static-global','Static and Global Variables in Recursion'], ['dsa-tail-recursion','Tail Recursion'],
  ['dsa-head-recursion','Head Recursion'], ['dsa-tree-recursion','Tree Recursion'],
  ['dsa-indirect-recursion','Indirect Recursion'], ['dsa-nested-recursion','Nested Recursion'],
  ['dsa-recursive-sum','Sum of Natural Numbers'], ['dsa-recursive-factorial','Factorial'],
  ['dsa-recursive-power','Power Calculation'], ['dsa-recursive-fibonacci','Fibonacci'],
  ['dsa-backtracking','Backtracking Fundamentals'],
].map(([topicId, label]) => ({ topicId, label, course: 'Tutedude DSA', status: 'verified' }))

export const proposedCoverageMappings: CourseMapping[] = [
  'cpp-basics','cpp-functions','cpp-arrays','cpp-vectors','cpp-memory','cpp-strings','dsa-prefix-sums','dsa-difference-arrays','cpp-two-pointers','dsa-sliding-window','dsa-linked-list','dsa-stack','dsa-queue','cpp-searching-arrays','cpp-binary-search','cpp-sorting-arrays','cpp-hashing','dsa-trees','dsa-heap','dsa-priority-queue','dsa-top-k','dsa-k-way-merge','dsa-running-median','dsa-trie','dsa-graphs','dsa-greedy','dsa-dynamic-programming','dsa-bit-manipulation','dsa-segment-tree','dsa-fenwick-tree','dsa-interview-practice',
].map(topicId => ({ topicId, label: 'Proposed Sankalpa curriculum coverage', course: 'Tutedude DSA', status: 'unmapped' }))

export const milestone9Mappings: CourseMapping[] = [
  { topicId: 'cpp-program-structure', course: 'Tutedude DSA', label: 'Setting Up the Environment', status: 'inferred' },
  { topicId: 'cpp-memory', course: 'Tutedude DSA', label: 'Static Memory Allocation; Dynamic Memory Allocation', status: 'inferred' },
  { topicId: 'cpp-strings', course: 'Tutedude DSA', label: 'Relevant array/string coverage not confirmed', status: 'unmapped' },
  { topicId: 'dsa-complexity', course: 'Tutedude DSA', label: 'Space and Time Complexity', status: 'verified' },
  { topicId: 'dsa-recursion-basics', course: 'Tutedude DSA', label: 'How Recursion Works', status: 'verified' },
]

export const milestone10Mappings: CourseMapping[] = [
  { topicId:'dsa-recursion-stack', course:'Tutedude DSA', label:'Head, Tail, Tree, Indirect and Nested Recursion', status:'verified' },
  { topicId:'dsa-recurrences', course:'Tutedude DSA', label:'Recurrence relation and time complexity', status:'verified' },
  { topicId:'dsa-prefix-sums', course:'Tutedude DSA', label:'Prefix Sums', status:'unmapped' },
  { topicId:'dsa-difference-arrays', course:'Tutedude DSA', label:'Difference Arrays', status:'unmapped' },
  { topicId:'dsa-sliding-window', course:'Tutedude DSA', label:'Sliding Window', status:'unmapped' },
]

export const milestone11Mappings: CourseMapping[] = [
  { topicId:'dsa-2d-arrays', course:'Tutedude DSA', label:'Arrays / Matrices coverage not confirmed', status:'unmapped' },
  { topicId:'dsa-linked-list', course:'Tutedude DSA', label:'Linked-list coverage not confirmed', status:'unmapped' },
  { topicId:'dsa-doubly-linked-list', course:'Tutedude DSA', label:'Doubly / circular linked-list coverage not confirmed', status:'unmapped' },
  { topicId:'dsa-stack', course:'Tutedude DSA', label:'Stack coverage not confirmed', status:'unmapped' },
  { topicId:'dsa-queue', course:'Tutedude DSA', label:'Queue / circular queue / deque coverage not confirmed', status:'unmapped' },
]

export const milestone12Mappings: CourseMapping[] = [
  { topicId:'dsa-merge-sort', course:'Tutedude DSA', label:'Merge / Quick / Heap Sort coverage not confirmed', status:'unmapped' },
  { topicId:'dsa-hashing', course:'Tutedude DSA', label:'Hash-table and collision-handling coverage not confirmed', status:'unmapped' },
  { topicId:'dsa-trees', course:'Tutedude DSA', label:'Binary-tree coverage not confirmed', status:'unmapped' },
  { topicId:'dsa-bst', course:'Tutedude DSA', label:'BST operations coverage not confirmed', status:'unmapped' },
  { topicId:'dsa-tree-traversals', course:'Tutedude DSA', label:'Tree problem-solving coverage not confirmed', status:'unmapped' },
]

const module = (id: string, title: string, topics: Topic[]): SyllabusModule => ({ id, title, description: `C++/DSA roadmap: ${title}. Outline entries remain visibly distinct from reviewed content.`, topics })

export const cppDsaRoadmapModules: SyllabusModule[] = [
  module('cpp-level-0','Level 0 — C++ absolute basics',[
    cppIntroduction, cppEnvironment,
    cppProgramStructure, cppBasicIo,
    outline('cpp-nested-patterns','Nested loops and pattern problems',['cpp-basics']), cppMemory, cppStrings,
  ]),
  module('cpp-level-1','Level 1 — Data structures and complexity foundations',[
    outline('cpp-static-memory','Static memory allocation',['cpp-basics']), outline('cpp-dynamic-memory','Dynamic memory allocation',['cpp-memory']),
    dsaPhysicalLogical, dsaAbstractDataTypes,
    dsaComplexity,
  ]),
  module('cpp-level-2','Level 2 — Recursion',[
    dsaRecursionBasics, dsaRecursionVariants,
    dsaRecurrences, outline('dsa-recursion-static-global','Static and global variables in recursion',['dsa-recursion-stack']),
    outline('dsa-tail-recursion','Tail recursion',['dsa-recursion-stack']), outline('dsa-head-recursion','Head recursion',['dsa-recursion-stack']), outline('dsa-tree-recursion','Tree recursion',['dsa-recursion-stack']),
    outline('dsa-indirect-recursion','Indirect recursion',['dsa-recursion-stack']), outline('dsa-nested-recursion','Nested recursion',['dsa-recursion-stack']),
    outline('dsa-recursive-sum','Recursive sum',['dsa-recursion-basics']), outline('dsa-recursive-factorial','Recursive factorial',['dsa-recursion-basics']),
    outline('dsa-recursive-power','Recursive power',['dsa-recursion-basics']), outline('dsa-recursive-fibonacci','Recursive Fibonacci',['dsa-tree-recursion']), outline('dsa-backtracking','Backtracking fundamentals',['dsa-tree-recursion']),
  ]),
  module('cpp-level-3','Level 3 — Linear data structures',[
    dsaArrayOperations, dsaTwoDimensionalArrays, dsaPrefixSums,
    dsaDifferenceArrays, dsaSlidingWindow, dsaSinglyLinkedLists,
    dsaDoublyCircularLinkedLists, outline('dsa-circular-linked-list','Circular linked-list extension',['dsa-doubly-linked-list'],'Circular singly and doubly linked lists are reviewed in dsa-doubly-linked-list. This stable outline ID remains for saved progress and future advanced exercises.'),
    dsaStacks, dsaQueuesDeques,
    outline('dsa-circular-queue','Circular-queue extension',['dsa-queue'],'Circular queues are reviewed in dsa-queue. This stable outline ID remains for saved progress and future advanced exercises.'),
    outline('dsa-deque','Deque extension',['dsa-queue'],'Deque fundamentals are reviewed in dsa-queue. This stable outline ID remains for saved progress and future advanced exercises.'),
  ]),
  module('cpp-level-4','Level 4 — Searching, sorting and hashing',[
    dsaBinarySearchAnswer, dsaAdvancedSorting,
    outline('dsa-quick-sort','Quick Sort extension',['dsa-merge-sort'],'Quick Sort is reviewed in dsa-merge-sort. This stable outline ID remains for saved progress and future partition exercises.'),
    outline('dsa-heap-sort','Heap Sort extension',['dsa-merge-sort'],'Heap Sort is reviewed in dsa-merge-sort. This stable outline ID remains for saved progress and future heap exercises.'),
    outline('dsa-counting-sort','Counting and radix extensions',['dsa-merge-sort'],'Counting Sort and a Radix Sort introduction are reviewed in dsa-merge-sort. This stable outline ID remains for saved progress.'),
    outline('cpp-hashing','Hash tables, maps and sets',['cpp-vectors'], 'Reviewed hashing content is owned by dsa-hashing. This stable C++ outline remains as a cross-link and is excluded from automatic planning.',['dsa-hashing']), outline('dsa-frequency-counting','Frequency counting',['dsa-hashing']),
  ]),
  module('cpp-level-5','Level 5 — Nonlinear data structures',[
    dsaBinaryTrees, dsaBinarySearchTrees, dsaTreePatterns,
    outline('dsa-balanced-trees','Balanced trees and AVL trees',['dsa-bst']), dsaHeaps, dsaPriorityQueues, outline('dsa-trie','Tries',['cpp-strings']),
    dsaGraphFundamentals, dsaBreadthFirstSearch, dsaDepthFirstSearch,
    dsaTopologicalSorting, dsaStronglyConnectedComponents, dsaKosaraju, dsaTarjanScc,
    dsaDijkstraShortestPath, dsaBellmanFord, dsaNegativeCycles, dsaDisjointSetUnion,
    dsaMinimumSpanningTrees, dsaKruskal, dsaPrim,
  ]),
  module('cpp-level-6','Level 6 — Advanced problem-solving patterns',[
    dsaTopK, dsaKWayMerge, dsaRunningMedian,
    outline('dsa-greedy','Greedy algorithms',['dsa-complexity']), outline('dsa-divide-conquer','Divide and conquer',['dsa-recursion-basics']), outline('dsa-dynamic-programming','Dynamic programming',['dsa-recursion-basics']),
    outline('dsa-bit-manipulation','Bit manipulation',['cpp-basics']), outline('dsa-monotonic-stack','Monotonic stack',['dsa-stack']), outline('dsa-monotonic-queue','Monotonic queue',['dsa-deque']),
    outline('dsa-intervals','Interval patterns',['cpp-sorting-arrays']), outline('dsa-prefix-suffix','Prefix and suffix techniques',['dsa-prefix-sums']), outline('dsa-segment-tree','Segment trees',['dsa-trees']), outline('dsa-fenwick-tree','Fenwick trees',['dsa-prefix-sums']),
  ]),
  module('cpp-level-7','Level 7 — Interview preparation',[
    outline('dsa-interview-practice','Beginner-to-advanced interview practice',['dsa-complexity']), outline('dsa-debugging','Dry runs, edge cases and debugging',['cpp-basics']),
    outline('dsa-timed-assessments','Timed assessments',['dsa-interview-practice']), outline('dsa-mistake-revision','Mistake-based revision',['dsa-interview-practice']),
  ]),
]
