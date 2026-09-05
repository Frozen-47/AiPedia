import React, { useState, useEffect, useMemo } from "react";
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
  Edit,
  Plus,
  Download,
  BarChart3,
  Megaphone,
  History,
  Sparkles,
  CheckCheck,
  FileJson,
  Database,
} from "lucide-react";
import { supabase, getOAuthAvatarUrl } from "../lib/supabase";
import { useTokens, useTheme, typeBadge, taskBadge, typeIcon, TYPE_GLYPH } from "../lib/theme";
import type { Entry } from "../types";
import { entries as defaultEntries } from "../data";
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

export interface SiteAnnouncement {
  enabled: boolean;
  message: string;
  type: "info" | "warning" | "success" | "special";
  linkText?: string;
  linkUrl?: string;
  updatedAt?: string;
}

export interface AuditLogItem {
  id: string;
  action: string;
  details: string;
  adminEmail: string;
  timestamp: string;
}

type TabId = "submissions" | "directory" | "users" | "analytics" | "announcements" | "audit";

interface EditingEntryState {
  isNew: boolean;
  name: string;
  org: string;
  type: "Model" | "Framework" | "Dataset" | "Platform" | "AI";
  task: string;
  license: string;
  year: number;
  size: string;
  summary: string;
  architecture: string;
  usage: string;
  benchmarks: string;
  limitations: string;
  url: string;
  popular: boolean;
}

const isNewSubmission = (createdAt?: string): boolean => {
  if (!createdAt) return false;
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays <= 2;
};

