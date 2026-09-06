import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDataDir = path.join(rootDir, 'public', 'data');

if (!fs.existsSync(publicDataDir)) {
  fs.mkdirSync(publicDataDir, { recursive: true });
}

// Load .env if present
const envPath = path.resolve(rootDir, '.env');
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

// Helper to get raw entries from src/data.ts
function readRawEntries() {
  const dataPath = path.join(rootDir, 'src', 'data.ts');
  const content = fs.readFileSync(dataPath, 'utf-8');
  const jsContent = content
    .replace(/import type .*?;/g, '')
    .replace(/export const entries: Entry\[\] =/g, 'const entries =')
    .replace(/export const /g, 'const ') + '\nreturn entries;';
  const getEntries = new Function(jsContent);
  return getEntries();
}

// Helper to update supabase/seed_entries.sql
function updateSeedSql(entries) {
  try {
    const escapeSql = (str) => {
      if (str === null || str === undefined) return 'NULL';
      return "'" + String(str).replace(/'/g, "''") + "'";
    };
    const escapeJson = (obj) => {
      if (!obj) return "'[]'::jsonb";
      return "'" + JSON.stringify(obj).replace(/'/g, "''") + "'::jsonb";
    };

    let sql = `-- Seed / Upsert all ${entries.length} AiVerse entries into Supabase\n`;
    sql += `-- Generated automatically by daily pulse\n\n`;

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

    const outPath = path.resolve(rootDir, 'supabase', 'seed_entries.sql');
    fs.writeFileSync(outPath, sql, 'utf-8');
    console.log(`[Seed SQL] Updated supabase/seed_entries.sql with ${entries.length} entries.`);
  } catch (err) {
    console.warn('[Seed SQL] Failed to generate seed_entries.sql:', err.message);
  }
}

// Helper to sync entries directly to Supabase
async function syncToSupabase(entriesToSync) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://iajivjjzfvkhullzfsom.supabase.co';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlhaml2amp6ZnZraHVsbHpmc29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4OTk4MzEsImV4cCI6MjA5NDQ3NTgzMX0.QtZ6f8KYZXWBOil2JvOUwx45TMw5qeblcfhQysIqptg';

  if (!supabaseUrl || (!serviceRoleKey && !anonKey)) {
    console.log('[Supabase Sync] No Supabase credentials detected. Skipping live DB sync.');
    return;
  }

  const keyToUse = serviceRoleKey || anonKey;
  const isServiceRole = Boolean(serviceRoleKey);
  const supabase = createClient(supabaseUrl, keyToUse);

  console.log(`[Supabase Sync] Connecting to ${supabaseUrl} (${isServiceRole ? 'Service Role Key' : 'Anon Key'})...`);

  // Try 1: If service role key is available, directly upsert approved entries
  if (isServiceRole) {
    try {
      const payload = entriesToSync.map(e => ({ ...e, approved: true }));
      const chunkSize = 50;
      for (let i = 0; i < payload.length; i += chunkSize) {
        const chunk = payload.slice(i, i + chunkSize);
        const { error } = await supabase.from('entries').upsert(chunk, { onConflict: 'name' });
        if (error) throw error;
      }
      console.log(`[Supabase Sync] ✅ Successfully upserted ${entriesToSync.length} approved entry/entries using Service Role.`);
      return;
    } catch (err) {
      console.warn('[Supabase Sync] Direct service role upsert error:', err.message);
    }
  }

  // Try 2: Call sync_catalog_entry RPC function if available (SECURITY DEFINER)
  let rpcSuccessCount = 0;
  for (const entry of entriesToSync) {
    try {
      const { error } = await supabase.rpc('sync_catalog_entry', { entry_data: entry });
      if (!error) {
        rpcSuccessCount++;
      }
    } catch {
      // RPC may not exist in database yet
    }
  }

  if (rpcSuccessCount > 0) {
    console.log(`[Supabase Sync] ✅ Successfully synced ${rpcSuccessCount}/${entriesToSync.length} entries to Supabase via RPC.`);
    return;
  }

  // Try 3: Insert with approved=false so items are captured in database queue for admin approval
  try {
    let pendingCount = 0;
    for (const entry of entriesToSync) {
      const payload = {
        name: entry.name,
        type: entry.type,
        task: entry.task,
        summary: entry.summary,
        org: entry.org || null,
        license: entry.license || null,
        year: entry.year || new Date().getFullYear(),
        size: entry.size || null,
        architecture: entry.architecture || null,
        usage: entry.usage || null,
        benchmarks: entry.benchmarks || null,
        limitations: entry.limitations || null,
        url: entry.url || null,
        citations: entry.citations || [],
        popular: false,
        approved: false,
        submitted_by: 'pulse-sync-bot'
      };
      const { error } = await supabase.from('entries').insert([payload]);
      if (!error) pendingCount++;
    }
    if (pendingCount > 0) {
      console.log(`[Supabase Sync] 📥 Added ${pendingCount} entry/entries to Supabase queue (pending admin approval).`);
    }
  } catch (err) {
    console.warn('[Supabase Sync] Could not insert pending entries:', err.message);
  }
}

// 0. Auto-Ingest New Assets (Models, Platforms, Frameworks, Datasets)
async function ingestNewAssets({ maxModels = 1, maxPlatforms = 1, maxFrameworks = 1, maxDatasets = 1 } = {}) {
  const added = [];
  const existingEntries = readRawEntries();
  const existingNames = new Set(existingEntries.map(e => (e.name || '').toLowerCase().trim()));
  const existingUrls = new Set(existingEntries.map(e => (e.url || '').toLowerCase().trim()));

  const isAlreadyPresent = (name, url) => {
    return existingNames.has((name || '').toLowerCase().trim()) || existingUrls.has((url || '').toLowerCase().trim());
  };

  const headers = { 'User-Agent': 'AiVerse-PulseBot/2.0' };

  // ── A. Ingest Trending Models (Hugging Face) ──
  try {
    const res = await fetch('https://huggingface.co/api/models?sort=trendingScore&direction=-1&limit=30', { headers });
    if (res.ok) {
      const models = await res.json();
      let modelCount = 0;
      for (const m of models) {
        if (modelCount >= maxModels) break;
        const modelName = m.id.includes('/') ? m.id.split('/')[1] : m.id;
        const modelUrl = `https://huggingface.co/${m.id}`;

        if (isAlreadyPresent(modelName, modelUrl)) continue;
        if ((m.likes || 0) < 25 && (m.downloads || 0) < 250) continue;

        let task = "NLP";
        const p = m.pipeline_tag || "";
        if (p.includes("image-text") || p.includes("multimodal")) task = "Multimodal";
        else if (p.includes("text-to-image") || p.includes("image-generation")) task = "Image Generation";
        else if (p.includes("text-to-video") || p.includes("video")) task = "Video Generation";
        else if (p.includes("audio") || p.includes("speech") || p.includes("voice")) task = "Audio";
        else if (p.includes("code")) task = "AI Coding";
        else if (p.includes("vision")) task = "Computer Vision";

        let license = "Open Weights";
        const tags = m.tags || [];
        const licTag = tags.find(t => t.startsWith("license:"));
        if (licTag) license = licTag.replace("license:", "").toUpperCase();

        const sizeMatch = modelName.match(/(\d+(\.\d+)?[BMKbmk]|\d+x\d+[BMKbmk])/);
        const size = sizeMatch ? `${sizeMatch[0].toUpperCase()} params` : "Open Weights";

        const rawAuthor = m.author || (m.id.includes('/') ? m.id.split('/')[0] : 'Open Source');
        let org = rawAuthor;
        if (rawAuthor.toLowerCase() === 'deepseek-ai') org = 'DeepSeek';
        else if (rawAuthor.toLowerCase() === 'qwen') org = 'Alibaba (Qwen)';
        else if (rawAuthor.toLowerCase() === 'meta-llama') org = 'Meta AI';
        else if (rawAuthor.toLowerCase() === 'mistralai') org = 'Mistral AI';
        else if (rawAuthor.toLowerCase() === 'microsoft') org = 'Microsoft';
        else if (rawAuthor.toLowerCase() === 'google') org = 'Google';
        else if (rawAuthor.toLowerCase() === 'zai-org') org = 'Zhipu AI';

        const entry = {
          name: modelName,
          type: "Model",
          summary: `High-performance ${task} open-weights model by ${org}, trending with over ${(m.likes || 0).toLocaleString()} community likes and ${(m.downloads || 0).toLocaleString()} downloads on Hugging Face.`,
          task,
          license,
          year: new Date().getFullYear(),
          org,
          size,
          architecture: `${org} ${p ? p.replace(/-/g, ' ') : 'transformer'} architecture with community-tuned weights.`,
          usage: `from transformers import AutoModelForCausalLM, AutoTokenizer\n\nmodel = AutoModelForCausalLM.from_pretrained("${m.id}", device_map="auto")\ntokenizer = AutoTokenizer.from_pretrained("${m.id}")`,
          benchmarks: `Trending Score: ${Math.round(m.trendingScore || 0)}, Likes: ${(m.likes || 0).toLocaleString()}, Downloads: ${(m.downloads || 0).toLocaleString()}`,
          limitations: `Requires GPU VRAM or quantization for efficient local deployment.`,
          popular: true,
          url: modelUrl,
          citations: [{ text: `${m.id} on Hugging Face`, url: modelUrl }]
        };

        added.push(entry);
        existingNames.add(modelName.toLowerCase());
        existingUrls.add(modelUrl.toLowerCase());
        modelCount++;
      }
    }
  } catch (err) {
    console.warn('[Ingest] Model ingestion warning:', err.message);
  }

  // ── B. Ingest Trending Platforms / Spaces (Hugging Face Spaces) ──
  try {
    const res = await fetch('https://huggingface.co/api/spaces?sort=trendingScore&direction=-1&limit=30', { headers });
    if (res.ok) {
      const spaces = await res.json();
      let platformCount = 0;
      for (const s of spaces) {
        if (platformCount >= maxPlatforms) break;
        const spaceName = s.id.includes('/') ? s.id.split('/')[1] : s.id;
        const spaceUrl = `https://huggingface.co/spaces/${s.id}`;

        if (isAlreadyPresent(spaceName, spaceUrl)) continue;
        if ((s.likes || 0) < 20) continue;

        const org = s.author || (s.id.includes('/') ? s.id.split('/')[0] : 'Community');
        const tags = s.tags || [];
        
        let task = "Multimodal";
        const tagString = tags.join(' ').toLowerCase();
        if (tagString.includes('image') || tagString.includes('diffusion')) task = "Image Generation";
        else if (tagString.includes('video')) task = "Video Generation";
        else if (tagString.includes('audio') || tagString.includes('voice')) task = "Audio";
        else if (tagString.includes('code')) task = "AI Coding";
        else if (tagString.includes('chat') || tagString.includes('llm')) task = "NLP";

        const sdk = s.sdk ? s.sdk.toUpperCase() : 'Web / Cloud';

        const entry = {
          name: spaceName,
          type: "Platform",
          summary: `Interactive AI web platform and demonstration hosted on Hugging Face Spaces by ${org}. Trending with ${(s.likes || 0).toLocaleString()} community stars.`,
          task,
          license: "Community Hosted",
          year: new Date().getFullYear(),
          org,
          size: `${sdk} Platform`,
          architecture: `${sdk} cloud runtime container with interactive browser interface.`,
          usage: `Launch and explore the platform directly in your browser: ${spaceUrl}`,
          benchmarks: `Trending Score: ${Math.round(s.trendingScore || 0)}, Community Likes: ${(s.likes || 0).toLocaleString()}`,
          limitations: `Cloud container subject to community traffic quotas and queue times.`,
          popular: true,
          url: spaceUrl,
          citations: [{ text: `${s.id} on Hugging Face Spaces`, url: spaceUrl }]
        };

        added.push(entry);
        existingNames.add(spaceName.toLowerCase());
        existingUrls.add(spaceUrl.toLowerCase());
        platformCount++;
      }
    }
  } catch (err) {
    console.warn('[Ingest] Platform ingestion warning:', err.message);
  }

  // ── C. Ingest Trending Frameworks (GitHub AI Repositories) ──
  try {
    const res = await fetch('https://api.github.com/search/repositories?q=topic:artificial-intelligence+topic:framework&sort=stars&order=desc&per_page=20', { headers });
    if (res.ok) {
      const data = await res.json();
      const repos = data.items || [];
      let fwCount = 0;
      for (const repo of repos) {
        if (fwCount >= maxFrameworks) break;
        const name = repo.name;
        const url = repo.html_url;

        if (isAlreadyPresent(name, url)) continue;
        if ((repo.stargazers_count || 0) < 300) continue;

        const org = repo.owner ? repo.owner.login : 'Open Source';
        const license = repo.license?.spdx_id || 'Open Source';
        const topics = (repo.topics || []).join(' ').toLowerCase();

        let task = "MLOps";
        if (topics.includes('vision')) task = "Computer Vision";
        else if (topics.includes('agent') || topics.includes('llm') || topics.includes('nlp')) task = "NLP";
        else if (topics.includes('code')) task = "AI Coding";
        else if (topics.includes('audio')) task = "Audio";

        const entry = {
          name,
          type: "Framework",
          summary: repo.description ? repo.description.slice(0, 200) : `Open-source AI framework by ${org} for extensible machine learning pipelines.`,
          task,
          license,
          year: new Date().getFullYear(),
          org,
          size: `${Math.round((repo.size || 1024) / 1024)}MB Repo`,
          architecture: `Modular AI codebase with native Python/C++ bindings and distributed workflow support.`,
          usage: `git clone ${repo.html_url}\ncd ${repo.name}\npip install -e .`,
          benchmarks: `GitHub Stars: ${(repo.stargazers_count || 0).toLocaleString()}, Forks: ${(repo.forks_count || 0).toLocaleString()}`,
          limitations: `Requires local Python environment and dependency configuration.`,
          popular: true,
          url,
          citations: [{ text: `${repo.full_name} on GitHub`, url }]
        };

        added.push(entry);
        existingNames.add(name.toLowerCase());
        existingUrls.add(url.toLowerCase());
        fwCount++;
      }
    }
  } catch (err) {
    console.warn('[Ingest] Framework ingestion warning:', err.message);
  }

  // ── D. Ingest Trending Datasets (Hugging Face Datasets) ──
  try {
    const res = await fetch('https://huggingface.co/api/datasets?sort=trendingScore&direction=-1&limit=25', { headers });
    if (res.ok) {
      const datasets = await res.json();
      let dsCount = 0;
      for (const d of datasets) {
        if (dsCount >= maxDatasets) break;
        const dsName = d.id.includes('/') ? d.id.split('/')[1] : d.id;
        const dsUrl = `https://huggingface.co/datasets/${d.id}`;

        if (isAlreadyPresent(dsName, dsUrl)) continue;
        if ((d.likes || 0) < 15 && (d.downloads || 0) < 150) continue;

        const org = d.author || (d.id.includes('/') ? d.id.split('/')[0] : 'Research Community');
        const tags = d.tags || [];
        const licTag = tags.find(t => t.startsWith("license:"));
        const license = licTag ? licTag.replace("license:", "").toUpperCase() : "Open Data";

        let task = "NLP";
        const tagStr = tags.join(' ').toLowerCase();
        if (tagStr.includes('vision') || tagStr.includes('image')) task = "Computer Vision";
        else if (tagStr.includes('audio') || tagStr.includes('speech')) task = "Audio";
        else if (tagStr.includes('code')) task = "AI Coding";
        else if (tagStr.includes('multimodal')) task = "Multimodal";

        const sizeTag = tags.find(t => t.startsWith("size_categories:"));
        const size = sizeTag ? sizeTag.replace("size_categories:", "") : "Curated Dataset";

        const cleanDesc = d.description
          ? d.description.replace(/[\r\n]+/g, ' ').replace(/[#*`]/g, '').slice(0, 180).trim()
          : `High-quality ${task} dataset by ${org} for benchmarking and foundation model training.`;

        const entry = {
          name: dsName,
          type: "Dataset",
          summary: `${cleanDesc} (${(d.likes || 0).toLocaleString()} likes, ${(d.downloads || 0).toLocaleString()} downloads).`,
          task,
          license,
          year: new Date().getFullYear(),
          org,
          size,
          architecture: `Parquet / Arrow structured tabular & tokenized dataset.`,
          usage: `from datasets import load_dataset\n\ndataset = load_dataset("${d.id}")`,
          benchmarks: `Trending Score: ${Math.round(d.trendingScore || 0)}, Likes: ${(d.likes || 0).toLocaleString()}, Downloads: ${(d.downloads || 0).toLocaleString()}`,
          limitations: `Subject to licensing compliance and dataset-specific terms of use.`,
          popular: (d.likes || 0) > 100,
          url: dsUrl,
          citations: [{ text: `${d.id} on Hugging Face Datasets`, url: dsUrl }]
        };

        added.push(entry);
        existingNames.add(dsName.toLowerCase());
        existingUrls.add(dsUrl.toLowerCase());
        dsCount++;
      }
    }
  } catch (err) {
    console.warn('[Ingest] Dataset ingestion warning:', err.message);
  }

  // ── Write newly added items into src/data.ts ──
  if (added.length > 0) {
    const dataPath = path.join(rootDir, 'src', 'data.ts');
    let content = fs.readFileSync(dataPath, 'utf-8');

    const formatted = added.map(entry => '  ' + JSON.stringify(entry, null, 4).replace(/\n/g, '\n  ')).join(',\n');
    const target = /(\r?\n\];\s*\r?\nexport const typeFilters)/;

    if (target.test(content)) {
      content = content.replace(target, `,\n${formatted}$1`);
      fs.writeFileSync(dataPath, content, 'utf-8');
      console.log(`[Ingest] ✨ Added ${added.length} new asset(s) to src/data.ts:`);
      added.forEach(a => console.log(`   • [${a.type}] ${a.name} (${a.org})`));

      // Update tracking metadata
      fs.writeFileSync(path.join(publicDataDir, 'latest_added_model.txt'), added[0].name, 'utf-8');

      const historyPath = path.join(publicDataDir, 'newly_added_models.json');
      let history = [];
      if (fs.existsSync(historyPath)) {
        try { history = JSON.parse(fs.readFileSync(historyPath, 'utf-8')); } catch {}
      }
      history.unshift({
        date: new Date().toISOString().split('T')[0],
        assets: added
      });
      fs.writeFileSync(historyPath, JSON.stringify(history.slice(0, 100), null, 2));
    }
  } else {
    console.log('[Ingest] Catalog is fully up to date; no new external assets ingested today.');
  }

  return added;
}

// 1. Parse catalog data from src/data.ts
function getCatalogStats() {
  try {
    const entries = readRawEntries();

    const byType = {};
    const byTask = {};
    const byLicense = {};
    let popularCount = 0;
    const urls = [];

    for (const e of entries) {
      byType[e.type] = (byType[e.type] || 0) + 1;
      if (e.task) byTask[e.task] = (byTask[e.task] || 0) + 1;
      if (e.license) byLicense[e.license] = (byLicense[e.license] || 0) + 1;
      if (e.popular) popularCount++;
      if (e.url && typeof e.url === 'string' && e.url.startsWith('http')) {
        urls.push({ name: e.name, url: e.url });
      }
    }

    // Select deterministic "AI Tool of the Day"
    const candidates = entries.filter(e => e.popular && e.architecture && e.summary);
    const pool = candidates.length > 0 ? candidates : entries;
    const now = new Date();
    const startOfYear = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
    const dayOfYear = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000));
    const spotlightIndex = dayOfYear % pool.length;
    const toolOfTheDay = pool[spotlightIndex];

    const stats = {
      timestamp: new Date().toISOString(),
      totalEntries: entries.length,
      popularEntries: popularCount,
      byType,
      byTask,
      byLicense,
      toolOfTheDay
    };

    fs.writeFileSync(path.join(publicDataDir, 'catalog_stats.json'), JSON.stringify(stats, null, 2));
    fs.writeFileSync(path.join(publicDataDir, 'tool_of_the_day.json'), JSON.stringify({
      date: now.toISOString().split('T')[0],
      tool: toolOfTheDay
    }, null, 2));
    console.log(`[Stats] Catalog analyzed: ${entries.length} entries. Tool of the Day: "${toolOfTheDay.name}"`);
    return { stats, urls, toolOfTheDay, entries };
  } catch (err) {
    console.error('[Stats] Error analyzing catalog:', err.message);
    return { stats: null, urls: [], toolOfTheDay: null, entries: [] };
  }
}

