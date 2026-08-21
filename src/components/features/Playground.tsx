import React, { useState } from "react";
import { useTokens, useTheme } from "../../lib/theme";
import { useAuth } from "../AuthContext";
import ReactMarkdown from "react-markdown";
import {
  Lock,
  Play,
  Settings,
  ChevronDown,
  ChevronUp,
  Check,
  Copy,
  Clock,
  Sparkles,
  Info,
} from "lucide-react";

interface ModelResponse {
  modelId: string;
  modelLabel: string;
  output: string;
  loading: boolean;
  error: string | null;
  latencyMs: number | null;
}

const MODELS = [
  { id: "openai/gpt-oss-20b", label: "GPT OSS 20B", badge: "Fast" },
  { id: "openai/gpt-oss-120b", label: "GPT OSS 120B", badge: "Smart" },
  { id: "qwen/qwen3.6-27b", label: "Qwen 3.6 27B", badge: "Reasoning" },
  { id: "groq/compound", label: "Groq Compound", badge: "Compound AI" },
];

const TEMPLATES = [
  {
    title: "Refactor & Explain Code",
    system: "You are an expert software engineer. Refactor the provided code to be more concise and performant, then explain the changes.",
    prompt: "function bubbleSort(arr) {\n  let len = arr.length;\n  for (let i = 0; i < len; i++) {\n    for (let j = 0; j < len - 1 - i; j++) {\n      if (arr[j] > arr[j + 1]) {\n        let temp = arr[j];\n        arr[j] = arr[j + 1];\n        arr[j + 1] = temp;\n      }\n    }\n  }\n  return arr;\n}",
  },
  {
    title: "SQL Query to English",
    system: "You are a database administrator. Translate the SQL query into plain English, step by step.",
    prompt: "SELECT u.id, u.username, COUNT(b.id) AS total_bookmarks\nFROM users u\nLEFT JOIN user_bookmarks b ON u.user_key = b.user_key\nWHERE b.created_at > NOW() - INTERVAL '30 days'\nGROUP BY u.id, u.username\nHAVING COUNT(b.id) > 5\nORDER BY total_bookmarks DESC;",
  },
  {
    title: "Generate Structured JSON",
    system: "You are a structured data generator. Return ONLY a valid JSON array of objects. Do not include any explanation, markdown blocks, or extra text. Each object must have fields: 'name', 'developer', and 'primaryUse'.",
    prompt: "Create JSON data for the 3 most popular machine learning frameworks.",
  },
  {
    title: "AI Model Comparison",
    system: "You are an AI research consultant. Compare PyTorch and TensorFlow in terms of debugging experience, production deployment, and community adoption.",
    prompt: "Provide a brief comparative summary of PyTorch and TensorFlow.",
  },
];

