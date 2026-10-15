# Implementation plan

## Phase 1 — foundation only

1. Inspect repository and preservation boundaries; branch and add isolated app.
2. Install pinned React/TypeScript/Vite/Tailwind/Router/Query tooling.
3. Establish tokens, reusable controls, responsive shell, four spaces and support routes.
4. Implement ephemeral capture, classification, three priorities, Later recovery, title search and real task-linked timer.
5. Define core models and dormant Supabase configuration.
6. Prepare manifest/icons, network-only service worker, Vercel configuration and security headers.
7. Run typecheck, zero-warning lint, production build and desktop/mobile browser smoke tests. Resolve failures before closing Phase 1.

## Phase 2 — not started

1. Provision/select a dedicated Supabase project; configure production and preview redirect allowlists and authentication. Do not touch existing Base44/SQLite stores.
2. Review and implement normalized tables, constraints, ownership RLS and private Storage policies. Verify two-user isolation, forged IDs, ownership reassignment, unauthenticated access and cross-owner links before connecting the UI.
3. Replace the ephemeral adapter with a typed authenticated adapter. Implement durable capture, inbox/project/subject relationships, daily plans, estimates, available capacity, dates, rescheduling, backups, exports and recovery audit history.
4. Add durable focus sessions, interruption behavior and timezone-aware daily aggregation. Schedule realistically using estimated work and available capacity; never erase missed commitments automatically.
5. Restore the complete feature inventory incrementally, using the matrix below. Sensitive features require explicit product/privacy design.
6. Validate Vercel deployment, headers, Android install, updates, accessibility and authenticated account lifecycle. Keep offline writes out until conflict resolution and secure caches are designed.
7. Design IRA grants/APIs independently; no integration implied by entity types.

## Base44 preservation matrix

Every row remains a requirement; no current Base44 record has been migrated.

| Existing feature | Phase 1 equivalent | Later implementation |
| --- | --- | --- |
| Dashboard | Responsive working empty-state shell | Durable personal plan |
| Quests, missions | Life space; model contracts | Hierarchies, CRUD, goal/project links |
| Eisenhower Matrix | Documented requirement | User-editable urgency/importance view |
| Progress analytics | Actual ephemeral counts only | History-based metrics with explainable denominators |
| XP and levels | No fabricated values | Optional transparent scoring, never punitive |
| Streaks | Insufficient-data state | Timezone-aware, forgiving consistency measures |
| Pomodoro/deep work | Functional 25-minute linked timer | Durable sessions and interruption recovery |
| Calendar | Daily local priority agenda | Full schedule, dates and optional permissioned Google sync |
| Daily diary | Journal contract and Knowledge space | Private journal editor and export |
| Daily Sankalp | Honest dashboard placeholder | Editable dated intention |
| Habits | Growth space; model contracts | Habit CRUD and check-ins |
| Brahmacharya tracker | Requirement preserved | Private opt-in tracker with minimal collection |
| Urge support mode | Requirement preserved | Discreet supportive tools; no shame-based messaging |
| Daily shloka | Static attributed reflection only | Curated sourced daily content |
| Search | Session title search | Authorized full-text search and filters |
| Account settings | Preference/privacy shell | Authentication and account lifecycle |
| Light/dark themes | Implemented | Accessibility refinements |
| Reflections, milestones | Growth space; model contracts | Durable reviews and milestone workflows |

## Migration gate

Obtain read-only exports and field mapping, inventory records and attachments, take verified backups, create a dry-run import and reconciliation report. Only migrate or delete existing data after explicit user authorization. Keep legacy applications intact throughout. Resolving the separate source formats is not part of this foundation phase.
