# Decisions

1. **Separate codebase, preserved originals.** New branch `feat/sankalpa-2-phase-1`, isolated `apps/sankalpa-web`. No legacy file edits or data migration.
2. **Vercel remains the deployment target.** No alternate hosting registration/publication. Phase 1 is local implementation and verification.
3. **Four spaces, supporting tools.** Today, My Life, My Knowledge, My Growth. Capture is available globally; mobile uses four bottom tabs. Separate inbox/calendar/focus/search/settings routes have real rendered pages.
4. **Honest preview boundary.** In-memory personal records only, with visible reload-loss notice. No fake profile, projects, streaks, XP or completion rate. Theme is the sole localStorage value. No automatic private-data persistence before authentication/RLS.
5. **No pressure escalation.** Three primary priorities; Later unschedules instead of deleting; no failure language. Automatic capacity-aware planning remains Phase 2.
6. **Canonical records.** Reclassification updates an entity rather than cloning it; relationships will reference stable IDs.
7. **Timers use elapsed time.** Wall-clock deltas exclude paused periods and tolerate throttled intervals. Timer starts only with an actual task/topic. Explicit save creates a session record; no automatic fabricated study hours. Leaving a route ends unsaved progress and is disclosed.
8. **Accessible browser primitives.** Native modal dialog supplies focus containment; explicit focus restore and Escape; semantic forms/nav/main, reduced-motion support, status announcements, skip link. No unnecessary component framework.
9. **Semantic palette and local fonts.** Supplied colors kept as primitives; foreground/accessibility shades are semantic tokens. System sans and Georgia avoid external font requests.
10. **Network-only PWA foundation.** Manifest, PNG placeholder icons, no fetch handler/cache/background sync. Installability needs hosted HTTPS/device validation; no offline availability claim.
11. **Supabase prepared, not connected.** Factory accepts HTTPS URL and modern publishable key; no service secret. Config values alone never switch adapters. No schema/authentication migration is performed in Phase 1.
12. **IRA is separate.** No direct database access or hidden ambient grants. Future server-enforced, scoped, expiring and revocable access.
13. **Compatible pinned tooling.** Registry versions checked during implementation; lockfile committed. TypeScript 6.0.3 chosen for typescript-eslint compatibility. npm install audit reported no known vulnerabilities at installation time; this is not a guarantee of future safety.

## Reference checks

Reviewed current Vite getting-started documentation, Tailwind Vite installation, Supabase JS initialization and Supabase changelog on 2026-10-15. The changelog's upcoming TLS cipher deprecation was checked; modern browser HTTPS is the baseline. No older custom TLS client or database extension is introduced.

- https://vite.dev/guide/
- https://tailwindcss.com/docs/installation/using-vite
- https://supabase.com/docs/reference/javascript/initializing
- https://supabase.com/changelog.md
- https://supabase.com/changelog/cbc-tls-ciphers-deprecated
