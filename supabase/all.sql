-- =============================================================================
-- AiVerse — full database setup (run this ONE file in Supabase SQL Editor)
-- Safe to re-run: uses IF NOT EXISTS / DROP POLICY IF EXISTS
-- =============================================================================

-- ─── 1. Tables ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL UNIQUE,
  org TEXT,
  type TEXT NOT NULL,
  task TEXT NOT NULL,
  license TEXT,
  year INTEGER,
  size TEXT,
  summary TEXT NOT NULL,
  architecture TEXT,
  usage TEXT,
  benchmarks TEXT,
  limitations TEXT,
  url TEXT,
  citations JSONB DEFAULT '[]'::jsonb,
  popular BOOLEAN DEFAULT false,
  approved BOOLEAN DEFAULT false,
  submitted_by TEXT
);

CREATE TABLE IF NOT EXISTS user_preferences (
  user_key TEXT PRIMARY KEY,
  role TEXT NOT NULL,
  interests TEXT[] NOT NULL DEFAULT '{}',
  referral_source TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS entry_ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entry_name TEXT NOT NULL REFERENCES entries(name) ON DELETE CASCADE,
  user_key TEXT NOT NULL,
  author_name TEXT NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (entry_name, user_key)
);

CREATE TABLE IF NOT EXISTS entry_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entry_name TEXT NOT NULL REFERENCES entries(name) ON DELETE CASCADE,
  user_key TEXT NOT NULL,
  author_name TEXT NOT NULL,
  body TEXT NOT NULL CHECK (char_length(trim(body)) >= 1 AND char_length(body) <= 2000),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_key TEXT NOT NULL,
  entry_name TEXT NOT NULL REFERENCES entries(name) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_key, entry_name)
);

CREATE INDEX IF NOT EXISTS entry_ratings_entry_name_idx ON entry_ratings (entry_name);
CREATE INDEX IF NOT EXISTS entry_comments_entry_name_idx ON entry_comments (entry_name, created_at DESC);
CREATE INDEX IF NOT EXISTS user_bookmarks_user_key_idx ON user_bookmarks (user_key, created_at DESC);

ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE entry_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE entry_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;

-- ─── 2. RLS helpers (private schema — not exposed via /rest/v1/rpc) ─────────
-- Clerk + Supabase: Authentication → Third-party auth → Clerk; JWT `sub` = user id.

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO postgres, service_role, anon, authenticated;

CREATE OR REPLACE FUNCTION private.app_user_key()
RETURNS text
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT CASE
    WHEN (auth.jwt() ->> 'sub') IS NOT NULL
      THEN 'supabase_' || (auth.jwt() ->> 'sub')
    ELSE NULL
  END;
$$;

