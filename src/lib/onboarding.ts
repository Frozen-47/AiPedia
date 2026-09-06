import type { Entry } from "../types";
import { normalizeUsernameHandle } from "./username";

export const ONBOARDING_STORAGE_KEY = "aiverse_onboarding";

export type OnboardingInterest =
  | "models"
  | "frameworks"
  | "datasets"
  | "platforms"
  | "nlp"
  | "vision"
  | "multimodal"
  | "mlops"
  | "coding"
  | "media";

export type UserRole =
  | "student"
  | "researcher"
  | "developer"
  | "ml_engineer"
  | "product"
  | "hobbyist"
  | "other";

export type ReferralSource =
  | "search"
  | "social"
  | "friend"
  | "github"
  | "newsletter"
  | "community"
  | "other";

export interface OnboardingProfile {
  interests: OnboardingInterest[];
  role: UserRole;
  referralSource: string;
  completedAt: string;
}

export interface OnboardingOptions {
  interests: { id: OnboardingInterest; label: string; description: string }[];
  roles: { id: UserRole; label: string }[];
  referralSources: { id: ReferralSource; label: string }[];
}

export const onboardingOptions: OnboardingOptions = {
  interests: [
    { id: "models", label: "Frontier models", description: "LLMs and foundation models" },
    { id: "frameworks", label: "Frameworks", description: "PyTorch, LangChain, and tooling" },
    { id: "datasets", label: "Datasets", description: "Training and eval corpora" },
    { id: "platforms", label: "Platforms", description: "APIs, hubs, and hosted services" },
    { id: "nlp", label: "NLP & chat", description: "Language and conversational AI" },
    { id: "vision", label: "Computer vision", description: "Image understanding and detection" },
    { id: "multimodal", label: "Multimodal", description: "Vision + language combined" },
    { id: "mlops", label: "MLOps", description: "Deploy, monitor, and scale models" },
    { id: "coding", label: "AI coding", description: "Copilots and dev assistants" },
    { id: "media", label: "Media generation", description: "Image, video, and audio creation" },
  ],
  roles: [
    { id: "student", label: "Student / learner" },
    { id: "researcher", label: "Researcher / academic" },
    { id: "developer", label: "Software developer" },
    { id: "ml_engineer", label: "ML engineer" },
    { id: "product", label: "Product / business" },
    { id: "hobbyist", label: "Hobbyist / explorer" },
    { id: "other", label: "Other" },
  ],
  referralSources: [
    { id: "search", label: "Search engine" },
    { id: "social", label: "Social media" },
    { id: "friend", label: "Friend or colleague" },
    { id: "github", label: "GitHub" },
    { id: "newsletter", label: "Newsletter or blog" },
    { id: "community", label: "Online community" },
    { id: "other", label: "Other" },
  ],
};

const interestMatchers: Record<OnboardingInterest, (e: Entry) => boolean> = {
  models: (e) => e.type === "Model",
  frameworks: (e) => e.type === "Framework",
  datasets: (e) => e.type === "Dataset",
  platforms: (e) => e.type === "Platform" || e.type === "AI",
  nlp: (e) => e.task === "NLP",
  vision: (e) => e.task === "Computer Vision",
  multimodal: (e) => e.task === "Multimodal",
  mlops: (e) => e.task === "MLOps",
  coding: (e) => e.task === "AI Coding",
  media: (e) =>
    e.task === "Image Generation" ||
    e.task === "Video Generation" ||
    e.task === "Audio",
};

export function scoreEntry(entry: Entry, interests: OnboardingInterest[]): number {
  if (!interests.length) return 0;
  return interests.reduce(
    (score, interest) => score + (interestMatchers[interest]?.(entry) ? 1 : 0),
    0,
  );
}

export function entryMatchesInterests(
  entry: Entry,
  interests: OnboardingInterest[],
): boolean {
  return scoreEntry(entry, interests) > 0;
}

export function sortByInterestMatch(
  entries: Entry[],
  interests: OnboardingInterest[],
): Entry[] {
  if (!interests.length) return entries;
  return [...entries].sort((a, b) => {
    const diff = scoreEntry(b, interests) - scoreEntry(a, interests);
    if (diff !== 0) return diff;
    if (b.popular !== a.popular) return b.popular ? 1 : -1;
    return b.year - a.year;
  });
}

