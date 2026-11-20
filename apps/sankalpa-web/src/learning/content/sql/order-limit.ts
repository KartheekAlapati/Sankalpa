import type { Topic } from '../../types'
import { POSTGRES_SELECT_REFERENCE, SQL_SCHEMA_TEXT } from './schemas'

export const sqlOrderLimit: Topic = {
  id: 'dbms-order-limit', title: 'SQL ORDER BY and LIMIT',
  summary: 'Sort query results by one or more keys and request only an initial number of rows.',
  prerequisiteTopicIds: ['dbms-where'],
  lessons: [
    { id: 'sql-order-by', title: 'Sort one or more keys', durationMinutes: 25,
      objectives: ['Sort ascending or descending', 'Add a tie-break key for predictable order', 'Distinguish result ordering from table storage order'],
      theory: [SQL_SCHEMA_TEXT, 'ORDER BY sorts the result using one or more output expressions. ASC means ascending and is the default; DESC means descending. Each expression can use a selected column. Add more expressions to break ties: ORDER BY city ASC, age DESC, student_id ASC.', 'Sorting applies to the query result. A table has no guaranteed display order without ORDER BY. If two rows tie on all listed keys, their relative order is still unspecified; a unique key is a useful final tie-breaker when deterministic output matters.'],
      examples: [{ title: 'Sort by city and age', problem: 'Query: SELECT name, city, age FROM students ORDER BY city ASC, age DESC, student_id ASC.', walkthrough: ['Sort city ascending: Delhi, Jaipur, Pune.', 'Within Pune, sort age descending: Asha (20) before Mina (19).', 'student_id provides a final deterministic tie-breaker.'], result: 'Ravi | Delhi | 21; Kiran | Jaipur | 22; Asha | Pune | 20; Mina | Pune | 19.' }] },
    { id: 'sql-limit', title: 'Limit the result size', durationMinutes: 20,
      objectives: ['Use PostgreSQL LIMIT to cap returned rows', 'Combine LIMIT with ORDER BY for a meaningful top result', 'Predict the first rows after ordering'],
      theory: ['LIMIT n asks PostgreSQL to return at most n rows from the query result. If fewer than n rows are available, all available rows are returned.', 'Without ORDER BY, LIMIT chooses rows from an unspecified order, so it does not mean “the first” rows in a stable business sense. Sort first when asking for top scores, newest records, or another ranked subset.', 'OFFSET can skip rows and is often shown with LIMIT, but stable pagination also needs a consistent ordering key. This lesson focuses on LIMIT and a deterministic order.'],
      examples: [{ title: 'Top two students by age', problem: 'Query: SELECT name, age FROM students ORDER BY age DESC, student_id ASC LIMIT 2.', walkthrough: ['Order ages descending: 22, 21, 20, 19.', 'The secondary key orders ties by student_id.', 'Keep the first two rows after ordering.'], result: 'Kiran | 22; Ravi | 21.' }] },
  ],
  checklist: ['I know ASC is the default and DESC reverses sort direction.', 'I can use multiple keys to resolve ties.', 'I use ORDER BY before LIMIT when selecting a ranked subset.', 'I do not assume a table has a stable order without ORDER BY.'],
  commonMistakes: ['Using LIMIT without defining which rows should come first.', 'Assuming a tie has a predictable order without a tie-breaker.', 'Treating sorted query output as permanent table storage order.', 'Using DESC when the task asks for the smallest values.'],
  revisionGuidance: ['Sort the sample students by city ascending, then age descending.', 'Add student_id as a tie-breaker and explain why.', 'Predict the top two rows only after writing the order keys.'],
  practiceExercises: [
    { id: 'sql-order-limit-p1', title: 'Predict a sorted limit', prompt: 'What names are returned by ORDER BY score DESC NULLS LAST, student_id ASC LIMIT 2?', difficulty: 'Easy', hints: ['The explicit NULLS LAST keeps the missing score after numeric scores.', 'Two students share score 88, so use student_id as a tie-breaker.'], solution: 'Asha, Kiran.', explanation: 'Asha and Kiran have the top known score 88; ascending student_id puts Asha (1) before Kiran (4).'},
    { id: 'sql-order-limit-p2', title: 'Write a descending query', prompt: 'Write a query returning the three oldest students first, with ties ordered by student_id.', difficulty: 'Easy', hints: ['Use ORDER BY age DESC, student_id ASC.', 'Use LIMIT 3.'], solution: 'SELECT name, age FROM students ORDER BY age DESC, student_id ASC LIMIT 3;', explanation: 'The order keys define a deterministic ranking for the sample before the row cap is applied.' },
  ],
  mcqs: [
    { id: 'sql-order-limit-m1', difficulty: 'Easy', prompt: 'Which clause specifies a predictable row order?', options: ['ORDER BY', 'LIMIT', 'WHERE', 'DISTINCT'], answer: 0, explanation: 'ORDER BY defines the output order; without it SQL does not promise a particular order.' },
    { id: 'sql-order-limit-m2', difficulty: 'Easy', prompt: 'What does LIMIT 2 request?', options: ['At most two result rows', 'Exactly two matching rows or an error', 'Two columns', 'Skip two rows'], answer: 0, explanation: 'LIMIT caps the number of rows returned; the result may contain fewer.' },
  ],
  coding: [], resources: [POSTGRES_SELECT_REFERENCE],
}
