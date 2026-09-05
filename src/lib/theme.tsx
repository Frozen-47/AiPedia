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
  badgeModel: "bg-white/10 text-white border border-white/20",
  badgeFramework: "bg-white/5 text-neutral-300 border border-white/15",
  badgeDataset: "bg-white/5 text-neutral-300 border border-white/15",
  badgePlatform: "bg-white/5 text-neutral-300 border border-white/15",
  badgeAI: "bg-white/5 text-neutral-300 border border-white/15",
  // Badge task
  badgeNLP: "bg-white/5 text-neutral-300 border border-white/10",
  badgeCV: "bg-white/5 text-neutral-300 border border-white/10",
  badgeMLOps: "bg-white/5 text-neutral-300 border border-white/10",
  badgeAudio: "bg-white/5 text-neutral-300 border border-white/10",
  badgeMultimodal: "bg-white/5 text-neutral-300 border border-white/10",
  badgeAICoding: "bg-white/5 text-neutral-300 border border-white/10",
  badgeImageGen: "bg-white/5 text-neutral-300 border border-white/10",
  badgeVideoGen: "bg-white/5 text-neutral-300 border border-white/10",
  badgeProductivity: "bg-white/5 text-neutral-300 border border-white/10",
  badgeEducation: "bg-white/5 text-neutral-300 border border-white/10",
  badgeResearch: "bg-white/5 text-neutral-300 border border-white/10",
  // Popular
  popular: "bg-white/10 text-white border border-white/15",
  // Typography Colors
  textModel: "text-white font-bold",
  textFramework: "text-neutral-200 font-bold",
  textDataset: "text-neutral-200 font-bold",
  textPlatform: "text-neutral-200 font-bold",
  textAI: "text-neutral-200 font-bold",
  textPopular: "text-white font-bold",
  // Icon Colors
  iconModel: "text-white bg-white/10 border border-white/10",
  iconFramework: "text-neutral-200 bg-white/10 border border-white/10",
  iconDataset: "text-neutral-200 bg-white/10 border border-white/10",
  iconPlatform: "text-neutral-200 bg-white/10 border border-white/10",
  iconAI: "text-neutral-200 bg-white/10 border border-white/10",
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
  badgeModel: "bg-neutral-900 text-white border border-neutral-800",
  badgeFramework: "bg-neutral-100 text-neutral-800 border border-neutral-300",
  badgeDataset: "bg-neutral-100 text-neutral-800 border border-neutral-300",
  badgePlatform: "bg-neutral-100 text-neutral-800 border border-neutral-300",
  badgeAI: "bg-neutral-100 text-neutral-800 border border-neutral-300",
  // Badge task
  badgeNLP: "bg-neutral-100 text-neutral-700 border border-neutral-200",
  badgeCV: "bg-neutral-100 text-neutral-700 border border-neutral-200",
  badgeMLOps: "bg-neutral-100 text-neutral-700 border border-neutral-200",
  badgeAudio: "bg-neutral-100 text-neutral-700 border border-neutral-200",
  badgeMultimodal: "bg-neutral-100 text-neutral-700 border border-neutral-200",
  badgeAICoding: "bg-neutral-100 text-neutral-700 border border-neutral-200",
  badgeImageGen: "bg-neutral-100 text-neutral-700 border border-neutral-200",
  badgeVideoGen: "bg-neutral-100 text-neutral-700 border border-neutral-200",
  badgeProductivity: "bg-neutral-100 text-neutral-700 border border-neutral-200",
  badgeEducation: "bg-neutral-100 text-neutral-700 border border-neutral-200",
  badgeResearch: "bg-neutral-100 text-neutral-700 border border-neutral-200",
  // Popular
  popular: "bg-neutral-100 text-neutral-800 border border-neutral-300",
  // Typography Colors
  textModel: "text-neutral-900 font-bold",
  textFramework: "text-neutral-800 font-bold",
  textDataset: "text-neutral-800 font-bold",
  textPlatform: "text-neutral-800 font-bold",
  textAI: "text-neutral-800 font-bold",
  textPopular: "text-neutral-900 font-bold",
  // Icon Colors
  iconModel: "text-white bg-neutral-900 border border-neutral-800",
  iconFramework: "text-neutral-800 bg-neutral-100 border border-neutral-300",
  iconDataset: "text-neutral-800 bg-neutral-100 border border-neutral-300",
  iconPlatform: "text-neutral-800 bg-neutral-100 border border-neutral-300",
  iconAI: "text-neutral-800 bg-neutral-100 border border-neutral-300",
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
  Model: "◈", Framework: "⬡", Dataset: "◎", Platform: "◉", AI: "🤖",
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
    AI: "text-neutral-900 dark:text-white",
    Model: "text-neutral-900 dark:text-white",
    Framework: "text-neutral-800 dark:text-neutral-200",
    Dataset: "text-neutral-800 dark:text-neutral-200",
    Platform: "text-neutral-800 dark:text-neutral-200",
  }[type] ?? "text-neutral-400");
}

export function taskColor(task: string) {
  return ({
    "All Tasks": "bg-neutral-500 dark:bg-neutral-400",
    NLP: "bg-neutral-400 dark:bg-neutral-300",
    "Computer Vision": "bg-neutral-400 dark:bg-neutral-300",
    MLOps: "bg-neutral-400 dark:bg-neutral-300",
    Audio: "bg-neutral-400 dark:bg-neutral-300",
    Multimodal: "bg-neutral-400 dark:bg-neutral-300",
    "AI Coding": "bg-neutral-400 dark:bg-neutral-300",
    "Image Generation": "bg-neutral-400 dark:bg-neutral-300",
    "Video Generation": "bg-neutral-400 dark:bg-neutral-300",
    Productivity: "bg-neutral-400 dark:bg-neutral-300",
    Education: "bg-neutral-400 dark:bg-neutral-300",
    Research: "bg-neutral-400 dark:bg-neutral-300",
  }[task] ?? "bg-neutral-500");
}

export function taskActiveColor(_task: string, t: TokenMap) {
  return t.sidebarActive;
}

export function typeActiveColor(_type: string, t: TokenMap) {
  return t.sidebarActive;
}
