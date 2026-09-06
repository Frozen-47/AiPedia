-- AiVerse: Automated Catalog Synchronization RPC
-- Run this in your Supabase Dashboard -> SQL Editor
-- This allows automated workflows (like daily GitHub Actions) to upsert approved entries directly into the database.

CREATE OR REPLACE FUNCTION public.sync_catalog_entry(entry_data jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO entries (
    name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved
  ) VALUES (
    entry_data->>'name',
    entry_data->>'org',
    entry_data->>'type',
    entry_data->>'task',
    entry_data->>'license',
    CASE WHEN (entry_data->>'year') IS NOT NULL AND (entry_data->>'year') ~ '^\d+$' THEN (entry_data->>'year')::int ELSE NULL END,
    entry_data->>'size',
    entry_data->>'summary',
    entry_data->>'architecture',
    entry_data->>'usage',
    entry_data->>'benchmarks',
    entry_data->>'limitations',
    entry_data->>'url',
    coalesce(entry_data->'citations', '[]'::jsonb),
    coalesce((entry_data->>'popular')::boolean, false),
    true
  )
  ON CONFLICT (name) DO UPDATE SET
    org = EXCLUDED.org,
    type = EXCLUDED.type,
    task = EXCLUDED.task,
    license = EXCLUDED.license,
    year = EXCLUDED.year,
    size = EXCLUDED.size,
    summary = EXCLUDED.summary,
    architecture = EXCLUDED.architecture,
    usage = EXCLUDED.usage,
    benchmarks = EXCLUDED.benchmarks,
    limitations = EXCLUDED.limitations,
    url = EXCLUDED.url,
    citations = EXCLUDED.citations,
    popular = EXCLUDED.popular,
    approved = true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.sync_catalog_entry(jsonb) TO anon, authenticated, service_role;
