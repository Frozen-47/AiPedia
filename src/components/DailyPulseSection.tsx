import React, { useEffect, useState } from "react";
import { Sparkles, Flame, FileText, ExternalLink, ArrowRight, Cpu, Layers, Heart, Download, ThumbsUp } from "lucide-react";
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
        const trendingRes = await fetch("/data/daily_trending.json");
        if (trendingRes.ok) {
          const data = await trendingRes.json();
          if (isMounted) setTrendingData(data);
        }

        const toolRes = await fetch("/data/tool_of_the_day.json");
        if (toolRes.ok) {
          const data = await toolRes.json();
          if (isMounted && data.tool) {
            setToolOfTheDay(data.tool);
          }
        } else if (entries.length > 0) {
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

  const spotlight = toolOfTheDay || entries[0] || null;

  return (
    <div className="mt-8 border-t border-slate-200 dark:border-white/5 pt-10">
      {/* Header with Live Indicator & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            </span>
            <span className="text-[11px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
              Live Daily Pulse
            </span>
          </div>
          <h3 className={`text-xl font-black tracking-tight ${t.textPrimary} flex items-center gap-2`}>
            Today's AI Pulse & Spotlight
          </h3>
          <p className={`text-[12px] ${t.textSecondary} mt-0.5`}>
            Automatically synchronized daily: Featured tool of the day, top trending open-weights, and research papers.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-900/90 border border-white/10 shrink-0 self-start md:self-auto backdrop-blur-md">
          <button
            onClick={() => setActiveTab("spotlight")}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "spotlight"
                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md shadow-amber-500/20 font-black"
                : `${t.textSecondary} hover:text-amber-400`
            }`}
          >
            <Sparkles size={13} className={activeTab === "spotlight" ? "text-black fill-black/20" : "text-amber-400"} /> Tool of the Day
          </button>
          <button
            onClick={() => setActiveTab("models")}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "models"
                ? "bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-md shadow-orange-500/20 font-black"
                : `${t.textSecondary} hover:text-orange-400`
            }`}
          >
            <Flame size={13} className={activeTab === "models" ? "text-white" : "text-orange-400"} /> Trending Models
          </button>
          <button
            onClick={() => setActiveTab("papers")}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "papers"
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-purple-500/20 font-black"
                : `${t.textSecondary} hover:text-purple-400`
            }`}
          >
            <FileText size={13} className={activeTab === "papers" ? "text-white" : "text-purple-400"} /> Daily Papers
          </button>
        </div>
      </div>

      {/* TAB CONTENT */}
      {activeTab === "spotlight" && spotlight && (
        <div className={`relative overflow-hidden p-6 md:p-8 rounded-2xl border transition-all duration-300 border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-neutral-900/60 shadow-[0_0_40px_rgba(99,102,241,0.08)]`}>
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-1 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1 shadow-xs">
                  <Sparkles size={10} className="fill-amber-400" /> Spotlight of the Day
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  spotlight.type === "Model"
                    ? "bg-purple-500/15 text-purple-300 border-purple-500/30"
                    : spotlight.type === "Framework"
                    ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                    : spotlight.type === "Dataset"
                    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                    : spotlight.type === "Platform"
                    ? "bg-sky-500/15 text-sky-300 border-sky-500/30"
                    : "bg-rose-500/15 text-rose-300 border-rose-500/30"
                }`}>
                  {spotlight.type}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  {spotlight.task}
                </span>
                <span className={`text-[12px] font-medium text-neutral-400`}>by <span className="text-white font-semibold">{spotlight.org}</span></span>
              </div>

              <h4 className={`text-2xl md:text-3xl font-black mb-2 tracking-tight ${t.textPrimary}`}>
                {spotlight.name}
              </h4>

              <p className={`text-[13px] leading-relaxed ${t.textSecondary} mb-5`}>
                {spotlight.summary}
              </p>

              {/* Badges / Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {spotlight.architecture && (
                  <div className="p-3.5 rounded-xl bg-sky-500/5 border border-sky-500/20 flex items-start gap-2.5">
                    <Cpu size={16} className="text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[10px] uppercase font-bold tracking-wider text-sky-400/80">
                        Architecture Specs
                      </span>
                      <span className={`text-[11px] font-medium ${t.textPrimary} line-clamp-2`}>
                        {spotlight.architecture}
                      </span>
                    </div>
                  </div>
                )}
                {spotlight.benchmarks && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-start gap-2.5">
                    <Layers size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[10px] uppercase font-bold tracking-wider text-emerald-400/80">
                        Verified Benchmarks
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
                  className="px-5 py-2.5 rounded-xl text-[12px] font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  Inspect in AiVerse <ArrowRight size={13} />
                </button>
              )}
              {spotlight.url && (
                <a
                  href={spotlight.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl text-[12px] font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer bg-white/5 border-white/15 hover:bg-white/10 hover:border-purple-500/40 text-white active:scale-95"
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
            trendingData.models.slice(0, 6).map((m) => {
              const tagColor = m.pipeline_tag.includes("text")
                ? "bg-purple-500/15 text-purple-300 border-purple-500/30"
                : m.pipeline_tag.includes("image") || m.pipeline_tag.includes("vision")
                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                : m.pipeline_tag.includes("audio")
                ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                : "bg-indigo-500/15 text-indigo-300 border-indigo-500/30";

              return (
                <a
                  key={m.id}
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group p-5 rounded-2xl border transition-all duration-300 hover:border-amber-500/40 hover:shadow-[0_0_24px_rgba(245,158,11,0.1)] flex flex-col justify-between ${t.card}`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${tagColor}`}>
                        {m.pipeline_tag}
                      </span>
                      <span className={`text-[11px] font-medium text-neutral-400`}>by <span className="text-neutral-200">{m.author}</span></span>
                    </div>
                    <h4 className={`text-sm font-bold mb-2 group-hover:text-amber-300 transition-colors ${t.textPrimary} break-all`}>
                      {m.id}
                    </h4>
                  </div>
                  <div className={`mt-4 pt-3 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-[11px] ${t.textMuted}`}>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-rose-400 font-medium">
                        <Heart size={12} className="fill-rose-500/30 text-rose-400 group-hover:fill-rose-500" />
                        {m.likes.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1 text-sky-400 font-medium">
                        <Download size={12} className="text-sky-400" />
                        {m.downloads.toLocaleString()}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-amber-400 font-extrabold group-hover:translate-x-0.5 transition-transform">
                      HF <ExternalLink size={11} />
                    </span>
                  </div>
                </a>
              );
            })
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
                className={`group p-5 rounded-2xl border transition-all duration-300 hover:border-indigo-500/40 hover:shadow-[0_0_24px_rgba(99,102,241,0.1)] flex flex-col justify-between ${t.card}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-violet-500/15 text-violet-300 border border-violet-500/30 flex items-center gap-1">
                      <FileText size={10} /> Research Paper
                    </span>
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      <ThumbsUp size={11} className="fill-emerald-500/30" /> {p.upvotes}
                    </span>
                  </div>
                  <h4 className={`text-sm font-bold mb-2 group-hover:text-indigo-300 transition-colors ${t.textPrimary} line-clamp-2`}>
                    {p.title}
                  </h4>
                  <p className={`text-[12px] leading-relaxed ${t.textSecondary} line-clamp-3 mb-4 font-light`}>
                    {p.summary}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-[11px] text-indigo-400 font-extrabold">
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