// 2. Fetch Daily Trending AI Models & Research Papers from Hugging Face
async function fetchTrendingAI() {
  const result = {
    timestamp: new Date().toISOString(),
    models: [],
    papers: []
  };

  const headers = { 'User-Agent': 'AiVerse-PulseBot/2.0' };

  try {
    const res = await fetch('https://huggingface.co/api/models?sort=trendingScore&direction=-1&limit=6', { headers });
    if (res.ok) {
      const data = await res.json();
      result.models = data.map(m => ({
        id: m.id,
        author: m.author || m.id.split('/')[0],
        likes: m.likes || 0,
        downloads: m.downloads || 0,
        pipeline_tag: m.pipeline_tag || 'general',
        url: `https://huggingface.co/${m.id}`
      }));
    }
  } catch (e) {
    console.warn('[Trending] Failed to fetch models:', e.message);
  }

  try {
    const res = await fetch('https://huggingface.co/api/daily_papers?limit=5', { headers });
    if (res.ok) {
      const data = await res.json();
      result.papers = data.map(item => {
        const p = item.paper || item;
        return {
          title: p.title || 'Untitled',
          summary: p.ai_summary || (p.summary ? p.summary.slice(0, 160) + '...' : ''),
          upvotes: p.upvotes || 0,
          arxiv_id: p.id || '',
          url: `https://huggingface.co/papers/${p.id || ''}`,
          githubRepo: p.githubRepo || null
        };
      });
    }
  } catch (e) {
    console.warn('[Trending] Failed to fetch papers:', e.message);
  }

  fs.writeFileSync(path.join(publicDataDir, 'daily_trending.json'), JSON.stringify(result, null, 2));
  console.log(`[Trending] Saved ${result.models.length} trending models & ${result.papers.length} research papers.`);
  return result;
}

