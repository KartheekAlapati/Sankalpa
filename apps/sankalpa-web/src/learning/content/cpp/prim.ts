import type { Topic } from '../../types'

export const dsaPrim: Topic = {
  id: 'dsa-prim',
  title: "Prim's Algorithm",
  summary: 'Grow an MST from a vertex using an adjacency list and minimum priority queue, discard stale candidates, and restart deliberately to compute an MSF.',
  prerequisiteTopicIds: ['dsa-mst', 'dsa-priority-queue'],
  crossLinkTopicIds: ['dsa-shortest-path', 'dsa-kruskal'],
  lessons: [
    {
      id: 'dsa-prim-frontier', title: 'Growing a tree across the cut', durationMinutes: 75,
      objectives: ['Maintain the in-tree frontier', 'Use a minimum priority queue correctly', 'Handle stale entries and disconnected inputs'],
      theory: [
        'Prim begins from a chosen vertex and maintains a cut between vertices already in the tree and those outside it. The next accepted edge is a minimum-weight edge crossing that cut. Marking its outside endpoint in-tree grows one connected acyclic tree.',
        'With an adjacency list and std::priority_queue configured as a min-heap, store candidate tuples (weight, vertex, parent). Push crossing edges when a vertex enters the tree. Because the same vertex may receive several candidates, pop-and-skip any entry whose vertex is already in-tree; this is the lazy stale-entry pattern.',
        'An eager variant stores best[v] and parent[v], updating them when a lighter crossing edge is found. Lazy and eager forms are both valid when their invariants are clear. Do not add a candidate’s weight until that vertex is actually accepted. The start vertex enters with weight zero and no selected parent edge.',
        'One run covers only the start vertex’s connected component. A connected-MST API reports failure if accepted vertices are fewer than V. An MSF API restarts Prim from every still-unvisited vertex, adding zero for each new component and retaining V-C selected edges. Self-loops become stale; parallel and negative edges work normally.'
      ],
      examples: [
        { title: 'Priority-queue trace', problem: 'Edges 0-1:4, 0-2:1, 2-1:2, 1-3:3, 2-3:5; start 0.', walkthrough: ['Accept start 0; push (1,2,0) and (4,1,0).', 'Pop weight 1 and accept 0-2; push (2,1,2) and (5,3,2).', 'Pop weight 2 and accept 2-1; push (3,3,1).', 'Pop weight 3 and accept 1-3; later entries for 1 and 3 are stale.'], result: 'Selected weights 1,2,3 total 6.' },
        { title: 'Disconnected restart', problem: 'Edges 0-1:-2 and 2-3:4, plus isolated 4.', walkthrough: ['Start 0 and select edge 0-1 with weight -2.', 'Heap empties with vertices 2,3,4 unvisited.', 'Restart 2 and select 2-3 with weight 4.', 'Restart isolated 4 with zero added weight.'], result: 'The MSF has three components, two edges, and total 2.' }
      ]
    },
    {
      id: 'dsa-prim-proof-comparison', title: 'Correctness, complexity, and Kruskal comparison', durationMinutes: 75,
      objectives: ['Prove Prim using the cut property', 'Derive heap complexity', 'Choose between Prim and Kruskal without universal claims'],
      theory: [
        'At every acceptance, the in-tree vertices define a compatible cut. Prim chooses a light crossing edge, so the cut property says some MST extends the chosen tree with that edge. Repeating the exchange argument until all vertices in the component are accepted proves optimality.',
        'In the lazy adjacency-list implementation, each undirected edge can produce heap candidates, and each push/pop costs O(log E), conventionally written O(log V) for simple connected graphs because E≤V². The usual bound is O(E log V) time and O(V+E) graph plus heap storage. State assumptions when multigraph density changes the logarithm.',
        'Kruskal naturally consumes an edge list, sorts globally, and uses DSU; it is often convenient for sparse graphs and MSFs. Prim naturally consumes adjacency lists and grows from a vertex using a heap; dense graphs may favor an O(V²) array implementation. Actual performance depends on representation, density, constants, and input state—neither algorithm is universally faster.',
        'When equal weights exist, deterministic tie rules can make Prim and Kruskal select different valid edge sets. Correct comparisons use total optimal weight plus feasibility, not exact edge equality. On the shared four-cycle with all edge weights one, both select three edges of total three, but their tie order may omit different cycle edges.'
      ],
      examples: [
        { title: 'Same graph, different MST edges', problem: 'Cycle 0-1-2-3-0 has weight 1 on every edge.', walkthrough: ['Kruskal’s ID order may accept 0-1,1-2,2-3 and reject 3-0.', 'Prim from 0 may accept 0-1,0-3, then 1-2.', 'Both selections connect all four vertices without a cycle.', 'Each uses three unit edges.'], result: 'Different MST edge sets agree on minimum total weight 3.' },
        { title: 'Stale candidate safety', problem: 'Heap contains (8,v,a) and later (3,v,b).', walkthrough: ['The weight-3 entry is popped first and accepts v.', 'Edge b-v becomes the selected crossing edge.', 'The weight-8 entry remains in the heap.', 'When popped later, inTree[v] is true, so it contributes nothing.'], result: 'Lazy duplicates preserve correctness when acceptance is guarded.' }
      ]
    }
  ],
  checklist: ['I use an undirected adjacency list.', 'I configure priority_queue as a min-heap.', 'I add weight only when a vertex is first accepted.', 'I skip stale entries for in-tree vertices.', 'I distinguish one-component MST from restarted MSF.', 'I retain wide totals and validate endpoints.', 'I compare optimal totals, not exact edges, under ties.'],
  commonMistakes: ['Using the default max-heap accidentally.', 'Adding weight when pushing rather than accepting.', 'Failing to skip stale entries.', 'Returning one component as if it spanned a disconnected graph.', 'Treating Prim as Dijkstra and adding path distance to edge keys.', 'Claiming Prim is always faster than Kruskal.'],
  revisionGuidance: ['Trace heap contents and the in-tree cut after each acceptance.', 'Explain why stale entries cannot alter total weight.', 'Run Prim and Kruskal on the same tied graph and compare certificates.'],
  practiceExercises: [
    { id: 'dsa-prim-p1', title: 'Prim versus Dijkstra keys', prompt: 'Explain why Prim pushes an edge weight while Dijkstra pushes a complete source distance.', difficulty: 'Medium', hints: ['The objectives differ.'], solution: 'Prim minimizes the next crossing edge for global tree weight; Dijkstra minimizes the full source-to-vertex distance.', explanation: 'Using distance sums in Prim solves a different greedy problem.' },
    { id: 'dsa-prim-p2', title: 'Lazy heap invariant', prompt: 'When is it safe to add a popped candidate’s weight to the forest total?', difficulty: 'Easy', hints: ['Check membership first.'], solution: 'Only when its vertex is not already in the tree and is accepted now.', explanation: 'Other candidates for an accepted vertex are stale duplicates.' }
  ],
  mcqs: [
    { id: 'dsa-prim-m1', difficulty: 'Easy', prompt: 'What does Prim choose at each step?', options: ['A light edge crossing from the current tree', 'The globally longest path', 'Any edge inside the current tree', 'A zero in-degree vertex'], answer: 0, explanation: 'The in-tree set defines the greedy cut.' },
    { id: 'dsa-prim-m2', difficulty: 'Easy', prompt: 'Which C++ structure commonly supplies the next candidate?', options: ['A minimum priority queue', 'A FIFO queue only', 'A DSU alone', 'A recursion stack only'], answer: 0, explanation: 'A min-heap exposes the lightest currently known crossing edge.' },
    { id: 'dsa-prim-m3', difficulty: 'Medium', prompt: 'When should a lazy Prim candidate be skipped?', options: ['Its vertex is already in the tree', 'Its weight is negative', 'Its parent is vertex zero', 'The graph has parallel edges'], answer: 0, explanation: 'The vertex was accepted through an earlier, no-heavier candidate.' },
    { id: 'dsa-prim-m4', difficulty: 'Medium', prompt: 'How does an MSF version handle a disconnected graph?', options: ['Restart from each unvisited vertex', 'Invent edges between components', 'Return the first component only', 'Run topological sort'], answer: 0, explanation: 'Each restart grows the minimum tree of one original component.' },
    { id: 'dsa-prim-m5', difficulty: 'Medium', prompt: 'What key distinction separates Prim from Dijkstra?', options: ['Prim keys by crossing edge weight; Dijkstra by full source distance', 'Prim forbids negative edge weights', 'Dijkstra builds an MST', 'Prim requires directed acyclic graphs'], answer: 0, explanation: 'They optimize different quantities even though both can use a min-heap.' },
    { id: 'dsa-prim-m6', difficulty: 'Hard', prompt: 'What is the usual adjacency-list binary-heap bound?', options: ['O(E log V) under standard assumptions', 'O(V!)', 'Strict O(E)', 'O(1)'], answer: 0, explanation: 'Edge candidates cause heap operations with logarithmic cost.' },
    { id: 'dsa-prim-m7', difficulty: 'Hard', prompt: 'Can Prim and Kruskal return different correct edge sets?', options: ['Yes, when multiple MSTs exist', 'No, their edges must always match', 'Only on directed graphs', 'Only when totals differ'], answer: 0, explanation: 'Tied safe choices can produce distinct trees with the same minimum total.' }
  ],
  coding: [
    {
      id: 'dsa-prim-c1', title: 'Lazy Prim minimum spanning forest', difficulty: 'Medium', language: 'cpp',
      prompt: 'Given n and an undirected weighted edge list, return MSF total weight, selected edge count, and component count using adjacency lists and std::priority_queue. Reject invalid endpoints. Include isolated vertices; allow loops, parallels, negative and zero weights. Constraints: V,E≤300000.',
      starter: '#include <tuple>\n#include <vector>\nstruct PrimForest { long long weight; int edges; int components; };\nPrimForest primForest(int n, const std::vector<std::tuple<int,int,long long>>& edges){\n  // Build adjacency and restart lazy Prim.\n}',
      examples: [{ input: '0-1:-2, 2-3:4, isolated 4', output: 'weight=2, edges=2, components=3' }, { input: 'single vertex', output: 'weight=0, edges=0, components=1' }],
      hints: ['Push (0,root,-1) at each restart.', 'Count an edge only when parent is not -1.'],
      referenceSolution: '#include <functional>\n#include <queue>\n#include <stdexcept>\n#include <tuple>\n#include <vector>\nstruct PrimForest{long long weight;int edges;int components;};PrimForest primForest(int n,const std::vector<std::tuple<int,int,long long>>& e){if(n<0)throw std::invalid_argument("n");using A=std::pair<int,long long>;std::vector<std::vector<A>>g(n);for(auto [u,v,w]:e){if(u<0||u>=n||v<0||v>=n)throw std::out_of_range("edge");g[u].push_back({v,w});g[v].push_back({u,w});}using Q=std::tuple<long long,int,int>;std::priority_queue<Q,std::vector<Q>,std::greater<Q>>q;std::vector<char>in(n);PrimForest out{0,0,0};for(int root=0;root<n;++root){if(in[root])continue;++out.components;q.push({0,root,-1});while(!q.empty()){auto [w,u,p]=q.top();q.pop();if(in[u])continue;in[u]=1;if(p!=-1){out.weight+=w;++out.edges;}for(auto [v,c]:g[u])if(!in[v])q.push({c,v,u});}}return out;}'
    },
    {
      id: 'dsa-prim-c2', title: 'Connected MST with parent certificate', difficulty: 'Hard', language: 'cpp',
      prompt: 'Starting at vertex 0, return parent[v] and total MST weight, or std::nullopt if n>0 is disconnected. Use an eager best-edge array and deterministic tie preference for smaller parent IDs. n=0 returns an empty certificate. Constraints: 0≤V,E≤300000 and totals fit long long. Target O(E log V).',
      starter: '#include <optional>\n#include <tuple>\n#include <vector>\nstruct PrimTree { long long weight; std::vector<int> parent; };\nstd::optional<PrimTree> primTree(int n, const std::vector<std::tuple<int,int,long long>>& edges){\n  // Maintain best crossing edge for each outside vertex.\n}',
      examples: [{ input: '0-1:4,0-2:1,2-1:2', output: 'weight=3; parent [-1,2,0]' }, { input: 'n=3; edge 0-1 only', output: 'nullopt' }],
      hints: ['Ignore a heap entry whose weight no longer equals best[v].', 'Count accepted vertices before returning.'],
      referenceSolution: '#include <functional>\n#include <limits>\n#include <optional>\n#include <queue>\n#include <tuple>\n#include <utility>\n#include <vector>\nstruct PrimTree{long long weight;std::vector<int> parent;};std::optional<PrimTree> primTree(int n,const std::vector<std::tuple<int,int,long long>>& e){if(n<0)return std::nullopt;using A=std::pair<int,long long>;std::vector<std::vector<A>>g(n);for(auto [u,v,w]:e){if(u<0||u>=n||v<0||v>=n)return std::nullopt;g[u].push_back({v,w});g[v].push_back({u,w});}if(n==0)return PrimTree{0,{}};const long long I=std::numeric_limits<long long>::max();std::vector<long long>best(n,I);std::vector<int>par(n,-1);std::vector<char>in(n);using Q=std::pair<long long,int>;std::priority_queue<Q,std::vector<Q>,std::greater<Q>>q;best[0]=0;q.push({0,0});long long total=0;int seen=0;while(!q.empty()){auto [w,u]=q.top();q.pop();if(in[u]||w!=best[u])continue;in[u]=1;total+=w;++seen;for(auto [v,c]:g[u])if(!in[v]&&(c<best[v]||(c==best[v]&&(par[v]==-1||u<par[v])))){best[v]=c;par[v]=u;q.push({c,v});}}if(seen!=n)return std::nullopt;return PrimTree{total,par};}'
    }
  ],
  resources: [{ title: 'cppreference: priority_queue', url: 'https://en.cppreference.com/w/cpp/container/priority_queue', kind: 'web' }]
}
