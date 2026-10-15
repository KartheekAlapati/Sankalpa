# Security checklist — Phase 1

## Implemented / inspected

- [x] Legacy Python code and tracked SQLite bytes unchanged; web app uses a separate directory.
- [x] No credentials, authentication tokens or service_role keys authored.
- [x] Environment example has empty public configuration; .env files ignored except example.
- [x] Deferred Supabase factory rejects non-publishable keys and non-HTTPS URLs.
- [x] No active Supabase, Google Calendar or IRA integration.
- [x] User text rendered through React escaping; no dangerouslySetInnerHTML.
- [x] Personal preview records and query cache remain in memory; only theme persisted.
- [x] Service worker has no fetch handling or private caching; no Cache Storage/background sync.
- [x] Exact dependency pins and npm lockfile; installation audit reported 0 vulnerabilities.
- [x] Static deployment headers configured: CSP, nosniff, referrer policy, frame restriction and disabled camera/microphone/location.
- [x] Capture length validation and default three-priority bound in preview adapter.

## Required before production; not certified in Phase 1

- [ ] Supabase Auth sign-in/out/reset, redirect allowlists, session expiry and account lifecycle.
- [ ] RLS on all exposed tables; SELECT/INSERT/UPDATE/DELETE tests with two users and anon.
- [ ] No user_metadata authorization; both USING and WITH CHECK on UPDATE; no cross-owner links.
- [ ] Reviewed SECURITY INVOKER views/functions and no publicly executable privileged functions.
- [ ] Private Storage buckets, path ownership, upload validation and expiring signed URLs.
- [ ] Server authentication and ownership enforcement for sensitive operations; rate limiting and idempotency.
- [ ] Atomic database maximum-three-priority enforcement and concurrent-write tests.
- [ ] Export, backup/restore, retention and deletion workflows; explicit migration consent.
- [ ] Sensitive journals/health/spiritual records opt-in and separately scoped IRA consent.
- [ ] IRA grants revocable/expiring, minimal scopes and audited access; token revocation behavior tested.
- [ ] Vercel HTTPS and live CSP behavior verified; adjust connect-src only for actual configured endpoints.
- [ ] Android PWA installation and service-worker update behavior verified on device.
- [ ] Full accessibility audit, including screen reader and dark-mode contrast.

The original repository already tracks a SQLite file and Python bytecode. Phase 1 leaves them intact and does not claim they are sanitized. Their existence is documented without publishing their contents or removing user data.
