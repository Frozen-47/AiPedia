import React, { useState, useMemo, useEffect, useCallback, useRef, lazy, Suspense } from "react";
import { Filter, X, Check, Sparkles, ArrowLeft, AlertTriangle } from "lucide-react";
import { ThemeContext, useTheme } from "./lib/theme";
import { useTokens } from "./lib/theme";
import { Navbar } from "./components/Navbar";
import { PrivacyPolicy } from "./components/PrivacyPolicy";
import { TermsOfService } from "./components/TermsOfService";
import { FeaturesSuite } from "./components/FeaturesSuite";
import { ValueProps } from "./components/features/ValueProps";
import { Sidebar } from "./components/Sidebar";
import { SearchBar } from "./components/SearchBar";
import { EntryCard } from "./components/EntryCard";
import { WelcomeOnboarding } from "./components/WelcomeOnboarding";
import { UserProfileModal } from "./components/UserProfileModal";
import { OverviewCards } from "./components/OverviewCards";
import { DailyPulseSection } from "./components/DailyPulseSection";
import { DashboardHero } from "./components/DashboardHero";
import { FeatureRibbon } from "./components/FeatureRibbon";
import { PreferencesLoginPrompt } from "./components/PreferencesLoginPrompt";
import { AuthProvider, useAuth } from "./components/AuthContext";
import { AuthModal } from "./components/AuthModal";
import { AdminDashboard } from "./components/AdminDashboard";
import { useDebouncedValue } from "./lib/useDebouncedValue";
import { clearLocalBookmarks, loadBookmarks } from "./lib/bookmarks";
import {
  bookmarkUserKey,
  fetchUserBookmarks,
  mergeLocalBookmarks,
  toggleUserBookmark,
} from "./lib/entryBookmarks";
import {
  findEntryBySlug,
  migrateLegacyProfileQueryUrl,
  parseProfileUsernameFromLocation,
  profilePathSlug,
} from "./lib/entryUrl";
import { getRelatedEntries, getCompareCandidates } from "./lib/relatedEntries";


const DetailModal = lazy(() =>
  import("./components/DetailModal").then((m) => ({ default: m.DetailModal })),
);
const AddModal = lazy(() =>
  import("./components/AddModal").then((m) => ({ default: m.AddModal })),
);
const ChatWidget = lazy(() =>
  import("./components/ChatWidget").then((m) => ({ default: m.ChatWidget })),
);
import type { Entry, EntryRatingSummary, Theme, TypeFilter, TaskFilter } from "./types";
import { fetchRatingSummaries } from "./lib/entryFeedback";
import { fetchEntries } from "./lib/supabase";
import { typeFilters as staticTypeFilters, taskFilters as staticTaskFilters, entries as staticEntries } from "./data";
import {
  partitionByInterests,
  persistOnboardingProfile,
  preferencesUserKey,
  sortByInterestMatch,
  type OnboardingProfile,
} from "./lib/onboarding";
import { fetchUserPreferences, supabase } from "./lib/supabase";

function checkBlockStatus(profile: OnboardingProfile | null) {
  if (!profile?.referralSource) return null;
  try {
    const parsed = JSON.parse(profile.referralSource);
    if (parsed.isBlocked) {
      if (parsed.blockedUntil) {
        const expiry = new Date(parsed.blockedUntil).getTime();
        if (Date.now() < expiry) {
          return { isBlocked: true, blockedUntil: parsed.blockedUntil };
        }
      } else {
        return { isBlocked: true }; // Permanent block
      }
    }
  } catch (e) {
    // Ignore
  }
  return null;
}

