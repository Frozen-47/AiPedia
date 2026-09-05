import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';
import { createClient } from '@supabase/supabase-js';

// Safe environment variable initializers
const getGroqClient = () => {
  const key = process.env.GROQ_API_KEY;
  if (!key) return null;
  try {
    return new Groq({ apiKey: key });
  } catch (err) {
    console.error('Failed to initialize Groq client:', err);
    return null;
  }
};

const getSupabaseClient = () => {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  try {
    return createClient(url, key);
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
};

// Curated flagship items for instant fallback if database is unreachable
const FALLBACK_ENTRIES = [
  {
    name: "Gemini 2.0 Flash",
    type: "Model",
    task: "Multimodal",
    org: "Google DeepMind",
    year: 2024,
    summary: "Google's high-speed, agentic multimodal model delivering sub-second latency, native tool execution, and audio/video streaming at scale.",
    benchmarks: "2x faster Time To First Token (TTFT) compared to Gemini 1.5 Flash, MMLU-Pro: 78.5%, MathVista: 68.3%",
    architecture: "Natively Multimodal Mixture-of-Experts (MoE) with 1M token context window.",
    url: "https://deepmind.google/technologies/gemini/"
  },
  {
    name: "DeepSeek-V3",
    type: "Model",
    task: "NLP",
    org: "DeepSeek",
    year: 2024,
    summary: "Flagship 671B Mixture-of-Experts model with Multi-head Latent Attention (MLA), activating 37B params per token with industry-leading efficiency.",
    benchmarks: "MMLU-Redux: 89.1%, HumanEval: 90.2%, MATH-500: 75.7%",
    architecture: "Multi-head Latent Attention (MLA) + DeepSeekMoE + FP8 Mixed Precision Training.",
    url: "https://www.deepseek.com"
  },
  {
    name: "DeepSeek-R1",
    type: "Model",
    task: "NLP",
    org: "DeepSeek",
    year: 2025,
    summary: "Open-weights reasoning model trained via large-scale reinforcement learning without supervised fine-tuning, rivaling top proprietary reasoning models.",
    benchmarks: "AIME 2024: 79.8%, MATH-500: 97.3%, Codeforces: 96.3 percentile",
    architecture: "DeepSeek-V3 Base + Large-scale Multi-Stage RL with self-verification reasoning.",
    url: "https://www.deepseek.com"
  },
  {
    name: "Llama 3.3 (70B)",
    type: "Model",
    task: "NLP",
    org: "Meta AI",
    year: 2024,
    summary: "High-efficiency open-weights model delivering performance on par with previous 405B models at a fraction of the compute cost.",
    benchmarks: "MMLU: 88.6%, MATH: 70.0%, HumanEval: 89.0%",
    architecture: "Dense transformer decoder trained on 15T+ tokens with 128K context window.",
    url: "https://llama.meta.com/"
  },
  {
    name: "Llama 3.1 (405B)",
    type: "Model",
    task: "NLP",
    org: "Meta AI",
    year: 2024,
    summary: "First open model to rival top proprietary models across general knowledge, steerability, math, tool use, and multilingual translation.",
    benchmarks: "MMLU: 88.6%, HumanEval: 89.0%, MATH: 73.8%",
    architecture: "Optimized transformer decoder trained on 15T tokens with 128K context.",
    url: "https://llama.meta.com/"
  },
  {
    name: "Claude 3.7 Sonnet",
    type: "Model",
    task: "Multimodal",
    org: "Anthropic",
    year: 2025,
    summary: "First hybrid reasoning model combining instant response generation with adjustable chain-of-thought thinking for complex tasks.",
    benchmarks: "SWE-bench Verified: 70.3%, TAU-bench: 81.2%, GPQA Diamond: 68.2%",
    architecture: "Hybrid Reasoning Transformer with dynamic thought budgets.",
    url: "https://www.anthropic.com"
  },
  {
    name: "Qwen 2.5-Coder (32B)",
    type: "Model",
    task: "AI Coding",
    org: "Alibaba Cloud",
    year: 2024,
    summary: "Open-source coding model rivaling GPT-4o on code generation, debugging, and repository understanding.",
    benchmarks: "HumanEval: 92.7%, EvalPlus: 89.6%, MultiPL-E: 84.5%",
    architecture: "Dense autoregressive decoder with 128K context and RoPE.",
    url: "https://github.com/QwenLM/Qwen2.5-Coder"
  },
  {
    name: "FLUX.1 Schnell",
    type: "Model",
    task: "Computer Vision",
    org: "Black Forest Labs",
    year: 2024,
    summary: "12B parameter rectified flow transformer for ultra-fast photorealistic text-to-image generation in 1 to 4 steps.",
    benchmarks: "Outperforms SDXL and Midjourney v6 on prompt adherence and typography.",
    architecture: "12B parameter multimodal diffusion transformer (MMDiT) with flow matching.",
    url: "https://blackforestlabs.ai"
  },
  {
    name: "LangGraph",
    type: "Framework",
    task: "MLOps",
    org: "LangChain",
    year: 2024,
    summary: "Library for building stateful, multi-actor applications with LLMs using cyclical graph topologies.",
    benchmarks: "Industry standard for resilient cyclical agent workflows and human-in-the-loop validation.",
    architecture: "State graph execution engine with PostgreSQL and Redis state checkpointing.",
    url: "https://github.com/langchain-ai/langgraph"
  },
  {
    name: "Unsloth",
    type: "Framework",
    task: "MLOps",
    org: "Unsloth AI",
    year: 2024,
    summary: "Ultra-fast open-source LLM fine-tuning library providing 2-5x faster training with up to 80% less VRAM consumption.",
    benchmarks: "5x faster fine-tuning on Llama 3 and Mistral with 0% accuracy loss.",
    architecture: "Custom Triton GPU kernels and manual backprop derivation for attention mechanisms.",
    url: "https://github.com/unslothai/unsloth"
  },
  {
    name: "GroqCloud",
    type: "Platform",
    task: "General",
    org: "Groq",
    year: 2024,
    summary: "Developer platform offering high-throughput serverless AI inference powered by custom LPU silicon delivering 500+ tokens/sec.",
    benchmarks: "500+ tokens/sec on Llama 3 8B, 250+ tokens/sec on Llama 3 70B.",
    architecture: "Tensor Streaming Processor (TSP) architecture with deterministic execution.",
    url: "https://groq.com"
  },
  {
    name: "Gemma 2 (27B)",
    type: "Model",
    task: "NLP",
    org: "Google DeepMind",
    year: 2024,
    summary: "Class-leading lightweight open model built on Gemini research, outperforming models twice its parameter size.",
    benchmarks: "MMLU: 81.5%, HumanEval: 71.5%",
    architecture: "Transformer decoder with sliding window attention and soft-capping.",
    url: "https://ai.google.dev/gemma"
  }
];

// In-memory catalog cache for Supabase entries
let cachedEntries: any[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 5 * 60 * 1000;

async function getCatalogEntries(): Promise<any[]> {
  if (cachedEntries && Date.now() - cacheTimestamp < CACHE_TTL_MS) {
    return cachedEntries;
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        cachedEntries = data;
        cacheTimestamp = Date.now();
        return data;
      }
    } catch (err) {
      console.warn('Supabase fetch fallback to embedded catalog:', err);
    }
  }

  return FALLBACK_ENTRIES;
}

