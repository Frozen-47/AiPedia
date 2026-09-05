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

// 1. Parse catalog data from src/data.ts
function getCatalogStats() {
  try {
    const dataPath = path.join(rootDir, 'src', 'data.ts');
    const content = fs.readFileSync(dataPath, 'utf-8');
    const jsContent = content
      .replace(/import type .*?;/g, '')
      .replace(/export const entries: Entry\[\] =/g, 'const entries =')
      .replace(/export const /g, 'const ') + '\nreturn entries;';

    const getEntries = new Function(jsContent);
    const entries = getEntries();

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

    const stats = {
      timestamp: new Date().toISOString(),
      totalEntries: entries.length,
      popularEntries: popularCount,
      byType,
      byTask,
      byLicense
    };

    fs.writeFileSync(path.join(publicDataDir, 'catalog_stats.json'), JSON.stringify(stats, null, 2));
    console.log(`[Stats] Catalog analyzed: ${entries.length} entries.`);
    return { stats, urls };
  } catch (err) {
    console.error('[Stats] Error analyzing catalog:', err.message);
    return { stats: null, urls: [] };
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
function generatePulseDocs(stats, trending, health, security) {
  const today = new Date().toISOString().split('T')[0];
  const timeUtc = new Date().toUTCString();

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

    const pulseSnippet = `<!-- DAILY_PULSE:START -->
### ⚡ Daily AI Pulse (${today})
| Metric | Status / Count |
| :--- | :--- |
| 🗄️ **Catalog Entries** | **${stats ? stats.totalEntries : 'N/A'}** AI assets tracked (${stats ? stats.popularEntries : 'N/A'} featured) |
| 🔥 **Top Trending Model** | [${trending.models[0]?.id || 'N/A'}](${trending.models[0]?.url || '#'}) |
| 📜 **Top Daily Paper** | [${trending.papers[0]?.title?.slice(0, 60) || 'N/A'}...](${trending.papers[0]?.url || '#'}) |
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
  const { stats, urls } = getCatalogStats();
  const trending = await fetchTrendingAI();
  const health = await checkLinksHealth(urls, 25);
  const security = getSecurityAudit();
  generatePulseDocs(stats, trending, health, security);
  console.log('✨ Daily Pulse completed successfully!');
}

run();
