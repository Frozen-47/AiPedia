import React, { useState, useEffect, useMemo, useRef } from "react";
import { useTokens } from "../lib/theme";
import { useAuth } from "./AuthContext";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { Logo } from "./Logo";
import {
  onboardingOptions,
  type OnboardingInterest,
  type OnboardingProfile,
  type ReferralSource,
  type UserRole,
} from "../lib/onboarding";
import {
  isValidUsername,
  normalizeUsernameHandle,
  normalizeUsernameInput,
} from "../lib/username";
import { checkUsernameAvailable } from "../lib/supabase";
import { preferencesUserKey } from "../lib/onboarding";

interface WelcomeOnboardingProps {
  onComplete: (
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
    }
  ) => void;
  isGuest?: boolean;
  mode?: "welcome" | "edit";
  initialProfile?: OnboardingProfile | null;
  onClose?: () => void;
  editSection?: "profile" | "preferences";
}

const ALL_STEPS = ["name", "profile", "role", "interests", "referral"] as const;
type Step = (typeof ALL_STEPS)[number];

const GithubLogo = () => (
  <svg className="w-5 h-5 text-gray-400 group-focus-within:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinLogo = () => (
  <svg className="w-5 h-5 text-gray-400 group-focus-within:text-[#0a66c2] transition-colors" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const MediumLogo = () => (
  <svg className="w-5 h-5 text-gray-400 group-focus-within:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42zm3.04 0c0 3.24-.32 5.87-.71 5.87s-.72-2.63-.72-5.87.32-5.87.72-5.87.71 2.63.71 5.87z"/>
  </svg>
);

const DevToLogo = () => (
  <svg className="w-5 h-5 text-gray-400 group-focus-within:text-white transition-colors" viewBox="0 0 448 512" fill="currentColor">
    <path d="M120.12 208.29c-3.88-2.9-7.77-4.35-11.65-4.35H91.03v104.47h17.45c3.88 0 7.77-1.45 11.65-4.35 3.88-2.9 5.82-7.25 5.82-13.06v-69.65c-.01-5.8-1.96-10.16-5.83-13.06zM304.14 0H43.86C19.63 0 0 19.63 0 43.86v424.28C0 492.37 19.63 512 43.86 512h360.28c24.23 0 43.86-19.63 43.86-43.86V43.86C448 19.63 428.37 0 304.14 0zM151.05 311.77c0 12.18-4.85 21.78-14.55 28.8-9.7 7.03-22.66 10.54-38.89 10.54H62.22V175.12h35.39c16.23 0 29.19 3.51 38.89 10.54 9.7 7.03 14.55 16.62 14.55 28.8v97.31zm102.3-120.87h-64.44v45.48h51.38v28.29h-51.38v46.12h64.44v28.31H158.46V162.5h94.89v28.4zm102.3 124.36c0 18.28-5.97 32.5-17.9 42.66-11.93 10.16-28.31 15.24-49.13 15.24-20.82 0-37.2-5.08-49.13-15.24-11.93-10.16-17.9-24.38-17.9-42.66v-96.1h32.93v95.82c0 9.57 2.74 16.8 8.22 21.68 5.48 4.88 13.78 7.32 24.89 7.32s19.41-2.44 24.89-7.32c5.48-4.88 8.22-12.11 8.22-21.68v-95.82h32.93v96.1z"/>
  </svg>
);

const PortfolioLogo = () => (
  <svg className="w-5 h-5 text-gray-400 group-focus-within:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export const WelcomeOnboarding: React.FC<WelcomeOnboardingProps> = ({
  onComplete,
  isGuest = false,
  mode = "welcome",
  initialProfile = null,
  onClose,
  editSection,
}) => {
  const t = useTokens();
  const { user } = useAuth();
  const isEdit = mode === "edit";

  const steps = useMemo<Step[]>(() => {
    if (isEdit) {
      if (editSection === "profile") return ["profile"];
      if (editSection === "preferences") return ["role", "interests", "referral"];
      return ["profile", "role", "interests", "referral"];
    }
    if (isGuest) return ["role", "interests", "referral"];
    return [...ALL_STEPS];
  }, [isEdit, isGuest, editSection]);

  const parsedPrefs = useMemo(() => {
    if (!initialProfile?.referralSource) return null;
    try {
      return JSON.parse(initialProfile.referralSource);
    } catch {
      return null;
    }
  }, [initialProfile?.referralSource]);

  const [step, setStep] = useState<Step>(steps[0]);
  const [name, setName] = useState(() => {
    if (parsedPrefs?.displayName) return parsedPrefs.displayName;
    const meta = user?.user_metadata;
    if (meta?.firstName || meta?.lastName) {
      return `${meta.firstName ?? ""} ${meta.lastName ?? ""}`.trim();
    }
    if (meta?.full_name) return meta.full_name;
    if (meta?.name) return meta.name;
    if (meta?.given_name) return `${meta.given_name ?? ""} ${meta.family_name ?? ""}`.trim();
    return "";
  });
  const [username, setUsername] = useState(() => {
    if (parsedPrefs?.username) return normalizeUsernameInput(parsedPrefs.username);
    const meta = user?.user_metadata;
    const rawUsername = (meta?.username || meta?.preferred_username || meta?.user_name || "") as string;
    return normalizeUsernameInput(rawUsername);
  });
  const [description, setDescription] = useState((user?.user_metadata?.description as string) ?? parsedPrefs?.description ?? "");
  const [github, setGithub] = useState((user?.user_metadata?.github as string) ?? parsedPrefs?.github ?? "");
  const [linkedin, setLinkedin] = useState((user?.user_metadata?.linkedin as string) ?? parsedPrefs?.linkedin ?? "");
  const [medium, setMedium] = useState((user?.user_metadata?.medium as string) ?? parsedPrefs?.medium ?? "");
  const [devto, setDevto] = useState((user?.user_metadata?.devto as string) ?? parsedPrefs?.devto ?? "");
  const [portfolio, setPortfolio] = useState((user?.user_metadata?.portfolio as string) ?? parsedPrefs?.portfolio ?? "");
  const [role, setRole] = useState<UserRole | null>(initialProfile?.role ?? null);
  const [interests, setInterests] = useState<OnboardingInterest[]>(
    initialProfile?.interests ?? [],
  );
  const [referralSource, setReferralSource] = useState<ReferralSource | null>(() => {
    if (initialProfile?.referralSource) {
      try {
        const parsed = JSON.parse(initialProfile.referralSource);
        return parsed?.source ?? initialProfile.referralSource as ReferralSource;
      } catch {
        return initialProfile.referralSource as ReferralSource;
      }
    }
    return null;
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const hasInitializedRef = useRef(false);

  // Username availability check
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const usernameCheckTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced username availability check
  useEffect(() => {
    if (usernameCheckTimer.current) clearTimeout(usernameCheckTimer.current);

    if (!isValidUsername(username) || username.length < 3) {
      setUsernameStatus("idle");
      return;
    }

    // If user already has this username saved, skip the check
    const existingUsername = (user?.user_metadata?.username as string) || parsedPrefs?.username || "";
    if (existingUsername && normalizeUsernameHandle(username) === normalizeUsernameHandle(existingUsername)) {
      setUsernameStatus("available");
      return;
    }

    setUsernameStatus("checking");
    usernameCheckTimer.current = setTimeout(async () => {
      try {
        const currentUserKey = user ? preferencesUserKey({ supabaseUserId: user.id }) : undefined;
        const available = await checkUsernameAvailable(username, currentUserKey);
        setUsernameStatus(available ? "available" : "taken");
      } catch {
        setUsernameStatus("idle");
      }
    }, 500);

    return () => {
      if (usernameCheckTimer.current) clearTimeout(usernameCheckTimer.current);
    };
  }, [username, user, parsedPrefs]);

  const stepIndex = steps.indexOf(step);
  const progress = ((stepIndex + 1) / steps.length) * 100;
  const isProfileOnlyEdit = isEdit && editSection === "profile";

  useEffect(() => {
    if (!initialProfile) return;
    setRole(initialProfile.role);
    setInterests(initialProfile.interests);
    if (initialProfile.referralSource) {
      try {
        const parsed = JSON.parse(initialProfile.referralSource);
        setReferralSource((parsed?.source || initialProfile.referralSource) as ReferralSource);
      } catch {
        setReferralSource(initialProfile.referralSource as ReferralSource);
      }
    }
  }, [initialProfile]);

  useEffect(() => {
    if (!user || hasInitializedRef.current) return;

    // Get display name
    let resolvedName = "";
    if (parsedPrefs?.displayName) {
      resolvedName = parsedPrefs.displayName;
    } else {
      const meta = user.user_metadata;
      if (meta?.firstName || meta?.lastName) {
        resolvedName = `${meta.firstName ?? ""} ${meta.lastName ?? ""}`.trim();
      } else if (meta?.full_name) {
        resolvedName = meta.full_name;
      } else if (meta?.name) {
        resolvedName = meta.name;
      } else if (meta?.given_name) {
        resolvedName = `${meta.given_name ?? ""} ${meta.family_name ?? ""}`.trim();
      }
    }
    if (resolvedName) {
      setName(resolvedName);
    }

    // Get username
    let resolvedUsername = "";
    if (parsedPrefs?.username) {
      resolvedUsername = parsedPrefs.username;
    } else {
      const meta = user.user_metadata;
      resolvedUsername = (meta?.username || meta?.preferred_username || meta?.user_name || "") as string;
    }
    if (resolvedUsername) {
      setUsername(normalizeUsernameInput(resolvedUsername));
    }

    if (user.user_metadata?.description || parsedPrefs?.description) {
      setDescription((user.user_metadata.description as string) ?? parsedPrefs?.description ?? "");
    }
    if (user.user_metadata?.github || parsedPrefs?.github) {
      setGithub((user.user_metadata.github as string) ?? parsedPrefs?.github ?? "");
    }
    if (user.user_metadata?.linkedin || parsedPrefs?.linkedin) {
      setLinkedin((user.user_metadata.linkedin as string) ?? parsedPrefs?.linkedin ?? "");
    }
    if (user.user_metadata?.medium || parsedPrefs?.medium) {
      setMedium((user.user_metadata.medium as string) ?? parsedPrefs?.medium ?? "");
    }
    if (user.user_metadata?.devto || parsedPrefs?.devto) {
      setDevto((user.user_metadata.devto as string) ?? parsedPrefs?.devto ?? "");
    }
    if (user.user_metadata?.portfolio || parsedPrefs?.portfolio) {
      setPortfolio((user.user_metadata.portfolio as string) ?? parsedPrefs?.portfolio ?? "");
    }

    // Default username auto-population from email if empty
    if (!resolvedUsername && user.email) {
      const emailPrefix = user.email.split("@")[0].replace(/[^a-zA-Z0-9_-]/g, "");
      setUsername(`@${emailPrefix.toLowerCase()}`);
    }

    // Default name auto-population from email if empty
    if (!resolvedName && user.email && !isEdit) {
      const prefix = user.email.split("@")[0].replace(/[._]/g, " ");
      const formattedName = prefix
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      setName(formattedName);
    }

    hasInitializedRef.current = true;
  }, [user, parsedPrefs, isEdit]);

  const toggleInterest = (id: OnboardingInterest) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const canContinue = (): boolean => {
    switch (step) {
      case "name":
        return name.trim().length > 0 && isValidUsername(username) && usernameStatus !== "taken" && usernameStatus !== "checking";
      case "profile":
        return true;
      case "role":
        return true; // skippable
      case "interests":
        return true; // skippable
      case "referral":
        return true; // skippable
      default:
        return false;
    }
  };

  const goNext = () => {
    if (stepIndex < steps.length - 1) setStep(steps[stepIndex + 1]);
  };

  const goBack = () => {
    if (stepIndex > 0) setStep(steps[stepIndex - 1]);
  };

  const profileMeta = () => ({
    displayName: name.trim(),
    username: normalizeUsernameHandle(username),
    description: description.trim(),
    github: github.trim(),
    linkedin: linkedin.trim(),
    medium: medium.trim(),
    devto: devto.trim(),
    portfolio: portfolio.trim(),
    avatarUrl: ((user?.user_metadata?.avatar_url || user?.user_metadata?.picture) as string) || undefined,
  });

  const buildReferralSourcePayload = (): string | ReferralSource | null => {
    if (isGuest) return referralSource;
    let parsed: Record<string, unknown> = {};
    let source: ReferralSource | null = referralSource;
    if (initialProfile?.referralSource) {
      try {
        parsed = JSON.parse(initialProfile.referralSource) as Record<string, unknown>;
        source = (parsed.source as ReferralSource) ?? referralSource;
      } catch {
        source = referralSource;
      }
    }
    if (!source) return null;
    return JSON.stringify({ ...parsed, source, ...profileMeta() });
  };

  const finish = async () => {
    // Role defaults to 'other' if skipped
    const finalRole = role ?? "other";
    // ReferralSource defaults to 'other' if skipped
    const finalReferral = referralSource ?? "other";

    if (!isGuest && !isEdit && (!name.trim() || !user)) return;
    if (!isGuest && !isValidUsername(username)) return;

    // Temporarily set defaults so buildReferralSourcePayload works
    const prevRole = role;
    const prevReferral = referralSource;
    setRole(finalRole);
    setReferralSource(finalReferral);

    const referralPayload = buildReferralSourcePayload() ?? JSON.stringify({ source: finalReferral, ...profileMeta() });

    const profile: OnboardingProfile = {
      interests,
      role: finalRole,
      referralSource: referralPayload,
      completedAt: new Date().toISOString(),
    };

    setIsUpdating(true);
    try {
      onComplete(profile, isGuest ? undefined : profileMeta());
    } finally {
      setIsUpdating(false);
      // Restore if needed (component likely unmounts)
      setRole(prevRole);
      setReferralSource(prevReferral);
    }
  };

  const saveProfile = async () => {
    if (!isValidUsername(username)) return;

    const baseRole = role ?? initialProfile?.role;
    if (!baseRole) return;

    const referralPayload = buildReferralSourcePayload();
    if (!referralPayload) return;

    const profile: OnboardingProfile = {
      interests: interests.length > 0 ? interests : (initialProfile?.interests ?? []),
      role: baseRole,
      referralSource: referralPayload,
      completedAt: new Date().toISOString(),
    };

    setIsUpdating(true);
    try {
      onComplete(profile, profileMeta());
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePrimary = () => {
    if (isProfileOnlyEdit && step === "profile") {
      void saveProfile();
      return;
    }
    if (step === "referral") {
      void finish();
    } else {
      goNext();
    }
  };

  const stepTitle: Record<Step, string> = {
    name: "Welcome to AiVerse",
    profile: "Build your builder profile",
    role: isEdit ? "Update your role" : "What best describes you?",
    interests: isEdit ? "Update your interests" : "What are you exploring?",
    referral: isEdit ? "How did you find us?" : "How did you find us?",
  };

  const stepSubtitle: Record<Step, string> = {
    name: "Your account is ready. What should we call you?",
    profile: "Add your developer handles, bio, and social links.",
    role: isEdit
      ? "We'll refresh your recommendations based on this."
      : "We'll tailor recommendations to how you work with AI. You can skip this.",
    interests: isEdit
      ? "Select topics to personalize your catalog — leave empty to browse everything."
      : "Pick one or more — we'll surface matching tools and models first. You can skip this.",
    referral: isEdit
      ? "Helps us understand where builders discover AiVerse."
      : "Helps us understand where builders discover AiVerse. You can skip this.",
  };

  const primaryLabel = isUpdating
    ? "Saving..."
    : isProfileOnlyEdit && step === "profile"
      ? "Save"
      : step === "referral"
        ? isEdit
          ? "Save preferences"
          : "Start exploring"
        : "Continue";

  const showPrimaryArrow =
    !isUpdating && primaryLabel !== "Save" && primaryLabel !== "Save preferences";

  const treeBranch = isEdit ? "border-l-2 border-white/20 pl-4" : "";
  const treeNested = isEdit ? "mt-2 space-y-2 border-l border-white/10 pl-3" : "space-y-2";

  return (
    <div
      className={
        isEdit
          ? "fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          : "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80"
      }
      onClick={isEdit && onClose ? onClose : undefined}
    >
      <div
        className={`relative flex flex-col shadow-2xl overflow-hidden ${t.modal} ${
          isEdit
            ? "fixed top-16 right-0 z-[101] flex flex-col w-full sm:max-w-md max-h-[calc(100dvh-4rem)] border-l-0 sm:border-l rounded-none sm:rounded-l-2xl animate-slide-in-right"
            : "w-full max-w-lg rounded-2xl"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {isEdit && onClose && (
          <button
            type="button"
            onClick={onClose}
            className={`absolute top-4 right-4 z-20 p-2 rounded-lg border ${t.surface} ${t.border} ${t.textMuted} hover:${t.textPrimary}`}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        )}

        <div
          className={`absolute top-0 w-full h-32 bg-linear-to-b from-white/10 to-transparent pointer-events-none ${
            isEdit ? "left-0" : "left-1/2 -translate-x-1/2"
          }`}
        />
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 z-10">
          <div
            className="h-full bg-white"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div
          className={`p-6 sm:p-8 pt-10 flex flex-col min-h-0 ${
            isEdit ? "overflow-y-auto flex-1 items-stretch text-left" : ""
          }`}
        >
          {isEdit ? (
            <header className="mb-6 pr-10 text-left">
              <div className="flex items-center gap-3 mb-3">
                <Logo className="w-10 h-10 shrink-0 text-white" />
                <div className="min-w-0">
                  <p className={`text-[11px] font-semibold uppercase tracking-widest ${t.textMuted}`}>
                    Your preferences
                  </p>
                  <h2 className={`text-xl font-black tracking-tight leading-tight ${t.textPrimary}`}>
                    {isProfileOnlyEdit
                      ? "Customize your profile"
                      : step === steps[0]
                        ? "Edit your preferences"
                        : stepTitle[step]}
                  </h2>
                </div>
              </div>
              <p className={`text-sm ${t.textSecondary} leading-relaxed border-l-2 border-white/20 pl-4`}>
                {stepSubtitle[step]}
              </p>
            </header>
          ) : (
            <>
              <div className="mb-5 flex items-center justify-center">
                <Logo className="w-12 h-12 text-white" />
              </div>
              <p className={t.sectionLabel}>
                {`Step ${stepIndex + 1} of ${steps.length}`}
              </p>
              <h2 className={`text-2xl font-black tracking-tight mb-2 ${t.textPrimary}`}>{stepTitle[step]}</h2>
              <p className={`text-sm mb-6 ${t.textSecondary} leading-relaxed`}>{stepSubtitle[step]}</p>
            </>
          )}

          {step === "name" && (
            <div className="space-y-4 text-left">
              <div>
                <label className={t.sectionLabel}>
                  Display name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className={`w-full px-4 py-3 rounded-xl border font-medium outline-hidden ${t.surface} ${t.border} ${t.textPrimary} focus:border-white/20 focus:ring-4 focus:ring-white/5`}
                  autoFocus
                  maxLength={50}
                  onKeyDown={(e) => e.key === "Enter" && canContinue() && handlePrimary()}
                />
              </div>
              <div>
                <label className={t.sectionLabel}>
                  Username
                </label>
                <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(normalizeUsernameInput(e.target.value))}
                  placeholder="@username"
                  className={`w-full px-4 py-3 rounded-xl border font-medium outline-hidden ${t.surface} ${t.border} ${t.textPrimary} focus:border-white/20 focus:ring-4 focus:ring-white/5 pr-10 ${
                    usernameStatus === "taken" ? "!border-rose-500/50 !ring-rose-500/10" : ""
                  } ${
                    usernameStatus === "available" ? "!border-emerald-500/50 !ring-emerald-500/10" : ""
                  }`}
                  maxLength={30}
                  onKeyDown={(e) => e.key === "Enter" && canContinue() && handlePrimary()}
                />
                {/* Status indicator */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {usernameStatus === "checking" && (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  {usernameStatus === "available" && (
                    <Check size={16} className="text-emerald-400" />
                  )}
                  {usernameStatus === "taken" && (
                    <X size={16} className="text-rose-400" />
                  )}
                </div>
              </div>
                {!isValidUsername(username) && username.length > 1 && (
                  <p className="text-[11px] text-rose-400 mt-1 font-medium">
                    Must start with @ and use lowercase letters, numbers, - and _ only
                  </p>
                )}
                {usernameStatus === "taken" && (
                  <p className="text-[11px] text-rose-400 mt-1 font-medium">
                    This username is already taken. Try another one.
                  </p>
                )}
                {usernameStatus === "available" && (
                  <p className="text-[11px] text-emerald-400 mt-1 font-medium">
                    Username is available!
                  </p>
                )}
              </div>
            </div>
          )}

          {step === "profile" && (
            <div
              className={`no-scrollbar pr-1 ${
                isEdit
                  ? `flex flex-col gap-5 ${treeBranch}`
                  : "space-y-4 max-h-[380px] overflow-y-auto"
              }`}
            >

              <div>
                <label className={t.sectionLabel}>
                  Bio / Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell other builders about yourself..."
                  rows={2}
                  maxLength={160}
                  className={`w-full px-4 py-2.5 rounded-xl border text-[13px] font-medium resize-none outline-hidden ${t.surface} ${t.border} ${t.textPrimary} focus:border-white/20 focus:ring-4 focus:ring-white/5`}
                />
              </div>

              <div>
                <label className={t.sectionLabel}>
                  Social Links
                </label>
                <div className={treeNested}>
                {/* GitHub */}
                <div className={`group flex items-center gap-2.5 px-3 py-2 rounded-xl border ${t.surface} ${t.border} focus-within:border-white/20 focus-within:ring-4 focus-within:ring-white/5`}>
                  <GithubLogo />
                  <input
                    type="url"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="GitHub Profile URL"
                    className="flex-1 bg-transparent border-0 p-0 text-xs font-medium outline-hidden placeholder:text-gray-500 text-white"
                  />
                </div>

                {/* LinkedIn */}
                <div className={`group flex items-center gap-2.5 px-3 py-2 rounded-xl border ${t.surface} ${t.border} focus-within:border-white/20 focus-within:ring-4 focus-within:ring-white/5`}>
                  <LinkedinLogo />
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="LinkedIn Profile URL"
                    className="flex-1 bg-transparent border-0 p-0 text-xs font-medium outline-hidden placeholder:text-gray-500 text-white"
                  />
                </div>

                {/* Medium */}
                <div className={`group flex items-center gap-2.5 px-3 py-2 rounded-xl border ${t.surface} ${t.border} focus-within:border-white/20 focus-within:ring-4 focus-within:ring-white/5`}>
                  <MediumLogo />
                  <input
                    type="url"
                    value={medium}
                    onChange={(e) => setMedium(e.target.value)}
                    placeholder="Medium Profile URL"
                    className="flex-1 bg-transparent border-0 p-0 text-xs font-medium outline-hidden placeholder:text-gray-500 text-white"
                  />
                </div>

                {/* Dev.to */}
                <div className={`group flex items-center gap-2.5 px-3 py-2 rounded-xl border ${t.surface} ${t.border} focus-within:border-white/20 focus-within:ring-4 focus-within:ring-white/5`}>
                  <DevToLogo />
                  <input
                    type="url"
                    value={devto}
                    onChange={(e) => setDevto(e.target.value)}
                    placeholder="Dev.to Profile URL"
                    className="flex-1 bg-transparent border-0 p-0 text-xs font-medium outline-hidden placeholder:text-gray-500 text-white"
                  />
                </div>

                {/* Portfolio */}
                <div className={`group flex items-center gap-2.5 px-3 py-2 rounded-xl border ${t.surface} ${t.border} focus-within:border-white/20 focus-within:ring-4 focus-within:ring-white/5`}>
                  <PortfolioLogo />
                  <input
                    type="url"
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                    placeholder="Portfolio URL"
                    className="flex-1 bg-transparent border-0 p-0 text-xs font-medium outline-hidden placeholder:text-gray-500 text-white"
                  />
                </div>
                </div>
              </div>
            </div>
          )}

          {step === "role" && (
            <div
              className={`flex flex-col gap-2 max-h-[280px] overflow-y-auto no-scrollbar ${
                isEdit ? treeBranch : ""
              }`}
            >
              {onboardingOptions.roles.map((r) => (
                <OptionButton
                  key={r.id}
                  selected={role === r.id}
                  label={r.label}
                  onClick={() => setRole(r.id)}
                  t={t}
                />
              ))}
            </div>
          )}

          {step === "interests" && (
            <div
              className={`grid gap-2 max-h-[300px] overflow-y-auto no-scrollbar pr-1 ${
                isEdit ? `grid-cols-1 ${treeBranch}` : "grid-cols-1 sm:grid-cols-2"
              }`}
            >
              {onboardingOptions.interests.map((item) => {
                const selected = interests.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleInterest(item.id)}
                    className={`text-left p-3 rounded-xl border ${
                      selected
                        ? `${t.pillActive} ring-1 ring-white/20`
                        : `${t.surface} ${t.border} ${t.textSecondary} hover:border-white/20`
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-[13px] font-semibold ${selected ? t.textAccent : t.textPrimary}`}>
                        {item.label}
                      </span>
                      {selected && <Check size={14} className="shrink-0 text-white" />}
                    </div>
                    <p className={`text-[11px] mt-0.5 ${t.textMuted}`}>{item.description}</p>
                  </button>
                );
              })}
            </div>
          )}

          {step === "referral" && (
            <div
              className={`flex flex-col gap-2 max-h-[280px] overflow-y-auto no-scrollbar ${
                isEdit ? treeBranch : ""
              }`}
            >
              {onboardingOptions.referralSources.map((r) => (
                <OptionButton
                  key={r.id}
                  selected={referralSource === r.id}
                  label={r.label}
                  onClick={() => setReferralSource(r.id)}
                  t={t}
                />
              ))}
            </div>
          )}

          <div
            className={
              isEdit
                ? "mt-8 flex flex-col gap-2 w-full border-t border-white/10 pt-6"
                : "flex items-center gap-3 mt-8"
            }
          >
            {stepIndex > 0 && (
              <button
                type="button"
                onClick={goBack}
                disabled={isUpdating}
                className={`inline-flex items-center gap-1.5 px-4 py-3 rounded-xl font-semibold text-[14px] border ${
                  isEdit ? "w-full justify-start" : "justify-center"
                } ${t.surface} ${t.border} ${t.textSecondary} hover:${t.textPrimary} disabled:opacity-50`}
              >
                <ArrowLeft size={16} />
                Back
              </button>
            )}
            <button
              type="button"
              onClick={handlePrimary}
              disabled={isUpdating || !canContinue()}
              className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-[15px] bg-white text-black hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none ${
                isEdit ? "w-full justify-center" : "flex-1 justify-center"
              }`}
            >
              {primaryLabel}
              {showPrimaryArrow && <ArrowRight size={18} />}
            </button>
            {/* Skip button for skippable steps */}
            {!isEdit && (step === "role" || step === "interests" || step === "referral") && (
              <button
                type="button"
                onClick={() => {
                  if (step === "referral") {
                    void finish();
                  } else {
                    goNext();
                  }
                }}
                disabled={isUpdating}
                className={`inline-flex items-center gap-1 px-4 py-3 rounded-xl font-medium text-[13px] cursor-pointer transition-all ${t.textMuted} hover:${t.textSecondary}`}
              >
                Skip
                <ArrowRight size={14} />
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

function OptionButton({
  selected,
  label,
  onClick,
  t,
}: {
  selected: boolean;
  label: string;
  onClick: () => void;
  t: ReturnType<typeof useTokens>;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border text-left text-[14px] font-medium ${
        selected
          ? `${t.pillActive} ring-1 ring-white/20`
          : `${t.surface} ${t.border} ${t.textSecondary} hover:border-white/20`
      }`}
    >
      {label}
      {selected && <Check size={16} className="text-white shrink-0" />}
    </button>
  );
}
