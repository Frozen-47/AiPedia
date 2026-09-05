import React from "react";
import { Search, Command } from "lucide-react";
import { useTokens, useTheme } from "../lib/theme";

interface DashboardHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalEntries: number;
  activeType: string;
  onSelectType: (type: string) => void;
  activeTask: string;
  onSelectTask: (task: string) => void;
  onScrollToCatalog: () => void;
}

const CATEGORY_CHIPS = [
  { id: "All", label: "All Assets", icon: "🌐" },
  { id: "Model", label: "Models & LLMs", icon: "🧠" },
  { id: "Framework", label: "Frameworks", icon: "⚡" },
  { id: "Dataset", label: "Datasets", icon: "📊" },
  { id: "Platform", label: "Platforms", icon: "☁️" },
  { id: "AI", label: "AI Applications", icon: "✨" },
];

const TASK_CHIPS = [
  { id: "All Tasks", label: "All Tasks" },
  { id: "NLP", label: "NLP & Reasoning" },
  { id: "Computer Vision", label: "Vision & Imaging" },
  { id: "Multimodal", label: "Multimodal" },
  { id: "AI Coding", label: "Coding & Dev" },
  { id: "Audio", label: "Audio & Speech" },
];

export const DashboardHero: React.FC<DashboardHeroProps> = ({
  searchQuery,
  onSearchChange,
  totalEntries,
  activeType,
  onSelectType,
  activeTask,
  onSelectTask,
  onScrollToCatalog,
}) => {
  const t = useTokens();
  const { resolvedTheme } = useTheme();

  return (
    <div className="relative overflow-hidden pt-6 pb-10">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-sky-500/10 dark:bg-sky-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[250px] bg-indigo-500/10 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="flex flex-col items-center text-center max-w-4xl mx-auto px-4">
        {/* Top Intelligence Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border mb-6 text-[11px] font-bold tracking-wide transition-all shadow-xs backdrop-blur-md bg-white/60 dark:bg-white/5 border-slate-200/80 dark:border-white/10">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
          </span>
          <span className={t.textSecondary}>AiVerse Intelligence Compendium</span>
          <span className="text-slate-300 dark:text-white/20">•</span>
          <span className="text-sky-500 dark:text-sky-400 font-extrabold">
            {totalEntries > 0 ? `${totalEntries} AI Assets Indexed` : "228+ Assets Indexed"}
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] mb-6">
          <span className={resolvedTheme === "amoled" ? "text-white" : "text-slate-900"}>
            Every AI Tool, Model & Tech.
          </span>
          <br />
          <span className="bg-linear-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            One Unified Universe.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className={`text-base sm:text-lg leading-relaxed max-w-2xl font-light mb-8 ${t.textSecondary}`}>
          The citation-backed, open encyclopedia of artificial intelligence. Explore architectural blueprints, benchmark scores, licenses, and verified resources.
        </p>

        {/* Glowing Search Bar */}
        <div className="w-full max-w-2xl relative mb-8 group">
          <div className="absolute -inset-0.5 bg-linear-to-r from-sky-500/30 to-indigo-500/30 rounded-2xl blur-md opacity-40 group-hover:opacity-75 transition duration-300 pointer-events-none" />
          <div className={`relative flex items-center rounded-2xl border px-4 py-3.5 shadow-xl backdrop-blur-xl transition-all ${
            resolvedTheme === "amoled"
              ? "bg-neutral-900/90 border-white/12 focus-within:border-sky-500/60"
              : "bg-white/95 border-slate-200 focus-within:border-sky-500/60"
          }`}>
            <Search size={19} className="text-sky-400 mr-3 shrink-0" />
            <input
              type="text"
              data-search="true"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (e.target.value && onScrollToCatalog) {
                  onScrollToCatalog();
                }
              }}
              placeholder="Search 228+ models, frameworks, datasets, or tasks..."
              className={`w-full bg-transparent border-none outline-none text-sm md:text-base font-normal pr-3 ${t.textPrimary} placeholder:${t.textMuted}`}
            />
            <div className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 border ${
              resolvedTheme === "amoled"
                ? "bg-white/8 text-white/50 border-white/10"
                : "bg-slate-100 text-slate-500 border-slate-200"
            }`}>
              <Command size={10} /> K
            </div>
          </div>
        </div>

        {/* Quick Category Chips */}
        <div className="w-full flex flex-col items-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {CATEGORY_CHIPS.map((chip) => {
              const isActive = activeType === chip.id;
              return (
                <button
                  key={chip.id}
                  onClick={() => {
                    onSelectType(chip.id);
                    onScrollToCatalog();
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-[12px] font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer border ${
                    isActive
                      ? "bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-500/20 scale-105"
                      : `${t.card} ${t.textSecondary} hover:${t.textPrimary} hover:border-sky-500/40`
                  }`}
                >
                  <span>{chip.icon}</span>
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Task Chips */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-1">
            {TASK_CHIPS.map((task) => {
              const isActive = activeTask === task.id;
              return (
                <button
                  key={task.id}
                  onClick={() => {
                    onSelectTask(task.id);
                    onScrollToCatalog();
                  }}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 font-bold"
                      : `text-slate-500 dark:text-slate-400 hover:text-sky-400`
                  }`}
                >
                  {task.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
