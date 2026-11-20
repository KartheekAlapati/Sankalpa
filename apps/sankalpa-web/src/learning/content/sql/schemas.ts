export const SQL_TEACHING_SCHEMA = {
  students: {
    columns: ['student_id (primary key)', 'name', 'city', 'age', 'score (nullable)'],
    rows: [
      { student_id: 1, name: 'Asha', city: 'Pune', age: 20, score: 88 },
      { student_id: 2, name: 'Ravi', city: 'Delhi', age: 21, score: 72 },
      { student_id: 3, name: 'Mina', city: 'Pune', age: 19, score: null },
      { student_id: 4, name: 'Kiran', city: 'Jaipur', age: 22, score: 88 },
    ],
  },
  courses: {
    columns: ['course_id (primary key)', 'title', 'credits'],
    rows: [
      { course_id: 10, title: 'DSA', credits: 4 },
      { course_id: 20, title: 'DBMS', credits: 3 },
    ],
  },
  enrollments: {
    columns: ['student_id (foreign key to students)', 'course_id (foreign key to courses)', 'grade'],
    primaryKey: ['student_id', 'course_id'],
    rows: [
      { student_id: 1, course_id: 10, grade: 90 },
      { student_id: 1, course_id: 20, grade: 84 },
      { student_id: 2, course_id: 10, grade: 75 },
      { student_id: 3, course_id: 20, grade: 95 },
    ],
  },
} as const

export const SQL_SCHEMA_TEXT = 'Teaching schema: students(student_id primary key, name, city, age, score nullable); courses(course_id primary key, title, credits); enrollments(student_id foreign key, course_id foreign key, grade, composite primary key (student_id, course_id)). Sample students: (1,Asha,Pune,20,88), (2,Ravi,Delhi,21,72), (3,Mina,Pune,19,NULL), (4,Kiran,Jaipur,22,88). Sample courses: (10,DSA,4), (20,DBMS,3). Sample enrollments: (1,10,90), (1,20,84), (2,10,75), (3,20,95).'

export const POSTGRES_SELECT_REFERENCE = { title: 'PostgreSQL documentation: SELECT', url: 'https://www.postgresql.org/docs/current/sql-select.html', kind: 'web' as const }
export const POSTGRES_TABLES_REFERENCE = { title: 'PostgreSQL documentation: Table expressions and joins', url: 'https://www.postgresql.org/docs/current/queries-table-expressions.html', kind: 'web' as const }
export const POSTGRES_AGGREGATE_REFERENCE = { title: 'PostgreSQL documentation: Aggregate functions', url: 'https://www.postgresql.org/docs/current/functions-aggregate.html', kind: 'web' as const }
export const POSTGRES_COMPARISON_REFERENCE = { title: 'PostgreSQL documentation: Comparison functions and operators', url: 'https://www.postgresql.org/docs/current/functions-comparison.html', kind: 'web' as const }
export const POSTGRES_PATTERN_REFERENCE = { title: 'PostgreSQL documentation: Pattern matching', url: 'https://www.postgresql.org/docs/current/functions-matching.html', kind: 'web' as const }
