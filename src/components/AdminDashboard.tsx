import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Check,
  Shield,
  Users,
  Server,
  Trash2,
  Info,
  RefreshCw,
  Star,
  ExternalLink,
  X,
  AlertTriangle,
  Search,
  GitBranch,
  Briefcase,
  Globe,
  Edit,
  User,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { useTokens, useTheme, typeBadge, taskBadge, typeIcon, TYPE_GLYPH } from "../lib/theme";
import type { Entry } from "../types";
import { useAuth } from "./AuthContext";

interface AdminDashboardProps {
  onBackToHome: () => void;
  onViewEntry?: (entry: Entry) => void;
}

interface UserProfile {
  userKey: string;
  displayName: string;
  username: string;
  description: string;
  github: string;
  linkedin: string;
  medium: string;
  devto: string;
  portfolio: string;
  avatarUrl?: string;
  role: string;
  interests: string[];
  updatedAt: string;
  isBlocked?: boolean;
  blockedUntil?: string;
}

type TabId = "submissions" | "directory" | "users";

const isNewSubmission = (createdAt?: string): boolean => {
  if (!createdAt) return false;
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays <= 2;
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToHome,
  onViewEntry,
}) => {
  const t = useTokens();
  const { resolvedTheme } = useTheme();
  const { user } = useAuth();
  const isDark = resolvedTheme === "amoled";
  const currentUserKey = user ? (user.id.startsWith("supabase_") ? user.id : `supabase_${user.id}`) : "";

  const [activeTab, setActiveTab] = useState<TabId>("submissions");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data states
  const [pendingEntries, setPendingEntries] = useState<Entry[]>([]);
  const [approvedEntries, setApprovedEntries] = useState<Entry[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  
  // Actions states
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [directorySearch, setDirectorySearch] = useState("");
  
  // Custom alerts/confirms states
  const [deleteConfirmEntry, setDeleteConfirmEntry] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Admin User Management states
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [blockingUser, setBlockingUser] = useState<UserProfile | null>(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<UserProfile | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch pending entries (approved = false)
      const { data: pendingData, error: pendingErr } = await supabase
        .from("entries")
        .select("*")
        .eq("approved", false)
        .order("created_at", { ascending: false });

      if (pendingErr) throw pendingErr;
      setPendingEntries((pendingData as Entry[]) || []);

      // 2. Fetch approved entries (approved = true)
      const { data: approvedData, error: approvedErr } = await supabase
        .from("entries")
        .select("*")
        .eq("approved", true)
        .order("created_at", { ascending: false });

      if (approvedErr) throw approvedErr;
      setApprovedEntries((approvedData as Entry[]) || []);

      // 3. Fetch user preferences (for users tab)
      const { data: usersData, error: usersErr } = await supabase
        .from("user_preferences")
        .select("*")
        .order("updated_at", { ascending: false });

      if (usersErr) throw usersErr;

      const parsedUsers: UserProfile[] = (usersData || []).map((row: any) => {
        let meta: any = {};
        try {
          if (row.referral_source) {
            meta = JSON.parse(row.referral_source);
          }
        } catch {
          // referral_source is a plain string
        }

        return {
          userKey: row.user_key,
          displayName: meta?.displayName || "Builder",
          username: meta?.username || "@anonymous",
          description: meta?.description || "",
          github: meta?.github || "",
          linkedin: meta?.linkedin || "",
          medium: meta?.medium || "",
          devto: meta?.devto || "",
          portfolio: meta?.portfolio || "",
          avatarUrl: meta?.avatarUrl || meta?.avatar_url || undefined,
          role: row.role || "developer",
          interests: row.interests || [],
          updatedAt: row.updated_at || "",
          isBlocked: meta?.isBlocked || false,
          blockedUntil: meta?.blockedUntil || undefined,
        };
      });
      setUsers(parsedUsers);

    } catch (err: any) {
      console.error("AdminDashboard failed to load data:", err);
      setError(
        err.message ||
          "Could not fetch database registries. Ensure RLS policies have been executed in your Supabase project."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (entry: Entry) => {
    setActioningId(entry.name);
    try {
      const { error: err } = await supabase
        .from("entries")
        .update({ approved: true })
        .eq("name", entry.name);

      if (err) throw err;

      // Update local states
      setPendingEntries((prev) => prev.filter((e) => e.name !== entry.name));
      setApprovedEntries((prev) => [
        { ...entry, approved: true },
        ...prev,
      ]);
      showToast("success", `"${entry.name}" has been approved and published.`);
    } catch (err: any) {
      showToast("error", `Failed to approve "${entry.name}": ${err.message}`);
    } finally {
      setActioningId(null);
    }
  };

  const executeDelete = async (entryName: string) => {
    setActioningId(entryName);
    try {
      const { error: err } = await supabase
        .from("entries")
        .delete()
        .eq("name", entryName);

      if (err) throw err;

      // Update local states
      setPendingEntries((prev) => prev.filter((e) => e.name !== entryName));
      setApprovedEntries((prev) => prev.filter((e) => e.name !== entryName));
      showToast("success", `"${entryName}" has been rejected/deleted.`);
    } catch (err: any) {
      showToast("error", `Failed to delete "${entryName}": ${err.message}`);
    } finally {
      setActioningId(null);
    }
  };

  const handleUpdateUserProfile = async () => {
    if (!editingUser) return;
    setActioningId(editingUser.userKey);
    try {
      const referralSourceObj = {
        source: "other",
        displayName: editingUser.displayName.trim(),
        username: editingUser.username,
        description: editingUser.description.trim(),
        github: editingUser.github.trim(),
        linkedin: editingUser.linkedin.trim(),
        medium: editingUser.medium,
        devto: editingUser.devto,
        portfolio: editingUser.portfolio.trim(),
        avatarUrl: editingUser.avatarUrl?.trim(),
        isBlocked: editingUser.isBlocked,
        blockedUntil: editingUser.blockedUntil,
      };

      const { error: err } = await supabase
        .from("user_preferences")
        .update({
          role: editingUser.role,
          referral_source: JSON.stringify(referralSourceObj),
          updated_at: new Date().toISOString(),
        })
        .eq("user_key", editingUser.userKey);

      if (err) throw err;

      setUsers((prev) =>
        prev.map((u) => (u.userKey === editingUser.userKey ? editingUser : u))
      );
      showToast("success", `Profile for "${editingUser.displayName}" updated successfully.`);
      setEditingUser(null);
    } catch (err: any) {
      showToast("error", `Failed to update profile: ${err.message}`);
    } finally {
      setActioningId(null);
    }
  };

  const handleExecuteBlock = async (
    profile: UserProfile,
    block: boolean,
    durationMs: number
  ) => {
    if (block) {
      if (profile.userKey === currentUserKey) {
        showToast("error", "Security violation: You cannot suspend your own administrator account.");
        setBlockingUser(null);
        return;
      }
      if (profile.role === "admin") {
        showToast("error", "Security violation: Administrator accounts cannot be suspended.");
        setBlockingUser(null);
        return;
      }
    }
    setActioningId(profile.userKey);
    try {
      const blockedUntil = block
        ? durationMs > 0
          ? new Date(Date.now() + durationMs).toISOString()
          : "9999-12-31T23:59:59.999Z" // Permanent
        : undefined;

      const referralSourceObj = {
        source: "other",
        displayName: profile.displayName,
        username: profile.username,
        description: profile.description,
        github: profile.github,
        linkedin: profile.linkedin,
        medium: profile.medium,
        devto: profile.devto,
        portfolio: profile.portfolio,
        avatarUrl: profile.avatarUrl,
        isBlocked: block,
        blockedUntil: blockedUntil,
      };

      const { error: err } = await supabase
        .from("user_preferences")
        .update({
          referral_source: JSON.stringify(referralSourceObj),
          updated_at: new Date().toISOString(),
        })
        .eq("user_key", profile.userKey);

      if (err) throw err;

      const updatedUser = {
        ...profile,
        isBlocked: block,
        blockedUntil: blockedUntil,
      };

      setUsers((prev) =>
        prev.map((u) => (u.userKey === profile.userKey ? updatedUser : u))
      );
      
      const msg = block
        ? `Suspended "${profile.displayName}" ${durationMs > 0 ? "temporarily" : "indefinitely"}.`
        : `Lifting suspension for "${profile.displayName}".`;
      showToast("success", msg);
      setBlockingUser(null);
    } catch (err: any) {
      showToast("error", `Failed to change block status: ${err.message}`);
    } finally {
      setActioningId(null);
    }
  };

  const handleExecuteDeleteUser = async (profile: UserProfile) => {
    if (profile.userKey === currentUserKey) {
      showToast("error", "Security violation: You cannot delete your own administrator account.");
      setDeleteConfirmUser(null);
      return;
    }
    if (profile.role === "admin") {
      showToast("error", "Security violation: Administrator accounts cannot be deleted from the dashboard.");
      setDeleteConfirmUser(null);
      return;
    }
    setActioningId(profile.userKey);
    try {
      // 1. Attempt to delete the user completely from both Auth and Public tables using the secure RPC function
      const { error: rpcErr } = await supabase.rpc("delete_user_by_admin", {
        target_user_key: profile.userKey,
      });

      if (rpcErr) {
        console.warn("RPC deletion failed, falling back to public profile table deletion:", rpcErr);

        // 2. Fallback: delete the user from public.user_preferences only if RPC is not deployed
        const { error: fallbackErr } = await supabase
          .from("user_preferences")
          .delete()
          .eq("user_key", profile.userKey);

        if (fallbackErr) throw fallbackErr;

        showToast(
          "success",
          `Local profile for "${profile.displayName}" deleted. Run the SQL script in Supabase to enable Auth deletion.`
        );
      } else {
        showToast(
          "success",
          `User "${profile.displayName}" and their auth account have been completely deleted.`
        );
      }

      // Update local state
      setUsers((prev) => prev.filter((u) => u.userKey !== profile.userKey));
    } catch (err: any) {
      showToast("error", `Failed to delete user: ${err.message}`);
    } finally {
      setActioningId(null);
    }
  };

  // Filter approved directory
  const filteredApproved = approvedEntries.filter((entry) => {
    const q = directorySearch.toLowerCase();
    return (
      entry.name.toLowerCase().includes(q) ||
      (entry.org || "").toLowerCase().includes(q) ||
      entry.type.toLowerCase().includes(q) ||
      entry.task.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-[fadeUp_0.4s_ease-out] text-left">
      {/* Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 p-6 rounded-2xl border backdrop-blur-md transition-all duration-300 shadow-xs bg-linear-to-br from-white/[0.01] to-transparent dark:from-white/[0.005] border-neutral-200/40 dark:border-white/5">
        <div className="space-y-4">
          <button
            onClick={onBackToHome}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border shadow-xs transition-all cursor-pointer backdrop-blur-md ${
              isDark
                ? "bg-white/5 border-white/10 text-white/80 hover:text-white hover:border-white/20 hover:bg-white/10"
                : "bg-white border-slate-200 text-slate-600 hover:text-black hover:border-neutral-300 hover:bg-neutral-50"
            }`}
          >
            <ArrowLeft size={12} className="stroke-[2.5px]" />
            Back to Dashboard
          </button>
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl shrink-0 ${isDark ? "bg-amber-500/10 text-amber-400 border border-amber-500/15" : "bg-amber-50 border border-amber-200 text-amber-600 shadow-inner"}`}>
              <Shield size={22} className="stroke-[2.5px]" />
            </div>
            <div>
              <h1 className={`text-2xl font-black tracking-tight ${t.textPrimary}`}>
                Administrator Dashboard
              </h1>
              <p className={`text-[12px] mt-1 font-light leading-relaxed max-w-xl ${t.textSecondary}`}>
                Audit user-submitted machine learning frameworks, inspect developer registries, manage active directory items, and keep database tables synchronized.
              </p>
            </div>
          </div>
        </div>

        {!loading && (
          <button
            onClick={loadData}
            title="Refresh database records"
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold border shadow-xs cursor-pointer transition-all active:scale-95 ${t.surface} ${t.border} ${t.textSecondary} hover:${t.textPrimary} hover:border-neutral-300 dark:hover:border-white/20`}
          >
            <RefreshCw size={12} className={`stroke-[2.5px] ${loading ? "animate-spin" : ""}`} />
            Sync Records
          </button>
        )}
      </div>

      {/* RLS Policy Warning Banner */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex gap-3 animate-pulse">
          <Info size={18} className="shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">RLS Authorization Failure</p>
            <p className="text-xs leading-relaxed opacity-90 font-light">
              The query returned a database permissions failure. RLS is currently active. To let admins view all user entries and preferences, you must run the SQL scripts in your Supabase SQL editor:
            </p>
            <code className="block text-[10px] font-mono p-2.5 bg-neutral-950/95 rounded-lg border border-white/5 text-slate-300 break-all select-all">
              {`CREATE OR REPLACE FUNCTION private.is_admin() RETURNS boolean LANGUAGE sql STABLE SECURITY INVOKER AS $$ SELECT auth.jwt() ->> 'email' = 'frozennheart47@gmail.com' OR auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'; $$;`}
            </code>
            <p className="text-[10px] opacity-80 italic pt-1">
              Details: {error}
            </p>
          </div>
        </div>
      )}

      {/* Segmented Tab Controller */}
      <div className={`p-1 flex gap-1 mb-8 overflow-x-auto no-scrollbar max-w-fit rounded-2xl border ${t.surface} ${t.border}`}>
        {[
          { id: "submissions", label: "Pending Submissions", icon: Server, count: pendingEntries.length, countColor: "bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/15" },
          { id: "directory", label: "Approved Directory", icon: Star, count: approvedEntries.length, countColor: "bg-sky-500/10 text-sky-500 dark:text-sky-400 border-sky-500/15" },
          { id: "users", label: "Registered Users", icon: Users, count: users.length, countColor: "bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border-indigo-500/15" },
        ].map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabId)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? isDark
                    ? "bg-white/10 text-white shadow-md shadow-black/30 border border-white/5"
                    : "bg-white text-black shadow-xs border border-neutral-200"
                  : `text-neutral-400 hover:text-neutral-600 dark:text-white/45 dark:hover:text-white/70`
              }`}
            >
              <TabIcon size={13} className="stroke-[2.5px]" />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`ml-1 px-2 py-0.5 text-[9px] font-extrabold rounded-full border ${tab.countColor}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Content Areas */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-8 h-8 border-3 border-neutral-300 border-t-neutral-800 dark:border-white/10 dark:border-t-white rounded-full animate-spin" />
          <p className={`text-[10px] font-extrabold uppercase tracking-widest ${t.textMuted}`}>Fetching records...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* TAB 1: PENDING SUBMISSIONS */}
          {activeTab === "submissions" && (
            <>
              {pendingEntries.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-center border border-dashed rounded-2xl border-neutral-200 dark:border-white/10 bg-neutral-50/50 dark:bg-white/[0.005]">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10 text-white border border-white/15 mb-2">
                    <Check size={20} />
                  </div>
                  <p className={`text-sm font-semibold ${t.textPrimary}`}>Submissions inbox is clean</p>
                  <p className={`text-xs max-w-[320px] leading-relaxed font-light ${t.textMuted}`}>
                    All user-submitted frameworks, datasets, models, and platforms have been fully audited and published.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pendingEntries.map((entry) => {
                    const submitter = users.find((u) => u.userKey === entry.submitted_by);
                    const isNew = isNewSubmission(entry.created_at);

                    return (
                      <div
                        key={entry.name}
                        className={`relative group overflow-hidden rounded-2xl p-6 flex flex-col justify-between border transition-all duration-300 ${
                          isNew
                            ? "border-indigo-500/30 ring-1 ring-indigo-500/10 shadow-lg shadow-indigo-500/5 bg-indigo-500/[0.015]"
                            : t.card
                        }`}
                      >
                        {/* Subtle background glow for new submissions */}
                        {isNew && (
                          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-indigo-500/[0.03] blur-2xl pointer-events-none" />
                        )}

                        <div className="space-y-4">
                          {/* Header Row */}
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 border shadow-inner ${typeIcon(entry.type, t)}`}>
                                {TYPE_GLYPH[entry.type] ?? "◆"}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className={`text-base font-black tracking-tight ${t.textPrimary}`}>
                                    {entry.name}
                                  </h3>
                                  {isNew && (
                                    <span className="inline-flex items-center text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 animate-pulse">
                                      NEW
                                    </span>
                                  )}
                                </div>
                                <p className={`text-[11px] font-medium ${t.textMuted}`}>
                                  {entry.org || "Unknown Org"} · {entry.year}
                                </p>
                              </div>
                            </div>
                            {entry.url && (
                              <a
                                href={entry.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-2 rounded-xl border transition-all ${t.surface} ${t.border} ${t.textSecondary} hover:${t.textPrimary}`}
                                title="Visit official resources link"
                              >
                                <ExternalLink size={13} className="stroke-[2.5px]" />
                              </a>
                            )}
                          </div>

                          {/* Badges */}
                          <div className="flex flex-wrap gap-1.5">
                            <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-lg border ${typeBadge(entry.type, t)}`}>
                              {entry.type}
                            </span>
                            <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-lg border ${taskBadge(entry.task, t)}`}>
                              {entry.task}
                            </span>
                            <span className={`text-[9px] font-semibold px-2.5 py-0.5 rounded-lg border ${t.surface} ${t.border} ${t.textSecondary}`}>
                              {entry.license}
                            </span>
                            <span className={`text-[9px] font-semibold px-2.5 py-0.5 rounded-lg border ${t.surface} ${t.border} ${t.textSecondary}`}>
                              Size: {entry.size}
                            </span>
                          </div>

                          {/* Summary & Limitations */}
                          <div className="space-y-2">
                            <p className={`text-xs leading-relaxed font-light ${t.textSecondary}`}>
                              {entry.summary}
                            </p>
                            {entry.limitations && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {entry.limitations.split(",").map((l, idx) => (
                                  <span
                                    key={idx}
                                    className={`text-[9px] font-medium px-2 py-0.5 rounded-lg border flex items-center gap-1 ${t.limitTag}`}
                                  >
                                    <AlertTriangle size={9} className="shrink-0 text-red-400" />
                                    <span>{l.trim()}</span>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Usage Block Preview */}
                          {entry.usage && (
                            <details className={`group rounded-xl overflow-hidden border ${t.border}`}>
                              <summary className={`flex items-center justify-between px-3 py-2 text-[10px] font-bold cursor-pointer outline-none select-none transition-colors ${t.surface} hover:${t.surfaceHover} ${t.textSecondary}`}>
                                <span>Show example code usage</span>
                                <span className="text-[9px] opacity-50 group-open:rotate-180 transition-transform">▼</span>
                              </summary>
                              <pre className={`p-3 text-[10px] font-mono overflow-x-auto leading-relaxed border-t ${t.border} ${t.code}`}>
                                {entry.usage}
                              </pre>
                            </details>
                          )}

                          {/* Submitter User Chip */}
                          <div className={`mt-3 p-3 rounded-xl border flex items-center gap-3 text-xs ${isDark ? "bg-white/[0.015] border-white/5" : "bg-black/[0.015] border-black/5"}`}>
                            <div className={`w-8 h-8 rounded-full overflow-hidden shrink-0 flex items-center justify-center font-bold text-[10px] border ${isDark ? "bg-white/8 border-white/10 text-white" : "bg-black/6 border-black/10 text-black"}`}>
                              {submitter?.avatarUrl ? (
                                <img
                                  src={submitter.avatarUrl}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                submitter?.displayName
                                  ? submitter.displayName.slice(0, 2).toUpperCase()
                                  : "AN"
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={`text-[11px] truncate leading-none mb-1 ${t.textSecondary}`}>
                                <span className="font-bold text-indigo-400">Submissions Auditor</span>
                              </p>
                              <p className={`text-[11px] truncate font-medium ${t.textPrimary}`}>
                                {submitter ? (
                                  <>
                                    <span className="font-bold">{submitter.displayName}</span>{" "}
                                    <span className={`text-[10px] ${t.textMuted}`}>({submitter.username})</span>
                                  </>
                                ) : (
                                  <span className={t.textMuted}>System/Anonymous Submitter</span>
                                )}
                              </p>
                            </div>
                            {submitter && (
                              <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-full ${isDark ? "bg-white/5 text-white/40 border border-white/5" : "bg-black/5 text-black/40 border border-black/5"}`}>
                                {submitter.role}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2 mt-6 pt-4 border-t border-dashed dark:border-white/5 border-neutral-200">
                          <button
                            type="button"
                            onClick={() => handleApprove(entry)}
                            disabled={actioningId === entry.name}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white shadow-md shadow-emerald-900/10 active:translate-y-0`}
                          >
                            <Check size={14} className="stroke-[3px]" />
                            {actioningId === entry.name ? "Approving..." : "Approve Listing"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmEntry(entry.name)}
                            disabled={actioningId === entry.name}
                            className={`flex items-center justify-center p-2.5 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-all cursor-pointer disabled:opacity-50 active:scale-95`}
                            title="Reject and discard submission"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* TAB 2: APPROVED DIRECTORY */}
          {activeTab === "directory" && (
            <div className="space-y-5">
              {/* Search filter bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative w-full max-w-md">
                  <input
                    type="text"
                    value={directorySearch}
                    onChange={(e) => setDirectorySearch(e.target.value)}
                    placeholder="Filter active listings by name, category, or task..."
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-[13px] outline-none transition-all duration-200 ${t.input}`}
                  />
                  <Search className="absolute left-3.5 top-3 text-neutral-400 dark:text-neutral-500" size={14} />
                </div>
                
                <div className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg border ${t.surface} ${t.border} ${t.textMuted}`}>
                  Showing <span className={`font-bold ${t.textPrimary}`}>{filteredApproved.length}</span> of {approvedEntries.length} approved assets
                </div>
              </div>

              {filteredApproved.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-center border border-dashed rounded-2xl border-neutral-200 dark:border-white/10">
                  <div className="text-4xl opacity-25 text-neutral-400">◌</div>
                  <p className={`text-sm font-semibold ${t.textPrimary}`}>No approved entries found</p>
                  <p className={`text-xs max-w-[280px] leading-relaxed ${t.textMuted}`}>
                    Try clearing your search filters or check your Supabase approved table entries.
                  </p>
                </div>
              ) : (
                <div className={`overflow-x-auto rounded-2xl border shadow-sm ${t.border} ${t.scrollbar}`}>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={`border-b text-[10px] font-bold uppercase tracking-wider ${t.surface2} ${t.textMuted}`}>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Organization</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Task</th>
                        <th className="px-6 py-4">Year</th>
                        <th className="px-6 py-4">Submitted By</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {filteredApproved.map((entry) => {
                        const submitter = users.find((u) => u.userKey === entry.submitted_by);
                        const isNew = isNewSubmission(entry.created_at);

                        return (
                          <tr
                            key={entry.name}
                            className={`text-xs transition-colors hover:bg-neutral-50/50 dark:hover:bg-white/[0.01] ${
                              isNew
                                ? isDark
                                  ? "bg-indigo-500/[0.015] border-l-2 border-l-indigo-500"
                                  : "bg-indigo-50/20 border-l-2 border-l-indigo-500"
                                : ""
                            }`}
                          >
                            <td className="px-6 py-4 font-bold">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => onViewEntry?.(entry)}
                                  className={`hover:underline font-extrabold cursor-pointer transition-colors hover:text-indigo-500 dark:hover:text-indigo-400 ${t.textPrimary}`}
                                >
                                  {entry.name}
                                </button>
                                {isNew && (
                                  <span className="inline-flex items-center text-[7px] font-extrabold uppercase px-1 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
                                    NEW
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className={`px-6 py-4 font-medium ${t.textSecondary}`}>{entry.org || "—"}</td>
                            <td className="px-6 py-4">
                              <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md border ${typeBadge(entry.type, t)}`}>
                                {entry.type}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md border ${taskBadge(entry.task, t)}`}>
                                {entry.task}
                              </span>
                            </td>
                            <td className={`px-6 py-4 font-medium ${t.textSecondary}`}>{entry.year}</td>
                            <td className="px-6 py-4 font-medium">
                              {submitter ? (
                                <div className="flex items-center gap-2">
                                  <div className={`w-6 h-6 rounded-full overflow-hidden shrink-0 flex items-center justify-center font-extrabold text-[8px] border ${isDark ? "bg-white/8 border-white/10 text-white" : "bg-black/6 border-black/10 text-black"}`}>
                                    {submitter.avatarUrl ? (
                                      <img
                                        src={submitter.avatarUrl}
                                        alt=""
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      submitter.displayName.slice(0, 2).toUpperCase()
                                    )}
                                  </div>
                                  <span className={t.textPrimary} title={`${submitter.displayName} (${submitter.username})`}>
                                    {submitter.displayName}
                                  </span>
                                </div>
                              ) : (
                                <span className={t.textMuted}>—</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmEntry(entry.name)}
                                disabled={actioningId === entry.name}
                                className={`p-2 rounded-lg text-red-500 hover:bg-red-500/10 active:scale-95 transition-all cursor-pointer disabled:opacity-50`}
                                title="Delete from active directory"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: REGISTERED USERS */}
          {activeTab === "users" && (
            <>
              {users.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-center border border-dashed rounded-2xl border-neutral-200 dark:border-white/10">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 mb-1">
                    <User size={22} />
                  </div>
                  <p className={`text-sm font-semibold ${t.textPrimary}`}>No registered users</p>
                  <p className={`text-xs max-w-[280px] leading-relaxed ${t.textMuted}`}>
                    No builder profiles have synced metadata to `user_preferences` database tables.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {users.map((profile) => {
                    const initials = profile.displayName
                      ? profile.displayName.slice(0, 2).toUpperCase()
                      : profile.username.replace("@", "").slice(0, 2).toUpperCase();

                    const isMe = profile.userKey === currentUserKey;
                    const isAdminUser = profile.role === "admin";

                    return (
                      <div
                        key={profile.userKey}
                        className={`group relative overflow-hidden rounded-2xl p-6 border flex flex-col justify-between transition-all duration-300 ${t.card}`}
                      >
                        <div className="space-y-4">
                          {/* Avatar & Info Row */}
                          <div className="flex items-center gap-3.5">
                            <div className={`w-14 h-14 rounded-full overflow-hidden shrink-0 flex items-center justify-center font-black text-sm border-2 ${
                              isDark ? "bg-neutral-800 border-white/10 text-white" : "bg-neutral-100 border-black/10 text-black"
                            }`}>
                              {profile.avatarUrl ? (
                                <img
                                  src={profile.avatarUrl}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                initials
                              )}
                            </div>
                            <div className="min-w-0">
                              <h3 className={`text-base font-black tracking-tight truncate leading-tight ${t.textPrimary}`}>
                                {profile.displayName}
                              </h3>
                              <p className={`text-xs font-medium mt-0.5 truncate ${t.textMuted}`}>
                                {profile.username}
                              </p>
                            </div>
                          </div>

                          {/* Profile meta badges */}
                          <div className="flex flex-wrap gap-1.5">
                            <span className={`inline-flex items-center gap-1 text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-md ${
                              isDark ? "bg-white/5 text-white/50 border border-white/5" : "bg-black/5 text-black/50 border border-black/5"
                            }`}>
                              Role: {profile.role}
                            </span>
                            {profile.isBlocked && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-md bg-red-500/10 border border-red-500/25 text-red-500 animate-pulse" title={profile.blockedUntil ? `Blocked until ${new Date(profile.blockedUntil).toLocaleString()}` : "Blocked permanently"}>
                                Suspended
                              </span>
                            )}
                          </div>

                          {/* Bio */}
                          {profile.description && (
                            <p className={`text-xs leading-relaxed font-light line-clamp-3 ${t.textSecondary}`}>
                              {profile.description}
                            </p>
                          )}

                          {/* Interests */}
                          {profile.interests.length > 0 && (
                            <div className="space-y-1.5 pt-2 border-t border-neutral-100 dark:border-white/5">
                              <p className={`text-[9px] uppercase tracking-widest font-extrabold ${t.textMuted}`}>Primary Verticals</p>
                              <div className="flex flex-wrap gap-1">
                                {profile.interests.map((interest) => (
                                  <span
                                    key={interest}
                                    className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${
                                      isDark ? "bg-white/5 text-white/40 border-white/5" : "bg-black/4 text-black/50 border-black/5"
                                    }`}
                                  >
                                    {interest}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Social connections & Admin Actions Row */}
                        <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-dashed dark:border-white/5 border-neutral-200">
                          {/* Social links */}
                          <div className="flex gap-1.5">
                            {profile.github && (
                              <a
                                href={profile.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-2 rounded-lg border transition-all ${t.surface} ${t.border} ${t.textMuted} hover:${t.textPrimary} hover:bg-neutral-500/5`}
                                title="GitHub Profile"
                              >
                                <GitBranch size={13} className="stroke-[2.5px]" />
                              </a>
                            )}
                            {profile.linkedin && (
                              <a
                                href={profile.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-2 rounded-lg border transition-all ${t.surface} ${t.border} ${t.textMuted} hover:${t.textPrimary} hover:bg-neutral-500/5`}
                                title="LinkedIn Connection"
                              >
                                <Briefcase size={13} className="stroke-[2.5px]" />
                              </a>
                            )}
                            {profile.portfolio && (
                              <a
                                href={profile.portfolio}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-2 rounded-lg border transition-all ${t.surface} ${t.border} ${t.textMuted} hover:${t.textPrimary} hover:bg-neutral-500/5`}
                                title="Personal Website"
                              >
                                <Globe size={13} className="stroke-[2.5px]" />
                              </a>
                            )}
                          </div>

                          {/* Admin Actions */}
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setEditingUser(profile)}
                              className={`p-2 rounded-lg border transition-all cursor-pointer ${t.surface} ${t.border} ${t.textMuted} hover:${t.textPrimary} hover:bg-neutral-500/5`}
                              title="Edit Profile"
                            >
                              <Edit size={13} />
                            </button>
                            <button
                              type="button"
                              disabled={isMe || isAdminUser}
                              onClick={() => setBlockingUser(profile)}
                              className={`p-2 rounded-lg border transition-all ${
                                isMe || isAdminUser
                                  ? "opacity-30 cursor-not-allowed border-dashed"
                                  : "cursor-pointer"
                              } ${
                                profile.isBlocked
                                  ? "bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20"
                                  : `${t.surface} ${t.border} ${t.textMuted} ${!(isMe || isAdminUser) ? "hover:text-amber-500 hover:border-amber-500/30 hover:bg-amber-500/5" : ""}`
                              }`}
                              title={
                                isMe
                                  ? "You cannot suspend your own admin account"
                                  : isAdminUser
                                  ? "Administrator accounts cannot be suspended"
                                  : profile.isBlocked
                                  ? "Unblock Account"
                                  : "Suspend Account"
                              }
                            >
                              <Shield size={13} />
                            </button>
                            <button
                              type="button"
                              disabled={isMe || isAdminUser}
                              onClick={() => setDeleteConfirmUser(profile)}
                              className={`p-2 rounded-lg border border-transparent transition-all ${
                                isMe || isAdminUser
                                  ? "opacity-30 cursor-not-allowed border-dashed"
                                  : "text-red-400 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 cursor-pointer"
                              }`}
                              title={
                                isMe
                                  ? "You cannot delete your own admin account"
                                  : isAdminUser
                                  ? "Administrator accounts cannot be deleted"
                                  : "Delete Profile"
                              }
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmEntry && (
        <div className={t.modalOverlay}>
          <div className={`relative w-full max-w-md p-6 rounded-2xl overflow-hidden shadow-2xl space-y-4 animate-[scaleUp_0.15s_ease-out] ${t.modal}`}>
            <button
              onClick={() => setDeleteConfirmEntry(null)}
              className={`absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full border transition-all ${t.surface} ${t.border} ${t.textMuted}`}
            >
              <X size={13} />
            </button>
            <div className="flex items-center gap-3 text-red-500 mb-2">
              <div className="p-2 rounded-xl bg-red-500/10">
                <AlertTriangle size={22} className="stroke-[2.5px]" />
              </div>
              <h3 className={`text-base font-black tracking-tight ${t.textPrimary}`}>Delete Tool Entry</h3>
            </div>
            <p className={`text-[13px] leading-relaxed font-light ${t.textSecondary}`}>
              Are you sure you want to permanently delete/reject <strong className={t.textPrimary}>"{deleteConfirmEntry}"</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmEntry(null)}
                className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-colors ${t.btnGhost}`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const entryToDelete = deleteConfirmEntry;
                  setDeleteConfirmEntry(null);
                  await executeDelete(entryToDelete);
                }}
                className="px-5 py-2 rounded-xl text-[13px] font-semibold transition-all bg-red-600 hover:bg-red-500 text-white cursor-pointer active:translate-y-0"
              >
                Delete Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className={t.modalOverlay}>
          <div
            className={`relative w-full max-w-lg p-6 rounded-2xl overflow-hidden shadow-2xl space-y-4 animate-[scaleUp_0.15s_ease-out] ${t.modal}`}
            style={{ maxHeight: "85dvh", overflowY: "auto" }}
          >
            <button
              onClick={() => setEditingUser(null)}
              className={`absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full border transition-all ${t.surface} ${t.border} ${t.textMuted}`}
            >
              <X size={13} />
            </button>
            <div className="flex items-center gap-3 text-indigo-500 mb-2">
              <div className="p-2 rounded-xl bg-indigo-500/10">
                <Users size={22} className="stroke-[2.5px]" />
              </div>
              <h3 className={`text-base font-black tracking-tight ${t.textPrimary}`}>Edit Builder Profile</h3>
            </div>
            
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await handleUpdateUserProfile();
              }}
              className="space-y-4 text-left"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Display Name */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Display Name</label>
                  <input
                    type="text"
                    required
                    value={editingUser.displayName}
                    onChange={(e) => setEditingUser({ ...editingUser, displayName: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border text-[13px] outline-none transition-all ${t.input}`}
                  />
                </div>
                {/* Avatar URL (Read-only OAuth sync) */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Avatar (Google / GitHub Synced)</label>
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={editingUser.avatarUrl || "None (Initials only)"}
                    className={`w-full p-2.5 rounded-xl border text-[13px] outline-none transition-all opacity-60 cursor-not-allowed ${t.input}`}
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border text-[13px] outline-none transition-all ${t.input}`}
                >
                  <option value="developer">Developer / Engineer</option>
                  <option value="designer">UI/UX Designer</option>
                  <option value="researcher">AI Researcher</option>
                  <option value="pm">Product Manager</option>
                  <option value="creator">Content Creator</option>
                  <option value="founder">Founder / Executive</option>
                  <option value="other">Other Technologist</option>
                </select>
              </div>

              {/* Bio / Description */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Bio / Description</label>
                <textarea
                  value={editingUser.description}
                  onChange={(e) => setEditingUser({ ...editingUser, description: e.target.value })}
                  rows={2}
                  maxLength={160}
                  className={`w-full p-2.5 rounded-xl border text-[13px] outline-none resize-none transition-all ${t.input}`}
                  placeholder="Tell other builders about this user..."
                />
              </div>

              {/* Social Links */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Social Profiles</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="url"
                    value={editingUser.github}
                    onChange={(e) => setEditingUser({ ...editingUser, github: e.target.value })}
                    placeholder="GitHub Profile URL"
                    className={`w-full p-2.5 rounded-xl border text-[12px] outline-none transition-all ${t.input}`}
                  />
                  <input
                    type="url"
                    value={editingUser.linkedin}
                    onChange={(e) => setEditingUser({ ...editingUser, linkedin: e.target.value })}
                    placeholder="LinkedIn Profile URL"
                    className={`w-full p-2.5 rounded-xl border text-[12px] outline-none transition-all ${t.input}`}
                  />
                  <input
                    type="url"
                    value={editingUser.portfolio}
                    onChange={(e) => setEditingUser({ ...editingUser, portfolio: e.target.value })}
                    placeholder="Portfolio URL"
                    className={`w-full p-2.5 rounded-xl border text-[12px] outline-none transition-all ${t.input}`}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t border-dashed dark:border-white/5 border-neutral-200">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-colors ${t.btnGhost}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actioningId === editingUser.userKey}
                  className="px-5 py-2 rounded-xl text-[13px] font-semibold transition-all bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer active:translate-y-0 disabled:opacity-50"
                >
                  {actioningId === editingUser.userKey ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Blocking Dialog */}
      {blockingUser && (
        <div className={t.modalOverlay}>
          <div className={`relative w-full max-w-md p-6 rounded-2xl overflow-hidden shadow-2xl space-y-4 animate-[scaleUp_0.15s_ease-out] ${t.modal}`}>
            <button
              onClick={() => setBlockingUser(null)}
              className={`absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full border transition-all ${t.surface} ${t.border} ${t.textMuted}`}
            >
              <X size={13} />
            </button>
            <div className="flex items-center gap-3 text-amber-500 mb-2">
              <div className="p-2 rounded-xl bg-amber-500/10">
                <AlertTriangle size={22} className="stroke-[2.5px]" />
              </div>
              <h3 className={`text-base font-black tracking-tight ${t.textPrimary}`}>
                {blockingUser.isBlocked ? "Unblock Builder Account" : "Temporarily Suspend Account"}
              </h3>
            </div>
            <p className={`text-[13px] leading-relaxed font-light ${t.textSecondary}`}>
              {blockingUser.isBlocked ? (
                <>
                  Are you sure you want to unblock <strong className={t.textPrimary}>{blockingUser.displayName}</strong>? They will regain immediate access to personalized features.
                </>
              ) : (
                <>
                  Select the suspension duration for <strong className={t.textPrimary}>{blockingUser.displayName}</strong>. They will be logged out and blocked from logging in.
                </>
              )}
            </p>
            <div className="flex flex-col gap-2 pt-2">
              {blockingUser.isBlocked ? (
                <button
                  onClick={async () => {
                    await handleExecuteBlock(blockingUser, false, 0);
                  }}
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md cursor-pointer transition-all"
                >
                  Lift Suspension (Unblock)
                </button>
              ) : (
                <>
                  <button
                    onClick={async () => {
                      await handleExecuteBlock(blockingUser, true, 24 * 60 * 60 * 1000); // 24 Hours
                    }}
                    className="w-full py-2.5 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-black shadow-md cursor-pointer transition-all"
                  >
                    Suspend for 24 Hours
                  </button>
                  <button
                    onClick={async () => {
                      await handleExecuteBlock(blockingUser, true, 7 * 24 * 60 * 60 * 1000); // 7 Days
                    }}
                    className="w-full py-2.5 rounded-xl font-bold text-xs bg-orange-500 hover:bg-orange-400 text-white shadow-md cursor-pointer transition-all"
                  >
                    Suspend for 7 Days
                  </button>
                  <button
                    onClick={async () => {
                      await handleExecuteBlock(blockingUser, true, -1); // Permanent
                    }}
                    className="w-full py-2.5 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-500 text-white shadow-md cursor-pointer transition-all"
                  >
                    Suspend Indefinitely (Permanent)
                  </button>
                </>
              )}
              <button
                onClick={() => setBlockingUser(null)}
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors border ${t.border} ${t.surface} ${t.textSecondary} hover:${t.textPrimary}`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {deleteConfirmUser && (
        <div className={t.modalOverlay}>
          <div className={`relative w-full max-w-md p-6 rounded-2xl overflow-hidden shadow-2xl space-y-4 animate-[scaleUp_0.15s_ease-out] ${t.modal}`}>
            <button
              onClick={() => setDeleteConfirmUser(null)}
              className={`absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full border transition-all ${t.surface} ${t.border} ${t.textMuted}`}
            >
              <X size={13} />
            </button>
            <div className="flex items-center gap-3 text-red-500 mb-2">
              <div className="p-2 rounded-xl bg-red-500/10">
                <Trash2 size={22} className="stroke-[2.5px]" />
              </div>
              <h3 className={`text-base font-black tracking-tight ${t.textPrimary}`}>Permanently Delete Builder Profile</h3>
            </div>
            <p className={`text-[13px] leading-relaxed font-light ${t.textSecondary}`}>
              Are you sure you want to permanently delete the profile of <strong className={t.textPrimary}>{deleteConfirmUser.displayName} ({deleteConfirmUser.username})</strong>? All preference metadata and submissions history will be unlinked. This action is irreversible.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmUser(null)}
                className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-colors ${t.btnGhost}`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const userToDelete = deleteConfirmUser;
                  setDeleteConfirmUser(null);
                  await handleExecuteDeleteUser(userToDelete);
                }}
                className="px-5 py-2 rounded-xl text-[13px] font-semibold transition-all bg-red-600 hover:bg-red-500 text-white cursor-pointer active:translate-y-0"
              >
                Delete Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sleek Custom Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-[fadeUp_0.15s_ease-out]">
          <div className={`p-4 rounded-xl border flex items-center gap-3 text-[13px] font-medium shadow-2xl backdrop-blur-xl ${
            toast.type === "success" ? t.successToast : t.errorToast
          }`}>
            {toast.type === "success" ? (
              <Check size={18} className="shrink-0 text-emerald-400" />
            ) : (
              <Info size={18} className="shrink-0 text-red-400" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};
