import type { Topic } from '../../types'

export const dsaPriorityQueues: Topic = {
  id: 'dsa-priority-queue',
  title: 'C++ Priority Queues and Scheduling',
  summary: 'Use std::priority_queue accurately, design deterministic comparators, and recognize both the power and limitations of priority-based scheduling.',
  prerequisiteTopicIds: ['dsa-heap'],
  crossLinkTopicIds: ['dsa-top-k', 'dsa-k-way-merge', 'dsa-graphs'],
  lessons: [
    {
      id: 'dsa-priority-queue-stl', title: 'std::priority_queue fundamentals', durationMinutes: 60,
      objectives: ['Configure max-heaps and min-heaps', 'Use the adaptor interface safely', 'State operation costs and limitations'],
      theory: [
        'std::priority_queue<T> is a container adaptor whose top is the largest element under std::less<T>. push and emplace insert, top observes without removal, pop removes without returning, empty and size inspect state. Never call top or pop when empty.',
        'A min-priority queue can use std::priority_queue<int,std::vector<int>,std::greater<int>>. The usual underlying container is std::vector; std::deque can also satisfy the required random-access operations. top is O(1), and push, emplace, and pop are O(log n).',
        'The adaptor does not generally expose iteration, arbitrary-element deletion, decrease-key, or update-in-place. Reinserted stale entries can be skipped when popped if the algorithm keeps an authoritative current-version table; this trades extra memory and pops for a simpler interface.',
      ],
      examples: [
        { title: 'Max and min behavior', problem: 'Push 4, 1, 7, 7 into default and greater-based queues.', walkthrough: ['Default top becomes 7.', 'After one default pop, the duplicate 7 remains top.', 'The greater-based queue puts 1 at top.', 'After its pop, 4 becomes top.'], result: 'Duplicates are retained; comparator configuration determines the extreme at top.' },
        { title: 'Stale-entry strategy', problem: 'A job estimate changes from priority 8 to priority 3 after {8,id} was queued.', walkthrough: ['Record current[id]=3.', 'Push a new {3,id} entry; the old entry remains.', 'When {8,id} reaches top, compare 8 with current[id].', 'Discard it as stale and continue.'], result: 'Updates are simulated safely, with potentially more queue storage and pop work.' },
      ],
    },
    {
      id: 'dsa-priority-queue-comparators', title: 'Comparators, pairs, and priority scheduling', durationMinutes: 65,
      objectives: ['Write a strict comparator', 'Define deterministic tie-breaking', 'Model eligible-task scheduling honestly'],
      theory: [
        'For priority_queue, Compare(a,b) returning true means a has lower priority than b and may appear below it. It does not directly mean “a comes before b in output.” A comparator must be a strict weak ordering: never return true for equal objects and avoid <=.',
        'std::pair uses lexicographic ordering, so a default queue prioritizes the greater first field, then greater second field. For records, define every tie explicitly—for example higher priority first, earlier submission first, then smaller stable ID—to make results deterministic.',
        'A heap is suitable when the next eligible highest-priority task is repeatedly selected. Static priority scheduling is simpler than release-time, deadline, cooldown, or dependency scheduling; those constraints need additional event sorting, queues, or feasibility logic. A heap alone does not prove a greedy choice is globally optimal.',
      ],
      examples: [
        { title: 'Comparator trace', problem: 'Jobs A=(priority 5, arrival 2) and B=(priority 5, arrival 1) should run earliest arrival first.', walkthrough: ['Priorities tie.', 'A arrived later, so A must have lower queue priority.', 'Comparator(A,B) returns true.', 'B becomes top; a final ID tie-break handles equal arrival.'], result: 'The comparator encodes higher numeric priority, then earlier arrival, then stable ID.' },
        { title: 'Scheduling boundary', problem: 'Task X has priority 10 but release time 8; Y has priority 4 and is available at time 3.', walkthrough: ['At time 3, X is not eligible and must not enter the ready heap.', 'Insert Y into the ready heap and run it according to the stated policy.', 'At time 8, move X from the release-ordered source into the ready heap.', 'Priority applies only among currently eligible tasks.'], result: 'Release ordering and ready-task priority are distinct responsibilities.' },
      ],
    },
  ],
  checklist: ['I know default priority_queue is a max-heap.', 'I guard top and pop with empty.', 'I can explain comparator semantics.', 'I provide deterministic tie-breaks.', 'I know arbitrary deletion and decrease-key are absent.', 'I separate eligibility from priority.'],
  commonMistakes: ['Assuming pop returns the removed value.', 'Calling top after the final pop.', 'Using <= in a comparator.', 'Reversing comparator meaning by intuition alone.', 'Depending on unspecified tie order.', 'Putting unreleased tasks into the ready heap.'],
  revisionGuidance: ['Write the same integer queue as max-heap and min-heap.', 'Predict top for three tied records before running code.', 'List cases where a heap needs an accompanying map or event order.'],
  practiceExercises: [
    { id: 'dsa-priority-queue-p1', title: 'Comparator counterexample', prompt: 'Why is return a.priority <= b.priority invalid?', difficulty: 'Medium', hints: ['Evaluate compare(x,x).'], solution: 'It returns true for equal priorities and violates irreflexivity.', explanation: 'Heap algorithms require a strict weak ordering; an object cannot rank below itself.' },
    { id: 'dsa-priority-queue-p2', title: 'Choose a simpler tool', prompt: 'All jobs are known once and only one globally sorted output is required. Is a heap automatically better than sorting?', difficulty: 'Easy', hints: ['Compare output size and constant factors.'], solution: 'No. Sorting once is often simpler and has the same O(n log n) asymptotic time.', explanation: 'Heaps shine for incremental arrivals or partial repeated selection, not every ordering problem.' },
  ],
  mcqs: [
    { id: 'dsa-priority-queue-m1', difficulty: 'Easy', prompt: 'What does std::priority_queue<int> expose at top by default?', options: ['Largest value', 'Smallest value', 'Oldest value', 'Most recently inserted value'], answer: 0, explanation: 'The default std::less comparator produces max-priority behavior for integers.' },
    { id: 'dsa-priority-queue-m2', difficulty: 'Easy', prompt: 'Which operation removes the top?', options: ['pop()', 'top()', 'erase(0)', 'extract()'], answer: 0, explanation: 'pop removes but returns void; read top first when the value is needed.' },
    { id: 'dsa-priority-queue-m3', difficulty: 'Medium', prompt: 'What does Compare(a,b)==true mean for the adaptor?', options: ['a has lower priority than b', 'a must be returned immediately', 'a equals b', 'a was inserted earlier'], answer: 0, explanation: 'The comparator reports that a comes after b in the priority ordering used by the adaptor.' },
    { id: 'dsa-priority-queue-m4', difficulty: 'Easy', prompt: 'Which operation is generally unsupported directly?', options: ['Decrease-key for an arbitrary stored item', 'push', 'top', 'size'], answer: 0, explanation: 'The adaptor exposes only its top and does not provide handles for arbitrary updates.' },
    { id: 'dsa-priority-queue-m5', difficulty: 'Medium', prompt: 'What is a sound deterministic tie-break?', options: ['Priority, then arrival, then stable ID', 'Memory address', 'No rule at all', 'A comparator using <='], answer: 0, explanation: 'Explicit immutable fields produce repeatable ordering without violating comparator requirements.' },
    { id: 'dsa-priority-queue-m6', difficulty: 'Hard', prompt: 'When is a stale-entry strategy valid?', options: ['When popped entries can be checked against authoritative current state', 'When top is called on empty', 'When no versions are recorded', 'When all stale entries must execute'], answer: 0, explanation: 'The current-state table lets the algorithm recognize and discard outdated queued copies.' },
  ],
  coding: [
    { id: 'dsa-priority-queue-c1', title: 'Deterministic static-priority scheduler', difficulty: 'Medium', language: 'cpp', prompt: 'Return job IDs in execution order. Higher priority runs first; ties use earlier arrival, then lexicographically smaller ID. All jobs are eligible at time zero. Constraints: 0 <= n <= 200000. Target O(n log n) time.', starter: '#include <queue>\n#include <string>\n#include <vector>\nstruct Job { std::string id; int priority; int arrival; };\nstd::vector<std::string> schedule(const std::vector<Job>& jobs) {\n    // define a strict comparator\n}', examples: [{ input: '{B,5,1},{A,5,1},{C,7,3}', output: 'C,A,B' }, { input: 'empty', output: 'empty' }], hints: ['priority descending, arrival ascending, ID ascending.', 'Comparator returns true when the left job has lower queue priority.'], referenceSolution: 'std::vector<std::string> schedule(const std::vector<Job>& jobs){struct Lower{bool operator()(const Job& a,const Job& b)const{if(a.priority!=b.priority)return a.priority<b.priority;if(a.arrival!=b.arrival)return a.arrival>b.arrival;return a.id>b.id;}};std::priority_queue<Job,std::vector<Job>,Lower> ready;for(const Job& job:jobs)ready.push(job);std::vector<std::string> out;while(!ready.empty()){out.push_back(ready.top().id);ready.pop();}return out;}' },
    { id: 'dsa-priority-queue-c2', title: 'Release-time priority order', difficulty: 'Hard', language: 'cpp', prompt: 'Non-preemptive unit jobs have release time, priority, and ID. At each integer time, execute the highest-priority released job; ties use smaller ID. If none is ready, jump to the next release. Return execution IDs. Constraints: n <= 200000. Target O(n log n).', starter: '#include <algorithm>\n#include <queue>\n#include <string>\n#include <vector>\nstruct TimedJob { std::string id; int release; int priority; };\nstd::vector<std::string> run(std::vector<TimedJob> jobs) {\n    // sort releases, heap only eligible jobs\n}', examples: [{ input: 'A release 3 priority 9; B release 0 priority 2', output: 'B,A' }, { input: 'A and B release 0 priority 4', output: 'A,B' }], hints: ['Sort by release before using the ready heap.', 'Advance time after each unit job.'], referenceSolution: 'std::vector<std::string> run(std::vector<TimedJob> jobs){std::sort(jobs.begin(),jobs.end(),[](const auto&a,const auto&b){return a.release<b.release||(a.release==b.release&&a.id<b.id);});struct Lower{bool operator()(const TimedJob&a,const TimedJob&b)const{return a.priority!=b.priority?a.priority<b.priority:a.id>b.id;}};std::priority_queue<TimedJob,std::vector<TimedJob>,Lower> ready;std::vector<std::string> out;std::size_t i=0;long long time=0;while(i<jobs.size()||!ready.empty()){if(ready.empty()&&time<jobs[i].release)time=jobs[i].release;while(i<jobs.size()&&jobs[i].release<=time)ready.push(jobs[i++]);out.push_back(ready.top().id);ready.pop();++time;}return out;}' },
  ],
  resources: [{ title: 'cppreference: std::priority_queue', url: 'https://en.cppreference.com/w/cpp/container/priority_queue', kind: 'web' }],
}
