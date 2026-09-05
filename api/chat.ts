import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';
import { createClient } from '@supabase/supabase-js';
import { entries as staticEntries } from '../src/data';

// Initialize Groq client with environment variable
// Vercel securely injects this at runtime
const groqApiKey = process.env.GROQ_API_KEY;
const groq = groqApiKey ? new Groq({ apiKey: groqApiKey }) : null;

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

async function getCatalogEntries(): Promise<any[]> {
  const entriesMap = new Map<string, any>();

  // Always seed with the static entries
  for (const e of staticEntries) {
    entriesMap.set(e.name.toLowerCase().trim(), e);
  }

  // Overlay any newer or approved items from Supabase if available
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        for (const item of data) {
          entriesMap.set(item.name.toLowerCase().trim(), item);
        }
      }
    } catch (err) {
      console.warn('Supabase catalog fetch fallback to static entries:', err);
    }
  }

  return Array.from(entriesMap.values());
}

function getRelevantCatalogContext(query: string, allEntries: any[]): string {
  const queryLower = (query || "").toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter((w) => w.length > 2);

  const scored = allEntries.map((e) => {
    let score = 0;
    const nameLower = e.name.toLowerCase();
    const taskLower = (e.task || "").toLowerCase();
    const orgLower = (e.org || "").toLowerCase();
    const summaryLower = (e.summary || "").toLowerCase();

    if (queryLower.includes(nameLower)) score += 50;

    for (const w of queryWords) {
      if (nameLower.includes(w)) score += 10;
      if (taskLower.includes(w)) score += 4;
      if (orgLower.includes(w)) score += 3;
      if (summaryLower.includes(w)) score += 1;
    }
    return { entry: e, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const top = scored.filter((s) => s.score > 0).slice(0, 10).map((s) => s.entry);
  const selected = top.length > 0 ? top : allEntries.slice(0, 6);

  return selected
    .map((e) => {
      const parts = [
        `- **${e.name}** [Type: ${e.type} | Task: ${e.task || 'General'}] (Org: ${e.org || 'Open Source'}, Year: ${e.year || 'Recent'})`,
        `  Summary: ${e.summary}`,
      ];
      if (e.benchmarks && e.benchmarks !== 'N/A') parts.push(`  Key Benchmarks: ${e.benchmarks}`);
      if (e.architecture && e.architecture !== 'N/A') parts.push(`  Architecture: ${e.architecture}`);
      if (e.url) parts.push(`  URL: ${e.url}`);
      return parts.join('\n');
    })
    .join('\n\n');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!groq) {
    return res.status(500).json({
      content: 'Server configuration error: GROQ_API_KEY is not set in Vercel environment variables.'
    });
  }

  try {
    const { messages, userName, model, systemInstruction } = req.body;

    if (model === 'list-models-diagnostic') {
      try {
        const list = await groq.models.list();
        return res.status(200).json({ content: JSON.stringify(list.data.map(m => m.id)) });
      } catch (err: any) {
        return res.status(500).json({ error: `Diagnostic failed: ${err.message}` });
      }
    }

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request: messages array is required.' });
    }

    // Sanitize messages to remove UI-specific properties like 'isTyping'
    const sanitizedMessages = messages.map(({ role, content }) => ({ role, content }));

    const userMessages = sanitizedMessages.filter(m => m.role === 'user');
    const latestUserQuery = userMessages.length > 0 ? userMessages[userMessages.length - 1].content : '';

    const allEntries = await getCatalogEntries();
    const catalogContext = getRelevantCatalogContext(latestUserQuery, allEntries);

    const nameStr = userName ? `The user's name is ${userName}. Greet them or address them by this name occasionally to be polite and personal.` : '';

    const systemPromptContent = systemInstruction && typeof systemInstruction === 'string'
      ? systemInstruction
      : `You are Vox, an AI assistant and expert encyclopedia curator strictly dedicated to the AiVerse platform. ${nameStr} You MUST REFUSE to answer any questions that are not related to Artificial Intelligence, machine learning, AI models, frameworks, platforms, datasets, or the AiVerse platform itself. If a user asks about off-topic subjects, politely decline and steer the conversation back to AI technologies.\n\nHere are relevant AI items from the AiVerse encyclopedia (${allEntries.length}+ total indexed entries):\n${catalogContext || 'No catalog items found'}\n\nUse these technical facts, architectures, and benchmarks to accurately answer questions and offer comparisons.\n\nCRITICAL INSTRUCTIONS:\n1. **ACCURACY & CATALOG GROUNDING**: Rely on facts, benchmarks, and architectures provided in the catalog.\n2. **ORGANIZE CLEARLY**: Provide clean, highly structured responses with bullet points and bold headers.\n3. **HIGHLIGHT ENTITY NAMES**: Use **bold text** for AI entity names (e.g. **DeepSeek-R1**, **Llama 3.3 (70B)**, **LangGraph**, **FLUX.1 Schnell**, **Cursor**).\n4. **INCLUDE LINKS**: If a URL is available in the catalog, format as [Official Website](URL) or [Documentation](URL).`;

    const systemPrompt = {
      role: 'system',
      content: systemPromptContent,
    };

    // Priority list of models to try
    const FALLBACK_MODELS = [
      'qwen/qwen3.8-27b',
      'qwen/qwen3.6-27b',
      'groq/compound-mini',
      'groq/compound',
      'llama-3.3-70b-versatile',
      'llama-3.1-8b-instant',
      'openai/gpt-oss-120b',
      'openai/gpt-oss-20b',
      'allam-2-7b'
    ];

    // If a specific model is requested and in the list, try it first
    const candidates = model && FALLBACK_MODELS.includes(model)
      ? [model, ...FALLBACK_MODELS.filter(m => m !== model)]
      : FALLBACK_MODELS;

    let responseContent: string | null = null;
    let lastError: any = null;

    for (const currentModel of candidates) {
      try {
        let finalMessages: any[] = [systemPrompt, ...sanitizedMessages];

        // DeepSeek models on Groq do not support the 'system' role
        if (currentModel.toLowerCase().includes('deepseek')) {
          const firstUserIndex = sanitizedMessages.findIndex(m => m.role === 'user');
          if (firstUserIndex !== -1) {
            const mergedMessages = [...sanitizedMessages];
            mergedMessages[firstUserIndex] = {
              role: 'user',
              content: `${systemPromptContent}\n\n[Instructions Above. User Query Below]\n${sanitizedMessages[firstUserIndex].content}`
            };
            finalMessages = mergedMessages;
          } else {
            finalMessages = sanitizedMessages;
          }
        }

        const chatCompletion = await groq.chat.completions.create({
          messages: finalMessages,
          model: currentModel,
          temperature: 0.5,
          max_tokens: 1024,
        });

        let rawContent = chatCompletion.choices[0]?.message?.content || "";
        // Clean any <think>...</think> reasoning tags if present
        rawContent = rawContent.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

        if (rawContent) {
          responseContent = rawContent;
          break;
        }
      } catch (err: any) {
        console.warn(`Groq model ${currentModel} failed:`, err.message);
        lastError = err;
        // Continue to next candidate model
      }
    }

    if (!responseContent) {
      throw lastError || new Error("All AI models currently unavailable. Please try again in a moment.");
    }

    res.status(200).json({ content: responseContent });
  } catch (error: any) {
    console.error("Groq API Error:", error);
    res.status(500).json({ content: `Backend Error: ${error.message}` });
  }
}