CREATE OR REPLACE FUNCTION private.is_guest_user_key(key text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT key ~ '^guest_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
$$;

CREATE OR REPLACE FUNCTION private.can_access_user_key(key text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT key = private.app_user_key()
    OR (
      auth.role() = 'anon'
      AND private.app_user_key() IS NULL
      AND private.is_guest_user_key(key)
    );
$$;

CREATE OR REPLACE FUNCTION private.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT 
    auth.jwt() ->> 'email' = 'frozennheart47@gmail.com' 
    OR auth.jwt() -> 'user_metadata' ->> 'role' = 'admin';
$$;

REVOKE ALL ON FUNCTION private.app_user_key() FROM PUBLIC;
REVOKE ALL ON FUNCTION private.is_guest_user_key(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.can_access_user_key(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.app_user_key() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION private.is_guest_user_key(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION private.can_access_user_key(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION private.is_admin() TO anon, authenticated;

-- Remove legacy public helpers (callable via PostgREST RPC)
DROP FUNCTION IF EXISTS public.can_access_user_key(text) CASCADE;
DROP FUNCTION IF EXISTS public.app_user_key() CASCADE;
DROP FUNCTION IF EXISTS public.is_guest_user_key(text) CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;

-- ─── 3. RLS policies ─────────────────────────────────────────────────────────

-- entries
DROP POLICY IF EXISTS "Allow public read access" ON entries;
DROP POLICY IF EXISTS "Public read approved entries" ON entries;
CREATE POLICY "Public read approved entries"
  ON entries FOR SELECT
  USING (approved = true OR private.is_admin() OR submitted_by = private.app_user_key());

DROP POLICY IF EXISTS "Admin update entries" ON entries;
CREATE POLICY "Admin update entries"
  ON entries FOR UPDATE
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

DROP POLICY IF EXISTS "Admin delete entries" ON entries;
CREATE POLICY "Admin delete entries"
  ON entries FOR DELETE
  USING (private.is_admin());

DROP POLICY IF EXISTS "Allow public inserts" ON entries;
DROP POLICY IF EXISTS "Public submit unapproved entries" ON entries;
CREATE POLICY "Public submit unapproved entries"
  ON entries FOR INSERT
  WITH CHECK (
    coalesce(approved, false) = false
    AND coalesce(popular, false) = false
    AND name IS NOT NULL
    AND btrim(name) <> ''
    AND type IS NOT NULL
    AND btrim(type) <> ''
    AND task IS NOT NULL
    AND btrim(task) <> ''
    AND summary IS NOT NULL
    AND btrim(summary) <> ''
  );

-- user_preferences
DROP POLICY IF EXISTS "Allow public read preferences" ON user_preferences;
DROP POLICY IF EXISTS "Read own preferences" ON user_preferences;
CREATE POLICY "Read own preferences"
  ON user_preferences FOR SELECT
  USING (private.can_access_user_key(user_key) OR private.is_admin());

DROP POLICY IF EXISTS "Allow public upsert preferences" ON user_preferences;
DROP POLICY IF EXISTS "Insert own preferences" ON user_preferences;
CREATE POLICY "Insert own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (
    private.can_access_user_key(user_key)
    AND role IS NOT NULL
    AND btrim(role) <> ''
    AND referral_source IS NOT NULL
    AND btrim(referral_source) <> ''
  );

DROP POLICY IF EXISTS "Allow public update preferences" ON user_preferences;
DROP POLICY IF EXISTS "Update own preferences" ON user_preferences;
CREATE POLICY "Update own preferences"
  ON user_preferences FOR UPDATE
  USING (private.can_access_user_key(user_key))
  WITH CHECK (
    private.can_access_user_key(user_key)
    AND role IS NOT NULL
    AND btrim(role) <> ''
    AND referral_source IS NOT NULL
    AND btrim(referral_source) <> ''
  );

DROP POLICY IF EXISTS "Admin update preferences" ON user_preferences;
CREATE POLICY "Admin update preferences"
  ON user_preferences FOR UPDATE
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

DROP POLICY IF EXISTS "Admin delete preferences" ON user_preferences;
CREATE POLICY "Admin delete preferences"
  ON user_preferences FOR DELETE
  USING (private.is_admin());

-- entry_ratings
DROP POLICY IF EXISTS "Allow public read ratings" ON entry_ratings;
DROP POLICY IF EXISTS "Public read ratings" ON entry_ratings;
CREATE POLICY "Public read ratings"
  ON entry_ratings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow public insert ratings" ON entry_ratings;
DROP POLICY IF EXISTS "Insert own ratings" ON entry_ratings;
CREATE POLICY "Insert own ratings"
  ON entry_ratings FOR INSERT
  WITH CHECK (
    user_key = private.app_user_key()
    AND private.app_user_key() IS NOT NULL
    AND rating BETWEEN 1 AND 5
    AND author_name IS NOT NULL
    AND btrim(author_name) <> ''
    AND char_length(btrim(author_name)) <= 120
    AND entry_name IS NOT NULL
  );

DROP POLICY IF EXISTS "Allow public update ratings" ON entry_ratings;
DROP POLICY IF EXISTS "Update own ratings" ON entry_ratings;
CREATE POLICY "Update own ratings"
  ON entry_ratings FOR UPDATE
  USING (user_key = private.app_user_key())
  WITH CHECK (
    user_key = private.app_user_key()
    AND rating BETWEEN 1 AND 5
    AND author_name IS NOT NULL
    AND btrim(author_name) <> ''
    AND char_length(btrim(author_name)) <= 120
  );

-- entry_comments
DROP POLICY IF EXISTS "Allow public read comments" ON entry_comments;
DROP POLICY IF EXISTS "Public read comments" ON entry_comments;
CREATE POLICY "Public read comments"
  ON entry_comments FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow public insert comments" ON entry_comments;
DROP POLICY IF EXISTS "Insert own comments" ON entry_comments;
CREATE POLICY "Insert own comments"
  ON entry_comments FOR INSERT
  WITH CHECK (
    user_key = private.app_user_key()
    AND private.app_user_key() IS NOT NULL
    AND author_name IS NOT NULL
    AND btrim(author_name) <> ''
    AND char_length(btrim(author_name)) <= 120
    AND body IS NOT NULL
    AND char_length(btrim(body)) >= 1
    AND char_length(body) <= 2000
    AND entry_name IS NOT NULL
  );

-- user_bookmarks
DROP POLICY IF EXISTS "Allow public read bookmarks" ON user_bookmarks;
DROP POLICY IF EXISTS "Read own bookmarks" ON user_bookmarks;
CREATE POLICY "Allow public read bookmarks"
  ON user_bookmarks FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow public insert bookmarks" ON user_bookmarks;
DROP POLICY IF EXISTS "Insert own bookmarks" ON user_bookmarks;
CREATE POLICY "Insert own bookmarks"
  ON user_bookmarks FOR INSERT
  WITH CHECK (
    user_key = private.app_user_key()
    AND private.app_user_key() IS NOT NULL
    AND entry_name IS NOT NULL
    AND btrim(entry_name) <> ''
  );

DROP POLICY IF EXISTS "Allow public delete bookmarks" ON user_bookmarks;
DROP POLICY IF EXISTS "Delete own bookmarks" ON user_bookmarks;
CREATE POLICY "Delete own bookmarks"
  ON user_bookmarks FOR DELETE
  USING (user_key = private.app_user_key());

-- ─── 4. Administrative & Account Deletion Functions ─────────────────────────

CREATE OR REPLACE FUNCTION public.delete_user_by_admin(target_user_key text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_catalog
AS $$
DECLARE
  raw_uuid_text text;
  target_uuid uuid;
  caller_email text;
  caller_sub text;
  caller_role text;
BEGIN
  caller_email := auth.jwt() ->> 'email';
  caller_sub := auth.jwt() ->> 'sub';
  caller_role := auth.jwt() -> 'user_metadata' ->> 'role';

  IF NOT (
    caller_email = 'frozennheart47@gmail.com' 
    OR caller_sub = '20f48b0a-737d-4b78-9098-847a8ba450e8'
    OR caller_role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Only platform administrators can delete accounts.';
  END IF;

  IF target_user_key LIKE 'supabase_%' THEN
    raw_uuid_text := substring(target_user_key from 10);
  ELSE
    raw_uuid_text := target_user_key;
  END IF;

  IF raw_uuid_text = '20f48b0a-737d-4b78-9098-847a8ba450e8' THEN
    RAISE EXCEPTION 'Security error: You cannot delete the primary admin account.';
  END IF;

  DELETE FROM public.user_preferences 
    WHERE user_key = target_user_key OR user_key = 'supabase_' || raw_uuid_text OR user_key = raw_uuid_text;
  DELETE FROM public.user_bookmarks 
    WHERE user_key = target_user_key OR user_key = 'supabase_' || raw_uuid_text OR user_key = raw_uuid_text;
  DELETE FROM public.entry_ratings 
    WHERE user_key = target_user_key OR user_key = 'supabase_' || raw_uuid_text OR user_key = raw_uuid_text;
  DELETE FROM public.entry_comments 
    WHERE user_key = target_user_key OR user_key = 'supabase_' || raw_uuid_text OR user_key = raw_uuid_text;

  UPDATE public.entries 
    SET submitted_by = NULL 
    WHERE submitted_by = target_user_key OR submitted_by = 'supabase_' || raw_uuid_text OR submitted_by = raw_uuid_text;

  BEGIN
    target_uuid := raw_uuid_text::uuid;
    DELETE FROM auth.users WHERE id = target_uuid;
  EXCEPTION WHEN OTHERS THEN
  END;
END;
$$;

REVOKE ALL ON FUNCTION public.delete_user_by_admin(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.delete_user_by_admin(text) TO authenticated;

CREATE OR REPLACE FUNCTION public.delete_own_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_catalog
AS $$
DECLARE
  calling_user_id uuid;
  calling_user_key text;
BEGIN
  calling_user_id := auth.uid();
  IF calling_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated.';
  END IF;

  IF calling_user_id = '20f48b0a-737d-4b78-9098-847a8ba450e8'::uuid THEN
    RAISE EXCEPTION 'Security error: The primary administrator account cannot be deleted.';
  END IF;

  calling_user_key := 'supabase_' || calling_user_id::text;

  DELETE FROM public.user_preferences WHERE user_key = calling_user_key OR user_key = calling_user_id::text;
  DELETE FROM public.user_bookmarks WHERE user_key = calling_user_key OR user_key = calling_user_id::text;
  DELETE FROM public.entry_ratings WHERE user_key = calling_user_key OR user_key = calling_user_id::text;
  DELETE FROM public.entry_comments WHERE user_key = calling_user_key OR user_key = calling_user_id::text;
  UPDATE public.entries SET submitted_by = NULL WHERE submitted_by = calling_user_key OR submitted_by = calling_user_id::text;

  DELETE FROM auth.users WHERE id = calling_user_id;
END;
$$;

REVOKE ALL ON FUNCTION public.delete_own_account() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.delete_own_account() TO authenticated;

CREATE OR REPLACE FUNCTION public.get_admin_users()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_catalog
AS $$
DECLARE
  caller_email text;
  caller_sub text;
  caller_role text;
  result jsonb;
BEGIN
  caller_email := auth.jwt() ->> 'email';
  caller_sub := auth.jwt() ->> 'sub';
  caller_role := auth.jwt() -> 'user_metadata' ->> 'role';

  IF NOT (
    caller_email = 'frozennheart47@gmail.com'
    OR caller_sub = '20f48b0a-737d-4b78-9098-847a8ba450e8'
    OR caller_role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT jsonb_agg(u_row) INTO result
  FROM (
    SELECT 
      u.id::text AS user_id,
      'supabase_' || u.id::text AS user_key,
      u.email,
      COALESCE(
        p.referral_source,
        jsonb_build_object(
          'displayName', COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)),
          'avatarUrl', COALESCE(u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'picture'),
          'source', 'direct'
        )::text
      ) AS referral_source,
      COALESCE(p.role, 'developer') AS role,
      COALESCE(p.interests, '{}'::text[]) AS interests,
      COALESCE(p.updated_at, u.created_at) AS updated_at,
      u.created_at,
      u.last_sign_in_at
    FROM auth.users u
    LEFT JOIN public.user_preferences p 
      ON p.user_key = 'supabase_' || u.id::text OR p.user_key = u.id::text
    ORDER BY u.created_at DESC
  ) u_row;

  RETURN COALESCE(result, '[]'::jsonb);
END;
$$;

REVOKE ALL ON FUNCTION public.get_admin_users() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_admin_users() TO authenticated;

