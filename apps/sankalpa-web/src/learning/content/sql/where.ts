import type { Topic } from '../../types'
import { POSTGRES_COMPARISON_REFERENCE, POSTGRES_PATTERN_REFERENCE, POSTGRES_SELECT_REFERENCE, SQL_SCHEMA_TEXT } from './schemas'

export const sqlWhere: Topic = {
  id: 'dbms-where', title: 'SQL WHERE Filtering',
  summary: 'Filter individual rows with comparisons, Boolean conditions, sets, ranges, patterns and correct NULL checks.',
  prerequisiteTopicIds: ['dbms-topic-2'],
  lessons: [
    { id: 'sql-where-conditions', title: 'Comparisons and Boolean logic', durationMinutes: 35,
      objectives: ['Filter rows with comparison operators', 'Combine conditions with AND, OR and NOT', 'Use IN and BETWEEN for readable filters'],
      theory: [SQL_SCHEMA_TEXT, 'WHERE keeps rows for which its condition is TRUE. Common comparisons are =, <>, <, <=, > and >=. AND requires both conditions to be true; OR requires at least one; NOT negates a condition. Parentheses make mixed AND/OR intent clear.', 'IN checks membership in a list, such as city IN (\'Pune\', \'Delhi\'). BETWEEN low AND high includes both endpoints in PostgreSQL. A condition such as age BETWEEN 19 AND 21 therefore includes ages 19, 20, and 21.', 'LIKE matches text patterns: % stands for any sequence of characters and _ for one character. For example, name LIKE \'A%\' matches names beginning with A. LIKE is case-sensitive in PostgreSQL; ILIKE is a PostgreSQL-specific case-insensitive variant.'],
      examples: [{ title: 'Combine city and age filters', problem: 'Query: SELECT name FROM students WHERE city IN (\'Pune\', \'Delhi\') AND age BETWEEN 19 AND 21 ORDER BY student_id.', walkthrough: ['IN accepts Pune and Delhi.', 'The inclusive age range accepts 19, 20 and 21.', 'Both conditions must be true because they are joined by AND.', 'Asha, Ravi and Mina satisfy both; Kiran is excluded by city and age.'], result: 'name: Asha; Ravi; Mina.' }, { title: 'Match a name prefix', problem: 'Query: SELECT name FROM students WHERE name LIKE \'A%\'.', walkthrough: ['A% requires the first character to be A.', 'Asha matches; Ravi, Mina and Kiran do not.'], result: 'name: Asha.' }] },
    { id: 'sql-where-null', title: 'NULL and unknown comparisons', durationMinutes: 25,
      objectives: ['Recognize that NULL represents a missing or unknown value', 'Use IS NULL and IS NOT NULL', 'Explain why = NULL is not a NULL test'],
      theory: ['NULL is not the number zero, an empty string, or an ordinary comparable value. A comparison involving NULL such as score = NULL evaluates to UNKNOWN, not TRUE or FALSE. WHERE retains only TRUE rows, so = NULL does not select rows whose score is missing.', 'Write score IS NULL to test for a missing score and score IS NOT NULL to require a present score. This syntax directly expresses the intended predicate.', 'With Boolean logic, UNKNOWN can propagate through expressions; for beginner filtering, remember that a row passes WHERE only when the complete condition is TRUE. Use explicit NULL checks when a column may be nullable.'],
      examples: [{ title: 'Find missing scores', problem: 'Compare SELECT name FROM students WHERE score IS NULL with the incorrect predicate score = NULL.', walkthrough: ['Mina has a NULL score; the other three scores are present.', 'IS NULL evaluates TRUE for Mina’s row.', 'score = NULL evaluates UNKNOWN for a NULL score and UNKNOWN is not retained by WHERE.'], result: 'IS NULL returns Mina. The = NULL predicate returns no row for this sample; use IS NULL instead.' }, { title: 'Require a score', problem: 'Which condition keeps students with a known score?', walkthrough: ['A known score is not NULL.', 'IS NOT NULL tests exactly that state.'], result: 'WHERE score IS NOT NULL keeps Asha, Ravi and Kiran.' }] },
  ],
  checklist: ['I can combine comparisons with AND, OR and NOT.', 'I know BETWEEN includes its endpoints in PostgreSQL.', 'I can read IN and LIKE predicates.', 'I use IS NULL or IS NOT NULL rather than = NULL.'],
  commonMistakes: ['Forgetting parentheses when AND and OR are mixed.', 'Treating BETWEEN as excluding endpoints.', 'Writing score = NULL, which evaluates UNKNOWN rather than testing nullness.', 'Using LIKE without accounting for % and _ wildcards.', 'Assuming a WHERE predicate retains rows where it is UNKNOWN.'],
  revisionGuidance: ['Predict each row kept by an AND condition and an OR condition.', 'Write both IS NULL and IS NOT NULL queries for score.', 'Explain why score = NULL does not retain Mina in WHERE.'],
  practiceExercises: [
    { id: 'sql-where-p1', title: 'Predict a filter result', prompt: 'What names match WHERE city = \'Pune\' OR age > 21, ordered by student_id?', difficulty: 'Easy', hints: ['Pune selects Asha and Mina.', 'Age greater than 21 selects Kiran.'], solution: 'Asha, Mina, Kiran.', explanation: 'OR keeps a row when either condition is TRUE; Ravi meets neither condition.' },
    { id: 'sql-where-p2', title: 'Write a NULL query', prompt: 'Write a query that returns student_id and name for rows whose score is known.', difficulty: 'Easy', hints: ['Use IS NOT NULL.', 'Filter the students relation.'], solution: 'SELECT student_id, name FROM students WHERE score IS NOT NULL;', explanation: 'IS NOT NULL selects the three rows whose score has a value.' },
  ],
  mcqs: [
    { id: 'sql-where-m1', difficulty: 'Easy', prompt: 'Which predicate correctly finds rows where score is missing?', options: ['score IS NULL', 'score = NULL', 'score == NULL', 'score IN (NULL)'], answer: 0, explanation: 'SQL uses IS NULL to test nullness. Equality with NULL yields UNKNOWN.' },
    { id: 'sql-where-m2', difficulty: 'Medium', prompt: 'What does BETWEEN 19 AND 21 include in PostgreSQL?', options: ['19, 20 and 21', 'Only 20', 'Values greater than 19 and less than 21', 'All values except 20'], answer: 0, explanation: 'BETWEEN includes the lower and upper endpoints.' },
  ],
  coding: [], resources: [POSTGRES_SELECT_REFERENCE, POSTGRES_COMPARISON_REFERENCE, POSTGRES_PATTERN_REFERENCE],
}
