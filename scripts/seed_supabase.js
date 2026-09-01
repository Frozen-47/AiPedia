import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env if present
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx !== -1) {
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_project_url')) {
  console.error('Error: Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or VITE_SUPABASE_ANON_KEY) in your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Reading local data.ts...');
  const dataPath = path.resolve(__dirname, '../src/data.ts');
  const dataContent = fs.readFileSync(dataPath, 'utf-8');
  
  const jsContent = dataContent
    .replace(/import type .*?;/g, '')
    .replace(/export const entries: Entry\[\] =/g, 'const entries =')
    .replace(/export const /g, 'const ') + '\nreturn entries;';
  
  let entries;
  try {
    const getEntries = new Function(jsContent);
    entries = getEntries();
  } catch (e) {
    console.error('Failed to parse entries array:', e);
    process.exit(1);
  }

  console.log(`Found ${entries.length} entries. Seeding to Supabase...`);

  const entriesWithApproved = entries.map(e => ({ ...e, approved: true }));

  // Chunk in batches of 50
  const chunkSize = 50;
  for (let i = 0; i < entriesWithApproved.length; i += chunkSize) {
    const chunk = entriesWithApproved.slice(i, i + chunkSize);
    const { error } = await supabase.from('entries').upsert(chunk, { onConflict: 'name' });
    if (error) {
      console.error(`Error seeding chunk ${i / chunkSize + 1}:`, error);
      if (error.code === '42501') {
        console.error('\nNOTE: RLS Policy blocked inserting approved entries with ANON key.');
        console.error('To fix:');
        console.error('1. Either add SUPABASE_SERVICE_ROLE_KEY to your .env file and re-run.');
        console.error('2. OR execute the SQL file supabase/seed_entries.sql directly in your Supabase Dashboard -> SQL Editor.');
      }
      process.exit(1);
    }
    console.log(`Successfully seeded chunk ${i / chunkSize + 1} (${Math.min(i + chunkSize, entriesWithApproved.length)}/${entriesWithApproved.length})`);
  }

  console.log('Successfully seeded database with all entries!');
}

seed();