export function partitionByInterests(
  entries: Entry[],
  interests: OnboardingInterest[],
): { forYou: Entry[]; explore: Entry[] } {
  if (!interests.length) {
    return { forYou: [], explore: entries };
  }
  const forYou = entries.filter((e) => entryMatchesInterests(e, interests));
  const forYouNames = new Set(forYou.map((e) => e.name));
  const explore = entries.filter((e) => !forYouNames.has(e.name));
  return { forYou, explore };
}

export function loadGuestOnboarding(): OnboardingProfile | null {
  try {
    const raw = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as OnboardingProfile;
    if (!parsed?.completedAt || !parsed.role || !parsed.referralSource) {
      return null;
    }
    return {
      ...parsed,
      interests: parsed.interests ?? [],
    };
  } catch {
    return null;
  }
}

export const GUEST_ID_STORAGE_KEY = "aiverse_guest_id";

export function saveGuestOnboarding(profile: OnboardingProfile): void {
  localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(profile));
}

export function getOrCreateGuestId(): string {
  let id = localStorage.getItem(GUEST_ID_STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(GUEST_ID_STORAGE_KEY, id);
  }
  return id;
}

export function preferencesUserKey(options: {
  supabaseUserId?: string;
  guestId?: string;
}): string {
  if (options.supabaseUserId) return `supabase_${options.supabaseUserId}`;
  if (options.guestId) return `guest_${options.guestId}`;
  throw new Error("preferencesUserKey requires supabaseUserId or guestId");
}

type SupabaseUserLike = {
  id: string;
  user_metadata: Record<string, unknown>;
  email?: string;
};

export async function persistOnboardingProfile(
  profile: OnboardingProfile,
  options: {
    user: SupabaseUserLike | null | undefined;
    isGuest: boolean;
    displayName?: string;
    profileMeta?: {
      username?: string;
      description?: string;
      github?: string;
      linkedin?: string;
      medium?: string;
      devto?: string;
      portfolio?: string;
      avatarUrl?: string;
    };
  },
): Promise<void> {
  const { upsertUserPreferences, supabase } = await import("./supabase");

  if (options.isGuest) {
    saveGuestOnboarding(profile);
    const guestId = getOrCreateGuestId();
    await upsertUserPreferences(preferencesUserKey({ guestId }), profile);
    return;
  }

  if (!options.user) return;

  // Update user metadata in Supabase
  let firstName = "";
  let lastName = "";
  if (options.displayName) {
    const parts = options.displayName.trim().split(/\s+/);
    firstName = parts[0] || "";
    lastName = parts.slice(1).join(" ") || "";
  }

  await supabase.auth.updateUser({
    data: {
      ...options.user.user_metadata,
      ...(options.displayName ? { firstName, lastName } : {}),
      ...(options.profileMeta ? {
        username: options.profileMeta.username
          ? normalizeUsernameHandle(options.profileMeta.username)
          : undefined,
        description: options.profileMeta.description?.trim(),
        github: options.profileMeta.github?.trim(),
        linkedin: options.profileMeta.linkedin?.trim(),
        medium: options.profileMeta.medium?.trim(),
        devto: options.profileMeta.devto?.trim(),
        portfolio: options.profileMeta.portfolio?.trim(),
        avatar_url: options.profileMeta.avatarUrl?.trim(),
        avatarUrl: options.profileMeta.avatarUrl?.trim(),
      } : {}),
      onboardingComplete: true,
      onboarding: profile,
    }
  });

  await upsertUserPreferences(
    preferencesUserKey({ supabaseUserId: options.user.id }),
    profile
  );
}

export function roleHeadline(role: UserRole): string {
  const map: Record<UserRole, string> = {
    student: "tools and papers worth bookmarking for your next assignment",
    researcher: "models, datasets, and benchmarks for rigorous work",
    developer: "frameworks and APIs you can ship with this week",
    ml_engineer: "production-ready platforms and MLOps staples",
    product: "platforms and products shaping what you can build",
    hobbyist: "the most interesting things happening in AI right now",
    other: "a curated slice of the catalog tuned to you",
  };
  return map[role];
}

export function roleLabel(role: UserRole): string {
  return onboardingOptions.roles.find((r) => r.id === role)?.label ?? "you";
}

export function parseProfileMeta(referralSource: string | undefined): Record<string, string> | null {
  if (!referralSource) return null;
  try {
    return JSON.parse(referralSource) as Record<string, string>;
  } catch {
    return null;
  }
}