// ─── Inner app (needs theme context) ─────────────────────────────────────────
const Inner: React.FC = () => {
  const t = useTokens();
  const { resolvedTheme } = useTheme();
  const { user, isLoaded, openAuthModal } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [blockedStatus, setBlockedStatus] = useState<{ isBlocked: boolean; blockedUntil?: string } | null>(null);
  const [typeFilters, setTypeFilters] = useState<string[]>([]);
  const [taskFilters, setTaskFilters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebouncedValue(searchInput, 220);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [savedOnly, setSavedOnly] = useState(false);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All");
  const [taskFilter, setTaskFilter] = useState<TaskFilter>("All Tasks");
  const [popularOnly, setPopularOnly] = useState(false);
  const [selected, setSelected] = useState<Entry | null>(null);
  const initialEntrySlugRef = useRef<string | null>(
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("entry")
      : null,
  );
  const [urlSyncReady, setUrlSyncReady] = useState(false);
  const catalogSectionRef = useRef<HTMLDivElement | null>(null);
  const scrollToCatalog = useCallback(() => {
    catalogSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);
  const [isAdding, setIsAdding] = useState(false);
  const [showBackendToast, setShowBackendToast] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [onboardingProfile, setOnboardingProfile] = useState<OnboardingProfile | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [profileUsername, setProfileUsername] = useState<string | null>(() => {
    const migrated = migrateLegacyProfileQueryUrl();
    if (migrated) return migrated;
    return parseProfileUsernameFromLocation();
  });
  const [isAdminDashboard, setIsAdminDashboard] = useState(false);
  const [adminDashboardKey, setAdminDashboardKey] = useState(0);
  const [isPrivacy, setIsPrivacy] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.location.pathname === "/privacy" || window.location.pathname === "/privacy/";
  });
  const [isTerms, setIsTerms] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.location.pathname === "/terms" || window.location.pathname === "/terms/";
  });
  const [isWizard, setIsWizard] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.location.pathname === "/wizard" || window.location.pathname === "/wizard/";
  });
  const [isArena, setIsArena] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.location.pathname === "/arena" || window.location.pathname === "/arena/";
  });
  const [isFeatures, setIsFeatures] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.location.pathname === "/features" || window.location.pathname === "/features/";
  });
  const [isPlayground, setIsPlayground] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.location.pathname === "/playground" || window.location.pathname === "/playground/";
  });
  const [activeView, setActiveView] = useState<"landing" | "catalog">((() => {
    if (typeof window === "undefined") return "landing";
    return (window.location.pathname === "/entries" || window.location.pathname === "/entries/") ? "catalog" : "landing";
  })());
  const [browseAll, setBrowseAll] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.location.pathname === "/entries" || window.location.pathname === "/entries/";
  });

  // FeaturesSuite Quiz Wizard and Compare Arena States
  const [compareToolA, setCompareToolA] = useState<string>("GPT-4o");
  const [compareToolB, setCompareToolB] = useState<string>("Claude 3.5 Sonnet");
  const [wizardStep, setWizardStep] = useState<number>(0);
  const [wizardGoal, setWizardGoal] = useState<string | null>(null);
  const [wizardCustomGoal, setWizardCustomGoal] = useState<string>("");
  const [wizardType, setWizardType] = useState<string | null>(null);
  const [wizardLicense, setWizardLicense] = useState<string | null>(null);
  const [wizardCustomLicense, setWizardCustomLicense] = useState<string>("");
  const [showLoginForPrefs, setShowLoginForPrefs] = useState(false);
  const [showLoginForBookmarks, setShowLoginForBookmarks] = useState(false);
  const [prefsToast, setPrefsToast] = useState(false);
  const [ratingSummaries, setRatingSummaries] = useState<
    Record<string, EntryRatingSummary>
  >({});

  // Site-wide Announcement Banner State
  const [announcement, setAnnouncement] = useState<{
    enabled: boolean;
    message: string;
    type: "info" | "warning" | "success" | "special";
    linkText?: string;
    linkUrl?: string;
  } | null>(() => {
    try {
      const stored = localStorage.getItem("aiverse_site_announcement");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handleAnnouncementChange = () => {
      try {
        const stored = localStorage.getItem("aiverse_site_announcement");
        setAnnouncement(stored ? JSON.parse(stored) : null);
      } catch {}
    };
    window.addEventListener("announcement_updated", handleAnnouncementChange);
    return () => window.removeEventListener("announcement_updated", handleAnnouncementChange);
  }, []);

  const typeCounts = useMemo(() => {
    return {
      AI: entries.filter((e) => e.type === "AI").length,
      Model: entries.filter((e) => e.type === "Model").length,
      Dataset: entries.filter((e) => e.type === "Dataset").length,
      Framework: entries.filter((e) => e.type === "Framework").length,
      Platform: entries.filter((e) => e.type === "Platform").length,
      Popular: entries.filter((e) => e.popular).length,
    };
  }, [entries]);

  const wizardRecommendations = useMemo(() => {
    if (!wizardGoal || !wizardType || !wizardLicense) return [];

    const isPermissiveLicense = (lic: string) => {
      const l = lic.toLowerCase();
      return l.includes("mit") || l.includes("apache") || l.includes("bsd") || l.includes("public domain") || l.includes("cc0");
    };

    const goalKeywords: Record<string, string[]> = {
      web: ["web", "chat", "copilot", "agent", "vector", "search", "database", "ui", "frontend", "client", "assistant", "app"],
      train: ["train", "tune", "learn", "optimiz", "compil", "benchmark", "dataset", "loss", "weight", "fine-tune"],
      scale: ["serv", "deploy", "scale", "gpu", "inference", "api", "cloud", "platform", "ops", "hosting", "run"],
      creative: ["image", "video", "speech", "audio", "synthesis", "vision", "creative", "paint", "art", "music", "draw", "generate"]
    };

    let keywords = goalKeywords[wizardGoal] || [];
    if (wizardGoal === "other" && wizardCustomGoal) {
      keywords = wizardCustomGoal
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter(w => w.length > 2);
    }

    // Filter by type (if "other", scan all types)
    let pool = wizardType === "other" ? entries : entries.filter(e => e.type === wizardType);

    // Filter by license
    if (wizardLicense === "permissive") {
      pool = pool.filter(e => isPermissiveLicense(e.license));
    } else if (wizardLicense === "other" && wizardCustomLicense.trim()) {
      const customLic = wizardCustomLicense.toLowerCase().trim();
      pool = pool.filter(e => e.license.toLowerCase().includes(customLic));
    }

    // Score entries
    const scored = pool.map(entry => {
      let score = 0;
      const text = `${entry.name} ${entry.task} ${entry.summary} ${entry.architecture}`.toLowerCase();
      keywords.forEach(kw => {
        if (text.includes(kw)) score += 1;
      });
      if (entry.popular) score += 2;
      return { entry, score };
    });

    // Sort by score desc
    scored.sort((a, b) => b.score - a.score);

    const results = scored.slice(0, 10).map(s => s.entry);

    // Fallback if no/few results
    if (results.length < 10) {
      const existingNames = new Set(results.map(r => r.name));
      const fallbacks = entries
        .filter(e => (wizardType === "other" || e.type === wizardType) && !existingNames.has(e.name))
        .filter(e => {
          if (wizardLicense === "permissive") return isPermissiveLicense(e.license);
          if (wizardLicense === "other" && wizardCustomLicense.trim()) {
            return e.license.toLowerCase().includes(wizardCustomLicense.toLowerCase().trim());
          }
          return true;
        })
        .sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
      
      for (const f of fallbacks) {
        if (results.length >= 10) break;
        results.push(f);
      }
    }

    return results;
  }, [entries, wizardGoal, wizardCustomGoal, wizardType, wizardLicense, wizardCustomLicense]);

  useEffect(() => {
    if (!isLoaded) return;

    let cancelled = false;

    (async () => {
      if (!user) {
        if (!cancelled) {
          setOnboardingProfile(null);
          setShowOnboarding(false);
          setBlockedStatus(null);
          setIsAdminDashboard(false);
        }
        return;
      }

      const isAdmin = user.email === "frozennheart47@gmail.com" || user.user_metadata?.role === "admin";
      if (!isAdmin && !cancelled) {
        setIsAdminDashboard(false);
      }

      // Always fetch from DB to get the latest block status
      const fromDb = await fetchUserPreferences(
        preferencesUserKey({ supabaseUserId: user.id }),
      );

      const block = checkBlockStatus(fromDb);
      if (block && !cancelled) {
        setBlockedStatus(block);
        setOnboardingProfile(fromDb);
        setShowOnboarding(false);
        return;
      }

      if (!cancelled) {
        setBlockedStatus(null);
      }

      const fromMetadata = user.user_metadata?.onboardingComplete && user.user_metadata?.onboarding 
        ? (user.user_metadata.onboarding as OnboardingProfile) 
        : null;
        
      if (fromMetadata && fromMetadata.role && fromMetadata.referralSource) {
        if (!cancelled) {
          setOnboardingProfile(fromMetadata);
          setShowOnboarding(false);
        }
        return;
      }

      if (fromDb && !cancelled) {
        setOnboardingProfile(fromDb);
        setShowOnboarding(false);
        return;
      }

      if (!cancelled) {
        setOnboardingProfile(null);
        setShowOnboarding(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, isLoaded]);

  useEffect(() => {
    if (user) {
      setShowLoginForPrefs(false);
      setShowLoginForBookmarks(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      setBookmarks([]);
      setSavedOnly(false);
      return;
    }

    let cancelled = false;
    const userKey = bookmarkUserKey(user.id);

    (async () => {
      const local = loadBookmarks();
      try {
        const names = local.length
          ? await mergeLocalBookmarks(userKey, local)
          : await fetchUserBookmarks(userKey);
        if (local.length) clearLocalBookmarks();
        if (!cancelled) setBookmarks(names);
      } catch (err) {
        console.warn("Failed to sync bookmarks", err);
        if (!cancelled) setBookmarks(local);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, isLoaded]);

  const handleProfileComplete = async (
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
  ) => {
    await persistOnboardingProfile(profile, {
      user: user ?? undefined,
      isGuest: !user,
      displayName: meta?.displayName,
      profileMeta: meta,
    });
    setOnboardingProfile(profile);
    setShowOnboarding(false);
    setCurrentPage(1);
    setPrefsToast(true);
    setTimeout(() => setPrefsToast(false), 4000);
    // Transition user to catalog view
    setActiveView("catalog");
    setBrowseAll(true);
    setIsFeatures(false);
    setIsPrivacy(false);
    setIsTerms(false);
  };

  const handleSearchChange = (val: string) => {
    setSearchInput(val);
  };

  const handleSearchSelect = (e: Entry) => {
    setSelected(e);
    setSearchInput("");
  };

  useEffect(() => {
    fetchEntries()
      .then(data => {
        const remoteEntries = data || [];
        const mergedMap = new Map<string, Entry>();
        // 1. Static entries first (ensures newly ingested models/platforms in data.ts are immediately present)
        (staticEntries || []).forEach(e => {
          if (e && e.name) mergedMap.set(e.name.toLowerCase().trim(), e);
        });
        // 2. Supabase approved entries take precedence / add new community submissions
        remoteEntries.forEach(e => {
          if (e && e.name) mergedMap.set(e.name.toLowerCase().trim(), e);
        });
        const combined = Array.from(mergedMap.values());
        setEntries(combined);
        setTypeFilters(staticTypeFilters || ["All"]);
        setTaskFilters(staticTaskFilters || ["All Tasks"]);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load catalog from Supabase, falling back to static entries", err);
        setEntries(staticEntries || []);
        setTypeFilters(staticTypeFilters || ["All"]);
        setTaskFilters(staticTaskFilters || ["All Tasks"]);
        setIsLoading(false);
      });

    fetchRatingSummaries().then(setRatingSummaries).catch(() => {});
  }, []);

  const handleRatingSummaryChange = useCallback(
    (entryName: string, summary: EntryRatingSummary) => {
      setRatingSummaries((prev) => ({ ...prev, [entryName]: summary }));
    },
    [],
  );

  const handleAddClick = () => {
    setIsAdding(true);
  };

  const handleEditPreferences = () => {
    if (!user) {
      setShowLoginForPrefs(true);
    }
  };

  const entriesByName = useMemo(() => {
    const map = new Map<string, Entry>();
    for (const e of entries) map.set(e.name, e);
    return map;
  }, [entries]);

  const entryNames = useMemo(() => entries.map((e) => e.name), [entries]);

  const selectEntryByName = useCallback(
    (name: string) => {
      const entry = entriesByName.get(name);
      if (entry) setSelected(entry);
    },
    [entriesByName],
  );

  const handleToggleBookmark = useCallback(
    async (name: string) => {
      if (!user) {
        setShowLoginForBookmarks(true);
        return;
      }
      const userKey = bookmarkUserKey(user.id);
      const prev = bookmarks;
      const optimistic = prev.includes(name)
        ? prev.filter((n) => n !== name)
        : [...prev, name];
      setBookmarks(optimistic);
      try {
        const next = await toggleUserBookmark(userKey, name, prev);
        setBookmarks(next);
      } catch (err) {
        console.warn("Failed to update bookmark", err);
        setBookmarks(prev);
      }
    },
    [user, bookmarks],
  );

  const handleSavedToggle = useCallback(() => {
    if (!user) {
      setShowLoginForBookmarks(true);
      return;
    }
    setSavedOnly((p) => !p);
  }, [user]);

  const relatedForSelected = useMemo(() => {
    if (!selected) return [];
    return getRelatedEntries(selected, entries, onboardingProfile?.interests ?? []);
  }, [selected, entries, onboardingProfile]);

  const compareCandidatesForSelected = useMemo(() => {
    if (!selected) return [];
    return getCompareCandidates(selected, entries, onboardingProfile?.interests ?? []);
  }, [selected, entries, onboardingProfile]);

  useEffect(() => {
    if (!entries.length) return;
    const slug =
      initialEntrySlugRef.current ??
      new URLSearchParams(window.location.search).get("entry");
    initialEntrySlugRef.current = null;
    if (slug) {
      const entry = findEntryBySlug(entries, slug);
      if (entry) setSelected(entry);
    }
    setUrlSyncReady(true);
  }, [entries]);

  useEffect(() => {
    if (!urlSyncReady) return;
    const url = new URL(window.location.href);
    let targetPath = "/";

    if (isPrivacy) {
      targetPath = "/privacy";
      url.searchParams.delete("entry");
      url.searchParams.delete("user");
    } else if (isTerms) {
      targetPath = "/terms";
      url.searchParams.delete("entry");
      url.searchParams.delete("user");
    } else if (isWizard) {
      targetPath = "/wizard";
      url.searchParams.delete("entry");
      url.searchParams.delete("user");
    } else if (isArena) {
      targetPath = "/arena";
      url.searchParams.delete("entry");
      url.searchParams.delete("user");
    } else if (isFeatures) {
      targetPath = "/features";
      url.searchParams.delete("entry");
      url.searchParams.delete("user");
    } else if (isPlayground) {
      targetPath = "/playground";
      url.searchParams.delete("entry");
      url.searchParams.delete("user");
    } else if (profileUsername) {
      targetPath = `/user/${profilePathSlug(profileUsername)}`;
      url.searchParams.delete("user");
    } else if (activeView === "catalog" || browseAll) {
      targetPath = "/entries";
    }

    url.pathname = targetPath;
    if (selected) {
      url.searchParams.set("entry", selected.name);
    } else {
      url.searchParams.delete("entry");
    }

    // Only pushState if pathname actually changes to avoid pushing duplicate views, else replaceState
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, "", url);
    } else {
      window.history.replaceState({}, "", url);
    }
  }, [selected, profileUsername, isPrivacy, isTerms, isWizard, isArena, isFeatures, isPlayground, activeView, browseAll, urlSyncReady]);

  // Dynamic SEO handler
  useEffect(() => {
    let title = "AiVerse - The Ultimate AI Tool & Model Directory";
    let desc = "AiVerse is a comprehensive, open-source guide to AI tools, models, datasets, and frameworks. Search, compare, and discover the best AI technologies.";
    let path = "/";

    if (isPrivacy) {
      title = "Privacy Policy | AiVerse";
      desc = "Read the AiVerse Privacy Policy to understand how we secure your data, personalization preferences, and catalog contributions.";
      path = "/privacy";
    } else if (isTerms) {
      title = "Terms of Service | AiVerse";
      desc = "Review the AiVerse Terms of Service for contributing tools, utilizing the comparison arena, and interacting with our directory.";
      path = "/terms";
    } else if (isWizard) {
      title = "AI Discovery Wizard | AiVerse";
      desc = "Use the AiVerse AI Discovery Wizard to identify the best language models, frameworks, and datasets based on your tech stack and requirements.";
      path = "/wizard";
    } else if (isArena) {
      title = "Comparison Arena | AiVerse";
      desc = "Compare advanced machine learning models and AI platforms side-by-side on technical specs, architecture, benchmarks, and licensing.";
      path = "/arena";
    } else if (isFeatures) {
      title = "Ecosystem Features | AiVerse";
      desc = "Explore category dashboards, system capacity metrics, spotlight highlights, values prop overlays, and all integrated capabilities.";
      path = "/features";
    } else if (isPlayground) {
      title = "Model Playground | AiVerse";
      desc = "Compare language models side-by-side. Test custom system instructions, prompt templates, and latency metrics.";
      path = "/playground";
    } else if (profileUsername) {
      const displayUser = profileUsername.startsWith("@") ? profileUsername : `@${profileUsername}`;
      title = `${displayUser}'s Builder Profile | AiVerse`;
      desc = `View developer preferences, role interests, and bookmarked AI collections of ${displayUser} on AiVerse.`;
      path = `/user/${profilePathSlug(profileUsername)}`;
    } else if (activeView === "catalog" || browseAll) {
      title = "Explore AI Directory | AiVerse";
      desc = "Browse our comprehensive, citation-backed database of language models, computer vision frameworks, and MLOps platforms.";
      path = "/entries";
    }

    if (selected) {
      title = `${selected.name} - Technical Specs & Details | AiVerse`;
      desc = `${selected.name} is a ${selected.type} by ${selected.org}. ${selected.summary} View specs, benchmarks, code templates, and limitations.`;
      path = `${path}?entry=${encodeURIComponent(selected.name)}`;
    }

    document.title = title;

    // Update Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", desc);
    }
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", title);
    
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", desc);
    
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", `https://aiverse.frozenn.in${path}`);

    // Update Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `https://aiverse.frozenn.in${path}`);
  }, [selected, profileUsername, isPrivacy, isTerms, isWizard, isArena, isFeatures, isPlayground, activeView, browseAll]);

  useEffect(() => {
    const handlePopState = () => {
      setIsPrivacy(window.location.pathname === "/privacy" || window.location.pathname === "/privacy/");
      setIsTerms(window.location.pathname === "/terms" || window.location.pathname === "/terms/");
      setIsWizard(window.location.pathname === "/wizard" || window.location.pathname === "/wizard/");
      setIsArena(window.location.pathname === "/arena" || window.location.pathname === "/arena/");
      setIsFeatures(window.location.pathname === "/features" || window.location.pathname === "/features/");
      setIsPlayground(window.location.pathname === "/playground" || window.location.pathname === "/playground/");
      setProfileUsername(parseProfileUsernameFromLocation());

      const isEntriesPath = window.location.pathname === "/entries" || window.location.pathname === "/entries/";
      if (isEntriesPath) {
        setActiveView("catalog");
        setBrowseAll(true);
      } else if (window.location.pathname === "/" || window.location.pathname === "") {
        setActiveView("landing");
        setBrowseAll(false);
      }

      const slug = new URLSearchParams(window.location.search).get("entry");
      if (slug) {
        const entry = findEntryBySlug(entries, slug);
        if (entry) setSelected(entry);
      } else {
        setSelected(null);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [entries]);

  useEffect(() => {
    setCurrentPage(1);
  }, [typeFilter, taskFilter, popularOnly, debouncedSearch, savedOnly]);

  // ⌘K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        (document.querySelector<HTMLInputElement>("[data-search]"))?.focus();
      }
      if (e.key === "Escape") {
        setSelected(null);
        setIsAdding(false);
      }
    };
    document.addEventListener("keydown", handler);

    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, []);

  // Sync document body and meta tags for an orderly global theme switch
  useEffect(() => {
    if (resolvedTheme === "amoled") {
      document.documentElement.style.backgroundColor = "#171717";
      document.body.style.backgroundColor = "#171717";
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#171717");
    } else {
      document.documentElement.style.backgroundColor = "#ffffff";
      document.body.style.backgroundColor = "#ffffff";
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#ffffff");
    }
  }, [resolvedTheme]);

  const filtered = useMemo(() =>
    entries.filter((e) => {
      if (typeFilter !== "All" && e.type !== typeFilter) return false;
      if (taskFilter !== "All Tasks" && e.task !== taskFilter) return false;
      if (popularOnly && !e.popular) return false;
      if (savedOnly && !bookmarks.includes(e.name)) return false;
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        if (
          !e.name.toLowerCase().includes(q) &&
          !e.summary.toLowerCase().includes(q) &&
          !e.org.toLowerCase().includes(q) &&
          !e.task.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    }),
  [entries, typeFilter, taskFilter, popularOnly, debouncedSearch, savedOnly, bookmarks]);

  const personalized = useMemo(() => {
    const interests = onboardingProfile?.interests ?? [];
    if (!interests.length) {
      return { forYou: [] as Entry[], explore: filtered, displayList: filtered };
    }
    const ranked = sortByInterestMatch(filtered, interests);
    const { forYou, explore } = partitionByInterests(ranked, interests);
    const displayList = [...forYou, ...explore];
    return { forYou, explore, displayList };
  }, [filtered, onboardingProfile]);

  const ITEMS_PER_PAGE = 12;
  const listForPagination = personalized.displayList;
  const totalPages = Math.ceil(listForPagination.length / ITEMS_PER_PAGE);
  const paginatedEntries = listForPagination.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  const forYouNames = new Set(personalized.forYou.map((e) => e.name));
  const showPersonalizedSections =
    (onboardingProfile?.interests.length ?? 0) > 0 &&
    !debouncedSearch &&
    typeFilter === "All" &&
    taskFilter === "All Tasks" &&
    !popularOnly &&
    !savedOnly;
  const pageForYou = showPersonalizedSections
    ? paginatedEntries.filter((e) => forYouNames.has(e.name))
    : [];
  const pageExplore = showPersonalizedSections
    ? paginatedEntries.filter((e) => !forYouNames.has(e.name))
    : paginatedEntries;

  const handleAdd = (_partial: Partial<Entry>) => {
    // We no longer append to the local UI state immediately.
    // The entry goes to Supabase as approved=false and will appear on refresh once an admin approves it.
    setIsAdding(false);
    setShowBackendToast(true);
    setTimeout(() => setShowBackendToast(false), 5000);
    setAdminDashboardKey(prev => prev + 1);
  };

  if (isLoading) {
    const isDark = resolvedTheme === "amoled";
    const skeletonBg = isDark ? "bg-white/5" : "bg-neutral-200";
    const skeletonBorder = isDark ? "border-white/5" : "border-neutral-200";

    return (
      <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${t.page}`}>
        {/* Navbar Skeleton */}
        <div className={`h-16 border-b flex items-center justify-between px-4 sm:px-6 xl:px-12 ${skeletonBorder}`}>
          <div className={`w-24 h-6 rounded-md animate-pulse ${skeletonBg}`} />
          <div className="hidden md:flex gap-4">
            <div className={`w-20 h-5 rounded-md animate-pulse ${skeletonBg}`} />
            <div className={`w-20 h-5 rounded-md animate-pulse ${skeletonBg}`} />
            <div className={`w-20 h-5 rounded-md animate-pulse ${skeletonBg}`} />
          </div>
          <div className={`w-8 h-8 rounded-full animate-pulse ${skeletonBg}`} />
        </div>

        {/* Catalog Layout Skeleton */}
        <div className="w-full px-4 sm:px-6 xl:px-12 py-8 flex gap-8 flex-1">
          {/* Left pane: Sidebar Skeleton */}
          <div className="hidden lg:block w-56 shrink-0 space-y-6">
            <div className={`w-32 h-6 rounded-md animate-pulse ${skeletonBg}`} />
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`w-full h-8 rounded-xl animate-pulse ${skeletonBg}`} />
              ))}
            </div>
          </div>

          {/* Right pane: Content Skeleton */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className={`w-36 h-9 rounded-xl animate-pulse ${skeletonBg}`} />
              <div className={`w-full sm:w-72 md:w-80 h-10 rounded-xl animate-pulse ${skeletonBg}`} />
            </div>

            {/* Grid of Pulsing Entry Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i} 
                  className={`p-6 rounded-2xl border flex flex-col justify-between space-y-4 ${skeletonBorder}`}
                  style={{ minHeight: "220px" }}
                >
                  <div className="space-y-3 w-full">
                    {/* Icon & Title Row */}
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl shrink-0 animate-pulse ${skeletonBg}`} />
                      <div className="space-y-1.5 flex-1">
                        <div className={`w-2/3 h-4 rounded-md animate-pulse ${skeletonBg}`} />
                        <div className={`w-1/3 h-3 rounded-md animate-pulse ${skeletonBg}`} />
                      </div>
                    </div>
                    {/* Description Paragraph */}
                    <div className="space-y-2 pt-2">
                      <div className={`w-full h-3 rounded-md animate-pulse ${skeletonBg}`} />
                      <div className={`w-5/6 h-3 rounded-md animate-pulse ${skeletonBg}`} />
                      <div className={`w-4/5 h-3 rounded-md animate-pulse ${skeletonBg}`} />
                    </div>
                  </div>
                  {/* Footer Row */}
                  <div className="flex justify-between items-center pt-2">
                    <div className={`w-16 h-3 rounded-md animate-pulse ${skeletonBg}`} />
                    <div className={`w-24 h-3 rounded-md animate-pulse ${skeletonBg}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (blockedStatus) {
    const isDark = resolvedTheme === "amoled";
    const formattedDate = blockedStatus.blockedUntil
      ? new Date(blockedStatus.blockedUntil).toLocaleString()
      : null;

    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 p-6 ${t.page}`}>
        <div className={`w-full max-w-md p-8 rounded-2xl border text-center space-y-6 shadow-2xl ${t.modal} ${t.border}`}>
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-red-500/10 text-red-500 animate-bounce">
              <AlertTriangle size={48} className="stroke-[2px]" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className={`text-xl font-black tracking-tight ${t.textPrimary}`}>
              Account Temporarily Suspended
            </h2>
            <p className={`text-xs leading-relaxed font-light ${t.textSecondary}`}>
              Your AiVerse builder profile has been temporarily blocked by an administrator for violating community guidelines or terms of service.
            </p>
          </div>

          <div className={`p-4 rounded-xl border text-xs font-mono space-y-1.5 ${isDark ? "bg-white/[0.02] border-white/5 text-slate-300" : "bg-black/[0.02] border-black/5 text-slate-700"}`}>
            <div className="flex justify-between">
              <span className="opacity-60">Status:</span>
              <span className="font-bold text-red-400">Blocked</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-60">Duration:</span>
              <span className="font-bold">
                {formattedDate ? `Until ${formattedDate}` : "Permanent / Indefinite"}
              </span>
            </div>
          </div>

          <p className={`text-[11px] leading-relaxed ${t.textMuted}`}>
            If you believe this was an error or would like to appeal, please contact the administrators at{" "}
            <a href="mailto:frozennheart47@gmail.com" className="text-white hover:underline font-semibold">frozennheart47@gmail.com</a>
            {" "}or submit an appeal on{" "}
            <a href="https://github.com/Frozen-47/AiVerse/issues" target="_blank" rel="noopener noreferrer" className="text-white hover:underline font-semibold">GitHub Issues</a>.
          </p>

          <button
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.reload();
            }}
            className="w-full py-3 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-500 text-white shadow-md cursor-pointer transition-all"
          >
            Sign Out of Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${t.page}`}>


      <Navbar
        onAddEntry={handleAddClick}
        onEditPreferences={handleEditPreferences}
        onViewProfile={setProfileUsername}
        onViewSaved={() => {
          setIsPrivacy(false);
          setIsTerms(false);
          setIsFeatures(false);
          setIsAdminDashboard(false);
          setSelected(null);
          setProfileUsername(null);
          setBrowseAll(true);
          setActiveView("catalog");
          setSavedOnly(true);
        }}
        onHomeClick={() => {
          setIsPrivacy(false);
          setIsTerms(false);
          setIsFeatures(false);
          setIsWizard(false);
          setIsArena(false);
          setIsPlayground(false);
          setIsAdminDashboard(false);
          setSelected(null);
          setProfileUsername(null);
          setActiveView("landing");
          setBrowseAll(false);
          window.location.hash = "";
        }}
        onViewAdminDashboard={() => {
          setIsPrivacy(false);
          setIsTerms(false);
          setIsFeatures(false);
          setIsWizard(false);
          setIsArena(false);
          setIsPlayground(false);
          setIsAdminDashboard(true);
          setSelected(null);
          setProfileUsername(null);
          setBrowseAll(false);
        }}
        entryCount={entries.length}
        onboardingProfile={onboardingProfile}
        onSaveProfile={handleProfileComplete}
      />

      {announcement?.enabled && announcement.message && (
        <div className={`w-full py-2.5 px-4 text-xs font-semibold flex items-center justify-between gap-4 border-b transition-colors z-40 ${
          announcement.type === "warning"
            ? "bg-amber-500/15 border-amber-500/30 text-amber-300"
            : announcement.type === "success"
            ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
            : announcement.type === "special"
            ? "bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-amber-500/20 border-violet-500/30 text-white"
            : "bg-sky-500/15 border-sky-500/30 text-sky-300"
        }`}>
          <div className="flex items-center gap-2 max-w-5xl mx-auto w-full justify-center">
            <Sparkles size={14} className="shrink-0" />
            <span>{announcement.message}</span>
            {announcement.linkUrl && (
              <a
                href={announcement.linkUrl}
                target={announcement.linkUrl.startsWith("http") ? "_blank" : undefined}
                rel={announcement.linkUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                className="underline ml-2 hover:opacity-80 font-bold cursor-pointer"
              >
                {announcement.linkText || "Learn more"} →
              </a>
            )}
          </div>
          <button
            onClick={() => setAnnouncement((prev) => prev ? { ...prev, enabled: false } : null)}
            className="opacity-70 hover:opacity-100 p-1 cursor-pointer"
            title="Dismiss announcement"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {isPrivacy ? (
        <PrivacyPolicy onBackToHome={() => {
          setIsPrivacy(false);
          setIsTerms(false);
          setIsWizard(false);
          setIsArena(false);
          setIsFeatures(false);
          setActiveView("landing");
          setBrowseAll(false);
        }} />
      ) : isTerms ? (
        <TermsOfService onBackToHome={() => {
          setIsPrivacy(false);
          setIsTerms(false);
          setIsWizard(false);
          setIsArena(false);
          setIsFeatures(false);
          setActiveView("landing");
          setBrowseAll(false);
        }} />
      ) : (isWizard || isArena || isFeatures || isPlayground) ? (
        <FeaturesSuite
          initialTab={isWizard ? "wizard" : isArena ? "arena" : isPlayground ? "playground" : "overview"}
          entries={entries}
          typeCounts={typeCounts}
          setSelected={setSelected}
          setTypeFilter={(filter) => setTypeFilter(filter as TypeFilter)}
          setSearchInput={setSearchInput}
          setBrowseAll={setBrowseAll}
          setActiveView={setActiveView}
          setSavedOnly={setSavedOnly}
          setPopularOnly={setPopularOnly}
          onCloseFeatures={() => {
            setIsWizard(false);
            setIsArena(false);
            setIsFeatures(false);
            setIsPlayground(false);
          }}
          onBackToHome={() => {
            setIsWizard(false);
            setIsArena(false);
            setIsFeatures(false);
            setIsPlayground(false);
            setActiveView("landing");
            setBrowseAll(false);
          }}
          // Wizard Props
          wizardStep={wizardStep}
          setWizardStep={setWizardStep}
          wizardGoal={wizardGoal}
          setWizardGoal={setWizardGoal}
          wizardCustomGoal={wizardCustomGoal}
          setWizardCustomGoal={setWizardCustomGoal}
          wizardType={wizardType}
          setWizardType={setWizardType}
          wizardLicense={wizardLicense}
          setWizardLicense={setWizardLicense}
          wizardCustomLicense={wizardCustomLicense}
          setWizardCustomLicense={setWizardCustomLicense}
          wizardRecommendations={wizardRecommendations}
          // Arena Props
          compareToolA={compareToolA}
          setCompareToolA={setCompareToolA}
          compareToolB={compareToolB}
          setCompareToolB={setCompareToolB}
          // User / Feedback props
          bookmarks={bookmarks}
          onToggleBookmark={handleToggleBookmark}
          ratingSummaries={ratingSummaries}
        />
      ) : (isAdminDashboard && (user?.email === "frozennheart47@gmail.com" || user?.user_metadata?.role === "admin")) ? (
        <AdminDashboard
          key={adminDashboardKey}
          onBackToHome={() => {
            setIsAdminDashboard(false);
            setIsPrivacy(false);
            setIsTerms(false);
            setIsWizard(false);
            setIsArena(false);
            setIsFeatures(false);
            setActiveView("landing");
            setBrowseAll(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onViewEntry={setSelected}
        />
      ) : (
        <div className="w-full px-4 sm:px-6 xl:px-12 py-8">
          {activeView === "landing" ? (
            <div className="flex flex-col gap-10 animate-[fadeUp_0.4s_ease-out]">
              {/* Modern Ambient Hero */}
              <DashboardHero
                searchQuery={searchInput}
                onSearchChange={handleSearchChange}
                totalEntries={entries.length}
                activeType={typeFilter}
                onSelectType={(val) => setTypeFilter(val as TypeFilter)}
                activeTask={taskFilter}
                onSelectTask={(val) => setTaskFilter(val as TaskFilter)}
                onScrollToCatalog={scrollToCatalog}
              />

              {/* Action Ribbon: Quick Feature Launchers */}
              <FeatureRibbon
                user={user}
                onOpenAuth={openAuthModal}
                onOpenWizard={() => setIsWizard(true)}
                onOpenArena={() => setIsArena(true)}
                onOpenPlayground={() => setIsPlayground(true)}
                onOpenSuite={() => {
                  window.location.hash = "";
                  setIsFeatures(true);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />

              {/* Live Intelligence Stats */}
              <div>
                <OverviewCards totalEntriesCount={entries.length} />
              </div>

              {/* Live Daily AI Pulse & Tool of the Day */}
              <DailyPulseSection entries={entries} onSelectEntry={setSelected} />

              {/* ──────────────────────────────────────────────────────────── */}
              {/* ALL-IN-ONE DIRECT CATALOG EXPLORER */}
              {/* ──────────────────────────────────────────────────────────── */}
              <div ref={catalogSectionRef} className="mt-6 pt-10 border-t border-slate-200 dark:border-white/5 scroll-mt-20">
                {/* Catalog Controls Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/20">
                        Ecosystem Catalog
                      </span>
                      <span className={`text-[12px] font-semibold ${t.textMuted}`}>
                        Showing {filtered.length} of {entries.length} assets
                      </span>
                    </div>
                    <h2 className={`text-2xl md:text-3xl font-black tracking-tight ${t.textPrimary}`}>
                      Explore All AI Technologies
                    </h2>
                  </div>

                  {/* Filter controls & view full catalog */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Category pills */}
                    <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                      {(["All", "Model", "Framework", "Dataset", "Platform", "AI"] as const).map((type) => {
                        const activeStyles: Record<string, string> = {
                          All: "bg-white text-black font-extrabold shadow-sm",
                          Model: "bg-purple-500 text-white font-extrabold shadow-sm",
                          Framework: "bg-amber-500 text-black font-extrabold shadow-sm",
                          Dataset: "bg-emerald-500 text-black font-extrabold shadow-sm",
                          Platform: "bg-sky-500 text-black font-extrabold shadow-sm",
                          AI: "bg-rose-500 text-white font-extrabold shadow-sm",
                        };
                        const dots: Record<string, string> = {
                          Model: "bg-purple-400",
                          Framework: "bg-amber-400",
                          Dataset: "bg-emerald-400",
                          Platform: "bg-sky-400",
                          AI: "bg-rose-400",
                        };
                        const isSelected = typeFilter === type;
                        return (
                          <button
                            key={type}
                            onClick={() => {
                              setTypeFilter(type);
                              setCurrentPage(1);
                            }}
                            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? activeStyles[type]
                                : `${t.textSecondary} hover:${t.textPrimary}`
                            }`}
                          >
                            {dots[type] && !isSelected && (
                              <span className={`w-1.5 h-1.5 rounded-full ${dots[type]}`} />
                            )}
                            <span>{type === "All" ? "All Types" : type}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Starred toggle */}
                    <button
                      onClick={() => {
                        setPopularOnly((p) => !p);
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                        popularOnly
                          ? "bg-amber-400 text-black border-amber-300 font-black shadow-[0_0_12px_rgba(251,191,36,0.35)]"
                          : `${t.card} ${t.textSecondary} hover:${t.textPrimary}`
                      }`}
                    >
                      <Sparkles size={12} className={popularOnly ? "text-black fill-black" : "text-amber-400"} />
                      Featured Only
                    </button>

                    {/* Saved toggle */}
                    <button
                      onClick={handleSavedToggle}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                        savedOnly
                          ? "bg-violet-500 text-white border-violet-400 font-black shadow-[0_0_12px_rgba(139,92,246,0.35)]"
                          : `${t.card} ${t.textSecondary} hover:${t.textPrimary}`
                      }`}
                    >
                      <span>Bookmarks ({bookmarks.length})</span>
                    </button>

                    {/* Sidebar mode button */}
                    <button
                      onClick={() => {
                        setBrowseAll(true);
                        setActiveView("catalog");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="px-3.5 py-1.5 rounded-xl text-[11px] font-bold bg-slate-200/80 dark:bg-white/10 text-slate-700 dark:text-white/90 hover:bg-slate-300 dark:hover:bg-white/20 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Filter size={11} /> Advanced Filters
                    </button>
                  </div>
                </div>

                {/* Cards Grid or Empty State */}
                {paginatedEntries.length === 0 ? (
                  <div className={`p-12 text-center rounded-2xl border ${t.card} flex flex-col items-center justify-center`}>
                    <p className={`text-base font-semibold mb-2 ${t.textPrimary}`}>
                      No tools found matching your filters
                    </p>
                    <p className={`text-xs ${t.textSecondary} mb-4`}>
                      Try clearing search terms or selecting a different category.
                    </p>
                    <button
                      onClick={() => {
                        setSearchInput("");
                        setTypeFilter("All");
                        setTaskFilter("All Tasks");
                        setPopularOnly(false);
                        setSavedOnly(false);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-black shadow-sm cursor-pointer hover:bg-neutral-200 transition-all"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {paginatedEntries.map((entry, i) => (
                      <EntryCard
                        key={entry.name}
                        entry={entry}
                        entryName={entry.name}
                        onSelect={selectEntryByName}
                        index={i}
                        ratingSummary={ratingSummaries[entry.name]}
                        isBookmarked={bookmarks.includes(entry.name)}
                        onToggleBookmark={handleToggleBookmark}
                      />
                    ))}
                  </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-10">
                    <button
                      onClick={() => {
                        setCurrentPage((p) => Math.max(1, p - 1));
                        scrollToCatalog();
                      }}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        currentPage === 1
                          ? "opacity-40 cursor-not-allowed bg-slate-100 dark:bg-white/5 border-transparent text-slate-400"
                          : `${t.card} ${t.textPrimary} hover:border-white/40`
                      }`}
                    >
                      ← Previous
                    </button>

                    <span className={`text-xs font-bold px-3 ${t.textMuted}`}>
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      onClick={() => {
                        setCurrentPage((p) => Math.min(totalPages, p + 1));
                        scrollToCatalog();
                      }}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        currentPage === totalPages
                          ? "opacity-40 cursor-not-allowed bg-slate-100 dark:bg-white/5 border-transparent text-slate-400"
                          : `${t.card} ${t.textPrimary} hover:border-white/40`
                      }`}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>

              {/* Value Propositions */}
              <div className="mt-8">
                <ValueProps />
              </div>
            </div>
          ) : (
            /* Main layout */
            <div className="flex gap-8 w-full">
              {/* Left pane: Sidebar */}
              <div className="hidden lg:block w-56 shrink-0 pb-8">
                <Sidebar
                  entries={entries}
                  currentFilter={typeFilter}
                  currentTask={taskFilter}
                  typeFilters={typeFilters}
                  taskFilters={taskFilters}
                  popularOnly={popularOnly}
                  filteredCount={filtered.length}
                  onTypeFilter={setTypeFilter}
                  onTaskFilter={setTaskFilter}
                  onPopularToggle={() => setPopularOnly((p) => !p)}
                  savedOnly={savedOnly}
                  savedCount={bookmarks.length}
                  onSavedToggle={handleSavedToggle}
                />
              </div>

              {/* Right pane: Content */}
              <div className="flex-1 min-w-0 pb-32">
                {/* Navigation Bar */}
                <div className="mb-5">
                  <button
                    onClick={() => {
                      setBrowseAll(false);
                      setActiveView("landing");
                      setIsFeatures(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-bold border shadow-xs transition-all cursor-pointer backdrop-blur-md shrink-0 w-fit ${
                      resolvedTheme === 'amoled'
                        ? 'bg-white/5 border-white/10 text-white/80 hover:text-white hover:border-white/20'
                        : 'bg-white/80 border-slate-200 text-slate-600 hover:text-black hover:border-slate-300'
                    }`}
                  >
                    <ArrowLeft size={12} />
                    Back to Dashboard
                  </button>
                </div>

                {/* Header Row: Title & Search */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-5 border-b pb-6 border-slate-200 dark:border-white/5">
                  <div>
                    <h1 className={`text-2xl font-black tracking-tight ${t.textPrimary}`}>
                      Ecosystem Catalog
                    </h1>
                    <p className={`text-[12px] font-light ${t.textSecondary} mt-1`}>
                      Search and discover curated AI models, frameworks, datasets, and platform services.
                    </p>
                  </div>
                  <div className="w-full md:w-96 shrink-0">
                    <SearchBar
                      query={searchInput}
                      onChange={handleSearchChange}
                      entries={entries}
                      onSelect={handleSearchSelect}
                      showDropdown={false}
                    />
                  </div>
                </div>

                {/* Mobile filters button */}
                <div className="flex mb-5 lg:hidden">
                  <button
                    onClick={() => setShowMobileSidebar(true)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold border shadow-sm transition-all ${t.surface} ${t.border} ${t.textPrimary} hover:border-black/20`}
                  >
                    <Filter size={14} />
                    Filters
                    {(typeFilter !== "All" || taskFilter !== "All Tasks" || popularOnly || savedOnly) && (
                      <span className="w-2 h-2 rounded-full bg-black/5 ml-1 animate-pulse" />
                    )}
                  </button>
                </div>

                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-32 gap-3">
                    <div className={`text-5xl opacity-10 ${t.textPrimary}`}>◌</div>
                    <p className={`text-[14px] ${t.textMuted}`}>No entries match your filters.</p>
                    <button
                      onClick={() => { setTypeFilter("All"); setTaskFilter("All Tasks"); setPopularOnly(false); setSavedOnly(false); setSearchInput(""); }}
                      className={`text-[12px] underline underline-offset-2 ${t.textAccent}`}
                    >
                      Clear all filters
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {pageForYou.length > 0 && (
                      <section className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                          <h2 className={`text-lg font-bold tracking-tight ${t.textPrimary}`}>
                            Picked for you
                          </h2>
                          <span className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${t.surface} ${t.border} ${t.textMuted}`}>
                            {personalized.forYou.length} matches
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                          {pageForYou.map((entry, i) => (
                            <EntryCard
                              key={entry.name}
                              entry={entry}
                              entryName={entry.name}
                              onSelect={selectEntryByName}
                              index={i}
                              ratingSummary={ratingSummaries[entry.name]}
                              isBookmarked={bookmarks.includes(entry.name)}
                              onToggleBookmark={handleToggleBookmark}
                            />
                          ))}
                        </div>
                      </section>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {pageExplore.map((entry, i) => (
                        <EntryCard
                          key={entry.name}
                          entry={entry}
                          entryName={entry.name}
                          onSelect={selectEntryByName}
                          index={i + pageForYou.length}
                          ratingSummary={ratingSummaries[entry.name]}
                          isBookmarked={bookmarks.includes(entry.name)}
                          onToggleBookmark={handleToggleBookmark}
                        />
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-10">
                        <button
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${t.surface} ${t.border} ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : `hover:${t.textPrimary}`}`}
                        >
                          Prev
                        </button>
                        
                        <span className={`text-[12px] tabular-nums px-3 ${t.textMuted}`}>
                          Page {currentPage} of {totalPages}
                        </span>

                        <button
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${t.surface} ${t.border} ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : `hover:${t.textPrimary}`}`}
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <footer className={`relative z-10 border-t ${resolvedTheme === 'amoled' ? 'border-white/5 bg-black/40' : 'border-neutral-200 bg-white/40'} backdrop-blur-xl`}>
        <div className="w-full px-4 sm:px-6 xl:px-12 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            
            {/* Column 1: Brand & Info */}
            <div className="lg:col-span-2 flex flex-col items-start gap-4">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  setIsPrivacy(false);
                  setIsTerms(false);
                  setIsFeatures(false);
                  setIsWizard(false);
                  setIsArena(false);
                  setIsAdminDashboard(false);
                  setSelected(null);
                  setProfileUsername(null);
                  setActiveView("landing");
                  setBrowseAll(false);
                  window.location.hash = "";
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`flex items-center ${t.textPrimary} hover:opacity-80 transition-opacity`}
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "1.5rem", lineHeight: 1, letterSpacing: "-0.02em" }}
              >
                <span className="inline-block transform rotate-180 relative" style={{ top: "-0.5px", marginRight: "-0.5px" }}>V</span>
                <span>iVerse</span>
              </a>
              
              <p className={`text-[13px] leading-relaxed max-w-sm ${t.textSecondary}`}>
                Your ultimate navigation hub for the artificial intelligence universe. 
                Explore, compare, and discover state-of-the-art models, frameworks, and tools.
              </p>

              <div className="flex items-center gap-2 mt-2">
                <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border border-emerald-500/10 bg-emerald-500/5 text-emerald-400`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Systems Operational
                </div>
              </div>
            </div>

            {/* Column 2: Navigation */}
            <div className="flex flex-col gap-4">
              <h4 className={`text-[11px] font-bold uppercase tracking-widest ${t.textMuted}`}>Platform</h4>
              <ul className="flex flex-col gap-2.5">
                <li>
                  <button 
                    onClick={() => { 
                      setIsFeatures(false); setIsPrivacy(false); setIsTerms(false); setIsWizard(false); setIsArena(false); setIsAdminDashboard(false); setSelected(null); setProfileUsername(null); setBrowseAll(true); setActiveView("catalog"); setTypeFilter("All"); setTaskFilter("All Tasks"); setPopularOnly(false); setSavedOnly(false); window.scrollTo({ top: 0, behavior: "smooth" }); 
                    }} 
                    className={`text-[13px] font-semibold text-left w-fit ${t.textSecondary} hover:${t.textPrimary} transition-all duration-200 hover:translate-x-[2px] cursor-pointer`}
                  >
                    AI Directory
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { 
                      setIsFeatures(true); setIsPrivacy(false); setIsTerms(false); setIsWizard(false); setIsArena(false); setIsAdminDashboard(false); setSelected(null); window.scrollTo({ top: 0, behavior: "smooth" }); 
                    }} 
                    className={`text-[13px] font-semibold text-left w-fit ${t.textSecondary} hover:${t.textPrimary} transition-all duration-200 hover:translate-x-[2px] cursor-pointer`}
                  >
                    Features Suite
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { 
                      setIsArena(true); setIsFeatures(false); setIsPrivacy(false); setIsTerms(false); setIsWizard(false); setIsAdminDashboard(false); setSelected(null); window.scrollTo({ top: 0, behavior: "smooth" }); 
                    }} 
                    className={`text-[13px] font-semibold text-left w-fit ${t.textSecondary} hover:${t.textPrimary} transition-all duration-200 hover:translate-x-[2px] cursor-pointer`}
                  >
                    Compare Arena
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { 
                      setIsWizard(true); setIsFeatures(false); setIsPrivacy(false); setIsTerms(false); setIsArena(false); setIsAdminDashboard(false); setSelected(null); window.scrollTo({ top: 0, behavior: "smooth" }); 
                    }} 
                    className={`text-[13px] font-semibold text-left w-fit ${t.textSecondary} hover:${t.textPrimary} transition-all duration-200 hover:translate-x-[2px] cursor-pointer`}
                  >
                    Wizard Finder
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { 
                      setIsPlayground(true); setIsWizard(false); setIsFeatures(false); setIsPrivacy(false); setIsTerms(false); setIsArena(false); setIsAdminDashboard(false); setSelected(null); window.scrollTo({ top: 0, behavior: "smooth" }); 
                    }} 
                    className={`text-[13px] font-semibold text-left w-fit ${t.textSecondary} hover:${t.textPrimary} transition-all duration-200 hover:translate-x-[2px] cursor-pointer`}
                  >
                    Model Playground
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Submit & Contribute */}
            <div className="flex flex-col gap-4">
              <h4 className={`text-[11px] font-bold uppercase tracking-widest ${t.textMuted}`}>Contribute</h4>
              <ul className="flex flex-col gap-2.5">
                <li>
                  <button 
                    onClick={() => setIsAdding(true)} 
                    className={`text-[13px] font-semibold text-left w-fit ${t.textSecondary} hover:${t.textPrimary} transition-all duration-200 hover:translate-x-[2px] cursor-pointer`}
                  >
                    Submit a Tool
                  </button>
                </li>
                <li>
                  <a 
                    href="https://github.com/Frozen-47/AiVerse/blob/main/Contributing.md" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`text-[13px] font-semibold text-left w-fit ${t.textSecondary} hover:${t.textPrimary} transition-all duration-200 hover:translate-x-[2px]`}
                  >
                    Contributing Guide
                  </a>
                </li>
                <li>
                  <a 
                    href="https://github.com/Frozen-47/AiVerse/issues" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`text-[13px] font-semibold text-left w-fit ${t.textSecondary} hover:${t.textPrimary} transition-all duration-200 hover:translate-x-[2px]`}
                  >
                    Report an Issue
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Legal & Resources */}
            <div className="flex flex-col gap-4">
              <h4 className={`text-[11px] font-bold uppercase tracking-widest ${t.textMuted}`}>Legal</h4>
              <ul className="flex flex-col gap-2.5">
                <li>
                  <button 
                    onClick={() => { 
                      setIsPrivacy(true); setIsTerms(false); setIsFeatures(false); setIsWizard(false); setIsArena(false); setIsAdminDashboard(false); setSelected(null); window.scrollTo({ top: 0, behavior: "smooth" }); 
                    }} 
                    className={`text-[13px] font-semibold text-left w-fit ${t.textSecondary} hover:${t.textPrimary} transition-all duration-200 hover:translate-x-[2px] cursor-pointer`}
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { 
                      setIsTerms(true); setIsPrivacy(false); setIsFeatures(false); setIsWizard(false); setIsArena(false); setIsAdminDashboard(false); setSelected(null); window.scrollTo({ top: 0, behavior: "smooth" }); 
                    }} 
                    className={`text-[13px] font-semibold text-left w-fit ${t.textSecondary} hover:${t.textPrimary} transition-all duration-200 hover:translate-x-[2px] cursor-pointer`}
                  >
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className={`mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t ${resolvedTheme === 'amoled' ? 'border-white/5' : 'border-neutral-200'} sm:pr-16 md:pr-20`}>
            <span className={`text-[12px] font-medium ${t.textMuted}`}>
              © {new Date().getFullYear()} AiVerse. Open source under MIT License.
            </span>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <a 
                  href="https://github.com/Frozen-47/AiVerse" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`flex items-center gap-1.5 text-[12px] font-semibold ${t.textSecondary} hover:${t.textPrimary} transition-colors`}
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  GitHub
                </a>
                <a 
                  href="mailto:frozennheart47@gmail.com" 
                  className={`flex items-center gap-1.5 text-[12px] font-semibold ${t.textSecondary} hover:${t.textPrimary} transition-colors`}
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"/>
                    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"/>
                  </svg>
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {selected && (
        <Suspense fallback={null}>
          <DetailModal
            entry={selected}
            onClose={() => setSelected(null)}
            onRatingSummaryChange={handleRatingSummaryChange}
            relatedEntries={relatedForSelected}
            onSelectRelated={setSelected}
            isBookmarked={bookmarks.includes(selected.name)}
            onToggleBookmark={() => handleToggleBookmark(selected.name)}
            compareCandidates={compareCandidatesForSelected}
            onViewProfile={(uname) => {
              setProfileUsername(uname);
            }}
          />
        </Suspense>
      )}
      {isAdding && (
        <Suspense fallback={null}>
          <AddModal
            typeFilters={staticTypeFilters}
            taskFilters={staticTaskFilters}
            onClose={() => setIsAdding(false)}
            onSubmit={handleAdd}
          />
        </Suspense>
      )}

      {/* Global Toast Notification */}
      {showBackendToast && (
        <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 animate-[fadeUp_0.2s_ease-out]">
          <div className={`p-4 rounded-xl border flex flex-col gap-1 text-[13px] font-medium shadow-2xl backdrop-blur-xl ${t.successToast}`}>
            <div className="flex items-center gap-3">
              <Check size={18} className="shrink-0 text-emerald-400" />
              <span>Entry submitted successfully!</span>
            </div>
            <span className={`pl-7 text-[11px] opacity-80`}>
              It will appear here once approved by an admin.
            </span>
          </div>
        </div>
      )}

      {isLoaded && user && showOnboarding && (
        <WelcomeOnboarding onComplete={handleProfileComplete} />
      )}

      {profileUsername && (
        <UserProfileModal
          username={profileUsername}
          onClose={() => setProfileUsername(null)}
          onViewEntry={(entry) => {
            setSelected(entry);
            setProfileUsername(null);
          }}
        />
      )}

      {showLoginForPrefs && (
        <PreferencesLoginPrompt onClose={() => setShowLoginForPrefs(false)} />
      )}

      {showLoginForBookmarks && (
        <PreferencesLoginPrompt
          onClose={() => setShowLoginForBookmarks(false)}
          label="Saved entries"
          title="Sign in to save entries"
          description="Bookmarks sync to your account so you can access them on any device. Use Saved only in the sidebar to filter your list."
        />
      )}

      {prefsToast && (
        <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 animate-[fadeUp_0.2s_ease-out]">
          <div className={`p-4 rounded-xl border flex items-center gap-3 text-[13px] font-medium shadow-2xl backdrop-blur-xl ${t.successToast}`}>
            <Check size={18} className="shrink-0 text-emerald-400" />
            <span>Preferences saved — your feed is updated.</span>
          </div>
        </div>
      )}

      <Suspense fallback={null}>
        <ChatWidget
          entryNames={entryNames}
          onEntrySelect={selectEntryByName}
        />
      </Suspense>

      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowMobileSidebar(false)}
          />
          <div className={`relative flex w-[85%] max-w-sm flex-col overflow-y-auto px-6 py-6 shadow-2xl no-scrollbar ${t.modal} border-r ${t.border} animate-[slideRight_0.3s_ease-out]`}>
            <div className="flex items-center justify-between mb-8 shrink-0">
              <h2 className={`text-lg font-bold tracking-tight ${t.textPrimary}`}>Filters</h2>
              <div className="flex items-center gap-1">
                {(typeFilter !== "All" || taskFilter !== "All Tasks" || popularOnly || savedOnly) && (
                  <button
                    onClick={() => { setTypeFilter("All"); setTaskFilter("All Tasks"); setPopularOnly(false); setSavedOnly(false); }}
                    className={`text-[11px] font-semibold underline underline-offset-2 ${t.textAccent} hover:text-white transition-colors mr-1`}
                  >
                    Clear All
                  </button>
                )}
                <button 
                  onClick={() => setShowMobileSidebar(false)}
                  className={`p-2 rounded-full border transition-colors ${t.surface} ${t.border} ${t.textMuted} hover:${t.textPrimary} hover:bg-white/5`}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            
            <Sidebar
              entries={entries}
              currentFilter={typeFilter}
              currentTask={taskFilter}
              typeFilters={typeFilters}
              taskFilters={taskFilters}
              popularOnly={popularOnly}
              filteredCount={filtered.length}
              onTypeFilter={setTypeFilter}
              onTaskFilter={setTaskFilter}
              onPopularToggle={() => setPopularOnly((p) => !p)}
              savedOnly={savedOnly}
              savedCount={bookmarks.length}
              onSavedToggle={handleSavedToggle}
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes slideRight {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </div>
    </>
  );
};

