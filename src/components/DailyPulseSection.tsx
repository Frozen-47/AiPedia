import React, { useEffect, useState } from "react";
import { Sparkles, Flame, FileText, ExternalLink, ArrowRight, Cpu, Layers } from "lucide-react";
import { useTokens } from "../lib/theme";
import type { Entry } from "../types";

interface TrendingModel {
  id: string;
  author: string;
  likes: number;
  downloads: number;
  pipeline_tag: string;
  url: string;
}

interface TrendingPaper {
  title: string;
  summary: string;
  upvotes: number;
  arxiv_id: string;
  url: string;
  githubRepo?: string | null;
}

interface DailyPulseData {
  timestamp?: string;
  models: TrendingModel[];
  papers: TrendingPaper[];
}

interface DailyPulseSectionProps {
  onSelectEntry?: (entry: Entry) => void;
  entries?: Entry[];
}

export const DailyPulseSection: React.FC<DailyPulseSectionProps> = ({ onSelectEntry, entries = [] }) => {
  const t = useTokens();
  const [activeTab, setActiveTab] = useState<"spotlight" | "models" | "papers">("spotlight");
  const [trendingData, setTrendingData] = useState<DailyPulseData | null>(null);
  const [toolOfTheDay, setToolOfTheDay] = useState<Entry | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        // 1. Fetch Daily Trending Models & Papers
        const trendingRes = await fetch("/data/daily_trending.json");
        if (trendingRes.ok) {
          const data = await trendingRes.json();
          if (isMounted) setTrendingData(data);
        }

        // 2. Fetch Tool of the Day
        const toolRes = await fetch("/data/tool_of_the_day.json");
        if (toolRes.ok) {
          const data = await toolRes.json();
          if (isMounted && data.tool) {
            setToolOfTheDay(data.tool);
          }
        } else if (entries.length > 0) {
          // Fallback from existing entries
          const pool = entries.filter((e) => e.popular) || entries;
          const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
          if (isMounted) setToolOfTheDay(pool[dayOfYear % pool.length]);
        }
      } catch (err) {
        console.warn("Failed to load daily pulse feeds:", err);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [entries]);

  // If toolOfTheDay is still null, fallback to first entry
  const spotlight = toolOfTheDay || entries[0] || null;

  return (
    <div className="mt-8 border-t border-slate-200 dark:border-white/5 pt-10">
      {/* Header with Live Indicator & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-500 dark:text-emerald-400">
              Live Daily Pulse
            </span>
          </div>
          <h3 className={`text-xl font-bold tracking-tight ${t.textPrimary}`}>
            Today's AI Pulse & Spotlight
          </h3>
          <p className={`text-[12px] ${t.textSecondary} mt-0.5`}>
            Automatically synchronized daily: Featured tool of the day, top trending open-weights, and research papers.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shrink-0 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("spotlight")}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "spotlight"
                ? "bg-sky-500 text-white shadow-xs"
                : `${t.textSecondary} hover:${t.textPrimary}`
            }`}
          >
            <Sparkles size={13} /> Tool of the Day
          </button>
          <button
            onClick={() => setActiveTab("models")}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "models"
                ? "bg-sky-500 text-white shadow-xs"
                : `${t.textSecondary} hover:${t.textPrimary}`
            }`}
          >
            <Flame size={13} /> Trending Models
          </button>
          <button
            onClick={() => setActiveTab("papers")}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "papers"
                ? "bg-sky-500 text-white shadow-xs"
                : `${t.textSecondary} hover:${t.textPrimary}`
            }`}
          >
            <FileText size={13} /> Daily Papers
          </button>
        </div>
      </div>

      {/* TAB CONTENT */}
      {activeTab === "spotlight" && spotlight && (
        <div className={`relative overflow-hidden p-6 md:p-8 rounded-2xl border transition-all duration-300 ${t.card}`}>
          {/* Subtle accent gradient background */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-1 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1">
                  <Sparkles size={10} /> Spotlight of the Day
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  {spotlight.type}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {spotlight.task}
                </span>
                <span className={`text-[12px] font-medium ${t.textMuted}`}>by {spotlight.org}</span>
              </div>

              <h4 className={`text-2xl font-black mb-2 tracking-tight ${t.textPrimary}`}>
                {spotlight.name}
              </h4>

              <p className={`text-[13px] leading-relaxed ${t.textSecondary} mb-5`}>
                {spotlight.summary}
              </p>

              {/* Badges / Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {spotlight.architecture && (
                  <div className="p-3 rounded-xl bg-slate-500/5 border border-slate-200 dark:border-white/5 flex items-start gap-2.5">
                    <Cpu size={15} className="text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <span className={`block text-[10px] uppercase font-bold tracking-wider ${t.textMuted}`}>
                        Architecture
                      </span>
                      <span className={`text-[11px] font-medium ${t.textPrimary} line-clamp-2`}>
                        {spotlight.architecture}
                      </span>
                    </div>
                  </div>
                )}
                {spotlight.benchmarks && (
                  <div className="p-3 rounded-xl bg-slate-500/5 border border-slate-200 dark:border-white/5 flex items-start gap-2.5">
                    <Layers size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className={`block text-[10px] uppercase font-bold tracking-wider ${t.textMuted}`}>
                        Benchmarks
                      </span>
                      <span className={`text-[11px] font-medium ${t.textPrimary} line-clamp-2`}>
                        {spotlight.benchmarks}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              {onSelectEntry && (
                <button
                  onClick={() => onSelectEntry(spotlight)}
                  className="px-5 py-2.5 rounded-xl text-[12px] font-bold bg-sky-500 hover:bg-sky-400 text-white transition-all shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Inspect in AiVerse <ArrowRight size={13} />
                </button>
              )}
              {spotlight.url && (
                <a
                  href={spotlight.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-5 py-2.5 rounded-xl text-[12px] font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    t.isDark
                      ? "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                      : "bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  Official Site <ExternalLink size={13} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TRENDING MODELS */}
      {activeTab === "models" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {trendingData?.models && trendingData.models.length > 0 ? (
            trendingData.models.slice(0, 6).map((m) => (
              <a
                key={m.id}
                href={m.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group p-5 rounded-2xl border transition-all duration-300 hover:border-sky-500/40 flex flex-col justify-between ${t.card}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      {m.pipeline_tag}
                    </span>
                    <span className={`text-[11px] font-medium ${t.textMuted}`}>by {m.author}</span>
                  </div>
                  <h4 className={`text-sm font-bold mb-2 group-hover:text-sky-400 transition-colors ${t.textPrimary} break-all`}>
                    {m.id}
                  </h4>
                </div>
                <div className={`mt-4 pt-3 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-[11px] ${t.textMuted}`}>
                  <div className="flex items-center gap-3">
                    <span>❤️ {m.likes.toLocaleString()}</span>
                    <span>📥 {m.downloads.toLocaleString()}</span>
                  </div>
                  <span className="flex items-center gap-1 text-sky-400 font-bold group-hover:translate-x-0.5 transition-transform">
                    HF <ExternalLink size={11} />
                  </span>
                </div>
              </a>
            ))
          ) : (
            <div className={`col-span-3 p-8 text-center rounded-2xl border ${t.card} ${t.textMuted}`}>
              Daily models feed updating. Check back shortly.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DAILY PAPERS */}
      {activeTab === "papers" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {trendingData?.papers && trendingData.papers.length > 0 ? (
            trendingData.papers.slice(0, 4).map((p, idx) => (
              <a
                key={idx}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group p-5 rounded-2xl border transition-all duration-300 hover:border-sky-500/40 flex flex-col justify-between ${t.card}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Research Paper
                    </span>
                    <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                      👍 {p.upvotes}
                    </span>
                  </div>
                  <h4 className={`text-sm font-bold mb-2 group-hover:text-sky-400 transition-colors ${t.textPrimary} line-clamp-2`}>
                    {p.title}
                  </h4>
                  <p className={`text-[12px] leading-relaxed ${t.textSecondary} line-clamp-3 mb-4`}>
                    {p.summary}
                  </p>
                </div>
                <div className={`pt-3 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-[11px] ${t.textAccent} font-bold`}>
                  <span>Read on ArXiv / HF Papers</span>
                  <ExternalLink size={11} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </a>
            ))
          ) : (
            <div className={`col-span-2 p-8 text-center rounded-2xl border ${t.card} ${t.textMuted}`}>
              Daily papers feed updating. Check back shortly.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
