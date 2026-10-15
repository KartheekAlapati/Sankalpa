# Database design — proposal, not an applied schema

No database, migration, table, RLS policy or Storage bucket has been created. No live data was queried. This document prepares the Phase 2 review.

## Relational core

| Table | Purpose and proposed important fields |
| --- | --- |
| profiles | `id` references auth.users; timezone, preferences; no authorization from user_metadata |
| entities | Canonical identity: id, owner_id, kind, title, body, area, project_id, scheduled_date, completed_at, estimate_minutes, timestamps |
| projects | owner_id, title, area, goal_id, status |
| goals | owner_id, title, target_date, area |
| missions | owner_id, title, project_id, status |
| subjects | owner_id, title; learning-specific grouping |
| entity_subjects | Owner-constrained many-to-many join |
| relationships | owner_id, source_id, target_id, relation_type; links between canonical entities |
| daily_plans | owner_id, local_date, capacity_minutes, sankalp; unique owner/date |
| daily_priorities | owner_id, plan_id, entity_id, position; position 1..3 and unique plan/position and plan/entity |
| focus_sessions | owner_id, entity_id, started_at, ended_at, elapsed_seconds, outcome; explicit recorded duration |
| habits / habit_entries | Owner, cadence, sensitivity; dated check-ins, unique habit/date |
| journal_entries | owner_id, local_date, body, sensitivity; never public |
| reviews / milestones | Owner, periods or event dates, text and optional entity link |
| files | Owner, entity_id, private storage path, MIME, size; binary in private Storage |
| calendar_events | Owner, start/end, source, optional entity link; external IDs unique per source/owner |
| reschedule_events | Owner, entity_id, previous/new date and optional reason; recovery history |
| ira_grants / audit_events | Server-managed scopes, expiry, revocation; operation audit trail |

Task, note, link and idea are views/types of one entity. Inbox processing updates that entity's kind, retaining ID and relationships. Stored files reference entities; links never duplicate content. Quests can map to goals/projects after a concrete domain decision and migration mapping.

## Constraints and concurrency

Use UUID primary keys, required owner_id referencing auth.users, timestamptz for instants, date plus profile timezone for daily work. Add bounded titles, valid enumerated kinds/statuses, positive estimates/capacities, nonnegative recorded elapsed duration and end >= start. UUIDs do not provide authorization.

Cross-table links need composite ownership foreign keys: expose unique (owner_id,id) on parent records; references use (owner_id,parent_id), preventing same-owner rows from pointing to another user's entity. Reject self-links and duplicate directed relation types. Index foreign keys and common owner/date/status lookups; avoid premature vectors or partitioning.

Enforce three primary priorities atomically with unique positions 1..3 within a daily plan. Do not rely on browser counts under concurrent writes. A task can be unscheduled without being deleted. Additional non-primary commitments can remain in the inbox/backlog rather than increasing the default daily pressure.

## Authorization

Enable RLS before exposing any application table. Policies target authenticated and require `(select auth.uid()) = owner_id`. SELECT/DELETE use USING; INSERT uses WITH CHECK; UPDATE has both USING and WITH CHECK, plus required SELECT access. No anon grants to private records. Do not authorize from user_metadata. Views use security_invoker or remain unexposed. Prefer SECURITY INVOKER functions; sensitive server endpoints validate identity, scope and ownership. No privileged public functions or service_role key in the browser.

Private Storage paths should begin with authenticated user ID. Policies validate bucket and owner path for SELECT/INSERT/UPDATE/DELETE. Verify upserts against required SELECT/INSERT/UPDATE policies, signed-URL expiry, MIME/size limits and file ownership consistency. Avoid public buckets and service-worker caches for personal documents.

## Verification before production

Use two authenticated test users plus anon to test every operation; attempt forged owner IDs, ownership updates, cross-owner joins, stale/revoked permissions, signed URL abuse and concurrent fourth-priority creation. Run Supabase advisors and real SQL tests. Generate migrations through the supported CLI workflow after validation. Generate TypeScript database types from the reviewed schema. Backups, restoration, account export/deletion, retention and sensitive-data opt-in must be implemented and tested before lifelong use.
