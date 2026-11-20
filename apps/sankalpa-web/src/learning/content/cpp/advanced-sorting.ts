import type { Topic } from '../../types'

export const dsaAdvancedSorting: Topic = {
  id: 'dsa-merge-sort',
  title: 'Advanced Sorting Algorithms',
  summary: 'Compare merge, quick, heap, counting, and radix strategies while reasoning honestly about stability, memory, and best, expected, and worst cases.',
  prerequisiteTopicIds: ['cpp-sorting-arrays', 'dsa-recurrences'],
  crossLinkTopicIds: ['dsa-quick-sort', 'dsa-heap-sort', 'dsa-counting-sort', 'dsa-heap'],
  lessons: [
    {
      id: 'dsa-merge-sort-comparison', title: 'Comparison sorting and Merge Sort', durationMinutes: 60,
      objectives: ['Classify stable and in-place sorting', 'Trace divide, sort, and merge phases', 'Explain the comparison-sorting lower bound'],
      theory: [
        'A comparison sort learns order by comparing pairs. Stability preserves the input order of equal keys; in-place usually means only constant or logarithmic auxiliary storage beyond recursion. These are separate properties.',
        'Merge Sort divides the range, recursively sorts both halves, then merges by repeatedly taking the smaller front item. Choosing the left item on equality preserves stability. Its time is Theta(n log n) in best, average, and worst cases, with Theta(n) merge storage and Theta(log n) call depth.',
        'A deterministic comparison sort must distinguish among n! possible orderings. A binary comparison tree therefore needs height at least log2(n!), which is Omega(n log n). Linear-time sorting requires additional assumptions about keys rather than comparisons alone.',
      ],
      examples: [{ title: 'Merge Sort dry run', problem: 'Sort [5,2,4,2].', walkthrough: ['Split into [5,2] and [4,2].', 'Sort halves to [2,5] and [2,4].', 'Merge: take the left 2 on equality, then right 2, then 4, then 5.'], result: '[2,2,4,5]; equal elements retain relative order when ties choose left.' }],
    },
    {
      id: 'dsa-quick-sort-partition', title: 'Quick Sort and partition invariants', durationMinutes: 60,
      objectives: ['Trace a partition', 'Explain pivot-selection tradeoffs', 'Distinguish expected and worst-case complexity'],
      theory: [
        'Quick Sort partitions values around a pivot, then recursively sorts the two sides. In Lomuto partitioning with a last-element pivot, a boundary separates values known to be <= pivot from values not yet classified.',
        'Balanced partitions give Theta(n log n) work and logarithmic depth. Repeatedly choosing an extreme pivot creates Theta(n²) time and Theta(n) call depth. Randomized or median-oriented pivot choices reduce the chance of persistent imbalance but do not remove the theoretical worst case.',
        'Typical in-place Quick Sort uses constant partition storage but recursive stack space. It is generally unstable because swaps can reverse equal-key order. Three-way partitioning is useful when many keys equal the pivot.',
      ],
      examples: [{ title: 'Lomuto partition dry run', problem: 'Partition [4,1,3,2] around last pivot 2.', walkthrough: ['Boundary starts before index 0.', '4 is greater than 2; 1 is <=2, so move it to the first position.', '3 is greater than 2.', 'Swap pivot 2 after the <= region.'], result: '[1,2,3,4] after this partition; pivot index 1 is final, but the sides still require sorting generally.' }],
    },
    {
      id: 'dsa-heap-sort-noncomparison', title: 'Heap Sort, key-based sorts, and library algorithms', durationMinutes: 65,
      objectives: ['Trace heap construction and extraction', 'State counting and radix preconditions', 'Choose std::sort, std::stable_sort, or a custom comparator'],
      theory: [
        'Heap Sort builds a max heap, swaps its root with the last unsorted position, shrinks the heap, and restores the heap invariant. It is O(n log n) worst-case, in-place apart from call depth when sift-down is iterative, and not stable.',
        'Counting Sort counts keys in a bounded integer range and can run in O(n+k) time and O(k) extra space; a huge range makes it impractical. Radix Sort processes digits with a stable per-digit routine and depends on a defined representation, base, and signed-value policy.',
        'std::sort provides O(n log n) worst-case comparisons since C++11 but is not stable. std::stable_sort preserves equal-key order and may use additional memory. A comparator must define a strict weak ordering; use return a.key < b.key, not <=.',
      ],
      examples: [{ title: 'Heap Sort extraction', problem: 'Start with max heap [6,4,5,1].', walkthrough: ['Swap root 6 with the final element: [1,4,5,6].', 'Sift 1 down within heap size 3: [5,4,1,6].', 'Repeat extraction until heap size one.'], result: 'Ascending output [1,4,5,6], with O(n log n) worst-case time.' }],
    },
  ],
  checklist: ['I distinguish stability from in-place behavior.', 'I can merge two sorted ranges without losing equal-key order.', 'I state Quick Sort expected and worst cases separately.', 'I can trace max-heap extraction.', 'I check key-range assumptions before using counting or radix sorting.'],
  commonMistakes: ['Calling every O(n log n) sort stable.', 'Using < instead of <= when a merge must preserve left-before-right ties.', 'Claiming Quick Sort is always O(n log n).', 'Forgetting to reduce heap size before sifting.', 'Writing a comparator with <= and violating strict weak ordering.'],
  revisionGuidance: ['Sort one duplicate-containing array by merge, quick, and heap traces.', 'Build a table of time, auxiliary space, stability, and in-place status.', 'Explain why counting sort does not violate the comparison lower bound.'],
  practiceExercises: [
    { id: 'dsa-merge-sort-p1', title: 'Stable merge choice', prompt: 'Two equal keys are at the fronts of left and right merge buffers. Which should a stable ascending merge choose?', difficulty: 'Easy', hints: ['Preserve original left-before-right order.'], solution: 'Choose the left-buffer key first.', explanation: 'The left half appeared earlier in the original range, so taking it on equality preserves stability.' },
    { id: 'dsa-merge-sort-p2', title: 'Quick Sort worst case', prompt: 'Why can last-pivot Quick Sort take quadratic time on already sorted input?', difficulty: 'Medium', hints: ['Inspect partition sizes.'], solution: 'Each pivot becomes an extreme and leaves subproblems of sizes n-1 and 0.', explanation: 'Linear partition work repeats for n levels, producing the sum n+(n-1)+...+1.' },
    { id: 'dsa-merge-sort-p3', title: 'Choose a sort', prompt: 'Records must retain input order among equal scores. Choose std::sort or std::stable_sort.', difficulty: 'Easy', hints: ['The requirement explicitly concerns equal-key order.'], solution: 'Use std::stable_sort with a score comparator.', explanation: 'std::stable_sort guarantees that equivalent elements keep their original relative order.' },
  ],
  mcqs: [
    { id: 'dsa-merge-sort-m1', prompt: 'What is Merge Sort worst-case time?', options: ['Theta(n log n)', 'Theta(n²)', 'Theta(n)', 'Theta(log n)'], answer: 0, explanation: 'There are logarithmically many levels with linear total merge work per level.' },
    { id: 'dsa-merge-sort-m2', prompt: 'What makes a sorting algorithm stable?', options: ['Equal keys retain relative order', 'It uses no memory', 'It is always linear', 'It uses a heap'], answer: 0, explanation: 'Stability is specifically the preservation of input order among equivalent keys.' },
    { id: 'dsa-merge-sort-m3', prompt: 'What is Quick Sort worst-case time?', options: ['Theta(n²)', 'Theta(n log n) guaranteed', 'Theta(log n)', 'Theta(1)'], answer: 0, explanation: 'Repeatedly extreme pivots create a chain of n-level partitions.' },
    { id: 'dsa-merge-sort-m4', prompt: 'Which statement describes Heap Sort?', options: ['O(n log n) worst case and generally unstable', 'Always stable and O(n)', 'Requires bounded integer keys', 'Uses hashing'], answer: 0, explanation: 'Heap extraction gives logarithmic work per item, while swaps do not preserve equal-key order.' },
    { id: 'dsa-merge-sort-m5', prompt: 'Why can Counting Sort be linear in n+k?', options: ['It uses bounded keys rather than comparisons alone', 'It ignores output order', 'It uses binary search', 'It assumes all inputs are sorted'], answer: 0, explanation: 'Direct counts exploit key-domain structure outside the comparison-only model.' },
  ],
  coding: [
    { id: 'dsa-merge-sort-c1', title: 'Stable Merge Sort', difficulty: 'Medium', language: 'cpp', prompt: 'Sort a vector ascending with stable Merge Sort. Reuse one buffer and choose the left item on equal values.', starter: '#include <vector>\nvoid mergeSort(std::vector<int>& values) {\n    // divide and merge with one reusable buffer\n}\n', examples: [{ input: '{5,2,4,2}', output: '{2,2,4,5}' }, { input: '{}', output: '{}' }], hints: ['Use half-open ranges [left,right).', 'Copy the merged range back.'], referenceSolution: 'void mergeRange(std::vector<int>& a, std::vector<int>& buffer, std::size_t left, std::size_t right) {\n    if (right - left < 2) return;\n    const std::size_t middle = left + (right - left) / 2;\n    mergeRange(a, buffer, left, middle);\n    mergeRange(a, buffer, middle, right);\n    std::size_t i = left, j = middle, out = left;\n    while (i < middle && j < right) buffer[out++] = a[i] <= a[j] ? a[i++] : a[j++];\n    while (i < middle) buffer[out++] = a[i++];\n    while (j < right) buffer[out++] = a[j++];\n    for (std::size_t k = left; k < right; ++k) a[k] = buffer[k];\n}\nvoid mergeSort(std::vector<int>& values) {\n    std::vector<int> buffer(values.size());\n    mergeRange(values, buffer, 0, values.size());\n}' },
    { id: 'dsa-merge-sort-c2', title: 'Lomuto Quick Sort', difficulty: 'Medium', language: 'cpp', prompt: 'Sort ascending with a last-element Lomuto partition. Empty input must be handled without unsigned underflow.', starter: '#include <vector>\nvoid quickSort(std::vector<int>& values) {\n    // guard empty, partition, recurse\n}\n', examples: [{ input: '{4,1,3,2}', output: '{1,2,3,4}' }], hints: ['Use signed bounds.', 'Place the pivot immediately after the <= region.'], referenceSolution: 'int partitionLast(std::vector<int>& a, int left, int right) {\n    const int pivot = a[right];\n    int boundary = left;\n    for (int i = left; i < right; ++i) if (a[i] <= pivot) std::swap(a[boundary++], a[i]);\n    std::swap(a[boundary], a[right]);\n    return boundary;\n}\nvoid quickRange(std::vector<int>& a, int left, int right) {\n    if (left >= right) return;\n    const int pivot = partitionLast(a, left, right);\n    quickRange(a, left, pivot - 1);\n    quickRange(a, pivot + 1, right);\n}\nvoid quickSort(std::vector<int>& values) {\n    if (!values.empty()) quickRange(values, 0, static_cast<int>(values.size()) - 1);\n}' },
    { id: 'dsa-merge-sort-c3', title: 'Iterative-sift Heap Sort', difficulty: 'Medium', language: 'cpp', prompt: 'Sort ascending by building a max heap and repeatedly extracting its root.', starter: '#include <vector>\nvoid heapSort(std::vector<int>& values) {\n    // heapify, then extract\n}\n', examples: [{ input: '{6,4,5,1}', output: '{1,4,5,6}' }], hints: ['Children of root are 2*root+1 and +2.', 'Sift only inside the current heap size.'], referenceSolution: 'void siftDown(std::vector<int>& a, int root, int size) {\n    while (true) {\n        int largest = root;\n        const int left = 2 * root + 1, right = left + 1;\n        if (left < size && a[left] > a[largest]) largest = left;\n        if (right < size && a[right] > a[largest]) largest = right;\n        if (largest == root) return;\n        std::swap(a[root], a[largest]);\n        root = largest;\n    }\n}\nvoid heapSort(std::vector<int>& values) {\n    const int size = static_cast<int>(values.size());\n    for (int root = size / 2 - 1; root >= 0; --root) siftDown(values, root, size);\n    for (int end = size - 1; end > 0; --end) {\n        std::swap(values[0], values[end]);\n        siftDown(values, 0, end);\n    }\n}' },
  ],
  resources: [
    { title: 'cppreference: std::sort', url: 'https://en.cppreference.com/w/cpp/algorithm/sort', kind: 'web' },
    { title: 'cppreference: std::stable_sort', url: 'https://en.cppreference.com/w/cpp/algorithm/stable_sort', kind: 'web' },
  ],
}
