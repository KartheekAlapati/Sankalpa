import type { Topic } from '../../types'

export const dsaSinglyLinkedLists: Topic = {
  id: 'dsa-linked-list',
  title: 'Singly Linked Lists',
  summary: 'Build and trace pointer-linked nodes, perform safe updates, reverse links, detect cycles, and account for ownership and cleanup.',
  prerequisiteTopicIds: ['cpp-memory', 'dsa-complexity'],
  crossLinkTopicIds: ['dsa-physical-logical'],
  lessons: [
    {
      id: 'dsa-linked-list-model', title: 'Nodes, links, and ownership', durationMinutes: 50,
      objectives: ['Draw a node and next-pointer chain', 'Explain the head pointer and empty list', 'Relate heap allocation to ownership and cleanup'],
      theory: [
        'A singly linked node stores a value and a pointer to the next node. The head pointer identifies the first node; head == nullptr represents an empty list. The final node has next == nullptr.',
        'Nodes need not occupy adjacent addresses. Following next is required to reach later nodes, so finding index i costs Theta(i) and arbitrary indexed access is not O(1).',
        'Foundational raw-pointer examples make link changes visible, but one clear owner must delete every allocated node exactly once. Production code often uses an owning container or std::unique_ptr design to make cleanup automatic.',
      ],
      examples: [{ title: 'Three-node pointer diagram', problem: 'Represent values 4, 7, 9.', walkthrough: ['head points to the node containing 4.', 'That node’s next points to 7.', 'The 7 node points to 9, and 9 points to nullptr.'], result: 'Traversal visits 4, 7, 9 in Theta(n) time and O(1) iterative auxiliary space.' }],
    },
    {
      id: 'dsa-linked-list-operations', title: 'Insertion, deletion, search, and length', durationMinutes: 60,
      objectives: ['Insert at the head, tail, and a validated position', 'Delete safely without losing the remaining chain', 'Compare operation complexities'],
      theory: [
        'Head insertion sets newNode->next to the old head before assigning head = newNode. It is O(1). Tail insertion is Theta(n) without a maintained tail pointer and O(1) with one.',
        'Deletion first preserves the link that must survive, then reconnects the predecessor, then deletes the removed node. Empty, head, tail, absent-value, and single-node cases require deliberate handling.',
        'Search, length, insert-at-position, and delete-by-value may scan the chain and are Theta(n). Never dereference current until confirming current != nullptr, and define whether positions are zero- or one-based.',
      ],
      examples: [{ title: 'Delete by value', problem: 'Delete 7 from 4 -> 7 -> 9.', walkthrough: ['Keep previous at 4 and current at 7.', 'Set previous->next to current->next, which is 9.', 'Delete current; do not access it again.'], result: 'The chain becomes 4 -> 9; search plus deletion is Theta(n) time and O(1) space.' }],
    },
    {
      id: 'dsa-linked-list-reverse-cycle', title: 'Reversal and slow-fast pointers', durationMinutes: 60,
      objectives: ['Reverse links iteratively', 'Use slow and fast pointers for cycle detection', 'Avoid infinite traversal and leaks'],
      theory: [
        'Iterative reversal maintains previous, current, and next. Save current->next before overwriting it, point current backward, then advance both working pointers. The old tail becomes the new head.',
        'Floyd cycle detection moves slow one link and fast two links. If they meet, a cycle exists; if fast or fast->next becomes null, traversal reaches a real end. It runs in Theta(n) time and O(1) space.',
        'A cyclic raw-pointer list cannot be cleaned by an ordinary while(head) traversal because it never reaches null. Break the cycle or use a structure with explicit ownership rules before deleting nodes.',
      ],
      examples: [{ title: 'Reverse dry run', problem: 'Reverse 2 -> 5 -> 8.', walkthrough: ['Move 2 behind previous: null <- 2; current becomes 5.', 'Move 5 behind 2: null <- 2 <- 5; current becomes 8.', 'Move 8 behind 5 and set head to previous.'], result: 'The list is 8 -> 5 -> 2 in Theta(n) time and O(1) auxiliary space.' }],
    },
  ],
  checklist: ['I can draw head, node values, next links, and nullptr.', 'I save a link before overwriting it.', 'I handle empty and single-node cases.', 'I can reverse a list using three pointers.', 'I assign and explain node ownership and cleanup.'],
  commonMistakes: ['Dereferencing head when the list is empty.', 'Overwriting next before saving the remaining chain.', 'Deleting a node and then reading from it.', 'Forgetting to update head when the first node changes.', 'Traversing a possibly cyclic list without a termination safeguard.'],
  revisionGuidance: ['Draw insert-at-head, insert-at-tail, and delete-head pointer transitions.', 'Trace iterative reversal in a three-column table.', 'Explain why Floyd detection terminates for both cyclic and acyclic lists.'],
  practiceExercises: [
    { id: 'dsa-linked-list-p1', title: 'Head insertion trace', prompt: 'Insert 3 before 5 -> 8. List pointer assignments in order.', difficulty: 'Easy', hints: ['Link the new node before moving head.'], solution: 'newNode->next = head; head = newNode.', explanation: 'Preserving the former head in newNode->next prevents the old chain from becoming unreachable.' },
    { id: 'dsa-linked-list-p2', title: 'Indexed access cost', prompt: 'Why is reading index 50 not O(1) in a singly linked list?', difficulty: 'Easy', hints: ['A node stores only its successor.'], solution: 'Traversal must follow links from head through the preceding nodes.', explanation: 'Nodes are not addressed through a contiguous base-plus-index calculation.' },
    { id: 'dsa-linked-list-p3', title: 'Single-node deletion', prompt: 'Delete the only node when head points to it. What must head become?', difficulty: 'Easy', hints: ['The resulting list is empty.'], solution: 'Save the node, set head to nullptr, then delete the saved node.', explanation: 'Clearing head prevents it from remaining a dangling pointer.' },
  ],
  mcqs: [
    { id: 'dsa-linked-list-m1', prompt: 'What represents an empty singly linked list?', options: ['head == nullptr', 'head->next == head', 'A node with value zero', 'An uninitialized pointer'], answer: 0, explanation: 'A null head points to no first node and safely represents emptiness.' },
    { id: 'dsa-linked-list-m2', prompt: 'What is head insertion complexity?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], answer: 0, explanation: 'Only the new node link and head pointer change.' },
    { id: 'dsa-linked-list-m3', prompt: 'Why save current->next during reversal?', options: ['To retain the unreversed chain', 'To sort values', 'To allocate a node', 'To find array length'], answer: 0, explanation: 'Overwriting current->next otherwise loses the only link to remaining nodes.' },
    { id: 'dsa-linked-list-m4', prompt: 'In Floyd detection, how quickly does fast move?', options: ['Two links per step', 'One link per step', 'Three links only once', 'It never moves'], answer: 0, explanation: 'Moving two links lets fast eventually meet slow inside a cycle.' },
    { id: 'dsa-linked-list-m5', prompt: 'What causes a leak in a raw-pointer list?', options: ['Losing the last owning pointer without delete', 'Setting an empty head to nullptr', 'Reading a value', 'Comparing two pointers'], answer: 0, explanation: 'An unreachable allocated node can no longer be released by its intended owner.' },
  ],
  coding: [
    { id: 'dsa-linked-list-c1', title: 'Reverse a singly linked list', difficulty: 'Easy', language: 'cpp', prompt: 'Given struct Node { int value; Node* next; }, reverse the list and return its new head. Empty and single-node lists must work.', starter: 'struct Node { int value; Node* next; };\nNode* reverseList(Node* head) {\n    // preserve, reverse, advance\n}\n', examples: [{ input: '2 -> 5 -> 8', output: '8 -> 5 -> 2' }, { input: 'empty', output: 'empty' }], hints: ['Keep previous and current.', 'Save next before changing current->next.'], referenceSolution: 'Node* reverseList(Node* head) {\n    Node* previous = nullptr;\n    Node* current = head;\n    while (current != nullptr) {\n        Node* next = current->next;\n        current->next = previous;\n        previous = current;\n        current = next;\n    }\n    return previous;\n}' },
    { id: 'dsa-linked-list-c2', title: 'Detect a cycle', difficulty: 'Medium', language: 'cpp', prompt: 'Return true when a singly linked list contains a cycle. Do not modify the list and use O(1) auxiliary space.', starter: 'struct Node { int value; Node* next; };\nbool hasCycle(const Node* head) {\n    // slow and fast pointers\n}\n', examples: [{ input: '1 -> 2 -> 3 -> node 2', output: 'true' }, { input: '1 -> 2 -> nullptr', output: 'false' }], hints: ['Fast needs two valid links before advancing.', 'Pointer equality detects a meeting.'], referenceSolution: 'bool hasCycle(const Node* head) {\n    const Node* slow = head;\n    const Node* fast = head;\n    while (fast != nullptr && fast->next != nullptr) {\n        slow = slow->next;\n        fast = fast->next->next;\n        if (slow == fast) return true;\n    }\n    return false;\n}' },
  ],
  resources: [
    { title: 'cppreference: std::forward_list', url: 'https://en.cppreference.com/w/cpp/container/forward_list', kind: 'web' },
    { title: 'cppreference: std::unique_ptr', url: 'https://en.cppreference.com/w/cpp/memory/unique_ptr', kind: 'web' },
  ],
}