// 3. Sample Health Check on Catalog Links
async function checkLinksHealth(urls, sampleSize = 25) {
  const result = {
    timestamp: new Date().toISOString(),
    checked: 0,
    healthy: 0,
    broken: 0,
    issues: []
  };

  if (!urls || urls.length === 0) return result;

  const shuffled = [...urls].sort(() => 0.5 - Math.random());
  const sample = shuffled.slice(0, sampleSize);

  console.log(`[Health] Checking sample of ${sample.length} URLs...`);

  await Promise.all(
    sample.map(async (item) => {
      result.checked++;
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4500);

        let response;
        try {
          response = await fetch(item.url, {
            method: 'HEAD',
            signal: controller.signal,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });
        } catch {
          response = await fetch(item.url, {
            method: 'GET',
            signal: controller.signal,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });
        } finally {
          clearTimeout(timeout);
        }

        if (response && response.status < 400) {
          result.healthy++;
        } else {
          result.broken++;
          result.issues.push({ name: item.name, url: item.url, status: response ? response.status : 'Unknown' });
        }
      } catch (err) {
        result.broken++;
        result.issues.push({ name: item.name, url: item.url, status: err.name === 'AbortError' ? 'Timeout' : 'Network Error' });
      }
    })
  );

  fs.writeFileSync(path.join(publicDataDir, 'links_health.json'), JSON.stringify(result, null, 2));
  console.log(`[Health] Finished link checks: ${result.healthy} healthy, ${result.broken} flagged.`);
  return result;
}

