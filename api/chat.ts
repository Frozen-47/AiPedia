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

const CATALOG_CACHE_TTL_MS = 5 * 60 * 1000;
let catalogCache: { context: string; at: number } | null = null;

async function getCatalogContext(): Promise<string> {
  if (catalogCache && Date.now() - catalogCache.at < CATALOG_CACHE_TTL_MS) {
    return catalogCache.context;
  }

  const entriesMap = new Map<string, any>();

  // Always seed with the 227 comprehensive static entries
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

  const allEntries = Array.from(entriesMap.values());

  const context = allEntries
    .map((e) => {
      const parts = [
        `- **${e.name}** [Type: ${e.type} | Task: ${e.task || 'General'}] (Org: ${e.org || 'Open Source'}, Year: ${e.year || 'Recent'})`,
        `  Summary: ${e.summary}`,
      ];
      if (e.benchmarks && e.benchmarks !== 'N/A') {
        parts.push(`  Key Benchmarks: ${e.benchmarks}`);
      }
      if (e.architecture && e.architecture !== 'N/A') {
        parts.push(`  Architecture: ${e.architecture}`);
      }
      if (e.url) {
        parts.push(`  URL: ${e.url}`);
      }
      return parts.join('\n');
    })
    .join('\n\n');

  catalogCache = { context, at: Date.now() };
  return context;
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

    const catalogContext = await getCatalogContext();

    const nameStr = userName ? `The user's name is ${userName}. Greet them or address them by this name occasionally to be polite and personal.` : '';

    const systemPromptContent = systemInstruction && typeof systemInstruction === 'string'
      ? systemInstruction
      : `You are Vox, an AI assistant and expert encyclopedia curator strictly dedicated to the AiVerse platform. ${nameStr} You MUST REFUSE to answer any questions that are not related to Artificial Intelligence, machine learning, AI models, frameworks, platforms, datasets, or the AiVerse platform itself. If a user asks about off-topic subjects, politely decline and steer the conversation back to AI technologies.\n\nHere is the complete, current catalog of AI items available in the AiVerse encyclopedia (${staticEntries.length}+ entries):\n${catalogContext || 'No catalog provided'}\n\nUse this comprehensive catalog to answer user questions, explain technical architectures, compare models, and give recommendations.\n\nCRITICAL INSTRUCTIONS:\n1. **ACCURACY & CATALOG GROUNDING**: When answering questions about models, frameworks, datasets, and AI platforms, rely on the detailed technical facts, benchmarks, and architectures provided in the catalog.\n2. **ORGANIZE CLEARLY**: Provide clean, highly structured, and refined responses. Use bullet points, bold headers, and short paragraphs effectively.\n3. **HIGHLIGHT ENTITY NAMES**: Use **bold text** for all AI entity names (e.g. **DeepSeek-R1**, **Llama 3.3 (70B)**, **LangGraph**, **FLUX.1 Schnell**, **Cursor**).\n4. **INCLUDE LINKS**: If a URL is available for an item in the catalog, include it formatted exactly as [Official Website](URL) or [Documentation](URL) naturally with the item.`;

    const systemPrompt = {
      role: 'system',
      content: systemPromptContent,
    };

    // Supported models mapping on Groq
    const VALID_MODELS = [
      'llama-3.3-70b-versatile',
      'llama-3.1-8b-instant',
      'deepseek-r1-distill-llama-70b',
      'mixtral-8x7b-32768',
      'gemma2-9b-it',
      'openai/gpt-oss-20b',
      'openai/gpt-oss-120b',
      'qwen/qwen3.6-27b',
      'groq/compound',
      'groq/compound-mini',
      'allam-2-7b'
    ];

    const modelToUse = VALID_MODELS.includes(model) ? model : 'llama-3.3-70b-versatile';

    let finalMessages = [systemPrompt, ...sanitizedMessages];

    // DeepSeek R1 models on Groq do not support the 'system' role.
    if (modelToUse.toLowerCase().includes('deepseek')) {
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
      model: modelToUse,
      temperature: 0.5,
      max_tokens: 1024,
    });

    const responseContent = chatCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    res.status(200).json({ content: responseContent });
  } catch (error: any) {
    console.error("Groq API Error:", error);
    res.status(500).json({ content: `Backend Error: ${error.message}` });
  }
}

