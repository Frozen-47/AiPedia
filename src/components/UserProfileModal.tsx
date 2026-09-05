import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Loader2,
  Layers,
  GitBranch,
  Sparkles,
  Compass,
  Share2,
  Check,
  Code2,
  LayoutGrid,
  Bookmark,
  BookOpen,
  Rocket,
  Globe,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";
import { supabase, fetchProfileByUsername, getOAuthAvatarUrl, type PublicBuilderProfile } from "../lib/supabase";
import type { Entry } from "../types";
import { useTokens, useTheme } from "../lib/theme";
import { useAuth } from "./AuthContext";
import { shareUrlForProfile } from "../lib/entryUrl";

interface UserProfileModalProps {
  username: string;
  onClose: () => void;
  onViewEntry?: (entry: Entry) => void;
}

type TabId = "submissions" | "social" | "bookmarks";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "submissions", label: "Submissions", icon: <LayoutGrid size={13} /> },
  { id: "social", label: "Connections", icon: <Share2 size={13} /> },
  { id: "bookmarks", label: "Bookmarks", icon: <Bookmark size={13} /> },
];

// Helper to resolve role-specific styles and icons
const getRoleConfig = (role: string, isDark: boolean) => {
  const r = (role || "").toLowerCase();
  
  if (r === "researcher") {
    return {
      label: "Researcher",
      icon: <BookOpen size={11} className="stroke-[2.5px]" />,
      cls: isDark
        ? "text-violet-400 bg-violet-500/10 border border-violet-500/25 shadow-[0_2px_8px_rgba(139,92,246,0.05)]"
        : "text-violet-700 bg-violet-50 border border-violet-200",
      themeColor: "from-violet-500/20 via-purple-500/20 to-indigo-500/20",
    };
  }
  if (r === "designer") {
    return {
      label: "Designer",
      icon: <Sparkles size={11} className="stroke-[2.5px]" />,
      cls: isDark
        ? "text-pink-400 bg-pink-500/10 border border-pink-500/25 shadow-[0_2px_8px_rgba(236,72,153,0.05)]"
        : "text-pink-700 bg-pink-50 border border-pink-200",
      themeColor: "from-pink-500/20 via-rose-500/20 to-orange-500/20",
    };
  }
  if (r === "entrepreneur") {
    return {
      label: "Entrepreneur",
      icon: <Rocket size={11} className="stroke-[2.5px]" />,
      cls: isDark
        ? "text-amber-400 bg-amber-500/10 border border-amber-500/25 shadow-[0_2px_8px_rgba(245,158,11,0.05)]"
        : "text-amber-700 bg-amber-50 border border-amber-200",
      themeColor: "from-amber-500/20 via-orange-500/20 to-red-500/20",
    };
  }
  if (r === "enthusiast") {
    return {
      label: "Enthusiast",
      icon: <Globe size={11} className="stroke-[2.5px]" />,
      cls: isDark
        ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 shadow-[0_2px_8px_rgba(16,185,129,0.05)]"
        : "text-emerald-700 bg-emerald-50 border border-emerald-200",
      themeColor: "from-emerald-500/20 via-teal-500/20 to-cyan-500/20",
    };
  }
  
  // Default to developer
  return {
    label: "Developer",
    icon: <Code2 size={11} className="stroke-[2.5px]" />,
    cls: isDark
      ? "text-sky-400 bg-sky-500/10 border border-sky-500/25 shadow-[0_2px_8px_rgba(14,165,233,0.05)]"
      : "text-sky-700 bg-sky-50 border border-sky-200",
    themeColor: "from-sky-500/20 via-indigo-500/20 to-violet-500/20",
  };
};