// 4. Security & Dependency Audit
function getSecurityAudit() {
  const result = {
    timestamp: new Date().toISOString(),
    vulnerabilities: { low: 0, moderate: 0, high: 0, critical: 0, total: 0 },
    totalDependencies: 0
  };

  try {
    let output = '';
    try {
      output = execSync('npm audit --json', { cwd: rootDir, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
    } catch (e) {
      output = e.stdout || '';
    }

    if (output) {
      const data = JSON.parse(output);
      if (data.metadata) {
        result.vulnerabilities = data.metadata.vulnerabilities || result.vulnerabilities;
        result.totalDependencies = data.metadata.dependencies?.total || 0;
      }
    }
  } catch (err) {
    console.warn('[Security] Audit warning:', err.message);
  }

  fs.writeFileSync(path.join(publicDataDir, 'security_audit.json'), JSON.stringify(result, null, 2));
  return result;
}

// 5. Generate Markdown Daily Pulse & Update README
function generatePulseDocs(stats, trending, health, security, toolOfTheDay, newlyIngested = []) {
  const today = new Date().toISOString().split('T')[0];
  const timeUtc = new Date().toUTCString();
  const tool = toolOfTheDay || stats?.toolOfTheDay;

  let newItemsSection = '';
  if (newlyIngested && newlyIngested.length > 0) {
    newItemsSection = `## 🆕 Newly Ingested Assets Today (${newlyIngested.length})\n\n`;
    for (const item of newlyIngested) {
      newItemsSection += `### **${item.name}** (\`${item.type}\` • *${item.org}*)\n> ${item.summary}\n\n`;
      newItemsSection += `- 🏷️ **Domain & License**: \`${item.task}\` • \`${item.license}\` (${item.year})\n`;
      newItemsSection += `- ⚡ **Metrics**: \`${item.benchmarks}\`\n`;
      newItemsSection += `- 🔗 **Resource Link**: [${item.url || item.name}](${item.url || '#'})\n\n`;
    }
    newItemsSection += '---\n\n';
  }

  let toolSpotlight = '';
  if (tool) {
    toolSpotlight = `## 🌟 Featured AI Tool of the Day
### **${tool.name}** (\`${tool.type}\` • *${tool.org}*)
> ${tool.summary}

- 🏛️ **Architecture**: ${tool.architecture || 'Proprietary / Undisclosed'}
- ⚡ **Benchmarks**: \`${tool.benchmarks || 'N/A'}\`
- 🏷️ **Domain & License**: \`${tool.task}\` • \`${tool.license || 'Open Source'}\` (Released: ${tool.year})
- 🔗 **Resource Link**: [${tool.url || tool.name}](${tool.url || '#'})

---
`;
  }

  let modelsTable = '| Model | Pipeline | Likes | Downloads | Link |\n| :--- | :--- | :--- | :--- | :--- |\n';
  if (trending.models.length > 0) {
    for (const m of trending.models) {
      modelsTable += `| \`${m.id}\` | ${m.pipeline_tag} | ❤️ ${m.likes.toLocaleString()} | 📥 ${m.downloads.toLocaleString()} | [View](${m.url}) |\n`;
    }
  } else {
    modelsTable += '| *Data unavailable* | - | - | - | - |\n';
  }

  let papersTable = '| Paper | Upvotes | Summary | Link |\n| :--- | :--- | :--- | :--- |\n';
  if (trending.papers.length > 0) {
    for (const p of trending.papers) {
      const cleanSummary = (p.summary || '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
      papersTable += `| **${p.title.replace(/\|/g, '\\|')}** | 👍 ${p.upvotes} | ${cleanSummary} | [Read](${p.url}) |\n`;
    }
  } else {
    papersTable += '| *Data unavailable* | - | - | - |\n';
  }

  const typeBreakdown = stats ? Object.entries(stats.byType).map(([k, v]) => `**${k}s**: ${v}`).join(' • ') : 'N/A';

  const pulseContent = `# ⚡ AiVerse Daily Pulse (${today})

> Automatically generated daily intelligence report syncing top trending AI models, platforms, frameworks, research papers, catalog metrics, and repository health.

*Last Synchronized: \`${timeUtc}\`*

---

${newItemsSection}${toolSpotlight}## 🔥 Today's Top Trending Open AI Models
*Live from Hugging Face Community Trending Scores*

${modelsTable}

---

## 📜 Daily Breakthrough Research Papers
*Top papers curated and upvoted today*

${papersTable}

---

## 📊 AiVerse Catalog Overview
- **Total Registered Assets**: \`${stats ? stats.totalEntries : 'N/A'}\`
- **Featured / Starred Tools**: \`${stats ? stats.popularEntries : 'N/A'}\`
- **Asset Breakdown**: ${typeBreakdown}

---

## 🛡️ Daily System & Ecosystem Health
- **Sample Link Health Check**: \`${health.healthy}/${health.checked}\` healthy verified (\`${health.broken}\` flagged / timed out)
- **Dependency Security**: \`${security.vulnerabilities.total}\` advisories flagged across \`${security.totalDependencies}\` dependencies (\`${security.vulnerabilities.critical}\` critical, \`${security.vulnerabilities.high}\` high)

---
*Generated automatically by GitHub Actions daily pulse workflow.*
`;

  fs.writeFileSync(path.join(rootDir, 'DAILY_PULSE.md'), pulseContent, 'utf-8');
  console.log('[Docs] Updated DAILY_PULSE.md successfully.');

  try {
    const readmePath = path.join(rootDir, 'README.md');
    let readme = fs.readFileSync(readmePath, 'utf-8');

    let newItemsRow = '';
    if (newlyIngested && newlyIngested.length > 0) {
      const summaryList = newlyIngested.map(i => `**${i.name}** (\`${i.type}\`)`).join(', ');
      newItemsRow = `| 🆕 **New Assets Added** | ${summaryList} |\n`;
    }

    const pulseSnippet = `<!-- DAILY_PULSE:START -->
### ⚡ Daily AI Pulse (${today})
| Metric | Status / Count |
| :--- | :--- |
${newItemsRow}| 🌟 **Tool of the Day** | **${tool ? tool.name : 'N/A'}** (${tool ? tool.org : ''}) — [Explore](${tool?.url || '#'}) |
| 🗄️ **Catalog Entries** | **${stats ? stats.totalEntries : 'N/A'}** AI assets tracked (${stats ? stats.popularEntries : 'N/A'} featured) |
| 🔥 **Top Trending Model** | [${trending.models[0]?.id || 'N/A'}](${trending.models[0]?.url || '#'}) |
| 📜 **Top Daily Paper** | [${trending.papers[0]?.title?.slice(0, 50) || 'N/A'}...](${trending.papers[0]?.url || '#'}) |
| 🛡️ **Catalog Links Checked** | **${health.healthy}/${health.checked}** operational |
| 🕒 **Last Daily Run** | \`${timeUtc}\` |

*Full daily metrics and paper summaries available in [DAILY_PULSE.md](DAILY_PULSE.md).*
<!-- DAILY_PULSE:END -->`;

    if (readme.includes('<!-- DAILY_PULSE:START -->') && readme.includes('<!-- DAILY_PULSE:END -->')) {
      readme = readme.replace(
        /<!-- DAILY_PULSE:START -->[\s\S]*?<!-- DAILY_PULSE:END -->/,
        pulseSnippet
      );
      fs.writeFileSync(readmePath, readme, 'utf-8');
      console.log('[Docs] Updated README.md daily pulse section.');
    } else {
      const regex = /(## ✨ Features\r?\n)/;
      if (regex.test(readme)) {
        readme = readme.replace(regex, `$1\n${pulseSnippet}\n\n`);
        fs.writeFileSync(readmePath, readme, 'utf-8');
        console.log('[Docs] Added daily pulse section to README.md.');
      }
    }
  } catch (err) {
    console.warn('[Docs] Failed to update README:', err.message);
  }
}

async function run() {
  console.log('🚀 Running AiVerse Daily Pulse & Multi-Category Ingestion...');
  
  // Auto-ingest new Model, Platform, Framework, and Dataset
  const newlyIngested = await ingestNewAssets({
    maxModels: 1,
    maxPlatforms: 1,
    maxFrameworks: 1,
    maxDatasets: 1
  });

  const { stats, urls, toolOfTheDay, entries } = getCatalogStats();
  
  // Update SQL seed file
  updateSeedSql(entries);

  // Sync newly ingested items directly to Supabase
  if (newlyIngested.length > 0) {
    await syncToSupabase(newlyIngested);
  }

  const trending = await fetchTrendingAI();
  const health = await checkLinksHealth(urls, 25);
  const security = getSecurityAudit();
  generatePulseDocs(stats, trending, health, security, toolOfTheDay, newlyIngested);
  console.log('✨ Daily Pulse completed successfully!');
}

run();
