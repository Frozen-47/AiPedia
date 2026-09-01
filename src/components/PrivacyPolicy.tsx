import React, { useState, useEffect } from "react";
import { ArrowLeft, Shield, Lock, Eye, Database, Globe, UserCheck, ChevronRight } from "lucide-react";
import { useTokens, useTheme } from "../lib/theme";

interface PrivacyPolicyProps {
  onBackToHome: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBackToHome }) => {
  const t = useTokens();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "amoled";
  const [activeSection, setActiveSection] = useState("intro");

  const sections = [
    { id: "intro", label: "1. Introduction", icon: Eye },
    { id: "collection", label: "2. Information We Collect", icon: Database },
    { id: "usage", label: "3. How We Use Information", icon: UserCheck },
    { id: "storage", label: "4. Storage & Third-Party", icon: Lock },
    { id: "rights", label: "5. Your Data Rights", icon: Globe },
    { id: "changes", label: "6. Policy Changes & Contact", icon: Shield },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of sticky navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
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

  return (
    <div className="w-full px-4 sm:px-6 xl:px-12 py-8 ">
      {/* Header Banner */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-dashed border-slate-200 dark:border-white/6">
        <div>
          <div className={`inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest border rounded-full px-3 py-1 mb-3.5 ${t.surface} ${t.border} ${t.textMuted}`}>
            <Shield size={10} className={isDark ? "text-white/50" : "text-black/50"} />
            Trust & Transparency Portal
          </div>
          <h1 className={`text-[clamp(32px,4vw,48px)] font-black leading-[1.05] tracking-[-0.03em] mb-2.5 ${t.textPrimary}`}>
            Privacy Policy
          </h1>
          <p className={`text-[13px] font-light ${t.textSecondary}`}>
            Last updated: May 20, 2026 · We value your transparency and builder integrity.
          </p>
        </div>

        <button
          onClick={onBackToHome}
          className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-bold border shadow-sm transition-all cursor-pointer ${t.surface} ${t.border} ${t.textPrimary} hover:${t.borderHover} hover:${t.textAccent}`}
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
              Document Sections
            </p>
            <div className="flex flex-col gap-1.5">
              {sections.map((sect) => {
                const Icon = sect.icon;
                const isActive = activeSection === sect.id;
                return (
                  <button
                    key={sect.id}
                    onClick={() => scrollToSection(sect.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-[12px] font-bold text-left transition-all duration-300 cursor-pointer ${
                      isActive
                        ? `${isDark ? "bg-white/10 border-white/20 text-white shadow-md" : "bg-black/5 border-black/10 text-neutral-900 shadow-sm"}`
                        : `${t.textSecondary} border border-transparent hover:bg-black/5 dark:hover:bg-white/5 ${isDark ? "hover:text-white" : "hover:text-neutral-900"}`
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={14} className={isActive ? (isDark ? "text-white" : "text-neutral-900") : "text-slate-400"} />
                      <span>{sect.label}</span>
                    </div>
                    {isActive && <ChevronRight size={12} className={`${isDark ? "text-white" : "text-neutral-900"} animate-pulse`} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Help Box */}
          <div className={`hidden lg:block p-5 rounded-2xl border shadow-md ${t.surface} ${t.border}`}>
            <h4 className={`text-[12px] font-bold ${t.textPrimary} mb-1.5`}>Need Legal Support?</h4>
            <p className={`text-[11px] leading-relaxed ${t.textSecondary} mb-3.5`}>
              Find our repository licensing terms or contact our maintenance crew directly on public channels.
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="https://github.com/Frozen-47/AiVerse"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-2 rounded-xl text-[11px] font-bold text-center border transition-all ${t.surface2} ${t.border} ${t.textPrimary} hover:${t.borderHover}`}
              >
                GitHub Codebase
              </a>
              <a
                href="mailto:frozennheart47@gmail.com"
                className={`w-full py-2 rounded-xl text-[11px] font-bold text-center border transition-all ${t.surface2} ${t.border} ${t.textPrimary} hover:${t.borderHover}`}
              >
                Email Maintenance
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Complete Immersive content */}
        <div className={`flex-1 min-w-0 border rounded-3xl p-6 sm:p-10 backdrop-blur-xl ${t.surface} ${t.border} shadow-2xl space-y-12`}>
          <div className={`p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-500 leading-normal text-[12px] font-semibold`}>
            🛡️ Your builder metrics, search queries, and selected onboarding interests are always hosted securely. We will never monetize your contribution indexes.
          </div>

          {/* Intro Section */}
          <section id="intro" className="space-y-4 pt-2 first:pt-0 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${t.iconBgSolid}`}>
                <Eye size={18} />
              </div>
              <h2 className={`text-xl font-bold tracking-tight ${t.textPrimary}`}>
                1. Introduction
              </h2>
            </div>
            <p className={`text-[13px] leading-relaxed font-light ${t.textSecondary}`}>
              Welcome to <strong>AiVerse</strong> (available at <a href="https://aiverse.frozenn.in" className={`${isDark ? "text-cyan-400 hover:text-cyan-300" : "text-cyan-600 hover:text-cyan-700"} hover:underline font-semibold`}>https://aiverse.frozenn.in</a>). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our open-source AI Knowledge Base, personalize your dashboard, or submit catalog entries.
            </p>
          </section>

          <hr className={`${t.border}`} />

          {/* Collection Section */}
          <section id="collection" className="space-y-4 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${t.iconBgSolid}`}>
                <Database size={18} />
              </div>
              <h2 className={`text-xl font-bold tracking-tight ${t.textPrimary}`}>
                2. Information We Collect
              </h2>
            </div>
            <p className={`text-[13px] leading-relaxed font-light ${t.textSecondary}`}>
              To provide a personalized catalog and maintain community contributions, we may collect the following types of information:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4.5 rounded-2xl border ${t.surface2} ${t.border} space-y-2`}>
                <h4 className={`text-[13px] font-bold ${t.textPrimary}`}>Account & Authentications</h4>
                <p className={`text-[12px] leading-relaxed font-light ${t.textSecondary}`}>
                  Through secure authentication (Supabase Auth), we fetch your email, display name, and avatar directly from provider tokens (GitHub or Google OAuth).
                </p>
              </div>
              <div className={`p-4.5 rounded-2xl border ${t.surface2} ${t.border} space-y-2`}>
                <h4 className={`text-[13px] font-bold ${t.textPrimary}`}>Personalization Preferences</h4>
                <p className={`text-[12px] leading-relaxed font-light ${t.textSecondary}`}>
                  Your builder profile roles (e.g. Developer, Researcher) and interest fields are stored to custom-tailor feed recommendations.
                </p>
              </div>
              <div className={`p-4.5 rounded-2xl border ${t.surface2} ${t.border} space-y-2`}>
                <h4 className={`text-[13px] font-bold ${t.textPrimary}`}>Bookmarked Collections</h4>
                <p className={`text-[12px] leading-relaxed font-light ${t.textSecondary}`}>
                  Your bookmark indexes are securely synchronized to cloud states so that your personalized favorites display accurately on every login.
                </p>
              </div>
              <div className={`p-4.5 rounded-2xl border ${t.surface2} ${t.border} space-y-2`}>
                <h4 className={`text-[13px] font-bold ${t.textPrimary}`}>Community Entries</h4>
                <p className={`text-[12px] leading-relaxed font-light ${t.textSecondary}`}>
                  All tools, datasets, and details submitted are structured with your account as the verified builder contributor.
                </p>
              </div>
            </div>
          </section>

          <hr className={`${t.border}`} />

          {/* Usage Section */}
          <section id="usage" className="space-y-4 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${t.iconBgSolid}`}>
                <UserCheck size={18} />
              </div>
              <h2 className={`text-xl font-bold tracking-tight ${t.textPrimary}`}>
                3. How We Use Your Information
              </h2>
            </div>
            <p className={`text-[13px] leading-relaxed font-light ${t.textSecondary}`}>
              We use the collected data solely for the following purposes:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Personalized Recommendations", desc: "To populate your custom 'Picked for You' feed with relevant AI tool entries matching your developer profile." },
                { title: "Cross-Device Synchronization", desc: "To securely save, load, and present your bookmarks, favorites, and profile configurations on every system." },
                { title: "Directory Quality Control", desc: "To verify, approve, and audit technical AI listings contributed to the public catalog." },
                { title: "Abuse & Spam Mitigation", desc: "To safeguard community features (likes, bookmarks, ratings) from autonomous bots and sybil activities." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-2 animate-pulse ${isDark ? "bg-white/20" : "bg-black/5"}`} />
                  <div>
                    <h4 className={`text-[13px] font-bold ${t.textPrimary} mb-0.5`}>{item.title}</h4>
                    <p className={`text-[12px] leading-relaxed ${t.textSecondary}`}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <hr className={`${t.border}`} />

          {/* Storage Section */}
          <section id="storage" className="space-y-4 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${t.iconBgSolid}`}>
                <Lock size={18} />
              </div>
              <h2 className={`text-xl font-bold tracking-tight ${t.textPrimary}`}>
                4. Storage & Cloud Infrastructure
              </h2>
            </div>
            <p className={`text-[13px] leading-relaxed font-light ${t.textSecondary}`}>
              We utilize high-tier, secure cloud providers to maintain the performance and security of AiVerse:
            </p>
            <div className="space-y-3.5">
              <div className={`p-4 rounded-xl border ${t.surface2} ${t.border} flex flex-col sm:flex-row gap-3 items-start`}>
                <div className={`px-2.5 py-1 rounded font-mono text-[10px] font-bold uppercase shrink-0 ${isDark ? "bg-white/10 text-white/80" : "bg-black/5 text-black/80"}`}>Supabase DB</div>
                <p className={`text-[12px] leading-relaxed font-light ${t.textSecondary}`}>
                  All entry metrics, account bookmarks, ratings, and login hashes are hosted securely on Supabase databases with token-based access controls.
                </p>
              </div>
              <div className={`p-4 rounded-xl border ${t.surface2} ${t.border} flex flex-col sm:flex-row gap-3 items-start`}>
                <div className={`px-2.5 py-1 rounded font-mono text-[10px] font-bold uppercase shrink-0 ${isDark ? "bg-white/10 text-white/80" : "bg-black/5 text-black/80"}`}>Vercel Edge</div>
                <p className={`text-[12px] leading-relaxed font-light ${t.textSecondary}`}>
                  Our interface and backend edge functions run on Vercel networks to optimize delivery speeds and defend against cyber exploits or DDoS surges.
                </p>
              </div>
              <div className={`p-4 rounded-xl border ${t.surface2} ${t.border} flex flex-col sm:flex-row gap-3 items-start`}>
                <div className={`px-2.5 py-1 rounded font-mono text-[10px] font-bold uppercase shrink-0 ${isDark ? "bg-white/10 text-white/80" : "bg-black/5 text-black/80"}`}>Local Storage</div>
                <p className={`text-[12px] leading-relaxed font-light ${t.textSecondary}`}>
                  We use browser memory to store client theme selections, temporary search caches, and state flags prior to registration.
                </p>
              </div>
            </div>
          </section>

          <hr className={`${t.border}`} />

          {/* Rights Section */}
          <section id="rights" className="space-y-4 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${t.iconBgSolid}`}>
                <Globe size={18} />
              </div>
              <h2 className={`text-xl font-bold tracking-tight ${t.textPrimary}`}>
                5. Your Data Rights & Deletion
              </h2>
            </div>
            <p className={`text-[13px] leading-relaxed font-light ${t.textSecondary}`}>
              We believe in complete builder autonomy. At any point, you are free to customize your role preferences or empty your bookmarks. If you wish to permanently purge your account and delete all associated metric indexes, contact our maintenance team or delete your preferences in the User Portal, and we will completely erase your database records from our Supabase clusters immediately.
            </p>
          </section>

          <hr className={`${t.border}`} />

          {/* Changes Section */}
          <section id="changes" className="space-y-4 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${t.iconBgSolid}`}>
                <Shield size={18} />
              </div>
              <h2 className={`text-xl font-bold tracking-tight ${t.textPrimary}`}>
                6. Policy Modifications & Contact
              </h2>
            </div>
            <p className={`text-[13px] leading-relaxed font-light ${t.textSecondary}`}>
              This policy is actively modified to support new index frameworks, security guidelines, and directory tools. If you have any inquiries or suggestions for our trust team, please reach out to us:
            </p>
            <div className="flex flex-wrap gap-3.5 mt-2">
              <a
                href="https://github.com/Frozen-47/AiVerse"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${t.surface2} ${t.border} ${t.textPrimary} hover:${t.borderHover} hover:${t.textAccent}`}
              >
                GitHub Repository
              </a>
              <a
                href="mailto:frozennheart47@gmail.com"
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${t.surface2} ${t.border} ${t.textPrimary} hover:${t.borderHover} hover:${t.textAccent}`}
              >
                Email: frozennheart47@gmail.com
              </a>
            </div>
          </section>
        </div>
      </div>

      {/* Footer link to home */}
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
