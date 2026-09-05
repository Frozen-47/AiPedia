import { createClient } from '@supabase/supabase-js';
import type { Entry } from '../types';
import type { OnboardingProfile } from './onboarding';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Throw a more helpful error if keys are missing
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.");
}

export const supabase = createClient(
  supabaseUrl || "http://placeholder.com",
  supabaseAnonKey || "placeholder",
);

// Helper function to insert an entry
export const insertEntry = async (entry: Partial<Entry>, userKey?: string) => {
  const { data, error } = await supabase
    .from("entries")
    .insert([{ ...entry, approved: false, popular: false, submitted_by: userKey || null }]);
  
  if (error) throw error;
  return data;
};

// Helper function to fetch all entries
export const fetchEntries = async () => {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('approved', true)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data as Entry[];
};

type PreferencesRow = {
  user_key: string;
  email: string | null;
  role: string;
  interests: string[];
  referral_source: string;
  updated_at: string;
};

function rowToProfile(row: PreferencesRow): OnboardingProfile {
  return {
    role: row.role as OnboardingProfile["role"],
    interests: row.interests as OnboardingProfile["interests"],
    referralSource: row.referral_source as OnboardingProfile["referralSource"],
    completedAt: row.updated_at,
  };
}

export async function fetchUserPreferences(
  userKey: string,
): Promise<OnboardingProfile | null> {
  const { data, error } = await supabase
    .from("user_preferences")
    .select("role, interests, referral_source, updated_at")
    .eq("user_key", userKey)
    .maybeSingle();

  if (error) {
    console.warn("Failed to load preferences from Supabase", error);
    return null;
  }
  if (!data) return null;
  return rowToProfile(data as PreferencesRow);
}

export async function upsertUserPreferences(
  userKey: string,
  profile: OnboardingProfile,
): Promise<void> {
  const { error } = await supabase.from("user_preferences").upsert(
    {
      user_key: userKey,
      role: profile.role,
      interests: profile.interests,
      referral_source: profile.referralSource,
      updated_at: profile.completedAt,
    },
    { onConflict: "user_key" },
  );

  if (error) {
    console.warn("Failed to sync preferences to Supabase", error);
  }
}

export interface PublicBuilderProfile {
  userKey: string;
  displayName: string;
  username: string;
  description: string;
  github: string;
  linkedin: string;
  medium: string;
  devto: string;
  portfolio: string;
  role: string;
  interests: string[];
  avatarUrl?: string;
}

export async function fetchProfileByUsername(
  username: string,
): Promise<PublicBuilderProfile | null> {
  const cleanUsername = username.startsWith("@") ? username : `@${username}`;

  // Query user_preferences table
  const { data, error } = await supabase
    .from("user_preferences")
    .select("user_key, role, interests, referral_source");

  if (error) {
    console.warn("Failed to fetch preferences during profile lookup", error);
    return null;
  }

  for (const row of data || []) {
    if (!row.referral_source) continue;
    try {
      const parsed = JSON.parse(row.referral_source);
      if (
        parsed &&
        typeof parsed === "object" &&
        parsed.username?.toLowerCase() === cleanUsername.toLowerCase()
      ) {
        const rawAvatar = parsed.avatarUrl || parsed.avatar_url || "";
        const cleanAvatar = rawAvatar && !rawAvatar.includes("dicebear.com") ? rawAvatar : undefined;
        return {
          userKey: row.user_key,
          displayName: parsed.displayName || "Builder",
          username: parsed.username,
          description: parsed.description || "",
          github: parsed.github || "",
          linkedin: parsed.linkedin || "",
          medium: parsed.medium || "",
          devto: parsed.devto || "",
          portfolio: parsed.portfolio || "",
          role: row.role || "",
          interests: row.interests || [],
          avatarUrl: cleanAvatar,
        };
      }
    } catch {
      // Ignore rows with non-JSON referral_sources
    }
  }

  return null;
}

/**
 * Check if a username is already taken by another user.
 * Returns true if available, false if taken.
 * Optionally pass currentUserKey to exclude the current user's own row.
 */
export async function checkUsernameAvailable(
  username: string,
  currentUserKey?: string,
): Promise<boolean> {
  const cleanUsername = username.startsWith("@") ? username : `@${username}`;

  const { data, error } = await supabase
    .from("user_preferences")
    .select("user_key, referral_source");

  if (error) {
    console.warn("Failed to check username availability", error);
    // On error, assume available to avoid blocking onboarding
    return true;
  }

  for (const row of data || []) {
    // Skip the current user's own row
    if (currentUserKey && row.user_key === currentUserKey) continue;
    if (!row.referral_source) continue;
    try {
      const parsed = JSON.parse(row.referral_source);
      if (
        parsed &&
        typeof parsed === "object" &&
        parsed.username?.toLowerCase() === cleanUsername.toLowerCase()
      ) {
        return false; // taken
      }
    } catch {
      // Ignore non-JSON rows
    }
  }

  return true; // available
}

/**
 * Resolves the genuine Google or GitHub OAuth profile avatar.
 * Prioritizes pristine provider identity_data from Google/GitHub,
 * and completely ignores legacy synthetic dicebear placeholders.
 */
export function getOAuthAvatarUrl(user: any): string | undefined {
  if (!user) return undefined;

  // 1. Inspect OAuth identities (immutable provider records from Google/GitHub)
  const identities = user.identities || [];
  for (const identity of identities) {
    const data = identity.identity_data;
    if (data) {
      if (identity.provider === "google") {
        const googlePic = (data.avatar_url || data.picture) as string | undefined;
        if (googlePic && !googlePic.includes("dicebear.com")) return googlePic;
      }
      if (identity.provider === "github") {
        const ghPic = (data.avatar_url || data.picture) as string | undefined;
        if (ghPic && !ghPic.includes("dicebear.com")) return ghPic;
      }
    }
  }

  // 2. Google OAuth standard picture field
  const metaPicture = user.user_metadata?.picture as string | undefined;
  if (metaPicture && !metaPicture.includes("dicebear.com")) {
    return metaPicture;
  }

  // 3. Metadata avatar_url, rejecting synthetic dicebear URLs
  const metaAvatar = user.user_metadata?.avatar_url as string | undefined;
  if (metaAvatar && !metaAvatar.includes("dicebear.com")) {
    return metaAvatar;
  }

  return undefined;
}

