import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Minimize2,
  Maximize2,
  RefreshCw,
  Copy,
  Check,
  AlertCircle,
  RotateCcw,
  ExternalLink,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useTokens } from '../lib/theme';
import { useAuth } from './AuthContext';
import { VoxLogo } from './VoxLogo';

interface Message {
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  isTyping?: boolean;
}

const PREBUILT_QUESTIONS = [
  "How does DeepSeek-R1 compare to OpenAI o1 for reasoning?",
  "What are the key architectural breakthroughs of DeepSeek-V3?",
  "What is the best open-source model for AI coding?",
  "Tell me about Llama 3.3 (70B) capabilities vs 405B",
  "How does Claude 3.7 Sonnet handle hybrid reasoning?",
  "Explain Gemini 2.0 Flash and its multimodal speeds",
  "What is FLUX.1 Schnell used for?",
  "How does LangGraph help orchestrate multi-agent workflows?",
  "What are the benefits of Unsloth for fine-tuning LLMs?",
  "Which models have the largest context windows?",
  "What is the difference between open-weights and proprietary models?",
  "Tell me about HunyuanVideo and CogVideoX video generation",
  "What makes Kokoro-82M special for text-to-speech?",
  "How does v0 by Vercel generate React & Tailwind components?",
  "What is the MATH-500 dataset used for?",
  "Can you list the best platforms for fast serverless AI inference?",
  "What are the key features of Qwen 2.5-Coder (32B)?",
  "Explain what GroqCloud LPU inference is",
  "What makes OpenRouter useful for AI developers?",
  "Which open-weights model is the smartest right now?"
];

const markdownComponents = {
  h1: ({node, ...props}: any) => (
    <h1 className="font-bold text-base mt-2 mb-1 text-white" {...props} />
  ),
  h2: ({node, ...props}: any) => (
    <h2 className="font-bold text-sm mt-2 mb-1 text-neutral-200" {...props} />
  ),
  h3: ({node, ...props}: any) => (
    <h3 className="font-bold text-[13px] mt-1.5 mb-1 text-neutral-300" {...props} />
  ),
  p: ({node, ...props}: any) => <p className="mb-2 last:mb-0 leading-relaxed text-neutral-200" {...props} />,
  ul: ({node, ...props}: any) => <ul className="list-disc pl-4 mb-2 space-y-1 marker:text-neutral-400" {...props} />,
  ol: ({node, ...props}: any) => <ol className="list-decimal pl-4 mb-2 space-y-1 marker:text-neutral-400" {...props} />,
  li: ({node, ...props}: any) => <li className="text-neutral-200" {...props} />,
  strong: ({node, ...props}: any) => <strong className="font-bold text-white" {...props} />,
  code: ({node, ...props}: any) => (
    <code className="bg-white/10 text-neutral-200 border border-white/15 rounded px-1.5 py-0.5 font-mono text-[12px]" {...props} />
  ),
  pre: ({node, ...props}: any) => (
    <pre className="bg-black/60 text-neutral-200 rounded-xl p-3 overflow-x-auto my-2.5 font-mono text-[12px] border border-white/10 shadow-inner" {...props} />
  ),
  a: ({node, children, ...props}: any) => (
    <a className="inline-flex items-baseline gap-1 text-white underline underline-offset-2 hover:opacity-80 transition-opacity font-medium" target="_blank" rel="noopener noreferrer" {...props}>
      {children}
      <ExternalLink size={12} className="shrink-0 self-center opacity-70" />
    </a>
  ),
};

function buildMarkdownComponents(
  entryNames: string[],
  onEntrySelect?: (name: string) => void,
) {
  return {
    ...markdownComponents,
    strong: ({ children }: { children?: React.ReactNode }) => {
      const text = String(children ?? "").trim();
      const match = entryNames.find(
        (n) => n === text || n.toLowerCase() === text.toLowerCase(),
      );
      if (match && onEntrySelect) {
        return (
          <button
            type="button"
            onClick={() => onEntrySelect(match)}
            className="font-bold text-white underline underline-offset-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            {match}
          </button>
        );
      }
      return <strong className="font-bold text-white">{children}</strong>;
    },
  };
}

const getInitialMessages = (name?: string | null): Message[] => [
  { role: 'assistant', content: name ? `Hi ${name}! I am Vox, your AI research and discovery copilot. How can I help you navigate the world of AI today?` : 'Hi there! I am Vox, your AI research and discovery copilot. How can I help you navigate the world of AI today?' }
];

