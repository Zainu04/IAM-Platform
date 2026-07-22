-- JourneyOne app store table.
-- The app currently reads/writes one JSON document (users, employees, tasks,
-- equipment, accessRequests, notifications, auditLogs, orientations) rather
-- than normalized tables. This table holds that document in Postgres so it
-- persists across deploys/restarts instead of living in a local file.
--
-- (server/data/postgresql-schema.sql already contains a fully normalized
-- relational schema if you want to migrate to real tables later -- this
-- migration is the minimal, low-risk step to get you onto Postgres now.)

CREATE TABLE IF NOT EXISTS app_store (
  id INTEGER PRIMARY KEY DEFAULT 1,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT app_store_singleton CHECK (id = 1)
);
