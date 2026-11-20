import type { Topic } from '../../types'

export const dsaDisjointSetUnion: Topic = {
  id: 'dsa-dsu',
  title: 'Disjoint Set Union',
  summary: 'Maintain a partition under connectivity queries with representative roots, path compression, union by size or rank, and explicit component-count invariants.',
  prerequisiteTopicIds: ['dsa-graphs'],
  crossLinkTopicIds: ['dsa-dfs', 'dsa-mst', 'dsa-kruskal'],
  lessons: [
    {
      id: 'dsa-dsu-partitions', title: 'Partitions, representatives, and the parent forest', durationMinutes: 65,
      objectives: ['Model disjoint sets as a partition', 'Trace naive find and union', 'State the parent-forest invariant'],
      theory: [
        'A disjoint-set data structure stores a partition: every valid element belongs to exactly one nonempty set, and different sets do not overlap. “Belongs to the same set” is an equivalence relation because it is reflexive, symmetric, and transitive. One representative labels each set; the representative is an implementation choice, not necessarily the smallest element.',
        'A parent array encodes a forest. Initially parent[x]=x, so every vertex is an isolated root and the component count is n. find(x) follows parent links to the unique root. union(a,b) finds both roots and, if they differ, makes one root a child of the other and decrements the component count exactly once.',
        'The invariant is structural: every valid parent index stays in 0..n-1, roots point to themselves, and following parent links terminates at one root. A repeated union or self-union changes nothing. This topic uses the contract that an invalid index is rejected with std::out_of_range; silently ignoring it would hide caller errors.',
        'Naively attaching one root under another can form a chain, making one find take O(n). Construction is O(n), storage is O(n), and a sequence of naive operations can be linear per operation. The optimized heuristics in later lessons are therefore correctness-preserving performance changes, not optional syntax.'
      ],
      examples: [
        { title: 'Initialization and two unions', problem: 'Initialize elements 0..4, then union(0,1) and union(3,4).', walkthrough: ['Start parent=[0,1,2,3,4], components=5.', 'union(0,1) links two distinct roots: parent=[0,0,2,3,4], components=4.', 'union(3,4) gives parent=[0,0,2,3,3], components=3.', 'The represented sets are {0,1}, {2}, and {3,4}.'], result: 'Every element appears in exactly one of three sets.' },
        { title: 'Repeated and self-union', problem: 'Continue with union(1,0), union(2,2), and connected(0,2).', walkthrough: ['find(1)=find(0)=0, so union(1,0) returns false.', 'find(2)=2 twice, so union(2,2) also returns false.', 'find(0)=0 differs from find(2)=2.', 'No rejected union decrements the component count.'], result: 'There are still three components and connected(0,2) is false.' }
      ]
    },
    {
      id: 'dsa-dsu-compression-size', title: 'Path compression and union by size', durationMinutes: 70,
      objectives: ['Compress find paths safely', 'Attach smaller trees below larger roots', 'Explain amortized near-constant cost'],
      theory: [
        'Path compression rewrites parent[x] to the root while find returns from recursion (or during an iterative second pass). It preserves the represented partition because every rewritten node already belonged to that root. Later queries traverse fewer links.',
        'Union by size stores the number of elements only at roots and attaches the smaller root below the larger root. If sizes tie, a deterministic rule such as root ID can choose either root. The new root receives the sum; a non-root size value is irrelevant and should not drive a future union.',
        'With path compression and union by size (or rank), any sequence of m operations on n elements costs O((n+m) α(n)) under the standard analysis. α is the inverse Ackermann function; it grows so slowly that it is below 5 for practical input sizes, but it is not mathematically a strict O(1) bound. The guarantee is amortized across a sequence, not a promise that every individual call has constant work.',
        'Using compression alone often performs well, but the classic near-constant amortized guarantee relies on combining compression with a balancing heuristic. Validate an index before reading parent[x]. Recursive find is concise; an iterative version avoids call-depth concerns if a malformed or deliberately naive forest could be tall.'
      ],
      examples: [
        { title: 'Compress a chain', problem: 'A valid naive forest has parent=[0,0,1,2,3]. Run find(4).', walkthrough: ['The path is 4→3→2→1→0.', 'Root 0 returns through the recursive calls.', 'Each returning call writes its parent to 0.', 'The array becomes [0,0,0,0,0].'], result: 'The set is unchanged, but every later find is shallow.' },
        { title: 'Size-guided linking', problem: 'Sets rooted at 0 and 4 have sizes 4 and 2. Process unite(5,2).', walkthrough: ['find(5)=4 and find(2)=0.', 'Compare root sizes, not argument labels.', 'Attach root 4 beneath root 0.', 'Update size[0] from 4 to 6 and decrement components.'], result: 'The larger tree stays the root and height grows slowly.' }
      ]
    },
    {
      id: 'dsa-dsu-rank-applications', title: 'Union by rank, component tracking, and connectivity applications', durationMinutes: 65,
      objectives: ['Distinguish rank from exact size', 'Track components under an edge stream', 'Choose DSU for incremental undirected connectivity'],
      theory: [
        'Rank is an upper bound on tree height used only at roots. Union by rank attaches the lower-rank root below the higher-rank root; when equal ranks merge, the chosen root rank increases by one. Path compression can make the physical height smaller without decreasing rank, so rank must not be presented as the current exact height or component size.',
        'For an undirected edge stream, unite(u,v) returns true exactly when the edge connects two previously distinct components. A false result marks a self-loop or redundant connection under the connectivity model. Starting from n isolated vertices, the current connected-component count is n minus the number of successful unions.',
        'DSU answers connectivity under additions, not arbitrary deletions or path queries. DFS/BFS is preferable when a static graph needs actual paths, traversal order, or rich component data. DSU is ideal for Kruskal, redundant-edge detection, offline grouping, and incremental connectivity.',
        'A robust class owns parent plus either size or rank, not both unless each has a clear use. It validates all public indices, treats n=0 as a valid empty structure, uses an integer width suitable for n, and documents whether unite returns a merge flag. These contracts prevent accidental double-counting.'
      ],
      examples: [
        { title: 'Edge-stream component count', problem: 'n=6; edges (0,1),(1,2),(3,4),(2,0),(4,5).', walkthrough: ['Start at 6 components.', 'The first three edges merge: counts 5,4,3.', '(2,0) is redundant because both roots match; count stays 3.', '(4,5) merges the last isolated vertex into {3,4}; count becomes 2.'], result: 'The components are {0,1,2} and {3,4,5}.' },
        { title: 'Rank tie and compression', problem: 'Merge two rank-1 roots, then query a grandchild.', walkthrough: ['Equal ranks allow either deterministic root choice.', 'The chosen root rank increases to 2.', 'A later find may flatten the grandchild directly to that root.', 'Rank remains 2 even if the observed tree becomes shallower.'], result: 'Rank guides future linking but is not exact post-compression height.' }
      ]
    }
  ],
  checklist: ['I can state the partition and parent-forest invariants.', 'I validate indices before accessing arrays.', 'I decrement component count only after a successful merge.', 'I distinguish size from rank.', 'I combine path compression with a balancing heuristic.', 'I describe α(n) as amortized near-constant, not strict O(1).'],
  commonMistakes: ['Linking arbitrary vertices instead of their roots.', 'Decrementing components on repeated or self-union.', 'Reading size or rank from a non-root.', 'Claiming each optimized operation is strictly O(1).', 'Using DSU when deletions or actual paths are required.', 'Accessing parent before validating an index.'],
  revisionGuidance: ['Trace parent and size arrays after every successful union.', 'Explain why compression cannot change set membership.', 'Compare DSU component counting with a DFS forest.'],
  practiceExercises: [
    { id: 'dsa-dsu-p1', title: 'Parent-array invariant check', prompt: 'Explain how to verify that every parent chain reaches a self-parent root without leaving the valid range.', difficulty: 'Medium', hints: ['Use three-state visitation or a bounded walk.'], solution: 'Validate every parent index and follow each chain; reject a cycle not containing a self-parent root. Memoize completed chains.', explanation: 'A valid DSU forest has no directed parent cycle except each root’s self-loop.' },
    { id: 'dsa-dsu-p2', title: 'Successful merge count', prompt: 'Starting with n sets, how many successful unions are required to obtain k components?', difficulty: 'Easy', hints: ['Each successful merge changes the count by one.'], solution: 'Exactly n-k successful unions.', explanation: 'Rejected unions preserve the partition and count.' }
  ],
  mcqs: [
    { id: 'dsa-dsu-m1', difficulty: 'Easy', prompt: 'What does a DSU representative identify?', options: ['One set in the current partition', 'The shortest path source', 'The smallest edge weight', 'A topological position'], answer: 0, explanation: 'All members of one represented set find the same root; the root label is an implementation choice.' },
    { id: 'dsa-dsu-m2', difficulty: 'Easy', prompt: 'What is the initial parent array for five isolated elements?', options: ['[0,1,2,3,4]', '[0,0,0,0,0]', '[1,2,3,4,0]', 'An empty array'], answer: 0, explanation: 'Each element initially represents its own singleton set.' },
    { id: 'dsa-dsu-m3', difficulty: 'Medium', prompt: 'When should the stored component count decrease?', options: ['Only when two distinct roots merge', 'After every union call', 'After every find', 'Only during path compression'], answer: 0, explanation: 'Self-unions and already-connected pairs do not change the partition.' },
    { id: 'dsa-dsu-m4', difficulty: 'Medium', prompt: 'What does path compression preserve?', options: ['Set membership and the root reached', 'Exact tree height', 'Every existing parent edge', 'The argument order of union'], answer: 0, explanation: 'It replaces ancestor links by direct root links without moving an element to another set.' },
    { id: 'dsa-dsu-m5', difficulty: 'Medium', prompt: 'Union by size attaches which root beneath which?', options: ['Smaller component root beneath larger component root', 'Larger beneath smaller', 'First argument beneath second regardless of roots', 'Every node directly beneath vertex zero'], answer: 0, explanation: 'Size-guided linking limits height by keeping the larger tree as root.' },
    { id: 'dsa-dsu-m6', difficulty: 'Hard', prompt: 'What is the standard bound with path compression and union by size/rank?', options: ['Amortized O(α(n)) per operation', 'Strict worst-case O(1) per call', 'O(n²) per operation', 'O(log E) with no assumptions'], answer: 0, explanation: 'The inverse Ackermann factor is extraordinarily slow growing, but the statement is amortized and not strict constant time.' },
    { id: 'dsa-dsu-m7', difficulty: 'Hard', prompt: 'Why can rank remain larger than the current physical height?', options: ['Path compression shortens paths without lowering rank', 'Rank stores component weight', 'Rank is always the root ID', 'Union deletes the rank array'], answer: 0, explanation: 'Rank is a linking bound, not an exact post-compression height measurement.' }
  ],
  coding: [
    {
      id: 'dsa-dsu-c1', title: 'Connectivity queries with component count', difficulty: 'Medium', language: 'cpp',
      prompt: 'Implement a DSU for vertices 0..n-1 supporting unite(a,b), same(a,b), and components(). Invalid indices must throw std::out_of_range. Repeated and self-unions return false. Constraints: 0 ≤ n,q ≤ 300000.',
      starter: '#include <numeric>\n#include <stdexcept>\n#include <vector>\nclass DSU {\n  // parent, size, component count\n};',
      examples: [{ input: 'n=4; unite(0,1), unite(1,2), same(0,2)', output: 'true, true, true; components=2' }, { input: 'n=2; unite(1,1), unite(0,1), unite(0,1)', output: 'false, true, false; components=1' }],
      hints: ['Validate before indexing.', 'Compress in find and attach the smaller root.'],
      referenceSolution: '#include <numeric>\n#include <stdexcept>\n#include <vector>\nclass DSU{std::vector<int> p,sz;int count_;void valid(int x)const{if(x<0||x>=static_cast<int>(p.size()))throw std::out_of_range("DSU index");}int root(int x){return p[x]==x?x:p[x]=root(p[x]);}public:explicit DSU(int n):p(n),sz(n,1),count_(n){if(n<0)throw std::invalid_argument("negative size");std::iota(p.begin(),p.end(),0);}bool unite(int a,int b){valid(a);valid(b);a=root(a);b=root(b);if(a==b)return false;if(sz[a]<sz[b])std::swap(a,b);p[b]=a;sz[a]+=sz[b];--count_;return true;}bool same(int a,int b){valid(a);valid(b);return root(a)==root(b);}int components()const{return count_;}};'
    },
    {
      id: 'dsa-dsu-c2', title: 'Redundant edges in an undirected stream', difficulty: 'Medium', language: 'cpp',
      prompt: 'Given n and an edge list, return the zero-based positions of edges that do not merge two components. Vertices outside 0..n-1 make the whole input invalid. Self-loops and repeated connections are redundant. Constraints: 0 ≤ n,E ≤ 300000. Target O((n+E) α(n)).',
      starter: '#include <utility>\n#include <vector>\nstd::vector<int> redundantEdges(int n, const std::vector<std::pair<int,int>>& edges){\n  // Use a validated DSU.\n}',
      examples: [{ input: 'n=4; (0,1),(1,2),(2,0),(3,3)', output: '[2,3]' }, { input: 'n=3; (0,1),(1,2)', output: '[]' }],
      hints: ['unite should report whether a merge occurred.', 'A self-loop has the same root at both endpoints.'],
      referenceSolution: '#include <numeric>\n#include <stdexcept>\n#include <utility>\n#include <vector>\nstd::vector<int> redundantEdges(int n,const std::vector<std::pair<int,int>>& e){if(n<0)throw std::invalid_argument("n");std::vector<int> p(n),sz(n,1),ans;std::iota(p.begin(),p.end(),0);auto find=[&](int x){int r=x;while(p[r]!=r)r=p[r];while(p[x]!=x){int y=p[x];p[x]=r;x=y;}return r;};for(int i=0;i<static_cast<int>(e.size());++i){int a=e[i].first,b=e[i].second;if(a<0||a>=n||b<0||b>=n)throw std::out_of_range("edge");a=find(a);b=find(b);if(a==b){ans.push_back(i);continue;}if(sz[a]<sz[b])std::swap(a,b);p[b]=a;sz[a]+=sz[b];}return ans;}'
    }
  ],
  resources: [{ title: 'cppreference: std::iota', url: 'https://en.cppreference.com/w/cpp/algorithm/iota', kind: 'web' }]
}
