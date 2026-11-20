import type { Topic } from '../../types'

export const dsaTwoDimensionalArrays: Topic = {
  id: 'dsa-2d-arrays',
  title: 'Two-Dimensional Arrays and Matrices',
  summary: 'Represent rectangular data, traverse it safely, reason about row-major storage, and build foundational matrix algorithms and 2D prefix sums.',
  prerequisiteTopicIds: ['cpp-arrays', 'cpp-vectors'],
  crossLinkTopicIds: ['dsa-prefix-sums'],
  lessons: [
    {
      id: 'dsa-2d-arrays-layout', title: 'Rows, columns, and memory layout', durationMinutes: 50,
      objectives: ['Declare and initialize a fixed C++ matrix', 'Map row and column indices to row-major order', 'Distinguish rectangular and jagged vector matrices'],
      theory: [
        'A matrix arranges values into rows and columns. For int grid[2][3], valid row indices are 0 and 1, while valid column indices are 0 through 2. Both indices must be checked before access.',
        'Built-in multidimensional arrays are arrays of arrays. C++ stores each complete row contiguously in row-major order, so grid[r][c] follows offset r * columnCount + c when dimensions are rectangular.',
        'std::vector<std::vector<int>> supports runtime sizes. Its rows are separate vectors, so they may be jagged. Algorithms that require a rectangle must verify every row has the same number of columns.',
      ],
      examples: [{ title: 'Row-major address trace', problem: 'Flatten {{2,4,1},{7,3,6}} conceptually.', walkthrough: ['Read row 0 from left to right: 2, 4, 1.', 'Continue with row 1: 7, 3, 6.', 'Element [1][2] has logical offset 1 * 3 + 2 = 5.'], result: 'The row-major sequence is 2,4,1,7,3,6; indexing is O(1).' }],
    },
    {
      id: 'dsa-2d-arrays-operations', title: 'Traversal and matrix operations', durationMinutes: 55,
      objectives: ['Compute row, column, and diagonal totals', 'Transpose and add compatible matrices', 'Explain the dimensions required for multiplication'],
      theory: [
        'Nested loops normally visit each cell once. A rows-by-columns traversal costs Theta(rows * columns). Row sums keep the row fixed; column sums keep the column fixed. A main diagonal uses positions [i][i] up to min(rows, columns).',
        'Transposing an r-by-c matrix creates a c-by-r result with result[c][r] = input[r][c]. Addition requires equal dimensions and adds matching cells.',
        'Matrix multiplication A(r by k) * B(k by c) is defined because A columns equal B rows. Each result[i][j] is the dot product of A row i and B column j, costing Theta(r * k * c) with the direct algorithm.',
      ],
      examples: [{ title: 'Transpose dry run', problem: 'Transpose {{1,2,3},{4,5,6}}.', walkthrough: ['Create a 3-by-2 output.', 'Move input[0][0], input[0][1], input[0][2] into output column 0.', 'Move the second input row into output column 1.'], result: 'The transpose is {{1,4},{2,5},{3,6}} in Theta(rows * columns) time and space.' }],
    },
    {
      id: 'dsa-2d-arrays-prefix', title: '2D prefix sums and matrix patterns', durationMinutes: 55,
      objectives: ['Build an extra-border 2D prefix table', 'Answer inclusive rectangle sums safely', 'Recognize traversal and neighborhood patterns'],
      theory: [
        'A 2D prefix table with one extra top row and left column avoids special cases. prefix[r+1][c+1] stores the sum of the rectangle from [0][0] through [r][c]. Use long long for totals.',
        'For inclusive corners (r1,c1) and (r2,c2), the rectangle sum is P[r2+1][c2+1] - P[r1][c2+1] - P[r2+1][c1] + P[r1][c1]. The final addition restores the overlap subtracted twice.',
        'Common matrix patterns include boundary traversal, directional movement, neighbor inspection, and visited-state grids. Validate empty input, rectangular shape, ordered corners, and bounds before indexing.',
      ],
      examples: [{ title: 'Rectangle sum by inclusion-exclusion', problem: 'For {{1,2,3},{4,5,6},{7,8,9}}, sum rows 1..2 and columns 0..1.', walkthrough: ['The requested cells are 4,5,7,8.', 'Use the four prefix corners to include the large rectangle.', 'Subtract the area above it and the area left of it, then restore their overlap.'], result: 'The sum is 24; preprocessing is Theta(rc), and each validated query is O(1).' }],
    },
  ],
  checklist: ['I validate both row and column indices.', 'I distinguish built-in rectangular arrays from possibly jagged nested vectors.', 'I can trace row-major order.', 'I verify dimensions before matrix operations.', 'I can explain all four terms in a 2D prefix query.'],
  commonMistakes: ['Swapping row and column bounds.', 'Assuming every nested vector row has equal length.', 'Using int for potentially large sums.', 'Using output dimensions equal to input dimensions for a non-square transpose.', 'Forgetting the overlap restoration in 2D inclusion-exclusion.'],
  revisionGuidance: ['Draw one 2-by-3 matrix in row-major order.', 'Transpose and multiply two compatible small matrices by hand.', 'Build an extra-border prefix table and answer two boundary queries.'],
  practiceExercises: [
    { id: 'dsa-2d-arrays-p1', title: 'Row and column totals', prompt: 'Find all row and column sums of {{1,2},{3,4},{5,6}}.', difficulty: 'Easy', hints: ['There are three row sums and two column sums.'], solution: 'Row sums are 3, 7, 11; column sums are 9, 12.', explanation: 'Each cell contributes once to its row total and once to its column total.' },
    { id: 'dsa-2d-arrays-p2', title: 'Multiplication dimensions', prompt: 'Can a 2-by-3 matrix multiply a 3-by-4 matrix? State the output dimensions.', difficulty: 'Easy', hints: ['Compare the inner dimensions.'], solution: 'Yes; the result is 2-by-4.', explanation: 'The shared inner size 3 defines each dot product, while the outer dimensions define the result.' },
    { id: 'dsa-2d-arrays-p3', title: 'Jagged safety', prompt: 'Why can matrix[0].size() be an unsafe universal column bound for a nested vector?', difficulty: 'Medium', hints: ['Rows may have different sizes.'], solution: 'Later rows may be shorter or longer than row 0.', explanation: 'A nested vector is not automatically rectangular, so each row size must be checked or rectangularity established first.' },
  ],
  mcqs: [
    { id: 'dsa-2d-arrays-m1', prompt: 'How is a built-in C++ 2D array normally laid out?', options: ['Row-major', 'Column-major', 'Randomly', 'As a linked list'], answer: 0, explanation: 'Each complete row is stored before the following row.' },
    { id: 'dsa-2d-arrays-m2', prompt: 'What is the transpose dimension of a 2-by-5 matrix?', options: ['5-by-2', '2-by-5', '5-by-5', '2-by-2'], answer: 0, explanation: 'Transpose exchanges rows and columns.' },
    { id: 'dsa-2d-arrays-m3', prompt: 'What must hold for A(r by k) * B(x by c)?', options: ['k equals x', 'r equals c', 'r equals x', 'k equals c'], answer: 0, explanation: 'Each row-column dot product requires the first column count to equal the second row count.' },
    { id: 'dsa-2d-arrays-m4', prompt: 'Why does a 2D prefix query add one overlap term?', options: ['It was subtracted twice', 'It was never stored', 'To sort the cells', 'To change dimensions'], answer: 0, explanation: 'Inclusion-exclusion subtracts the shared top-left region twice, so one copy is restored.' },
    { id: 'dsa-2d-arrays-m5', prompt: 'What is direct traversal time for an r-by-c matrix?', options: ['Theta(r*c)', 'Theta(r+c) always', 'Theta(1)', 'Theta(log r)'], answer: 0, explanation: 'Visiting every cell performs work proportional to the number of cells.' },
  ],
  coding: [
    { id: 'dsa-2d-arrays-c1', title: 'Transpose a rectangular matrix', difficulty: 'Easy', language: 'cpp', prompt: 'Return the transpose. Reject jagged input with std::invalid_argument; an empty matrix returns empty.', starter: '#include <stdexcept>\n#include <vector>\nstd::vector<std::vector<int>> transpose(const std::vector<std::vector<int>>& matrix) {\n    // validate, then transpose\n}\n', examples: [{ input: '{{1,2,3},{4,5,6}}', output: '{{1,4},{2,5},{3,6}}' }], hints: ['Establish the column count once.', 'result[c][r] = matrix[r][c].'], referenceSolution: 'std::vector<std::vector<int>> transpose(const std::vector<std::vector<int>>& matrix) {\n    if (matrix.empty()) return {};\n    const std::size_t columns = matrix.front().size();\n    for (const auto& row : matrix) if (row.size() != columns) throw std::invalid_argument("jagged matrix");\n    std::vector<std::vector<int>> result(columns, std::vector<int>(matrix.size()));\n    for (std::size_t r = 0; r < matrix.size(); ++r)\n        for (std::size_t c = 0; c < columns; ++c) result[c][r] = matrix[r][c];\n    return result;\n}' },
    { id: 'dsa-2d-arrays-c2', title: 'Build and query a 2D prefix table', difficulty: 'Medium', language: 'cpp', prompt: 'Build an extra-border prefix table for a rectangular matrix and return a validated inclusive rectangle sum.', starter: '#include <stdexcept>\n#include <vector>\nusing Grid = std::vector<std::vector<int>>;\nlong long rectangleSum(const Grid& grid, int r1, int c1, int r2, int c2) {\n    // validate, build, query\n}\n', examples: [{ input: '{{1,2,3},{4,5,6},{7,8,9}}, (1,0)..(2,1)', output: '24' }], hints: ['Use (rows+1)-by-(columns+1).', 'Use long long in the table.'], referenceSolution: 'long long rectangleSum(const Grid& grid, int r1, int c1, int r2, int c2) {\n    if (grid.empty() || grid.front().empty()) throw std::invalid_argument("empty matrix");\n    const std::size_t rows = grid.size(), columns = grid.front().size();\n    for (const auto& row : grid) if (row.size() != columns) throw std::invalid_argument("jagged matrix");\n    if (r1 < 0 || c1 < 0 || r1 > r2 || c1 > c2 || r2 >= static_cast<int>(rows) || c2 >= static_cast<int>(columns)) throw std::out_of_range("invalid rectangle");\n    std::vector<std::vector<long long>> prefix(rows + 1, std::vector<long long>(columns + 1));\n    for (std::size_t r = 0; r < rows; ++r) for (std::size_t c = 0; c < columns; ++c)\n        prefix[r + 1][c + 1] = grid[r][c] + prefix[r][c + 1] + prefix[r + 1][c] - prefix[r][c];\n    return prefix[r2 + 1][c2 + 1] - prefix[r1][c2 + 1] - prefix[r2 + 1][c1] + prefix[r1][c1];\n}' },
  ],
  resources: [
    { title: 'cppreference: array declaration', url: 'https://en.cppreference.com/w/cpp/language/array', kind: 'web' },
    { title: 'cppreference: std::vector', url: 'https://en.cppreference.com/w/cpp/container/vector', kind: 'web' },
  ],
}
