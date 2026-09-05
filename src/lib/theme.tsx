import { createContext, useContext } from "react";
import type { Theme } from "../types";

export const ThemeContext = createContext<{
  theme: Theme;
  resolvedTheme: "amoled" | "light";
  setTheme: (t: Theme) => void;
}>({ theme: "system", resolvedTheme: "amoled", setTheme: () => {} });

export const useTheme = () => useContext(ThemeContext);

// Token map — all Tailwind classes indexed by theme
type TokenMap = Record<string, string>;

const darkTokens: TokenMap = {
  // Layout
  page: "bg-neutral-900 text-white",
  surface: "bg-white/[0.03] border border-white/8",
  surface2: "bg-white/[0.05] border border-white/8",
  surfaceHover: "hover:bg-white/[0.07]",
  // Text
  textPrimary: "text-white",
  textSecondary: "text-white/55",
  textMuted: "text-white/35",
  textAccent: "text-white",
  // Borders
  border: "border-white/7",
  borderHover: "hover:border-white/20",
  // Input
  input: "bg-neutral-900 border-white/8 text-white placeholder:text-white/25 focus:border-white/20 focus:ring-1 focus:ring-white/10",
  // Buttons
  btnPrimary: "bg-white hover:bg-white/90 text-black font-bold",
  btnSecondary: "border-white/10 text-white/60 hover:text-white hover:border-white/25 hover:bg-white/4",
  btnGhost: "text-white/40 hover:text-white/80",
  // Pill active/inactive
  pillActive: "bg-white/10 border-white/20 text-white",
  pillInactive: "border-white/7 text-white/35 hover:border-white/15 hover:text-white/65",
  // Card
  card: "bg-white/[0.03] border border-white/8 hover:border-white/15 hover:bg-white/[0.05]",
  // Modal
  modal: "bg-neutral-800 border border-white/8",
  modalOverlay: "fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-neutral-950/80 backdrop-blur-md animate-[fadeIn_0.15s_ease-out]",
  sectionLabel: "text-[10px] font-semibold uppercase tracking-widest mb-3 text-white/35",
  iconBg: "bg-white/6 text-white/50",
  iconBgSolid: "bg-white/8 text-white",
  pillSmall: "text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-white/50 border border-white/8",
  // Nav
  nav: "bg-neutral-900 border border-white/8",
  // Code
  code: "bg-neutral-950 text-neutral-200 border border-white/5",
  // Stats
  statValue: "text-white",
  // Badge type
  badgeModel: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  badgeFramework: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  badgeDataset: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  badgePlatform: "bg-sky-500/10 text-sky-400 border border-sky-500/20",
  badgeAI: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
  // Badge task
  badgeNLP: "bg-teal-500/10 text-teal-400 border border-teal-500/20",
  badgeCV: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
  badgeMLOps: "bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20",
  badgeAudio: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  badgeMultimodal: "bg-violet-500/10 text-violet-400 border border-violet-500/20",
  badgeAICoding: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
  badgeImageGen: "bg-pink-500/10 text-pink-400 border border-pink-500/20",
  badgeVideoGen: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
  badgeProductivity: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  badgeEducation: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  badgeResearch: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
  // Popular
  popular: "bg-amber-500/10 text-amber-300 border border-amber-500/20",
  // Typography Colors
  textModel: "text-purple-400 font-bold",
  textFramework: "text-amber-400 font-bold",
  textDataset: "text-emerald-400 font-bold",
  textPlatform: "text-sky-400 font-bold",
  textAI: "text-rose-400 font-bold",
  textPopular: "text-amber-400 font-bold",
  // Icon Colors
  iconModel: "text-purple-400 bg-purple-500/10 border border-purple-500/20",
  iconFramework: "text-amber-400 bg-amber-500/10 border border-amber-500/20",
  iconDataset: "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20",
  iconPlatform: "text-sky-400 bg-sky-500/10 border border-sky-500/20",
  iconAI: "text-rose-400 bg-rose-500/10 border border-rose-500/20",
  // Sidebar
  sidebarItem: "text-white/40 hover:text-white/80 hover:bg-white/4",
  sidebarActive: "text-white bg-white/10",
  // Tag
  limitTag: "bg-red-500/8 text-red-400 border-red-500/15",
  errorToast: "bg-red-500/10 border-red-500/20 text-red-500",
  successToast: "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400",
  // Link
  link: "text-white/30 hover:text-white transition-colors font-semibold",
  // Scrollbar
  scrollbar: "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10",
};

