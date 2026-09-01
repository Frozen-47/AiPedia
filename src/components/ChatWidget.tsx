import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Minimize2, Maximize2, RefreshCw, Copy, Check, AlertCircle, RotateCcw, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useTokens, useTheme } from '../lib/theme';
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
  h1: ({node, ...props}: any) => <h1 className="font-bold text-lg mt-2 mb-1 text-gray-900 dark:text-white" {...props} />,
  h2: ({node, ...props}: any) => <h2 className="font-bold text-base mt-2 mb-1 text-gray-900 dark:text-white" {...props} />,
  h3: ({node, ...props}: any) => <h3 className="font-bold text-[14px] mt-2 mb-1 text-gray-900 dark:text-white" {...props} />,
  p: ({node, ...props}: any) => <p className="mb-2 last:mb-0" {...props} />,
  ul: ({node, ...props}: any) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
  ol: ({node, ...props}: any) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
  li: ({node, ...props}: any) => <li className="" {...props} />,
  strong: ({node, ...props}: any) => <strong className="font-bold text-sky-600 dark:text-sky-400" {...props} />,
  code: ({node, ...props}: any) => <code className="bg-black/10 dark:bg-white/10 text-gray-900 dark:text-white rounded px-1.5 py-0.5 font-mono text-[12px]" {...props} />,
  pre: ({node, ...props}: any) => <pre className="bg-black/5 dark:bg-black/50 text-gray-900 dark:text-white rounded-xl p-3 overflow-x-auto my-2 font-mono text-[12px] border border-black/5 dark:border-white/5 shadow-inner" {...props} />,
  a: ({node, children, ...props}: any) => (
    <a className="inline-flex items-baseline gap-1 text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 transition-colors font-medium underline underline-offset-2" target="_blank" rel="noopener noreferrer" {...props}>
      {children}
      <ExternalLink size={12} className="shrink-0 self-center" />
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
            className="font-bold text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 underline underline-offset-2 transition-colors cursor-pointer"
          >
            {match}
          </button>
        );
      }
      return <strong className="font-bold text-sky-600 dark:text-sky-400">{children}</strong>;
    },
  };
}