function getRelevantCatalogContext(query: string, allEntries: any[]): string {
  const queryLower = (query || "").toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter((w) => w.length > 2);

  const scored = allEntries.map((e) => {
    let score = 0;
    const nameLower = (e.name || "").toLowerCase();
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
  // Always ensure JSON header
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const groq = getGroqClient();
  if (!groq) {
    return res.status(200).json({
      content: '⚠️ **Groq API Key Required**: Please configure your `GROQ_API_KEY` in your Vercel Project Settings (Environment Variables) to enable Vox live intelligence.'
    });
  }

  try {
    const { messages, userName, model, systemInstruction } = req.body || {};

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request: messages array is required.' });
    }

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

    const candidates = model && FALLBACK_MODELS.includes(model)
      ? [model, ...FALLBACK_MODELS.filter(m => m !== model)]
      : FALLBACK_MODELS;

    let responseContent: string | null = null;
    let lastError: any = null;

    for (const currentModel of candidates) {
      try {
        let finalMessages: any[] = [systemPrompt, ...sanitizedMessages];

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
        rawContent = rawContent.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

        if (rawContent) {
          responseContent = rawContent;
          break;
        }
      } catch (err: any) {
        console.warn(`Groq model ${currentModel} failed:`, err.message);
        lastError = err;
      }
    }

    if (!responseContent) {
      return res.status(200).json({
        content: `⚠️ **AI Service Notice**: ${lastError?.message || "All AI models are currently busy. Please try your question again in a moment."}`
      });
    }

    return res.status(200).json({ content: responseContent });
  } catch (error: any) {
    console.error("Groq API Error:", error);
    return res.status(200).json({ content: `⚠️ **AI Service Error**: ${error.message}` });
  }
}
