import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';
import { createClient } from '@supabase/supabase-js';

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

  let entries: { name: string; type: string; task?: string; url?: string }[] = [];
  if (supabase) {
    const { data, error } = await supabase
      .from('entries')
      .select('name, type, task, url')
      .eq('approved', true)
      .order('created_at', { ascending: false });
    if (!error && data) entries = data;
  }

  const context = entries
    .map((e) => `- **${e.name}** (${e.type}, ${e.task || 'General'})${e.url ? ` - URL: ${e.url}` : ''}`)
    .join('\n');

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
      : `You are Vox, an AI assistant strictly dedicated to the AiVerse encyclopedia. ${nameStr} You MUST REFUSE to answer any questions that are not related to Artificial Intelligence, machine learning, AI models, datasets, or the AiVerse platform itself. If a user asks about coding (like Rust loops, general web dev, etc. unless specifically about AI frameworks like PyTorch), general trivia, or off-topic subjects, politely decline and steer the conversation back to AI models and technologies.\n\nHere is the current catalog of AI items available in the AiVerse database:\n${catalogContext || 'No catalog provided'}\n\nUse this catalog to inform your answers. If someone asks what models are available or asks for recommendations, draw from this list.\n\nCRITICAL INSTRUCTION:\nYou MUST ONLY recommend or mention models and tools that are explicitly listed in the catalog above. Do NOT hallucinate or mention any models outside of this catalog under any circumstances.\n\nIMPORTANT RESPONSE GUIDELINES:\n1. **ORGANIZE CLEARLY**: Provide clean, highly structured, and refined responses. Use bullet points and paragraphs effectively to break up the text.\n2. Use **bold text** for all AI model and tool names so they stand out in blue. Format them exactly like this: **Model Name**.\n3. **INCLUDE LINKS**: If a URL is provided in the catalog for an item, you MUST include it in your response formatted exactly like this: [Official Website](URL). Place the link naturally after the model name or at the end of its summary.`;

    const systemPrompt = {
      role: 'system',
      content: systemPromptContent,
    };

    // Supported models mapping to ensure we only send valid model strings to Groq
    const VALID_MODELS = [
      'openai/gpt-oss-20b',
      'openai/gpt-oss-120b',
      'qwen/qwen3.6-27b',
      'groq/compound',
      'groq/compound-mini',
      'allam-2-7b'
    ];

    const modelToUse = VALID_MODELS.includes(model) ? model : 'openai/gpt-oss-20b';

    let finalMessages = [systemPrompt, ...sanitizedMessages];

    // DeepSeek R1 models on Groq do not support the 'system' role.
    // If using DeepSeek, we merge the system instructions into the first user message instead.
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
