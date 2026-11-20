import type { Topic } from '../../types'

export const dsaKruskal: Topic = {
  id: 'dsa-kruskal',
  title: "Kruskal's Algorithm",
  summary: 'Build an MST or minimum spanning forest by sorting an edge list and using DSU to accept exactly the edges that join distinct components.',
  prerequisiteTopicIds: ['dsa-dsu', 'dsa-mst'],
  crossLinkTopicIds: ['dsa-graphs', 'dsa-prim'],
  lessons: [
    {
      id: 'dsa-kruskal-scan', title: 'Sorted-edge scan with DSU', durationMinutes: 70,
      objectives: ['Trace accepted and rejected edges', 'Handle ties, loops, and parallel edges', 'Return an MST or MSF according to contract'],
      theory: [
        'Kruskal sorts all undirected edges by nondecreasing weight, starts a DSU with one component per vertex, and scans the sorted list. An edge is accepted when its endpoints currently have different representatives; the successful union joins two forest components. Otherwise the edge would close a cycle and is rejected.',
        'For deterministic output, sort by (weight, normalized endpoint pair, original edge ID). Determinism is useful for tests but does not make the MST mathematically unique. Parallel edges remain distinct candidates, self-loops are always rejected, and negative or zero weights require no special case.',
        'For a connected graph, stop after V-1 accepted edges and report an MST. For a disconnected graph, scanning all edges returns an MSF with V-C edges. The function contract must distinguish these results: either return the forest plus component count, or explicitly fail when one connected MST was requested.',
        'Store weights and totals in long long when individual weights and edge counts can overflow int. Even long long addition needs a documented input bound or checked arithmetic. Validate endpoints before sorting or unioning so malformed data does not become an out-of-range array access.'
      ],
      examples: [
        { title: 'Acceptance and rejection trace', problem: 'Edges: 0-1:1, 1-2:2, 0-2:3, 2-3:4.', walkthrough: ['Accept 0-1; components 0 and 1 merge.', 'Accept 1-2; vertex 2 joins that component.', 'Reject 0-2 because both endpoints now share a root.', 'Accept 2-3 and reach V-1=3 edges.'], result: 'MST edges have weights 1,2,4 and total 7.' },
        { title: 'Ties, parallels, and a self-loop', problem: 'Edges 0-0:-5, two copies of 0-1:2, and 1-2:2.', walkthrough: ['Reject the negative self-loop because it cannot connect components.', 'Accept the deterministically first 0-1 copy.', 'Reject the parallel copy after its endpoints become connected.', 'Accept 1-2.'], result: 'The MST total is 4; negative weight alone does not force an edge.' }
      ]
    },
    {
      id: 'dsa-kruskal-correctness', title: 'Cut-property correctness and complexity', durationMinutes: 70,
      objectives: ['Prove each accepted edge is safe', 'Derive time and memory bounds', 'Validate a returned forest certificate'],
      theory: [
        'Immediately before Kruskal accepts edge e=(u,v), the DSU components define a cut separating u from v. Every lighter edge has already been processed. Any processed edge crossing those two components would have merged them, so e is a minimum-weight available crossing edge for a compatible cut and is safe by the cut property.',
        'An exchange proof replaces the edge crossing the same cut in an optimal tree with e, never increasing total weight. Inductively, every accepted forest can be extended to an MST of each original connected component. Rejected edges have endpoints already connected, so adding one would create a cycle and is unnecessary.',
        'Comparison sorting costs O(E log E). DSU initialization is O(V), and the scan performs O(E α(V)) amortized work with compression plus size/rank. Under usual E≥V-1 connected-graph assumptions, the sorting term dominates and is commonly written O(E log E). Memory is O(V+E) when the edge list and output are retained.',
        'Verification must check more than agreement with Prim: selected indices are valid and unique, no selected self-loop or cycle exists, every original component is spanned, the count is V-C, and the recomputed total matches. Small-graph brute force provides an independent optimality oracle.'
      ],
      examples: [
        { title: 'Safe-edge cut', problem: 'After choosing 0-1, DSU component A={0,1}; candidates crossing A are 1-2:3 and 0-3:5.', walkthrough: ['The current forest is acyclic.', 'The component boundary is a compatible cut.', 'Weight 3 is the light crossing edge.', 'Accepting 1-2 can be exchanged into an optimal completion.'], result: 'The next accepted edge is safe even without knowing the rest of the MST.' },
        { title: 'Disconnected edge count', problem: 'Five vertices form components {0,1,2} and {3,4}.', walkthrough: ['The first original component needs two accepted edges.', 'The second needs one accepted edge.', 'No graph edge crosses between the components.', 'V-C = 5-2 = 3 accepted edges.'], result: 'Kruskal returns a three-edge MSF, not a failed or partial MST.' }
      ]
    }
  ],
  checklist: ['I validate an undirected edge list.', 'I sort with deterministic tie keys only when output stability is needed.', 'I accept an edge only after a successful DSU union.', 'I allow negative, zero, equal, and parallel weights.', 'I reject self-loops naturally.', 'I use a wide total and a documented bound.', 'I distinguish connected MST from disconnected MSF.'],
  commonMistakes: ['Stopping at V-1 edges in a disconnected graph and calling the result an MST.', 'Adding an edge before checking DSU representatives.', 'Treating equal weights as an error.', 'Dropping parallel edges before considering their weights.', 'Using int for a potentially large total.', 'Claiming O(E log V) for comparison sorting without explaining assumptions.'],
  revisionGuidance: ['Trace the sorted edge IDs and DSU components side by side.', 'State the cut used by each successful union.', 'Verify edge count, acyclicity, coverage, and total independently.'],
  practiceExercises: [
    { id: 'dsa-kruskal-p1', title: 'Deterministic ties', prompt: 'Design a comparator that makes Kruskal output reproducible without changing optimality.', difficulty: 'Medium', hints: ['Keep original edge IDs.'], solution: 'Sort by weight, then min(u,v), max(u,v), then original ID.', explanation: 'Only equal-weight order changes; any chosen light tied edge remains safe.' },
    { id: 'dsa-kruskal-p2', title: 'MSF edge count', prompt: 'Why does a successful union count of V-C certify the correct forest edge count?', difficulty: 'Medium', hints: ['Each tree component with k vertices needs k-1 edges.'], solution: 'Summing k_i-1 across C components gives V-C, and every successful union adds one acyclic edge.', explanation: 'The count complements connectivity and acyclicity checks.' }
  ],
  mcqs: [
    { id: 'dsa-kruskal-m1', difficulty: 'Easy', prompt: 'What is Kruskal’s first main step?', options: ['Sort edges by nondecreasing weight', 'Choose a source vertex', 'Compute shortest distances', 'Direct every edge'], answer: 0, explanation: 'The globally ordered edge stream drives the greedy scan.' },
    { id: 'dsa-kruskal-m2', difficulty: 'Easy', prompt: 'When is a scanned edge accepted?', options: ['Its endpoints are in different DSU components', 'It has a positive weight', 'It touches vertex zero', 'It is the only edge of its weight'], answer: 0, explanation: 'Joining distinct components preserves acyclicity and grows the forest.' },
    { id: 'dsa-kruskal-m3', difficulty: 'Medium', prompt: 'How is a self-loop handled?', options: ['Rejected because both endpoints have the same representative', 'Always accepted if negative', 'Converted to a directed edge', 'Counted as two tree edges'], answer: 0, explanation: 'A self-loop cannot connect two components and would be cyclic.' },
    { id: 'dsa-kruskal-m4', difficulty: 'Medium', prompt: 'What does Kruskal return after fully scanning a disconnected graph?', options: ['A minimum spanning forest', 'A spanning tree over all vertices', 'No useful result', 'A shortest-path tree'], answer: 0, explanation: 'It minimizes each original component independently.' },
    { id: 'dsa-kruskal-m5', difficulty: 'Medium', prompt: 'Why can Kruskal accept negative edges?', options: ['MST permits any comparable weights while DSU prevents cycles', 'DSU changes them to zero', 'Sorting ignores signs', 'Only shortest paths forbid cycles'], answer: 0, explanation: 'Negative values are valid costs and appear early in sorted order.' },
    { id: 'dsa-kruskal-m6', difficulty: 'Hard', prompt: 'What is the usual dominant complexity term?', options: ['O(E log E) comparison sorting', 'O(V³) always', 'O(1) for all graphs', 'O(E² log V)'], answer: 0, explanation: 'The DSU scan is near-linear amortized; sorting generally dominates.' },
    { id: 'dsa-kruskal-m7', difficulty: 'Hard', prompt: 'Which is an independent optimality oracle for sufficiently small graphs?', options: ['Enumerate candidate forests and take the valid minimum', 'Run the same Kruskal code twice', 'Compare only accepted edge order', 'Check that all weights are positive'], answer: 0, explanation: 'Brute-force enumeration uses a different method and validates feasibility plus minimum total.' }
  ],
  coding: [
    {
      id: 'dsa-kruskal-c1', title: 'Minimum spanning forest with edge IDs', difficulty: 'Medium', language: 'cpp',
      prompt: 'Return the total weight, selected original edge IDs, and final component count for an undirected graph. Sort ties deterministically by normalized endpoints and ID. Reject invalid endpoints. Constraints: |weight|≤10^12 and 0≤V,E≤300000; weights may be negative. Target O(E log E).',
      starter: '#include <tuple>\n#include <vector>\nstruct Forest { long long weight; std::vector<int> edgeIds; int components; };\nForest kruskal(int n, const std::vector<std::tuple<int,int,long long>>& edges){\n  // Validate, sort edge IDs, and join DSU roots.\n}',
      examples: [{ input: '0-1:1,1-2:2,0-2:3, isolated 3', output: 'weight=3, ids=[0,1], components=2' }, { input: '0-0:-9,0-1:0,0-1:0', output: 'weight=0, one parallel edge, components=1' }],
      hints: ['Sort IDs so the caller’s edge list remains intact.', 'Accumulate only after unite succeeds.'],
      referenceSolution: '#include <algorithm>\n#include <numeric>\n#include <stdexcept>\n#include <tuple>\n#include <vector>\nstruct Forest{long long weight;std::vector<int> edgeIds;int components;};Forest kruskal(int n,const std::vector<std::tuple<int,int,long long>>& e){if(n<0)throw std::invalid_argument("n");std::vector<int>p(n),s(n,1),id(e.size());std::iota(p.begin(),p.end(),0);std::iota(id.begin(),id.end(),0);for(auto [u,v,w]:e){(void)w;if(u<0||u>=n||v<0||v>=n)throw std::out_of_range("edge");}std::sort(id.begin(),id.end(),[&](int a,int b){auto [u1,v1,w1]=e[a];auto [u2,v2,w2]=e[b];if(u1>v1)std::swap(u1,v1);if(u2>v2)std::swap(u2,v2);return std::tie(w1,u1,v1,a)<std::tie(w2,u2,v2,b);});auto f=[&](int x){int r=x;while(p[r]!=r)r=p[r];while(p[x]!=x){int y=p[x];p[x]=r;x=y;}return r;};Forest out{0,{},n};for(int i:id){auto [u,v,w]=e[i];u=f(u);v=f(v);if(u==v)continue;if(s[u]<s[v])std::swap(u,v);p[v]=u;s[u]+=s[v];out.weight+=w;out.edgeIds.push_back(i);--out.components;}return out;}'
    },
    {
      id: 'dsa-kruskal-c2', title: 'Minimum cost to connect every vertex', difficulty: 'Medium', language: 'cpp',
      prompt: 'Return the MST weight for a connected undirected graph, or std::nullopt if all vertices cannot be connected. n=0 returns weight 0 by contract. Use Kruskal and check accepted edge count. Constraints: V,E≤300000.',
      starter: '#include <optional>\n#include <tuple>\n#include <vector>\nstd::optional<long long> networkCost(int n, std::vector<std::tuple<int,int,long long>> edges){\n  // Sort, union, and require n-1 accepted edges.\n}',
      examples: [{ input: 'n=3; weights 5,1,2 on a triangle', output: '3' }, { input: 'n=3; only edge 0-1', output: 'nullopt' }],
      hints: ['A connected n>0 graph needs n-1 successful unions.', 'Do not infer connectivity from edge count before cycle rejection.'],
      referenceSolution: '#include <algorithm>\n#include <numeric>\n#include <optional>\n#include <tuple>\n#include <vector>\nstd::optional<long long> networkCost(int n,std::vector<std::tuple<int,int,long long>> e){if(n<0)return std::nullopt;if(n==0)return 0;std::sort(e.begin(),e.end(),[](const auto&a,const auto&b){return std::get<2>(a)<std::get<2>(b);});std::vector<int>p(n),s(n,1);std::iota(p.begin(),p.end(),0);auto f=[&](int x){int r=x;while(p[r]!=r)r=p[r];while(p[x]!=x){int y=p[x];p[x]=r;x=y;}return r;};long long total=0;int used=0;for(auto [u,v,w]:e){if(u<0||u>=n||v<0||v>=n)return std::nullopt;u=f(u);v=f(v);if(u==v)continue;if(s[u]<s[v])std::swap(u,v);p[v]=u;s[u]+=s[v];total+=w;if(++used==n-1)break;}return used==n-1?std::optional<long long>(total):std::nullopt;}'
    }
  ],
  resources: [{ title: 'cppreference: std::sort', url: 'https://en.cppreference.com/w/cpp/algorithm/sort', kind: 'web' }]
}