export const Playground: React.FC = () => {
  const t = useTokens();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "amoled";
  const { user, openAuthModal } = useAuth();

  const [prompt, setPrompt] = useState("");
  const [systemInstruction, setSystemInstruction] = useState("");
  const [selectedModels, setSelectedModels] = useState<string[]>([
    "openai/gpt-oss-20b",
    "openai/gpt-oss-120b",
  ]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [openTemplates, setOpenTemplates] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const [responses, setResponses] = useState<Record<string, ModelResponse>>({});

  const toggleModel = (id: string) => {
    setSelectedModels((prev) => {
      if (prev.includes(id)) {
        // Keep at least one model selected
        if (prev.length === 1) return prev;
        return prev.filter((m) => m !== id);
      } else {
        // Limit to max 3 models for clean side-by-side design
        if (prev.length === 3) return prev;
        return [...prev, id];
      }
    });
  };

  const applyTemplate = (tpl: typeof TEMPLATES[number]) => {
    setSystemInstruction(tpl.system);
    setPrompt(tpl.prompt);
    setOpenTemplates(false);
  };

  const handleCopy = (text: string, modelId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(modelId);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleRun = async () => {
    if (!prompt.trim()) return;

    // Reset and initialize response states for the selected models
    const initialResponses: Record<string, ModelResponse> = {};
    selectedModels.forEach((modelId) => {
      const modelInfo = MODELS.find((m) => m.id === modelId);
      initialResponses[modelId] = {
        modelId,
        modelLabel: modelInfo?.label || modelId,
        output: "",
        loading: true,
        error: null,
        latencyMs: null,
      };
    });
    setResponses(initialResponses);

    // Call API for each selected model concurrently
    selectedModels.forEach(async (modelId) => {
      const startTime = performance.now();
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [{ role: "user", content: prompt }],
            model: modelId,
            systemInstruction: systemInstruction.trim() || undefined,
          }),
        });

        const endTime = performance.now();
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.content || data.error || "Failed to generate response");
        }

        setResponses((prev) => ({
          ...prev,
          [modelId]: {
            ...prev[modelId],
            loading: false,
            output: data.content,
            latencyMs: Math.round(endTime - startTime),
          },
        }));
      } catch (err: any) {
        setResponses((prev) => ({
          ...prev,
          [modelId]: {
            ...prev[modelId],
            loading: false,
            error: err.message || "An unexpected error occurred",
          },
        }));
      }
    });
  };

  return (
    <div
      id="playground"
      className={`relative p-6 sm:p-8 rounded-[28px] border backdrop-blur-md transition-all duration-300 scroll-mt-24 overflow-hidden ${t.surface} shadow-xl`}
    >
      {/* Lock overlay if not logged in */}
      {!user && (
        <div
          className={`absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center backdrop-blur-[6px] transition-colors duration-200 ${
            isDark ? "bg-neutral-900/90 text-white" : "bg-white/90 text-neutral-900"
          }`}
        >
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg ${t.iconBgSolid}`}
          >
            <Lock size={24} />
          </div>
          <h3 className={`text-xl font-bold mb-2 tracking-tight ${t.textPrimary}`}>
            Unlock AI Playground
          </h3>
          <p className={`text-[13px] mb-6 max-w-95 leading-relaxed mx-auto ${t.textSecondary}`}>
            Sign in to compare outputs across different Llama, Mixtral, and Gemma models side-by-side in real-time.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => openAuthModal("signin")}
              className={`${t.btnSecondary} px-5 py-2.5 rounded-xl font-medium text-sm transition-all border cursor-pointer`}
            >
              Login
            </button>
            <button
              onClick={() => openAuthModal("signup")}
              className={`${t.btnPrimary} px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md cursor-pointer`}
            >
              Create Account
            </button>
          </div>
        </div>
      )}

      {/* Main content grid */}
      <div
        className={!user ? "filter blur-xs pointer-events-none select-none" : ""}
        {...(!user ? { inert: true } : {})}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b pb-6 border-white/5 text-left">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-full border ${t.pillInactive}`}
              >
                AI Model Playground
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            </div>
            <h3 className={`text-xl font-bold tracking-tight mb-1.5 ${t.textPrimary}`}>
              Multi-Model Prompt Sandbox
            </h3>
            <p className={`text-[13px] leading-relaxed max-w-xl font-light ${t.textSecondary}`}>
              Test prompts simultaneously across different LLMs. Customize system prompts to enforce styles, JSON structures, or translations.
            </p>
          </div>

          {/* Quick-start Templates */}
          <div className="relative self-start md:self-end">
            <button
              onClick={() => setOpenTemplates((prev) => !prev)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-bold border transition-colors cursor-pointer ${t.pillInactive}`}
            >
              <Sparkles size={13} className="text-indigo-400" />
              Quick Templates
              <ChevronDown size={14} />
            </button>
            {openTemplates && (
              <>
                <div
                  className="fixed inset-0 z-25"
                  onClick={() => setOpenTemplates(false)}
                />
                <div
                  className={`absolute right-0 mt-2 w-64 rounded-2xl border p-2 z-30 shadow-xl backdrop-blur-xl ${t.modal} ${t.border}`}
                >
                  <p className={`text-[9px] font-black uppercase tracking-wider px-3 py-1.5 ${t.textMuted}`}>
                    Choose a template
                  </p>
                  <ul className="space-y-1">
                    {TEMPLATES.map((tpl, i) => (
                      <li key={i}>
                        <button
                          onClick={() => applyTemplate(tpl)}
                          className={`w-full text-left px-3 py-2 text-[12px] font-semibold rounded-xl transition-all ${t.pillInactive} hover:text-white`}
                        >
                          {tpl.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Input Configuration & Side-by-side view */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-1 space-y-5 text-left border-r pr-0 lg:pr-6 border-white/5">
            {/* Prompt Input */}
            <div className="flex flex-col">
              <label className={`text-[11px] font-semibold mb-2 uppercase tracking-wider ${t.textSecondary}`}>
                User Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Write your prompt here..."
                rows={5}
                className={`w-full px-4 py-3 rounded-xl border text-[13px] leading-relaxed resize-none outline-none font-medium transition-all ${t.input}`}
              />
            </div>

            {/* Model Selection */}
            <div>
              <label className={`text-[11px] font-semibold mb-3.5 uppercase tracking-wider block ${t.textSecondary}`}>
                Select Models (1-3)
              </label>
              <div className="flex flex-col gap-2">
                {MODELS.map((model) => {
                  const isSelected = selectedModels.includes(model.id);
                  return (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => toggleModel(model.id)}
                      className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border text-[13px] font-bold text-left cursor-pointer transition-all ${
                        isSelected
                          ? `${t.pillActive} ring-1 ring-white/10`
                          : `${t.surface} ${t.border} ${t.textSecondary} hover:border-white/10`
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-indigo-400" : "bg-neutral-600"}`} />
                        <span>{model.label}</span>
                      </div>
                      <span
                        className={`text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-md ${
                          isSelected ? "bg-white/10 text-white" : `${t.pillInactive} ${t.textMuted}`
                        }`}
                      >
                        {model.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Advanced Settings (System Prompt) */}
            <div className={`border rounded-xl ${t.border} p-1.5 transition-all ${t.surface}`}>
              <button
                type="button"
                onClick={() => setShowAdvanced((prev) => !prev)}
                className={`flex items-center justify-between w-full px-3 py-2 text-[12px] font-bold cursor-pointer ${t.textPrimary}`}
              >
                <div className="flex items-center gap-2">
                  <Settings size={13} className={t.textSecondary} />
                  <span>Advanced Settings</span>
                </div>
                {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {showAdvanced && (
                <div className="p-3 border-t border-white/5 space-y-2 mt-1 animate-[fadeIn_0.15s_ease-out]">
                  <label className={`text-[9px] font-black uppercase tracking-wider block ${t.textMuted}`}>
                    System instructions
                  </label>
                  <textarea
                    value={systemInstruction}
                    onChange={(e) => setSystemInstruction(e.target.value)}
                    placeholder="E.g., You are a strict JSON bot that never writes explanations..."
                    rows={4}
                    className={`w-full px-3 py-2 rounded-lg border text-[12px] leading-relaxed resize-none outline-none font-medium transition-all ${t.input}`}
                  />
                  <div className="flex items-start gap-1.5 mt-2">
                    <Info size={11} className={`mt-0.5 shrink-0 ${t.textMuted}`} />
                    <p className={`text-[10px] leading-relaxed ${t.textMuted}`}>
                      System prompts instruct the LLM on its behavior, tone, or formatting constraints before processing user inputs.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Trigger */}
            <button
              type="button"
              onClick={handleRun}
              disabled={!prompt.trim() || selectedModels.length === 0}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold text-black bg-white hover:bg-neutral-100 disabled:opacity-50 disabled:pointer-events-none cursor-pointer transition-all active:scale-[0.98] shadow-md`}
            >
              <Play size={15} fill="currentColor" />
              Run Prompt Sandbox
            </button>
          </div>

          {/* Results Comparison Grid (2 Columns or max 3 depending on selection) */}
          <div className="lg:col-span-2">
            {selectedModels.length === 0 ? (
              <div
                className={`flex flex-col items-center justify-center py-20 px-6 rounded-2xl border text-center ${t.surface} ${t.border}`}
              >
                <p className={`text-sm ${t.textMuted}`}>Select at least one model on the left to start.</p>
              </div>
            ) : Object.keys(responses).length === 0 ? (
              /* Idle state (pre-run) */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                {selectedModels.map((modelId) => {
                  const mInfo = MODELS.find((m) => m.id === modelId);
                  return (
                    <div
                      key={modelId}
                      className={`flex flex-col rounded-2xl border p-5 text-left h-fit min-h-48 justify-between ${t.surface} ${t.border}`}
                    >
                      <div>
                        <h4 className={`text-[13px] font-black ${t.textPrimary}`}>
                          {mInfo?.label || modelId}
                        </h4>
                        <p className={`text-[10px] mt-1 ${t.textMuted}`}>
                          Awaiting prompt sandbox run...
                        </p>
                      </div>
                      <div className="h-2 w-16 bg-neutral-800 rounded animate-pulse" />
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Execution output grid */
              <div
                className={`grid gap-4 h-full`}
                style={{
                  gridTemplateColumns: `repeat(auto-fit, minmax(280px, 1fr))`,
                }}
              >
                {selectedModels.map((modelId) => {
                  const resp = responses[modelId];
                  if (!resp) return null;

                  return (
                    <div
                      key={modelId}
                      className={`flex flex-col rounded-2xl border overflow-hidden text-left h-full ${t.surface} ${t.border}`}
                    >
                      {/* Column Header */}
                      <header className="px-4 py-3.5 border-b border-white/5 flex items-center justify-between shrink-0">
                        <div>
                          <h4 className={`text-[13px] font-black tracking-tight ${t.textPrimary}`}>
                            {resp.modelLabel}
                          </h4>
                          {resp.latencyMs !== null && (
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="flex items-center gap-0.5 text-[10px] text-emerald-400 font-semibold">
                                <Clock size={10} />
                                {(resp.latencyMs / 1000).toFixed(2)}s
                              </span>
                              <span className={`text-[10px] ${t.textMuted}`}>•</span>
                              <span className={`text-[10px] ${t.textMuted}`}>
                                {resp.output.length} chars
                              </span>
                            </div>
                          )}
                        </div>

                        {resp.output && (
                          <button
                            type="button"
                            onClick={() => handleCopy(resp.output, modelId)}
                            className={`p-2 rounded-lg border transition-all cursor-pointer ${t.surface} ${t.border} ${t.textMuted} hover:${t.textPrimary}`}
                            title="Copy response"
                          >
                            {copiedIndex === modelId ? (
                              <Check size={13} className="text-emerald-400" />
                            ) : (
                              <Copy size={13} />
                            )}
                          </button>
                        )}
                      </header>

                      {/* Column Body / Output */}
                      <div className="p-4 flex-1 overflow-y-auto max-h-125 min-h-64 no-scrollbar">
                        {resp.loading ? (
                          <div className="space-y-3 animate-pulse">
                            <div className="h-3.5 bg-white/5 rounded-md w-full" />
                            <div className="h-3.5 bg-white/5 rounded-md w-[90%]" />
                            <div className="h-3.5 bg-white/5 rounded-md w-[95%]" />
                            <div className="h-3.5 bg-white/5 rounded-md w-[80%]" />
                            <div className="h-3.5 bg-white/5 rounded-md w-[60%]" />
                          </div>
                        ) : resp.error ? (
                          <div className="text-red-400 text-xs py-4 flex flex-col gap-2 items-start">
                            <p className="font-bold flex items-center gap-1.5">
                              <span>Generation failed</span>
                            </p>
                            <p className={`p-3 rounded-xl border border-red-500/10 bg-red-500/5 ${t.textMuted} leading-relaxed`}>
                              {resp.error}
                            </p>
                          </div>
                        ) : (
                          <article className={`text-[13px] leading-relaxed font-normal prose prose-invert max-w-none break-words ${t.textSecondary}`}>
                            <ReactMarkdown
                              components={{
                                h1: ({ node, ...props }) => (
                                  <h1 className="font-extrabold text-base mt-3 mb-1.5 text-white" {...props} />
                                ),
                                h2: ({ node, ...props }) => (
                                  <h2 className="font-bold text-sm mt-3 mb-1.5 text-white" {...props} />
                                ),
                                h3: ({ node, ...props }) => (
                                  <h3 className="font-bold text-[13px] mt-3 mb-1.5 text-white" {...props} />
                                ),
                                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                code: ({ node, ...props }) => (
                                  <code
                                    className="bg-white/5 rounded-md px-1.5 py-0.5 font-mono text-[11px] text-white"
                                    {...props}
                                  />
                                ),
                                pre: ({ node, ...props }) => (
                                  <pre
                                    className="bg-black/40 rounded-xl p-3 overflow-x-auto my-2 font-mono text-[11px] border border-white/5 shadow-inner w-full shrink-0"
                                    {...props}
                                  />
                                ),
                                strong: ({ node, ...props }) => (
                                  <strong className="font-bold text-white" {...props} />
                                ),
                              }}
                            >
                              {resp.output}
                            </ReactMarkdown>
                          </article>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
