import type { Topic } from '../../types'

export const dsaBinarySearchTrees: Topic = {
  id: 'dsa-bst',
  title: 'Binary Search Trees',
  summary: 'Maintain a stated ordering and duplicate policy while searching, inserting, deleting, validating, and comparing balanced and skewed behavior.',
  prerequisiteTopicIds: ['dsa-trees', 'dsa-complexity'],
  crossLinkTopicIds: ['dsa-tree-traversals', 'dsa-balanced-trees', 'dsa-hashing'],
  lessons: [
    {
      id: 'dsa-bst-invariant', title: 'Ordering, search, insertion, and extrema', durationMinutes: 60,
      objectives: ['State a precise BST invariant', 'Trace iterative search and insertion', 'Find minimum and maximum keys'],
      theory: [
        'Under a unique-key BST policy, every key in a node’s left subtree is smaller and every key in its right subtree is larger. Duplicate policies such as reject, count, or consistently choose one side must be stated and applied everywhere.',
        'Search compares at each node and chooses one subtree. Insertion follows the same path until a null child position is found. Minimum follows left links; maximum follows right links. Inorder traversal yields sorted keys when the invariant holds.',
        'Operation time is O(h), where h is height: O(log n) for a balanced tree but O(n) for a skewed tree. A plain BST does not rebalance itself, so never promise worst-case O(log n).',
      ],
      examples: [{ title: 'Insert and search trace', problem: 'Insert 5,3,8,4 with duplicates rejected; search 4.', walkthrough: ['5 becomes root; 3 goes left; 8 goes right.', '4 is less than 5 and greater than 3, so it becomes 3’s right child.', 'Search 4 compares 5, then 3, then 4.'], result: '4 is found after three comparisons; inorder is 3,4,5,8.' }],
    },
    {
      id: 'dsa-bst-deletion', title: 'Deletion, predecessor, and successor', durationMinutes: 65,
      objectives: ['Delete leaf and one-child nodes', 'Delete a two-child node safely', 'Find predecessor and successor candidates'],
      theory: [
        'Deleting a leaf replaces its parent link with null. Deleting a one-child node reconnects the parent directly to that child, then releases the removed node.',
        'For two children, copy or move the inorder successor key from the minimum of the right subtree, then delete that successor node from the right subtree. The successor has no left child, so the second deletion is simpler. An inorder predecessor from the left subtree is an equivalent policy.',
        'A key’s predecessor is the greatest smaller key and successor is the least greater key. They may be found through subtrees or remembered ancestors. Pointer-based deletion must update the returned subtree root and delete exactly one owned node.',
      ],
      examples: [{ title: 'Three deletion cases', problem: 'BST keys 5,3,8,2,4,7,9; delete 2, then 3, then 5.', walkthrough: ['2 is a leaf: remove its parent link.', '3 now has one child 4: reconnect 4 to 5.', '5 has two children: copy successor 7, then remove original 7 from the right subtree.'], result: 'The BST invariant remains valid after each case; final inorder is 4,7,8,9.' }],
    },
    {
      id: 'dsa-bst-validation-tradeoffs', title: 'Validation, balance, and data-structure tradeoffs', durationMinutes: 60,
      objectives: ['Validate using ancestor bounds', 'Explain skewed-tree degradation', 'Compare BST and hash-table capabilities'],
      theory: [
        'Checking only each node against its immediate children is insufficient: a deep descendant can violate an ancestor bound. Carry an allowed open interval down the recursion and narrow it at every node.',
        'Inserting sorted keys into a plain BST can create a chain. Balanced search trees maintain logarithmic height through additional invariants and rotations, which are introduced separately. Random input is not a worst-case guarantee.',
        'BSTs support sorted traversal, predecessor/successor, and range queries in key order. Hash tables offer expected O(1) exact-key operations but no sorted order. Both need clear ownership and invalidation rules in custom implementations.',
      ],
      examples: [{ title: 'Ancestor-bound violation', problem: 'Root 10 has left child 5; node 5 has right child 12.', walkthrough: ['12 is greater than its parent 5, so a local-only check might accept it.', 'But every node in root 10’s left subtree must be less than 10.', 'The inherited upper bound 10 rejects 12.'], result: 'The tree is not a valid BST under the unique-key policy.' }],
    },
  ],
  checklist: ['I state the duplicate-key policy.', 'I describe operation cost as O(height).', 'I can trace all three deletion cases.', 'I validate against inherited bounds, not only children.', 'I compare BST ordering features with hash-table exact lookup.'],
  commonMistakes: ['Claiming plain BST operations are always O(log n).', 'Checking validation only against immediate children.', 'Forgetting to reconnect the child in one-child deletion.', 'Copying a successor key but failing to delete its original node.', 'Using inconsistent duplicate rules across insertion and validation.'],
  revisionGuidance: ['Insert one sequence that stays balanced and one that becomes skewed.', 'Delete a leaf, one-child node, and two-child node with pointer diagrams.', 'Validate a tree containing a deep ancestor-bound violation.'],
  practiceExercises: [
    { id: 'dsa-bst-p1', title: 'Search path', prompt: 'In BST 8 with children 3 and 10, and 3 children 1 and 6, list comparisons to find 6.', difficulty: 'Easy', hints: ['Choose a side after each comparison.'], solution: 'Compare 8, then 3, then 6.', explanation: 'Six is less than eight but greater than three, determining the unique search path.' },
    { id: 'dsa-bst-p2', title: 'Two-child deletion', prompt: 'What replacement may be used when deleting a node with two children?', difficulty: 'Easy', hints: ['Choose the next key in sorted order.'], solution: 'Use its inorder successor, the minimum key in its right subtree.', explanation: 'The successor respects all left and right ordering relationships after the original node key is replaced.' },
    { id: 'dsa-bst-p3', title: 'Worst-case height', prompt: 'What height can result from inserting 1,2,3,4 into an empty plain BST?', difficulty: 'Easy', hints: ['Every key is larger than the previous one.'], solution: 'Node-height 4, forming a right-skewed chain.', explanation: 'No balancing operation moves nodes, so every insertion follows the rightmost path.' },
  ],
  mcqs: [
    { id: 'dsa-bst-m1', prompt: 'What does inorder traversal of a valid unique-key BST produce?', options: ['Strictly increasing keys', 'Insertion order', 'Level order', 'Random order'], answer: 0, explanation: 'Left subtree keys precede the node, followed by larger right subtree keys.' },
    { id: 'dsa-bst-m2', prompt: 'What is plain BST worst-case search time?', options: ['O(n)', 'O(log n) guaranteed', 'O(1)', 'O(n log n)'], answer: 0, explanation: 'A skewed tree can have height n, and search follows a root-to-leaf path.' },
    { id: 'dsa-bst-m3', prompt: 'Which node commonly replaces a deleted two-child key?', options: ['Inorder successor', 'Any leaf', 'Root always', 'A random duplicate'], answer: 0, explanation: 'The minimum of the right subtree is the next larger key and preserves ordering.' },
    { id: 'dsa-bst-m4', prompt: 'Why are immediate-child checks insufficient for validation?', options: ['Descendants must obey ancestor bounds', 'Leaves have no values', 'BSTs are always complete', 'Comparisons are forbidden'], answer: 0, explanation: 'A descendant can be locally positioned yet lie outside the range imposed by an ancestor.' },
    { id: 'dsa-bst-m5', prompt: 'When can a BST be preferable to a hash table?', options: ['Sorted traversal and range queries are required', 'Only expected exact lookup matters', 'No ordering exists', 'All keys collide'], answer: 0, explanation: 'The BST ordering supports predecessor, successor, and ordered ranges.' },
  ],
  coding: [
    { id: 'dsa-bst-c1', title: 'Insert unique keys and search', difficulty: 'Easy', language: 'cpp', prompt: 'Insert a key into a raw-pointer BST, rejecting duplicates, and implement iterative search. Return the possibly new root.', starter: 'struct BstNode { int key; BstNode* left; BstNode* right; };\nBstNode* insert(BstNode* root, int key) {\n    // unique-key policy\n}\nbool contains(const BstNode* root, int key) {\n}\n', examples: [{ input: 'insert 5,3,8,4; search 4', output: 'true' }, { input: 'insert duplicate 3', output: 'tree unchanged' }], hints: ['Allocate only after reaching a null link.', 'Return immediately when key equals current key.'], referenceSolution: 'BstNode* insert(BstNode* root, int key) {\n    if (root == nullptr) return new BstNode{key, nullptr, nullptr};\n    BstNode* current = root;\n    while (true) {\n        if (key == current->key) return root;\n        BstNode*& next = key < current->key ? current->left : current->right;\n        if (next == nullptr) { next = new BstNode{key, nullptr, nullptr}; return root; }\n        current = next;\n    }\n}\nbool contains(const BstNode* root, int key) {\n    while (root != nullptr) {\n        if (key == root->key) return true;\n        root = key < root->key ? root->left : root->right;\n    }\n    return false;\n}' },
    { id: 'dsa-bst-c2', title: 'Delete a BST key', difficulty: 'Medium', language: 'cpp', prompt: 'Delete one key under a unique-key policy and return the new subtree root. Handle all three structural cases.', starter: 'struct BstNode { int key; BstNode* left; BstNode* right; };\nBstNode* erase(BstNode* root, int key) {\n    // recurse, reconnect, release\n}\n', examples: [{ input: 'keys 5,3,8,2,4,7,9; erase 5', output: 'inorder 2,3,4,7,8,9' }], hints: ['Return child directly for zero/one-child cases.', 'For two children, use minimum of right subtree.'], referenceSolution: 'BstNode* erase(BstNode* root, int key) {\n    if (root == nullptr) return nullptr;\n    if (key < root->key) root->left = erase(root->left, key);\n    else if (key > root->key) root->right = erase(root->right, key);\n    else {\n        if (root->left == nullptr) { BstNode* right = root->right; delete root; return right; }\n        if (root->right == nullptr) { BstNode* left = root->left; delete root; return left; }\n        BstNode* successor = root->right;\n        while (successor->left != nullptr) successor = successor->left;\n        root->key = successor->key;\n        root->right = erase(root->right, successor->key);\n    }\n    return root;\n}' },
    { id: 'dsa-bst-c3', title: 'Validate ancestor bounds', difficulty: 'Medium', language: 'cpp', prompt: 'Validate a unique-key BST using open long-long bounds so int minimum and maximum keys are supported.', starter: '#include <limits>\nstruct BstNode { int key; BstNode* left; BstNode* right; };\nbool validBst(const BstNode* root) {\n    // inherited open interval\n}\n', examples: [{ input: '10 with left 5 and 5 right 12', output: 'false' }, { input: 'empty', output: 'true' }], hints: ['Every left descendant must be below the current key.', 'Use long long bounds outside int range.'], referenceSolution: 'bool validRange(const BstNode* node, long long low, long long high) {\n    if (node == nullptr) return true;\n    if (node->key <= low || node->key >= high) return false;\n    return validRange(node->left, low, node->key) && validRange(node->right, node->key, high);\n}\nbool validBst(const BstNode* root) {\n    return validRange(root, std::numeric_limits<long long>::lowest(), std::numeric_limits<long long>::max());\n}' },
  ],
  resources: [
    { title: 'cppreference: std::set', url: 'https://en.cppreference.com/w/cpp/container/set', kind: 'web' },
    { title: 'cppreference: std::map', url: 'https://en.cppreference.com/w/cpp/container/map', kind: 'web' },
    { title: 'C++ Core Guidelines: resource management', url: 'https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#r-resource-management', kind: 'web' },
  ],
}
