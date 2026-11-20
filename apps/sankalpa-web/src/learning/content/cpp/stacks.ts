import type { Topic } from '../../types'

export const dsaStacks: Topic = {
  id: 'dsa-stack',
  title: 'Stacks and Stack Applications',
  summary: 'Use the LIFO abstraction safely, compare implementations, and apply stacks to delimiters, expressions, and next-greater patterns.',
  prerequisiteTopicIds: ['dsa-adt', 'cpp-vectors'],
  crossLinkTopicIds: ['dsa-recursion-stack', 'dsa-monotonic-stack'],
  lessons: [
    {
      id: 'dsa-stack-adt', title: 'Stack ADT and implementations', durationMinutes: 55,
      objectives: ['Explain LIFO operations and invariants', 'Implement a bounded array stack', 'Compare vector, linked, and std::stack designs'],
      theory: [
        'A stack exposes one end called the top. push adds at the top, pop removes the top, and top or peek reads it. Last in, first out means the newest unremoved item leaves first.',
        'A fixed array stack tracks the next free index or current top index and can overflow when capacity is exhausted. A vector-backed stack grows dynamically; a linked stack inserts and removes at its head. Each standard push, pop, and top operation is O(1) amortized or O(1) for the respective representation.',
        'std::stack is a container adaptor, using std::deque by default. Calling top or pop on an empty stack violates preconditions, so check empty or provide an API that throws or reports failure.',
      ],
      examples: [{ title: 'Operation table', problem: 'Trace push(4), push(7), top(), pop(), push(2).', walkthrough: ['After push 4: [4], top 4.', 'After push 7: [4,7], top 7.', 'top reads 7 without removal.', 'pop removes 7; push 2 produces [4,2].'], result: 'The final top is 2 and the bottom-to-top contents are 4,2.' }],
    },
    {
      id: 'dsa-stack-delimiters-expressions', title: 'Delimiters and expression notation', durationMinutes: 55,
      objectives: ['Validate balanced delimiters', 'Relate infix, postfix, and prefix forms', 'Use a stack for basic postfix evaluation'],
      theory: [
        'For balanced parentheses, push every opening delimiter. On a closing delimiter, the stack must be non-empty and its top must be the matching opener. At the end, the stack must be empty.',
        'Infix places an operator between operands, such as A+B. Postfix uses AB+ and prefix uses +AB. Postfix evaluation pushes operands and, for each operator, pops the right operand then the left operand before applying it.',
        'Operator precedence and associativity make full expression conversion more detailed than delimiter matching. This topic introduces the stack role; tokenization, unary operators, and error reporting need explicit rules in a production evaluator.',
      ],
      examples: [{ title: 'Balanced delimiter dry run', problem: 'Validate {[()]}.', walkthrough: ['Push {, then [, then (.', 'Read ) and pop matching (.', 'Read ] and pop [, then read } and pop {.', 'The stack is empty at the end.'], result: 'The delimiters are balanced in Theta(n) time and O(n) worst-case space.' }],
    },
    {
      id: 'dsa-stack-monotonic', title: 'Next Greater Element and the call-stack distinction', durationMinutes: 60,
      objectives: ['Compute next-greater values with a monotonic stack', 'Prove why each index is pushed and popped once', 'Distinguish a stack ADT from program call frames'],
      theory: [
        'For Next Greater Element, keep indices whose answer is not known in decreasing value order. A new larger value resolves and pops smaller indices, then its own index is pushed for later.',
        'Although a while loop may pop several entries at one position, each index enters and leaves at most once. Total time is Theta(n), with O(n) auxiliary space.',
        'A stack data structure is an abstract interface controlled by the program. The program call stack is runtime machinery that stores active function frames. Recursion consumes call-stack depth; it does not automatically use a std::stack object.',
      ],
      examples: [{ title: 'Next Greater Element', problem: 'Find next greater values for [2,1,4,3].', walkthrough: ['Push index 0 for 2; push index 1 for 1.', 'Value 4 resolves 1 and then 2, so both answers are 4.', 'Push 4, then push 3; neither has a later greater value.'], result: 'Answers are [4,4,-1,-1] in Theta(n) time.' }],
    },
  ],
  checklist: ['I explain LIFO without relying on an implementation.', 'I check empty before top or pop.', 'I distinguish fixed-capacity overflow from empty-stack underflow.', 'I match each closing delimiter to the current top.', 'I can explain the linear total work of a monotonic stack.'],
  commonMistakes: ['Calling top or pop on an empty stack.', 'Confusing top with the bottom or first inserted item.', 'Popping postfix operands in left-right order instead of right-left.', 'Checking only delimiter counts instead of nesting order.', 'Claiming a nested pop loop makes Next Greater Element quadratic.'],
  revisionGuidance: ['Trace five pushes and pops in a table.', 'Validate one balanced and two malformed delimiter strings.', 'Dry-run Next Greater Element while recording the index stack.'],
  practiceExercises: [
    { id: 'dsa-stack-p1', title: 'Underflow policy', prompt: 'What should a safe custom pop operation do when the stack is empty?', difficulty: 'Easy', hints: ['Undefined access is not acceptable.'], solution: 'Report failure explicitly, such as by throwing or returning an optional/status result.', explanation: 'A documented failure policy prevents reading or removing a nonexistent top element.' },
    { id: 'dsa-stack-p2', title: 'Postfix order', prompt: 'Evaluate postfix 8 3 -.', difficulty: 'Easy', hints: ['Pop right operand first.'], solution: 'The result is 5 because the operation is 8 - 3.', explanation: 'The first pop is 3 as the right operand and the second is 8 as the left operand, giving 8-3.' },
    { id: 'dsa-stack-p3', title: 'Monotonic trace', prompt: 'Find Next Greater Elements for [5,2,6].', difficulty: 'Easy', hints: ['6 resolves every smaller unresolved value.'], solution: 'The answers are [6,6,-1].', explanation: 'Both indices 0 and 1 are popped when 6 arrives; no later value exists for 6.' },
  ],
  mcqs: [
    { id: 'dsa-stack-m1', prompt: 'Which order defines a stack?', options: ['Last in, first out', 'First in, first out', 'Sorted order', 'Random order'], answer: 0, explanation: 'The most recently pushed unremoved item is the first one popped.' },
    { id: 'dsa-stack-m2', prompt: 'What is underflow?', options: ['Removing from an empty stack', 'Filling a bounded stack', 'Growing a vector', 'Reading the bottom safely'], answer: 0, explanation: 'Underflow means an operation requires an element but the stack has none.' },
    { id: 'dsa-stack-m3', prompt: 'When a closing delimiter is read, what must match?', options: ['The current stack top', 'Any earlier opener', 'The final character only', 'The stack size parity'], answer: 0, explanation: 'Nesting requires the most recent unmatched opener to have the corresponding type.' },
    { id: 'dsa-stack-m4', prompt: 'Why is monotonic-stack Next Greater Element Theta(n)?', options: ['Each index is pushed and popped at most once', 'The input is sorted first', 'It uses recursion', 'All loops execute once total'], answer: 0, explanation: 'Amortized accounting bounds all pushes and pops by a constant multiple of n.' },
    { id: 'dsa-stack-m5', prompt: 'What does std::stack use by default?', options: ['std::deque', 'A raw fixed array only', 'std::map', 'A graph'], answer: 0, explanation: 'The standard adaptor defaults to std::deque as its underlying container.' },
  ],
  coding: [
    { id: 'dsa-stack-c1', title: 'Balanced brackets', difficulty: 'Easy', language: 'cpp', prompt: 'Return whether a string containing only ()[]{} is correctly balanced.', starter: '#include <stack>\n#include <string>\nbool balanced(const std::string& text) {\n    // push openers and match closers\n}\n', examples: [{ input: '"{[()]}"', output: 'true' }, { input: '"([)]"', output: 'false' }, { input: '""', output: 'true' }], hints: ['Reject a closer when empty.', 'Require empty at the end.'], referenceSolution: 'bool balanced(const std::string& text) {\n    std::stack<char> open;\n    for (char ch : text) {\n        if (ch == \'(\' || ch == \'[\' || ch == \'{\') open.push(ch);\n        else {\n            if (open.empty()) return false;\n            const char expected = ch == \')\' ? \'(\' : ch == \']\' ? \'[\' : ch == \'}\' ? \'{\' : \'\\0\';\n            if (expected == \'\\0\' || open.top() != expected) return false;\n            open.pop();\n        }\n    }\n    return open.empty();\n}' },
    { id: 'dsa-stack-c2', title: 'Next Greater Element', difficulty: 'Medium', language: 'cpp', prompt: 'For each value, return the first greater value to its right or -1. Use a stack of unresolved indices.', starter: '#include <stack>\n#include <vector>\nstd::vector<int> nextGreater(const std::vector<int>& values) {\n    // monotonic decreasing index stack\n}\n', examples: [{ input: '{2,1,4,3}', output: '{4,4,-1,-1}' }, { input: '{}', output: '{}' }], hints: ['Initialize answers to -1.', 'Resolve while values[top] < values[i].'], referenceSolution: 'std::vector<int> nextGreater(const std::vector<int>& values) {\n    std::vector<int> answer(values.size(), -1);\n    std::stack<std::size_t> unresolved;\n    for (std::size_t i = 0; i < values.size(); ++i) {\n        while (!unresolved.empty() && values[unresolved.top()] < values[i]) {\n            answer[unresolved.top()] = values[i];\n            unresolved.pop();\n        }\n        unresolved.push(i);\n    }\n    return answer;\n}' },
  ],
  resources: [
    { title: 'cppreference: std::stack', url: 'https://en.cppreference.com/w/cpp/container/stack', kind: 'web' },
    { title: 'cppreference: stack header', url: 'https://en.cppreference.com/w/cpp/header/stack', kind: 'web' },
  ],
}
