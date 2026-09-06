-- =============================================================================
-- AiVerse — Complete Account & Auth Deletion Script
-- Run this in your Supabase Project -> SQL Editor
-- This ensures deleting an account removes it COMPLETELY from:
--   1. auth.users (Supabase Auth credentials, sessions, OAuth links)
--   2. public.user_preferences
--   3. public.user_bookmarks
--   4. public.entry_ratings
--   5. public.entry_comments
--   6. public.entries (cleans up submitted_by)
-- =============================================================================

-- ─── 1. Admin Function: Delete any user account completely ───────────────────
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
  -- Extract calling user claims safely
  caller_email := auth.jwt() ->> 'email';
  caller_sub := auth.jwt() ->> 'sub';
  caller_role := auth.jwt() -> 'user_metadata' ->> 'role';

  -- Verify caller is an administrator
  IF NOT (
    caller_email = 'frozennheart47@gmail.com' 
    OR caller_sub = '20f48b0a-737d-4b78-9098-847a8ba450e8'
    OR caller_role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Only platform administrators can delete accounts.';
  END IF;

  -- Normalize target key: extract raw UUID whether formatted as 'supabase_<uuid>' or '<uuid>'
  IF target_user_key LIKE 'supabase_%' THEN
    raw_uuid_text := substring(target_user_key from 10);
  ELSE
    raw_uuid_text := target_user_key;
  END IF;

  -- Prevent admin from accidentally deleting the primary administrator account
  IF raw_uuid_text = '20f48b0a-737d-4b78-9098-847a8ba450e8' THEN
    RAISE EXCEPTION 'Security error: You cannot delete the primary admin account.';
  END IF;

  -- 1. Delete from application tables (matching both 'supabase_<uuid>' and '<uuid>')
  DELETE FROM public.user_preferences 
    WHERE user_key = target_user_key 
       OR user_key = 'supabase_' || raw_uuid_text 
       OR user_key = raw_uuid_text;

  DELETE FROM public.user_bookmarks 
    WHERE user_key = target_user_key 
       OR user_key = 'supabase_' || raw_uuid_text 
       OR user_key = raw_uuid_text;

  DELETE FROM public.entry_ratings 
    WHERE user_key = target_user_key 
       OR user_key = 'supabase_' || raw_uuid_text 
       OR user_key = raw_uuid_text;

  DELETE FROM public.entry_comments 
    WHERE user_key = target_user_key 
       OR user_key = 'supabase_' || raw_uuid_text 
       OR user_key = raw_uuid_text;

  UPDATE public.entries 
    SET submitted_by = NULL 
    WHERE submitted_by = target_user_key 
       OR submitted_by = 'supabase_' || raw_uuid_text 
       OR submitted_by = raw_uuid_text;

  -- 2. Delete completely from auth.users (cascades sessions, identities, OAuth tokens)
  BEGIN
    target_uuid := raw_uuid_text::uuid;
    DELETE FROM auth.users WHERE id = target_uuid;
  EXCEPTION WHEN OTHERS THEN
    -- If target_user_key was not a valid UUID (e.g. guest ID), ignore auth.users delete
  END;
END;
$$;

REVOKE ALL ON FUNCTION public.delete_user_by_admin(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.delete_user_by_admin(text) TO authenticated;


-- ─── 2. User Function: Self-account deletion ─────────────────────────────────
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

  -- Prevent primary admin from deleting their own account via self-deletion
  IF calling_user_id = '20f48b0a-737d-4b78-9098-847a8ba450e8'::uuid THEN
    RAISE EXCEPTION 'Security error: The primary administrator account cannot be deleted.';
  END IF;

  calling_user_key := 'supabase_' || calling_user_id::text;

  -- 1. Delete application records
  DELETE FROM public.user_preferences 
    WHERE user_key = calling_user_key OR user_key = calling_user_id::text;

  DELETE FROM public.user_bookmarks 
    WHERE user_key = calling_user_key OR user_key = calling_user_id::text;

  DELETE FROM public.entry_ratings 
    WHERE user_key = calling_user_key OR user_key = calling_user_id::text;

  DELETE FROM public.entry_comments 
    WHERE user_key = calling_user_key OR user_key = calling_user_id::text;

  UPDATE public.entries 
    SET submitted_by = NULL 
    WHERE submitted_by = calling_user_key OR submitted_by = calling_user_id::text;

  -- 2. Delete from auth.users (cascades all authentication sessions and OAuth identities)
  DELETE FROM auth.users WHERE id = calling_user_id;
END;
$$;

REVOKE ALL ON FUNCTION public.delete_own_account() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.delete_own_account() TO authenticated;


-- ─── 3. Admin Function: Query all auth.users merged with preferences ─────────
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
