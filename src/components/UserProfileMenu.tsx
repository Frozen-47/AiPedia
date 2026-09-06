import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  Link2,
  Check,
  LogOut,
  Moon,
  Sun,
  Monitor,
  SlidersHorizontal,
  User,
  Bookmark,
  Shield,
  // Visual Redesign Icons
  GraduationCap,
  Brain,
  Code2,
  Cpu,
  Briefcase,
  Sparkles,
  HelpCircle,
  BookOpen,
  Terminal,
  Globe,
  Lock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useAuth } from "./AuthContext";
import { shareUrlForProfile } from "../lib/entryUrl";
import {
  onboardingOptions,
  parseProfileMeta,
  type OnboardingInterest,
  type OnboardingProfile,
  type ReferralSource,
  type UserRole,
} from "../lib/onboarding";
import { useTokens, useTheme } from "../lib/theme";
import { getOAuthAvatarUrl } from "../lib/supabase";

// Custom SVG Logos for platforms not in standard Lucide version
const GithubLogo = ({ className }: { className?: string }) => (
  <svg className={className || "w-3.5 h-3.5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinLogo = ({ className }: { className?: string }) => (
  <svg className={className || "w-3.5 h-3.5"} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);



// Premium Role Details for Visual Cards Grid
const ROLE_DETAILS: Record<
  UserRole,
  {
    label: string;
    description: string;
    icon: React.ComponentType<any>;
    color: string;
  }
> = {
  student: {
    label: "Student / Learner",
    description: "Tackling courses, looking for tutorials and foundational tools.",
    icon: GraduationCap,
    color: "indigo",
  },
  researcher: {
    label: "Researcher / Academic",
    description: "Analyzing SOTA models, datasets, and writing academic papers.",
    icon: Brain,
    color: "purple",
  },
  developer: {
    label: "Software Developer",
    description: "Building apps, integrating APIs, and shipping code quickly.",
    icon: Code2,
    color: "sky",
  },
  ml_engineer: {
    label: "ML Engineer",
    description: "Training, deploying, and scaling machine learning models in production.",
    icon: Cpu,
    color: "teal",
  },
  product: {
    label: "Product / Business",
    description: "Managing AI products, looking for market trends and integrations.",
    icon: Briefcase,
    color: "amber",
  },
  hobbyist: {
    label: "Hobbyist / Explorer",
    description: "Curious about cool new AI tools, art generation, and side projects.",
    icon: Sparkles,
    color: "pink",
  },
  other: {
    label: "Other",
    description: "Just curious and excited to explore what's happening in AI.",
    icon: HelpCircle,
    color: "neutral",
  },
};

const SELECTED_ROLE_STYLES: Record<string, string> = {
  indigo: "border-indigo-500 bg-indigo-500/8 text-indigo-400 dark:border-indigo-500 dark:bg-indigo-500/8 dark:text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.15)] ring-1 ring-indigo-500/30",
  purple: "border-purple-500 bg-purple-500/8 text-purple-400 dark:border-purple-500 dark:bg-purple-500/8 dark:text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)] ring-1 ring-purple-500/30",
  sky: "border-sky-500 bg-sky-500/8 text-sky-400 dark:border-sky-500 dark:bg-sky-500/8 dark:text-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.15)] ring-1 ring-sky-500/30",
  teal: "border-teal-500 bg-teal-500/8 text-teal-400 dark:border-teal-500 dark:bg-teal-500/8 dark:text-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.15)] ring-1 ring-teal-500/30",
  amber: "border-amber-500 bg-amber-500/8 text-amber-400 dark:border-amber-500 dark:bg-amber-500/8 dark:text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/30",
  pink: "border-pink-500 bg-pink-500/8 text-pink-400 dark:border-pink-500 dark:bg-pink-500/8 dark:text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.15)] ring-1 ring-pink-500/30",
  neutral: "border-neutral-400 bg-neutral-500/8 text-neutral-400 dark:border-neutral-500 dark:bg-neutral-500/8 dark:text-neutral-400 shadow-[0_0_15px_rgba(115,115,115,0.15)] ring-1 ring-neutral-500/30",
};

// Premium Interest Pill Styles with Glow Effects
const INTEREST_STYLES: Record<
  OnboardingInterest,
  {
    active: string;
    glow: string;
  }
> = {
  models: {
    active: "bg-gradient-to-r from-indigo-500 to-violet-600 border-indigo-400 text-white shadow-[0_0_12px_rgba(99,102,241,0.35)]",
    glow: "hover:shadow-[0_0_8px_rgba(99,102,241,0.2)] hover:border-indigo-400/50",
  },
  frameworks: {
    active: "bg-gradient-to-r from-blue-500 to-cyan-500 border-blue-400 text-white shadow-[0_0_12px_rgba(59,130,246,0.35)]",
    glow: "hover:shadow-[0_0_8px_rgba(59,130,246,0.2)] hover:border-blue-400/50",
  },
  datasets: {
    active: "bg-gradient-to-r from-emerald-500 to-teal-600 border-emerald-400 text-white shadow-[0_0_12px_rgba(16,185,129,0.35)]",
    glow: "hover:shadow-[0_0_8px_rgba(16,185,129,0.2)] hover:border-emerald-400/50",
  },
  platforms: {
    active: "bg-gradient-to-r from-indigo-500 to-purple-600 border-indigo-400 text-white shadow-[0_0_12px_rgba(99,102,241,0.35)]",
    glow: "hover:shadow-[0_0_8px_rgba(99,102,241,0.2)] hover:border-indigo-400/50",
  },
  nlp: {
    active: "bg-gradient-to-r from-teal-500 to-emerald-600 border-teal-400 text-white shadow-[0_0_12px_rgba(20,184,166,0.35)]",
    glow: "hover:shadow-[0_0_8px_rgba(20,184,166,0.2)] hover:border-teal-400/50",
  },
  vision: {
    active: "bg-gradient-to-r from-rose-500 to-red-600 border-rose-400 text-white shadow-[0_0_12px_rgba(244,63,94,0.35)]",
    glow: "hover:shadow-[0_0_8px_rgba(244,63,94,0.2)] hover:border-rose-400/50",
  },
  multimodal: {
    active: "bg-gradient-to-r from-violet-500 to-fuchsia-600 border-violet-400 text-white shadow-[0_0_12px_rgba(139,92,246,0.35)]",
    glow: "hover:shadow-[0_0_8px_rgba(139,92,246,0.2)] hover:border-violet-400/50",
  },
  mlops: {
    active: "bg-gradient-to-r from-fuchsia-500 to-pink-600 border-fuchsia-400 text-white shadow-[0_0_12px_rgba(217,70,239,0.35)]",
    glow: "hover:shadow-[0_0_8px_rgba(217,70,239,0.2)] hover:border-fuchsia-400/50",
  },
  coding: {
    active: "bg-gradient-to-r from-sky-500 to-blue-600 border-sky-400 text-white shadow-[0_0_12px_rgba(14,165,233,0.35)]",
    glow: "hover:shadow-[0_0_8px_rgba(14,165,233,0.2)] hover:border-sky-400/50",
  },
  media: {
    active: "bg-gradient-to-r from-orange-500 to-rose-500 border-orange-400 text-white shadow-[0_0_12px_rgba(249,115,22,0.35)]",
    glow: "hover:shadow-[0_0_8px_rgba(249,115,22,0.2)] hover:border-orange-400/50",
  },
};

interface UserProfileMenuProps {
  onboardingProfile: OnboardingProfile | null;
  onSave?: (
    profile: OnboardingProfile,
    meta?: {
      displayName?: string;
      username?: string;
      description?: string;
      github?: string;
      linkedin?: string;
      medium?: string;
      devto?: string;
      portfolio?: string;
    },
  ) => Promise<void>;
  onViewProfile?: (username: string) => void;
  onViewSaved?: () => void;
  onEditPreferences?: (section?: "profile" | "preferences") => void;
  onClose?: () => void;
  onViewAdminDashboard?: () => void;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
  onboardingProfile,
  onSave,
  onViewProfile,
  onViewSaved,
  onClose,
  onViewAdminDashboard,
}) => {
  const t = useTokens();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { user, signOut } = useAuth();

  const isDark = resolvedTheme === "amoled";

  const [currentView, setCurrentView] = useState<"main" | "profile" | "preferences">("main");
  const [linkCopied, setLinkCopied] = useState(false);
  const [saving, setSaving] = useState<"profile" | "preferences" | null>(null);

  const parsedMeta = useMemo(
    () => parseProfileMeta(onboardingProfile?.referralSource),
    [onboardingProfile?.referralSource],
  );

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [medium, setMedium] = useState("");
  const [devto, setDevto] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [role, setRole] = useState<UserRole | null>(null);
  const [interests, setInterests] = useState<OnboardingInterest[]>([]);

  const username = parsedMeta?.username || (user?.user_metadata?.username as string) || "";
  const email = user?.email || "";
  const avatarUrl = parsedMeta?.avatarUrl || getOAuthAvatarUrl(user);
  const firstName = parsedMeta?.displayName || (user?.user_metadata?.firstName as string) || "";
  const displayName = firstName || email.split("@")[0] || "User";
  const initials = displayName
    ? (displayName.split(/\s+/).map((n: string) => n[0]).slice(0, 2).join("")).toUpperCase()
    : (email ? email[0] : "U").toUpperCase();

  const [socialsExpanded, setSocialsExpanded] = useState(false);

  const wrapperCls = (readOnly: boolean) => [
    "relative flex items-center rounded-xl border transition-all duration-300 w-full",
    readOnly
      ? (isDark
          ? "bg-white/[0.01] border-white/5 opacity-60"
          : "bg-black/[0.01] border-black/5 opacity-60")
      : (isDark
          ? "bg-white/[0.02] border-white/8 hover:border-white/15 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/20 focus-within:shadow-[0_0_12px_rgba(99,102,241,0.08)]"
          : "bg-black/[0.01] border-black/8 hover:border-black/15 focus-within:border-indigo-600/50 focus-within:ring-1 focus-within:ring-indigo-600/20 focus-within:shadow-[0_0_12px_rgba(79,70,229,0.08)]")
  ].join(" ");

  const dividerCls = isDark ? "border-r border-white/5 text-white/35" : "border-r border-black/5 text-black/35";

  const innerInputCls = [
    "w-full bg-transparent px-3 py-2 text-xs font-medium outline-none border-none focus:ring-0 focus:outline-none",
    isDark ? "text-white placeholder:text-white/25" : "text-gray-900 placeholder:text-gray-400"
  ].join(" ");

  const innerTextareaCls = [
    "w-full bg-transparent px-3 py-2 text-xs font-medium outline-none border-none focus:ring-0 focus:outline-none resize-none",
    isDark ? "text-white placeholder:text-white/25" : "text-gray-900 placeholder:text-gray-400"
  ].join(" ");

  const renderInputWrapper = (
    icon: React.ComponentType<any>,
    label: string,
    children: React.ReactNode,
    readOnly = false,
    extraHeader?: React.ReactNode
  ) => {
    const Icon = icon;
    return (
      <div className="flex flex-col gap-1 w-full">
        <div className="flex items-center justify-between">
          <label className={`block text-[10px] font-bold uppercase tracking-wider ${t.textMuted}`}>{label}</label>
          {extraHeader}
        </div>
        <div className={wrapperCls(readOnly)}>
          <div className={`pl-3 pr-2 py-2 flex items-center justify-center ${dividerCls}`}>
            <Icon size={13} className="shrink-0" />
          </div>
          <div className="flex-1 flex items-center">
            {children}
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const meta = user?.user_metadata;
    setName(parsedMeta?.displayName || (meta?.firstName as string) || "");
    setDescription(parsedMeta?.description || (meta?.description as string) || "");
    setGithub(parsedMeta?.github || (meta?.github as string) || "");
    setLinkedin(parsedMeta?.linkedin || (meta?.linkedin as string) || "");
    setMedium(parsedMeta?.medium || (meta?.medium as string) || "");
    setDevto(parsedMeta?.devto || (meta?.devto as string) || "");
    setPortfolio(parsedMeta?.portfolio || (meta?.portfolio as string) || "");
    setRole(onboardingProfile?.role ?? null);
    setInterests(onboardingProfile?.interests ?? []);
  }, [user, parsedMeta, onboardingProfile]);

  const handleCopyLink = () => {
    if (!username) return;
    navigator.clipboard.writeText(shareUrlForProfile(username));
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const buildProfilePayload = (): OnboardingProfile | null => {
    const baseRole = role ?? onboardingProfile?.role;
    if (!baseRole || !onboardingProfile) return null;

    let source: ReferralSource = "other";
    try {
      const parsed = JSON.parse(onboardingProfile.referralSource);
      source = (parsed?.source as ReferralSource) || "other";
    } catch {
      if (onboardingProfile.referralSource) {
        source = onboardingProfile.referralSource as ReferralSource;
      }
    }

    return {
      interests: interests.length > 0 ? interests : onboardingProfile.interests,
      role: baseRole,
      referralSource: JSON.stringify({
        source,
        displayName: name.trim(),
        username,
        description: description.trim(),
        github: github.trim(),
        linkedin: linkedin.trim(),
        medium: medium.trim(),
        devto: devto.trim(),
        portfolio: portfolio.trim(),
        avatarUrl: avatarUrl || undefined,
      }),
      completedAt: new Date().toISOString(),
    };
  };

  const profileMeta = () => ({
    displayName: name.trim(),
    username,
    description: description.trim(),
    github: github.trim(),
    linkedin: linkedin.trim(),
    medium: medium.trim(),
    devto: devto.trim(),
    portfolio: portfolio.trim(),
    avatarUrl: avatarUrl || undefined,
  });

  const saveProfile = async () => {
    if (!onSave) return;
    const profile = buildProfilePayload();
    if (!profile || !name.trim()) return;
    setSaving("profile");
    try {
      await onSave(profile, profileMeta());
      setCurrentView("main");
    } finally {
      setSaving(null);
    }
  };

  const savePreferences = async () => {
    if (!onSave) return;
    const profile = buildProfilePayload();
    if (!profile || !role) return;
    setSaving("preferences");
    try {
      await onSave({ ...profile, role, interests }, profileMeta());
      setCurrentView("main");
    } finally {
      setSaving(null);
    }
  };

  const toggleInterest = (id: OnboardingInterest) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  /* ── Theme-aware style tokens ── */
  const labelCls = `block text-[10px] font-semibold uppercase tracking-wider mb-1 ${t.textMuted}`;

  const menuItemCls = [
    "w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-sm font-medium text-left cursor-pointer transition-all duration-200",
    isDark
      ? "text-white/55 hover:text-white hover:bg-white/4 active:bg-white/6"
      : "text-gray-500 hover:text-gray-900 hover:bg-black/3 active:bg-black/5",
  ].join(" ");

  const separatorCls = `h-px mx-3 my-1.5 bg-gradient-to-r from-transparent ${isDark ? "via-white/7" : "via-black/6"} to-transparent`;

  const saveBtnCls = [
    "w-full py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-40 disabled:saturate-50 disabled:cursor-not-allowed",
    isDark
      ? "bg-white hover:bg-white/90 text-black"
      : "bg-neutral-900 hover:bg-neutral-800 text-white",
  ].join(" ");

  // ---------------------------------------------------------------------------
  // Profile View
  // ---------------------------------------------------------------------------
  if (currentView === "profile") {
    const charCounter = (
      <span className={`text-[9px] font-semibold tracking-wider tabular-nums ${
        description.length > 140 ? "text-amber-500" : t.textMuted
      }`}>
        {description.length}/160
      </span>
    );

    return (
      <div className="text-left max-h-[min(70dvh,520px)] overflow-y-auto no-scrollbar py-2 px-1">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3.5 px-2">
          <button
            onClick={() => setCurrentView("main")}
            className={`p-1.5 rounded-lg transition-colors ${isDark ? "hover:bg-white/10" : "hover:bg-black/5"}`}
          >
            <ChevronLeft size={16} />
          </button>
          <h3 className={`font-semibold text-sm ${t.textPrimary}`}>Edit Profile</h3>
        </div>

        <div className="space-y-4 px-2">
          {/* Profile Photo (Read-Only - Strictly synced with Google / GitHub) */}
          <div className={`p-3 rounded-xl border flex items-center gap-3.5 transition-all duration-300 ${
            isDark ? "bg-white/[0.02] border-white/8" : "bg-black/[0.02] border-black/8"
          }`}>
            <div className="relative shrink-0 w-14 h-14 rounded-full overflow-hidden ring-2 ring-white/10 shadow-md">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`w-full h-full flex items-center justify-center font-bold text-base ${isDark ? "bg-white text-black" : "bg-black text-white"}`}>
                  {initials}
                </div>
              )}
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-semibold ${t.textPrimary}`}>
                  Profile Photo
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${
                  isDark ? "bg-white/10 text-white/70" : "bg-black/10 text-black/70"
                }`}>
                  {avatarUrl ? "OAuth Synced" : "Default Initials"}
                </span>
              </div>
              <p className={`text-[11px] leading-relaxed mt-0.5 ${t.textMuted}`}>
                {avatarUrl
                  ? "Profile photo is automatically synced from your Google or GitHub account."
                  : "Profile photo is available when signed in with Google or GitHub."}
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3">
            {/* Name */}
            {renderInputWrapper(User, "Name", (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={innerInputCls}
                maxLength={50}
                placeholder="Your name"
              />
            ))}

            {/* Username (read-only) */}
            {renderInputWrapper(Lock, "Username (Read-Only)", (
              <input
                type="text"
                value={username}
                readOnly
                disabled
                className={`${innerInputCls} opacity-50 cursor-not-allowed`}
              />
            ), true)}

            {/* Bio */}
            {renderInputWrapper(Sparkles, "Bio", (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                maxLength={160}
                className={innerTextareaCls}
                placeholder="Tell other builders about yourself..."
              />
            ), false, charCounter)}
          </div>

          {/* Social Expandable Accordion */}
          <div className={`rounded-xl border transition-all duration-300 overflow-hidden ${
            isDark ? "bg-white/[0.01] border-white/5" : "bg-black/[0.01] border-black/5"
          }`}>
            <button
              type="button"
              onClick={() => setSocialsExpanded(!socialsExpanded)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 text-left font-bold text-xs uppercase tracking-wider text-white/50 dark:text-white/50 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-2">
                <Link2 size={13} className="text-indigo-400" />
                <span className={t.textSecondary}>Social Profiles</span>
              </div>
              <div className={t.textMuted}>
                {socialsExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>
            </button>

            <div className={`profile-section-body ${socialsExpanded ? "is-open" : ""}`}>
              <div className="profile-section-inner">
                <div className="p-3 border-t border-white/5 space-y-3 grid grid-cols-1 gap-3">
                  {renderInputWrapper(GithubLogo, "GitHub", (
                    <input
                      type="url"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      placeholder="https://github.com/username"
                      className={innerInputCls}
                    />
                  ))}
                  {renderInputWrapper(LinkedinLogo, "LinkedIn", (
                    <input
                      type="url"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className={innerInputCls}
                    />
                  ))}
                  {renderInputWrapper(BookOpen, "Medium", (
                    <input
                      type="url"
                      value={medium}
                      onChange={(e) => setMedium(e.target.value)}
                      placeholder="https://medium.com/@username"
                      className={innerInputCls}
                    />
                  ))}
                  {renderInputWrapper(Terminal, "Dev.to", (
                    <input
                      type="url"
                      value={devto}
                      onChange={(e) => setDevto(e.target.value)}
                      placeholder="https://dev.to/username"
                      className={innerInputCls}
                    />
                  ))}
                  {renderInputWrapper(Globe, "Portfolio", (
                    <input
                      type="url"
                      value={portfolio}
                      onChange={(e) => setPortfolio(e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className={innerInputCls}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={() => void saveProfile()}
            disabled={saving === "profile" || !name.trim()}
            className={saveBtnCls}
          >
            {saving === "profile" ? "Saving Profile…" : "Save Changes"}
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Preferences View
  // ---------------------------------------------------------------------------
  if (currentView === "preferences") {
    return (
      <div className="text-left max-h-[min(70dvh,520px)] overflow-y-auto no-scrollbar py-2 px-1">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3.5 px-2">
          <button
            onClick={() => setCurrentView("main")}
            className={`p-1.5 rounded-lg transition-colors ${isDark ? "hover:bg-white/10" : "hover:bg-black/5"}`}
          >
            <ChevronLeft size={16} />
          </button>
          <h3 className={`font-semibold text-sm ${t.textPrimary}`}>Feed Preferences</h3>
        </div>

        <div className="space-y-5 px-2">
          {/* Premium Role Selector Grid */}
          <div className="space-y-2">
            <label className={labelCls}>Select Your Primary Role</label>
            <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto pr-1 no-scrollbar">
              {Object.entries(ROLE_DETAILS).map(([roleId, details]) => {
                const isSelected = role === roleId;
                const RoleIcon = details.icon;
                const selectedClasses = SELECTED_ROLE_STYLES[details.color];
                const baseClasses = isDark
                  ? "bg-white/[0.01] border-white/6 hover:bg-white/[0.03] hover:border-white/12 text-white/70"
                  : "bg-black/[0.01] border-black/6 hover:bg-black/[0.03] hover:border-black/12 text-gray-700";

                return (
                  <button
                    key={roleId}
                    type="button"
                    onClick={() => setRole(roleId as UserRole)}
                    className={`flex items-start gap-3 p-2.5 rounded-xl border text-left cursor-pointer ${
                      isSelected ? selectedClasses : baseClasses
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected
                        ? (isDark ? "bg-white/10 text-white" : "bg-black/10 text-black")
                        : (isDark ? "bg-white/5 text-white/40" : "bg-black/5 text-gray-400")
                    }`}>
                      <RoleIcon size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`text-xs font-bold ${isSelected ? (isDark ? "text-white" : "text-gray-900") : ""}`}>
                          {details.label}
                        </p>
                        {isSelected && (
                          <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-white bg-indigo-500 scale-100">
                            <Check size={10} className="stroke-[3px]" />
                          </div>
                        )}
                      </div>
                      <p className={`text-[10px] leading-relaxed mt-0.5 ${t.textMuted}`}>
                        {details.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Premium Interest Pills */}
          <div className="space-y-2">
            <p className={labelCls}>Customize Interests</p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {onboardingOptions.interests.map((item) => {
                const selected = interests.includes(item.id);
                const style = INTEREST_STYLES[item.id];
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleInterest(item.id)}
                    className={`text-[10px] font-semibold px-2.5 py-1.5 rounded-xl border cursor-pointer ${
                      selected
                        ? style.active
                        : `${t.surface} ${t.border} ${t.textMuted} ${style.glow} hover:${t.textSecondary}`
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save Action Button */}
          <button
            type="button"
            onClick={() => void savePreferences()}
            disabled={saving === "preferences" || !role}
            className={saveBtnCls}
          >
            {saving === "preferences" ? "Saving Preferences…" : "Save Preferences"}
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Main View
  // ---------------------------------------------------------------------------
  return (
    <div className="text-left max-h-[min(70dvh,520px)] overflow-y-auto no-scrollbar py-1">

      {/* ══════════ Hero Avatar Section ══════════ */}
      <div className="relative overflow-hidden rounded-xl mb-0.5 mx-0.5">
        {/* Gradient background strip */}
        <div className="absolute inset-0 pointer-events-none bg-linear-to-br from-black/5 to-transparent" />
        <button
          type="button"
          onClick={() => {
            if (username && onViewProfile) onViewProfile(username);
            if (onClose) onClose();
          }}
          className="relative flex items-center gap-3.5 w-full p-3 text-left cursor-pointer group rounded-xl transition-colors duration-200"
        >
          {/* Avatar with glow ring */}
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-black/20 transition-all duration-500 shadow-lg group-hover:shadow-black/10">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full flex items-center justify-center font-bold text-lg ${isDark ? "bg-white text-black" : "bg-black text-white"}`}>
                  {initials}
                </div>
              )}
            </div>
            {/* Online status dot */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-[2.5px] border-[#0a0a0a] shadow-sm shadow-emerald-500/50" />
          </div>

          {/* Identity */}
          <div className="min-w-0">
            <p className={`text-sm font-bold truncate transition-colors duration-200 ${t.textPrimary} ${isDark ? "group-hover:text-white" : "group-hover:text-black"}`}>
              {displayName}
            </p>
            {username && (
              <p className={`text-xs font-bold truncate ${isDark ? "text-white/60" : "text-black/60"}`}>{username}</p>
            )}
            <p className={`text-[11px] truncate mt-0.5 ${t.textMuted}`}>{email}</p>
          </div>
        </button>
      </div>

      {/* ── Gradient separator ── */}
      <div className={separatorCls} />

      {/* ══════════ Menu Items ══════════ */}
      <div className="space-y-0.5 px-0.5">

        {/* ── Copy profile link ── */}
        {username && (
          <div>
            <button
              type="button"
              onClick={handleCopyLink}
              className={`${menuItemCls} ${linkCopied ? "text-emerald-400!" : ""}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 ${
                  linkCopied
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : `${isDark ? "bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20" : "bg-fuchsia-50 text-fuchsia-600 border border-fuchsia-200"}`
                }`}
              >
                {linkCopied ? (
                  <Check size={14} className="success-check-pop" />
                ) : (
                  <Link2 size={14} />
                )}
              </div>
              <span>{linkCopied ? "Link copied!" : "Copy profile link"}</span>
            </button>
          </div>
        )}

        {/* ── Edit Profile ── */}
        <div>
          <button
            type="button"
            onClick={() => setCurrentView("profile")}
            className={menuItemCls}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isDark ? "bg-violet-500/10 text-violet-400 border border-violet-500/20" : "bg-violet-50 text-violet-600 border border-violet-200"}`}>
              <User size={14} />
            </div>
            <span className="flex-1">Edit profile</span>
          </button>
        </div>

        {/* ── Saved Entries ── */}
        <div>
          <button
            type="button"
            onClick={() => {
              if (onViewSaved) onViewSaved();
              if (onClose) onClose();
            }}
            className={menuItemCls}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isDark ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-amber-50 text-amber-600 border border-amber-200"}`}>
              <Bookmark size={14} />
            </div>
            <span className="flex-1">Saved entries</span>
          </button>
        </div>

        {/* ── Feed Preferences ── */}
        <div>
          <button
            type="button"
            onClick={() => setCurrentView("preferences")}
            className={menuItemCls}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isDark ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-emerald-50 text-emerald-600 border border-emerald-200"}`}>
              <SlidersHorizontal size={14} />
            </div>
            <span className="flex-1">Feed preferences</span>
          </button>
        </div>

        {/* ── Admin Dashboard ── */}
        {user?.email === "frozennheart47@gmail.com" || user?.user_metadata?.role === "admin" ? (
          <div>
            <button
              type="button"
              onClick={() => {
                onViewAdminDashboard?.();
                onClose?.();
              }}
              className={menuItemCls}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isDark ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-rose-50 text-rose-600 border border-rose-200"}`}>
                <Shield size={14} className="stroke-[2px]" />
              </div>
              <span className={`flex-1 font-semibold ${isDark ? "text-rose-400" : "text-rose-600"}`}>Admin Dashboard</span>
            </button>
          </div>
        ) : null}

        {/* ── Theme Selection ── */}
        <div className="px-1.5 py-2 mt-1">
          <div className={`text-[10px] font-semibold uppercase tracking-wider mb-2 ml-1 ${t.textMuted}`}>Theme</div>
          <div className={`flex rounded-xl p-1 gap-1 border ${isDark ? "bg-white/2 border-white/4" : "bg-black/2 border-black/4"}`}>
            <button
              onClick={() => setTheme("system")}
              title="System"
              className={`flex-1 flex items-center justify-center py-2 rounded-lg transition-all duration-200 ${
                theme === "system"
                  ? (isDark ? "bg-white/10 shadow-sm text-white" : "bg-white shadow-sm text-neutral-900")
                  : `hover:bg-black/5 dark:hover:bg-white/5 ${t.textMuted}`
              }`}
            >
              <Monitor size={14} />
            </button>
            <button
              onClick={() => setTheme("light")}
              title="Light"
              className={`flex-1 flex items-center justify-center py-2 rounded-lg transition-all duration-200 ${
                theme === "light"
                  ? (isDark ? "bg-white/10 shadow-sm text-white" : "bg-white shadow-sm text-neutral-900")
                  : `hover:bg-black/5 dark:hover:bg-white/5 ${t.textMuted}`
              }`}
            >
              <Sun size={14} />
            </button>
            <button
              onClick={() => setTheme("amoled")}
              title="Dark"
              className={`flex-1 flex items-center justify-center py-2 rounded-lg transition-all duration-200 ${
                theme === "amoled"
                  ? (isDark ? "bg-white/10 shadow-sm text-white" : "bg-white shadow-sm text-neutral-900")
                  : `hover:bg-black/5 dark:hover:bg-white/5 ${t.textMuted}`
              }`}
            >
              <Moon size={14} />
            </button>
          </div>
        </div>


      </div>

      {/* ── Gradient separator ── */}
      <div className={separatorCls} />

      {/* ══════════ Sign Out ══════════ */}
      <div className="px-0.5">
        <button
          type="button"
          onClick={() => {
            signOut();
            onClose?.();
          }}
          className={[
            "w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-sm font-semibold text-left cursor-pointer transition-all duration-200",
            "text-red-400 hover:text-red-300",
            isDark ? "hover:bg-red-500/6" : "hover:bg-red-500/4",
          ].join(" ")}
        >
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-red-500/10 text-red-400 border border-red-500/20 transition-colors duration-200 group-hover:bg-red-500/20">
            <LogOut size={14} />
          </div>
          Sign out
        </button>
      </div>
    </div>
  );
};
