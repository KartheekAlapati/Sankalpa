import type { Topic } from '../../types'

export const dsaKWayMerge: Topic = {
  id: 'dsa-k-way-merge',
  title: 'K-Way Merging with Priority Queues',
  summary: 'Merge sorted sequences by exposing one frontier item per source, proving the frontier invariant, and comparing the method with flatten-and-sort baselines.',
  prerequisiteTopicIds: ['dsa-priority-queue'],
  crossLinkTopicIds: ['dsa-merge-sort', 'dsa-top-k'],
  lessons: [
    {
      id: 'dsa-k-way-merge-frontier', title: 'Baseline, heap frontier, and correctness', durationMinutes: 65,
      objectives: ['Derive K-way merge from a baseline', 'Define heap entries and advancement', 'Prove the frontier invariant'],
      theory: [
        'A simple baseline flattens all N values and sorts them in O(N log N) time and O(N) extra storage. Repeatedly scanning K current heads instead costs O(NK). Both are useful correctness references.',
        'The heap method inserts the first value from every non-empty sequence. Each entry stores value, sequence index, and element index. Pop the smallest frontier, append it, and push the next value from the same sequence. Empty sequences contribute no entry.',
        'The invariant is that the heap contains the smallest not-yet-output value from each non-exhausted sequence. Every unseen value is at least its own sequence frontier, so the global smallest unseen value is at heap top. This proves sorted output by induction.',
      ],
      examples: [
        { title: 'Three-sequence trace', problem: 'Merge [1,4], [1,3,8], and [2,2].', walkthrough: ['Initialize frontier (1,s0),(1,s1),(2,s2).', 'Tie-break by sequence: pop s0 value 1, push 4.', 'Pop s1 value 1, push 3; then pop both 2 values from s2.', 'Continue with 3,4,8 as frontiers advance.'], result: '[1,1,2,2,3,4,8], with deterministic source tie-breaking.' },
        { title: 'Empty sources', problem: 'Merge [], [-2,5], [], [0].', walkthrough: ['Skip sources 0 and 2 during initialization.', 'Heap starts with (-2,s1) and (0,s3).', 'Pop -2 and push 5 from source 1.', 'Pop 0, then 5.'], result: '[-2,0,5]; no invalid index is read.' },
      ],
    },
    {
      id: 'dsa-k-way-merge-engineering', title: 'Complexity, stability, and scalable variants', durationMinutes: 55,
      objectives: ['Derive O(N log K)', 'Define deterministic equal-value behavior', 'Recognize memory and streaming tradeoffs'],
      theory: [
        'At most K entries are in the heap. Every one of N values is pushed and popped once, so time is O(N log K) and auxiliary heap space is O(K), excluding the output. When K is one, work is linear; when every sequence is empty, output is empty.',
        'Equal values require no tie-break for numeric correctness, but tests and record merges may require deterministic ordering. Sequence index then element index produces repeatable source order and can express stability across input streams.',
        'The pattern extends to linked lists, files, iterators, and external streams when each source can reveal its next sorted item. It does not make unsorted sources sorted. For two arrays, a direct two-pointer merge is simpler and uses no heap.',
      ],
      examples: [
        { title: 'Two-way counterexample', problem: 'Merge only [1,5,9] and [2,3,8].', walkthrough: ['K is fixed at 2.', 'Two pointers compare the two heads directly.', 'Each of six values is consumed once.', 'A heap adds logarithmic machinery without improving the linear bound.'], result: 'Prefer the simpler two-pointer merge for two in-memory sequences.' },
        { title: 'Unsorted-source failure', problem: 'Source A is [4,1] and source B is [2,3].', walkthrough: ['Frontier begins with 4 and 2, so output starts 2.', 'Then source B exposes 3, so output continues 3.', 'Only afterward can source A expose 1.', 'The result [2,3,4,1] is not sorted.'], result: 'Sorted-source order is a necessary precondition.' },
      ],
    },
  ],
  checklist: ['I state that every source must be sorted.', 'I skip empty sources.', 'I store source and position in each entry.', 'I advance only the source that was popped.', 'I can prove the frontier invariant.', 'I choose two pointers when K=2.'],
  commonMistakes: ['Pushing from an empty sequence.', 'Storing only values and losing source position.', 'Advancing every source after one pop.', 'Claiming O(N log N) instead of O(N log K).', 'Assuming unsorted sources are repaired.', 'Ignoring deterministic equal-key requirements.'],
  revisionGuidance: ['Trace the heap after every pop for three short sequences.', 'Prove that no unseen value can be smaller than every frontier.', 'Compare flatten-sort, head scanning, two pointers, and a K-entry heap.'],
  practiceExercises: [
    { id: 'dsa-k-way-merge-p1', title: 'Frontier invariant', prompt: 'Why is storing later elements from every source unnecessary?', difficulty: 'Medium', hints: ['Each source is sorted.'], solution: 'A later element cannot beat its source frontier, so it cannot be the next global minimum before that frontier is consumed.', explanation: 'One candidate per source is sufficient to represent all unseen values.' },
    { id: 'dsa-k-way-merge-p2', title: 'Complexity variables', prompt: 'Distinguish N from K in the complexity.', difficulty: 'Easy', hints: ['One counts values, the other sequences.'], solution: 'N is total values and K is number of sequences; time is O(N log K), heap space O(K).', explanation: 'Each value generates operations on a heap containing at most one entry per source.' },
  ],
  mcqs: [
    { id: 'dsa-k-way-merge-m1', difficulty: 'Easy', prompt: 'What initially enters the heap?', options: ['First item of each non-empty sequence', 'Every item', 'Last item only', 'Only the longest sequence'], answer: 0, explanation: 'One frontier entry per non-empty sorted source is sufficient.' },
    { id: 'dsa-k-way-merge-m2', difficulty: 'Medium', prompt: 'After popping an entry, which source advances?', options: ['The popped entry’s source', 'Every source', 'The smallest-index source always', 'No source'], answer: 0, explanation: 'Only that source has had its current frontier consumed.' },
    { id: 'dsa-k-way-merge-m3', difficulty: 'Easy', prompt: 'What is the time for N total values and K sources?', options: ['O(N log K)', 'O(K log N)', 'O(N²)', 'O(K)'], answer: 0, explanation: 'Each value is pushed and popped through a heap of at most K entries.' },
    { id: 'dsa-k-way-merge-m4', difficulty: 'Easy', prompt: 'How should an empty sequence be handled?', options: ['Skip it during initialization', 'Read index zero', 'Insert a sentinel that may collide', 'Reject all input'], answer: 0, explanation: 'An empty source has no frontier and contributes nothing to output.' },
    { id: 'dsa-k-way-merge-m5', difficulty: 'Medium', prompt: 'Why can two pointers be preferable when K=2?', options: ['They give direct O(N) merging with simpler state', 'A heap cannot store two items', 'Two pointers sort unsorted input', 'They use O(N²) time'], answer: 0, explanation: 'With two sources, comparing their heads directly is already constant work per output.' },
    { id: 'dsa-k-way-merge-m6', difficulty: 'Hard', prompt: 'What proves heap top is globally smallest unseen?', options: ['Every unseen value is at least its source frontier', 'The arrays share memory', 'K equals N', 'All values are unique'], answer: 0, explanation: 'Sorted sources make each frontier a lower bound for the remaining values in that source.' },
  ],
  coding: [
    { id: 'dsa-k-way-merge-c1', title: 'Merge sorted integer sequences', difficulty: 'Medium', language: 'cpp', prompt: 'Merge K ascending integer vectors. Empty vectors and duplicates are valid. Constraints: total N <= 300000 and K <= 100000. Target O(N log K) time and O(K) heap space excluding output.', starter: '#include <queue>\n#include <vector>\nstd::vector<int> mergeSorted(const std::vector<std::vector<int>>& lists) {\n    // entry: value, source, position\n}', examples: [{ input: '{{1,4},{1,3,8},{2,2}}', output: '{1,1,2,2,3,4,8}' }, { input: '{{},{-2}, {}}', output: '{-2}' }], hints: ['Initialize only non-empty lists.', 'After pop, increment that entry’s position.'], referenceSolution: 'std::vector<int> mergeSorted(const std::vector<std::vector<int>>& lists){struct E{int value;std::size_t source,pos;};struct Greater{bool operator()(const E&a,const E&b)const{if(a.value!=b.value)return a.value>b.value;if(a.source!=b.source)return a.source>b.source;return a.pos>b.pos;}};std::priority_queue<E,std::vector<E>,Greater> q;for(std::size_t s=0;s<lists.size();++s)if(!lists[s].empty())q.push({lists[s][0],s,0});std::vector<int> out;while(!q.empty()){const E e=q.top();q.pop();out.push_back(e.value);const std::size_t next=e.pos+1;if(next<lists[e.source].size())q.push({lists[e.source][next],e.source,next});}return out;}' },
    { id: 'dsa-k-way-merge-c2', title: 'Smallest range covering every sequence', difficulty: 'Hard', language: 'cpp', prompt: 'Given K non-empty ascending integer sequences, return the inclusive [left,right] of minimum width containing at least one value from each sequence; break equal widths by smaller left. Reject an empty outer list or any empty source. Constraints: total N <= 200000. Use a K-entry min-heap and current maximum.', starter: '#include <queue>\n#include <stdexcept>\n#include <tuple>\n#include <utility>\n#include <vector>\nstd::pair<int,int> smallestRange(const std::vector<std::vector<int>>& lists) {\n    // stop when one source is exhausted\n}', examples: [{ input: '{{4,10},{0,9},{5,18}}', output: '{0,5}' }, { input: 'one empty source', output: 'throws std::invalid_argument' }], hints: ['The heap top is current minimum.', 'After advancing that source, update the current maximum.'], referenceSolution: 'std::pair<int,int> smallestRange(const std::vector<std::vector<int>>& a){if(a.empty())throw std::invalid_argument("no sources");using E=std::tuple<int,std::size_t,std::size_t>;std::priority_queue<E,std::vector<E>,std::greater<E>> q;int high=0;bool first=true;for(std::size_t s=0;s<a.size();++s){if(a[s].empty())throw std::invalid_argument("empty source");q.push(E(a[s][0],s,0));if(first||a[s][0]>high){high=a[s][0];first=false;}}int bestL=std::get<0>(q.top()),bestR=high;while(true){const E e=q.top();q.pop();const int low=std::get<0>(e);const std::size_t s=std::get<1>(e),p=std::get<2>(e);if(static_cast<long long>(high)-low<static_cast<long long>(bestR)-bestL||(static_cast<long long>(high)-low==static_cast<long long>(bestR)-bestL&&low<bestL)){bestL=low;bestR=high;}if(p+1==a[s].size())break;const int value=a[s][p+1];if(value>high)high=value;q.push(E(value,s,p+1));}return{bestL,bestR};}' },
  ],
  resources: [{ title: 'cppreference: priority_queue', url: 'https://en.cppreference.com/w/cpp/container/priority_queue', kind: 'web' }],
}