// ─── Root App (provides context) ──────────────────────────────────────────────
const THEME_KEY = "aiverse_theme";

const getOsPreference = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "amoled" : "light";

const resolveTheme = (t: Theme): "amoled" | "light" =>
  t === "system" ? getOsPreference() : t === "amoled" ? "amoled" : "light";

const App: React.FC = () => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY) as Theme | null;
      if (saved === "amoled" || saved === "light" || saved === "system") return saved;
    } catch {}
    return "system";
  });

  const [resolvedTheme, setResolvedTheme] = useState<"amoled" | "light">(() =>
    resolveTheme(theme)
  );

  // Re-resolve when OS preference changes (matters when theme === "system")
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        document.documentElement.classList.add("no-transitions");
        setResolvedTheme(e.matches ? "amoled" : "light");
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            document.documentElement.classList.remove("no-transitions");
          });
        });
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = (t: Theme) => {
    document.documentElement.classList.add("no-transitions");
    setThemeState(t);
    setResolvedTheme(resolveTheme(t));
    try { localStorage.setItem(THEME_KEY, t); } catch {}
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove("no-transitions");
      });
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      <AuthProvider>
        <Inner />
        <AuthModal />
      </AuthProvider>
    </ThemeContext.Provider>
  );
};

export default App;
