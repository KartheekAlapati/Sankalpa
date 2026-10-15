# SANKALPA web — Phase 1

From this directory, with Node 24:

```sh
npm ci
npm run dev
```

The development server prints its local URL. Entries are session-only and disappear on refresh. No integration is connected.

```sh
npm run typecheck
npm run lint
npm run build
npx playwright install chromium
npm run test:smoke
```

Supabase configuration is documented in `.env.example`. Do not add secrets. Adding public values does not connect the current in-memory adapter; that is Phase 2 work.

For Vercel use this directory as project root, `npm run build`, output `dist`. PWA caching is deliberately disabled. See repository-root architecture, implementation plan, database design, decisions, status and security documents.
