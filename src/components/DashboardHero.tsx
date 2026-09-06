import React from "react";
import { 
  Search, 
  Command, 
  Globe, 
  Cpu, 
  Zap, 
  Database, 
  Cloud, 
  Sparkles,
  MessageSquare,
  Eye,
  Layers,
  Code2,
  Volume2
} from "lucide-react";
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
  { id: "All", label: "All Assets", icon: Globe, color: "text-neutral-300", activeBg: "bg-white text-black border-white" },
  { id: "Model", label: "Models & LLMs", icon: Cpu, color: "text-purple-400", activeBg: "bg-purple-500 text-white border-purple-400" },
  { id: "Framework", label: "Frameworks", icon: Zap, color: "text-amber-400", activeBg: "bg-amber-500 text-black border-amber-400" },
  { id: "Dataset", label: "Datasets", icon: Database, color: "text-emerald-400", activeBg: "bg-emerald-500 text-black border-emerald-400" },
  { id: "Platform", label: "Platforms", icon: Cloud, color: "text-sky-400", activeBg: "bg-sky-500 text-black border-sky-400" },
  { id: "AI", label: "AI Applications", icon: Sparkles, color: "text-rose-400", activeBg: "bg-rose-500 text-white border-rose-400" },
];

const TASK_CHIPS = [
  { id: "All Tasks", label: "All Tasks", icon: Sparkles, color: "text-neutral-400", activeBg: "bg-white/20 text-white border-white/30" },
  { id: "NLP", label: "NLP & Reasoning", icon: MessageSquare, color: "text-teal-400", activeBg: "bg-teal-500/20 text-teal-300 border-teal-500/40" },
  { id: "Computer Vision", label: "Vision & Imaging", icon: Eye, color: "text-rose-400", activeBg: "bg-rose-500/20 text-rose-300 border-rose-500/40" },
  { id: "Multimodal", label: "Multimodal", icon: Layers, color: "text-purple-400", activeBg: "bg-purple-500/20 text-purple-300 border-purple-500/40" },
  { id: "AI Coding", label: "Coding & Dev", icon: Code2, color: "text-cyan-400", activeBg: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" },
  { id: "Audio", label: "Audio & Speech", icon: Volume2, color: "text-amber-400", activeBg: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
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
      {/* Dynamic ambient nebula glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-gradient-to-r from-violet-600/15 via-fuchsia-600/10 to-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[200px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="flex flex-col items-center text-center max-w-4xl mx-auto px-4">
        {/* Top Intelligence Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border mb-6 text-[11px] font-bold tracking-wide transition-all shadow-xs backdrop-blur-md bg-white/[0.03] border-white/10">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
          </span>
          <span className={t.textSecondary}>AiVerse Intelligence Compendium</span>
          <span className="text-white/20">•</span>
          <span className="text-white font-black tracking-wide">
            {totalEntries > 0 ? `${totalEntries} AI Assets Indexed` : "242+ Assets Indexed"}
          </span>
        </div>

        {/* Hero Title with Iridescent Gradient */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] mb-6">
          <span className={resolvedTheme === "amoled" ? "text-white" : "text-neutral-900"}>
            Every AI Tool, Model & Tech.
          </span>
          <br />
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">
            One Unified Universe.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className={`text-base sm:text-lg leading-relaxed max-w-2xl font-light mb-8 ${t.textSecondary}`}>
          The citation-backed, open encyclopedia of artificial intelligence. Explore architectural blueprints, benchmark scores, licenses, and verified resources.
        </p>

        {/* Search Bar with Iridescent Glow */}
        <div className="w-full max-w-2xl relative mb-8 group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/25 via-fuchsia-500/20 to-amber-500/25 rounded-2xl blur-md opacity-40 group-hover:opacity-100 group-focus-within:opacity-100 transition duration-300 pointer-events-none" />
          <div className={`relative flex items-center rounded-2xl border px-4 py-3.5 shadow-2xl backdrop-blur-xl transition-all ${
            resolvedTheme === "amoled"
              ? "bg-neutral-950/90 border-white/15 focus-within:border-violet-500/50"
              : "bg-white border-neutral-300 focus-within:border-violet-500 shadow-sm"
          }`}>
            <Search size={18} className="text-neutral-400 mr-3 shrink-0" />
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
              placeholder={`Search ${totalEntries > 0 ? totalEntries : 242}+ models, frameworks, datasets, or tasks...`}
              className={`w-full bg-transparent border-none outline-none text-sm md:text-base font-normal pr-3 ${t.textPrimary} placeholder:${t.textMuted}`}
            />
            <div className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 border ${
              resolvedTheme === "amoled"
                ? "bg-white/8 text-white/60 border-white/10"
                : "bg-neutral-100 text-neutral-600 border-neutral-200"
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
              const Icon = chip.icon;
              return (
                <button
                  key={chip.id}
                  onClick={() => {
                    onSelectType(chip.id);
                    onScrollToCatalog();
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-[12px] font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer border ${
                    isActive
                      ? `${chip.activeBg} shadow-md scale-105`
                      : `${t.card} ${t.textSecondary} hover:${t.textPrimary} hover:border-white/30`
                  }`}
                >
                  <Icon size={13} className={`shrink-0 ${isActive ? "" : chip.color}`} />
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Task Chips */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-1">
            {TASK_CHIPS.map((task) => {
              const isActive = activeTask === task.id;
              const Icon = task.icon;
              return (
                <button
                  key={task.id}
                  onClick={() => {
                    onSelectTask(task.id);
                    onScrollToCatalog();
                  }}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer border ${
                    isActive
                      ? `${task.activeBg} font-bold shadow-xs`
                      : `border-transparent ${task.color} hover:bg-white/5`
                  }`}
                >
                  <Icon size={11} className="shrink-0" />
                  <span>{task.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
