import type { Topic } from '../../types'

export const linearAlgebraFoundations: Topic = {
  id: 'eng-linear-algebra', title: 'Linear Algebra Foundations: Vectors and Matrices',
  summary: 'Build a first working model of vectors, matrix shape, matrix-vector products and small linear systems.',
  prerequisiteTopicIds: [], crossLinkTopicIds: ['gate-cs-engineering-math', 'gate-da-linear-algebra'],
  lessons: [
    { id: 'linear-algebra-vectors', title: 'Vectors and linear combinations', durationMinutes: 30,
      objectives: ['Read a vector as an ordered list of coordinates', 'Compute a scaled vector and a vector sum', 'Interpret a linear combination in two dimensions'],
      theory: ['A vector in R^n is an ordered n-tuple of real numbers. Its dimension is the number of coordinates. Two vectors can be added coordinate by coordinate only when their dimensions agree.', 'Scalar multiplication multiplies each coordinate by the same scalar. A linear combination of vectors forms a weighted sum, such as 2(1,0) + 3(0,1) = (2,3).', 'In applications, coordinates may represent features, directions or unknowns. The interpretation depends on the problem, but dimension and arithmetic must remain consistent.'],
      examples: [{ title: 'Compute a linear combination', problem: 'Find 2(1, 3) - (4, 1).', walkthrough: ['Scale the first vector: 2(1,3) = (2,6).', 'Subtract coordinate-wise: (2-4, 6-1).'], result: 'The result is (-2, 5). Both vectors have dimension 2.' }] },
    { id: 'linear-algebra-matrices', title: 'Matrices and linear systems', durationMinutes: 40,
      objectives: ['Identify a matrix’s row and column count', 'Multiply a matrix by a compatible vector', 'Relate a matrix equation to simultaneous linear equations'],
      theory: ['An m by n matrix has m rows and n columns. A matrix A with n columns can multiply a vector x with n entries; the result has m entries.', 'For each row, the matrix-vector product takes the dot product of that row and x. For example, [[1,2],[3,4]](5,6) gives (1*5+2*6, 3*5+4*6) = (17,39).', 'A system of linear equations can be written Ax=b. A solution vector x satisfies every equation at once. Different systems may have one solution, no solution, or many solutions; elimination is a systematic way to investigate them.'],
      examples: [{ title: 'Write and solve a small system', problem: 'Solve x+y=5 and x-y=1.', walkthrough: ['Add the equations: 2x=6, so x=3.', 'Substitute into x+y=5: 3+y=5.', 'Therefore y=2.', 'Check the second equation: 3-2=1.'], result: '(x,y)=(3,2), and substitution verifies both equations.' }] },
  ],
  checklist: ['I can state a vector’s dimension.', 'I can add vectors and multiply by a scalar.', 'I can check matrix-vector dimensions before multiplying.', 'I can verify a candidate solution in every original equation.'],
  commonMistakes: ['Adding vectors of different dimensions.', 'Multiplying a matrix by a vector with an incompatible number of entries.', 'Confusing rows with columns when stating matrix dimensions.', 'Accepting a solution after checking only one equation.'],
  revisionGuidance: ['Redo one vector combination and one matrix-vector product by hand.', 'Solve a two-equation system and substitute the result into both equations.', 'GATE 2026 CS includes matrices, determinants, systems, eigenvalues/eigenvectors and LU decomposition; GATE 2026 DA includes broader linear algebra coverage. This lesson is an introduction, not complete exam coverage.'],
  practiceExercises: [
    { id: 'linear-algebra-p1', title: 'Matrix-vector product', prompt: 'Compute [[2, -1], [0, 3]] times vector (4, 2).', difficulty: 'Easy', hints: ['Dot the first row with the vector.', 'Repeat with the second row.'], solution: '(6, 6)', explanation: 'First coordinate: 2*4 + (-1)*2 = 6. Second coordinate: 0*4 + 3*2 = 6.' },
    { id: 'linear-algebra-p2', title: 'Check a system solution', prompt: 'Does (2,1) solve x+y=3 and 2x-y=3?', difficulty: 'Easy', hints: ['Substitute both coordinates into each equation.', 'Both equations must hold.'], solution: 'Yes.', explanation: '2+1=3 and 2*2-1=3, so both equations are satisfied.' },
  ],
  mcqs: [
    { id: 'linear-algebra-m1', difficulty: 'Easy', prompt: 'A matrix with 3 rows and 2 columns multiplies a compatible vector. How many entries are in the result?', options: ['3', '2', '5', '6'], answer: 0, explanation: 'An m by n matrix times an n-entry vector produces an m-entry vector; here m=3.' },
    { id: 'linear-algebra-m2', difficulty: 'Medium', prompt: 'What is required for vector x to solve Ax=b?', options: ['It must satisfy all equations represented by Ax=b', 'It must contain only positive entries', 'A must be square in every case', 'The entries of x must sum to 1'], answer: 0, explanation: 'A solution is any vector whose matrix product Ax equals b, satisfying all represented equations.' },
  ],
  coding: [],
  resources: [
    { title: 'Official GATE 2026 CS syllabus PDF (IIT Guwahati)', url: 'https://gate2026.iitg.ac.in/doc/GATE2026_Syllabus/CS_2026_Syllabus.pdf', kind: 'web' },
    { title: 'Official GATE 2026 DA syllabus PDF (IIT Guwahati)', url: 'https://gate2026.iitg.ac.in/doc/GATE2026_Syllabus/DA_2026_Syllabus.pdf', kind: 'web' },
  ],
}
