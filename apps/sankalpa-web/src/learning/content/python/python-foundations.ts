import type { Topic } from '../../types'

export const pythonFoundations: Topic = {
  id: 'python-syntax', title: 'Python Foundations: Values and Control Flow',
  summary: 'Begin with names, built-in values, expressions, branching, loops and small functions.',
  prerequisiteTopicIds: [],
  lessons: [
    { id: 'python-values-operators', title: 'Variables, types and operators', durationMinutes: 30,
      objectives: ['Name values with assignments', 'Recognize common built-in types', 'Evaluate arithmetic and Boolean expressions'],
      theory: ['A Python name refers to an object; assignment binds the name to a value. Common beginner values include int, float, bool, and str. Python is dynamically typed: a name can later be rebound to an object of another type, though keeping a clear role for each name improves readability.', 'The operators +, -, *, /, //, %, and ** mean addition, subtraction, multiplication, true division, floor division, remainder, and exponentiation. For positive integers, 7 // 2 is 3; / produces 3.5.', 'Comparisons produce Boolean values. and, or, and not combine truth values with short-circuit evaluation. Use parentheses when a compound expression might be unclear.'],
      examples: [{ title: 'Trace floor division', problem: 'Evaluate result = 17 // 5 + 17 % 5.', walkthrough: ['17 // 5 is 3.', '17 % 5 is 2.', 'Add the quotient and remainder: 3 + 2.'], result: 'result is 5; quotient times divisor plus remainder gives 3*5+2=17.' }] },
    { id: 'python-branches-loops', title: 'Conditions, loops and functions', durationMinutes: 40,
      objectives: ['Write an if / elif / else decision', 'Trace for and while loops', 'Define a function with parameters and a return value'],
      theory: ['Python uses indentation to group a suite after if, elif, else, for, while, and def. Keep indentation consistent; indentation changes program structure.', 'A for loop iterates over items in an iterable. range(start, stop) includes start but excludes stop. A while loop repeats while its condition is true; update state so it can eventually become false.', 'def names a function and parameters receive arguments when it is called. return sends a value back and ends that call. If no return executes, Python returns None.'],
      examples: [{ title: 'Dry-run range', problem: 'Trace total = sum(range(1, 4)) using an explicit loop.', walkthrough: ['range(1, 4) produces 1, 2, 3.', 'Start total=0.', 'Add 1 → 1; add 2 → 3; add 3 → 6.'], result: 'total is 6; the stop value 4 is excluded.' }] },
  ],
  checklist: ['I can identify int, float, bool and str values.', 'I can explain / versus //.', 'I can trace an indented branch and a range loop.', 'I can define and call a function that returns a value.'],
  commonMistakes: ['Expecting range(1, 4) to include 4.', 'Confusing print output with a function return value.', 'Forgetting to update a while-loop condition variable.', 'Using inconsistent indentation within a suite.'],
  revisionGuidance: ['Trace range(0, n) for n=0 and n=3.', 'Write one function that returns a value and one that only prints; compare their results.', 'After a day, solve a small branching problem using a truth table.'],
  practiceExercises: [{ id: 'python-foundations-p1', title: 'Count multiples', prompt: 'How many integers from 1 through 10 satisfy n % 3 == 0? Give the values and count.', difficulty: 'Easy', hints: ['Check each integer or step by 3.', 'The range includes 10 here.'], solution: 'The values are 3, 6, and 9; the count is 3.', explanation: 'Each listed value has remainder 0 when divided by 3, and no other integer in the interval does.' }],
  mcqs: [
    { id: 'python-foundations-m1', difficulty: 'Easy', prompt: 'What values does list(range(2, 5)) produce?', options: ['[2, 3, 4]', '[2, 3, 4, 5]', '[1, 2, 3, 4]', '[3, 4, 5]'], answer: 0, explanation: 'range includes its start and excludes its stop.' },
    { id: 'python-foundations-m2', difficulty: 'Medium', prompt: 'What does a Python function return if execution reaches its end without a return statement?', options: ['None', '0', 'False', 'An empty string'], answer: 0, explanation: 'The implicit result is None.' },
  ],
  coding: [{ id: 'python-foundations-c1', title: 'Sum positive integers', difficulty: 'Easy', language: 'python', prompt: 'Implement sum_to_n(n), returning the sum of positive integers from 1 through n, or 0 if n is less than 1.', starter: 'def sum_to_n(n):\n    # use a loop\n    pass\n', examples: [{ input: '4', output: '10' }, { input: '0', output: '0' }], hints: ['Start a total at zero.', 'Loop from 1 through n; remember range excludes its stop.'], referenceSolution: 'def sum_to_n(n):\n    total = 0\n    for value in range(1, n + 1):\n        total += value\n    return total' }],
  resources: [{ title: 'Python Tutorial: More Control Flow Tools', url: 'https://docs.python.org/3/tutorial/controlflow.html', kind: 'web' }, { title: 'Python Tutorial: Data Structures', url: 'https://docs.python.org/3/tutorial/datastructures.html', kind: 'web' }],
}
