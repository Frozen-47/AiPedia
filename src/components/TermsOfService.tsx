import React, { useState, useEffect } from "react";
import { ArrowLeft, Scale, ShieldAlert, FileText, CheckCircle2, AlertTriangle, HelpCircle, ChevronRight } from "lucide-react";
import { useTokens, useTheme } from "../lib/theme";

interface TermsOfServiceProps {
  onBackToHome: () => void;
}

export const TermsOfService: React.FC<TermsOfServiceProps> = ({ onBackToHome }) => {
  const t = useTokens();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "amoled";
  const [activeSection, setActiveSection] = useState("acceptance");

  const sections = [
    { id: "acceptance", label: "1. Acceptance of Terms", icon: CheckCircle2 },
    { id: "purpose", label: "2. Description of Service", icon: FileText },
    { id: "accounts", label: "3. Accounts & Authentication", icon: ShieldAlert },
    { id: "contributions", label: "4. User Contributions", icon: AlertTriangle },
    { id: "disclaimer", label: "5. Disclaimer of Warranties", icon: Scale },
    { id: "contact", label: "6. Changes & Contact", icon: HelpCircle },
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
            <Scale size={10} className={isDark ? "text-white/50" : "text-black/50"} />
            Legal Framework Agreement
          </div>
          <h1 className={`text-[clamp(32px,4vw,48px)] font-black leading-[1.05] tracking-[-0.03em] mb-2.5 ${t.textPrimary}`}>
            Terms of Service
          </h1>
          <p className={`text-[13px] font-light ${t.textSecondary}`}>
            Last updated: May 20, 2026 · Please review these terms carefully before engaging with the platform.
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
              Agreement Sections
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
            <h4 className={`text-[12px] font-bold ${t.textPrimary} mb-1.5`}>Have Inquiries?</h4>
            <p className={`text-[11px] leading-relaxed ${t.textSecondary} mb-3.5`}>
              View our open-source codebase, inspect core files, or collaborate with the design crew.
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="https://github.com/Frozen-47/AiVerse"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-2 rounded-xl text-[11px] font-bold text-center border transition-all ${t.surface2} ${t.border} ${t.textPrimary} hover:${t.borderHover}`}
              >
                GitHub Core
              </a>
              <a
                href="mailto:frozennheart47@gmail.com"
                className={`w-full py-2 rounded-xl text-[11px] font-bold text-center border transition-all ${t.surface2} ${t.border} ${t.textPrimary} hover:${t.borderHover}`}
              >
                Email Support
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Complete Immersive content */}
        <div className={`flex-1 min-w-0 border rounded-3xl p-6 sm:p-10 backdrop-blur-xl ${t.surface} ${t.border} shadow-2xl space-y-12`}>
          <div className={`p-4 rounded-xl border leading-normal text-[12px] font-semibold ${isDark ? "border-white/10 bg-white/5 text-white" : "border-black/10 bg-black/5 text-neutral-900"}`}>
            ⚖️ By interacting with the AiVerse catalog, you agree to prioritize data accuracy and respect intellectual property rights across the directory.
          </div>

          {/* Acceptance Section */}
          <section id="acceptance" className="space-y-4 pt-2 first:pt-0 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${t.iconBgSolid}`}>
                <CheckCircle2 size={18} />
              </div>
              <h2 className={`text-xl font-bold tracking-tight ${t.textPrimary}`}>
                1. Acceptance of Terms
              </h2>
            </div>
            <p className={`text-[13px] leading-relaxed font-light ${t.textSecondary}`}>
              By accessing or using <strong>AiVerse</strong> (available at <a href="https://aiverse.frozenn.in" className={`${isDark ? "text-cyan-400 hover:text-cyan-300" : "text-cyan-600 hover:text-cyan-700"} hover:underline font-semibold`}>https://aiverse.frozenn.in</a>), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not access or use our platform.
            </p>
          </section>

          <hr className={`${t.border}`} />

          {/* Purpose Section */}
          <section id="purpose" className="space-y-4 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${t.iconBgSolid}`}>
                <FileText size={18} />
              </div>
              <h2 className={`text-xl font-bold tracking-tight ${t.textPrimary}`}>
                2. Description of Service
              </h2>
            </div>
            <p className={`text-[13px] leading-relaxed font-light ${t.textSecondary}`}>
              AiVerse is an open-source, community-driven catalog and knowledge base for Artificial Intelligence tools, machine learning models, frameworks, and datasets. Users can browse entries, personalize their dashboards based on interests, bookmark entries, and submit new AI tools to the directory.
            </p>
          </section>

          <hr className={`${t.border}`} />

          {/* Accounts Section */}
          <section id="accounts" className="space-y-4 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${t.iconBgSolid}`}>
                <ShieldAlert size={18} />
              </div>
              <h2 className={`text-xl font-bold tracking-tight ${t.textPrimary}`}>
                3. Accounts & Authentication
              </h2>
            </div>
            <p className={`text-[13px] leading-relaxed font-light ${t.textSecondary}`}>
              To utilize personalized features like custom feeds or entry bookmarking, you may authenticate using third-party social log-ins (e.g., GitHub, Google) facilitated securely by Supabase. You are responsible for keeping your login credentials secure and for all activity occurring under your account.
            </p>
          </section>

          <hr className={`${t.border}`} />

          {/* Contributions Section */}
          <section id="contributions" className="space-y-4 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${t.iconBgSolid}`}>
                <AlertTriangle size={18} />
              </div>
              <h2 className={`text-xl font-bold tracking-tight ${t.textPrimary}`}>
                4. User Contributions & Directory Submissions
              </h2>
            </div>
            <p className={`text-[13px] leading-relaxed font-light ${t.textSecondary}`}>
              When you submit an entry to the AiVerse directory, you warrant that the information is accurate, up-to-date, and does not violate any third-party copyrights or trademarks.
            </p>
            <p className={`text-[13px] leading-relaxed font-light ${t.textSecondary}`}>
              We reserve the right to review, edit, reject, or remove any submission at our sole discretion to maintain the quality and safety of our directory.
            </p>
          </section>

          <hr className={`${t.border}`} />

          {/* Disclaimer Section */}
          <section id="disclaimer" className="space-y-4 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${t.iconBgSolid}`}>
                <Scale size={18} />
              </div>
              <h2 className={`text-xl font-bold tracking-tight ${t.textPrimary}`}>
                5. Disclaimer of Warranties
              </h2>
            </div>
            <p className={`text-[13px] leading-relaxed font-light ${t.textSecondary}`}>
              AiVerse is provided on an "AS IS" and "AS AVAILABLE" basis. We make no representations or warranties of any kind, express or implied, regarding the accuracy, completeness, reliability, or availability of the information listed in the catalog. Your use of the directory is solely at your own risk.
            </p>
          </section>

          <hr className={`${t.border}`} />

          {/* Contact Section */}
          <section id="contact" className="space-y-4 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${t.iconBgSolid}`}>
                <HelpCircle size={18} />
              </div>
              <h2 className={`text-xl font-bold tracking-tight ${t.textPrimary}`}>
                6. Changes to Terms & Contact Information
              </h2>
            </div>
            <p className={`text-[13px] leading-relaxed font-light ${t.textSecondary}`}>
              We reserve the right to modify these terms at any time. Changes will be posted directly to this page with an updated "Last updated" date.
            </p>
            <p className={`text-[13px] leading-relaxed font-light ${t.textSecondary}`}>
              If you have any questions or feedback regarding these terms, please contact us:
            </p>
            <div className="flex flex-wrap gap-3.5 mt-2">
              <a
                href="https://github.com/Frozen-47/AiVerse"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${t.surface2} ${t.border} ${t.textPrimary} hover:${t.borderHover} hover:${t.textAccent}`}
              >
                GitHub Project
              </a>
              <a
                href="https://github.com/Frozen-47/AiVerse/issues"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${t.surface2} ${t.border} ${t.textPrimary} hover:${t.borderHover} hover:${t.textAccent}`}
              >
                Feedback & Issues
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
