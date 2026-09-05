import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDataDir = path.join(rootDir, 'public', 'data');

if (!fs.existsSync(publicDataDir)) {
  fs.mkdirSync(publicDataDir, { recursive: true });
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

// 0. Auto-Ingest New Trending Models from Hugging Face
async function ingestNewModels(maxToIngest = 1) {
  const added = [];
  try {
    const existingEntries = readRawEntries();
    const existingNames = new Set(existingEntries.map(e => (e.name || '').toLowerCase().trim()));
    const existingUrls = new Set(existingEntries.map(e => (e.url || '').toLowerCase().trim()));

    const res = await fetch('https://huggingface.co/api/models?sort=trendingScore&direction=-1&limit=15', {
      headers: { 'User-Agent': 'AiVerse-PulseBot/1.0' }
    });

    if (!res.ok) return added;
    const models = await res.json();

    for (const m of models) {
      if (added.length >= maxToIngest) break;
      const modelName = m.id.includes('/') ? m.id.split('/')[1] : m.id;
      const modelUrl = `https://huggingface.co/${m.id}`;

      // Skip if already in catalog
      if (existingNames.has(modelName.toLowerCase()) || existingUrls.has(modelUrl.toLowerCase())) {
        continue;
      }

      // Must have traction
      if ((m.likes || 0) < 30 && (m.downloads || 0) < 300) {
        continue;
      }

      // Map task
      let task = "NLP";
      const p = m.pipeline_tag || "";
      if (p.includes("image-text") || p.includes("multimodal")) task = "Multimodal";
      else if (p.includes("text-to-image") || p.includes("image-generation")) task = "Image Generation";
      else if (p.includes("text-to-video") || p.includes("video")) task = "Video Generation";
      else if (p.includes("audio") || p.includes("speech") || p.includes("voice")) task = "Audio";
      else if (p.includes("code")) task = "AI Coding";
      else if (p.includes("vision")) task = "Computer Vision";

      // Extract license
      let license = "Open Weights";
      const tags = m.tags || [];
      const licTag = tags.find(t => t.startsWith("license:"));
      if (licTag) {
        license = licTag.replace("license:", "").toUpperCase();
      }

      // Extract size
      const sizeMatch = modelName.match(/(\d+(\.\d+)?[BMKbmk]|\d+x\d+[BMKbmk])/);
      const size = sizeMatch ? `${sizeMatch[0].toUpperCase()} params` : "Open Weights";

      // Clean author/org
      const rawAuthor = m.author || (m.id.includes('/') ? m.id.split('/')[0] : 'Open Source');
      let org = rawAuthor;
      if (rawAuthor.toLowerCase() === 'deepseek-ai') org = 'DeepSeek';
      else if (rawAuthor.toLowerCase() === 'qwen') org = 'Alibaba (Qwen)';
      else if (rawAuthor.toLowerCase() === 'meta-llama') org = 'Meta AI';
      else if (rawAuthor.toLowerCase() === 'mistralai') org = 'Mistral AI';
      else if (rawAuthor.toLowerCase() === 'microsoft') org = 'Microsoft';
      else if (rawAuthor.toLowerCase() === 'google') org = 'Google';
      else if (rawAuthor.toLowerCase() === 'zai-org') org = 'Zhipu AI';

      const newEntry = {
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
        citations: [
          {
            text: `${m.id} on Hugging Face`,
            url: modelUrl
          }
        ]
      };

      added.push(newEntry);
    }

    if (added.length > 0) {
      const dataPath = path.join(rootDir, 'src', 'data.ts');
      let content = fs.readFileSync(dataPath, 'utf-8');

      const formatted = added.map(entry => '  ' + JSON.stringify(entry, null, 4).replace(/\n/g, '\n  ')).join(',\n');
      const target = /(\r?\n\];\s*\r?\nexport const typeFilters)/;

      if (target.test(content)) {
        content = content.replace(target, `,\n${formatted}$1`);
        fs.writeFileSync(dataPath, content, 'utf-8');
        console.log(`[Ingest] ✨ Automatically added ${added.length} new model(s) to src/data.ts: ${added.map(a => a.name).join(', ')}`);
        
        fs.writeFileSync(path.join(publicDataDir, 'latest_added_model.txt'), added[0].name, 'utf-8');

        const historyPath = path.join(publicDataDir, 'newly_added_models.json');
        let history = [];
        if (fs.existsSync(historyPath)) {
          try { history = JSON.parse(fs.readFileSync(historyPath, 'utf-8')); } catch {}
        }
        history.unshift({
          date: new Date().toISOString().split('T')[0],
          models: added
        });
        fs.writeFileSync(historyPath, JSON.stringify(history.slice(0, 50), null, 2));
      }
    }
  } catch (err) {
    console.warn('[Ingest] Model ingestion check error:', err.message);
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
    return { stats, urls, toolOfTheDay };
  } catch (err) {
    console.error('[Stats] Error analyzing catalog:', err.message);
    return { stats: null, urls: [], toolOfTheDay: null };
  }
}