const amoled: TokenMap = { ...darkTokens };

const light: TokenMap = {
  // Layout
  page: "bg-white text-neutral-900",
  surface: "bg-neutral-50/50 border border-neutral-200",
  surface2: "bg-neutral-100 border border-neutral-200",
  surfaceHover: "hover:bg-neutral-100/70",
  // Text
  textPrimary: "text-neutral-900",
  textSecondary: "text-neutral-500",
  textMuted: "text-neutral-400",
  textAccent: "text-neutral-900",
  // Borders
  border: "border-neutral-200",
  borderHover: "hover:border-neutral-300",
  // Input
  input: "bg-white border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-1 focus:ring-neutral-200",
  // Buttons
  btnPrimary: "bg-neutral-900 hover:bg-neutral-800 text-white font-bold",
  btnSecondary: "border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:border-neutral-300 hover:bg-neutral-50",
  btnGhost: "text-neutral-400 hover:text-neutral-700",
  // Pill active/inactive
  pillActive: "bg-neutral-950/10 border border-neutral-300 text-neutral-900",
  pillInactive: "border border-neutral-200 text-neutral-400 hover:border-neutral-300 hover:text-neutral-700",
  // Card
  card: "bg-white border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/30",
  // Modal
  modal: "bg-white border border-neutral-200 shadow-xl",
  modalOverlay: "fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-neutral-950/45 backdrop-blur-xs animate-[fadeIn_0.15s_ease-out]",
  sectionLabel: "text-[10px] font-semibold uppercase tracking-widest mb-3 text-neutral-400",
  iconBg: "bg-neutral-100 text-neutral-500",
  iconBgSolid: "bg-neutral-200 text-neutral-900",
  pillSmall: "text-[11px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200",
  // Nav
  nav: "bg-white border-b border-neutral-200",
  // Code
  code: "bg-neutral-50 text-neutral-800 border border-neutral-200",
  // Stats
  statValue: "text-neutral-900 font-bold",
  // Badge type
  badgeModel: "bg-purple-50 text-purple-700 border border-purple-200",
  badgeFramework: "bg-amber-50 text-amber-700 border border-amber-200",
  badgeDataset: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  badgePlatform: "bg-sky-50 text-sky-700 border border-sky-200",
  badgeAI: "bg-rose-50 text-rose-700 border border-rose-200",
  // Badge task
  badgeNLP: "bg-teal-50 text-teal-700 border border-teal-200",
  badgeCV: "bg-rose-50 text-rose-700 border border-rose-200",
  badgeMLOps: "bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200",
  badgeAudio: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  badgeMultimodal: "bg-violet-50 text-violet-700 border border-violet-200",
  badgeAICoding: "bg-cyan-50 text-cyan-700 border border-cyan-200",
  badgeImageGen: "bg-pink-50 text-pink-700 border border-pink-200",
  badgeVideoGen: "bg-orange-50 text-orange-700 border border-orange-200",
  badgeProductivity: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  badgeEducation: "bg-amber-50 text-amber-700 border border-amber-200",
  badgeResearch: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  // Popular
  popular: "bg-amber-50 text-amber-700 border border-amber-200",
  // Typography Colors
  textModel: "text-purple-600 font-bold",
  textFramework: "text-amber-600 font-bold",
  textDataset: "text-emerald-600 font-bold",
  textPlatform: "text-sky-600 font-bold",
  textAI: "text-rose-600 font-bold",
  textPopular: "text-amber-600 font-bold",
  // Icon Colors
  iconModel: "text-purple-600 bg-purple-50 border border-purple-200",
  iconFramework: "text-amber-600 bg-amber-50 border border-amber-200",
  iconDataset: "text-emerald-600 bg-emerald-50 border border-emerald-200",
  iconPlatform: "text-sky-600 bg-sky-50 border border-sky-200",
  iconAI: "text-rose-600 bg-rose-50 border border-rose-200",
  // Sidebar
  sidebarItem: "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100",
  sidebarActive: "text-neutral-900 bg-neutral-200/50 font-semibold",
  // Tag
  limitTag: "bg-red-50 text-red-600 border border-red-200",
  errorToast: "bg-red-50 border border-red-200 text-red-600",
  successToast: "bg-emerald-50 border border-emerald-200 text-emerald-700",
  // Link
  link: "text-neutral-400 hover:text-neutral-900 transition-colors font-semibold",
  // Scrollbar
  scrollbar: "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-200",
};