const getInitialMessages = (name?: string | null): Message[] => [
  { role: 'assistant', content: name ? `Hi ${name}! I am Vox. How can I help you navigate the world of AI today?` : 'Hi there! I am Vox. How can I help you navigate the world of AI today?' }
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
      } catch (e) {
        throw new Error(`Server returned non-JSON response (Status ${response.status}): ${responseText.substring(0, 100)}...`);
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

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "amoled";
  const border = isDark ? 'border-white/7' : 'border-black/8';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-white/30' : 'text-gray-400';

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`group fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center p-2 sm:p-2.5 rounded-full shadow-2xl ${t.btnPrimary}`}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 sm:w-9 sm:h-9"
          aria-hidden="true"
        >
          <path
            d="M6.25 4.75h11.5a2.25 2.25 0 0 1 2.25 2.25v6.25a2.25 2.25 0 0 1-2.25 2.25H11.5l-3.75 3.25V15.5H6.25a2.25 2.25 0 0 1-2.25-2.25V7a2.25 2.25 0 0 1 2.25-2.25Z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          <path
            d="M12 8.25l.85 1.7 1.9.75-1.9.75-.85 1.7-.85-1.7-1.9-.75 1.9-.75.85-1.7Z"
            fill="currentColor"
          />
        </svg>
        <div className="grid grid-cols-[0fr] group-hover:grid-cols-[1fr] opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="overflow-hidden whitespace-nowrap">
            <span className="pl-2 pr-1 font-medium text-[13px] sm:text-[15px] block">Ask Vox</span>
          </div>
        </div>
      </button>
    );
  }

  return (
    <div
      ref={widgetRef}
      className={`fixed z-50 flex flex-col shadow-2xl transition-all duration-300 ease-in-out overflow-hidden ${t.modal} ${
        isMaximized
          ? 'bottom-4 right-4 left-4 top-4 rounded-2xl md:left-auto md:w-175'
          : 'bottom-6 right-6 w-95 h-137.5 rounded-2xl sm:w-105 sm:h-150'
      }`}
    >
      <div className={`flex items-center justify-between px-4 py-3 border-b ${t.border}`}>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>
            <VoxLogo size={18} variant="current" />
          </div>
          <div>
            <h3 className={`font-semibold text-sm ${textPrimary}`}>Vox</h3>
            <p className={`text-[10px] ${textMuted}`}>Powered by Groq</p>
          </div>
        </div>
        <div className={`flex items-center gap-1 ${isDark ? 'text-white/55' : 'text-gray-400'}`}>
          <button
            onClick={clearChat}
            className="p-1.5 rounded hover:bg-red-500/10 hover:text-red-400 transition-colors"
            title="Restart chat"
          >
            <RotateCcw size={14} />
          </button>
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className={`p-1.5 rounded transition-colors ${isDark ? 'hover:bg-white/4' : 'hover:bg-black/5'}`}
          >
            {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className={`p-1.5 rounded transition-colors ${isDark ? 'hover:bg-white/4' : 'hover:bg-black/5'}`}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto overscroll-contain no-scrollbar p-4 flex flex-col gap-4 text-sm">
        {messages.map((msg, idx) =>
          msg.role !== 'system' && (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`group relative max-w-[85%] rounded-2xl px-4 py-2 text-[13px] leading-relaxed ${
                  msg.role === 'user'
                    ? isDark
                      ? 'bg-white/10 border border-white/20 text-white font-medium rounded-br-sm'
                      : 'bg-black/5 text-black border border-black/10 font-medium rounded-br-sm'
                    : msg.role === 'error'
                    ? isDark
                      ? 'border border-rose-500/40 bg-rose-950/20 text-rose-300 rounded-bl-sm'
                      : 'border border-rose-200 bg-rose-50 text-rose-600 rounded-bl-sm'
                    : isDark
                      ? `hover:bg-white/4 ${textPrimary} border ${border} rounded-bl-sm`
                      : `hover:bg-black/2 ${textPrimary} border ${border} rounded-bl-sm`
                }`}
              >
                {msg.role === 'user' ? (
                  <div>{msg.content}</div>
                ) : msg.role === 'error' ? (
                  <div className="flex items-start gap-2">
                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold text-[11px] uppercase tracking-wide mb-0.5 opacity-80">Error</p>
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
                      className={`p-1 rounded transition-colors ${textMuted} hover:${textPrimary}`}
                      title="Copy response"
                    >
                      {copiedIndex === idx ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className={`px-4 py-3 rounded-2xl rounded-bl-sm border ${border} ${isDark ? 'bg-white/3' : 'bg-black/2'} flex items-center gap-1.5 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
              <div className="w-1.5 h-1.5 rounded-full bg-current animate-typing-dot [animation-delay:-0.32s]" />
              <div className="w-1.5 h-1.5 rounded-full bg-current animate-typing-dot [animation-delay:-0.16s]" />
              <div className="w-1.5 h-1.5 rounded-full bg-current animate-typing-dot" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} className="h-2 shrink-0" />
      </div>

      {/* ── Suggestions ── */}
      {!isLoading && messages.length > 0 && (
        <div className={`shrink-0 px-4 pb-3 pt-3 border-t ${t.border} bg-transparent`}>
          <div className="flex items-center justify-between mb-2">
            <p className={`text-xs font-medium ${textMuted}`}>Suggested questions:</p>
            <button
              onClick={refreshSuggestions}
              className={`flex items-center gap-1 text-[10px] uppercase tracking-wider ${textMuted} hover:${textPrimary} transition-colors`}
              title="Refresh suggestions"
            >
              <RefreshCw size={12} />
              Refresh
            </button>
          </div>
          <div className="flex overflow-x-auto overscroll-contain gap-2 pb-1 no-scrollbar">
            {suggestions.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(prompt, idx)}
                className={`whitespace-nowrap shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border ${border} transition-colors shadow-sm active:scale-95 ${
                  isDark
                    ? 'text-white/30 hover:bg-white/4 hover:text-white hover:border-white/30'
                    : 'text-gray-400 hover:bg-black/5 hover:text-black hover:border-black/30'
                }`}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Input ── */}
      <div className={`shrink-0 p-3 border-t ${t.border}`}>
        <div className={`flex items-center gap-2 rounded-full border px-4 py-2 ${t.surface} ${t.border} focus-within:border-white/20 transition-colors`}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about AI models..."
            className={`flex-1 bg-transparent outline-none text-sm ${textPrimary} ${isDark ? 'placeholder:text-white/30' : 'placeholder:text-gray-400'}`}
            disabled={isLoading}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className={`p-1.5 rounded-full transition-colors ${
              input.trim() && !isLoading
                ? `${textPrimary} hover:opacity-80`
                : textMuted
            }`}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

