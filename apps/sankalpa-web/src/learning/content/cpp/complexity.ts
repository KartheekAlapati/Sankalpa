import type { Topic } from '../../types'

export const dsaComplexity: Topic = {
  id: 'dsa-complexity', title: 'Time and Space Complexity',
  summary: 'Compare algorithm growth using input size, asymptotic bounds, cases, loop counts, auxiliary space, and elementary recurrences.',
  prerequisiteTopicIds: ['cpp-functions'], crossLinkTopicIds: ['cpp-arrays','cpp-vectors','cpp-strings','dsa-recurrences'],
  lessons: [
    { id: 'dsa-complexity-bounds', title: 'Input size and asymptotic bounds', durationMinutes: 45,
      objectives: ['Define time and auxiliary-space complexity', 'Distinguish O, Theta and Omega', 'Separate bounds from input cases'],
      theory: ['Complexity models how resource use grows with an input-size measure n. It counts dominant operations or storage rather than stopwatch seconds, making comparisons less dependent on a particular machine.', 'Big-O is an asymptotic upper bound, Big-Omega a lower bound, and Big-Theta a matching upper and lower bound. Saying a loop is Theta(n) is stronger than merely O(n). Constants and lower-order terms do not change the asymptotic class.', 'Best, average, and worst cases describe which inputs are considered. O/Theta/Omega describe bounds on a chosen function. They are not synonyms: linear search has best-case Theta(1) and worst-case Theta(n).'],
      examples: [{ title: 'Linear search cases', problem: 'Analyze search across n values.', walkthrough: ['First item matches: one comparison.', 'Absent or last item: n comparisons.', 'Choose which input case is being analyzed before stating a bound.'], result: 'Best Theta(1), worst Theta(n), and O(n) is a valid upper bound for all cases.' }] },
    { id: 'dsa-complexity-growth', title: 'Growth classes and loop analysis', durationMinutes: 50,
      objectives: ['Order common growth rates', 'Analyze nested and independent loops', 'Recognize logarithmic halving'],
      theory: ['Common growth classes are O(1), O(log n), O(n), O(n log n), O(n²), O(2^n), and O(n!). Polynomial, exponential, and factorial growth separate dramatically as n grows.', 'Sequential independent loops add: n+n is Theta(n). Fully nested n-by-n loops multiply to Theta(n²). If i doubles each iteration until n, the iteration count is Theta(log n).', 'A loop bound that depends on another loop needs its own sum. A triangle performs 1+2+...+n = n(n+1)/2 operations, which is Theta(n²).'],
      examples: [{ title: 'Independent versus nested', problem: 'Compare two n loops in sequence with one n loop inside another.', walkthrough: ['Sequential work is n+n=2n.', 'Nested work is n*n.', 'Drop constant factors but not exponents.'], result: 'Sequential is Theta(n); nested is Theta(n²).' }] },
    { id: 'dsa-complexity-space-recurrence', title: 'Space, containers and basic recurrences', durationMinutes: 50,
      objectives: ['Distinguish input and auxiliary space', 'Recall basic container operation costs', 'Expand simple recurrences'],
      theory: ['Auxiliary space counts extra workspace beyond the input representation. A few scalar variables use O(1); a copied array of n values uses O(n). Recursion also consumes call-stack frames.', 'Array/string indexed access is O(1); scanning is O(n). vector push_back is amortized O(1), while insertion near the front is O(n) because elements shift. String concatenation that copies n characters is O(n).', 'A recurrence describes recursive work. T(n)=T(n-1)+O(1) expands to O(n). T(n)=T(n/2)+O(1) expands to O(log n). T(n)=2T(n-1)+O(1) grows exponentially. This is an introduction, not a full recurrence-solving method.'],
      examples: [{ title: 'Recursive countdown', problem: 'Analyze a function that calls itself once with n-1 and otherwise does constant work.', walkthrough: ['Write T(n)=T(n-1)+c.', 'Expand through n, n-1, ..., 1.', 'There are n frames, each with constant local storage.'], result: 'Theta(n) time and Theta(n) call-stack auxiliary space.' }] },
  ],
  checklist: ['I define the input size before analyzing.', 'I distinguish O, Theta, and Omega.', 'I keep cases separate from bound notation.', 'I add sequential work and multiply full nesting.', 'I count recursion stack as auxiliary space.'],
  commonMistakes: ['Calling Big-O the exact running time.', 'Equating Big-O with worst case in every statement.', 'Multiplying independent sequential loops.', 'Ignoring a recursive call stack in space analysis.', 'Dropping an exponent as though it were a constant.', 'Claiming vector push_back is worst-case O(1) rather than amortized O(1).'],
  revisionGuidance: ['Order seven common growth classes without notes.', 'Analyze one sequential, nested, triangular, and halving loop.', 'State both time and auxiliary space for every coding exercise reviewed this week.'],
  practiceExercises: [
    { id: 'dsa-complexity-p1', title: 'Independent loops', prompt: 'One loop runs n times and a later loop runs 3n times. Give a tight bound.', difficulty: 'Easy', hints: ['Add work.', 'Ignore constant factors only at the end.'], solution: 'Theta(n).', explanation: 'n+3n=4n, whose tight asymptotic growth is linear.' },
    { id: 'dsa-complexity-p2', title: 'Halving loop', prompt: 'Analyze for (int x=n; x>1; x/=2).', difficulty: 'Easy', hints: ['Count how many halvings reach 1.'], solution: 'Theta(log n) time and Theta(1) auxiliary space.', explanation: 'After k iterations x is roughly n/2^k, so k grows logarithmically.' },
    { id: 'dsa-complexity-p3', title: 'Copied input', prompt: 'A function copies n integers and then scans the copy once. Give time and auxiliary-space bounds.', difficulty: 'Easy', hints: ['Both phases are linear.', 'The copy remains stored.'], solution: 'Theta(n) time and Theta(n) auxiliary space.', explanation: 'Sequential linear phases add, while the copied n elements require linear extra storage.' },
  ],
  mcqs: [
    { id: 'dsa-complexity-m1', prompt: 'Which notation expresses a tight asymptotic bound?', options: ['Theta', 'Only Big-O', 'Only Omega', 'Milliseconds'], answer: 0, explanation: 'Theta supplies matching asymptotic upper and lower bounds.' },
    { id: 'dsa-complexity-m2', prompt: 'What is the tight bound for two independent n-length loops?', options: ['Theta(n)', 'Theta(n²)', 'Theta(log n)', 'Theta(1)'], answer: 0, explanation: 'The operation counts add to a constant multiple of n.' },
    { id: 'dsa-complexity-m3', prompt: 'What is the tight bound for an n by n full nested loop?', options: ['Theta(n²)', 'Theta(n)', 'Theta(2n)', 'Theta(log n)'], answer: 0, explanation: 'The inner body runs n times for each of n outer iterations.' },
    { id: 'dsa-complexity-m4', prompt: 'What is vector push_back normally described as?', options: ['Amortized O(1)', 'Worst-case always O(1)', 'O(log n)', 'O(n²)'], answer: 0, explanation: 'Most appends are constant, while occasional capacity growth is linear, yielding amortized constant cost.' },
    { id: 'dsa-complexity-m5', prompt: 'For T(n)=T(n-1)+O(1), what is the resulting growth?', options: ['O(n)', 'O(log n)', 'O(2^n)', 'O(n!)'], answer: 0, explanation: 'The recurrence performs a chain of n constant-work calls.' },
  ],
  coding: [
    { id: 'dsa-complexity-c1', title: 'Constant-space maximum', difficulty: 'Easy', language: 'cpp', prompt: 'Return the maximum of a non-empty vector in Theta(n) time and Theta(1) auxiliary space.', starter: '#include <vector>\nint maximumValue(const std::vector<int>& values) {\n    // one scan, no copy\n}\n', examples: [{ input: '{3,8,2}', output: '8' }], hints: ['Initialize from the first element.', 'Keep one running best.'], referenceSolution: 'int maximumValue(const std::vector<int>& values) {\n    int best = values[0];\n    for (std::size_t i = 1; i < values.size(); ++i) {\n        if (values[i] > best) best = values[i];\n    }\n    return best;\n}' },
    { id: 'dsa-complexity-c2', title: 'Count halving steps', difficulty: 'Easy', language: 'cpp', prompt: 'For positive n, return how many integer divisions by 2 are required until n becomes at most 1.', starter: 'int halvingSteps(int n) {\n    // n is positive\n}\n', examples: [{ input: '8', output: '3' }, { input: '1', output: '0' }], hints: ['Use a while loop.', 'Each iteration divides n by 2.'], referenceSolution: 'int halvingSteps(int n) {\n    int steps = 0;\n    while (n > 1) {\n        n /= 2;\n        ++steps;\n    }\n    return steps;\n}' },
  ],
  resources: [
    { title: 'GeeksforGeeks: Time and Space Complexity', url: 'https://www.geeksforgeeks.org/dsa/time-complexity-and-space-complexity/', kind: 'web' },
    { title: 'GeeksforGeeks: Time Complexity with Simple Examples', url: 'https://www.geeksforgeeks.org/dsa/understanding-time-complexity-simple-examples/', kind: 'web' },
  ],
}
