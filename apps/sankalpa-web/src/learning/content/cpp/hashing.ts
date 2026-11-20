import type { Topic } from '../../types'

export const dsaHashing: Topic = {
  id: 'dsa-hashing',
  title: 'Hashing and Hash-Based Data Structures',
  summary: 'Use hash tables with explicit collision and complexity reasoning, then apply maps and sets to counting, pair, and prefix-sum patterns.',
  prerequisiteTopicIds: ['cpp-arrays', 'cpp-vectors', 'dsa-prefix-sums'],
  crossLinkTopicIds: ['cpp-hashing', 'dsa-frequency-counting', 'cpp-strings'],
  lessons: [
    {
      id: 'dsa-hashing-table-mechanics', title: 'Hash functions, collisions, and load factor', durationMinutes: 60,
      objectives: ['Explain bucket selection and collisions', 'Compare chaining and open addressing', 'State expected and worst-case costs honestly'],
      theory: [
        'A hash function converts a key into a hash value, and a table maps that value to a bucket. Equal keys must hash equally. Different keys can select the same bucket; this unavoidable event is a collision, not automatically a bug.',
        'Separate chaining stores multiple entries per bucket. Open addressing probes other table positions and needs a deletion policy such as tombstones. Both strategies require equality checks after hashing because a hash value alone does not prove key equality.',
        'Load factor is element count divided by bucket count. As it grows, collisions and probes tend to increase. Rehashing allocates a larger bucket array and redistributes entries. Lookup, insertion, and removal are expected O(1) with suitable hashing and load, but adversarial collisions can make them O(n).',
      ],
      examples: [{ title: 'Separate-chaining collision', problem: 'With bucket index key mod 5, insert 7,12,3.', walkthrough: ['7 maps to bucket 2.', '12 also maps to bucket 2, so store it in that bucket’s chain.', '3 maps to bucket 3.', 'Lookup 12 hashes to bucket 2, then compares keys in its chain.'], result: 'All keys remain distinguishable despite the collision.' }],
    },
    {
      id: 'dsa-hashing-standard-containers', title: 'unordered maps, sets, and ordered alternatives', durationMinutes: 55,
      objectives: ['Choose unordered_map or unordered_set', 'Compare ordered and unordered containers', 'Use reserve and custom key rules responsibly'],
      theory: [
        'std::unordered_map stores key-value pairs and std::unordered_set stores unique keys. operator[] on an unordered_map inserts a default value when a missing key is accessed; find or contains-style logic avoids accidental insertion.',
        'std::map and std::set maintain key order with O(log n) operations. Unordered containers do not promise iteration order and offer expected O(1) operations. Choose ordered containers for sorted traversal, range queries, or worst-case logarithmic guarantees.',
        'reserve can reduce repeated rehashing when an approximate element count is known. Custom key types need compatible hash and equality behavior: whenever equality says two keys are equal, their hashes must match.',
      ],
      examples: [{ title: 'Frequency table', problem: 'Count values in [4,2,4,1,2,4].', walkthrough: ['Start with an empty unordered_map<int,int>.', 'Increment the count for each value.', 'Final entries are 4→3, 2→2, and 1→1.'], result: 'Expected Theta(n) time and O(k) space for k distinct values.' }],
    },
    {
      id: 'dsa-hashing-problem-patterns', title: 'Pair sums and prefix-sum hashing', durationMinutes: 65,
      objectives: ['Solve duplicate and pair-sum problems', 'Find longest target-sum subarrays', 'Compare hashing with sorting'],
      theory: [
        'Duplicate detection inserts each value into a set and detects a repeated insertion. Two Sum stores previously seen values and asks whether target-current has appeared, preserving indices when required.',
        'For longest subarray sum equal to target, maintain prefix sum S at index i. If S-target first appeared at index j, then values j+1 through i sum to target. Store only the earliest index for each prefix to maximize length, and seed prefix 0 at index -1.',
        'Hashing often gives expected linear time with extra space and no useful order. Sorting can use less auxiliary structure and deterministic O(n log n) time but may reorder input or require index bookkeeping. Character counting must also define the alphabet or byte/Unicode model.',
      ],
      examples: [{ title: 'Longest target-sum subarray', problem: 'For [1,-1,5,-2,3], find longest sum 3.', walkthrough: ['Seed prefix 0 at index -1.', 'At index 3, prefix is 3, so prefix-target is 0 found at -1.', 'The range 0..3 has length 4.', 'Keep earliest prefix positions so later ranges are as long as possible.'], result: 'Longest length is 4 in expected O(n) time, including negative values.' }],
    },
  ],
  checklist: ['I explain why collisions are normal.', 'I state hash operations as expected O(1), not guaranteed.', 'I choose map versus set based on whether values are associated with keys.', 'I avoid accidental operator[] insertion when only checking.', 'I seed prefix zero and preserve earliest indices for longest-subarray problems.'],
  commonMistakes: ['Assuming different keys always have different hashes.', 'Claiming hash operations are worst-case O(1).', 'Relying on unordered iteration order.', 'Overwriting the earliest prefix index in a longest-range algorithm.', 'Using pair-sum values when the problem requires original indices.'],
  revisionGuidance: ['Draw a small chained table with at least two collisions.', 'Compare unordered_map, map, unordered_set, and sorting for three tasks.', 'Trace prefix sums and earliest indices for an array containing negative values.'],
  practiceExercises: [
    { id: 'dsa-hashing-p1', title: 'Collision reasoning', prompt: 'If two unequal keys hash to the same bucket, may both remain in the table?', difficulty: 'Easy', hints: ['A collision strategy stores or probes multiple entries.'], solution: 'Yes; equality checks distinguish the keys within the collision strategy.', explanation: 'Hashing narrows the search location, while key equality identifies the requested entry.' },
    { id: 'dsa-hashing-p2', title: 'Container choice', prompt: 'Choose map or unordered_map when sorted key iteration is required.', difficulty: 'Easy', hints: ['Unordered iteration order is unspecified.'], solution: 'Choose std::map.', explanation: 'std::map maintains keys in comparator order and provides logarithmic operations.' },
    { id: 'dsa-hashing-p3', title: 'Earliest prefix', prompt: 'Why keep the earliest index for each prefix sum when maximizing subarray length?', difficulty: 'Medium', hints: ['Length is current index minus stored index.'], solution: 'An earlier matching prefix produces a longer range ending at the same current index.', explanation: 'Replacing it with a later occurrence can only shorten future candidate subarrays.' },
  ],
  mcqs: [
    { id: 'dsa-hashing-m1', prompt: 'What is a hash collision?', options: ['Different keys select the same bucket', 'A key is sorted', 'A table is empty', 'A lookup is recursive'], answer: 0, explanation: 'The finite bucket set means distinct keys may map to the same location.' },
    { id: 'dsa-hashing-m2', prompt: 'What is typical unordered_map lookup complexity?', options: ['Expected O(1), worst O(n)', 'Guaranteed O(1)', 'Always O(log n)', 'Always O(n²)'], answer: 0, explanation: 'Good distribution gives constant expected work, while severe collisions can create linear work.' },
    { id: 'dsa-hashing-m3', prompt: 'What does unordered_map operator[] do for a missing key?', options: ['Inserts a default-mapped value', 'Throws automatically', 'Returns an iterator', 'Sorts the table'], answer: 0, explanation: 'Subscript access creates an entry when the key is absent.' },
    { id: 'dsa-hashing-m4', prompt: 'What prefix should be seeded for target-subarray hashing?', options: ['Sum 0 at index -1', 'Target at index 0', 'Infinity at index -1', 'No seed'], answer: 0, explanation: 'The seed allows a qualifying range that starts at array index zero.' },
    { id: 'dsa-hashing-m5', prompt: 'When is std::map preferable to unordered_map?', options: ['When sorted traversal or range operations matter', 'When expected O(1) is mandatory', 'When keys cannot be compared', 'When no key-value pairs exist'], answer: 0, explanation: 'The ordered tree structure supports comparator order and logarithmic range-oriented operations.' },
  ],
  coding: [
    { id: 'dsa-hashing-c1', title: 'Two Sum indices', difficulty: 'Easy', language: 'cpp', prompt: 'Return indices of the first pair discovered whose values sum to target, or an empty vector. Use only earlier indices as complements.', starter: '#include <unordered_map>\n#include <vector>\nstd::vector<int> twoSum(const std::vector<int>& values, int target) {\n    // complement lookup\n}\n', examples: [{ input: '{2,7,11,15}, target=9', output: '{0,1}' }, { input: '{}', output: '{}' }], hints: ['Check target-values[i] before inserting values[i].', 'Store an index for each seen value.'], referenceSolution: 'std::vector<int> twoSum(const std::vector<int>& values, int target) {\n    std::unordered_map<int, int> seen;\n    seen.reserve(values.size());\n    for (int i = 0; i < static_cast<int>(values.size()); ++i) {\n        const auto match = seen.find(target - values[i]);\n        if (match != seen.end()) return {match->second, i};\n        if (seen.find(values[i]) == seen.end()) seen.emplace(values[i], i);\n    }\n    return {};\n}' },
    { id: 'dsa-hashing-c2', title: 'Longest subarray with target sum', difficulty: 'Medium', language: 'cpp', prompt: 'Return the longest contiguous length whose sum equals target. Support negative values and use long long prefix sums.', starter: '#include <algorithm>\n#include <unordered_map>\n#include <vector>\nint longestTargetSum(const std::vector<int>& values, long long target) {\n    // earliest prefix indices\n}\n', examples: [{ input: '{1,-1,5,-2,3}, target=3', output: '4' }, { input: '{}', output: '0' }], hints: ['Seed prefix 0 at -1.', 'Do not overwrite an existing prefix index.'], referenceSolution: 'int longestTargetSum(const std::vector<int>& values, long long target) {\n    std::unordered_map<long long, int> first{{0, -1}};\n    first.reserve(values.size() + 1);\n    long long prefix = 0;\n    int best = 0;\n    for (int i = 0; i < static_cast<int>(values.size()); ++i) {\n        prefix += values[i];\n        const auto start = first.find(prefix - target);\n        if (start != first.end()) best = std::max(best, i - start->second);\n        first.emplace(prefix, i);\n    }\n    return best;\n}' },
  ],
  resources: [
    { title: 'cppreference: std::unordered_map', url: 'https://en.cppreference.com/w/cpp/container/unordered_map', kind: 'web' },
    { title: 'cppreference: std::unordered_set', url: 'https://en.cppreference.com/w/cpp/container/unordered_set', kind: 'web' },
    { title: 'cppreference: std::map', url: 'https://en.cppreference.com/w/cpp/container/map', kind: 'web' },
  ],
}
