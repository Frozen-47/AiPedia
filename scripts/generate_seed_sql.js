import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

function escapeJson(obj) {
  if (!obj) return "'[]'::jsonb";
  return "'" + JSON.stringify(obj).replace(/'/g, "''") + "'::jsonb";
}

async function main() {
  const dataPath = path.resolve(__dirname, '../src/data.ts');
  const dataContent = fs.readFileSync(dataPath, 'utf-8');

  const jsContent = dataContent
    .replace(/import type .*?;/g, '')
    .replace(/export const entries: Entry\[\] =/g, 'const entries =')
    .replace(/export const /g, 'const ') + '\nreturn entries;';

  const getEntries = new Function(jsContent);
  const entries = getEntries();

  console.log(`Generating SQL for ${entries.length} entries...`);

  let sql = `-- Seed / Upsert all ${entries.length} AiVerse entries into Supabase\n`;
  sql += `-- Run this script in the Supabase Dashboard -> SQL Editor\n\n`;

  for (const e of entries) {
    const name = escapeSql(e.name);
    const org = escapeSql(e.org || null);
    const type = escapeSql(e.type);
    const task = escapeSql(e.task);
    const license = escapeSql(e.license || null);
    const year = e.year ? e.year : 'NULL';
    const size = escapeSql(e.size || null);
    const summary = escapeSql(e.summary);
    const architecture = escapeSql(e.architecture || null);
    const usage = escapeSql(e.usage || null);
    const benchmarks = escapeSql(e.benchmarks || null);
    const limitations = escapeSql(e.limitations || null);
    const url = escapeSql(e.url || null);
    const citations = escapeJson(e.citations || []);
    const popular = e.popular ? 'true' : 'false';

    sql += `INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)\n`;
    sql += `VALUES (${name}, ${org}, ${type}, ${task}, ${license}, ${year}, ${size}, ${summary}, ${architecture}, ${usage}, ${benchmarks}, ${limitations}, ${url}, ${citations}, ${popular}, true)\n`;
    sql += `ON CONFLICT (name) DO UPDATE SET\n`;
    sql += `  org = EXCLUDED.org,\n`;
    sql += `  type = EXCLUDED.type,\n`;
    sql += `  task = EXCLUDED.task,\n`;
    sql += `  license = EXCLUDED.license,\n`;
    sql += `  year = EXCLUDED.year,\n`;
    sql += `  size = EXCLUDED.size,\n`;
    sql += `  summary = EXCLUDED.summary,\n`;
    sql += `  architecture = EXCLUDED.architecture,\n`;
    sql += `  usage = EXCLUDED.usage,\n`;
    sql += `  benchmarks = EXCLUDED.benchmarks,\n`;
    sql += `  limitations = EXCLUDED.limitations,\n`;
    sql += `  url = EXCLUDED.url,\n`;
    sql += `  citations = EXCLUDED.citations,\n`;
    sql += `  popular = EXCLUDED.popular,\n`;
    sql += `  approved = true;\n\n`;
  }

  const outPath = path.resolve(__dirname, '../supabase/seed_entries.sql');
  fs.writeFileSync(outPath, sql, 'utf-8');
  console.log(`Successfully written SQL seed file to: ${outPath} (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);
}

main();
