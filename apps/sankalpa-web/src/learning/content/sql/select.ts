import type { Topic } from '../../types'
import { POSTGRES_SELECT_REFERENCE, SQL_SCHEMA_TEXT } from './schemas'

export const sqlSelect: Topic = {
  id: 'dbms-topic-2', title: 'SQL SELECT Fundamentals',
  summary: 'Choose columns from a relation, name output columns with aliases, and remove duplicate rows when requested.',
  prerequisiteTopicIds: ['dbms-topic-1'],
  lessons: [
    { id: 'sql-select-columns', title: 'SELECT, FROM and column selection', durationMinutes: 30,
      objectives: ['Name the source relation with FROM', 'Choose selected columns instead of using * by default', 'Read the output of a simple SELECT'],
      theory: [SQL_SCHEMA_TEXT, 'A basic query has the form SELECT select_list FROM source. FROM identifies the relation being read; SELECT chooses which expressions become output columns. SELECT * asks for every column and is convenient for exploration, while explicit columns make a query’s output clearer and more stable.', 'A SQL query produces a result table. It does not modify the source rows unless a data-changing statement such as INSERT, UPDATE, or DELETE is used. A SELECT result has column labels and rows; reading the query from its FROM clause and projection list helps predict its shape.'],
      examples: [{ title: 'Select two columns', problem: 'Query: SELECT name, city FROM students ORDER BY student_id. What rows are returned?', walkthrough: ['FROM students supplies the four sample student rows.', 'SELECT keeps only name and city.', 'The ORDER BY makes the walkthrough order deterministic by student_id.'], result: 'name | city: Asha | Pune; Ravi | Delhi; Mina | Pune; Kiran | Jaipur.' }] },
    { id: 'sql-select-alias-distinct', title: 'Aliases and DISTINCT', durationMinutes: 25,
      objectives: ['Use AS to label an output expression', 'Explain DISTINCT over selected output rows', 'Predict how many unique city values are returned'],
      theory: ['An alias labels an output column: SELECT city AS home_city FROM students. AS is optional in PostgreSQL, but writing it makes the role explicit.', 'DISTINCT removes duplicate rows from the selected output. SELECT DISTINCT city FROM students returns each city once because the projection contains one column. With multiple selected columns, duplicate removal applies to the whole selected combination, not to each column independently.', 'Without ORDER BY, row order is not guaranteed. Add ORDER BY when a displayed result needs a predictable order.'],
      examples: [{ title: 'Distinct cities', problem: 'Query: SELECT DISTINCT city FROM students ORDER BY city.', walkthrough: ['Read the city values: Pune, Delhi, Pune, Jaipur.', 'Remove repeated output values, leaving Pune, Delhi, Jaipur.', 'Sort ascending alphabetically.'], result: 'The output rows are Delhi, Jaipur, Pune.' }] },
  ],
  checklist: ['I can identify the output columns from SELECT.', 'I can identify the input relation from FROM.', 'I can explain an output alias.', 'I know DISTINCT removes duplicate selected rows and ORDER BY is needed for guaranteed order.'],
  commonMistakes: ['Using SELECT * in a report when only a few columns are needed.', 'Assuming aliases rename the source table or stored column.', 'Assuming DISTINCT on two columns independently deduplicates each one.', 'Assuming result order without ORDER BY.'],
  revisionGuidance: ['Write one query selecting explicit columns and another using an alias.', 'Predict the number of rows in SELECT DISTINCT city from the sample, then list them.', 'Review the source and output separately: FROM determines input; SELECT shapes output.'],
  practiceExercises: [
    { id: 'sql-select-p1', title: 'Predict a projection', prompt: 'Using the sample students relation, what output rows does SELECT name, age FROM students WHERE student_id <= 2 ORDER BY student_id return?', difficulty: 'Easy', hints: ['First keep student IDs 1 and 2.', 'Then output only name and age.'], solution: 'name | age: Asha | 20; Ravi | 21.', explanation: 'The WHERE condition retains the first two student rows; SELECT projects their name and age columns.' },
    { id: 'sql-select-p2', title: 'Count distinct values', prompt: 'How many rows does SELECT DISTINCT city FROM students return?', difficulty: 'Easy', hints: ['List each city from the sample once.', 'Pune occurs twice.'], solution: '3 rows: Pune, Delhi and Jaipur (the order is unspecified without ORDER BY).', explanation: 'DISTINCT removes the second Pune output row; three unique city values remain.' },
  ],
  mcqs: [
    { id: 'sql-select-m1', difficulty: 'Easy', prompt: 'Which clause names the relation supplying rows to a basic SELECT?', options: ['FROM', 'ORDER BY', 'HAVING', 'LIMIT'], answer: 0, explanation: 'FROM identifies the input relation or table expression.' },
    { id: 'sql-select-m2', difficulty: 'Medium', prompt: 'What does SELECT DISTINCT city, age remove?', options: ['Duplicate (city, age) output pairs', 'Repeated city values regardless of age', 'Rows with NULL in any column', 'The source table'], answer: 0, explanation: 'DISTINCT applies to the entire selected row, here the pair of city and age values.' },
  ],
  coding: [], resources: [POSTGRES_SELECT_REFERENCE],
}
