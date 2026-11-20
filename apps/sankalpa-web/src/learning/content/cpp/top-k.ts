import type { Topic } from '../../types'

export const dsaTopK: Topic = {
  id: 'dsa-top-k',
  title: 'Top-K and Bounded-Heap Patterns',
  summary: 'Derive Top-K, kth-element, and frequency algorithms from baselines, constraints, bounded-heap invariants, and deterministic tie policies.',
  prerequisiteTopicIds: ['dsa-priority-queue', 'dsa-hashing'],
  crossLinkTopicIds: ['cpp-sorting-arrays', 'dsa-running-median'],
  lessons: [
    {
      id: 'dsa-top-k-selection', title: 'From sorting to a size-K heap', durationMinutes: 65,
      objectives: ['Compare full sorting with bounded heaps', 'Prove the size-K invariant', 'Handle K boundaries and duplicates'],
      theory: [
        'The simplest Top-K baseline sorts all n values in O(n log n), then takes a slice. This is often the best engineering choice when all sorted output is needed or n is modest. A heap is not a universal improvement.',
        'For K largest values, keep a min-heap of at most K candidates. Push each value and, when size exceeds K, remove the smallest. After a prefix is processed, the heap contains exactly the K largest values from that prefix, counting duplicates. The root is the kth largest once all input is processed.',
        'The bounded method costs O(n log K) time and O(K) space. Define constraints explicitly: this topic rejects K=0 and K>n for kth-element queries; Top-K list functions may instead return empty for K=0 and clamp K to n if their contract says so.',
      ],
      examples: [
        { title: 'Kth-largest trace', problem: 'Find the 3rd largest of [5,1,5,2,9].', walkthrough: ['Heap after 5,1,5 is [1,5,5].', 'Push 2, then remove 1: candidates [2,5,5].', 'Push 9, then remove 2: candidates [5,5,9].', 'The min-heap root is 5.'], result: 'The third largest is 5; duplicates occupy distinct ranks.' },
        { title: 'Sorting can be preferable', problem: 'Return all n values in ascending order.', walkthrough: ['A size-n bounded heap still stores every value.', 'Popping a min-heap costs O(n log n).', 'std::sort is direct, cache-friendly, and expresses the full-order requirement.', 'No partial-selection advantage remains.'], result: 'Choose sorting rather than forcing the Top-K pattern.' },
      ],
    },
    {
      id: 'dsa-top-k-frequency', title: 'Top-K frequent values and deterministic ties', durationMinutes: 65,
      objectives: ['Separate counting and selection costs', 'Design a frequency comparator', 'Reason about streaming and invalid assumptions'],
      theory: [
        'Top-K frequent begins with a frequency table in expected O(n) time using an unordered map. If u distinct values remain, sorting records costs O(u log u), while a size-K heap costs O(u log K) and O(u+K) storage including the table.',
        'A deterministic contract might rank higher frequency first and, on equal frequency, smaller numeric value first. A bounded min-heap keeps the worst retained candidate at top: lower frequency is worse; on a tie, larger value is worse. Replacing that root preserves the best K records.',
        'For an unbounded stream, exact frequency Top-K still needs counts for every distinct value unless stronger assumptions or approximate sketches are allowed. A heap alone cannot know that an old value became frequent without an authoritative count and a strategy for stale entries or rebuilding.',
      ],
      examples: [
        { title: 'Frequency and heap phases', problem: 'Top 2 frequent in [4,4,1,1,2], smaller value wins ties.', walkthrough: ['Counts are 1→2, 4→2, 2→1.', 'Compare the two frequency-2 records using value tie-break.', 'Both 1 and 4 outrank 2.', 'Order final retained records by frequency descending, value ascending.'], result: '[1,4]; counting and candidate selection are separate phases.' },
        { title: 'Incorrect greedy choice', problem: 'Keep only the first K distinct stream values and increment their counts.', walkthrough: ['With K=1, stream begins 9, so retain 9.', 'Then value 2 appears one hundred times but was discarded.', 'The retained candidate never observes 2 becoming dominant.', 'The strategy lacks counts for excluded values.'], result: 'A bounded candidate heap without complete counts does not solve exact streaming frequency Top-K.' },
      ],
    },
  ],
  checklist: ['I start with a sorting baseline.', 'I choose min-heap for K largest candidates.', 'I define K=0 and K>n behavior.', 'I count duplicates according to the contract.', 'I separate O(n) counting from O(u log K) selection.', 'I define deterministic ties.'],
  commonMistakes: ['Using a max-heap for K largest and evicting the wrong candidate.', 'Ignoring duplicate rank semantics.', 'Accessing heap top when K is zero.', 'Returning arbitrary order under ties.', 'Claiming O(n log K) without counting-table storage.', 'Assuming a bounded heap alone tracks exact stream frequencies.'],
  revisionGuidance: ['State the retained-candidate invariant after every prefix.', 'Compare sorting and bounded heaps for K=1, K=n/2, and K=n.', 'Design both best-first and worst-first frequency comparators.'],
  practiceExercises: [
    { id: 'dsa-top-k-p1', title: 'Choose the heap direction', prompt: 'For K smallest values, which extreme should a bounded heap expose for eviction?', difficulty: 'Easy', hints: ['The worst retained small candidate is the largest one.'], solution: 'Use a max-heap of size K.', explanation: 'When a smaller value arrives, remove the largest retained value.' },
    { id: 'dsa-top-k-p2', title: 'Prove the prefix invariant', prompt: 'Explain why push-then-pop keeps the K largest values of each prefix.', difficulty: 'Medium', hints: ['Consider whether the new value belongs in the previous top K.'], solution: 'The previous heap plus the new value contains every possible top-K member; removing its minimum discards exactly the worst candidate.', explanation: 'Induction on prefix length establishes the invariant and final correctness.' },
  ],
  mcqs: [
    { id: 'dsa-top-k-m1', difficulty: 'Easy', prompt: 'Which heap maintains K largest values with direct eviction?', options: ['Min-heap of size K', 'Max-heap of size K', 'FIFO queue', 'Stack'], answer: 0, explanation: 'The smallest retained candidate must be exposed so a better incoming value can replace it.' },
    { id: 'dsa-top-k-m2', difficulty: 'Medium', prompt: 'What is bounded-heap time for n inputs?', options: ['O(n log K)', 'O(K log n) always', 'O(n²)', 'O(log n)'], answer: 0, explanation: 'Each input causes at most a constant number of O(log K) heap operations.' },
    { id: 'dsa-top-k-m3', difficulty: 'Easy', prompt: 'Under rank-with-duplicates semantics, what is the 2nd largest of [5,5,1]?', options: ['5', '1', 'Undefined', '6'], answer: 0, explanation: 'The two equal values occupy the first and second positions in descending order.' },
    { id: 'dsa-top-k-m4', difficulty: 'Medium', prompt: 'If K=n and fully sorted output is required, what is often simplest?', options: ['Sort the array', 'Maintain a size-one heap', 'Linear search only', 'Reject the input'], answer: 0, explanation: 'The output itself requires full order, so sorting directly is usually clearer and efficient.' },
    { id: 'dsa-top-k-m5', difficulty: 'Hard', prompt: 'For u distinct keys, what is heap selection cost after expected O(n) counting?', options: ['O(u log K)', 'O(nK)', 'O(K log u) regardless of u', 'O(1)'], answer: 0, explanation: 'Each distinct frequency record is considered against a heap bounded by K.' },
    { id: 'dsa-top-k-m6', difficulty: 'Medium', prompt: 'Why must frequency ties be specified?', options: ['Otherwise multiple valid sets or orders may exist', 'Heaps reject equal keys', 'Maps cannot count duplicates', 'Sorting requires unique keys'], answer: 0, explanation: 'An explicit tie rule makes expected output and tests deterministic.' },
  ],
  coding: [
    { id: 'dsa-top-k-c1', title: 'Kth largest with duplicates', difficulty: 'Medium', language: 'cpp', prompt: 'Return the kth largest value counting duplicates. Throw std::invalid_argument when k==0 or k>values.size(). Constraints: n <= 300000; values fit int. Target O(n log k) time and O(k) space.', starter: '#include <queue>\n#include <stdexcept>\n#include <vector>\nint kthLargest(const std::vector<int>& values, std::size_t k) {\n    // bounded min-heap\n}', examples: [{ input: '{5,1,5,2}, k=2', output: '5' }, { input: '{} k=1', output: 'throws std::invalid_argument' }], hints: ['Push every value.', 'When size exceeds k, pop the minimum.'], referenceSolution: 'int kthLargest(const std::vector<int>& values,std::size_t k){if(k==0||k>values.size())throw std::invalid_argument("invalid k");std::priority_queue<int,std::vector<int>,std::greater<int>> best;for(int value:values){best.push(value);if(best.size()>k)best.pop();}return best.top();}' },
    { id: 'dsa-top-k-c2', title: 'Deterministic Top-K frequent', difficulty: 'Hard', language: 'cpp', prompt: 'Return up to k distinct integers ordered by frequency descending, then value ascending. If k==0 return empty; if k exceeds the distinct count, return all. Constraints: n <= 300000. Target expected O(n + u log k) before ordering the selected results.', starter: '#include <algorithm>\n#include <queue>\n#include <unordered_map>\n#include <vector>\nstd::vector<int> topKFrequent(const std::vector<int>& values, std::size_t k) {\n    // count, retain best records, then order output\n}', examples: [{ input: '{4,4,1,1,2}, k=2', output: '{1,4}' }, { input: '{} k=3', output: '{}' }], hints: ['The heap top should be the worst retained record.', 'For equal frequency, a larger value is worse.'], referenceSolution: 'std::vector<int> topKFrequent(const std::vector<int>& values,std::size_t k){if(k==0)return{};std::unordered_map<int,int> count;for(int value:values)++count[value];using Entry=std::pair<int,int>;auto better=[](const Entry&a,const Entry&b){return a.first!=b.first?a.first>b.first:a.second<b.second;};std::priority_queue<Entry,std::vector<Entry>,decltype(better)> best(better);for(const auto& item:count){best.push({item.second,item.first});if(best.size()>k)best.pop();}std::vector<Entry> chosen;while(!best.empty()){chosen.push_back(best.top());best.pop();}std::sort(chosen.begin(),chosen.end(),better);std::vector<int> out;for(const Entry& item:chosen)out.push_back(item.second);return out;}' },
  ],
  resources: [{ title: 'cppreference: priority_queue', url: 'https://en.cppreference.com/w/cpp/container/priority_queue', kind: 'web' }],
}
