import type { Topic } from '../../types'

export const dsaQueuesDeques: Topic = {
  id: 'dsa-queue',
  title: 'Queues, Circular Queues, and Deques',
  summary: 'Model FIFO processing, reuse bounded storage with modulo arithmetic, and apply double-ended queues without confusing them with priority queues.',
  prerequisiteTopicIds: ['dsa-adt', 'cpp-vectors'],
  crossLinkTopicIds: ['dsa-circular-queue', 'dsa-deque', 'dsa-bfs', 'dsa-monotonic-queue', 'dsa-sliding-window'],
  lessons: [
    {
      id: 'dsa-queue-adt', title: 'Queue ADT and implementations', durationMinutes: 55,
      objectives: ['Explain FIFO operations', 'Compare array and linked queue representations', 'Use std::queue with safe empty checks'],
      theory: [
        'A queue serves first in, first out. enqueue adds at the rear, dequeue removes from the front, and front reads the oldest remaining item. A rear accessor reads the newest item when the interface provides one.',
        'A linked queue keeps head and tail pointers, adding at tail and removing at head in O(1). A simple fixed linear array can also use front and rear indices, but cells before front may become unusable even when physical capacity remains.',
        'std::queue is a container adaptor, using std::deque by default. front, back, and pop require a non-empty queue. Typical queue operations are O(1); traversing or searching is not part of the minimal queue ADT.',
      ],
      examples: [{ title: 'Service order', problem: 'Trace enqueue A, enqueue B, dequeue, enqueue C.', walkthrough: ['Queue is [A].', 'Queue is [A,B].', 'Dequeue removes A, leaving [B].', 'Enqueue C gives [B,C].'], result: 'B is at the front and C at the rear.' }],
    },
    {
      id: 'dsa-circular-queue-wraparound', title: 'Circular queues and modulo indexing', durationMinutes: 60,
      objectives: ['Explain wasted capacity in a linear fixed queue', 'Compute wrapped physical indices', 'Distinguish empty and full states safely'],
      theory: [
        'A circular queue treats a fixed array as a ring. Logical position offset from head maps to (head + offset) % capacity, allowing new items to reuse cells freed near the beginning.',
        'Track element count or reserve one slot so empty and full are distinguishable. With a count, empty means size == 0 and full means size == capacity. Capacity zero must be rejected before modulo operations.',
        'Enqueue writes at (head + size) % capacity and increments size. Dequeue reads at head, advances head = (head + 1) % capacity, and decrements size. Both are O(1).',
      ],
      examples: [{ title: 'Wraparound dry run', problem: 'Capacity 4: enqueue 10,20,30; dequeue twice; enqueue 40,50,60.', walkthrough: ['Initial physical cells hold 10,20,30; head is 0.', 'Removing 10 and 20 moves head to 2; logical queue is [30].', '40 goes at index 3, 50 wraps to index 0, and 60 goes to index 1.'], result: 'Logical order is [30,40,50,60], using all four cells without shifting.' }],
    },
    {
      id: 'dsa-deque-applications', title: 'Deques, priority queues, and applications', durationMinutes: 60,
      objectives: ['Use both ends of a deque', 'Distinguish deque order from priority order', 'Connect queues to BFS and monotonic-window processing'],
      theory: [
        'A deque, pronounced deck, supports insertion and removal at both front and back. std::deque provides random access and efficient end operations, but its storage is not required to be one contiguous block.',
        'A priority queue removes the highest-priority element rather than the oldest element, so it is not a deque. Choose the abstraction from the required removal rule, not from similar method names.',
        'Breadth-first search enqueues discovered vertices and processes them in FIFO layers. A monotonic deque can hold candidate indices for sliding-window maximum: remove expired indices from the front and dominated values from the back.',
      ],
      examples: [{ title: 'Window maximum deque', problem: 'Find size-3 maxima for [1,3,-1,-3,5].', walkthrough: ['For [1,3,-1], retain index 1 for value 3 at the front; maximum 3.', 'Slide to [3,-1,-3]; index 1 remains front; maximum 3.', 'When 5 arrives, remove smaller candidates from the back until only 5 remains.'], result: 'The maxima are [3,3,5]; each index enters and leaves the deque at most once.' }],
    },
  ],
  checklist: ['I explain FIFO using front and rear.', 'I check empty before front or dequeue.', 'I can compute circular physical indices with modulo.', 'I distinguish a deque from a priority queue.', 'I can state why BFS uses a queue and window maximum uses a deque.'],
  commonMistakes: ['Calling front or pop on an empty std::queue.', 'Treating a fixed linear queue as full merely because rear reached the last index.', 'Using modulo when capacity is zero.', 'Confusing logical queue order with physical array order after wraparound.', 'Assuming a deque removes by priority.'],
  revisionGuidance: ['Trace a wrapped queue using head, size, and physical indices.', 'Classify scenarios as queue, deque, or priority queue.', 'Dry-run a monotonic deque and record every expired or dominated removal.'],
  practiceExercises: [
    { id: 'dsa-queue-p1', title: 'FIFO trace', prompt: 'After enqueue 2,4,6 and two dequeues, what is front?', difficulty: 'Easy', hints: ['Remove oldest items first.'], solution: 'The front value is 6 after the two oldest values leave.', explanation: 'The dequeues remove 2 and then 4, leaving 6 as the oldest remaining value.' },
    { id: 'dsa-queue-p2', title: 'Circular index', prompt: 'For capacity 5 and head 4, where is logical offset 2 stored?', difficulty: 'Easy', hints: ['Use (head + offset) % capacity.'], solution: 'Index 1.', explanation: '(4 + 2) % 5 equals 1, demonstrating wraparound.' },
    { id: 'dsa-queue-p3', title: 'Choose the structure', prompt: 'Which structure fits repeatedly removing the largest urgency score?', difficulty: 'Easy', hints: ['Removal depends on priority, not arrival time.'], solution: 'A priority queue.', explanation: 'A deque offers end-based removal, while a priority queue orders removal by priority.' },
  ],
  mcqs: [
    { id: 'dsa-queue-m1', prompt: 'Which order defines a queue?', options: ['First in, first out', 'Last in, first out', 'Largest first', 'Random order'], answer: 0, explanation: 'The oldest enqueued unremoved item leaves first.' },
    { id: 'dsa-queue-m2', prompt: 'Why use a circular fixed queue?', options: ['Reuse freed array cells', 'Sort values automatically', 'Avoid all bounds checks', 'Provide priority removal'], answer: 0, explanation: 'Modulo indexing wraps rear positions into cells released near the front.' },
    { id: 'dsa-queue-m3', prompt: 'With an explicit count, when is a circular queue full?', options: ['size == capacity', 'head == 0 always', 'rear is even', 'size == 0'], answer: 0, explanation: 'The element count unambiguously distinguishes the full and empty states.' },
    { id: 'dsa-queue-m4', prompt: 'Which operations does a deque support efficiently?', options: ['Insert and remove at both ends', 'Only remove maximum', 'Only push at one end', 'Matrix multiplication'], answer: 0, explanation: 'Double-ended queue operations are defined at both front and back.' },
    { id: 'dsa-queue-m5', prompt: 'Why does BFS use a queue?', options: ['Process discovered vertices in arrival order', 'Always choose largest weight', 'Reverse every path', 'Store recursive frames'], answer: 0, explanation: 'FIFO processing explores earlier-distance frontier items before later discoveries.' },
  ],
  coding: [
    { id: 'dsa-queue-c1', title: 'Bounded circular queue', difficulty: 'Medium', language: 'cpp', prompt: 'Implement an integer circular queue with validated positive capacity, enqueue, dequeue, front, empty, and full. Throw overflow_error or underflow_error where appropriate.', starter: '#include <stdexcept>\n#include <vector>\nclass CircularQueue {\n    // data, head, and size\n};\n', examples: [{ input: 'capacity 3; enqueue 1,2,3; dequeue; enqueue 4', output: 'front 2, logical order 2,3,4' }], hints: ['Insertion index is (head + size) % capacity.', 'Advance head only after reading the removed value.'], referenceSolution: 'class CircularQueue {\n    std::vector<int> data_;\n    std::size_t head_ = 0;\n    std::size_t size_ = 0;\npublic:\n    explicit CircularQueue(std::size_t capacity) : data_(capacity) {\n        if (capacity == 0) throw std::invalid_argument("capacity must be positive");\n    }\n    bool empty() const { return size_ == 0; }\n    bool full() const { return size_ == data_.size(); }\n    void enqueue(int value) {\n        if (full()) throw std::overflow_error("queue full");\n        data_[(head_ + size_) % data_.size()] = value;\n        ++size_;\n    }\n    int dequeue() {\n        if (empty()) throw std::underflow_error("queue empty");\n        const int value = data_[head_];\n        head_ = (head_ + 1) % data_.size();\n        --size_;\n        return value;\n    }\n    int front() const {\n        if (empty()) throw std::underflow_error("queue empty");\n        return data_[head_];\n    }\n};' },
    { id: 'dsa-queue-c2', title: 'Sliding-window maximum', difficulty: 'Medium', language: 'cpp', prompt: 'Return the maximum of every contiguous window of size k using a deque of indices. Reject k <= 0 or k > n.', starter: '#include <deque>\n#include <stdexcept>\n#include <vector>\nstd::vector<int> windowMax(const std::vector<int>& values, int k) {\n    // expiry at front, domination at back\n}\n', examples: [{ input: '{1,3,-1,-3,5,3,6,7}, k=3', output: '{3,3,5,5,6,7}' }], hints: ['Remove indices outside the current window.', 'Remove back values <= the new value.'], referenceSolution: 'std::vector<int> windowMax(const std::vector<int>& values, int k) {\n    if (k <= 0 || k > static_cast<int>(values.size())) throw std::invalid_argument("invalid window size");\n    std::deque<std::size_t> candidates;\n    std::vector<int> answer;\n    for (std::size_t i = 0; i < values.size(); ++i) {\n        while (!candidates.empty() && candidates.front() + static_cast<std::size_t>(k) <= i) candidates.pop_front();\n        while (!candidates.empty() && values[candidates.back()] <= values[i]) candidates.pop_back();\n        candidates.push_back(i);\n        if (i + 1 >= static_cast<std::size_t>(k)) answer.push_back(values[candidates.front()]);\n    }\n    return answer;\n}' },
  ],
  resources: [
    { title: 'cppreference: std::queue', url: 'https://en.cppreference.com/w/cpp/container/queue', kind: 'web' },
    { title: 'cppreference: std::deque', url: 'https://en.cppreference.com/w/cpp/container/deque', kind: 'web' },
    { title: 'cppreference: std::priority_queue', url: 'https://en.cppreference.com/w/cpp/container/priority_queue', kind: 'web' },
  ],
}
