import type { Topic } from '../../types'

export const dsaRunningMedian: Topic = {
  id: 'dsa-running-median',
  title: 'Streaming Selection and Running Median',
  summary: 'Maintain order statistics incrementally with two heaps, explicit balance and ordering invariants, safe averaging, and honest alternatives.',
  prerequisiteTopicIds: ['dsa-priority-queue'],
  crossLinkTopicIds: ['dsa-top-k', 'dsa-balanced-trees'],
  lessons: [
    {
      id: 'dsa-running-median-derivation', title: 'From sorted prefixes to two heaps', durationMinutes: 65,
      objectives: ['Derive the two-heap design', 'Maintain ordering and balance invariants', 'Compute odd and even medians safely'],
      theory: [
        'A baseline inserts each new value into a sorted vector. Binary search finds the position in O(log n), but shifting costs O(n), so processing n stream values is O(n²). Sorting every prefix is even more work. The bottleneck is maintaining order under insertion.',
        'Split seen values into a max-heap lower half and a min-heap upper half. Maintain two invariants: every lower value is <= every upper value, and their sizes differ by at most one, with lower allowed one extra. Insert by comparing with lower.top, then rebalance one root if needed.',
        'When the count is odd, lower.top is the median under this size convention. When even, the median is the average of both tops. Convert before addition or use a wider type so two extreme int values cannot overflow.',
      ],
      examples: [
        { title: 'Running median trace', problem: 'Process 5, 2, 10, 4.', walkthrough: ['5 → lower [5], median 5.', '2 enters lower; move 5 to upper → tops 2 and 5, median 3.5.', '10 enters upper; move 5 to lower → lower top 5, median 5.', '4 enters lower; move 5 to upper → tops 4 and 5, median 4.5.'], result: 'Medians are 5, 3.5, 5, 4.5 while both invariants hold.' },
        { title: 'Overflow-safe average', problem: 'Median of INT_MAX and INT_MAX.', walkthrough: ['Both middle values fit int.', 'Their int sum does not fit signed int.', 'Convert each top to double before adding, or sum in long long.', 'Divide the widened result by 2.0.'], result: 'Median is 2147483647 without signed overflow.' },
      ],
    },
    {
      id: 'dsa-running-median-correctness', title: 'Correctness, duplicates, and alternatives', durationMinutes: 55,
      objectives: ['Prove median correctness from invariants', 'Handle duplicates and negatives', 'Choose alternatives for deletion or offline data'],
      theory: [
        'The ordering invariant makes every lower element no greater than every upper element. The balance invariant places the middle rank at lower.top for odd size, or between both tops for even size. Together they establish correctness; heap shape alone would not.',
        'Duplicates and negative values require no special case. A value equal to lower.top may enter either side if rebalancing restores the invariants. Deterministic insertion rules simplify tests but do not change the median.',
        'Two heaps support O(log n) insertion and O(1) median with O(n) storage, but arbitrary deletion is difficult. Sliding-window median often needs lazy deletion maps or a balanced multiset. For fixed offline data and one median query, selection or sorting may be simpler.',
      ],
      examples: [
        { title: 'Duplicates and negatives', problem: 'Process -2, -2, 7.', walkthrough: ['First -2 occupies lower.', 'Second -2 is rebalanced into upper; both tops are -2.', '7 enters upper, so move upper top -2 into lower.', 'Lower has two values and upper one.'], result: 'Medians are -2, -2, -2; duplicates preserve rank counts.' },
        { title: 'Wrong balance counterexample', problem: 'Lower contains [9,8,7] and upper contains [10] with four total values.', walkthrough: ['Ordering holds because all lower values are <= 10.', 'Size difference is two, so balance fails.', 'Averaging tops 9 and 10 gives 9.5.', 'Sorted data [7,8,9,10] has median 8.5.'], result: 'Ordering alone is insufficient; balance is essential.' },
      ],
    },
  ],
  checklist: ['I can derive the design from sorted-prefix insertion.', 'I state both ordering and balance invariants.', 'I rebalance after every insertion.', 'I widen before averaging extreme integers.', 'I handle duplicates and negatives.', 'I know deletion requires additional machinery.'],
  commonMistakes: ['Maintaining only heap sizes but not cross-heap order.', 'Allowing a size difference greater than one.', 'Averaging int tops before widening.', 'Reading top before any insertion.', 'Assuming two heaps support arbitrary deletion directly.', 'Using this online structure for a one-time offline median without considering simpler choices.'],
  revisionGuidance: ['Trace both heaps after each value of an asymmetric stream.', 'Prove odd and even cases separately.', 'Compare two heaps, sorting, selection, and balanced multisets by required operations.'],
  practiceExercises: [
    { id: 'dsa-running-median-p1', title: 'Repair balance', prompt: 'lower has size 4 and upper size 2. What single repair is required before another query?', difficulty: 'Easy', hints: ['Move the boundary value.'], solution: 'Move lower.top into upper.', explanation: 'The maximum of the lower half is the correct boundary element to transfer while preserving order.' },
    { id: 'dsa-running-median-p2', title: 'Correctness statement', prompt: 'Why do the two invariants locate the middle ranks?', difficulty: 'Medium', hints: ['Use order first, then sizes.'], solution: 'Order places all lower ranks before all upper ranks; balance fixes how many ranks lie in each half.', explanation: 'Thus the boundary top or pair of tops is exactly the median position.' },
  ],
  mcqs: [
    { id: 'dsa-running-median-m1', difficulty: 'Easy', prompt: 'What stores the lower half?', options: ['Max-heap', 'Min-heap', 'FIFO queue', 'Unordered set only'], answer: 0, explanation: 'The lower half needs its largest boundary value available at top.' },
    { id: 'dsa-running-median-m2', difficulty: 'Easy', prompt: 'What stores the upper half?', options: ['Min-heap', 'Max-heap', 'Stack', 'Linked list only'], answer: 0, explanation: 'The upper half needs its smallest boundary value available at top.' },
    { id: 'dsa-running-median-m3', difficulty: 'Medium', prompt: 'Which pair of invariants proves correctness?', options: ['Cross-half ordering and size balance', 'Completeness and uniqueness', 'Stability and hashing', 'FIFO order and recursion'], answer: 0, explanation: 'Order separates ranks and balance places the middle rank or ranks at the heap tops.' },
    { id: 'dsa-running-median-m4', difficulty: 'Medium', prompt: 'What is insertion complexity after n values?', options: ['O(log n)', 'O(1) worst-case', 'O(n log n) per insertion', 'O(n²)'], answer: 0, explanation: 'Insertion and at most one root transfer use logarithmic heap operations.' },
    { id: 'dsa-running-median-m5', difficulty: 'Hard', prompt: 'Why widen before averaging two int tops?', options: ['Their sum may overflow int', 'Division requires a heap', 'Duplicates are forbidden', 'The comparator changes'], answer: 0, explanation: 'Two individually valid int values can have a mathematical sum outside the int range.' },
    { id: 'dsa-running-median-m6', difficulty: 'Medium', prompt: 'What is often needed for sliding-window deletion?', options: ['Lazy deletion metadata or a balanced multiset', 'Only top()', 'A smaller vector capacity', 'Heap Sort'], answer: 0, explanation: 'Priority queues cannot directly erase arbitrary expired elements.' },
  ],
  coding: [
    { id: 'dsa-running-median-c1', title: 'Running medians', difficulty: 'Medium', language: 'cpp', prompt: 'Return the median after every inserted int. For even count, return the arithmetic mean as double. Constraints: n <= 300000 and values may be INT_MIN or INT_MAX. Target O(n log n) time and O(n) space.', starter: '#include <queue>\n#include <vector>\nstd::vector<double> runningMedians(const std::vector<int>& stream) {\n    // max-heap lower, min-heap upper\n}', examples: [{ input: '{5,2,10,4}', output: '{5,3.5,5,4.5}' }, { input: '{}', output: '{}' }], hints: ['Keep lower the same size as upper or one larger.', 'Convert tops before addition.'], referenceSolution: 'std::vector<double> runningMedians(const std::vector<int>& stream){std::priority_queue<int> lower;std::priority_queue<int,std::vector<int>,std::greater<int>> upper;std::vector<double> out;for(int value:stream){if(lower.empty()||value<=lower.top())lower.push(value);else upper.push(value);if(lower.size()>upper.size()+1){upper.push(lower.top());lower.pop();}else if(upper.size()>lower.size()){lower.push(upper.top());upper.pop();}if(lower.size()==upper.size())out.push_back((static_cast<double>(lower.top())+static_cast<double>(upper.top()))/2.0);else out.push_back(lower.top());}return out;}' },
    { id: 'dsa-running-median-c2', title: 'Median tracker class', difficulty: 'Medium', language: 'cpp', prompt: 'Implement add(int), empty(), size(), and median(). median must throw std::out_of_range when empty. Constraints: at most 300000 additions. Preserve both invariants after each add.', starter: '#include <queue>\n#include <stdexcept>\n#include <vector>\nclass MedianTracker {\n    std::priority_queue<int> lower_;\n    std::priority_queue<int,std::vector<int>,std::greater<int>> upper_;\npublic:\n    void add(int value);\n    double median() const;\n};', examples: [{ input: 'add -2, add 7, median', output: '2.5' }, { input: 'median before add', output: 'throws std::out_of_range' }], hints: ['Use lower size as the extra element on odd counts.', 'Do not add two int tops before conversion.'], referenceSolution: 'void MedianTracker::add(int value){if(lower_.empty()||value<=lower_.top())lower_.push(value);else upper_.push(value);if(lower_.size()>upper_.size()+1){upper_.push(lower_.top());lower_.pop();}else if(upper_.size()>lower_.size()){lower_.push(upper_.top());upper_.pop();}}\ndouble MedianTracker::median()const{if(lower_.empty())throw std::out_of_range("empty tracker");if(lower_.size()!=upper_.size())return lower_.top();return(static_cast<double>(lower_.top())+static_cast<double>(upper_.top()))/2.0;}' },
  ],
  resources: [{ title: 'cppreference: priority_queue', url: 'https://en.cppreference.com/w/cpp/container/priority_queue', kind: 'web' }],
}
