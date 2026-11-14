-- Database roles for the Sites. Run with the owner credential; safe to re-run.
-- Passwords are never set here: set them separately with
--   ALTER ROLE portfolio_public PASSWORD '...';
-- so they stay out of the repo.
--
-- portfolio_public: Main and Blog Sites. SELECT only, on the public tables.
-- portfolio_admin:  Admin Site. Reads and writes data, never changes the schema.

DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'portfolio_public') THEN
    CREATE ROLE portfolio_public LOGIN;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'portfolio_admin') THEN
    CREATE ROLE portfolio_admin LOGIN;
  END IF;
END
$$;

-- Neither role may create or alter objects.
GRANT USAGE ON SCHEMA public TO portfolio_public, portfolio_admin;
REVOKE CREATE ON SCHEMA public FROM PUBLIC, portfolio_public, portfolio_admin;

-- Public: start from nothing, then grant only the tables public pages read.
-- A new table is unreadable here until it's added to this list and the file is re-run.
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM portfolio_public;
GRANT SELECT ON
  app_config,
  blog_post,
  education,
  experiences,
  profile,
  project,
  recommendations,
  skills,
  socials
TO portfolio_public;

-- Admin: data access on every table, including tables created later by the owner.
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO portfolio_admin;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO portfolio_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO portfolio_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO portfolio_admin;