const DEFAULT_ANNOUNCEMENT: SiteAnnouncement = {
  enabled: false,
  message: "🚀 Welcome to AiVerse — Discover and compare 228+ open & commercial AI technologies.",
  type: "special",
  linkText: "Explore Models",
  linkUrl: "#catalog",
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

  // Filtering states
  const [directorySearch, setDirectorySearch] = useState("");
  const [directoryTypeFilter, setDirectoryTypeFilter] = useState<string>("All");
  const [directoryTaskFilter, setDirectoryTaskFilter] = useState<string>("All Tasks");
  const [directoryFeaturedOnly, setDirectoryFeaturedOnly] = useState(false);

  const [submissionsSearch, setSubmissionsSearch] = useState("");
  const [submissionsTypeFilter, setSubmissionsTypeFilter] = useState<string>("All");

  const [usersSearch, setUsersSearch] = useState("");
  const [usersStatusFilter, setUsersStatusFilter] = useState<"all" | "active" | "blocked">("all");

  // Actions & Dialog states
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [deleteConfirmEntry, setDeleteConfirmEntry] = useState<string | null>(null);
  const [batchConfirm, setBatchConfirm] = useState<"approve" | "reject" | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Modals for CRUD
  const [editingEntry, setEditingEntry] = useState<EditingEntryState | null>(null);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [blockingUser, setBlockingUser] = useState<UserProfile | null>(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<UserProfile | null>(null);

  // Site Announcements state
  const [announcement, setAnnouncement] = useState<SiteAnnouncement>(() => {
    try {
      const stored = localStorage.getItem("aiverse_site_announcement");
      return stored ? JSON.parse(stored) : DEFAULT_ANNOUNCEMENT;
    } catch {
      return DEFAULT_ANNOUNCEMENT;
    }
  });

  // Audit Logs state
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    try {
      const stored = localStorage.getItem("aiverse_admin_audit_logs");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const logAudit = (action: string, details: string) => {
    try {
      const newLog: AuditLogItem = {
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        action,
        details,
        adminEmail: user?.email || "admin",
        timestamp: new Date().toISOString(),
      };
      setAuditLogs((prev) => {
        const updated = [newLog, ...prev].slice(0, 100);
        localStorage.setItem("aiverse_admin_audit_logs", JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error("Failed to write audit log:", err);
    }
  };

  const clearAuditLogs = () => {
    localStorage.removeItem("aiverse_admin_audit_logs");
    setAuditLogs([]);
    showToast("success", "Audit trail cleared.");
  };

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
      
      const loadedApproved = (approvedData as Entry[]) || [];
      if (loadedApproved.length > 0) {
        setApprovedEntries(loadedApproved);
      } else {
        // Fallback to static catalog if DB entries table is not yet populated
        setApprovedEntries(defaultEntries.map((e) => ({ ...e, approved: true })));
      }

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
        } catch {}

        let blockedUntilDate: string | undefined = undefined;
        let isUserBlocked = false;
        const rawBlockedUntil = row.blocked_until || meta.blockedUntil || meta.blocked_until;
        if (rawBlockedUntil) {
          const bDate = new Date(rawBlockedUntil);
          if (bDate.getTime() > Date.now()) {
            isUserBlocked = true;
            blockedUntilDate = rawBlockedUntil;
          }
        } else if (meta.isBlocked) {
          isUserBlocked = true;
          blockedUntilDate = "9999-12-31T23:59:59.999Z";
        }

        let userAvatar = meta.avatarUrl || meta.avatar_url || undefined;
        if (userAvatar && userAvatar.includes("dicebear.com")) {
          userAvatar = undefined;
        }
        if (user && (row.user_key === currentUserKey || (user.id && row.user_key === user.id) || (user.id && row.user_key.includes(user.id)))) {
          const realOAuth = getOAuthAvatarUrl(user);
          if (realOAuth) userAvatar = realOAuth;
        }

        return {
          userKey: row.user_key,
          displayName: meta.displayName || "Unknown User",
          username: meta.username || `@user_${row.user_key.slice(-6)}`,
          description: meta.description || "",
          github: meta.github || "",
          linkedin: meta.linkedin || "",
          medium: meta.medium || "",
          devto: meta.devto || "",
          portfolio: meta.portfolio || "",
          avatarUrl: userAvatar,
          role: row.role || "developer",
          interests: row.interests || [],
          updatedAt: row.updated_at || new Date().toISOString(),
          isBlocked: isUserBlocked,
          blockedUntil: blockedUntilDate,
        };
      });

      setUsers(parsedUsers);
    } catch (err: any) {
      console.error("Admin dashboard load failed:", err);
      setError(err.message || "Failed to query admin records.");
      // Ensure catalog has fallback data
      setApprovedEntries(defaultEntries.map((e) => ({ ...e, approved: true })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ── Actions: Entry Management ─────────────────────────────────────────────

  const handleApprove = async (entry: Entry) => {
    setActioningId(entry.name);
    try {
      const { error: err } = await supabase
        .from("entries")
        .update({ approved: true })
        .eq("name", entry.name);

      if (err) throw err;

      setPendingEntries((prev) => prev.filter((e) => e.name !== entry.name));
      setApprovedEntries((prev) => [{ ...entry, approved: true }, ...prev]);
      showToast("success", `"${entry.name}" has been approved and published.`);
      logAudit("Approve Asset", `Approved and published "${entry.name}" to directory`);
    } catch (err: any) {
      showToast("error", `Failed to approve "${entry.name}": ${err.message}`);
    } finally {
      setActioningId(null);
    }
  };

  const handleBatchApproveAll = async () => {
    if (pendingEntries.length === 0) return;
    setActioningId("batch_approve");
    try {
      const names = pendingEntries.map((e) => e.name);
      const { error: err } = await supabase
        .from("entries")
        .update({ approved: true })
        .in("name", names);

      if (err) throw err;

      const count = pendingEntries.length;
      setApprovedEntries((prev) => [
        ...pendingEntries.map((e) => ({ ...e, approved: true })),
        ...prev,
      ]);
      setPendingEntries([]);
      setBatchConfirm(null);
      showToast("success", `Approved and published all ${count} submissions.`);
      logAudit("Batch Approve", `Approved all ${count} pending submissions at once`);
    } catch (err: any) {
      showToast("error", `Batch approve failed: ${err.message}`);
    } finally {
      setActioningId(null);
    }
  };

  const handleBatchRejectAll = async () => {
    if (pendingEntries.length === 0) return;
    setActioningId("batch_reject");
    try {
      const names = pendingEntries.map((e) => e.name);
      const { error: err } = await supabase
        .from("entries")
        .delete()
        .in("name", names);

      if (err) throw err;

      const count = pendingEntries.length;
      setPendingEntries([]);
      setBatchConfirm(null);
      showToast("success", `Discarded and purged all ${count} submissions.`);
      logAudit("Batch Reject", `Discarded all ${count} pending submissions from queue`);
    } catch (err: any) {
      showToast("error", `Batch reject failed: ${err.message}`);
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

      setPendingEntries((prev) => prev.filter((e) => e.name !== entryName));
      setApprovedEntries((prev) => prev.filter((e) => e.name !== entryName));
      showToast("success", `"${entryName}" has been deleted from catalog.`);
      logAudit("Delete Asset", `Deleted "${entryName}" from catalog`);
    } catch (err: any) {
      showToast("error", `Failed to delete "${entryName}": ${err.message}`);
    } finally {
      setActioningId(null);
      setDeleteConfirmEntry(null);
    }
  };

  const handleTogglePopular = async (entry: Entry) => {
    const newPopular = !entry.popular;
    setActioningId(entry.name);
    try {
      const { error: err } = await supabase
        .from("entries")
        .update({ popular: newPopular })
        .eq("name", entry.name);

      if (err) throw err;

      setApprovedEntries((prev) =>
        prev.map((e) => (e.name === entry.name ? { ...e, popular: newPopular } : e))
      );
      showToast("success", `"${entry.name}" marked as ${newPopular ? "Featured ⭐" : "Standard"}.`);
      logAudit("Toggle Featured", `Updated "${entry.name}" featured status to ${newPopular}`);
    } catch (err: any) {
      showToast("error", `Failed to update featured state: ${err.message}`);
    } finally {
      setActioningId(null);
    }
  };

  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry) return;

    setActioningId(editingEntry.name);
    try {
      const payload: Partial<Entry> = {
        name: editingEntry.name.trim(),
        org: editingEntry.org.trim(),
        type: editingEntry.type,
        task: editingEntry.task.trim(),
        license: editingEntry.license.trim(),
        year: Number(editingEntry.year),
        size: editingEntry.size.trim(),
        summary: editingEntry.summary.trim(),
        architecture: editingEntry.architecture.trim(),
        usage: editingEntry.usage.trim() || undefined,
        benchmarks: editingEntry.benchmarks.trim(),
        limitations: editingEntry.limitations.trim(),
        url: editingEntry.url.trim() || undefined,
        popular: editingEntry.popular,
        approved: true,
      };

      if (editingEntry.isNew) {
        const { error: err } = await supabase.from("entries").insert([{
          ...payload,
          citations: [],
          created_at: new Date().toISOString(),
        }]);
        if (err) throw err;

        const newEntry = { ...payload, citations: [] } as Entry;
        setApprovedEntries((prev) => [newEntry, ...prev]);
        showToast("success", `"${editingEntry.name}" created and published!`);
        logAudit("Create Asset", `Created new asset "${editingEntry.name}" in catalog`);
      } else {
        const { error: err } = await supabase
          .from("entries")
          .update(payload)
          .eq("name", editingEntry.name);
        if (err) throw err;

        setApprovedEntries((prev) =>
          prev.map((item) =>
            item.name === editingEntry.name ? ({ ...item, ...payload } as Entry) : item
          )
        );
        showToast("success", `"${editingEntry.name}" details updated.`);
        logAudit("Edit Asset", `Modified technical specs for "${editingEntry.name}"`);
      }
      setEditingEntry(null);
    } catch (err: any) {
      showToast("error", `Failed to save entry: ${err.message}`);
    } finally {
      setActioningId(null);
    }
  };

  // ── Actions: User Management ──────────────────────────────────────────────

  const handleUpdateUserProfile = async () => {
    if (!editingUser) return;
    setActioningId(editingUser.userKey);
    try {
      // Preserve existing flags like isBlocked / blockedUntil
      const { data: currentPref } = await supabase
        .from("user_preferences")
        .select("referral_source")
        .eq("user_key", editingUser.userKey)
        .maybeSingle();

      let existingMeta: any = {};
      try {
        if (currentPref?.referral_source) {
          existingMeta = JSON.parse(currentPref.referral_source);
        }
      } catch {}

      let finalAvatar = editingUser.avatarUrl || undefined;
      if (finalAvatar && finalAvatar.includes("dicebear.com")) {
        finalAvatar = undefined;
      }
      if (user && (editingUser.userKey === currentUserKey || editingUser.userKey === user.id)) {
        const oAuthPic = getOAuthAvatarUrl(user);
        if (oAuthPic) finalAvatar = oAuthPic;
      }

      const referralSourceObj = {
        ...existingMeta,
        source: "other",
        displayName: editingUser.displayName.trim(),
        username: editingUser.username,
        description: editingUser.description.trim(),
        github: editingUser.github.trim(),
        linkedin: editingUser.linkedin.trim(),
        medium: editingUser.medium.trim(),
        devto: editingUser.devto.trim(),
        portfolio: editingUser.portfolio.trim(),
        avatarUrl: finalAvatar,
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

      const updatedUser: UserProfile = {
        ...editingUser,
        avatarUrl: finalAvatar,
      };

      setUsers((prev) =>
        prev.map((u) => (u.userKey === editingUser.userKey ? updatedUser : u))
      );
      showToast("success", `Profile for "${editingUser.displayName}" updated.`);
      logAudit("Edit User", `Updated profile for "${editingUser.displayName}" (${editingUser.username})`);
      setEditingUser(null);
    } catch (err: any) {
      showToast("error", `Failed to update profile: ${err.message}`);
    } finally {
      setActioningId(null);
    }
  };

  const handleExecuteBlock = async (
    profile: UserProfile,
    isBlocked: boolean,
    durationMs: number = 0
  ) => {
    if (profile.userKey === currentUserKey || (user && profile.userKey === user.id)) {
      showToast("error", "Security violation: You cannot suspend your own admin account.");
      return;
    }

    setActioningId(profile.userKey);
    try {
      let blockedUntilValue: string | null = null;
      if (isBlocked) {
        if (durationMs === -1) {
          blockedUntilValue = "9999-12-31T23:59:59.999Z";
        } else {
          blockedUntilValue = new Date(Date.now() + durationMs).toISOString();
        }
      }

      // Fetch current referral_source JSON to store suspension state safely without schema changes
      const { data: currentPref } = await supabase
        .from("user_preferences")
        .select("referral_source")
        .eq("user_key", profile.userKey)
        .maybeSingle();

      let metaObj: any = {};
      try {
        if (currentPref?.referral_source) {
          metaObj = JSON.parse(currentPref.referral_source);
        }
      } catch {}

      metaObj.blockedUntil = blockedUntilValue;
      metaObj.isBlocked = isBlocked;

      const { error: err } = await supabase
        .from("user_preferences")
        .update({
          referral_source: JSON.stringify(metaObj),
          updated_at: new Date().toISOString(),
        })
        .eq("user_key", profile.userKey);

      if (err) throw err;

      setUsers((prev) =>
        prev.map((u) =>
          u.userKey === profile.userKey
            ? { ...u, isBlocked, blockedUntil: blockedUntilValue || undefined }
            : u
        )
      );

      const msg = isBlocked
        ? `Account for "${profile.displayName}" suspended.`
        : `Suspension lifted for "${profile.displayName}".`;
      showToast("success", msg);
      logAudit("Suspend User", `${isBlocked ? "Suspended" : "Reactivated"} account "${profile.displayName}"`);
      setBlockingUser(null);
    } catch (err: any) {
      showToast("error", `Failed to modify status: ${err.message}`);
    } finally {
      setActioningId(null);
    }
  };

  const handleExecuteDeleteUser = async (profile: UserProfile) => {
    if (profile.userKey === currentUserKey) {
      showToast("error", "Security violation: You cannot delete your own admin account.");
      return;
    }

    setActioningId(profile.userKey);
    try {
      const { error: err } = await supabase
        .from("user_preferences")
        .delete()
        .eq("user_key", profile.userKey);

      if (err) throw err;

      setUsers((prev) => prev.filter((u) => u.userKey !== profile.userKey));
      showToast("success", `User profile for "${profile.displayName}" deleted.`);
      logAudit("Delete User", `Deleted profile for "${profile.displayName}" (${profile.username})`);
    } catch (err: any) {
      showToast("error", `Failed to delete user: ${err.message}`);
    } finally {
      setActioningId(null);
    }
  };

  // ── Actions: Data Exports ─────────────────────────────────────────────────

  const exportDataAsJson = (data: any, filename: string) => {
    try {
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("success", `Exported ${filename} successfully.`);
      logAudit("Export Data", `Exported ${filename} as JSON snapshot`);
    } catch (err: any) {
      showToast("error", `Export failed: ${err.message}`);
    }
  };

  // ── Actions: Site Announcements ───────────────────────────────────────────

  const handleSaveAnnouncement = (ann: SiteAnnouncement) => {
    try {
      const updated = { ...ann, updatedAt: new Date().toISOString() };
      localStorage.setItem("aiverse_site_announcement", JSON.stringify(updated));
      window.dispatchEvent(new Event("announcement_updated"));
      setAnnouncement(updated);
      showToast("success", updated.enabled ? "Site announcement broadcasted live!" : "Announcement disabled.");
      logAudit(
        "Site Announcement",
        updated.enabled
          ? `Broadcasted banner: "${updated.message.slice(0, 35)}..."`
          : "Deactivated site-wide announcement"
      );
    } catch (err: any) {
      showToast("error", `Failed to save announcement: ${err.message}`);
    }
  };

  // ── Filtered Data Calculations ────────────────────────────────────────────

  const filteredApproved = useMemo(() => {
    return approvedEntries.filter((entry) => {
      const q = directorySearch.toLowerCase();
      const matchesQuery =
        !q ||
        entry.name.toLowerCase().includes(q) ||
        (entry.org || "").toLowerCase().includes(q) ||
        entry.type.toLowerCase().includes(q) ||
        entry.task.toLowerCase().includes(q);

      const matchesType = directoryTypeFilter === "All" || entry.type === directoryTypeFilter;
      const matchesTask = directoryTaskFilter === "All Tasks" || entry.task === directoryTaskFilter;
      const matchesFeatured = !directoryFeaturedOnly || !!entry.popular;

      return matchesQuery && matchesType && matchesTask && matchesFeatured;
    });
  }, [approvedEntries, directorySearch, directoryTypeFilter, directoryTaskFilter, directoryFeaturedOnly]);

  const filteredSubmissions = useMemo(() => {
    return pendingEntries.filter((entry) => {
      const q = submissionsSearch.toLowerCase();
      const matchesQuery =
        !q ||
        entry.name.toLowerCase().includes(q) ||
        (entry.org || "").toLowerCase().includes(q) ||
        entry.task.toLowerCase().includes(q);

      const matchesType = submissionsTypeFilter === "All" || entry.type === submissionsTypeFilter;
      return matchesQuery && matchesType;
    });
  }, [pendingEntries, submissionsSearch, submissionsTypeFilter]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = usersSearch.toLowerCase();
      const matchesQuery =
        !q ||
        u.displayName.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q);

      const matchesStatus =
        usersStatusFilter === "all"
          ? true
          : usersStatusFilter === "blocked"
          ? u.isBlocked
          : !u.isBlocked;

      return matchesQuery && matchesStatus;
    });
  }, [users, usersSearch, usersStatusFilter]);

  // Analytics Metrics
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { Model: 0, Framework: 0, Dataset: 0, Platform: 0, AI: 0 };
    approvedEntries.forEach((e) => {
      if (counts[e.type] !== undefined) counts[e.type]++;
    });
    return counts;
  }, [approvedEntries]);

  const taskCounts = useMemo(() => {
    const map: Record<string, number> = {};
    approvedEntries.forEach((e) => {
      map[e.task] = (map[e.task] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [approvedEntries]);

  const featuredCount = useMemo(() => approvedEntries.filter((e) => e.popular).length, [approvedEntries]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-[fadeUp_0.4s_ease-out] text-left">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
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
              <div className="flex items-center gap-2">
                <h1 className={`text-2xl font-black tracking-tight ${t.textPrimary}`}>
                  Administrator Command Center
                </h1>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                  Live
                </span>
              </div>
              <p className={`text-[12px] mt-1 font-light leading-relaxed max-w-xl ${t.textSecondary}`}>
                Audit submissions, curate the public AI catalog, manage user accounts, inspect system telemetry, and broadcast announcements.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setEditingEntry({
                isNew: true,
                name: "",
                org: "",
                type: "Model",
                task: "NLP",
                license: "MIT",
                year: new Date().getFullYear(),
                size: "Medium",
                summary: "",
                architecture: "",
                usage: "",
                benchmarks: "",
                limitations: "",
                url: "",
                popular: false,
              });
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-900/20 cursor-pointer transition-all active:scale-95"
          >
            <Plus size={14} className="stroke-[3px]" />
            Add New Asset
          </button>
          {!loading && (
            <button
              onClick={loadData}
              title="Refresh database records"
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border shadow-xs cursor-pointer transition-all active:scale-95 ${t.surface} ${t.border} ${t.textSecondary} hover:${t.textPrimary} hover:border-neutral-300 dark:hover:border-white/20`}
            >
              <RefreshCw size={12} className={`stroke-[2.5px] ${loading ? "animate-spin" : ""}`} />
              Sync
            </button>
          )}
        </div>
      </div>

      {/* ── RLS Policy Warning Banner ───────────────────────────────────────── */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex gap-3 animate-pulse">
          <Info size={18} className="shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">RLS Authorization Note</p>
            <p className="text-xs leading-relaxed opacity-90 font-light">
              The database query returned an advisory notice: {error}. Catalog fallback is active so all management tools remain operational.
            </p>
          </div>
        </div>
      )}

      {/* ── Segmented Tab Controller ────────────────────────────────────────── */}
      <div className={`p-1.5 flex gap-1.5 mb-8 overflow-x-auto no-scrollbar max-w-full rounded-2xl border ${t.surface} ${t.border}`}>
        {[
          { id: "submissions", label: "Pending Submissions", icon: Server, count: pendingEntries.length, countColor: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
          { id: "directory", label: "Approved Directory", icon: Star, count: approvedEntries.length, countColor: "bg-sky-500/15 text-sky-400 border-sky-500/20" },
          { id: "users", label: "Registered Users", icon: Users, count: users.length, countColor: "bg-indigo-500/15 text-indigo-400 border-indigo-500/20" },
          { id: "analytics", label: "Analytics & Telemetry", icon: BarChart3 },
          { id: "announcements", label: "Site Broadcast", icon: Megaphone, count: announcement.enabled ? 1 : 0, countColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
          { id: "audit", label: "Audit & Logs", icon: History, count: auditLogs.length, countColor: "bg-purple-500/15 text-purple-400 border-purple-500/20" },
        ].map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabId)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? isDark
                    ? "bg-white/10 text-white shadow-md border border-white/10"
                    : "bg-white text-black shadow-sm border border-neutral-200"
                  : `text-neutral-400 hover:text-neutral-600 dark:text-white/45 dark:hover:text-white/70`
              }`}
            >
              <TabIcon size={14} className="stroke-[2.5px]" />
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`ml-1 px-1.5 py-0.5 text-[9px] font-extrabold rounded-full border ${tab.countColor}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Main Content ────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-8 h-8 border-3 border-neutral-300 border-t-neutral-800 dark:border-white/10 dark:border-t-white rounded-full animate-spin" />
          <p className={`text-[10px] font-extrabold uppercase tracking-widest ${t.textMuted}`}>Syncing Admin Records...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* ══════════ TAB 1: PENDING SUBMISSIONS ══════════ */}
          {activeTab === "submissions" && (
            <div className="space-y-6">
              {/* Controls bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative w-64">
                    <input
                      type="text"
                      value={submissionsSearch}
                      onChange={(e) => setSubmissionsSearch(e.target.value)}
                      placeholder="Search queue..."
                      className={`w-full pl-9 pr-3 py-1.5 rounded-lg border text-xs outline-none ${t.input}`}
                    />
                    <Search className="absolute left-3 top-2 text-neutral-400" size={13} />
                  </div>

                  <select
                    value={submissionsTypeFilter}
                    onChange={(e) => setSubmissionsTypeFilter(e.target.value)}
                    className={`px-3 py-1.5 rounded-lg border text-xs outline-none cursor-pointer ${t.input}`}
                  >
                    <option value="All">All Categories</option>
                    <option value="Model">Models</option>
                    <option value="Framework">Frameworks</option>
                    <option value="Dataset">Datasets</option>
                    <option value="Platform">Platforms</option>
                    <option value="AI">AI Apps</option>
                  </select>
                </div>

                {pendingEntries.length > 0 && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setBatchConfirm("approve")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 cursor-pointer shadow-xs"
                    >
                      <CheckCheck size={13} />
                      Approve All ({pendingEntries.length})
                    </button>
                    <button
                      onClick={() => setBatchConfirm("reject")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-400 border border-red-500/20 hover:bg-red-500/10 cursor-pointer"
                    >
                      <Trash2 size={13} />
                      Clear All
                    </button>
                  </div>
                )}
              </div>

              {filteredSubmissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-center border border-dashed rounded-2xl border-neutral-200 dark:border-white/10 bg-neutral-50/50 dark:bg-white/[0.005]">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
                    <Check size={22} className="stroke-[3px]" />
                  </div>
                  <p className={`text-sm font-semibold ${t.textPrimary}`}>Submissions queue is clean</p>
                  <p className={`text-xs max-w-[320px] leading-relaxed font-light ${t.textMuted}`}>
                    All user-submitted frameworks, datasets, and models have been audited and approved.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredSubmissions.map((entry) => {
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
                        <div className="space-y-4">
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
                                  {entry.org || "Independent"} · {entry.year}
                                </p>
                              </div>
                            </div>
                            {entry.url && (
                              <a
                                href={entry.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-2 rounded-xl border transition-all ${t.surface} ${t.border} ${t.textSecondary} hover:${t.textPrimary}`}
                                title="Visit official resources"
                              >
                                <ExternalLink size={13} className="stroke-[2.5px]" />
                              </a>
                            )}
                          </div>

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

                          {/* Submitter User Chip */}
                          <div className={`mt-3 p-2.5 rounded-xl border flex items-center gap-2.5 text-xs ${isDark ? "bg-white/[0.015] border-white/5" : "bg-black/[0.015] border-black/5"}`}>
                            <div className={`w-7 h-7 rounded-full overflow-hidden shrink-0 flex items-center justify-center font-bold text-[9px] border ${isDark ? "bg-white/8 border-white/10 text-white" : "bg-black/6 border-black/10 text-black"}`}>
                              {submitter?.avatarUrl ? (
                                <img src={submitter.avatarUrl} alt="" className="w-full h-full object-cover" />
                              ) : (
                                submitter?.displayName ? submitter.displayName.slice(0, 2).toUpperCase() : "AN"
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={`text-[11px] truncate font-medium ${t.textPrimary}`}>
                                {submitter ? (
                                  <>
                                    <span className="font-bold">{submitter.displayName}</span>{" "}
                                    <span className={`text-[10px] ${t.textMuted}`}>({submitter.username})</span>
                                  </>
                                ) : (
                                  <span className={t.textMuted}>Anonymous Contributor</span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2 mt-5 pt-4 border-t border-dashed dark:border-white/5 border-neutral-200">
                          <button
                            type="button"
                            onClick={() => handleApprove(entry)}
                            disabled={actioningId === entry.name}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs disabled:opacity-50"
                          >
                            <Check size={14} className="stroke-[3px]" />
                            {actioningId === entry.name ? "Approving..." : "Approve & Publish"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmEntry(entry.name)}
                            disabled={actioningId === entry.name}
                            className="flex items-center justify-center p-2 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 cursor-pointer disabled:opacity-50"
                            title="Reject and discard submission"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ══════════ TAB 2: APPROVED DIRECTORY ══════════ */}
          {activeTab === "directory" && (
            <div className="space-y-5">
              {/* Search and Filters Bar */}
              <div className="flex flex-col gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="relative flex-1 max-w-md">
                    <input
                      type="text"
                      value={directorySearch}
                      onChange={(e) => setDirectorySearch(e.target.value)}
                      placeholder="Search active catalog by name, org, or task..."
                      className={`w-full pl-9 pr-4 py-2 rounded-xl border text-xs outline-none transition-all ${t.input}`}
                    />
                    <Search className="absolute left-3 top-2.5 text-neutral-400" size={14} />
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <select
                      value={directoryTaskFilter}
                      onChange={(e) => setDirectoryTaskFilter(e.target.value)}
                      className={`px-3 py-2 rounded-xl border text-xs outline-none cursor-pointer ${t.input}`}
                    >
                      <option value="All Tasks">All Tasks</option>
                      {taskCounts.map(([taskName]) => (
                        <option key={taskName} value={taskName}>{taskName}</option>
                      ))}
                    </select>

                    <button
                      onClick={() => setDirectoryFeaturedOnly((f) => !f)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        directoryFeaturedOnly
                          ? "bg-amber-400 text-black border-amber-300 font-extrabold shadow-xs"
                          : `${t.surface} ${t.border} ${t.textSecondary}`
                      }`}
                    >
                      <Star size={13} className={directoryFeaturedOnly ? "fill-black text-black" : "text-amber-400"} />
                      Featured ({featuredCount})
                    </button>

                    <button
                      onClick={() => exportDataAsJson(approvedEntries, "aiverse_catalog")}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border cursor-pointer ${t.surface} ${t.border} ${t.textSecondary} hover:${t.textPrimary}`}
                      title="Download catalog JSON"
                    >
                      <Download size={13} />
                      Export
                    </button>
                  </div>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {(["All", "Model", "Framework", "Dataset", "Platform", "AI"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setDirectoryTypeFilter(type)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
                        directoryTypeFilter === type
                          ? "bg-white text-black border-white font-extrabold shadow-xs"
                          : `border-transparent ${t.textMuted} hover:${t.textPrimary}`
                      }`}
                    >
                      {type === "All" ? "All Types" : type} {type !== "All" && `(${typeCounts[type] || 0})`}
                    </button>
                  ))}
                  <div className="ml-auto text-[11px] font-medium text-neutral-400">
                    Showing <strong className={t.textPrimary}>{filteredApproved.length}</strong> of {approvedEntries.length} assets
                  </div>
                </div>
              </div>

              {filteredApproved.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-center border border-dashed rounded-2xl border-neutral-200 dark:border-white/10">
                  <div className="text-3xl opacity-30 text-neutral-400">◌</div>
                  <p className={`text-sm font-semibold ${t.textPrimary}`}>No approved assets match your filters</p>
                  <p className={`text-xs max-w-[280px] leading-relaxed ${t.textMuted}`}>
                    Try clearing search query or category filters.
                  </p>
                </div>
              ) : (
                <div className={`overflow-x-auto rounded-2xl border shadow-sm ${t.border} ${t.scrollbar}`}>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={`border-b text-[10px] font-bold uppercase tracking-wider ${t.surface2} ${t.textMuted}`}>
                        <th className="px-5 py-3.5">Asset</th>
                        <th className="px-4 py-3.5">Organization</th>
                        <th className="px-4 py-3.5">Category</th>
                        <th className="px-4 py-3.5">Task</th>
                        <th className="px-4 py-3.5">License</th>
                        <th className="px-4 py-3.5">Year</th>
                        <th className="px-4 py-3.5 text-center">Featured</th>
                        <th className="px-5 py-3.5 text-right">Manage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {filteredApproved.map((entry) => {
                        const isNew = isNewSubmission(entry.created_at);

                        return (
                          <tr
                            key={entry.name}
                            className={`text-xs transition-colors hover:bg-neutral-50/50 dark:hover:bg-white/[0.015] ${
                              isNew ? "bg-indigo-500/[0.015] border-l-2 border-l-indigo-500" : ""
                            }`}
                          >
                            <td className="px-5 py-3.5 font-bold">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => onViewEntry?.(entry)}
                                  className={`hover:underline font-extrabold cursor-pointer transition-colors hover:text-indigo-400 ${t.textPrimary}`}
                                >
                                  {entry.name}
                                </button>
                                {isNew && (
                                  <span className="text-[7px] font-extrabold uppercase px-1 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
                                    NEW
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className={`px-4 py-3.5 font-medium ${t.textSecondary}`}>{entry.org || "—"}</td>
                            <td className="px-4 py-3.5">
                              <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md border ${typeBadge(entry.type, t)}`}>
                                {entry.type}
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md border ${taskBadge(entry.task, t)}`}>
                                {entry.task}
                              </span>
                            </td>
                            <td className={`px-4 py-3.5 font-medium ${t.textSecondary}`}>{entry.license || "—"}</td>
                            <td className={`px-4 py-3.5 font-medium ${t.textSecondary}`}>{entry.year}</td>
                            <td className="px-4 py-3.5 text-center">
                              <button
                                onClick={() => handleTogglePopular(entry)}
                                disabled={actioningId === entry.name}
                                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                  entry.popular
                                    ? "bg-amber-400/15 border-amber-400/30 text-amber-400"
                                    : "border-transparent text-neutral-500 hover:text-neutral-300"
                                }`}
                                title={entry.popular ? "Starred as Featured (click to toggle)" : "Click to Feature"}
                              >
                                <Star size={14} className={entry.popular ? "fill-amber-400 text-amber-400" : ""} />
                              </button>
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    setEditingEntry({
                                      isNew: false,
                                      name: entry.name,
                                      org: entry.org || "",
                                      type: entry.type,
                                      task: entry.task || "NLP",
                                      license: entry.license || "MIT",
                                      year: entry.year || new Date().getFullYear(),
                                      size: entry.size || "Unknown",
                                      summary: entry.summary || "",
                                      architecture: entry.architecture || "",
                                      usage: entry.usage || "",
                                      benchmarks: entry.benchmarks || "",
                                      limitations: entry.limitations || "",
                                      url: entry.url || "",
                                      popular: !!entry.popular,
                                    });
                                  }}
                                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${t.surface} ${t.border} text-sky-400 hover:bg-sky-500/10`}
                                  title="Edit asset specifications"
                                >
                                  <Edit size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirmEntry(entry.name)}
                                  disabled={actioningId === entry.name}
                                  className="p-1.5 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-all cursor-pointer disabled:opacity-50"
                                  title="Delete asset from directory"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
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

          {/* ══════════ TAB 3: REGISTERED USERS ══════════ */}
          {activeTab === "users" && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    value={usersSearch}
                    onChange={(e) => setUsersSearch(e.target.value)}
                    placeholder="Search users by name, handle, or role..."
                    className={`w-full pl-9 pr-4 py-2 rounded-xl border text-xs outline-none ${t.input}`}
                  />
                  <Search className="absolute left-3 top-2.5 text-neutral-400" size={14} />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={usersStatusFilter}
                    onChange={(e) => setUsersStatusFilter(e.target.value as any)}
                    className={`px-3 py-2 rounded-xl border text-xs outline-none cursor-pointer ${t.input}`}
                  >
                    <option value="all">All Accounts</option>
                    <option value="active">Active Only</option>
                    <option value="blocked">Suspended Only</option>
                  </select>

                  <button
                    onClick={() => exportDataAsJson(users, "aiverse_users")}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border cursor-pointer ${t.surface} ${t.border} ${t.textSecondary} hover:${t.textPrimary}`}
                  >
                    <Download size={13} />
                    Export Users
                  </button>
                </div>
              </div>

              {filteredUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-center border border-dashed rounded-2xl border-neutral-200 dark:border-white/10">
                  <div className="text-3xl opacity-30 text-neutral-400">◌</div>
                  <p className={`text-sm font-semibold ${t.textPrimary}`}>No users found</p>
                  <p className={`text-xs max-w-[280px] leading-relaxed ${t.textMuted}`}>
                    Try modifying your search or filter parameters.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredUsers.map((profile) => (
                    <div
                      key={profile.userKey}
                      className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                        profile.isBlocked
                          ? "border-red-500/30 bg-red-500/[0.02]"
                          : t.card
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-11 h-11 rounded-full overflow-hidden shrink-0 flex items-center justify-center font-black text-sm border ${
                              isDark ? "bg-neutral-800 text-white border-white/10" : "bg-neutral-100 text-black border-black/10"
                            }`}>
                              {profile.avatarUrl ? (
                                <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
                              ) : (
                                profile.displayName.slice(0, 2).toUpperCase()
                              )}
                            </div>
                            <div className="min-w-0">
                              <h4 className={`text-sm font-bold truncate ${t.textPrimary}`}>
                                {profile.displayName}
                              </h4>
                              <p className={`text-[11px] font-mono truncate text-neutral-400`}>
                                {profile.username}
                              </p>
                            </div>
                          </div>

                          <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full shrink-0 border ${
                            profile.isBlocked
                              ? "bg-red-500/15 text-red-400 border-red-500/30"
                              : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                          }`}>
                            {profile.isBlocked ? "Suspended" : "Active"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                            isDark ? "bg-white/5 border-white/10 text-white/70" : "bg-black/5 border-black/10 text-black/70"
                          }`}>
                            {profile.role}
                          </span>
                          {profile.interests.slice(0, 2).map((item) => (
                            <span key={item} className="text-[9px] text-neutral-400">
                              #{item}
                            </span>
                          ))}
                        </div>

                        {profile.description && (
                          <p className={`text-[11px] font-light leading-relaxed line-clamp-2 ${t.textSecondary}`}>
                            {profile.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-4 mt-4 border-t border-dashed dark:border-white/5 border-neutral-200">
                        <button
                          onClick={() => setEditingUser(profile)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border text-center transition-all cursor-pointer ${t.surface} ${t.border} ${t.textSecondary} hover:${t.textPrimary}`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setBlockingUser(profile)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                            profile.isBlocked
                              ? "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                              : "border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                          }`}
                        >
                          {profile.isBlocked ? "Unsuspend" : "Suspend"}
                        </button>
                        <button
                          onClick={() => setDeleteConfirmUser(profile)}
                          className="p-1.5 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 cursor-pointer"
                          title="Delete user"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══════════ TAB 4: ANALYTICS & TELEMETRY ══════════ */}
          {activeTab === "analytics" && (
            <div className="space-y-8">
              {/* Telemetry Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                  { label: "Active Catalog", value: approvedEntries.length, sub: "Verified & public", color: "text-sky-400 bg-sky-500/10 border-sky-500/20" },
                  { label: "Pending Queue", value: pendingEntries.length, sub: "Submissions awaiting audit", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
                  { label: "Registered Builders", value: users.length, sub: "Synced developer accounts", color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
                  { label: "Featured Assets", value: featuredCount, sub: "Highlighted on dashboard", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
                  { label: "Suspended Accounts", value: users.filter((u) => u.isBlocked).length, sub: "Access restricted", color: "text-red-400 bg-red-500/10 border-red-500/20" },
                ].map((item, idx) => (
                  <div key={idx} className={`p-4 rounded-2xl border ${t.card} flex flex-col justify-between`}>
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${t.textMuted}`}>{item.label}</p>
                    <div className="my-2">
                      <span className="text-3xl font-black">{item.value}</span>
                    </div>
                    <p className={`text-[10px] font-light ${t.textSecondary}`}>{item.sub}</p>
                  </div>
                ))}
              </div>

              {/* Category Breakdown Progress Bars */}
              <div className={`p-6 rounded-2xl border ${t.card} space-y-4`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-sm font-bold ${t.textPrimary}`}>Catalog Category Distribution</h3>
                    <p className={`text-[11px] ${t.textMuted}`}>Live asset counts and proportional percentage breakdown</p>
                  </div>
                  <span className="text-xs font-mono font-bold">{approvedEntries.length} Total</span>
                </div>

                <div className="space-y-3 pt-2">
                  {[
                    { type: "Model", label: "Models & LLMs", color: "bg-purple-500", text: "text-purple-400" },
                    { type: "Framework", label: "Frameworks & Libraries", color: "bg-amber-500", text: "text-amber-400" },
                    { type: "Dataset", label: "Datasets & Corpora", color: "bg-emerald-500", text: "text-emerald-400" },
                    { type: "Platform", label: "Platforms & Compute", color: "bg-sky-500", text: "text-sky-400" },
                    { type: "AI", label: "AI Applications", color: "bg-rose-500", text: "text-rose-400" },
                  ].map((cat) => {
                    const count = typeCounts[cat.type] || 0;
                    const pct = approvedEntries.length > 0 ? Math.round((count / approvedEntries.length) * 100) : 0;
                    return (
                      <div key={cat.type} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className={`font-semibold ${cat.text}`}>{cat.label}</span>
                          <span className="font-mono text-neutral-400">{count} ({pct}%)</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${cat.color} transition-all duration-500`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Data Export & Backup Center */}
              <div className={`p-6 rounded-2xl border ${t.card} space-y-4`}>
                <div>
                  <h3 className={`text-sm font-bold ${t.textPrimary}`}>Database Backup & Snapshots</h3>
                  <p className={`text-[11px] ${t.textMuted}`}>Export clean JSON records for cold storage, backups, and external migrations</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                  <button
                    onClick={() => exportDataAsJson(approvedEntries, "aiverse_catalog_approved")}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all hover:border-white/20 ${t.surface}`}
                  >
                    <FileJson size={18} className="text-sky-400 mb-2" />
                    <p className="text-xs font-bold">Catalog Assets</p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">Export all 228+ approved AI tools</p>
                  </button>

                  <button
                    onClick={() => exportDataAsJson(users, "aiverse_builders_directory")}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all hover:border-white/20 ${t.surface}`}
                  >
                    <Users size={18} className="text-indigo-400 mb-2" />
                    <p className="text-xs font-bold">User Registries</p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">Export registered builder profiles</p>
                  </button>

                  <button
                    onClick={() => exportDataAsJson(pendingEntries, "aiverse_pending_queue")}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all hover:border-white/20 ${t.surface}`}
                  >
                    <Server size={18} className="text-amber-400 mb-2" />
                    <p className="text-xs font-bold">Pending Submissions</p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">Export unapproved audit queue</p>
                  </button>

                  <button
                    onClick={() =>
                      exportDataAsJson(
                        {
                          catalog: approvedEntries,
                          users,
                          pending: pendingEntries,
                          announcement,
                          exportedAt: new Date().toISOString(),
                        },
                        "aiverse_complete_system_backup"
                      )
                    }
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all hover:border-emerald-500/40 bg-emerald-500/[0.03] border-emerald-500/20`}
                  >
                    <Database size={18} className="text-emerald-400 mb-2" />
                    <p className="text-xs font-bold text-emerald-400">Full System Snapshot</p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">Unified multi-table bundle</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ══════════ TAB 5: SITE ANNOUNCEMENTS ══════════ */}
          {activeTab === "announcements" && (
            <div className="space-y-6 max-w-3xl">
              <div className={`p-6 rounded-2xl border space-y-6 ${t.card}`}>
                <div>
                  <h3 className={`text-base font-black tracking-tight ${t.textPrimary}`}>
                    Site-wide Announcement Broadcast
                  </h3>
                  <p className={`text-xs ${t.textMuted} mt-1 leading-relaxed`}>
                    Broadcast banner messages across the top of AiVerse to alert all users of new models, releases, or system updates.
                  </p>
                </div>

                {/* Live Preview Box */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Live Banner Preview</span>
                  <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between gap-3 ${
                    announcement.type === "warning"
                      ? "bg-amber-500/15 border-amber-500/30 text-amber-300"
                      : announcement.type === "success"
                      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                      : announcement.type === "special"
                      ? "bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-amber-500/20 border-violet-500/30 text-white"
                      : "bg-sky-500/15 border-sky-500/30 text-sky-300"
                  }`}>
                    <div className="flex items-center gap-2">
                      <Sparkles size={14} className="shrink-0" />
                      <span>{announcement.message || "Enter announcement message below..."}</span>
                      {announcement.linkUrl && (
                        <span className="underline ml-2 font-bold opacity-80 cursor-pointer">
                          {announcement.linkText || "Learn more"} →
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] opacity-60">Dismiss ✕</span>
                  </div>
                </div>

                {/* Form Controls */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.01]">
                    <div>
                      <p className="text-xs font-bold">Banner Active Status</p>
                      <p className="text-[11px] text-neutral-400">Display this announcement to visitors</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAnnouncement((prev) => ({ ...prev, enabled: !prev.enabled }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                        announcement.enabled
                          ? "bg-emerald-500 text-black font-extrabold"
                          : "bg-neutral-800 text-neutral-400"
                      }`}
                    >
                      {announcement.enabled ? "Enabled" : "Disabled"}
                    </button>
                  </div>

                  {/* Banner Type */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider opacity-70">Banner Accent</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: "special", label: "Special Highlight", color: "border-purple-500/40 text-purple-400" },
                        { id: "info", label: "Informational", color: "border-sky-500/40 text-sky-400" },
                        { id: "success", label: "Success / Release", color: "border-emerald-500/40 text-emerald-400" },
                        { id: "warning", label: "Warning / Notice", color: "border-amber-500/40 text-amber-400" },
                      ].map((sev) => (
                        <button
                          key={sev.id}
                          type="button"
                          onClick={() => setAnnouncement((prev) => ({ ...prev, type: sev.id as any }))}
                          className={`p-2.5 rounded-xl border text-xs font-bold text-center cursor-pointer transition-all ${
                            announcement.type === sev.id
                              ? `${sev.color} bg-white/5 shadow-xs`
                              : "border-white/5 text-neutral-400 hover:text-neutral-200"
                          }`}
                        >
                          {sev.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message Textarea */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider opacity-70">Announcement Message</label>
                    <textarea
                      value={announcement.message}
                      onChange={(e) => setAnnouncement((prev) => ({ ...prev, message: e.target.value }))}
                      rows={2}
                      maxLength={180}
                      className={`w-full p-3 rounded-xl border text-xs outline-none ${t.input}`}
                      placeholder="e.g. 🚀 15 new vision models and benchmarks have been added to the catalog!"
                    />
                  </div>

                  {/* Optional Action Link */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider opacity-70">Button Label (Optional)</label>
                      <input
                        type="text"
                        value={announcement.linkText || ""}
                        onChange={(e) => setAnnouncement((prev) => ({ ...prev, linkText: e.target.value }))}
                        placeholder="e.g. Explore Now"
                        className={`w-full p-2.5 rounded-xl border text-xs outline-none ${t.input}`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider opacity-70">Button URL (Optional)</label>
                      <input
                        type="text"
                        value={announcement.linkUrl || ""}
                        onChange={(e) => setAnnouncement((prev) => ({ ...prev, linkUrl: e.target.value }))}
                        placeholder="e.g. #catalog or https://..."
                        className={`w-full p-2.5 rounded-xl border text-xs outline-none ${t.input}`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => handleSaveAnnouncement(announcement)}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 cursor-pointer shadow-md shadow-indigo-900/20"
                    >
                      Save & Broadcast Live
                    </button>
                    {announcement.enabled && (
                      <button
                        type="button"
                        onClick={() => handleSaveAnnouncement({ ...announcement, enabled: false })}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white cursor-pointer"
                      >
                        Deactivate Banner
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════ TAB 6: AUDIT & ACTIVITY LOG ══════════ */}
          {activeTab === "audit" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                <div>
                  <h3 className={`text-sm font-bold ${t.textPrimary}`}>Security & Administrative Action Log</h3>
                  <p className={`text-[11px] ${t.textMuted}`}>Chronological audit trail of catalog approvals, edits, suspensions, and exports</p>
                </div>
                {auditLogs.length > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => exportDataAsJson(auditLogs, "aiverse_audit_log")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${t.surface} ${t.border} ${t.textSecondary}`}
                    >
                      <Download size={13} />
                      Export Log
                    </button>
                    <button
                      onClick={clearAuditLogs}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 border border-red-500/20 hover:bg-red-500/10 cursor-pointer"
                    >
                      Clear Log
                    </button>
                  </div>
                )}
              </div>

              {auditLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-center border border-dashed rounded-2xl border-neutral-200 dark:border-white/10">
                  <div className="text-3xl opacity-30 text-neutral-400">◌</div>
                  <p className={`text-sm font-semibold ${t.textPrimary}`}>Audit log is clean</p>
                  <p className={`text-xs max-w-[280px] leading-relaxed ${t.textMuted}`}>
                    Actions performed in this admin console will automatically be cataloged here.
                  </p>
                </div>
              ) : (
                <div className={`overflow-x-auto rounded-2xl border ${t.border}`}>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={`border-b text-[10px] font-bold uppercase tracking-wider ${t.surface2} ${t.textMuted}`}>
                        <th className="px-5 py-3.5">Action</th>
                        <th className="px-5 py-3.5">Details</th>
                        <th className="px-5 py-3.5">Admin</th>
                        <th className="px-5 py-3.5 text-right">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {auditLogs.map((log) => (
                        <tr key={log.id} className="text-xs hover:bg-white/[0.01]">
                          <td className="px-5 py-3 font-bold">
                            <span className="inline-flex items-center text-[9px] font-extrabold px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
                              {log.action}
                            </span>
                          </td>
                          <td className={`px-5 py-3 font-medium ${t.textSecondary}`}>{log.details}</td>
                          <td className={`px-5 py-3 font-mono text-[11px] text-neutral-400`}>{log.adminEmail}</td>
                          <td className={`px-5 py-3 text-right font-mono text-[11px] text-neutral-500`}>
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ══════════ MODALS ══════════ */}

      {/* Batch Confirm Modal */}
      {batchConfirm && (
        <div className={t.modalOverlay}>
          <div className={`relative w-full max-w-md p-6 rounded-2xl overflow-hidden shadow-2xl space-y-4 animate-[scaleUp_0.15s_ease-out] ${t.modal}`}>
            <button
              onClick={() => setBatchConfirm(null)}
              className={`absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full border transition-all ${t.surface} ${t.border} ${t.textMuted}`}
            >
              <X size={13} />
            </button>
            <div className={`p-2 rounded-xl w-fit ${batchConfirm === "approve" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
              {batchConfirm === "approve" ? <CheckCheck size={24} /> : <AlertTriangle size={24} />}
            </div>
            <h3 className={`text-base font-black tracking-tight ${t.textPrimary}`}>
              {batchConfirm === "approve" ? `Approve All ${pendingEntries.length} Submissions?` : `Purge All ${pendingEntries.length} Submissions?`}
            </h3>
            <p className={`text-xs leading-relaxed font-light ${t.textSecondary}`}>
              {batchConfirm === "approve"
                ? "This will batch-publish all currently pending tools and models to the live public catalog immediately."
                : "This will permanently discard and reject all submissions currently awaiting review in the inbox."}
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setBatchConfirm(null)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold ${t.btnGhost}`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={batchConfirm === "approve" ? handleBatchApproveAll : handleBatchRejectAll}
                className={`px-5 py-2 rounded-xl text-xs font-bold text-white cursor-pointer ${
                  batchConfirm === "approve" ? "bg-emerald-600 hover:bg-emerald-500" : "bg-red-600 hover:bg-red-500"
                }`}
              >
                {batchConfirm === "approve" ? `Approve All (${pendingEntries.length})` : "Purge Submissions"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Asset Modal */}
      {editingEntry && (
        <div className={t.modalOverlay}>
          <div
            className={`relative w-full max-w-2xl p-6 rounded-2xl overflow-hidden shadow-2xl space-y-4 animate-[scaleUp_0.15s_ease-out] ${t.modal}`}
            style={{ maxHeight: "90dvh", overflowY: "auto" }}
          >
            <button
              onClick={() => setEditingEntry(null)}
              className={`absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full border transition-all ${t.surface} ${t.border} ${t.textMuted}`}
            >
              <X size={13} />
            </button>

            <div className="flex items-center gap-3 text-indigo-400 mb-2">
              <div className="p-2 rounded-xl bg-indigo-500/10">
                <Edit size={20} />
              </div>
              <div>
                <h3 className={`text-base font-black tracking-tight ${t.textPrimary}`}>
                  {editingEntry.isNew ? "Create New AI Asset" : `Edit Specifications: ${editingEntry.name}`}
                </h3>
                <p className={`text-[11px] ${t.textMuted}`}>
                  {editingEntry.isNew ? "Directly publish a verified model or tool to the catalog" : "Update technical specs, links, and benchmarks"}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveEntry} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Asset Name</label>
                  <input
                    type="text"
                    required
                    disabled={!editingEntry.isNew}
                    value={editingEntry.name}
                    onChange={(e) => setEditingEntry({ ...editingEntry, name: e.target.value })}
                    placeholder="e.g. DeepSeek-V3"
                    className={`w-full p-2.5 rounded-xl border text-xs outline-none ${t.input} ${!editingEntry.isNew ? "opacity-60 cursor-not-allowed" : ""}`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Organization</label>
                  <input
                    type="text"
                    required
                    value={editingEntry.org}
                    onChange={(e) => setEditingEntry({ ...editingEntry, org: e.target.value })}
                    placeholder="e.g. DeepSeek / Meta / Anthropic"
                    className={`w-full p-2.5 rounded-xl border text-xs outline-none ${t.input}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Category</label>
                  <select
                    value={editingEntry.type}
                    onChange={(e) => setEditingEntry({ ...editingEntry, type: e.target.value as any })}
                    className={`w-full p-2.5 rounded-xl border text-xs outline-none cursor-pointer ${t.input}`}
                  >
                    <option value="Model">Model</option>
                    <option value="Framework">Framework</option>
                    <option value="Dataset">Dataset</option>
                    <option value="Platform">Platform</option>
                    <option value="AI">AI Application</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Task Domain</label>
                  <input
                    type="text"
                    required
                    value={editingEntry.task}
                    onChange={(e) => setEditingEntry({ ...editingEntry, task: e.target.value })}
                    placeholder="e.g. NLP / Multimodal / Vision"
                    className={`w-full p-2.5 rounded-xl border text-xs outline-none ${t.input}`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">License</label>
                  <input
                    type="text"
                    required
                    value={editingEntry.license}
                    onChange={(e) => setEditingEntry({ ...editingEntry, license: e.target.value })}
                    placeholder="e.g. MIT / Apache 2.0"
                    className={`w-full p-2.5 rounded-xl border text-xs outline-none ${t.input}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Release Year</label>
                  <input
                    type="number"
                    required
                    value={editingEntry.year}
                    onChange={(e) => setEditingEntry({ ...editingEntry, year: Number(e.target.value) })}
                    className={`w-full p-2.5 rounded-xl border text-xs outline-none ${t.input}`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Parameter / Dataset Size</label>
                  <input
                    type="text"
                    required
                    value={editingEntry.size}
                    onChange={(e) => setEditingEntry({ ...editingEntry, size: e.target.value })}
                    placeholder="e.g. 671B (37B active) / 10M Samples"
                    className={`w-full p-2.5 rounded-xl border text-xs outline-none ${t.input}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Technical Summary</label>
                <textarea
                  required
                  value={editingEntry.summary}
                  onChange={(e) => setEditingEntry({ ...editingEntry, summary: e.target.value })}
                  rows={2}
                  className={`w-full p-2.5 rounded-xl border text-xs outline-none resize-none ${t.input}`}
                  placeholder="Concise overview of architectural advantages and primary use case..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Architecture Specs</label>
                  <input
                    type="text"
                    value={editingEntry.architecture}
                    onChange={(e) => setEditingEntry({ ...editingEntry, architecture: e.target.value })}
                    placeholder="e.g. Transformer Decoder, Multi-head Latent Attention"
                    className={`w-full p-2.5 rounded-xl border text-xs outline-none ${t.input}`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Benchmark Scores</label>
                  <input
                    type="text"
                    value={editingEntry.benchmarks}
                    onChange={(e) => setEditingEntry({ ...editingEntry, benchmarks: e.target.value })}
                    placeholder="e.g. MMLU: 88.5%, HumanEval: 82.6%"
                    className={`w-full p-2.5 rounded-xl border text-xs outline-none ${t.input}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Known Limitations (Comma-separated)</label>
                <input
                  type="text"
                  value={editingEntry.limitations}
                  onChange={(e) => setEditingEntry({ ...editingEntry, limitations: e.target.value })}
                  placeholder="e.g. High VRAM requirement, English-centric, Rate limited"
                  className={`w-full p-2.5 rounded-xl border text-xs outline-none ${t.input}`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Official Repo / Documentation URL</label>
                <input
                  type="url"
                  value={editingEntry.url}
                  onChange={(e) => setEditingEntry({ ...editingEntry, url: e.target.value })}
                  placeholder="https://github.com/... or https://huggingface.co/..."
                  className={`w-full p-2.5 rounded-xl border text-xs outline-none ${t.input}`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Example Code Usage</label>
                <textarea
                  value={editingEntry.usage}
                  onChange={(e) => setEditingEntry({ ...editingEntry, usage: e.target.value })}
                  rows={2}
                  className={`w-full p-2.5 rounded-xl border text-xs font-mono outline-none resize-none ${t.input}`}
                  placeholder="import torch... / pip install..."
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="entry-featured-toggle"
                  checked={editingEntry.popular}
                  onChange={(e) => setEditingEntry({ ...editingEntry, popular: e.target.checked })}
                  className="rounded border-white/20 w-4 h-4 text-indigo-600 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="entry-featured-toggle" className="text-xs font-bold text-amber-400 flex items-center gap-1 cursor-pointer">
                  <Star size={13} className="fill-amber-400" />
                  Feature this asset on dashboard
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-dashed dark:border-white/5 border-neutral-200">
                <button
                  type="button"
                  onClick={() => setEditingEntry(null)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold ${t.btnGhost}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actioningId === editingEntry.name}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 cursor-pointer shadow-md disabled:opacity-50"
                >
                  {actioningId === editingEntry.name ? "Saving..." : editingEntry.isNew ? "Publish Asset" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Entry Confirmation Modal */}
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
                <Trash2 size={22} className="stroke-[2.5px]" />
              </div>
              <h3 className={`text-base font-black tracking-tight ${t.textPrimary}`}>Delete Catalog Entry</h3>
            </div>
            <p className={`text-xs leading-relaxed font-light ${t.textSecondary}`}>
              Are you sure you want to delete <strong className={t.textPrimary}>"{deleteConfirmEntry}"</strong>? This will permanently remove the tool from the directory.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmEntry(null)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold ${t.btnGhost}`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => executeDelete(deleteConfirmEntry)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-500 text-white cursor-pointer"
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
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Display Name</label>
                  <input
                    type="text"
                    required
                    value={editingUser.displayName}
                    onChange={(e) => setEditingUser({ ...editingUser, displayName: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border text-[13px] outline-none ${t.input}`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Avatar (Synced via OAuth)</label>
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={editingUser.avatarUrl || "None (Initials only)"}
                    className={`w-full p-2.5 rounded-xl border text-[13px] outline-none opacity-60 cursor-not-allowed ${t.input}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border text-[13px] outline-none ${t.input}`}
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

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Bio / Description</label>
                <textarea
                  value={editingUser.description}
                  onChange={(e) => setEditingUser({ ...editingUser, description: e.target.value })}
                  rows={2}
                  maxLength={160}
                  className={`w-full p-2.5 rounded-xl border text-[13px] outline-none resize-none ${t.input}`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="url"
                  value={editingUser.github}
                  onChange={(e) => setEditingUser({ ...editingUser, github: e.target.value })}
                  placeholder="GitHub URL"
                  className={`w-full p-2 rounded-xl border text-[12px] outline-none ${t.input}`}
                />
                <input
                  type="url"
                  value={editingUser.linkedin}
                  onChange={(e) => setEditingUser({ ...editingUser, linkedin: e.target.value })}
                  placeholder="LinkedIn URL"
                  className={`w-full p-2 rounded-xl border text-[12px] outline-none ${t.input}`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-dashed dark:border-white/5 border-neutral-200">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold ${t.btnGhost}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actioningId === editingUser.userKey}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
                >
                  {actioningId === editingUser.userKey ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Suspend / Block Dialog */}
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
                {blockingUser.isBlocked ? "Lift Account Suspension" : "Temporarily Suspend Account"}
              </h3>
            </div>
            <p className={`text-xs leading-relaxed font-light ${t.textSecondary}`}>
              {blockingUser.isBlocked ? (
                <>Lift suspension for <strong className={t.textPrimary}>{blockingUser.displayName}</strong>? They will regain full access immediately.</>
              ) : (
                <>Select duration to suspend <strong className={t.textPrimary}>{blockingUser.displayName}</strong> from logging in.</>
              )}
            </p>
            <div className="flex flex-col gap-2 pt-2">
              {blockingUser.isBlocked ? (
                <button
                  onClick={() => handleExecuteBlock(blockingUser, false, 0)}
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                >
                  Lift Suspension (Reactivate)
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleExecuteBlock(blockingUser, true, 24 * 60 * 60 * 1000)}
                    className="w-full py-2.5 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-black cursor-pointer"
                  >
                    Suspend for 24 Hours
                  </button>
                  <button
                    onClick={() => handleExecuteBlock(blockingUser, true, 7 * 24 * 60 * 60 * 1000)}
                    className="w-full py-2.5 rounded-xl font-bold text-xs bg-orange-500 hover:bg-orange-400 text-white cursor-pointer"
                  >
                    Suspend for 7 Days
                  </button>
                  <button
                    onClick={() => handleExecuteBlock(blockingUser, true, -1)}
                    className="w-full py-2.5 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-500 text-white cursor-pointer"
                  >
                    Suspend Indefinitely (Permanent)
                  </button>
                </>
              )}
              <button
                onClick={() => setBlockingUser(null)}
                className={`w-full py-2 rounded-xl text-xs font-semibold border ${t.border} ${t.surface} ${t.textSecondary}`}
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
              <h3 className={`text-base font-black tracking-tight ${t.textPrimary}`}>Permanently Delete User</h3>
            </div>
            <p className={`text-xs leading-relaxed font-light ${t.textSecondary}`}>
              Permanently delete builder profile for <strong className={t.textPrimary}>{deleteConfirmUser.displayName} ({deleteConfirmUser.username})</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmUser(null)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold ${t.btnGhost}`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const target = deleteConfirmUser;
                  setDeleteConfirmUser(null);
                  await handleExecuteDeleteUser(target);
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white cursor-pointer"
              >
                Delete Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification (Anchored at Bottom-Left) */}
      {toast && (
        <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 animate-[fadeUp_0.2s_ease-out]">
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
