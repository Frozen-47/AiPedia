import React from "react";
import { 
  ArrowLeft, 
  ArrowRight, 
  HelpCircle, 
  RefreshCw, 
  Lock, 
  Check, 
  Bookmark, 
  Sparkles, 
  GitCompare,
  Globe,
  Cpu,
  Zap,
  Palette,
  Target,
  Bot,
  Code2,
  Database,
  Cloud,
  Sliders,
  ShieldCheck,
  Unlock,
  FileText
} from "lucide-react";
import { useTokens, useTheme } from "../../lib/theme";
import type { Entry } from "../../types";
import { useAuth } from "../AuthContext";

interface WizardFinderProps {
  wizardStep: number;
  setWizardStep: (s: number) => void;
  wizardGoal: string | null;
  setWizardGoal: (g: string | null) => void;
  wizardCustomGoal: string;
  setWizardCustomGoal: (g: string) => void;
  wizardType: string | null;
  setWizardType: (t: string | null) => void;
  wizardLicense: string | null;
  setWizardLicense: (l: string | null) => void;
  wizardCustomLicense: string;
  setWizardCustomLicense: (l: string) => void;
  wizardRecommendations: Entry[];
  setSelected: (entry: Entry | null) => void;
  setTypeFilter: (f: string) => void;
  setSearchInput: (s: string) => void;
  setBrowseAll: (b: boolean) => void;
  setActiveView: (v: "landing" | "catalog") => void;
  bookmarks: string[];
  onToggleBookmark: (name: string) => void;
  setCompareToolA: (name: string) => void;
  setCompareToolB: (name: string) => void;
  setIsArena: (b: boolean) => void;
  setIsWizard: (b: boolean) => void;
}