// 2. Fetch Daily Trending AI Models & Research Papers from Hugging Face
async function fetchTrendingAI() {
  const result = {
    timestamp: new Date().toISOString(),
    models: [],
    papers: []
  };

  const headers = { 'User-Agent': 'AiVerse-PulseBot/1.0' };

  // Fetch Trending Models
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

  // Fetch Daily Papers
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

  // Shuffle and pick a rotation sample to keep checks fast & polite
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
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
          });
        } catch {
          // Some servers reject HEAD, fallback to GET
          response = await fetch(item.url, {
            method: 'GET',
            signal: controller.signal,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
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
      // npm audit exits with code > 0 when vulnerabilities are found
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
  console.log(`[Security] Audit recorded: ${result.vulnerabilities.total} advisories detected across ${result.totalDependencies} dependencies.`);
  return result;
}

// 5. Generate Markdown Daily Pulse & Update README
function generatePulseDocs(stats, trending, health, security, toolOfTheDay, newlyIngested = []) {
  const today = new Date().toISOString().split('T')[0];
  const timeUtc = new Date().toUTCString();
  const tool = toolOfTheDay || stats?.toolOfTheDay;

  // Newly Ingested Model Section
  let newModelSection = '';
  if (newlyIngested && newlyIngested.length > 0) {
    const nm = newlyIngested[0];
    newModelSection = `## 🆕 Newly Ingested AI Model Today
### **${nm.name}** (\`${nm.type}\` • *${nm.org}*)
> ${nm.summary}

- 🏷️ **Domain & License**: \`${nm.task}\` • \`${nm.license}\` (${nm.year})
- ⚡ **Metrics**: \`${nm.benchmarks}\`
- 🔗 **Resource Link**: [${nm.url || nm.name}](${nm.url || '#'})

---
`;
  }

  // AI Tool of the Day spotlight markdown
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

  // Top trending models table
  let modelsTable = '| Model | Pipeline | Likes | Downloads | Link |\n| :--- | :--- | :--- | :--- | :--- |\n';
  if (trending.models.length > 0) {
    for (const m of trending.models) {
      modelsTable += `| \`${m.id}\` | ${m.pipeline_tag} | ❤️ ${m.likes.toLocaleString()} | 📥 ${m.downloads.toLocaleString()} | [View](${m.url}) |\n`;
    }
  } else {
    modelsTable += '| *Data unavailable* | - | - | - | - |\n';
  }

  // Top daily papers table
  let papersTable = '| Paper | Upvotes | Summary | Link |\n| :--- | :--- | :--- | :--- |\n';
  if (trending.papers.length > 0) {
    for (const p of trending.papers) {
      const cleanSummary = (p.summary || '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
      papersTable += `| **${p.title.replace(/\|/g, '\\|')}** | 👍 ${p.upvotes} | ${cleanSummary} | [Read](${p.url}) |\n`;
    }
  } else {
    papersTable += '| *Data unavailable* | - | - | - |\n';
  }

  // Catalog breakdown
  const typeBreakdown = stats ? Object.entries(stats.byType).map(([k, v]) => `**${k}s**: ${v}`).join(' • ') : 'N/A';

  const pulseContent = `# ⚡ AiVerse Daily Pulse (${today})

> Automatically generated daily intelligence report syncing top trending AI models, research papers, catalog metrics, and repository health.

*Last Synchronized: \`${timeUtc}\`*

---

${newModelSection}
${toolSpotlight}
## 🔥 Today's Top Trending Open AI Models
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

  // Write to DAILY_PULSE.md
  fs.writeFileSync(path.join(rootDir, 'DAILY_PULSE.md'), pulseContent, 'utf-8');
  console.log('[Docs] Updated DAILY_PULSE.md successfully.');

  // Update README.md between markers if they exist
  try {
    const readmePath = path.join(rootDir, 'README.md');
    let readme = fs.readFileSync(readmePath, 'utf-8');

    let newModelRow = '';
    if (newlyIngested && newlyIngested.length > 0) {
      newModelRow = `| 🆕 **New Model Added** | **${newlyIngested[0].name}** (${newlyIngested[0].org}) — [Explore](${newlyIngested[0].url}) |\n`;
    }

    const pulseSnippet = `<!-- DAILY_PULSE:START -->
### ⚡ Daily AI Pulse (${today})
| Metric | Status / Count |
| :--- | :--- |
${newModelRow}| 🌟 **Tool of the Day** | **${tool ? tool.name : 'N/A'}** (${tool ? tool.org : ''}) — [Explore](${tool?.url || '#'}) |
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
      // Insert after Features section
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
  console.log('🚀 Running AiVerse Daily Pulse...');
  
  // Auto-ingest 1 new trending model per day
  const newlyIngested = await ingestNewModels(1);

  const { stats, urls, toolOfTheDay } = getCatalogStats();
  const trending = await fetchTrendingAI();
  const health = await checkLinksHealth(urls, 25);
  const security = getSecurityAudit();
  generatePulseDocs(stats, trending, health, security, toolOfTheDay, newlyIngested);
  console.log('✨ Daily Pulse completed successfully!');
}

run();
