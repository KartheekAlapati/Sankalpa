import type { Topic } from '../../types'

export const dsaHeaps: Topic = {
  id: 'dsa-heap',
  title: 'Binary Heaps and Heap Operations',
  summary: 'Build min-heaps and max-heaps from first principles, preserve their representation invariant, and derive sift operations, linear-time heap construction, and Heap Sort.',
  prerequisiteTopicIds: ['dsa-trees', 'cpp-vectors', 'dsa-complexity'],
  crossLinkTopicIds: ['dsa-merge-sort', 'dsa-heap-sort', 'dsa-priority-queue'],
  lessons: [
    {
      id: 'dsa-heap-representation', title: 'Complete trees, ordering, and array representation', durationMinutes: 60,
      objectives: ['Define a binary heap invariant', 'Map a complete tree to an array', 'Distinguish heaps from BSTs and sorted arrays'],
      theory: [
        'A binary heap is a complete binary tree with a local ordering rule. In a min-heap every parent is no greater than its children; in a max-heap every parent is no smaller. Completeness fixes the shape, while the ordering rule constrains each edge.',
        'This course implements zero-based storage: for i > 0 the parent is (i - 1) / 2, and children are 2*i + 1 and 2*i + 2. Check child < size before reading it. A one-based implementation instead uses parent i/2 and children 2*i and 2*i+1; never mix conventions.',
        'A heap is not a BST: the left child need not be smaller than the right, and descendants are only constrained through their parent chain. Its array is not generally sorted. The root is extreme in O(1), but finding an arbitrary value can still require O(n).',
      ],
      examples: [
        { title: 'Complete tree to array', problem: 'Map levels [2], [5,4], [9,7,8] into zero-based storage.', walkthrough: ['Read level order from left to right.', 'Store [2,5,4,9,7,8].', 'Index 1 has children 3 and 4: values 9 and 7.', 'Index 2 has left child 5: value 8; right index 6 is out of bounds.'], result: '[2,5,4,9,7,8] is complete and satisfies the min-heap invariant.' },
        { title: 'Heap is not sorted', problem: 'Is [1,4,2,9,7,3] a sorted array or a min-heap?', walkthrough: ['1 <= children 4 and 2.', '4 <= children 9 and 7.', '2 <= child 3.', 'Array positions 1 and 2 descend from 4 to 2, so the array is not sorted.'], result: 'It is a valid min-heap but not a sorted array.' },
      ],
    },
    {
      id: 'dsa-heap-sift-operations', title: 'Insertion, top, extraction, and invariant repair', durationMinutes: 70,
      objectives: ['Implement sift-up and sift-down', 'Handle empty and single-element heaps', 'Prove each operation preserves the invariant'],
      theory: [
        'Insertion appends at the next complete-tree position, then sifts upward while the child outranks its parent. Only that ancestor path can be invalid, so the repair is O(log n). Appending first preserves completeness.',
        'Extraction must reject an empty heap. Save the root, move the last value to index 0, remove the last slot, then sift down by swapping with the better child. Choose the smaller child for a min-heap or larger child for a max-heap; bounds must be checked before comparing children.',
        'Top reads only the root and is O(1). Extraction and insertion are O(log n) with O(1) iterative auxiliary space. Duplicates are valid because the invariant is non-strict. A single extraction from a one-element heap removes the root and performs no child access.',
      ],
      examples: [
        { title: 'Min-heap sift-up', problem: 'Insert 3 into [4,7,6,10,9].', walkthrough: ['Append 3: [4,7,6,10,9,3].', 'Parent of index 5 is 2; swap 3 and 6.', 'Now at index 2; parent is index 0, so swap 3 and 4.', 'Index 0 has no parent; stop.'], result: '[3,7,4,10,9,6], with completeness and min-order restored.' },
        { title: 'Max-heap root extraction', problem: 'Extract from [10,7,9,2,4,8].', walkthrough: ['Save 10 and move 8 to root: [8,7,9,2,4].', 'Children are 7 and 9; choose larger 9.', 'Swap to obtain [9,7,8,2,4].', 'Index 2 has no in-bounds children; stop.'], result: 'Return 10; the remaining array is a valid max-heap.' },
      ],
    },
    {
      id: 'dsa-heap-build-sort', title: 'Bottom-up heap construction and Heap Sort', durationMinutes: 70,
      objectives: ['Build a heap bottom-up', 'Explain why construction is O(n)', 'Trace in-place Heap Sort'],
      theory: [
        'All indices from floor(n/2) through n-1 are leaves in zero-based storage. Bottom-up construction sifts down internal nodes from floor(n/2)-1 to 0. When a node is processed, both child subtrees are already heaps, so one local repair makes its whole subtree a heap.',
        'Although one sift can cost O(log n), most nodes are near the leaves. At most n/2^(h+1) nodes have height h, so total work is bounded by n times the convergent sum of h/2^(h+1), which is O(n). This is not the same algorithm as n separate O(log n) insertions.',
        'Ascending Heap Sort builds a max-heap, swaps the root with the last unsorted element, shrinks the logical heap, and sifts the new root down. Construction is O(n), extraction phases total O(n log n), and the iterative array implementation uses O(1) auxiliary space. It is not stable.',
      ],
      examples: [
        { title: 'Bottom-up max-heap build', problem: 'Build a max-heap from [3,1,6,5,2,4].', walkthrough: ['Last internal index is 2; value 6 already dominates child 4.', 'At index 1, swap 1 with larger child 5: [3,5,6,1,2,4].', 'At index 0, choose 6, then compare moved 3 with child 4.', 'Final state is [6,5,4,1,2,3].'], result: 'Every parent dominates its children after linear-time bottom-up construction.' },
        { title: 'Heap Sort transitions', problem: 'Sort [4,1,3,2].', walkthrough: ['Build max-heap [4,2,3,1].', 'Swap root with end: [1,2,3,4]; sift size 3 to [3,2,1,4].', 'Swap root with index 2: [1,2,3,4]; sift size 2 to [2,1,3,4].', 'Swap the final pair.'], result: '[1,2,3,4] in O(n log n) time and O(1) iterative auxiliary space.' },
      ],
    },
  ],
  checklist: ['I can state completeness and ordering separately.', 'I use one indexing convention consistently.', 'I guard child indices before access.', 'I can trace sift-up and sift-down.', 'I can justify bottom-up construction as O(n).', 'I state Heap Sort stability and auxiliary space accurately.'],
  commonMistakes: ['Treating a heap array as fully sorted.', 'Confusing heap order with BST order.', 'Reading the right child before checking its index.', 'Calling top on an empty heap.', 'Sifting against the full array after the Heap Sort boundary shrinks.', 'Claiming bottom-up construction is O(n log n).'],
  revisionGuidance: ['Draw one complete tree and label both zero-based and one-based indices.', 'Rebuild the same values as min-heap and max-heap.', 'Explain the O(n) construction sum without relying only on memorization.'],
  practiceExercises: [
    { id: 'dsa-heap-p1', title: 'Find the convention bug', prompt: 'Code stores the root at index 0 but calculates children as 2*i and 2*i+1. Explain the error.', difficulty: 'Easy', hints: ['Those formulas belong to another root index.'], solution: 'Use 2*i+1 and 2*i+2 for zero-based storage.', explanation: 'At i=0, the faulty left formula points back to the root and breaks traversal.' },
    { id: 'dsa-heap-p2', title: 'Counterexample to sortedness', prompt: 'Give a valid min-heap array that is not ascending.', difficulty: 'Easy', hints: ['Sibling order is unconstrained.'], solution: '[1,4,2] is valid but not sorted.', explanation: 'The root is no greater than both children; no rule requires 4 <= 2.' },
  ],
  mcqs: [
    { id: 'dsa-heap-m1', difficulty: 'Easy', prompt: 'What two properties define a binary heap?', options: ['Complete shape and heap ordering', 'BST ordering and balance', 'Sorted array and uniqueness', 'Full shape and stable order'], answer: 0, explanation: 'A binary heap combines a complete-tree shape with a local parent-child ordering invariant.' },
    { id: 'dsa-heap-m2', difficulty: 'Easy', prompt: 'For zero-based index i, what is the left child index?', options: ['2*i+1', '2*i', 'i/2', '2*i-1'], answer: 0, explanation: 'Zero-based storage uses left 2*i+1 and right 2*i+2, subject to bounds checks.' },
    { id: 'dsa-heap-m3', difficulty: 'Medium', prompt: 'Why can insertion repair only the ancestor path?', options: ['Appending changes completeness only at the end and can violate order only with ancestors', 'Every subtree must be rebuilt', 'The array becomes sorted', 'Insertion never violates heap order'], answer: 0, explanation: 'All old edges remain valid; only the new node and its successive parents can violate ordering.' },
    { id: 'dsa-heap-m4', difficulty: 'Easy', prompt: 'What is the time complexity of reading a non-empty heap top?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], answer: 0, explanation: 'The extreme element is stored at the root, which is array index zero.' },
    { id: 'dsa-heap-m5', difficulty: 'Hard', prompt: 'Why is bottom-up heap construction O(n)?', options: ['Most nodes have small height, so the weighted sift costs form a convergent sum', 'Every sift is O(1)', 'It performs no comparisons', 'It inserts only log n values'], answer: 0, explanation: 'Few nodes can travel far, while many leaves do no work; summing by height gives a linear bound.' },
    { id: 'dsa-heap-m6', difficulty: 'Medium', prompt: 'Which statement about iterative in-place Heap Sort is correct?', options: ['O(n log n) time, O(1) auxiliary space, not stable', 'O(n) time and stable', 'O(log n) time', 'O(n²) auxiliary space'], answer: 0, explanation: 'Repeated root extraction costs O(n log n); swaps make the algorithm unstable and iteration keeps extra space constant.' },
  ],
  coding: [
    { id: 'dsa-heap-c1', title: 'Safe array-backed min-heap', difficulty: 'Medium', language: 'cpp', prompt: 'Implement push, top, pop, empty, and size for an integer min-heap. top and pop must throw std::out_of_range when empty. Constraints: at most 200000 operations; values fit int. Preserve completeness and parent <= child after every operation. Output is defined by the caller operations.', starter: '#include <stdexcept>\n#include <vector>\nclass MinHeap {\n    std::vector<int> data_;\npublic:\n    void push(int value);\n    int top() const;\n    int pop();\n    bool empty() const { return data_.empty(); }\n    std::size_t size() const { return data_.size(); }\n};', examples: [{ input: 'push 4, push -1, push -1, pop, top', output: '-1 then -1' }, { input: 'pop on empty', output: 'throws std::out_of_range' }], hints: ['Append then compare with (i-1)/2.', 'After moving the last value to root, choose the smaller in-bounds child.'], referenceSolution: 'void MinHeap::push(int value) { data_.push_back(value); std::size_t i=data_.size()-1; while(i>0){const std::size_t p=(i-1)/2; if(data_[p]<=data_[i]) break; std::swap(data_[p],data_[i]); i=p;} }\nint MinHeap::top() const { if(data_.empty()) throw std::out_of_range("empty heap"); return data_[0]; }\nint MinHeap::pop() { const int answer=top(); data_[0]=data_.back(); data_.pop_back(); std::size_t i=0; while(i<data_.size()){const std::size_t left=2*i+1; if(left>=data_.size()) break; const std::size_t right=left+1; const std::size_t child=right<data_.size()&&data_[right]<data_[left]?right:left; if(data_[i]<=data_[child]) break; std::swap(data_[i],data_[child]); i=child;} return answer; }' },
    { id: 'dsa-heap-c2', title: 'In-place ascending Heap Sort', difficulty: 'Medium', language: 'cpp', prompt: 'Sort a vector ascending with an iterative max-heap. Constraints: 0 <= n <= 200000; values fit int and may repeat or be negative. Return no output beyond the modified vector. Target O(n log n) time and O(1) auxiliary space.', starter: '#include <vector>\nvoid heapSort(std::vector<int>& values) {\n    // build a max-heap, then shrink it\n}', examples: [{ input: '{4,-2,4,0}', output: '{-2,0,4,4}' }, { input: '{}', output: '{}' }], hints: ['Sift internal nodes from n/2 down to zero.', 'During extraction pass the logical heap size, not vector.size().'], referenceSolution: 'static void siftDown(std::vector<int>& a,std::size_t root,std::size_t size){while(root<size){const std::size_t left=2*root+1;if(left>=size)return;const std::size_t right=left+1;std::size_t child=left;if(right<size&&a[right]>a[left])child=right;if(a[root]>=a[child])return;std::swap(a[root],a[child]);root=child;}}\nvoid heapSort(std::vector<int>& values){for(std::size_t i=values.size()/2;i>0;--i)siftDown(values,i-1,values.size());for(std::size_t end=values.size();end>1;--end){std::swap(values[0],values[end-1]);siftDown(values,0,end-1);}}' },
  ],
  resources: [{ title: 'cppreference: heap operations', url: 'https://en.cppreference.com/w/cpp/algorithm.html', kind: 'web' }],
}
