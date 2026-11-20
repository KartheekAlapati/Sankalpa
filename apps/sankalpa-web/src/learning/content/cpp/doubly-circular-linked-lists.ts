import type { Topic } from '../../types'

export const dsaDoublyCircularLinkedLists: Topic = {
  id: 'dsa-doubly-linked-list',
  title: 'Doubly and Circular Linked Lists',
  summary: 'Maintain previous and next links, reason about head and tail boundaries, and traverse circular structures with explicit termination rules.',
  prerequisiteTopicIds: ['dsa-linked-list'],
  crossLinkTopicIds: ['dsa-circular-linked-list'],
  lessons: [
    {
      id: 'dsa-doubly-linked-list-links', title: 'Doubly linked nodes and boundary invariants', durationMinutes: 55,
      objectives: ['Trace previous and next pointers', 'Maintain head and tail invariants', 'Traverse safely in both directions'],
      theory: [
        'A doubly linked node stores prev and next. In a non-circular list, head->prev is nullptr and tail->next is nullptr. An empty list has both head and tail null; a single node is both head and tail.',
        'Forward traversal follows next; backward traversal follows prev. Given a node pointer, removing that known node is O(1), but locating a value remains Theta(n).',
        'Every update must keep neighboring links symmetric: if a->next is b, then b->prev should be a. Check the empty, one-node, head, and tail cases rather than assuming both neighbors exist.',
      ],
      examples: [{ title: 'Insert between two nodes', problem: 'Insert 6 between 4 and 9.', walkthrough: ['Set newNode->prev to 4 and newNode->next to 9.', 'Set 4->next to newNode.', 'Set 9->prev to newNode.', 'Verify both directions: 4,6,9 and 9,6,4.'], result: 'Insertion is O(1) when the neighboring node is already known.' }],
    },
    {
      id: 'dsa-doubly-linked-list-operations', title: 'Insertion, deletion, and ownership', durationMinutes: 55,
      objectives: ['Insert and erase without losing neighbors', 'Update head and tail correctly', 'Release each removed node exactly once'],
      theory: [
        'Before deleting target, save or reconnect both neighbors. If target->prev exists, set its next to target->next; otherwise move head. If target->next exists, set its prev to target->prev; otherwise move tail.',
        'Pointer-update order matters because overwriting the only path to a neighbor can lose the remaining list. Reconnect surviving nodes before delete, and never inspect target after delete.',
        'Raw nodes require one owning list and deterministic destruction. Standard std::list supplies a maintained doubly linked container when custom node mechanics are not the learning objective.',
      ],
      examples: [{ title: 'Delete the tail', problem: 'Delete 8 from 2 <-> 5 <-> 8.', walkthrough: ['target->next is null, so target is the tail.', 'Move tail to target->prev, the node 5.', 'Set tail->next to null.', 'Delete target.'], result: 'The list becomes 2 <-> 5, with head at 2 and tail at 5.' }],
    },
    {
      id: 'dsa-circular-linked-list-model', title: 'Circular singly and doubly linked lists', durationMinutes: 60,
      objectives: ['State circular-list invariants', 'Terminate circular traversal correctly', 'Compare circular singly and doubly linked operations'],
      theory: [
        'In a non-empty circular singly linked list represented by tail, tail->next is head. A one-node list points to itself. There is no null end marker, so traversal often uses do-while and stops when the current pointer returns to head.',
        'A circular doubly linked list connects head->prev to tail and tail->next to head. It supports moving both directions around the ring, but every insertion or deletion must preserve four boundary relationships.',
        'Circular structures fit round-robin scheduling and repeating playlists. A corrupted cycle can loop forever, so production traversal should use a known size, a sentinel, or a defensible safety limit in addition to the return-to-start rule.',
      ],
      examples: [{ title: 'Circular traversal', problem: 'Traverse tail-based ring 3 -> 5 -> 7 -> back to 3.', walkthrough: ['Set start = tail->next, the node 3.', 'Visit 3, then 5, then 7.', 'Advance from 7 to 3.', 'Stop because current equals start.'], result: 'Exactly three nodes are visited; the traversal is Theta(n).' }],
    },
  ],
  checklist: ['I maintain symmetric prev/next links.', 'I update head and tail for boundary operations.', 'I handle empty and single-node lists explicitly.', 'I can state the stopping rule before circular traversal.', 'I know who owns and deletes every raw node.'],
  commonMistakes: ['Updating only one direction of a doubly linked connection.', 'Leaving head or tail pointing to a deleted node.', 'Using while(current != nullptr) for a proper circular list.', 'Forgetting the self-link in a one-node circular list.', 'Deleting through an unbounded circular traversal.'],
  revisionGuidance: ['Draw all four links around an insertion between two doubly linked nodes.', 'Trace deletion at head, middle, tail, and the only node.', 'Write a circular traversal stopping condition before writing its loop body.'],
  practiceExercises: [
    { id: 'dsa-doubly-linked-list-p1', title: 'Symmetry check', prompt: 'After linking A before B, which two expressions should be true?', difficulty: 'Easy', hints: ['Check both directions.'], solution: 'A->next == B and B->prev == A.', explanation: 'The two links are the local invariant that makes forward and backward traversal agree.' },
    { id: 'dsa-doubly-linked-list-p2', title: 'Only-node deletion', prompt: 'What should head and tail be after deleting the sole node?', difficulty: 'Easy', hints: ['The list becomes empty.'], solution: 'Both must be nullptr.', explanation: 'Leaving either pointer unchanged would leave a dangling boundary pointer.' },
    { id: 'dsa-doubly-linked-list-p3', title: 'Circular stop rule', prompt: 'Why is returning to the start a better stop rule than waiting for nullptr in a valid circular list?', difficulty: 'Easy', hints: ['A valid ring has no null next link.'], solution: 'The successor chain repeats at the starting node and never reaches nullptr.', explanation: 'Detecting the completed cycle visits each ring node once and then terminates.' },
  ],
  mcqs: [
    { id: 'dsa-doubly-linked-list-m1', prompt: 'What does a doubly linked node add?', options: ['A previous pointer', 'Contiguous storage', 'Automatic sorting', 'A matrix row'], answer: 0, explanation: 'The previous pointer supports reverse traversal and direct unlinking with known nodes.' },
    { id: 'dsa-doubly-linked-list-m2', prompt: 'In a non-circular doubly list, what is head->prev?', options: ['nullptr', 'head', 'tail always', 'An integer index'], answer: 0, explanation: 'No node precedes the head in a non-circular list.' },
    { id: 'dsa-doubly-linked-list-m3', prompt: 'For a tail-based circular singly list, where is head?', options: ['tail->next', 'tail->prev', 'nullptr', 'At index zero in an array'], answer: 0, explanation: 'The tail successor wraps to the first node.' },
    { id: 'dsa-doubly-linked-list-m4', prompt: 'How should a one-node circular node link forward?', options: ['To itself', 'To nullptr only', 'To an unrelated node', 'It has no next field'], answer: 0, explanation: 'Self-linking preserves the ring invariant for one element.' },
    { id: 'dsa-doubly-linked-list-m5', prompt: 'Removing a known doubly linked node is normally what complexity?', options: ['O(1)', 'O(n) after it is known', 'O(log n)', 'O(n²)'], answer: 0, explanation: 'Only a constant number of neighboring and boundary links change.' },
  ],
  coding: [
    { id: 'dsa-doubly-linked-list-c1', title: 'Erase a known doubly linked node', difficulty: 'Medium', language: 'cpp', prompt: 'Given DNode with prev/next, erase target and update head and tail. Do nothing for nullptr target.', starter: 'struct DNode { int value; DNode* prev; DNode* next; };\nvoid eraseNode(DNode*& head, DNode*& tail, DNode* target) {\n    // reconnect boundaries and delete\n}\n', examples: [{ input: '2 <-> 5 <-> 8, target=5', output: '2 <-> 8' }, { input: 'single node', output: 'empty' }], hints: ['A missing prev means target is head.', 'A missing next means target is tail.'], referenceSolution: 'void eraseNode(DNode*& head, DNode*& tail, DNode* target) {\n    if (target == nullptr) return;\n    if (target->prev != nullptr) target->prev->next = target->next;\n    else head = target->next;\n    if (target->next != nullptr) target->next->prev = target->prev;\n    else tail = target->prev;\n    delete target;\n}' },
    { id: 'dsa-doubly-linked-list-c2', title: 'Read a circular list safely', difficulty: 'Medium', language: 'cpp', prompt: 'Given a valid circular singly list head, return its values in one lap. Throw if maxNodes is exceeded, guarding malformed input.', starter: '#include <stdexcept>\n#include <vector>\nstruct CNode { int value; const CNode* next; };\nstd::vector<int> oneLap(const CNode* head, std::size_t maxNodes) {\n    // stop on return to head\n}\n', examples: [{ input: '3 -> 5 -> 7 -> 3, maxNodes=3', output: '{3,5,7}' }, { input: 'empty', output: '{}' }], hints: ['Use a do-while for a non-empty ring.', 'Check nullptr and the safety limit.'], referenceSolution: 'std::vector<int> oneLap(const CNode* head, std::size_t maxNodes) {\n    std::vector<int> values;\n    if (head == nullptr) return values;\n    const CNode* current = head;\n    do {\n        if (current == nullptr || values.size() >= maxNodes) throw std::runtime_error("malformed circular list");\n        values.push_back(current->value);\n        current = current->next;\n    } while (current != head);\n    return values;\n}' },
  ],
  resources: [
    { title: 'cppreference: std::list', url: 'https://en.cppreference.com/w/cpp/container/list', kind: 'web' },
    { title: 'C++ Core Guidelines: resource management', url: 'https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#r-resource-management', kind: 'web' },
  ],
}
