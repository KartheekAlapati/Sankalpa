# SANKALPA 2.0 — Phase 1 architecture

## Repository inspection, 2026-10-15

Inspected actual checkout at baseline `0b9e772561de12700a4e069f93a7a09e057328d0` on branch `feat/sankalpa-2-phase-1`.

| Path | Finding | Treatment |
| --- | --- | --- |
| `sankalpa/app.py` | Streamlit interface with custom CSS and pandas displays | Preserved byte-for-byte; not imported into web app |
| `sankalpa/requirements.txt` | Unpinned langgraph, streamlit, pandas, pydantic, typing-extensions | Preserved; web dependency installation is separate |
| `sankalpa/sankalpa/graph.py` | Deterministic planner/action/critic/recovery/halt LangGraph | Preserved; no AI service implied |
| `sankalpa/sankalpa/nodes.py` | Generated study sessions; critic uses fixed missed-session thresholds; recovery drops sessions | Preserved for legacy compatibility; not reused as the new scheduling policy |
| `sankalpa/sankalpa/db.py` | sqlite3; relative `sankalpa.db`; `study_plans` table with JSON plan versions | No new app read/write access |
| `sankalpa/sankalpa/state.py` | Python TypedDict workflow state | Conceptual reference only |
| `sankalpa/sankalpa.db` | Tracked 20,480-byte database | Preserved; contents not exposed in frontend or migrated |
| `sankalpa/sankalpa/__pycache__/` | Tracked Python bytecode | Left intact |
| Repository root | README, MIT LICENSE, gitignore; no web manifest, React components, frontend database config or tests | Existing files untouched |

The initial task workspace had empty `work/` and `outputs/` directories and no checkout. The repository was cloned into `sankalpa-repository/`. Shell DNS failed; the available host runtime successfully cloned and installed dependencies. No applicable AGENTS.md exists in this repository. No legacy runtime test was performed and legacy functionality is not newly certified.

Base44 is a separate deployment. Its public Dashboard URL returns HTTP 200 with compiled JS/CSS. Editable source, database exports, authenticated API access and ownership configuration were not provided. Compiled assets are not treated as a migration source. The supplied feature inventory is authoritative for preservation planning. No Base44 data was read, modified or migrated.

## Application boundary

New code lives only in `apps/sankalpa-web/`, independent of the Python dependency environment. React + TypeScript + Vite; Tailwind v4 Vite integration; React Router; TanStack Query; lucide-react icons; semantic HTML and native modal dialog primitives. Dependencies are exactly pinned with an npm lockfile. Node 24 is the supported local baseline. TypeScript 6 is retained for compatible typescript-eslint support rather than adopting TypeScript 7 immediately.

`src/domain/models.ts` defines owned records, canonical captures/tasks/notes, projects, goals, missions, relationships, daily plans, focus sessions, habits, journal, files, reviews, milestones, calendar events and future IRA grants. These interfaces are an initial contract, not a live database schema.

`src/lib/repository.ts` is an asynchronous in-memory adapter. TanStack Query owns query lifecycle and invalidation; mutations keep canonical IDs on categorization. Neither query cache nor personal records are persisted. One session-preview owner is used only inside the ephemeral adapter and must never become a production authorization identity.

`src/lib/supabase.ts` provides a deferred, validated client factory. There are no credentials, authentication flows, database calls or live Supabase connection. The current UI deliberately continues to use the ephemeral adapter even if environment values are supplied. Production integration requires Phase 2 authentication, generated database types, an authenticated adapter and RLS verification.

## Four spaces and supporting routes

| Route | Phase 1 scope |
| --- | --- |
| `/today` | Dashboard, three-priority planning, completion, Later action, capture and focus entry |
| `/life` | Six life-area shells and captured tasks/reminders |
| `/knowledge` | Captured notes, ideas and links; no document upload yet |
| `/growth` | Actual session completion count and saved focus minutes; explicit insufficient-data state |
| `/inbox` | Capture categorization in place |
| `/calendar` | Today's local agenda; no external integration |
| `/focus` | Existing task/note selection; 25-minute timer; pause/resume/reset; explicit save |
| `/search` | Case-insensitive title search over session captures |
| `/settings` | Light/dark preference and honest connection/privacy status |
| `/`, `/Dashboard` | Redirect to `/today` |
| Unmatched path | Accessible recovery page with Today link |

Desktop has a persistent sidebar; mobile has four-space bottom navigation, with tools reachable through Today and the header. Native dialog supplies modal focus containment and Escape handling. Navigation focuses main content. Buttons, form controls, notifications, loading, error and empty states are shared primitives.

## Design

Brand colors are defined once as CSS primitives. Semantic tokens specify surfaces, foregrounds, borders, accent, focus ring and state colors, with dark overrides. Tailwind semantic theme aliases are available. Smaller saffron text uses a darker semantic shade for readability. System sans typography avoids a network font dependency; Georgia display headings provide a restrained editorial voice. Abstract CSS artwork requires no external images. The Gita reflection is static and labelled; it is not claimed to be a synchronized daily shloka.

## Runtime and deployment

Vercel project root must be `apps/sankalpa-web`; command `npm run build`; output `dist`. `vercel.json` supplies history fallbacks and security headers. No deployment has been made. Manifest includes real PNG placeholder icons (192/512 and maskable), standalone display and Today start URL. Service worker has no fetch handler or caching. PWA requires network access; no private responses, sessions, attachments or API calls enter Cache Storage. Real Android installation and hosted headers require later device/hosting validation.

## IRA boundary

IRA stays a separate future service. It receives no frontend service key or direct unrestricted database access. Future scoped, expiring, revocable grants must be checked server-side for each operation, with audit logs, user-visible consent and separate opt-in for sensitive journals/health/spiritual records. No IRA endpoint or permission grant is active.
