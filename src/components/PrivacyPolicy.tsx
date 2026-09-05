import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Shield,
  Lock,
  Eye,
  Database,
  Globe,
  UserCheck,
  ChevronRight,
  Cookie,
  Trash2,
  ShieldCheck,
  Scale,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { useTokens } from "../lib/theme";

interface PrivacyPolicyProps {
  onBackToHome: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBackToHome }) => {
  const t = useTokens();
  const [activeSection, setActiveSection] = useState("intro");

  const sections = [
    { id: "intro", label: "1. Introduction & Scope", icon: Eye },
    { id: "collection", label: "2. Information We Collect", icon: Database },
    { id: "usage", label: "3. How We Process Data", icon: UserCheck },
    { id: "legal-bases", label: "4. Legal Bases (GDPR)", icon: Scale },
    { id: "cookies", label: "5. Cookies & Local Memory", icon: Cookie },
    { id: "storage", label: "6. Cloud Infrastructure", icon: Lock },
    { id: "retention", label: "7. Data Retention & Purging", icon: Trash2 },
    { id: "rights", label: "8. Global Privacy Rights", icon: Globe },
    { id: "security", label: "9. Security & RLS Controls", icon: ShieldCheck },
    { id: "changes", label: "10. Updates & Inquiries", icon: HelpCircle },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activeColorMap: Record<string, { bg: string; text: string; icon: string }> = {
    intro: { bg: "bg-emerald-500/10 border-emerald-500/30", text: "text-emerald-400", icon: "text-emerald-400" },
    collection: { bg: "bg-sky-500/10 border-sky-500/30", text: "text-sky-400", icon: "text-sky-400" },
    usage: { bg: "bg-violet-500/10 border-violet-500/30", text: "text-violet-400", icon: "text-violet-400" },
    "legal-bases": { bg: "bg-teal-500/10 border-teal-500/30", text: "text-teal-400", icon: "text-teal-400" },
    cookies: { bg: "bg-amber-500/10 border-amber-500/30", text: "text-amber-400", icon: "text-amber-400" },
    storage: { bg: "bg-cyan-500/10 border-cyan-500/30", text: "text-cyan-400", icon: "text-cyan-400" },
    retention: { bg: "bg-rose-500/10 border-rose-500/30", text: "text-rose-400", icon: "text-rose-400" },
    rights: { bg: "bg-fuchsia-500/10 border-fuchsia-500/30", text: "text-fuchsia-400", icon: "text-fuchsia-400" },
    security: { bg: "bg-indigo-500/10 border-indigo-500/30", text: "text-indigo-400", icon: "text-indigo-400" },
    changes: { bg: "bg-orange-500/10 border-orange-500/30", text: "text-orange-400", icon: "text-orange-400" },
  };

  return (
    <div className="w-full px-4 sm:px-6 xl:px-12 py-8">
      {/* Header Banner */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-dashed border-slate-200 dark:border-white/6">
        <div>
          <div className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest border rounded-full px-3.5 py-1 mb-3.5 bg-sky-500/10 border-sky-500/30 text-sky-400 shadow-xs">
            <Shield size={11} className="text-sky-400" />
            Trust & Transparency Portal
          </div>
          <h1 className={`text-[clamp(32px,4vw,48px)] font-black leading-[1.05] tracking-[-0.03em] mb-2.5 ${t.textPrimary}`}>
            Privacy Policy
          </h1>
          <p className={`text-[13px] font-light ${t.textSecondary}`}>
            Effective: May 20, 2026 · Global developer privacy architecture, data governance principles, and GDPR/CCPA disclosures.
          </p>
        </div>

        <button
          onClick={onBackToHome}
          className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-bold border shadow-sm transition-all cursor-pointer ${t.surface} ${t.border} ${t.textPrimary} hover:border-sky-500/40 hover:text-sky-400 active:scale-95`}
        >
          <ArrowLeft size={14} />
          Back to Dashboard
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full items-start">
        {/* Left Column: Floating Navigation Directory */}
        <div className="w-full lg:w-72 shrink-0 lg:sticky lg:top-20 space-y-4">
          <div className={`p-5 rounded-2xl border backdrop-blur-md ${t.surface} ${t.border} shadow-lg`}>
            <p className={`text-[10px] font-extrabold uppercase tracking-widest ${t.textMuted} mb-4`}>
              Document Sections ({sections.length})
            </p>
            <div className="flex flex-col gap-1">
              {sections.map((sect) => {
                const Icon = sect.icon;
                const isActive = activeSection === sect.id;
                const activeTheme = activeColorMap[sect.id] || {
                  bg: "bg-white/10 border-white/20",
                  text: "text-white",
                  icon: "text-white",
                };

                return (
                  <button
                    key={sect.id}
                    onClick={() => scrollToSection(sect.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-[12px] font-bold text-left transition-all duration-300 cursor-pointer border ${
                      isActive
                        ? `${activeTheme.bg} ${activeTheme.text} shadow-xs font-black`
                        : `${t.textSecondary} border-transparent hover:bg-white/5 hover:text-white`
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon size={14} className={`shrink-0 ${isActive ? activeTheme.icon : "text-neutral-500"}`} />
                      <span className="truncate">{sect.label}</span>
                    </div>
                    {isActive && <ChevronRight size={12} className={`${activeTheme.icon} shrink-0 animate-pulse`} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Help Box */}
          <div className={`hidden lg:block p-5 rounded-2xl border shadow-md ${t.surface} ${t.border} bg-gradient-to-br from-sky-950/20 to-transparent`}>
            <h4 className={`text-[12px] font-bold ${t.textPrimary} mb-1.5 flex items-center gap-1.5`}>
              <Sparkles size={13} className="text-sky-400" /> Need Privacy Support?
            </h4>
            <p className={`text-[11px] leading-relaxed ${t.textSecondary} mb-3.5`}>
              Review our telemetry safeguards, request record purges, or contact our security engineers.
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="https://github.com/Frozen-47/AiVerse"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-2 rounded-xl text-[11px] font-bold text-center border transition-all ${t.surface2} ${t.border} text-sky-400 hover:border-sky-500/40 hover:bg-sky-500/10`}
              >
                GitHub Codebase
              </a>
              <a
                href="mailto:frozennheart47@gmail.com"
                className={`w-full py-2 rounded-xl text-[11px] font-bold text-center border transition-all ${t.surface2} ${t.border} text-indigo-400 hover:border-indigo-500/40 hover:bg-indigo-500/10`}
              >
                Email Privacy Team
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Complete Immersive content */}
        <div className={`flex-1 min-w-0 border rounded-3xl p-6 sm:p-10 backdrop-blur-xl ${t.surface} ${t.border} shadow-2xl space-y-12`}>
          {/* Top Notice */}
          <div className="p-4.5 rounded-2xl border leading-normal text-[12px] font-medium flex items-center gap-3 border-sky-500/30 bg-sky-500/5 text-sky-300">
            <Shield size={20} className="shrink-0 text-sky-400" />
            <span>
              AiVerse is engineered on developer privacy by default. We do not monetize personal data, we do not trade telemetry to third-party ad networks, and your catalog bookmarks remain under your explicit control.
            </span>
          </div>

          {/* Section 1: Introduction & Scope */}
          <section id="intro" className="space-y-4 pt-2 first:pt-0 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <Eye size={18} />
              </div>
              <h2 className={`text-xl font-black tracking-tight ${t.textPrimary}`}>
                1. Introduction & Scope of Policy
              </h2>
            </div>
            <p className={`text-[13px] leading-relaxed font-light ${t.textSecondary}`}>
              Welcome to <strong>AiVerse</strong> (&quot;Platform,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), available at <a href="https://aiverse.frozenn.in" className="text-sky-400 hover:text-sky-300 hover:underline font-semibold">https://aiverse.frozenn.in</a>. We are committed to safeguarding builder privacy and maintaining transparency in all computational practices.
            </p>
            <p className={`text-[13px] leading-relaxed font-light ${t.textSecondary}`}>
              This Privacy Policy describes the minimal categories of information we collect, the cloud infrastructures utilized, and the global mechanisms provided for you to inspect, export, or permanently erase your data.
            </p>
          </section>

          <hr className={t.border} />

          {/* Section 2: Information We Collect */}
          <section id="collection" className="space-y-4 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400">
                <Database size={18} />
              </div>
              <h2 className={`text-xl font-black tracking-tight ${t.textPrimary}`}>
                2. Information We Collect
              </h2>
            </div>
            <p className={`text-[13px] leading-relaxed font-light ${t.textSecondary}`}>
              We collect information strictly necessary to provide interactive discovery, personalized catalog feeds, and verified community contributions:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="p-4.5 rounded-2xl border border-sky-500/20 bg-sky-500/5 hover:border-sky-500/40 transition-all space-y-2">
                <h4 className="text-[13px] font-bold text-sky-300">OAuth Identity Tokens</h4>
                <p className={`text-[12px] leading-relaxed font-light ${t.textSecondary}`}>
                  When signing in via GitHub or Google, Supabase Auth retrieves your primary email, public username/name, and OAuth provider avatar. We never access passwords or private repositories.
                </p>
              </div>
              <div className="p-4.5 rounded-2xl border border-violet-500/20 bg-violet-500/5 hover:border-violet-500/40 transition-all space-y-2">
                <h4 className="text-[13px] font-bold text-violet-300">Developer Profile Preferences</h4>
                <p className={`text-[12px] leading-relaxed font-light ${t.textSecondary}`}>
                  Selected technical roles (e.g. ML Engineer, Researcher), bio descriptions, social portfolio URLs, and interest tags chosen during onboarding.
                </p>
              </div>
              <div className="p-4.5 rounded-2xl border border-amber-500/20 bg-amber-500/5 hover:border-amber-500/40 transition-all space-y-2">
                <h4 className="text-[13px] font-bold text-amber-300">Bookmarked Collections</h4>
                <p className={`text-[12px] leading-relaxed font-light ${t.textSecondary}`}>
                  Your saved models, frameworks, and datasets. Stored to allow multi-device sync across desktop and mobile browsers.
                </p>
              </div>
              <div className="p-4.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40 transition-all space-y-2">
                <h4 className="text-[13px] font-bold text-emerald-300">Community Directory Submissions</h4>
                <p className={`text-[12px] leading-relaxed font-light ${t.textSecondary}`}>
                  Assets submitted to the directory (name, parameters, benchmarks, license, URL) and optional ratings/reviews linked to your builder profile handle.
                </p>
              </div>
            </div>
          </section>

          <hr className={t.border} />

          {/* Section 3: How We Process Data */}
          <section id="usage" className="space-y-4 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-400">
                <UserCheck size={18} />
              </div>
              <h2 className={`text-xl font-black tracking-tight ${t.textPrimary}`}>
                3. How We Process & Utilize Data
              </h2>
            </div>
            <p className={`text-[13px] leading-relaxed font-light ${t.textSecondary}`}>
              Data collected is processed exclusively for the following technical operational functions:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {[
                { title: "Personalized 'Picked For You' Feeds", desc: "Matching catalog entries against your chosen role and technical interests without third-party tracking.", color: "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" },
                { title: "Cross-Device State Synchronization", desc: "Securely reloading your saved bookmarks and custom theme preferences across different workstations.", color: "bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]" },
                { title: "Catalog Quality & Audit Trails", desc: "Verifying the authenticity of model submissions and maintaining audit logs of administrative actions.", color: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" },
                { title: "Anti-Sybil & Bot Prevention", desc: "Preventing automated vote stuffing, rate limiting API calls, and protecting community ratings.", color: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className={`w-2 h-2 rounded-full shrink-0 mt-2 ${item.color}`} />
                  <div>
                    <h4 className={`text-[13px] font-bold ${t.textPrimary} mb-0.5`}>{item.title}</h4>
                    <p className={`text-[12px] leading-relaxed ${t.textSecondary}`}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <hr className={t.border} />

          {/* Section 4: Legal Bases (GDPR) */}
          <section id="legal-bases" className="space-y-4 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-400">
                <Scale size={18} />
              </div>
              <h2 className={`text-xl font-black tracking-tight ${t.textPrimary}`}>
                4. Legal Bases for Processing Under GDPR & Global Regulations
              </h2>
            </div>
            <p className={`text-[13px] leading-relaxed font-light ${t.textSecondary}`}>
              If you reside in the European Economic Area (EEA), the UK, or Switzerland, we process your personal data under the following legal frameworks established by the General Data Protection Regulation (&quot;GDPR&quot;):
            </p>
            <ul className="list-disc list-inside space-y-2 text-[13px] font-light text-neutral-300 pl-2">
              <li><strong>Contractual Performance:</strong> Processing required to authenticate your account, maintain your bookmark index, and deliver directory services.</li>
              <li><strong>Legitimate Interests:</strong> Operating a secure, performant directory, protecting against cyberattacks, and auditing public technical submissions.</li>
              <li><strong>Consent:</strong> Explicit user consent provided when opting into public profile publishing or social link discovery. You may revoke consent at any time.</li>
            </ul>
          </section>

          <hr className={t.border} />

          {/* Section 5: Cookies & Local Storage */}
          <section id="cookies" className="space-y-4 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                <Cookie size={18} />
              </div>
              <h2 className={`text-xl font-black tracking-tight ${t.textPrimary}`}>
                5. Cookies, Local Storage & Client Memory
              </h2>
            </div>
            <p className={`text-[13px] leading-relaxed font-light ${t.textSecondary}`}>
              AiVerse does NOT use commercial behavioral advertising cookies or cross-site fingerprinting trackers. We use strictly functional client memory for:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-1">
                <span className="text-[12px] font-bold text-amber-300">Theme Preference</span>
                <p className={`text-[11px] leading-relaxed font-light ${t.textSecondary}`}>Stores your chosen AMOLED Dark mode or Light mode in localStorage.</p>
              </div>
              <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-1">
                <span className="text-[12px] font-bold text-amber-300">Session JWT Token</span>
                <p className={`text-[11px] leading-relaxed font-light ${t.textSecondary}`}>Encrypted authentication tokens managed securely by Supabase Auth.</p>
              </div>
              <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-1">
                <span className="text-[12px] font-bold text-amber-300">Search Caches</span>
                <p className={`text-[11px] leading-relaxed font-light ${t.textSecondary}`}>Temporary query caches to optimize responsiveness during catalog lookups.</p>
              </div>
            </div>
          </section>

          <hr className={t.border} />

          {/* Section 6: Cloud Infrastructure */}
          <section id="storage" className="space-y-4 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
                <Lock size={18} />
              </div>
              <h2 className={`text-xl font-black tracking-tight ${t.textPrimary}`}>
                6. Storage & Cloud Infrastructure Architecture
              </h2>
            </div>
            <p className={`text-[13px] leading-relaxed font-light ${t.textSecondary}`}>
              Our technical infrastructure is distributed across world-class enterprise cloud providers:
            </p>
            <div className="space-y-3 pt-1">
              <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex flex-col sm:flex-row gap-3 items-start">
                <div className="px-2.5 py-1 rounded font-mono text-[10px] font-bold uppercase shrink-0 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Supabase Cloud</div>
                <p className={`text-[12px] leading-relaxed font-light ${t.textSecondary}`}>
                  PostgreSQL cluster configured with Row-Level Security (RLS) policies. Enforces strict cryptographic isolation so builders can only read or mutate their authorized records.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col sm:flex-row gap-3 items-start">
                <div className="px-2.5 py-1 rounded font-mono text-[10px] font-bold uppercase shrink-0 bg-white/10 text-white border border-white/20">Vercel Edge Network</div>
                <p className={`text-[12px] leading-relaxed font-light ${t.textSecondary}`}>
                  Global Edge CDN for asset acceleration, automated TLS certificate renewal, and DDoS mitigation against malicious automated bots.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-sky-500/20 bg-sky-500/5 flex flex-col sm:flex-row gap-3 items-start">
                <div className="px-2.5 py-1 rounded font-mono text-[10px] font-bold uppercase shrink-0 bg-sky-500/15 text-sky-400 border border-sky-500/30">Hugging Face Daily Pulse</div>
                <p className={`text-[12px] leading-relaxed font-light ${t.textSecondary}`}>
                  Daily automated cron jobs query public Hugging Face and ArXiv feeds to update open-weights model rankings without processing user identifiers.
                </p>
              </div>
            </div>
          </section>

          <hr className={t.border} />

          {/* Section 7: Data Retention & Purging */}
          <section id="retention" className="space-y-4 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
                <Trash2 size={18} />
              </div>
              <h2 className={`text-xl font-black tracking-tight ${t.textPrimary}`}>
                7. Data Retention & Account Purging (Right to be Forgotten)
              </h2>
            </div>
            <p className={`text-[13px] leading-relaxed font-light ${t.textSecondary}`}>
              We adhere strictly to data minimization. We only retain personal preferences and bookmark entries for as long as your account remains active.
            </p>
            <div className="p-4.5 rounded-2xl border border-rose-500/30 bg-rose-500/5 space-y-2">
              <h4 className="text-[13px] font-bold text-rose-400">Automated Data Erasure</h4>
              <p className={`text-[12px] leading-relaxed font-light ${t.textSecondary}`}>
                You may request complete account deletion at any time through the User Profile Menu or by emailing our privacy team. When processed, your profile metadata, bookmarks, and preferences are permanently purged from Supabase databases within 72 hours.
              </p>
            </div>
          </section>

          <hr className={t.border} />

          {/* Section 8: Global Privacy Rights */}
          <section id="rights" className="space-y-4 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-fuchsia-500/15 border border-fuchsia-500/30 text-fuchsia-400">
                <Globe size={18} />
              </div>
              <h2 className={`text-xl font-black tracking-tight ${t.textPrimary}`}>
                8. Your Global Privacy Rights (GDPR, CCPA & Beyond)
              </h2>
            </div>
            <p className={`text-[13px] leading-relaxed font-light ${t.textSecondary}`}>
              Regardless of your geographic location, AiVerse extends full data privacy rights:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {[
                { title: "Right to Access & Inspection", desc: "Request a clean JSON export of all preferences, bookmarks, and metadata stored under your key." },
                { title: "Right to Rectification", desc: "Update or amend display names, bio descriptions, usernames, or technical roles in real-time." },
                { title: "Right to Erasure", desc: "Request permanent deletion of all stored database records without retention delays." },
                { title: "Right to Non-Discrimination", desc: "You will never receive reduced catalog quality, throttling, or restricted browsing for exercising your rights." },
              ].map((right, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-fuchsia-500/20 bg-fuchsia-500/5 space-y-1">
                  <span className="text-[12px] font-bold text-fuchsia-300">{right.title}</span>
                  <p className={`text-[11px] font-light leading-relaxed ${t.textSecondary}`}>{right.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <hr className={t.border} />

          {/* Section 9: Security Safeguards */}
          <section id="security" className="space-y-4 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
                <ShieldCheck size={18} />
              </div>
              <h2 className={`text-xl font-black tracking-tight ${t.textPrimary}`}>
                9. Security Safeguards & Row-Level Security
              </h2>
            </div>
            <p className={`text-[13px] leading-relaxed font-light ${t.textSecondary}`}>
              We employ defense-in-depth technical measures to prevent unauthorized data access, leakage, or tampering:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[13px] font-light text-neutral-300 pl-2">
              <li><strong>Row-Level Security (RLS):</strong> Every PostgreSQL table employs strict RLS policies restricting read/write access based on cryptographic session authentication.</li>
              <li><strong>TLS 1.3 Encryption:</strong> All traffic in transit between your browser and our edge servers is encrypted using modern TLS cipher suites.</li>
              <li><strong>Zero Password Storage:</strong> By utilizing federated OAuth 2.0 with GitHub and Google, AiVerse eliminates the risk of credential database leaks.</li>
            </ul>
          </section>

          <hr className={t.border} />

          {/* Section 10: Updates & Inquiries */}
          <section id="changes" className="space-y-4 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400">
                <HelpCircle size={18} />
              </div>
              <h2 className={`text-xl font-black tracking-tight ${t.textPrimary}`}>
                10. Children&apos;s Privacy, Policy Modifications & Contact
              </h2>
            </div>
            <p className={`text-[13px] leading-relaxed font-light ${t.textSecondary}`}>
              AiVerse is not intended for children under 13 years of age. We do not knowingly collect personal information from children. If we discover that a user under 13 has provided personal information, we will delete it promptly.
            </p>
            <p className={`text-[13px] leading-relaxed font-light ${t.textSecondary}`}>
              We may update this policy periodically. Any changes will be published here with an updated Effective Date. For questions regarding our privacy architecture, contact our team:
            </p>
            <div className="flex flex-wrap gap-3.5 mt-3">
              <a
                href="https://github.com/Frozen-47/AiVerse"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${t.surface2} ${t.border} text-sky-400 hover:border-sky-500/40 hover:bg-sky-500/10`}
              >
                GitHub Repository
              </a>
              <a
                href="https://github.com/Frozen-47/AiVerse/issues"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${t.surface2} ${t.border} text-rose-400 hover:border-rose-500/40 hover:bg-rose-500/10`}
              >
                Report Security Issue
              </a>
              <a
                href="mailto:frozennheart47@gmail.com"
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${t.surface2} ${t.border} text-indigo-400 hover:border-indigo-500/40 hover:bg-indigo-500/10`}
              >
                Email: frozennheart47@gmail.com
              </a>
            </div>
          </section>
        </div>
      </div>

      {/* Footer Return Link */}
      <div className="mt-12 text-center pb-8">
        <button
          onClick={onBackToHome}
          className={`text-xs underline underline-offset-4 font-semibold transition-colors cursor-pointer ${t.textSecondary} hover:${t.textPrimary}`}
        >
          Return to Dashboard Homepage
        </button>
      </div>
    </div>
  );
};
