import { memo } from "react";
import { Star, ChevronRight, Bookmark } from "lucide-react";
import { useTokens, typeBadge, taskBadge, TYPE_GLYPH, typeIcon } from "../lib/theme";
import type { Entry, EntryRatingSummary } from "../types";

interface EntryCardProps {
  entry: Entry;
  entryName: string;
  onSelect: (name: string) => void;
  index: number;
  ratingSummary?: EntryRatingSummary;
  isBookmarked?: boolean;
  onToggleBookmark?: (name: string) => void;
}

export const EntryCard = memo(function EntryCard({
  entry,
  entryName,
  onSelect,
  index,
  ratingSummary,
  isBookmarked,
  onToggleBookmark,
}: EntryCardProps) {
  const t = useTokens();
  const animate = index < 8;
  const isNew = entry.created_at
    ? (new Date().getTime() - new Date(entry.created_at).getTime()) / (1000 * 60 * 60 * 24) <= 2
    : false;

  return (
    <article
      onClick={() => onSelect(entryName)}
      style={animate ? { animationDelay: `${index * 30}ms` } : undefined}
      className={`
        group flex flex-col rounded-xl p-5 cursor-pointer glow-card transition-all ${
          isNew
            ? "border-white/25 ring-1 ring-white/10 shadow-sm bg-white/[0.02] hover:border-white/50"
            : t.card
        }
        [content-visibility:auto]
        ${animate ? "animate-fade-in-up" : ""}
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-[17px] font-bold shrink-0 ${typeIcon(entry.type, t)}`}>
          {TYPE_GLYPH[entry.type] ?? "◆"}
        </div>
        <div className="flex items-center gap-1 flex-wrap justify-end">
          {onToggleBookmark && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(entryName);
              }}
              className={`p-1.5 rounded-lg border transition-colors ${
                isBookmarked
                  ? "border-white/30 text-white bg-white/15"
                  : `${t.surface} ${t.border} ${t.textMuted} opacity-0 group-hover:opacity-100`
              } ${isBookmarked ? "opacity-100" : ""}`}
              aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
            >
              <Bookmark size={12} className={isBookmarked ? "fill-current" : ""} />
            </button>
          )}
          {isNew && (
            <span className="inline-flex items-center text-[8px] font-black uppercase px-2 py-0.5 rounded bg-white/15 text-white border border-white/25 animate-pulse">
              NEW
            </span>
          )}
          {entry.popular && (
            <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border ${t.popular}`}>
              <Star size={7} className="fill-current" /> Popular
            </span>
          )}
          <span className={`text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-lg border ${typeBadge(entry.type, t)}`}>
            {entry.type}
          </span>
        </div>
      </div>

      <h3 className={`text-[15px] font-black tracking-tight leading-tight mb-0.5 ${t.textPrimary}`}>
        {entry.name}
      </h3>
      <p className={t.sectionLabel}>
        {entry.org}
      </p>

      <p className={`text-[12.5px] leading-relaxed line-clamp-2 flex-1 mb-4 ${t.textSecondary}`}>
        {entry.summary}
      </p>

      <div className="mb-3">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border ${taskBadge(entry.task, t)}`}>
          {entry.task}
        </span>
      </div>

      <div className={`flex items-center justify-between pt-3 border-t ${t.border}`}>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className={`text-[11px] font-mono truncate max-w-full ${t.textMuted}`}>
            {entry.size}
          </span>
          {ratingSummary && ratingSummary.count > 0 && (
            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${t.textSecondary}`}>
              <Star size={10} className="fill-amber-400 text-amber-400 shrink-0" />
              {ratingSummary.average.toFixed(1)}
              <span className={t.textMuted}>({ratingSummary.count})</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`text-[11px] ${t.textMuted}`}>{entry.year}</span>
          <ChevronRight
            size={13}
            className={`opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all ${t.textMuted}`}
          />
        </div>
      </div>
    </article>
  );
});