// Helper for brand-colored social icon tags
const getBrandStyle = (name: string, isDark: boolean) => {
  switch (name.toLowerCase()) {
    case "github":
      return isDark 
        ? "bg-white/10 text-white border border-white/10 hover:bg-white/15" 
        : "bg-neutral-900/5 text-neutral-900 border border-neutral-900/10 hover:bg-neutral-900/10";
    case "linkedin":
      return isDark 
        ? "bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20" 
        : "bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100/60";
    case "medium":
      return isDark 
        ? "bg-neutral-100/10 text-neutral-250 border border-white/10 hover:bg-white/15" 
        : "bg-neutral-100 text-neutral-800 border border-neutral-200 hover:bg-neutral-200/60";
    case "dev.to":
      return isDark 
        ? "bg-neutral-400/10 text-neutral-250 border border-white/10 hover:bg-white/15" 
        : "bg-neutral-900 text-white border border-neutral-800 hover:bg-neutral-800";
    default: // portfolio
      return isDark 
        ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20" 
        : "bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100/60";
  }
};

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  username,
  onClose,
  onViewEntry,
}) => {
  const t = useTokens();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "amoled";
  const { user } = useAuth();
  const modalRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<PublicBuilderProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("submissions");
  const [copied, setCopied] = useState(false);
  const [savedEntries, setSavedEntries] = useState<string[]>([]);
  const [submitHistory, setSubmitHistory] = useState<Entry[]>([]);
  const [loadingEntryId, setLoadingEntryId] = useState<string | null>(null);

  const isOwnProfile =
    user?.user_metadata?.username?.toLowerCase() === username.toLowerCase();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    const loadData = async () => {
      let resolvedProfile: PublicBuilderProfile | null = null;

      if (isOwnProfile) {
        const meta = user?.user_metadata;
        const ownUserKey = user?.id ? (user.id.startsWith("supabase_") ? user.id : `supabase_${user.id}`) : "";
        resolvedProfile = {
          userKey: ownUserKey,
          displayName: meta?.firstName || "Builder",
          username: meta?.username || username,
          description: meta?.description || "",
          github: meta?.github || "",
          linkedin: meta?.linkedin || "",
          medium: meta?.medium || "",
          devto: meta?.devto || "",
          portfolio: meta?.portfolio || "",
          role: meta?.role || "developer",
          interests: meta?.interests || [],
          avatarUrl: getOAuthAvatarUrl(user) || undefined,
        };
      } else {
        try {
          const data = await fetchProfileByUsername(username);
          if (data) {
            resolvedProfile = data;
          } else {
            setError(`No profile found for ${username}`);
          }
        } catch {
          setError("Could not load developer profile.");
        }
      }

      if (resolvedProfile && active) {
        setProfile(resolvedProfile);
        try {
          const { fetchUserBookmarks } = await import("../lib/entryBookmarks");
          const bmarks = await fetchUserBookmarks(resolvedProfile.userKey);
          setSavedEntries(bmarks);
        } catch (err) {
          console.error("Failed to load bookmarks:", err);
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, [username, isOwnProfile, user]);

  useEffect(() => {
    if (!profile) return;

    let active = true;
    const fetchSubmissions = async () => {
      try {
        const { data, error } = await supabase
          .from("entries")
          .select("*")
          .eq("submitted_by", profile.userKey)
          .order("created_at", { ascending: false });

        if (!error && data && active) {
          setSubmitHistory(data as Entry[]);
        }
      } catch (err) {
        console.error("Failed to fetch submit history:", err);
      }
    };

    fetchSubmissions();
    return () => {
      active = false;
    };
  }, [profile]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const initials = profile?.displayName
    ? profile.displayName.slice(0, 2).toUpperCase()
    : username.replace("@", "").slice(0, 2).toUpperCase();

  const handleShare = () => {
    if (!profile?.username) return;
    navigator.clipboard.writeText(shareUrlForProfile(profile.username));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleViewEntry = async (entryName: string) => {
    if (!onViewEntry) return;
    setLoadingEntryId(entryName);
    try {
      const { data, error: err } = await supabase
        .from("entries")
        .select("*")
        .eq("name", entryName)
        .maybeSingle();
      if (!err && data) {
        onViewEntry(data as Entry);
      }
    } catch (err) {
      console.error("Failed to load entry details:", err);
    } finally {
      setLoadingEntryId(null);
    }
  };

  const socialLinks = [
    { name: "GitHub", url: profile?.github, icon: GitBranch },
    { name: "LinkedIn", url: profile?.linkedin, icon: Layers },
    { name: "Medium", url: profile?.medium, icon: Sparkles },
    { name: "Dev.to", url: profile?.devto, icon: Code2 },
    { name: "Portfolio", url: profile?.portfolio, icon: Compass },
  ].filter((l) => l.url);

  // Dynamic Styles
  const roleStyle = profile ? getRoleConfig(profile.role, isDark) : getRoleConfig("developer", isDark);

  return (
    <div className={`${t.modalOverlay} user-profile-modal`}>
      <div
        ref={modalRef}
        className={`relative w-full max-w-md flex flex-col rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl border ${
          isDark ? "bg-neutral-900/90 border-white/10" : "bg-white/95 border-black/10"
        }`}
        style={{ maxHeight: "85dvh" }}
      >
        {/* ── Loading Skeleton ───────────────────────────────────────────── */}
        {loading && (
          <div className="flex flex-col w-full animate-pulse">
            {/* Mesh Hero Banner Skeleton */}
            <div className={`h-32 w-full bg-linear-to-r ${
              isDark ? "from-neutral-800 to-neutral-850" : "from-neutral-150 to-neutral-200"
            }`} />
            
            <div className="px-6 pb-8 space-y-5 flex flex-col">
              {/* Squircle Avatar Skeleton */}
              <div className={`w-20 h-20 rounded-3xl mt-[-40px] border-4 shrink-0 ${
                isDark ? "bg-neutral-800 border-neutral-900" : "bg-neutral-200 border-white"
              }`} />

              {/* Name & Title Skeleton */}
              <div className="space-y-2">
                <div className={`h-5 w-40 rounded-md ${isDark ? "bg-white/5" : "bg-neutral-200"}`} />
                <div className={`h-3.5 w-24 rounded-md ${isDark ? "bg-white/5" : "bg-neutral-200"}`} />
              </div>

              {/* Bio Description Skeleton */}
              <div className="space-y-2">
                <div className={`h-3.5 w-full rounded-md ${isDark ? "bg-white/5" : "bg-neutral-200"}`} />
                <div className={`h-3.5 w-4/5 rounded-md ${isDark ? "bg-white/5" : "bg-neutral-200"}`} />
              </div>

              {/* Stats Row Skeleton */}
              <div className={`grid grid-cols-3 py-3 rounded-2xl border ${
                isDark ? "border-white/5 bg-white/[0.01]" : "border-black/5 bg-black/[0.01]"
              }`}>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <div className={`h-5 w-10 rounded-md ${isDark ? "bg-white/5" : "bg-neutral-200"}`} />
                    <div className={`h-3 w-14 rounded-md ${isDark ? "bg-white/5" : "bg-neutral-200"}`} />
                  </div>
                ))}
              </div>

              {/* Segmented Tab Bar Skeleton */}
              <div className={`h-10 p-1 flex gap-1 rounded-xl border ${
                isDark ? "border-white/5 bg-white/[0.01]" : "border-black/5 bg-black/[0.01]"
              }`}>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className={`flex-1 h-full rounded-lg ${isDark ? "bg-white/5" : "bg-neutral-200"}`} />
                ))}
              </div>

              {/* Content List Placeholder Skeleton */}
              <div className="space-y-3 pt-2">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className={`p-4 rounded-xl border flex items-center gap-3 ${
                    isDark ? "border-white/5" : "border-neutral-200"
                  }`}>
                    <div className={`w-8 h-8 rounded-lg shrink-0 ${isDark ? "bg-white/5" : "bg-neutral-200"}`} />
                    <div className="flex-1 space-y-1.5">
                      <div className={`h-3 w-1/3 rounded-md ${isDark ? "bg-white/5" : "bg-neutral-200"}`} />
                      <div className={`h-2.5 w-1/2 rounded-md ${isDark ? "bg-white/5" : "bg-neutral-200"}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Error ──────────────────────────────────────────────────────── */}
        {!loading && (error || !profile) && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 px-8 text-center">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold border ${
                isDark ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-red-50 border-red-100 text-red-600"
              }`}
            >
              !
            </div>
            <div className="space-y-1">
              <p className={`text-sm font-bold ${t.textPrimary}`}>Profile Not Found</p>
              <p className={`text-xs leading-relaxed max-w-[250px] ${t.textMuted}`}>
                {error || "This profile is not active or hasn't been set up yet."}
              </p>
            </div>
            <button
              onClick={onClose}
              className={`mt-2 text-xs px-5 py-2.5 font-bold rounded-xl shadow-sm transition-all cursor-pointer ${
                isDark
                  ? "bg-white/5 hover:bg-white/10 border border-white/10 text-white"
                  : "bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-800"
              }`}
            >
              Close Profile
            </button>
          </div>
        )}

        {/* ── Profile ────────────────────────────────────────────────────── */}
        {!loading && profile && (
          <>
            {/* Ambient Hero Banner */}
            <div className="h-28 w-full relative overflow-hidden shrink-0">
              {/* Radial Mesh Gradient based on user's role */}
              <div className={`absolute inset-0 bg-gradient-to-r ${roleStyle.themeColor} filter blur-sm scale-110`} />
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:10px_10px] opacity-30" />
              
              {/* Fade bottom to seamlessly transition into modal background */}
              <div className={`absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t ${
                isDark ? "from-neutral-900" : "from-white"
              } to-transparent`} />

              {/* Floating Action Buttons */}
              <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                <button
                  onClick={handleShare}
                  title="Copy profile link"
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 ${
                    isDark
                      ? "bg-white/10 hover:bg-white/20 border border-white/10 text-white backdrop-blur-md"
                      : "bg-white/70 hover:bg-white/90 border border-black/5 text-neutral-800 backdrop-blur-md"
                  }`}
                >
                  {copied ? <Check size={13} className="text-emerald-400" /> : <Share2 size={13} />}
                </button>
                <button
                  onClick={onClose}
                  title="Close"
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 ${
                    isDark
                      ? "bg-white/10 hover:bg-white/20 border border-white/10 text-white backdrop-blur-md"
                      : "bg-white/70 hover:bg-white/90 border border-black/5 text-neutral-800 backdrop-blur-md"
                  }`}
                >
                  <X size={13} />
                </button>
              </div>
            </div>

            {/* Header Content Container */}
            <div className="px-6 pb-0 pt-1 shrink-0">
              {/* Identity Row */}
              <div className="flex items-start gap-4 -mt-14 relative z-20">
                {/* Avatar with Squircle Border & Glowing Shadow */}
                <div
                  className={`w-20 h-20 rounded-3xl flex items-center justify-center text-xl font-black shrink-0 overflow-hidden border-4 ${
                    isDark
                      ? "border-neutral-900 bg-neutral-850 text-white shadow-[0_8px_24px_rgba(0,0,0,0.4)] ring-1 ring-white/5"
                      : "border-white bg-neutral-100 text-neutral-900 shadow-[0_8px_24px_rgba(0,0,0,0.08)] ring-1 ring-black/5"
                  }`}
                >
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-black`}>
                      {initials}
                    </div>
                  )}
                </div>

                {/* Name, Username and Role Badge */}
                <div className="flex-1 min-w-0 pt-8">
                  <h2
                    className={`text-xl font-black tracking-tight leading-tight truncate ${t.textPrimary}`}
                  >
                    {profile.displayName}
                  </h2>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className={`text-[11px] font-semibold text-indigo-400 dark:text-indigo-400/90 truncate`}>
                      {profile.username}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${roleStyle.cls}`}
                    >
                      {roleStyle.icon}
                      {roleStyle.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio Description */}
              {profile.description ? (
                <p className={`text-[12.5px] leading-relaxed mt-4 font-normal ${t.textSecondary}`}>
                  {profile.description}
                </p>
              ) : (
                <p className={`text-[12.5px] leading-relaxed mt-4 font-light italic ${t.textMuted}`}>
                  This builder is busy creating in the AiVerse.
                </p>
              )}

              {/* Interests (Specialties) Tags */}
              {profile.interests && profile.interests.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3.5">
                  {profile.interests.map((interest) => (
                    <span
                      key={interest}
                      className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-lg border transition-all hover:bg-white/[0.04] ${
                        isDark 
                          ? "bg-white/[0.02] text-white/50 border-white/5" 
                          : "bg-black/[0.02] text-black/50 border-black/5"
                      }`}
                    >
                      #{interest}
                    </span>
                  ))}
                </div>
              )}

              {/* Stats Dashboard Grid */}
              <div className="grid grid-cols-3 gap-2.5 mt-5">
                <div className={`p-3 rounded-2xl border text-center transition-all ${
                  isDark ? "bg-white/[0.01] border-white/5 hover:border-white/10" : "bg-black/[0.01] border-black/5 hover:border-black/10"
                }`}>
                  <p className={`text-[9px] font-black uppercase tracking-wider ${t.textMuted}`}>Submissions</p>
                  <p className={`text-lg font-black mt-0.5 ${isDark ? "text-sky-400" : "text-sky-600"}`}>
                    {submitHistory.length}
                  </p>
                </div>
                <div className={`p-3 rounded-2xl border text-center transition-all ${
                  isDark ? "bg-white/[0.01] border-white/5 hover:border-white/10" : "bg-black/[0.01] border-black/5 hover:border-black/10"
                }`}>
                  <p className={`text-[9px] font-black uppercase tracking-wider ${t.textMuted}`}>Bookmarks</p>
                  <p className={`text-lg font-black mt-0.5 ${isDark ? "text-violet-400" : "text-violet-600"}`}>
                    {savedEntries.length}
                  </p>
                </div>
                <div className={`p-3 rounded-2xl border text-center transition-all ${
                  isDark ? "bg-white/[0.01] border-white/5 hover:border-white/10" : "bg-black/[0.01] border-black/5 hover:border-black/10"
                }`}>
                  <p className={`text-[9px] font-black uppercase tracking-wider ${t.textMuted}`}>Specialties</p>
                  <p className={`text-lg font-black mt-0.5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                    {profile.interests?.length || 0}
                  </p>
                </div>
              </div>

              {/* Capsule Segmented Tabs Control */}
              <div className={`p-1 rounded-2xl flex gap-1 mt-5 border ${
                isDark ? "bg-white/[0.02] border-white/5" : "bg-black/[0.02] border-black/5"
              }`}>
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-[11px] font-bold transition-all duration-250 cursor-pointer ${
                        isActive
                          ? isDark
                            ? "bg-white text-neutral-900 shadow-md scale-[1.01]"
                            : "bg-neutral-950 text-white shadow-sm scale-[1.01]"
                          : isDark
                            ? "text-white/40 hover:text-white/70 hover:bg-white/4"
                            : "text-neutral-500 hover:text-neutral-800 hover:bg-black/4"
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scrollable Tab Content Body */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-4">
              {/* ── Submissions Tab ──────────────────────────────────────── */}
              {activeTab === "submissions" && (
                <div className="animate-[fadeIn_0.2s_ease-out] space-y-2">
                  {submitHistory.length > 0 ? (
                    submitHistory.map((entry) => {
                      const isNew = entry.created_at
                        ? (new Date().getTime() - new Date(entry.created_at).getTime()) / (1000 * 60 * 60 * 24) <= 2
                        : false;
                      const isLoading = loadingEntryId === entry.name;
                      return (
                        <div
                          key={entry.name}
                          onClick={() => !isLoading && handleViewEntry(entry.name)}
                          className={`p-3 rounded-2xl flex items-center justify-between border transition-all duration-300 ${
                            onViewEntry ? "cursor-pointer hover:translate-x-1" : ""
                          } ${
                            isDark
                              ? "bg-white/[0.01] border-white/5 hover:bg-white/[0.03] hover:border-white/15"
                              : "bg-black/[0.01] border-black/5 hover:bg-neutral-50 hover:border-neutral-300"
                          }`}
                        >
                          <div className="min-w-0 pr-3 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className={`text-[12.5px] font-extrabold truncate ${t.textPrimary}`}>
                                {entry.name}
                              </h4>
                              {isNew && (
                                <span className="inline-flex items-center text-[8px] font-black uppercase px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/15 animate-pulse">
                                  NEW
                                </span>
                              )}
                            </div>
                            <p className={`text-[11px] truncate mt-0.5 ${t.textMuted}`}>
                              {entry.summary}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {isLoading ? (
                              <Loader2 size={12} className="animate-spin text-indigo-400" />
                            ) : entry.approved ? (
                              <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/15 text-emerald-400">
                                Approved
                              </span>
                            ) : (
                              <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/15 text-amber-400 animate-pulse">
                                Pending
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 ${
                        isDark ? "bg-white/[0.02] text-white/30 border border-white/5" : "bg-neutral-50 text-neutral-400 border border-neutral-100"
                      }`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h4 className={`text-[12px] font-bold ${t.textPrimary}`}>No Submissions Yet</h4>
                      <p className={`text-[10.5px] max-w-[220px] mt-1 leading-normal ${t.textMuted}`}>
                        Tools and entities submitted by this builder will appear here.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ── Connections Tab ─────────────────────────────────────── */}
              {activeTab === "social" && (
                <div className="animate-[fadeIn_0.2s_ease-out]">
                  {socialLinks.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2.5">
                      {socialLinks.map((link) => {
                        const Icon = link.icon;
                        const brandCls = getBrandStyle(link.name, isDark);
                        return (
                          <a
                            key={link.name}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex flex-col items-start p-3.5 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
                              isDark
                                ? "bg-white/[0.01] border-white/5 hover:bg-white/[0.03] hover:border-white/12"
                                : "bg-black/[0.01] border-black/5 hover:bg-white hover:border-black/12"
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${brandCls}`}>
                              <Icon size={14} />
                            </div>
                            <div className="mt-3 min-w-0 w-full flex items-center justify-between">
                              <p className={`text-[12px] font-extrabold ${t.textPrimary}`}>{link.name}</p>
                              <ArrowUpRight size={12} className={t.textMuted} />
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 ${
                        isDark ? "bg-white/[0.02] text-white/30 border border-white/5" : "bg-neutral-50 text-neutral-400 border border-neutral-100"
                      }`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                        </svg>
                      </div>
                      <h4 className={`text-[12px] font-bold ${t.textPrimary}`}>No Connections Linked</h4>
                      <p className={`text-[10.5px] max-w-[220px] mt-1 leading-normal ${t.textMuted}`}>
                        Social profiles and portfolio links have not been connected yet.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ── Bookmarks Tab ─────────────────────────────────────────── */}
              {activeTab === "bookmarks" && (
                <div className="animate-[fadeIn_0.2s_ease-out] space-y-2">
                  {savedEntries.length > 0 ? (
                    savedEntries.map((name) => {
                      const isLoading = loadingEntryId === name;
                      return (
                        <div
                          key={name}
                          onClick={() => !isLoading && handleViewEntry(name)}
                          className={`p-3 rounded-2xl flex items-center justify-between border transition-all duration-300 ${
                            onViewEntry ? "cursor-pointer hover:translate-x-1" : ""
                          } ${
                            isDark
                              ? "bg-white/[0.01] border-white/5 hover:bg-white/[0.03] hover:border-white/15"
                              : "bg-black/[0.01] border-black/5 hover:bg-neutral-50 hover:border-neutral-300"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                              isDark ? "bg-white/[0.03] text-indigo-400" : "bg-neutral-100 text-indigo-600"
                            }`}>
                              <Bookmark size={12} className="fill-current" />
                            </div>
                            <p className={`text-[12.5px] font-extrabold truncate ${t.textPrimary}`}>{name}</p>
                          </div>
                          {isLoading ? (
                            <Loader2 size={12} className="animate-spin text-indigo-400 shrink-0" />
                          ) : (
                            onViewEntry && <ChevronRight size={13} className={`${t.textMuted} shrink-0`} />
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 ${
                        isDark ? "bg-white/[0.02] text-white/30 border border-white/5" : "bg-neutral-50 text-neutral-400 border border-neutral-100"
                      }`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                        </svg>
                      </div>
                      <h4 className={`text-[12px] font-bold ${t.textPrimary}`}>No Bookmarks Saved</h4>
                      <p className={`text-[10.5px] max-w-[220px] mt-1 leading-normal ${t.textMuted}`}>
                        Bookmarked tools and entities will be saved here for quick references.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer with Actions */}
            <div className={`px-6 py-4 border-t flex justify-end shrink-0 gap-2 ${
              isDark ? "border-white/8 bg-white/[0.01]" : "border-black/8 bg-black/[0.01]"
            }`}>
              <button
                type="button"
                onClick={onClose}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer active:scale-98 ${
                  isDark
                    ? "bg-white/5 hover:bg-white/10 border border-white/8 text-white"
                    : "bg-neutral-100 hover:bg-neutral-200 border border-neutral-250 text-neutral-700"
                }`}
              >
                Close Profile
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};