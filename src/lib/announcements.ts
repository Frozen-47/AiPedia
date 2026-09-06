import { supabase } from "./supabase";

export interface SiteAnnouncement {
  enabled: boolean;
  message: string;
  type: "info" | "warning" | "success" | "special";
  linkText?: string;
  linkUrl?: string;
  updatedAt?: string;
}

export const DEFAULT_ANNOUNCEMENT: SiteAnnouncement = {
  enabled: false,
  message: "🚀 Welcome to AiVerse — Discover and compare 242+ open & commercial AI technologies.",
  type: "special",
  linkText: "Explore Models",
  linkUrl: "#catalog",
};

// Known admin user keys to inspect for global announcements
const KNOWN_ADMIN_KEYS = [
  "supabase_20f48b0a-737d-4b78-9098-847a8ba450e8",
];

export async function fetchSiteAnnouncement(): Promise<SiteAnnouncement | null> {
  // 1. Fetch from Supabase so all visitors and accounts receive the live broadcast
  try {
    // Check known admin user row in user_preferences where siteAnnouncement is saved
    for (const key of KNOWN_ADMIN_KEYS) {
      const { data, error } = await supabase
        .from("user_preferences")
        .select("referral_source")
        .eq("user_key", key)
        .maybeSingle();

      if (!error && data?.referral_source) {
        try {
          const meta = JSON.parse(data.referral_source);
          if (meta?.siteAnnouncement && typeof meta.siteAnnouncement === "object") {
            const ann = meta.siteAnnouncement as SiteAnnouncement;
            localStorage.setItem("aiverse_site_announcement", JSON.stringify(ann));
            return ann;
          }
        } catch {}
      }
    }

    // Also check any user_preferences with siteAnnouncement in referral_source
    const { data: searchData, error: searchErr } = await supabase
      .from("user_preferences")
      .select("referral_source")
      .like("referral_source", "%siteAnnouncement%")
      .limit(1);

    if (!searchErr && searchData && searchData.length > 0 && searchData[0].referral_source) {
      try {
        const meta = JSON.parse(searchData[0].referral_source);
        if (meta?.siteAnnouncement) {
          const ann = meta.siteAnnouncement as SiteAnnouncement;
          localStorage.setItem("aiverse_site_announcement", JSON.stringify(ann));
          return ann;
        }
      } catch {}
    }
  } catch (err) {
    console.warn("Failed to query global announcement from Supabase:", err);
  }

  // 2. Fallback to cached localStorage
  try {
    const stored = localStorage.getItem("aiverse_site_announcement");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {}

  return null;
}

export async function saveSiteAnnouncement(
  ann: SiteAnnouncement,
  currentUserKey?: string
): Promise<void> {
  const updated: SiteAnnouncement = {
    ...ann,
    updatedAt: new Date().toISOString(),
  };

  // Immediate local cache and event dispatch for smooth UI
  localStorage.setItem("aiverse_site_announcement", JSON.stringify(updated));
  window.dispatchEvent(new Event("announcement_updated"));

  // Persist to Supabase database so all accounts across the world receive it
  try {
    const targetKey = currentUserKey || KNOWN_ADMIN_KEYS[0];

    const { data: currentPref } = await supabase
      .from("user_preferences")
      .select("referral_source")
      .eq("user_key", targetKey)
      .maybeSingle();

    let metaObj: any = {};
    try {
      if (currentPref?.referral_source) {
        metaObj = JSON.parse(currentPref.referral_source);
      }
    } catch {}

    metaObj.siteAnnouncement = updated;

    const { error: err } = await supabase
      .from("user_preferences")
      .update({
        referral_source: JSON.stringify(metaObj),
        updated_at: new Date().toISOString(),
      })
      .eq("user_key", targetKey);

    if (err) {
      console.warn("Failed to broadcast announcement to Supabase database:", err);
    }
  } catch (err) {
    console.error("Error broadcasting site announcement:", err);
  }
}
