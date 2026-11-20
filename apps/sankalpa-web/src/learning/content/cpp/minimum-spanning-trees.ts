import type { Topic } from '../../types'

export const dsaMinimumSpanningTrees: Topic = {
  id: 'dsa-mst',
  title: 'Minimum Spanning Tree Fundamentals',
  summary: 'Reason about spanning trees and forests, safe edges, cut and cycle properties, non-uniqueness, and why MSTs differ from shortest-path trees.',
  prerequisiteTopicIds: ['dsa-graphs', 'dsa-dsu'],
  crossLinkTopicIds: ['dsa-shortest-path', 'dsa-kruskal', 'dsa-prim'],
  lessons: [
    {
      id: 'dsa-mst-contracts', title: 'Spanning trees, forests, and optimization contracts', durationMinutes: 70,
      objectives: ['Define a spanning tree and MSF', 'Handle negative and tied weights', 'Separate MST from source-distance objectives'],
      theory: [
        'A spanning tree of a connected undirected graph contains every vertex, is connected, is acyclic, and therefore has exactly V-1 edges. A minimum spanning tree (MST) minimizes the sum of selected edge weights among all spanning trees. Direction changes the problem, so ordinary MST algorithms require an undirected graph contract.',
        'A disconnected graph has no tree spanning all vertices. Applying the same objective independently to its connected components produces a minimum spanning forest (MSF), with V-C edges for V vertices and C components. An isolated vertex is a valid one-vertex tree with zero selected edges.',
        'Negative weights are valid: choosing a negative edge can lower the total and creates no difficulty for the acyclicity constraint. Equal weights may yield several different MST edge sets with the same minimum total. Distinct edge weights are sufficient for uniqueness, but not necessary; tied graphs can still have a unique MST.',
        'An MST minimizes global edge sum, not distance from a source. A shortest-path tree minimizes source-to-vertex distances; BFS minimizes edge count only in an unweighted graph; DFS merely records traversal discovery. These trees can have different edges and objectives.'
      ],
      examples: [
        { title: 'MST is not a shortest-path tree', problem: 'Undirected edges s-a=2, a-b=2, s-b=3.', walkthrough: ['The MST chooses s-a and a-b for total 4.', 'In that tree the path s→a→b costs 4.', 'The original graph has a shorter source path s→b costing 3.', 'A shortest-path tree rooted at s can choose s-a and s-b, total edge weight 5.'], result: 'Minimum global construction cost does not imply minimum distance from s.' },
        { title: 'Disconnected minimum forest', problem: 'Components have edges 0-1=-2, 1-2=4 and 3-4=1; vertex 5 is isolated.', walkthrough: ['The first component needs both edges because it is already a tree.', 'The second component selects 3-4.', 'Vertex 5 contributes no edge and weight zero.', 'V=6, C=3, so the forest has V-C=3 edges.'], result: 'The MSF weight is -2+4+1=3; no all-vertex spanning tree exists.' }
      ]
    },
    {
      id: 'dsa-mst-greedy-proof', title: 'Cut property, cycle property, and safe greedy choices', durationMinutes: 75,
      objectives: ['Apply the cut property', 'Apply the cycle property', 'Sketch an exchange proof for safe edges'],
      theory: [
        'A cut partitions vertices into two nonempty sides. An edge crosses the cut when its endpoints lie on different sides. For any cut that respects the already chosen forest, a minimum-weight crossing edge is safe: some MST contains the chosen forest plus that edge. With ties, several crossing edges may all be safe.',
        'The exchange proof starts with an MST T containing the current safe forest. If T already contains the chosen light edge e, nothing changes. Otherwise adding e to T creates one cycle. That cycle contains an edge f crossing the same cut. Since e is no heavier than f, replacing f by e keeps a spanning tree and does not increase total weight.',
        'The cycle property gives the dual view: if an edge is strictly heavier than every other edge on a cycle, it cannot occur in any MST. With equal maximum weights, one maximum edge can be excluded, but no particular tied edge is automatically forbidden from every MST.',
        'Kruskal repeatedly exposes a cut between DSU components and chooses the next globally light crossing edge. Prim exposes the cut between its current tree and the remaining vertices and chooses a light crossing edge. Their data structures differ, but the same safe-edge argument explains both.'
      ],
      examples: [
        { title: 'Cut-safe choice with ties', problem: 'Cut S={0,1}; crossing edges 0-2=3, 1-2=3, 1-3=5.', walkthrough: ['The minimum crossing weight is 3.', 'Both weight-3 edges are light edges for this cut.', 'Either can extend a compatible safe forest.', 'The cut property does not claim the final MST is unique.'], result: 'Tie handling may select different safe edges with equal optimal total.' },
        { title: 'Cycle-property rejection', problem: 'Triangle weights 1, 4, and 7.', walkthrough: ['All three edges form a cycle.', 'Weight 7 is strictly heavier than the other cycle edges.', 'Removing it preserves connectivity between its endpoints via weights 1 and 4.', 'Any tree containing 7 can exchange it for a lighter missing edge.'], result: 'The weight-7 edge belongs to no MST.' }
      ]
    }
  ],
  checklist: ['I require an undirected weighted graph.', 'I distinguish MST from MSF when disconnected.', 'I expect V-1 edges only for a connected nonempty graph.', 'I allow negative and equal weights.', 'I do not assume every MST is unique.', 'I can justify a safe edge using an exchange argument.', 'I distinguish MST, shortest-path, BFS, and DFS objectives.'],
  commonMistakes: ['Running MST logic on directed edges without a new problem definition.', 'Rejecting negative weights as if this were Dijkstra.', 'Assuming a disconnected graph has one spanning tree.', 'Claiming equal weights always imply multiple MSTs.', 'Confusing minimum total edge weight with source distances.', 'Applying the strict cycle property to a tied maximum without care.'],
  revisionGuidance: ['Count expected forest edges as V-C.', 'Mark a cut and identify all tied light edges.', 'Construct one graph whose MST and shortest-path tree differ.'],
  practiceExercises: [
    { id: 'dsa-mst-p1', title: 'Validate a spanning forest', prompt: 'List the three properties needed to validate a candidate minimum spanning forest before comparing its weight.', difficulty: 'Medium', hints: ['Coverage, acyclicity, and component preservation matter.'], solution: 'It must include all vertices, be acyclic, and connect exactly the vertices connected in each original component; equivalently it has V-C edges and spans every original component.', explanation: 'A low-weight acyclic subset is not enough if it fails to span an original component.' },
    { id: 'dsa-mst-p2', title: 'Uniqueness reasoning', prompt: 'Does the presence of equal-weight edges prove that the MST is non-unique?', difficulty: 'Medium', hints: ['Tied edges may not compete across the same cut or cycle.'], solution: 'No. Distinct weights guarantee uniqueness, but equal weights do not guarantee non-uniqueness.', explanation: 'Topology can force a tied edge despite another edge elsewhere having the same weight.' }
  ],
  mcqs: [
    { id: 'dsa-mst-m1', difficulty: 'Easy', prompt: 'How many edges does a spanning tree of a connected V-vertex graph contain?', options: ['V-1', 'V', 'E-1', 'V+E'], answer: 0, explanation: 'Every connected acyclic graph on V vertices has exactly V-1 edges.' },
    { id: 'dsa-mst-m2', difficulty: 'Easy', prompt: 'What is computed for a disconnected undirected graph?', options: ['A minimum spanning forest', 'One spanning tree over all vertices', 'A topological order', 'A shortest directed cycle'], answer: 0, explanation: 'Each connected component receives its own minimum spanning tree.' },
    { id: 'dsa-mst-m3', difficulty: 'Medium', prompt: 'How do negative edge weights affect the MST definition?', options: ['They are allowed and may reduce the total', 'They make every graph invalid', 'They must be replaced by zero', 'They require Dijkstra first'], answer: 0, explanation: 'MST algorithms compare edge weights while preventing cycles; negative weights are valid.' },
    { id: 'dsa-mst-m4', difficulty: 'Medium', prompt: 'Which statement about uniqueness is correct?', options: ['Distinct edge weights guarantee a unique MST', 'Every connected graph has several MSTs', 'Any equal weights guarantee several MSTs', 'Negative weights prevent uniqueness'], answer: 0, explanation: 'Distinct weights are sufficient; tied weights alone do not settle uniqueness.' },
    { id: 'dsa-mst-m5', difficulty: 'Medium', prompt: 'What does the cut property say is safe?', options: ['A light edge crossing a compatible cut', 'The globally heaviest edge', 'Every edge inside one cut side', 'Only edges from a chosen source'], answer: 0, explanation: 'A minimum-weight crossing edge can extend the safe forest into some MST.' },
    { id: 'dsa-mst-m6', difficulty: 'Hard', prompt: 'Which edge is excluded by the strict cycle property?', options: ['An edge strictly heavier than all others on a cycle', 'Every tied maximum edge from every MST', 'Every negative edge', 'Every bridge'], answer: 0, explanation: 'The strictly heaviest cycle edge can be exchanged for a lighter connection.' },
    { id: 'dsa-mst-m7', difficulty: 'Hard', prompt: 'Why can an MST fail to be a shortest-path tree from s?', options: ['It minimizes total selected edge weight, not each s-to-v distance', 'It cannot contain s', 'It always uses directed edges', 'It must contain every graph edge'], answer: 0, explanation: 'The optimization objectives are different and can select different edge sets.' }
  ],
  coding: [
    {
      id: 'dsa-mst-c1', title: 'Validate a spanning forest certificate', difficulty: 'Hard', language: 'cpp',
      prompt: 'Given n, all undirected graph edges, and selected edge indices, validate that the selection is acyclic and spans every connected component of the original graph. Self-loops cannot be selected; parallel edges are distinct. Return false on invalid endpoints or indices. Constraints: 0 ≤ V,E ≤ 300000. Target O((V+E) α(V)).',
      starter: '#include <tuple>\n#include <vector>\nbool isSpanningForest(int n, const std::vector<std::tuple<int,int,long long>>& edges, const std::vector<int>& chosen){\n  // Compare original connectivity with an acyclic selected forest.\n}',
      examples: [{ input: 'n=4; edges (0,1),(1,2),(0,2); chosen [0,1]', output: 'true (vertex 3 is its own component)' }, { input: 'triangle; chosen [0,1,2]', output: 'false (cycle)' }],
      hints: ['Build one DSU for all original edges and one for selected edges.', 'Then compare representative equivalence for every original edge.'],
      referenceSolution: '#include <numeric>\n#include <tuple>\n#include <vector>\nbool isSpanningForest(int n,const std::vector<std::tuple<int,int,long long>>& e,const std::vector<int>& chosen){if(n<0)return false;struct D{std::vector<int>p,s;D(int n):p(n),s(n,1){std::iota(p.begin(),p.end(),0);}int f(int x){return p[x]==x?x:p[x]=f(p[x]);}bool u(int a,int b){a=f(a);b=f(b);if(a==b)return false;if(s[a]<s[b])std::swap(a,b);p[b]=a;s[a]+=s[b];return true;}} all(n),pick(n);for(const auto& x:e){int a=std::get<0>(x),b=std::get<1>(x);if(a<0||a>=n||b<0||b>=n)return false;all.u(a,b);}std::vector<char> used(e.size());for(int id:chosen){if(id<0||id>=static_cast<int>(e.size())||used[id])return false;used[id]=1;int a=std::get<0>(e[id]),b=std::get<1>(e[id]);if(a==b||!pick.u(a,b))return false;}for(const auto& x:e){int a=std::get<0>(x),b=std::get<1>(x);if((all.f(a)==all.f(b))!=(pick.f(a)==pick.f(b)))return false;}return true;}'
    },
    {
      id: 'dsa-mst-c2', title: 'MST versus shortest-path counterexample', difficulty: 'Medium', language: 'cpp',
      prompt: 'For a connected undirected weighted graph and source s, compute source distances inside a supplied spanning tree and return a vertex whose tree distance exceeds its shortest distance in the graph, or -1 if none. Weights are nonnegative for this exercise. Constraints: V,E ≤ 200000.',
      starter: '#include <tuple>\n#include <vector>\nint firstDistanceMismatch(int n, int s, const std::vector<std::tuple<int,int,long long>>& graph, const std::vector<std::tuple<int,int,long long>>& tree){\n  // Dijkstra on each adjacency list, then compare.\n}',
      examples: [{ input: 's-a=2,a-b=2,s-b=3; tree uses first two edges', output: 'b' }, { input: 'tree graph', output: '-1' }],
      hints: ['A tree path is unique, but ordinary Dijkstra works on both inputs.', 'Use long long and guard addition.'],
      referenceSolution: '#include <functional>\n#include <limits>\n#include <queue>\n#include <tuple>\n#include <utility>\n#include <vector>\nint firstDistanceMismatch(int n,int s,const std::vector<std::tuple<int,int,long long>>& g,const std::vector<std::tuple<int,int,long long>>& t){using P=std::pair<long long,int>;auto run=[&](const auto& edges){std::vector<std::vector<P>>a(n);for(auto [u,v,w]:edges){if(u<0||u>=n||v<0||v>=n||w<0)return std::vector<long long>{};a[u].push_back({w,v});a[v].push_back({w,u});}const long long I=std::numeric_limits<long long>::max()/4;std::vector<long long>d(n,I);std::priority_queue<P,std::vector<P>,std::greater<P>>q;d[s]=0;q.push({0,s});while(!q.empty()){auto [du,u]=q.top();q.pop();if(du!=d[u])continue;for(auto [w,v]:a[u])if(du<=I-w&&du+w<d[v]){d[v]=du+w;q.push({d[v],v});}}return d;};if(n<=0||s<0||s>=n)return -1;auto a=run(g),b=run(t);if(a.size()!=static_cast<size_t>(n)||b.size()!=static_cast<size_t>(n))return -1;for(int v=0;v<n;++v)if(b[v]>a[v])return v;return -1;}'
    }
  ],
  resources: [{ title: 'cppreference: tuple', url: 'https://en.cppreference.com/w/cpp/utility/tuple', kind: 'web' }]
}