interface ChatWidgetProps {
  entryNames?: string[];
  onEntrySelect?: (name: string) => void;
  initialOpen?: boolean;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  entryNames = [],
  onEntrySelect,
  initialOpen = false,
}) => {
  const t = useTokens();
  const { user } = useAuth();
  const userId = user?.id || null;
  const userName = (user?.user_metadata?.firstName as string) || user?.email?.split('@')[0] || null;

  const [isOpen, setIsOpen] = useState(initialOpen);
  const mdComponents = useRef(
    buildMarkdownComponents(entryNames, onEntrySelect),
  );
  mdComponents.current = buildMarkdownComponents(entryNames, onEntrySelect);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem('vox_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.userId === userId && Date.now() - parsed.timestamp < 60 * 60 * 1000 && parsed.messages?.length > 0) {
          return parsed.messages;
        }
      }
    } catch (e) {
      console.error('Error loading chat history', e);
    }
    return getInitialMessages(userName);
  });
  
  const previousUserId = useRef(userId);
  const previousUserName = useRef(userName);
  
  useEffect(() => {
    if (previousUserId.current !== userId) {
      setMessages(getInitialMessages(userName));
      localStorage.removeItem('vox_chat_history');
      previousUserId.current = userId;
      previousUserName.current = userName;
    } else if (previousUserName.current !== userName && messages.length <= 1) {
      setMessages(getInitialMessages(userName));
      previousUserName.current = userName;
    }
  }, [userId, userName, messages.length]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    try {
      if (messages.length > 1) {
        localStorage.setItem('vox_chat_history', JSON.stringify({
          userId: userId,
          timestamp: Date.now(),
          messages: messages.map(m => ({ ...m, isTyping: false }))
        }));
      } else {
        localStorage.removeItem('vox_chat_history');
      }
    } catch (e) {
      console.error('Error saving chat history', e);
    }
  }, [messages]);

  const clearChat = () => {
    setMessages(getInitialMessages(userName));
    localStorage.removeItem('vox_chat_history');
  };

  useEffect(() => {
    refreshSuggestions();
  }, []);

  const refreshSuggestions = () => {
    const shuffled = [...PREBUILT_QUESTIONS].sort(() => 0.5 - Math.random());
    setSuggestions(shuffled.slice(0, 3));
  };

  const handleSuggestionClick = (prompt: string, idx: number) => {
    handleSend(prompt);
    setSuggestions(prev => {
      const available = PREBUILT_QUESTIONS.filter(q => !prev.includes(q));
      if (available.length > 0) {
        const randomNew = available[Math.floor(Math.random() * available.length)];
        const next = [...prev];
        next[idx] = randomNew;
        return next;
      }
      return prev;
    });
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend && typeof textToSend === 'string' ? textToSend : input;
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const requestMessages = messages.filter(m => m.role !== 'error');
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...requestMessages, userMessage],
          userName: (user?.user_metadata?.firstName as string) || user?.email?.split('@')[0] || undefined
        }),
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          response.status === 500
            ? "The AI backend encountered a temporary server error. Please try again in a few moments."
            : `Server returned an unexpected response (Status ${response.status}).`
        );
      }
      
      if (!response.ok) {
        throw new Error(data.content || data.error || `HTTP error! status: ${response.status}`);
      }
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (error: any) {
      console.error("Groq API Error:", error);
      let errorMessage = "Sorry, I encountered an error communicating with the backend.";
      
      if (error.message) {
        if (error.message.includes("Failed to fetch")) {
          errorMessage = "Network error: Unable to reach the AI servers. Please check your connection.";
        } else if (error.message.includes("Server returned non-JSON") || error.message.includes("HTTP error")) {
          errorMessage = "Server error: The backend returned an invalid response. The service might be temporarily down.";
        } else {
          errorMessage = error.message;
        }
      }
      
      setMessages(prev => [...prev, { role: 'error', content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="group fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center p-2.5 sm:p-3 rounded-full shadow-2xl bg-neutral-900 dark:bg-white text-white dark:text-black border border-white/15 dark:border-black/10 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer shadow-black/50"
        aria-label="Open Vox AI Assistant"
      >
        <div className="relative flex items-center justify-center">
          <VoxLogo size={20} variant="current" />
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
        </div>
        <div className="grid grid-cols-[0fr] group-hover:grid-cols-[1fr] opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="overflow-hidden whitespace-nowrap">
            <span className="pl-2.5 pr-1.5 font-bold text-[13px] sm:text-[14px] tracking-wide block">
              Ask Vox
            </span>
          </div>
        </div>
      </button>
    );
  }

  return (
    <div
      ref={widgetRef}
      className={`fixed z-50 flex flex-col shadow-2xl transition-all duration-300 ease-in-out overflow-hidden border ${t.border} backdrop-blur-xl ${t.modal} ${
        isMaximized
          ? 'bottom-4 right-4 left-4 top-4 rounded-2xl md:left-auto md:w-175'
          : 'bottom-6 right-6 w-95 h-137.5 rounded-2xl sm:w-105 sm:h-150'
      }`}
    >
      {/* ── Sleek Minimalist Header ── */}
      <div className={`flex items-center justify-between px-4 py-3.5 border-b ${t.border} bg-white/[0.02]`}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-neutral-800 dark:bg-white text-white dark:text-black border border-white/10">
              <VoxLogo size={18} variant="current" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-neutral-900" title="Online" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`font-bold text-sm tracking-tight ${t.textPrimary}`}>
                Vox
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/5 border border-white/10 text-neutral-400">
                Groq LPU
              </span>
            </div>
            <p className={`text-[11px] ${t.textMuted}`}>
              AI Discovery & Research Assistant
            </p>
          </div>
        </div>
        <div className={`flex items-center gap-1 ${t.textMuted}`}>
          <button
            onClick={clearChat}
            className="p-1.5 rounded-lg hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
            title="Restart conversation"
          >
            <RotateCcw size={14} />
          </button>
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1.5 rounded-lg hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
            title={isMaximized ? "Restore window" : "Maximize window"}
          >
            {isMaximized ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
            title="Close Vox"
          >
            <X size={17} />
          </button>
        </div>
      </div>

      {/* ── Messages Stream ── */}
      <div className="flex-1 overflow-y-auto overscroll-contain no-scrollbar p-4 flex flex-col gap-4 text-sm">
        {messages.map((msg, idx) =>
          msg.role !== 'system' && (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start items-start gap-2.5'}`}>
              {msg.role !== 'user' && (
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-neutral-800 dark:bg-white text-white dark:text-black mt-0.5 border border-white/10">
                  <VoxLogo size={14} variant="current" />
                </div>
              )}
              <div
                className={`group relative max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-neutral-800 dark:bg-white/15 text-white font-medium border border-white/15 rounded-br-xs'
                    : msg.role === 'error'
                    ? 'border border-red-500/30 bg-red-950/20 text-red-300 rounded-tl-xs'
                    : `${t.surface} ${t.border} ${t.textPrimary} rounded-tl-xs`
                }`}
              >
                {msg.role === 'user' ? (
                  <div>{msg.content}</div>
                ) : msg.role === 'error' ? (
                  <div className="flex items-start gap-2">
                    <AlertCircle size={14} className="mt-0.5 shrink-0 text-red-400" />
                    <div>
                      <p className="font-bold text-[11px] uppercase tracking-wide mb-0.5 text-red-400">Error</p>
                      <p className="leading-snug">{msg.content}</p>
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed">
                    <ReactMarkdown components={mdComponents.current}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                )}

                {msg.role === 'assistant' && (
                  <div className="mt-2 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleCopy(msg.content, idx)}
                      className={`p-1 rounded transition-colors ${t.textMuted} hover:${t.textPrimary} cursor-pointer`}
                      title="Copy response"
                    >
                      {copiedIndex === idx ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        )}

        {/* ── Typing Indicator ── */}
        {isLoading && (
          <div className="flex justify-start items-start gap-2.5">
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-neutral-800 dark:bg-white text-white dark:text-black mt-0.5 border border-white/10 animate-pulse">
              <VoxLogo size={14} variant="current" />
            </div>
            <div className={`px-4 py-2.5 rounded-2xl rounded-tl-xs border ${t.border} ${t.surface} flex items-center gap-2`}>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-typing-dot [animation-delay:-0.32s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-typing-dot [animation-delay:-0.16s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-typing-dot" />
              </div>
              <span className={`text-[11px] font-medium ${t.textMuted}`}>Vox is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} className="h-2 shrink-0" />
      </div>

      {/* ── Suggestions ── */}
      {!isLoading && messages.length > 0 && (
        <div className={`shrink-0 px-4 pb-3 pt-3 border-t ${t.border} bg-white/[0.01]`}>
          <div className="flex items-center justify-between mb-2">
            <p className={`text-xs font-medium ${t.textMuted}`}>Suggested questions:</p>
            <button
              onClick={refreshSuggestions}
              className={`flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider ${t.textMuted} hover:${t.textPrimary} transition-colors cursor-pointer`}
              title="Refresh suggestions"
            >
              <RefreshCw size={11} />
              Refresh
            </button>
          </div>
          <div className="flex overflow-x-auto overscroll-contain gap-2 pb-1 no-scrollbar">
            {suggestions.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(prompt, idx)}
                className={`whitespace-nowrap shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium border ${t.border} ${t.surface} ${t.textSecondary} hover:${t.textPrimary} hover:border-white/25 transition-all active:scale-95 cursor-pointer`}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Input Bar ── */}
      <div className={`shrink-0 p-3 border-t ${t.border} bg-white/[0.01]`}>
        <div className={`flex items-center gap-2 rounded-2xl border ${t.border} px-4 py-2 ${t.surface} focus-within:border-white/30 transition-all`}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Vox about AI models, architectures, benchmarks..."
            className={`flex-1 bg-transparent outline-none text-[13px] ${t.textPrimary} placeholder:text-neutral-500 font-medium`}
            disabled={isLoading}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className={`p-2 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
              input.trim() && !isLoading
                ? "bg-white text-black hover:bg-neutral-200 shadow-sm"
                : "text-neutral-600 opacity-40 cursor-not-allowed"
            }`}
            title="Send prompt"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