export const WizardFinder: React.FC<WizardFinderProps> = ({
  wizardStep,
  setWizardStep,
  wizardGoal,
  setWizardGoal,
  wizardCustomGoal,
  setWizardCustomGoal,
  wizardType,
  setWizardType,
  wizardLicense,
  setWizardLicense,
  wizardCustomLicense,
  setWizardCustomLicense,
  wizardRecommendations,
  setSelected,
  setTypeFilter,
  setSearchInput,
  setBrowseAll,
  setActiveView,
  bookmarks,
  onToggleBookmark,
  setCompareToolA,
  setCompareToolB,
  setIsArena,
  setIsWizard,
}) => {
  const t = useTokens();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "amoled";
  const { user, openAuthModal } = useAuth();

  const cardBase = `group text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${t.card}`;
  const cardSelected = `group text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
    isDark 
      ? "bg-emerald-500/10 border-emerald-500/50 text-white shadow-lg shadow-emerald-500/5" 
      : "bg-emerald-50 border-emerald-300 text-emerald-950 shadow-md"
  }`;

  const steps = [
    { label: "Goal", step: 1 },
    { label: "Stack Layer", step: 2 },
    { label: "Licensing", step: 3 },
    { label: "Matches", step: 4 },
  ];

  // Logic to dynamically explain why a tool matches
  const getMatchInsights = (entry: Entry) => {
    const insights: string[] = [];
    
    // Type match
    insights.push(`Matches Target Stack: ${entry.type}`);

    // Goal match
    if (wizardCustomGoal && wizardCustomGoal.trim()) {
      const keywords = wizardCustomGoal
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter(w => w.length > 2);
      const text = `${entry.name} ${entry.task} ${entry.summary} ${entry.architecture}`.toLowerCase();
      const matched = keywords.filter(kw => text.includes(kw));
      if (matched.length > 0) {
        insights.push(`Matched terms: ${matched.slice(0, 2).join(", ")}`);
      } else {
        insights.push("Fits custom objective relevance");
      }
    } else {
      insights.push("Fits primary objective task");
    }

    // License match
    if (wizardCustomLicense && wizardCustomLicense.trim()) {
      insights.push(`Custom license match (${entry.license})`);
    } else {
      insights.push(`Licensing matched (${entry.license})`);
    }

    // Popularity check
    if (entry.popular) {
      insights.push("Popular Choice / Industry Standard");
    }

    return insights.slice(0, 3);
  };

  const topMatches = wizardRecommendations.slice(0, 3);
  const otherMatches = wizardRecommendations.slice(3);

  return (
    <div
      id="wizard"
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
          <h3 className={`text-xl font-bold mb-2 tracking-tight ${t.textPrimary}`}>Unlock Personalized AI Finder</h3>
          <p className={`text-[13px] mb-6 max-w-95 leading-relaxed mx-auto ${t.textSecondary}`}>
            Sign in to answer our interactive discovery quiz and get custom asset recommendations matched specifically to your development stack and licensing policies.
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

      {/* Main content which is blurred/inert if not logged in */}
      <div 
        className={!user ? "filter blur-xs pointer-events-none select-none" : ""}
        {...(!user ? { inert: true } : {})}
      >
        {/* Badge & Progress */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-full border ${t.pillInactive}`}>Discovery Wizard</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
          </div>
          {wizardStep > 0 && (
            <div className="flex items-center gap-1">
              <span className={`text-[10px] font-extrabold uppercase tracking-widest ${t.textMuted}`}>Progress: </span>
              <span className={`text-[11px] font-black text-emerald-400`}>
                {Math.round(((wizardStep - 1) / 3) * 100)}%
              </span>
            </div>
          )}
        </div>

        {/* Interactive Stepper */}
        {wizardStep > 0 && (
          <div className="mb-8 select-none max-w-2xl mx-auto">
            <div className="flex items-center justify-between relative">
              {/* Background line */}
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-slate-200/40 dark:bg-white/5 -translate-y-1/2 z-0" />
              {/* Active progress fill */}
              <div 
                className="absolute top-1/2 left-0 h-[2px] bg-gradient-to-r from-emerald-500 to-teal-400 -translate-y-1/2 z-0 transition-all duration-500" 
                style={{ width: `${((wizardStep - 1) / 3) * 100}%` }}
              />
              
              {steps.map((s, idx) => {
                const isCompleted = wizardStep > s.step;
                const isActive = wizardStep === s.step;
                return (
                  <button
                    key={s.step}
                    disabled={!isCompleted}
                    onClick={() => setWizardStep(s.step)}
                    className={`relative z-10 flex flex-col items-center gap-1.5 focus:outline-none transition-all duration-300 ${
                      isCompleted ? "cursor-pointer" : "cursor-default"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs shadow-md transition-all duration-500 ${
                      isActive 
                        ? "bg-emerald-500 border-emerald-400 text-white scale-110 ring-4 ring-emerald-500/20" 
                        : isCompleted 
                          ? "bg-teal-500 border-teal-400 text-white hover:scale-105" 
                          : isDark
                            ? "bg-neutral-850 border-white/8 text-white/40"
                            : "bg-neutral-100 border-neutral-200 text-neutral-400"
                    }`}>
                      {isCompleted ? <Check size={12} /> : idx + 1}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${
                      isActive 
                        ? "text-emerald-400 font-extrabold" 
                        : isCompleted 
                          ? t.textPrimary 
                          : t.textMuted
                    }`}>
                      {s.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 0 — Intro */}
        {wizardStep === 0 && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-4">
            <div className="flex-1 text-left">
              <h3 className={`text-xl font-bold tracking-tight mb-2 ${t.textPrimary}`}>
                Personalized AI Discovery Wizard
              </h3>
              <p className={`text-[13px] leading-relaxed max-w-2xl font-light ${t.textSecondary}`}>
                Answer a few quick questions about your development targets, preferred integration layers, and open-source policies to identify the absolute best matches from our registry of 150+ high-fidelity AI tools.
              </p>
            </div>
            <button
              onClick={() => setWizardStep(1)}
              className={`px-5 py-3 rounded-xl font-bold text-[13px] tracking-wide transition-all duration-300 flex items-center gap-2 cursor-pointer ${t.btnPrimary}`}
            >
              <HelpCircle size={15} />
              Launch Discovery Quiz
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Step 1 — Goal */}
        {wizardStep === 1 && (
          <div className="flex flex-col gap-6 animate-[fadeIn_0.3s_ease-out]">
            <div className="flex items-center justify-between border-b border-dashed border-slate-200/40 dark:border-white/4 pb-3">
              <div className="text-left">
                <span className={`text-[10px] font-extrabold uppercase tracking-widest ${t.textMuted}`}>Step 1 of 3</span>
                <h4 className={`text-base font-bold ${t.textPrimary}`}>What is your primary development objective?</h4>
              </div>
              <button 
                onClick={() => {
                  setWizardStep(0);
                  setWizardGoal(null);
                  setWizardCustomGoal("");
                }} 
                className={`text-[11px] font-semibold flex items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer ${t.textMuted}`}
              >
                <ArrowLeft size={12} /> Cancel
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { key: "web",      icon: Globe, title: "Build Web Apps",           desc: "Chat clients, vector searches, runtime engines." },
                { key: "train",    icon: Cpu, title: "Model Tuning",             desc: "Fine-tune foundational weights, optimize params." },
                { key: "scale",    icon: Zap, title: "Scale API Serving",         desc: "GPU inference runtimes, scaling benchmarks." },
                { key: "creative", icon: Palette, title: "Creative Media",           desc: "Image/video synthesis, audio generation." },
                { key: "other",    icon: Target, title: "Other Goal",               desc: "Enter a custom objective or keyword search." },
              ].map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.key}
                    onClick={() => { 
                      setWizardGoal(opt.key); 
                      if (opt.key !== "other") {
                        setWizardCustomGoal("");
                        setWizardStep(2);
                      }
                    }}
                    className={wizardGoal === opt.key ? cardSelected : cardBase}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center mb-3">
                      <Icon size={18} className="text-white" />
                    </div>
                    <h5 className="font-bold text-[13px] mb-1 transition-colors">{opt.title}</h5>
                    <p className={`text-[11px] leading-normal font-light ${t.textMuted}`}>{opt.desc}</p>
                  </button>
                );
              })}
            </div>

            {wizardGoal === "other" && (
              <div className={`p-5 rounded-2xl border text-left mt-2 animate-[fadeIn_0.2s_ease-out] ${t.surface2}`}>
                <label className={`block text-[11px] font-extrabold uppercase tracking-wider mb-2 ${t.textSecondary}`}>
                  Describe your target application or enter search keywords:
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="e.g. Sentiment analysis, robotics, rust developer tools..."
                    value={wizardCustomGoal}
                    onChange={(e) => setWizardCustomGoal(e.target.value)}
                    className={`flex-1 p-3 rounded-xl text-sm font-medium border focus:outline-none transition-all ${t.input}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && wizardCustomGoal.trim()) {
                        setWizardStep(2);
                      }
                    }}
                  />
                  <button
                    disabled={!wizardCustomGoal.trim()}
                    onClick={() => setWizardStep(2)}
                    className={`px-5 py-3 rounded-xl font-bold text-[12px] uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                      wizardCustomGoal.trim() ? t.btnPrimary : "opacity-40 cursor-not-allowed bg-neutral-700 text-neutral-400"
                    }`}
                  >
                    Continue <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2 — Stack layer */}
        {wizardStep === 2 && (
          <div className="flex flex-col gap-6 animate-[fadeIn_0.3s_ease-out]">
            <div className="flex items-center justify-between border-b border-dashed border-slate-200/40 dark:border-white/4 pb-3">
              <div className="text-left">
                <span className={`text-[10px] font-extrabold uppercase tracking-widest ${t.textMuted}`}>Step 2 of 3</span>
                <h4 className={`text-base font-bold ${t.textPrimary}`}>Which layer of the stack are you targeting?</h4>
              </div>
              <button onClick={() => setWizardStep(1)} className={`text-[11px] font-semibold flex items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer ${t.textMuted}`}>
                <ArrowLeft size={12} /> Back
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { key: "AI",        icon: Bot, title: "AI Assistants & Agents",     desc: "Chatbots, coding copilots, and client application layers." },
                { key: "Model",     icon: Cpu, title: "Neural Weights & Models",     desc: "Raw base weights, foundational LLMs, and checkpoints." },
                { key: "Framework", icon: Code2, title: "ML Frameworks & Libraries",  desc: "Developer toolkits, ML pipelines, and local SDKs." },
                { key: "Dataset",   icon: Database, title: "Curated Datasets",           desc: "Training corpora, academic datasets, and eval suites." },
                { key: "Platform",  icon: Cloud, title: "Platforms & GPU Runtimes",    desc: "Inference scaling engines, serverless hosting and MLOps." },
                { key: "other",     icon: Sliders, title: "Other / Any Layer",          desc: "Search across all categories without restricting to one." },
              ].map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.key}
                    onClick={() => { setWizardType(opt.key); setWizardStep(3); }}
                    className={wizardType === opt.key ? cardSelected : cardBase}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center mb-3">
                      <Icon size={18} className="text-white" />
                    </div>
                    <h5 className={`font-bold text-[13px] mb-1 transition-colors ${t.textPrimary}`}>{opt.title}</h5>
                    <p className={`text-[11px] leading-normal font-light ${t.textMuted}`}>{opt.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3 — License */}
        {wizardStep === 3 && (
          <div className="flex flex-col gap-6 animate-[fadeIn_0.3s_ease-out]">
            <div className="flex items-center justify-between border-b border-dashed border-slate-200/40 dark:border-white/4 pb-3">
              <div className="text-left">
                <span className={`text-[10px] font-extrabold uppercase tracking-widest ${t.textMuted}`}>Step 3 of 3</span>
                <h4 className={`text-base font-bold ${t.textPrimary}`}>What is your licensing policy requirements?</h4>
              </div>
              <button onClick={() => setWizardStep(2)} className={`text-[11px] font-semibold flex items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer ${t.textMuted}`}>
                <ArrowLeft size={12} /> Back
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { key: "permissive", icon: ShieldCheck, title: "Permissive Open-Source Only", desc: "MIT, Apache 2.0, or BSD licenses that are low-risk for commercial codebases." },
                { key: "any",        icon: Unlock, title: "Any License / Proprietary API", desc: "No restrictions. Allows commercial usage clauses, SaaS developer APIs, or closed source weights." },
                { key: "other",      icon: FileText, title: "Other / Custom Policy",         desc: "Specify exact license keywords (e.g. GPL, proprietary) to query." },
              ].map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.key}
                    onClick={() => { 
                      setWizardLicense(opt.key); 
                      if (opt.key !== "other") {
                        setWizardCustomLicense("");
                        setWizardStep(4);
                      }
                    }}
                    className={wizardLicense === opt.key ? cardSelected : cardBase}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center mb-3">
                      <Icon size={18} className="text-white" />
                    </div>
                    <h5 className={`font-bold text-[13px] mb-1 transition-colors ${t.textPrimary}`}>{opt.title}</h5>
                    <p className={`text-[11px] leading-normal font-light ${t.textMuted}`}>{opt.desc}</p>
                  </button>
                );
              })}
            </div>

            {wizardLicense === "other" && (
              <div className={`p-5 rounded-2xl border text-left mt-2 animate-[fadeIn_0.2s_ease-out] ${t.surface2}`}>
                <label className={`block text-[11px] font-extrabold uppercase tracking-wider mb-2 ${t.textSecondary}`}>
                  Enter target license keywords:
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="e.g. GPL, Commercial, Proprietary, Creative Commons..."
                    value={wizardCustomLicense}
                    onChange={(e) => setWizardCustomLicense(e.target.value)}
                    className={`flex-1 p-3 rounded-xl text-sm font-medium border focus:outline-none transition-all ${t.input}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setWizardStep(4);
                      }
                    }}
                  />
                  <button
                    onClick={() => setWizardStep(4)}
                    className={`px-5 py-3 rounded-xl font-bold text-[12px] uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${t.btnPrimary}`}
                  >
                    Find Recommendations <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4 — Results */}
        {wizardStep === 4 && (
          <div className="flex flex-col gap-6 animate-[fadeIn_0.3s_ease-out]">
            <div className="flex items-center justify-between border-b border-dashed border-slate-200/40 dark:border-white/4 pb-3">
              <div className="text-left">
                <span className={`text-[10px] font-extrabold uppercase tracking-widest ${t.textMuted}`}>Quiz Completed</span>
                <h4 className={`text-base font-bold ${t.textPrimary}`}>Your Ideal AI Matches:</h4>
              </div>
              <button
                onClick={() => {
                  setWizardStep(0);
                  setWizardGoal(null);
                  setWizardCustomGoal("");
                  setWizardType(null);
                  setWizardLicense(null);
                  setWizardCustomLicense("");
                }}
                className={`text-[11px] font-semibold flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer ${t.textPrimary}`}
              >
                <RefreshCw size={12} /> Reset Finder Quiz
              </button>
            </div>

            {/* Top 3 featured matches */}
            <div className="text-left">
              <h5 className={`text-[10px] font-extrabold uppercase tracking-widest mb-3 flex items-center gap-1.5 text-emerald-400`}>
                <Sparkles size={12} />
                Best Fits (Top Matches)
              </h5>
              
              {topMatches.length === 0 ? (
                <div className={`p-8 text-center border border-dashed rounded-2xl ${t.border}`}>
                  <p className={`text-sm ${t.textSecondary}`}>No matching entries found for your specific query combination.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {topMatches.map((entry, idx) => {
                    const isB = bookmarks.includes(entry.name);
                    const matchPercent = 99 - idx * 3;
                    const insights = getMatchInsights(entry);
                    
                    return (
                      <div
                        key={idx}
                        className={`relative p-6 rounded-2xl flex flex-col transition-all duration-300 border hover:shadow-lg ${t.card} ${
                          isDark ? "hover:border-emerald-500/20" : "hover:border-emerald-200"
                        }`}
                      >
                        <div className="absolute top-4 right-4">
                          <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                            isDark
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                              : "bg-emerald-50 border-emerald-200 text-emerald-700"
                          }`}>
                            {matchPercent}% Match
                          </span>
                        </div>

                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 w-fit rounded-md border mb-3 ${t.pillSmall}`}>
                          {entry.type}
                        </span>

                        <h5 className={`font-bold text-[15px] mb-0.5 ${t.textPrimary}`}>{entry.name}</h5>
                        <span className={`text-[10px] ${t.textMuted} mb-3`}>by {entry.org}</span>
                        <p className={`text-[11.5px] leading-relaxed font-light mb-4 line-clamp-3 ${t.textSecondary}`}>
                          {entry.summary}
                        </p>

                        {/* Match Insights bullets */}
                        <div className={`mb-5 p-3 rounded-xl border text-[10px] leading-relaxed ${t.surface2} ${t.border}`}>
                          <p className={`font-bold uppercase tracking-wider text-[9px] mb-1.5 ${t.textMuted}`}>Match Insights</p>
                          <ul className="space-y-1 text-left list-none">
                            {insights.map((ins, i) => (
                              <li key={i} className="flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                <span className={t.textSecondary}>{ins}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className={`mt-auto pt-4 border-t border-dashed ${t.border} flex flex-wrap gap-2 items-center justify-between`}>
                          <span className={`text-[10px] font-semibold ${t.textSecondary}`}>{entry.license}</span>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => onToggleBookmark(entry.name)}
                              className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                                isB
                                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                                  : t.btnSecondary
                              }`}
                              title={isB ? "Remove Bookmark" : "Bookmark Asset"}
                            >
                              <Bookmark size={13} className={isB ? "fill-current" : ""} />
                            </button>
                            <button
                              onClick={() => setSelected(entry)}
                              className={`text-[9px] font-extrabold uppercase px-2.5 py-1.5 rounded-lg border cursor-pointer transition-colors ${t.btnSecondary}`}
                            >
                              Specs
                            </button>
                            <button
                              onClick={() => {
                                setTypeFilter(entry.type);
                                setSearchInput(entry.name);
                                setBrowseAll(true);
                                setActiveView("catalog");
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              className={`text-[9px] font-extrabold uppercase px-2.5 py-1.5 rounded-lg border cursor-pointer transition-colors ${t.btnSecondary}`}
                            >
                              Decks
                            </button>
                            <button
                              onClick={() => {
                                setCompareToolA(entry.name);
                                const alt = wizardRecommendations.find(r => r.name !== entry.name && r.type === entry.type);
                                if (alt) setCompareToolB(alt.name);
                                setIsArena(true);
                                setIsWizard(false);
                                setTimeout(() => {
                                  const el = document.getElementById("arena");
                                  if (el) el.scrollIntoView({ behavior: "smooth" });
                                }, 100);
                              }}
                              className={`text-[9px] font-extrabold uppercase px-2.5 py-1.5 rounded-lg cursor-pointer flex items-center gap-1 transition-all ${t.btnPrimary}`}
                            >
                              <GitCompare size={10} /> Compare
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Other matches section */}
            {otherMatches.length > 0 && (
              <div className="mt-6 border-t border-dashed border-slate-200/40 dark:border-white/5 pt-6 text-left">
                <h5 className={`text-[10px] font-extrabold uppercase tracking-widest mb-3.5 flex items-center gap-1.5 ${t.textSecondary}`}>
                  <Sparkles size={12} className="text-emerald-400/80" />
                  Other Recommendations & Alternatives
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {otherMatches.map((entry, idx) => {
                    const isB = bookmarks.includes(entry.name);
                    return (
                      <div
                        key={idx + 3}
                        className={`p-4 rounded-xl flex flex-col transition-all duration-300 border ${t.card}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border ${t.pillSmall}`}>
                            {entry.type}
                          </span>
                          <span className={`text-[9px] font-bold text-emerald-400/80`}>
                            Alternative Fit
                          </span>
                        </div>
                        
                        <h5 className={`font-bold text-[13px] mb-0.5 ${t.textPrimary}`}>{entry.name}</h5>
                        <span className={`text-[9px] ${t.textMuted} mb-2.5`}>by {entry.org}</span>
                        <p className={`text-[10.5px] leading-relaxed font-light mb-3 line-clamp-2 ${t.textSecondary}`}>{entry.summary}</p>
                        
                        <div className={`mt-auto pt-2.5 border-t border-dashed ${t.border} flex flex-wrap gap-1.5 items-center justify-between`}>
                          <span className={`text-[9px] font-semibold ${t.textSecondary}`}>{entry.license}</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => onToggleBookmark(entry.name)}
                              className={`p-1.5 rounded-md border cursor-pointer flex items-center justify-center transition-all ${
                                isB
                                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                                  : t.btnSecondary
                              }`}
                            >
                              <Bookmark size={11} className={isB ? "fill-current" : ""} />
                            </button>
                            <button
                              onClick={() => setSelected(entry)}
                              className={`text-[8px] font-extrabold uppercase px-2 py-1 rounded-md border cursor-pointer transition-colors ${t.btnSecondary}`}
                            >
                              Specs
                            </button>
                            <button
                              onClick={() => {
                                setTypeFilter(entry.type);
                                setSearchInput(entry.name);
                                setBrowseAll(true);
                                setActiveView("catalog");
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              className={`text-[8px] font-extrabold uppercase px-2 py-1 rounded-md border cursor-pointer transition-colors ${t.btnSecondary}`}
                            >
                              Decks
                            </button>
                            <button
                              onClick={() => {
                                setCompareToolA(entry.name);
                                const alt = wizardRecommendations.find(r => r.name !== entry.name && r.type === entry.type);
                                if (alt) setCompareToolB(alt.name);
                                setIsArena(true);
                                setIsWizard(false);
                                setTimeout(() => {
                                  const el = document.getElementById("arena");
                                  if (el) el.scrollIntoView({ behavior: "smooth" });
                                }, 100);
                              }}
                              className={`text-[8px] font-extrabold uppercase px-2 py-1 rounded-md cursor-pointer flex items-center gap-0.5 ${t.btnPrimary}`}
                            >
                              <GitCompare size={8} /> Compare
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