export const tokens = { amoled, light };

export function useTokens() {
  const { resolvedTheme } = useTheme();
  return tokens[resolvedTheme];
}

// Badge helpers
export function typeBadge(type: string, t: TokenMap) {
  return ({
    Model: t.badgeModel,
    Framework: t.badgeFramework,
    Dataset: t.badgeDataset,
    Platform: t.badgePlatform,
    AI: t.badgeAI,
  }[type] ?? t.pillInactive);
}

export function taskBadge(task: string, t: TokenMap) {
  return ({
    NLP: t.badgeNLP,
    "Computer Vision": t.badgeCV,
    MLOps: t.badgeMLOps,
    Audio: t.badgeAudio,
    Multimodal: t.badgeMultimodal,
    "AI Coding": t.badgeAICoding,
    "Image Generation": t.badgeImageGen,
    "Video Generation": t.badgeVideoGen,
    Productivity: t.badgeProductivity,
    Education: t.badgeEducation,
    Research: t.badgeResearch,
  }[task] ?? t.pillInactive);
}

export const TYPE_GLYPH: Record<string, string> = {
  Model: "◈", Framework: "⬡", Dataset: "◎", Platform: "◉", AI: "✦",
};

export function typeIcon(type: string, t: TokenMap) {
  return ({
    Model: t.iconModel,
    Framework: t.iconFramework,
    Dataset: t.iconDataset,
    Platform: t.iconPlatform,
    AI: t.iconAI,
  }[type] ?? t.pillInactive);
}

export function typeColorClass(type: string) {
  return ({
    All: "text-neutral-400 dark:text-neutral-500",
    AI: "text-rose-500 dark:text-rose-400",
    Model: "text-purple-500 dark:text-purple-400",
    Framework: "text-amber-500 dark:text-amber-400",
    Dataset: "text-emerald-500 dark:text-emerald-400",
    Platform: "text-sky-500 dark:text-sky-400",
  }[type] ?? "text-neutral-400");
}

export function taskColor(task: string) {
  return ({
    "All Tasks": "bg-neutral-500 dark:bg-neutral-400",
    NLP: "bg-teal-500",
    "Computer Vision": "bg-rose-500",
    MLOps: "bg-fuchsia-500",
    Audio: "bg-yellow-500",
    Multimodal: "bg-violet-500",
    "AI Coding": "bg-cyan-500",
    "Image Generation": "bg-pink-500",
    "Video Generation": "bg-orange-500",
    Productivity: "bg-emerald-500",
    Education: "bg-amber-500",
    Research: "bg-indigo-500",
  }[task] ?? "bg-neutral-500");
}

export function taskActiveColor(_task: string, t: TokenMap) {
  return t.sidebarActive;
}

export function typeActiveColor(_type: string, t: TokenMap) {
  return t.sidebarActive;
}
