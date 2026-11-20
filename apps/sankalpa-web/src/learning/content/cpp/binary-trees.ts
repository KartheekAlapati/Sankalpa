import type { Topic } from '../../types'

export const dsaBinaryTrees: Topic = {
  id: 'dsa-trees',
  title: 'Binary Trees',
  summary: 'Model hierarchical nodes, distinguish tree shapes, traverse recursively and iteratively, and reason about height, counting, ownership, and cleanup.',
  prerequisiteTopicIds: ['dsa-recursion-basics', 'cpp-memory', 'dsa-queue'],
  crossLinkTopicIds: ['dsa-tree-traversals', 'dsa-bst'],
  lessons: [
    {
      id: 'dsa-trees-structure', title: 'Tree terminology, shapes, and representation', durationMinutes: 60,
      objectives: ['Name tree relationships and measurements', 'Distinguish full, complete, and perfect binary trees', 'Represent and own nodes safely'],
      theory: [
        'A tree has a root and parent-child edges without cycles. Siblings share a parent; a leaf has no children. Depth counts edges from root to a node. This course defines height as the number of nodes on the longest downward path, so an empty tree has height 0 and a leaf has height 1.',
        'A binary node has at most left and right children. A full binary tree gives every node zero or two children. A complete tree fills every level except possibly the last, which is filled left to right. A perfect tree has all internal nodes with two children and all leaves at one depth.',
        'Pointers naturally represent irregular trees; arrays work well for complete-tree layouts such as heaps. Raw pointers require an owner that recursively deletes each node exactly once. A unique_ptr-based node can encode exclusive ownership and clean descendants automatically.',
      ],
      examples: [{ title: 'Classify a small tree', problem: 'Root 4 has children 2 and 7; node 2 has children 1 and 3.', walkthrough: ['Root depth is 0; nodes 1 and 3 have depth 2.', 'Every internal node has two children, so the tree is full.', 'The last level is filled only under the leftmost parent, so it is complete.', 'Leaves are not all at the same depth because 7 is shallower.'], result: 'The tree is full and complete but not perfect; its node-height is 3.' }],
    },
    {
      id: 'dsa-trees-depth-first', title: 'Recursive and iterative depth-first traversals', durationMinutes: 65,
      objectives: ['Trace preorder, inorder, and postorder', 'Implement recursive traversal base cases', 'Use an explicit stack for iterative DFS'],
      theory: [
        'Preorder visits node, left, right; inorder visits left, node, right; postorder visits left, right, node. These orders describe timing relative to the recursive child calls, not numerical sorting.',
        'The recursive base case returns on nullptr. Every node is processed once, giving Theta(n) time. Auxiliary call-stack space is Theta(h), where h can be n for a skewed tree; a binary tree is not automatically balanced.',
        'Iterative preorder can push right then left so the stack pops left first. Iterative inorder repeatedly descends left, then visits and moves right. Iterative postorder needs additional state or a second stack to know when children are complete.',
      ],
      examples: [{ title: 'Traversal dry run', problem: 'Root 4; left subtree 2 with children 1,3; right child 7.', walkthrough: ['Preorder visits 4, then 2,1,3, then 7.', 'Inorder visits 1,2,3, then 4, then 7.', 'Postorder visits 1,3,2, then 7, then 4.'], result: 'Preorder [4,2,1,3,7], inorder [1,2,3,4,7], postorder [1,3,2,7,4].' }],
    },
    {
      id: 'dsa-trees-breadth-measures', title: 'Level order, height, counts, and diameter preview', durationMinutes: 65,
      objectives: ['Traverse levels with a queue', 'Compute height, node count, and leaf count', 'Define tree diameter and its complexity risk'],
      theory: [
        'Level-order traversal is breadth-first search: enqueue the root, then repeatedly dequeue a node and enqueue its non-null children. Recording the queue size before a level lets the algorithm group output by depth.',
        'Recursive height is 1 + max(leftHeight,rightHeight). Node count is 1 plus both subtree counts. Leaf count returns 1 only when both children are null. Each uses Theta(n) time and Theta(h) call space.',
        'Diameter is the longest path between two nodes, often measured in edges or nodes; state the convention. Recomputing subtree heights at every node can take O(n²) on a skewed tree. A later postorder pattern computes height and best diameter together in O(n).',
      ],
      examples: [{ title: 'Level-order queue trace', problem: 'Traverse root 4 with children 2,7; 2 has children 1,3.', walkthrough: ['Queue starts [4]; process one node for level 0.', 'Queue becomes [2,7]; process two nodes for level 1.', 'Enqueue children of 2, producing [1,3] for level 2.'], result: 'Levels are [[4],[2,7],[1,3]] in Theta(n) time and O(w) queue space for maximum width w.' }],
    },
  ],
  checklist: ['I state whether height counts nodes or edges.', 'I distinguish full, complete, and perfect trees.', 'I can derive all three DFS orders from visit timing.', 'I include nullptr base cases.', 'I identify the owner responsible for deleting each node.'],
  commonMistakes: ['Calling every binary tree a BST.', 'Assuming every binary tree is balanced.', 'Mixing node-height and edge-height conventions.', 'Pushing left before right in iterative preorder and then getting reversed output.', 'Deleting a node without recursively or automatically owning its descendants.'],
  revisionGuidance: ['Draw and label root, parent, sibling, leaf, depth, and height.', 'Write all four traversal orders for one asymmetric tree.', 'Compare recursion space on perfect and skewed trees.'],
  practiceExercises: [
    { id: 'dsa-trees-p1', title: 'Traversal order', prompt: 'For root 2 with left 1 and right 3, list preorder, inorder, and postorder.', difficulty: 'Easy', hints: ['Place the root before, between, or after child traversals.'], solution: 'Preorder 2,1,3; inorder 1,2,3; postorder 1,3,2.', explanation: 'Each order changes only when the root is visited relative to its subtrees.' },
    { id: 'dsa-trees-p2', title: 'Height convention', prompt: 'Under node-count height, what are the heights of an empty tree and a single node?', difficulty: 'Easy', hints: ['Use the convention stated in this topic.'], solution: 'Empty height is 0 and single-node height is 1.', explanation: 'The longest root-to-leaf path contains one node in a single-node tree.' },
    { id: 'dsa-trees-p3', title: 'Skewed recursion space', prompt: 'What auxiliary stack space can recursive traversal require for a chain of n nodes?', difficulty: 'Easy', hints: ['The height equals the number of nodes.'], solution: 'Theta(n) auxiliary call-stack space.', explanation: 'Every node remains active until the recursive descent reaches the chain end.' },
  ],
  mcqs: [
    { id: 'dsa-trees-m1', prompt: 'What is a leaf?', options: ['A node with no children', 'The root only', 'A node with two children', 'Any node at depth one'], answer: 0, explanation: 'A leaf has neither a left nor a right child.' },
    { id: 'dsa-trees-m2', prompt: 'Which order is left, node, right?', options: ['Inorder', 'Preorder', 'Postorder', 'Level order'], answer: 0, explanation: 'Inorder places the node visit between left and right subtree traversal.' },
    { id: 'dsa-trees-m3', prompt: 'What structure supports level-order traversal?', options: ['Queue', 'Only recursion', 'Hash set only', 'Priority queue by value'], answer: 0, explanation: 'FIFO order processes parents before nodes discovered at the next level.' },
    { id: 'dsa-trees-m4', prompt: 'What is traversal time for n tree nodes?', options: ['Theta(n)', 'Theta(log n) always', 'Theta(n²) always', 'Theta(1)'], answer: 0, explanation: 'A complete traversal visits each node a constant number of times.' },
    { id: 'dsa-trees-m5', prompt: 'Can a binary tree of n nodes have height n under node-height?', options: ['Yes, when skewed', 'No, height is always log n', 'Only if it is perfect', 'Only with duplicate values'], answer: 0, explanation: 'A chain with one child per node has a longest downward path containing all n nodes.' },
  ],
  coding: [
    { id: 'dsa-trees-c1', title: 'Recursive preorder traversal', difficulty: 'Easy', language: 'cpp', prompt: 'Return preorder values for a raw-pointer tree without modifying it.', starter: '#include <vector>\nstruct TreeNode { int value; TreeNode* left; TreeNode* right; };\nstd::vector<int> preorder(const TreeNode* root) {\n    // node, left, right\n}\n', examples: [{ input: '4 with children 2,7 and 2 children 1,3', output: '{4,2,1,3,7}' }, { input: 'empty', output: '{}' }], hints: ['Return immediately on nullptr.', 'Use a helper that appends into one vector.'], referenceSolution: 'void preorderInto(const TreeNode* node, std::vector<int>& output) {\n    if (node == nullptr) return;\n    output.push_back(node->value);\n    preorderInto(node->left, output);\n    preorderInto(node->right, output);\n}\nstd::vector<int> preorder(const TreeNode* root) {\n    std::vector<int> output;\n    preorderInto(root, output);\n    return output;\n}' },
    { id: 'dsa-trees-c2', title: 'Level-order groups', difficulty: 'Medium', language: 'cpp', prompt: 'Return one vector per tree level using a queue.', starter: '#include <queue>\n#include <vector>\nstruct TreeNode { int value; TreeNode* left; TreeNode* right; };\nstd::vector<std::vector<int>> levels(const TreeNode* root) {\n    // breadth-first traversal\n}\n', examples: [{ input: '4 / 2,7 / 1,3', output: '{{4},{2,7},{1,3}}' }, { input: 'empty', output: '{}' }], hints: ['The queue size at loop start is the current level size.', 'Enqueue only non-null children.'], referenceSolution: 'std::vector<std::vector<int>> levels(const TreeNode* root) {\n    std::vector<std::vector<int>> output;\n    if (root == nullptr) return output;\n    std::queue<const TreeNode*> pending;\n    pending.push(root);\n    while (!pending.empty()) {\n        const std::size_t count = pending.size();\n        std::vector<int> level;\n        for (std::size_t i = 0; i < count; ++i) {\n            const TreeNode* node = pending.front(); pending.pop();\n            level.push_back(node->value);\n            if (node->left != nullptr) pending.push(node->left);\n            if (node->right != nullptr) pending.push(node->right);\n        }\n        output.push_back(std::move(level));\n    }\n    return output;\n}' },
    { id: 'dsa-trees-c3', title: 'Height and leaf count', difficulty: 'Easy', language: 'cpp', prompt: 'Return node-height and leaf count for a binary tree.', starter: '#include <algorithm>\n#include <utility>\nstruct TreeNode { int value; TreeNode* left; TreeNode* right; };\nstd::pair<int,int> heightAndLeaves(const TreeNode* root) {\n    // {height, leaves}\n}\n', examples: [{ input: 'single node', output: '{1,1}' }, { input: 'empty', output: '{0,0}' }], hints: ['A leaf has both children null.', 'Height is one plus the larger child height.'], referenceSolution: 'std::pair<int,int> heightAndLeaves(const TreeNode* root) {\n    if (root == nullptr) return {0, 0};\n    if (root->left == nullptr && root->right == nullptr) return {1, 1};\n    const auto left = heightAndLeaves(root->left);\n    const auto right = heightAndLeaves(root->right);\n    return {1 + std::max(left.first, right.first), left.second + right.second};\n}' },
  ],
  resources: [
    { title: 'cppreference: std::unique_ptr', url: 'https://en.cppreference.com/w/cpp/memory/unique_ptr', kind: 'web' },
    { title: 'cppreference: std::queue', url: 'https://en.cppreference.com/w/cpp/container/queue', kind: 'web' },
    { title: 'cppreference: std::stack', url: 'https://en.cppreference.com/w/cpp/container/stack', kind: 'web' },
  ],
}
