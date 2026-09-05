import React, { memo, useMemo } from "react";
import { Star, Layers, Box, Database, Server, LayoutGrid, Bot, Bookmark } from "lucide-react";
import { useTokens, taskColor, taskActiveColor, typeActiveColor, typeColorClass } from "../lib/theme";
import type { Entry, TypeFilter, TaskFilter } from "../types";

interface SidebarProps {
  entries: Entry[];
  currentFilter: TypeFilter;
  currentTask: TaskFilter;
  typeFilters: string[];
  taskFilters: string[];
  popularOnly: boolean;
  filteredCount: number;
  onTypeFilter: (f: TypeFilter) => void;
  onTaskFilter: (f: TaskFilter) => void;
  onPopularToggle: () => void;
  savedOnly?: boolean;
  savedCount?: number;
  onSavedToggle?: () => void;
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  All: <LayoutGrid size={14} />,
  AI: <Bot size={14} />,
  Framework: <Layers size={14} />,
  Dataset: <Database size={14} />,
  Platform: <Server size={14} />,
  Model: <Box size={14} />,
};



export const Sidebar = memo(function Sidebar({
  entries,
  currentFilter,
  currentTask,
  typeFilters,
  taskFilters,
  popularOnly,
  filteredCount,
  onTypeFilter,
  onTaskFilter,
  onPopularToggle,
  savedOnly,
  savedCount = 0,
  onSavedToggle,
}: SidebarProps) {
  const t = useTokens();

  const { typeCounts, taskCounts, popularCount } = useMemo(() => {
    const byType: Record<string, number> = {};
    const byTask: Record<string, number> = {};
    let popular = 0;
    for (const e of entries) {
      byType[e.type] = (byType[e.type] ?? 0) + 1;
      byTask[e.task] = (byTask[e.task] ?? 0) + 1;
      if (e.popular) popular++;
    }
    const typeCounts = typeFilters.reduce<Record<string, number>>((acc, f) => {
      acc[f] = f === "All" ? entries.length : byType[f] ?? 0;
      return acc;
    }, {});
    const taskCounts = taskFilters.reduce<Record<string, number>>((acc, f) => {
      acc[f] = f === "All Tasks" ? entries.length : byTask[f] ?? 0;
      return acc;
    }, {});
    return { typeCounts, taskCounts, popularCount: popular };
  }, [entries, typeFilters, taskFilters]);

  return (
    <aside className="w-full flex flex-col gap-6">
      {/* Stats */}
      <div className="rounded-2xl p-4 glow-card">
        <p className={t.sectionLabel}>
          Overview
        </p>
        <div className="space-y-2">
          {[
            { label: "Total Entries", value: entries.length, color: t.textAccent },
            { label: "AI Assistants", value: typeCounts["AI"], color: t.textAI },
            { label: "Models", value: typeCounts["Model"], color: t.textModel },
            { label: "Frameworks", value: typeCounts["Framework"], color: t.textFramework },
            { label: "Datasets", value: typeCounts["Dataset"], color: t.textDataset },
            { label: "Platforms", value: typeCounts["Platform"], color: t.textPlatform },
            { label: "Popular", value: popularCount, color: t.textPopular },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex items-center justify-between">
              <span className={`text-[12px] ${t.textSecondary}`}>{label}</span>
              <span className={`text-[13px] font-black tabular-nums ${color}`}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Type Filter */}
      <div>
        <p className={`${t.sectionLabel.replace('mb-3', 'mb-2')} px-1`}>
          Type
        </p>
        <div className="space-y-0.5">
          {typeFilters.map((f) => (
            <button
              key={f}
              onClick={() => onTypeFilter(f as TypeFilter)}
              className={`
                w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium
                transition-all duration-150
                ${currentFilter === f ? typeActiveColor(f, t) : t.sidebarItem}
              `}
            >
              <span className={`opacity-80 shrink-0 ${typeColorClass(f)}`}>{TYPE_ICONS[f]}</span>
              <span className="flex-1 text-left">{f}</span>
              <span className={`text-[11px] tabular-nums font-semibold ${currentFilter === f ? "" : t.textMuted}`}>
                {typeCounts[f]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Task Filter */}
      <div>
        <p className={`${t.sectionLabel.replace('mb-3', 'mb-2')} px-1`}>
          Task
        </p>
        <div className="space-y-0.5">
          {taskFilters.map((f) => (
            <button
              key={f}
              onClick={() => onTaskFilter(f as TaskFilter)}
              className={`
                w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium
                transition-all duration-150
                ${currentTask === f ? taskActiveColor(f, t) : t.sidebarItem}
              `}
            >
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${taskColor(f)} ${f === "All Tasks" ? "opacity-30" : "opacity-80"}`}
              />
              <span className="flex-1 text-left truncate">{f}</span>
              <span className={`text-[11px] tabular-nums font-semibold ${currentTask === f ? "" : t.textMuted}`}>
                {taskCounts[f]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {onSavedToggle && (
        <div>
          <button
            onClick={onSavedToggle}
            className={`
              w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium
              transition-all duration-150
              ${savedOnly ? t.sidebarActive : t.sidebarItem}
            `}
          >
            <Bookmark size={14} className="shrink-0" />
            <span className="flex-1 text-left">Saved only</span>
            <span className={`text-[11px] tabular-nums font-semibold ${savedOnly ? "" : t.textMuted}`}>
              {savedCount}
            </span>
          </button>
        </div>
      )}

      {/* Popular toggle */}
      <div>
        <button
          onClick={onPopularToggle}
          className={`
            w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium
            transition-all duration-150
            ${popularOnly ? t.sidebarActive : t.sidebarItem}
          `}
        >
          <Star size={14} className={popularOnly ? "fill-current" : ""} />
          <span className="flex-1 text-left">Popular only</span>
          <span className={`text-[11px] tabular-nums font-semibold ${popularOnly ? "" : t.textMuted}`}>
            {popularCount}
          </span>
        </button>
      </div>

      {/* Result count */}
      <div className={`text-[11px] px-1 ${t.textMuted}`}>
        Showing <span className={`font-bold ${t.textSecondary}`}>{filteredCount}</span> of {entries.length} entries
      </div>
    </aside>
  );
});
