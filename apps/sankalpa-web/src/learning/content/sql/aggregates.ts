import type { Topic } from '../../types'
import { POSTGRES_AGGREGATE_REFERENCE, POSTGRES_SELECT_REFERENCE, SQL_SCHEMA_TEXT } from './schemas'

export const sqlAggregates: Topic = {
  id: 'dbms-aggregates', title: 'SQL Aggregates, GROUP BY and HAVING',
  summary: 'Summarize rows with aggregate functions, form groups, and filter group results after aggregation.',
  prerequisiteTopicIds: ['dbms-order-limit'],
  lessons: [
    { id: 'sql-aggregate-functions', title: 'COUNT, SUM, AVG, MIN and MAX', durationMinutes: 30,
      objectives: ['Choose a basic aggregate function', 'Distinguish COUNT(*) from COUNT(column)', 'Reason about NULL values in aggregates'],
      theory: [SQL_SCHEMA_TEXT, 'An aggregate summarizes values from multiple input rows. COUNT(*) counts rows. COUNT(score) counts rows whose score is not NULL. SUM adds non-null inputs, AVG computes their mean, and MIN and MAX select the smallest and largest non-null value.', 'For the sample students, COUNT(*) is 4 and COUNT(score) is 3 because Mina has no score. SUM(score) is 248; AVG(score) is 248/3; MIN(score) is 72 and MAX(score) is 88. NULL does not contribute to these column aggregates.', 'Without GROUP BY, an aggregate query summarizes the whole filtered input as one result row. With GROUP BY, it returns a summary for each group.'],
      examples: [{ title: 'Predict summary values', problem: 'Query: SELECT COUNT(*) AS rows, COUNT(score) AS scored, SUM(score) AS total, AVG(score) AS mean, MIN(score) AS low, MAX(score) AS high FROM students.', walkthrough: ['There are four student rows.', 'Three rows have a non-NULL score.', '88+72+88=248; divide by 3 for the mean.', 'The smallest known score is 72 and the largest is 88.'], result: 'rows=4; scored=3; total=248; mean=248/3 (about 82.67); low=72; high=88.' }] },
    { id: 'sql-group-having', title: 'GROUP BY and HAVING', durationMinutes: 35,
      objectives: ['Group rows by one or more keys', 'Select grouping keys and aggregate results', 'Use WHERE for rows and HAVING for groups'],
      theory: ['GROUP BY partitions the filtered input into groups that share the listed key values. An aggregate in the SELECT list then computes once per group. A selected non-aggregate column generally must be part of the grouping key.', 'Conceptually, WHERE filters individual input rows before grouping. HAVING filters the groups after grouping and is commonly used with aggregate conditions such as HAVING AVG(score) >= 80. This distinction helps answer whether a predicate applies to each row or to a whole summary.', 'For the sample, grouping students by city produces Delhi (1 row), Jaipur (1 row), and Pune (2 rows). Pune has two student rows but only one non-NULL score.'],
      examples: [{ title: 'Keep cities with an average score of at least 80', problem: 'Query: SELECT city, COUNT(*) AS students, COUNT(score) AS scored, AVG(score) AS avg_score FROM students GROUP BY city HAVING AVG(score) >= 80 ORDER BY city.', walkthrough: ['WHERE is absent, so all four rows enter grouping.', 'Create a group for each city.', 'Compute each average, ignoring the NULL score: Delhi 72, Jaipur 88, Pune 88.', 'HAVING removes Delhi and keeps Jaipur and Pune.', 'ORDER BY arranges the remaining groups by city.'], result: 'Jaipur | 1 | 1 | 88; Pune | 2 | 1 | 88.' }] },
  ],
  checklist: ['I can explain the different counts produced by COUNT(*) and COUNT(column).', 'I know the basic NULL behavior of aggregates.', 'I can group by a key and select its aggregate summaries.', 'I use WHERE for row filtering and HAVING for aggregate group filtering.'],
  commonMistakes: ['Using COUNT(column) when the goal is to count every row, including rows where that column is NULL.', 'Selecting a non-aggregated column that is neither grouped nor functionally determined.', 'Using WHERE AVG(score) >= 80; aggregate group conditions belong in HAVING.', 'Using HAVING for an ordinary row predicate that belongs in WHERE.', 'Assuming AVG includes NULL as zero.'],
  revisionGuidance: ['Compute COUNT(*), COUNT(score), and AVG(score) for the sample by hand.', 'Draw the three city groups before computing each aggregate.', 'Label each condition as a row condition for WHERE or a group condition for HAVING.'],
  practiceExercises: [
    { id: 'sql-aggregates-p1', title: 'Predict NULL-aware counts', prompt: 'What are COUNT(*) and COUNT(score) for the sample students relation?', difficulty: 'Easy', hints: ['Count all four rows for COUNT(*).', 'Count only present score values for COUNT(score).'], solution: 'COUNT(*) = 4; COUNT(score) = 3.', explanation: 'COUNT(column) ignores NULL values, while COUNT(*) counts every row.' },
    { id: 'sql-aggregates-p2', title: 'Write a group filter', prompt: 'Write a query returning each city and its average known score, keeping only cities whose average is at least 80.', difficulty: 'Medium', hints: ['Group by city.', 'The aggregate condition is evaluated after groups form.'], solution: 'SELECT city, AVG(score) AS avg_score FROM students GROUP BY city HAVING AVG(score) >= 80 ORDER BY city;', explanation: 'The group key city and its aggregate are returned; HAVING retains Jaipur and Pune for the sample.' },
  ],
  mcqs: [
    { id: 'sql-aggregates-m1', difficulty: 'Easy', prompt: 'Which expression counts every input row, including rows with NULL in a particular column?', options: ['COUNT(*)', 'COUNT(score)', 'SUM(score)', 'AVG(score)'], answer: 0, explanation: 'COUNT(*) counts rows; COUNT(score) counts only non-NULL score values.' },
    { id: 'sql-aggregates-m2', difficulty: 'Medium', prompt: 'Which clause filters groups using AVG(score) after GROUP BY?', options: ['HAVING', 'WHERE', 'FROM', 'LIMIT'], answer: 0, explanation: 'HAVING filters grouped rows and can use aggregate results.' },
  ],
  coding: [], resources: [POSTGRES_AGGREGATE_REFERENCE, POSTGRES_SELECT_REFERENCE],
}
