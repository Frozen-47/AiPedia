import React, { useState } from "react";
import { useTokens, useTheme } from "../../lib/theme";
import type { Entry, EntryRatingSummary } from "../../types";
import { useAuth } from "../AuthContext";
import { Lock, ArrowLeftRight, ChevronDown, Star, Bookmark, Shield, AlertTriangle, Check, Bot, Cpu, Zap, Database, Cloud } from "lucide-react";

interface CompareArenaProps {
  entries: Entry[];
  compareToolA: string;
  setCompareToolA: (t: string) => void;
  compareToolB: string;
  setCompareToolB: (t: string) => void;
  setSelected: (entry: Entry | null) => void;
  ratingSummaries: Record<string, EntryRatingSummary>;
  bookmarks: string[];
}

export const CompareArena: React.FC<CompareArenaProps> = ({
  entries,
  compareToolA,
  setCompareToolA,
  compareToolB,
  setCompareToolB,
  setSelected,
  ratingSummaries,
  bookmarks,
}) => {
  const t = useTokens();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "amoled";
  const { user, openAuthModal } = useAuth();

  // Search and dropdown state for Competitor A
  const [searchA, setSearchA] = useState("");
  const [openA, setOpenA] = useState(false);

  // Search and dropdown state for Competitor B
  const [searchB, setSearchB] = useState("");
  const [openB, setOpenB] = useState(false);

  const entryA = entries.find((e) => e.name === compareToolA) || entries[0];
  const entryB = entries.find((e) => e.name === compareToolB) || entries[1] || entries[0];

  const presets = [
    { label: "GPT-4o vs Claude 3.5", a: "GPT-4o", b: "Claude 3.5 Sonnet" },
    { label: "Llama 3 vs Mistral 7B", a: "Llama 3 (70B)", b: "Mistral 7B" },
    { label: "PyTorch vs TensorFlow", a: "PyTorch", b: "TensorFlow" },
  ];

  const ratingA = ratingSummaries[entryA.name]?.average || 0;
  const countA = ratingSummaries[entryA.name]?.count || 0;
  const ratingB = ratingSummaries[entryB.name]?.average || 0;
  const countB = ratingSummaries[entryB.name]?.count || 0;

  const isPermissiveLicense = (lic: string) => {
    const l = lic.toLowerCase();
    return l.includes("mit") || l.includes("apache") || l.includes("bsd") || l.includes("public domain") || l.includes("cc0");
  };

  const renderStars = (rating: number) => {
    const rounded = Math.round(rating);
    return (
      <div className="flex items-center gap-0.5 text-amber-400">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={12}
            className={s <= rounded ? "fill-current text-amber-400" : "text-slate-200 dark:text-neutral-800"}
          />
        ))}
      </div>
    );
  };

  const renderTypeIcon = (type: string) => {
    switch (type) {
      case "AI": return <Bot size={20} className="text-white" />;
      case "Model": return <Cpu size={20} className="text-white" />;
      case "Framework": return <Zap size={20} className="text-white" />;
      case "Dataset": return <Database size={20} className="text-white" />;
      default: return <Cloud size={20} className="text-white" />;
    }
  };

  return (
    <div
      id="arena"
      className={`relative p-6 sm:p-8 rounded-[28px] border backdrop-blur-md transition-all duration-300 scroll-mt-24 overflow-hidden ${t.surface} shadow-xl`}
    >
      {/* Lock overlay if not logged in */}
      {!user && (
        <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center backdrop-blur-[6px] transition-colors duration-200 ${
          isDark ? "bg-neutral-900/90 text-white" : "bg-white/90 text-neutral-900"
        }`}>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg ${t.iconBgSolid}`}>
            <Lock size={24} />
          </div>
          <h3 className={`text-xl font-bold mb-2 tracking-tight ${t.textPrimary}`}>Unlock AI Arena</h3>
          <p className={`text-[13px] mb-6 max-w-95 leading-relaxed mx-auto ${t.textSecondary}`}>
            Sign in to run real-time side-by-side technical comparisons across different AI models, frameworks, datasets, and serving tools.
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

      {/* Dropdown Backdrop to close on click outside */}
      {(openA || openB) && (
        <div 
          className="fixed inset-0 z-20 cursor-default" 
          onClick={() => { setOpenA(false); setOpenB(false); }}
        />
      )}

      {/* Main content which is blurred/inert if not logged in */}
      <div 
        className={!user ? "filter blur-xs pointer-events-none select-none" : ""}
        {...(!user ? { inert: true } : {})}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div className="text-left">
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-full border ${t.pillInactive}`}>AI Arena</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
            </div>
            <h3 className={`text-xl font-bold tracking-tight mb-1.5 ${t.textPrimary}`}>
              Side-by-Side Spec Comparison
            </h3>
            <p className={`text-[13px] leading-relaxed max-w-xl font-light ${t.textSecondary}`}>
              Compare detailed specifications, licensing, limitations, and user rating metrics across different assets in our registry.
            </p>
          </div>

          {/* Preset matchups */}
          <div className="flex flex-wrap items-center gap-2 md:self-end">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${t.textMuted}`}>Matchups:</span>
            {presets.map((match, idx) => (
              <button
                key={idx}
                onClick={() => { setCompareToolA(match.a); setCompareToolB(match.b); }}
                className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold border transition-colors cursor-pointer ${t.pillInactive}`}
              >
                {match.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Autocomplete Selectors + Swap Button */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-end mb-6 text-left relative z-30">
          
          {/* Selector A */}
          <div className="flex flex-col gap-1.5 md:col-span-5 relative">
            <label className={`text-[10px] font-extrabold uppercase tracking-widest ${t.textMuted}`}>Competitor A</label>
            <button
              onClick={() => { setOpenA(!openA); setOpenB(false); }}
              className={`w-full p-3.5 rounded-xl border text-[13px] font-bold text-left focus:outline-none flex items-center justify-between transition-all ${t.input}`}
            >
              <span className="truncate">[{entryA.type.toUpperCase()}] {entryA.name}</span>
              <ChevronDown size={14} className={`transform transition-transform duration-250 shrink-0 ml-2 ${openA ? "rotate-180 text-emerald-400" : t.textMuted}`} />
            </button>

            {openA && (
              <div className={`absolute left-0 right-0 top-full mt-2 p-2 rounded-2xl border shadow-xl flex flex-col gap-2 ${t.modal} backdrop-blur-md max-h-64 z-40`}>
                <input
                  type="text"
                  placeholder="Search competitor..."
                  value={searchA}
                  onChange={(e) => setSearchA(e.target.value)}
                  className={`p-2.5 rounded-lg border text-[12px] font-semibold focus:outline-none transition-all ${t.input}`}
                  autoFocus
                />
                <div className="overflow-y-auto max-h-40 divide-y divide-white/5 scrollbar-thin">
                  {entries
                    .filter(e => e.name.toLowerCase().includes(searchA.toLowerCase()) || e.org.toLowerCase().includes(searchA.toLowerCase()))
                    .map((e) => (
                      <button
                        key={e.name}
                        onClick={() => {
                          setCompareToolA(e.name);
                          setOpenA(false);
                          setSearchA("");
                        }}
                        className={`w-full text-left p-2.5 text-[12px] font-bold transition-all flex justify-between items-center ${t.surfaceHover} ${
                          compareToolA === e.name ? "text-emerald-400 bg-emerald-500/5 font-black" : t.textSecondary
                        }`}
                      >
                        <span className="truncate mr-2">{e.name}</span>
                        <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded border shrink-0 ${t.pillSmall}`}>{e.type}</span>
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Animated Swap Column */}
          <div className="flex justify-center md:col-span-1 py-1">
            <button
              onClick={() => {
                const temp = compareToolA;
                setCompareToolA(compareToolB);
                setCompareToolB(temp);
              }}
              className={`p-3.5 rounded-xl border flex items-center justify-center cursor-pointer transition-all duration-300 hover:rotate-180 hover:scale-110 active:scale-95 shadow-md ${t.btnSecondary}`}
              title="Swap Competitors"
            >
              <ArrowLeftRight size={15} className="text-emerald-400" />
            </button>
          </div>

          {/* Selector B */}
          <div className="flex flex-col gap-1.5 md:col-span-5 relative">
            <label className={`text-[10px] font-extrabold uppercase tracking-widest ${t.textMuted}`}>Competitor B</label>
            <button
              onClick={() => { setOpenB(!openB); setOpenA(false); }}
              className={`w-full p-3.5 rounded-xl border text-[13px] font-bold text-left focus:outline-none flex items-center justify-between transition-all ${t.input}`}
            >
              <span className="truncate">[{entryB.type.toUpperCase()}] {entryB.name}</span>
              <ChevronDown size={14} className={`transform transition-transform duration-250 shrink-0 ml-2 ${openB ? "rotate-180 text-emerald-400" : t.textMuted}`} />
            </button>

            {openB && (
              <div className={`absolute left-0 right-0 top-full mt-2 p-2 rounded-2xl border shadow-xl flex flex-col gap-2 ${t.modal} backdrop-blur-md max-h-64 z-40`}>
                <input
                  type="text"
                  placeholder="Search competitor..."
                  value={searchB}
                  onChange={(e) => setSearchB(e.target.value)}
                  className={`p-2.5 rounded-lg border text-[12px] font-semibold focus:outline-none transition-all ${t.input}`}
                  autoFocus
                />
                <div className="overflow-y-auto max-h-40 divide-y divide-white/5 scrollbar-thin">
                  {entries
                    .filter(e => e.name.toLowerCase().includes(searchB.toLowerCase()) || e.org.toLowerCase().includes(searchB.toLowerCase()))
                    .map((e) => (
                      <button
                        key={e.name}
                        onClick={() => {
                          setCompareToolB(e.name);
                          setOpenB(false);
                          setSearchB("");
                        }}
                        className={`w-full text-left p-2.5 text-[12px] font-bold transition-all flex justify-between items-center ${t.surfaceHover} ${
                          compareToolB === e.name ? "text-emerald-400 bg-emerald-500/5 font-black" : t.textSecondary
                        }`}
                      >
                        <span className="truncate mr-2">{e.name}</span>
                        <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded border shrink-0 ${t.pillSmall}`}>{e.type}</span>
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Competitor Cards Header */}
        {entryA && entryB && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-left">
            {/* Card A */}
            <div className={`p-5 rounded-2xl border flex items-center justify-between gap-4 transition-all hover:shadow-md ${t.card}`}>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
                  {renderTypeIcon(entryA.type)}
                </div>
                <div>
                  <h4 className={`text-base font-bold flex items-center gap-1.5 ${t.textPrimary}`}>
                    {entryA.name}
                    {bookmarks.includes(entryA.name) && <Bookmark size={11} className="text-emerald-400 fill-current shrink-0" />}
                  </h4>
                  <p className={`text-[11px] ${t.textSecondary}`}>by {entryA.org}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border block mb-1 w-fit ml-auto ${t.pillSmall}`}>
                  {entryA.type}
                </span>
                {ratingA > 0 ? (
                  <div className="flex flex-col items-end gap-0.5">
                    {renderStars(ratingA)}
                    <span className={`text-[9px] ${t.textMuted}`}>{ratingA.toFixed(1)} ★ ({countA} revs)</span>
                  </div>
                ) : (
                  <span className={`text-[9px] ${t.textMuted}`}>No reviews</span>
                )}
              </div>
            </div>

            {/* Card B */}
            <div className={`p-5 rounded-2xl border flex items-center justify-between gap-4 transition-all hover:shadow-md ${t.card}`}>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
                  {renderTypeIcon(entryB.type)}
                </div>
                <div>
                  <h4 className={`text-base font-bold flex items-center gap-1.5 ${t.textPrimary}`}>
                    {entryB.name}
                    {bookmarks.includes(entryB.name) && <Bookmark size={11} className="text-emerald-400 fill-current shrink-0" />}
                  </h4>
                  <p className={`text-[11px] ${t.textSecondary}`}>by {entryB.org}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border block mb-1 w-fit ml-auto ${t.pillSmall}`}>
                  {entryB.type}
                </span>
                {ratingB > 0 ? (
                  <div className="flex flex-col items-end gap-0.5">
                    {renderStars(ratingB)}
                    <span className={`text-[9px] ${t.textMuted}`}>{ratingB.toFixed(1)} ★ ({countB} revs)</span>
                  </div>
                ) : (
                  <span className={`text-[9px] ${t.textMuted}`}>No reviews</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Spec table */}
        {entryA && entryB && (
          <div className={`border rounded-2xl overflow-hidden shadow-sm ${t.border}`}>
            {[
              { label: "Developer",            a: entryA.org,          b: entryB.org },
              { label: "Category",             a: entryA.type,         b: entryB.type,         badge: true },
              { label: "Primary Task",         a: entryA.task,         b: entryB.task },
              { 
                label: "Rating Metrics", 
                a: ratingA > 0 ? `${ratingA.toFixed(1)} ★ (${countA} reviews)` : "No reviews", 
                b: ratingB > 0 ? `${ratingB.toFixed(1)} ★ (${countB} reviews)` : "No reviews",
                ratingAdv: ratingA !== ratingB 
              },
              { label: "Year Released",        a: entryA.year.toString(), b: entryB.year.toString() },
              { 
                label: "Licensing",            
                a: entryA.license,      
                b: entryB.license,
                shield: true
              },
              { label: "Scope Size",           a: entryA.size,         b: entryB.size },
              { label: "Key Benchmarks",       a: entryA.benchmarks || "N/A", b: entryB.benchmarks || "N/A", full: true },
              { label: "Known Limitations",    a: entryA.limitations || "None reported", b: entryB.limitations || "None reported", full: true, warning: true },
              { label: "Architecture Overview",a: entryA.architecture, b: entryB.architecture },
              { label: "Technical Summary",    a: entryA.summary,      b: entryB.summary,      full: true },
            ].map((row, i) => {
              const differs = row.a !== row.b;
              return (
                <div
                  key={i}
                  className={`grid grid-cols-1 md:grid-cols-5 border-b last:border-b-0 text-[12px] leading-relaxed transition-colors ${
                    t.border} ${t.surfaceHover} ${differs && !row.full ? (isDark ? "bg-white/[0.005]" : "bg-neutral-50/30") : ""}`}
                >
                  <div
                    className={`p-3 md:pl-5 md:col-span-1 font-bold border-b md:border-b-0 md:border-r flex items-center text-left uppercase tracking-wider text-[10px] ${t.surface2} ${t.border} ${t.textSecondary}`}
                  >
                    <span className="flex items-center gap-1.5">
                      {row.warning && <AlertTriangle size={10} className="text-amber-500 shrink-0" />}
                      {row.shield && <Shield size={10} className="text-emerald-400 shrink-0" />}
                      {row.label}
                    </span>
                  </div>

                  {[row.a, row.b].map((val, vi) => {
                    const isCompetitorA = vi === 0;
                    
                    // Specific highlight flags
                    let hasAdvantage = false;
                    if (row.ratingAdv) {
                      hasAdvantage = isCompetitorA ? (ratingA > ratingB) : (ratingB > ratingA);
                    }
                    if (row.shield) {
                      const compliance = isCompetitorA ? isPermissiveLicense(entryA.license) : isPermissiveLicense(entryB.license);
                      const peerCompliance = isCompetitorA ? isPermissiveLicense(entryB.license) : isPermissiveLicense(entryA.license);
                      if (compliance && !peerCompliance) {
                        hasAdvantage = true;
                      }
                    }

                    return (
                      <div
                        key={vi}
                        className={`p-3.5 md:col-span-2 ${vi === 0 ? `border-b md:border-b-0 md:border-r ${t.border}` : ""} ${t.textSecondary} flex items-center justify-between`}
                      >
                        <div className="flex items-center gap-2 text-left">
                          {row.badge ? (
                            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md border ${t.pillSmall}`}>
                              {val}
                            </span>
                          ) : (
                            <span className={row.full ? "font-light" : "font-semibold"}>{val}</span>
                          )}
                        </div>

                        {/* Show check/advantage badge if highlighted */}
                        {hasAdvantage && (
                          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-1 shrink-0 ${
                            isDark ? "bg-emerald-500/10 border border-emerald-500/25 text-emerald-400" : "bg-emerald-50 border border-emerald-200 text-emerald-700"
                          }`}>
                            <Check size={9} /> Adv
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* Action row */}
            <div
              className={`grid grid-cols-1 md:grid-cols-5 border-t text-[11px] leading-relaxed uppercase tracking-wider text-center ${t.border} ${t.surface2}`}
            >
              <div className={`hidden md:block md:col-span-1 border-r ${t.border}`} />
              <button
                onClick={() => setSelected(entryA)}
                className={`p-4 md:col-span-2 border-b md:border-b-0 md:border-r hover:bg-white/5 transition-colors cursor-pointer font-bold ${t.border} ${t.textPrimary}`}
              >
                Launch {entryA.name} Spec Details
              </button>
              <button
                onClick={() => setSelected(entryB)}
                className={`p-4 md:col-span-2 hover:bg-white/5 transition-colors cursor-pointer font-bold ${t.textPrimary}`}
              >
                Launch {entryB.name} Spec Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
