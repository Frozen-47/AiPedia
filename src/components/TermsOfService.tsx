import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Scale,
  ShieldAlert,
  FileText,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ChevronRight,
  Code2,
  ExternalLink,
  Ban,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { useTokens } from "../lib/theme";

interface TermsOfServiceProps {
  onBackToHome: () => void;
}

export const TermsOfService: React.FC<TermsOfServiceProps> = ({ onBackToHome }) => {
  const t = useTokens();
  const [activeSection, setActiveSection] = useState("acceptance");
  const isProgrammaticScroll = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sections = [
    { id: "acceptance", label: "1. Acceptance & Eligibility", icon: CheckCircle2 },
    { id: "purpose", label: "2. Platform Scope & Services", icon: FileText },
    { id: "accounts", label: "3. Accounts & Authentication", icon: ShieldAlert },
    { id: "contributions", label: "4. Community Submissions", icon: AlertTriangle },
    { id: "licensing", label: "5. Intellectual Property", icon: Code2 },
    { id: "dmca", label: "6. DMCA & Copyright Policy", icon: BookOpen },
    { id: "acceptable-use", label: "7. Acceptable Use Rules", icon: Ban },
    { id: "third-party", label: "8. Third-Party Integrations", icon: ExternalLink },
    { id: "disclaimer", label: "9. Warranties & Liability", icon: Scale },
    { id: "contact", label: "10. Modifications & Contact", icon: HelpCircle },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    isProgrammaticScroll.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Release programmatic scroll lock once smooth scroll is complete
    scrollTimeoutRef.current = setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 1000);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isProgrammaticScroll.current) return;

      // When reaching near bottom of page, highlight the last section
      const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
      if (isBottom) {
        setActiveSection(sections[sections.length - 1].id);
        return;
      }

      // Check which section is currently at the top of the viewport below header
      const navbarOffset = 140;
      let currentSection = sections[0].id;

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= navbarOffset) {
            currentSection = section.id;
          }
        }
      }
      setActiveSection(currentSection);
    };

    const handleScrollEnd = () => {
      isProgrammaticScroll.current = false;
    };

    const handleUserInterrupt = () => {
      if (isProgrammaticScroll.current) {
        isProgrammaticScroll.current = false;
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("scrollend", handleScrollEnd);
    window.addEventListener("wheel", handleUserInterrupt, { passive: true });
    window.addEventListener("touchstart", handleUserInterrupt, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scrollend", handleScrollEnd);
      window.removeEventListener("wheel", handleUserInterrupt);
      window.removeEventListener("touchstart", handleUserInterrupt);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const activeColorMap: Record<string, { bg: string; text: string; icon: string }> = {
    acceptance: { bg: "bg-emerald-500/10 border-emerald-500/30", text: "text-emerald-400", icon: "text-emerald-400" },
    purpose: { bg: "bg-sky-500/10 border-sky-500/30", text: "text-sky-400", icon: "text-sky-400" },
    accounts: { bg: "bg-violet-500/10 border-violet-500/30", text: "text-violet-400", icon: "text-violet-400" },
    contributions: { bg: "bg-amber-500/10 border-amber-500/30", text: "text-amber-400", icon: "text-amber-400" },
    licensing: { bg: "bg-cyan-500/10 border-cyan-500/30", text: "text-cyan-400", icon: "text-cyan-400" },
    dmca: { bg: "bg-fuchsia-500/10 border-fuchsia-500/30", text: "text-fuchsia-400", icon: "text-fuchsia-400" },
    "acceptable-use": { bg: "bg-orange-500/10 border-orange-500/30", text: "text-orange-400", icon: "text-orange-400" },
    "third-party": { bg: "bg-teal-500/10 border-teal-500/30", text: "text-teal-400", icon: "text-teal-400" },
    disclaimer: { bg: "bg-rose-500/10 border-rose-500/30", text: "text-rose-400", icon: "text-rose-400" },
    contact: { bg: "bg-indigo-500/10 border-indigo-500/30", text: "text-indigo-400", icon: "text-indigo-400" },
  };

  return (
    <div className="w-full px-4 sm:px-6 xl:px-12 py-8">
      {/* Header Banner */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-dashed border-slate-200 dark:border-white/6">
        <div>
          <div className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest border rounded-full px-3.5 py-1 mb-3.5 bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-xs">
            <Scale size={11} className="text-emerald-400" />
            Legal Framework Agreement
          </div>
          <h1 className={`text-[clamp(32px,4vw,48px)] font-black leading-[1.05] tracking-[-0.03em] mb-2.5 ${t.textPrimary}`}>
            Terms of Service
          </h1>
          <p className={`text-[13px] font-light ${t.textSecondary}`}>
            Effective: May 20, 2026 · Comprehensive legal, architectural, and community terms governing the AiVerse platform.
          </p>
        </div>

        <button
          onClick={onBackToHome}
          className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-bold border shadow-sm transition-all cursor-pointer ${t.surface} ${t.border} ${t.textPrimary} hover:border-emerald-500/40 hover:text-emerald-400 active:scale-95`}
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
              Agreement Sections ({sections.length})
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
          <div className={`hidden lg:block p-5 rounded-2xl border shadow-md ${t.surface} ${t.border} bg-gradient-to-br from-indigo-950/20 to-transparent`}>
            <h4 className={`text-[12px] font-bold ${t.textPrimary} mb-1.5 flex items-center gap-1.5`}>
              <Sparkles size={13} className="text-indigo-400" /> Have Inquiries?
            </h4>
            <p className={`text-[11px] leading-relaxed ${t.textSecondary} mb-3.5`}>
              Inspect our open-source codebase, review system architectures, or submit issues on GitHub.
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="https://github.com/Frozen-47/AiVerse"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-2 rounded-xl text-[11px] font-bold text-center border transition-all ${t.surface2} ${t.border} text-indigo-400 hover:border-indigo-500/40 hover:bg-indigo-500/10`}
              >
                GitHub Core
              </a>
              <a
                href="mailto:frozennheart47@gmail.com"
                className={`w-full py-2 rounded-xl text-[11px] font-bold text-center border transition-all ${t.surface2} ${t.border} text-sky-400 hover:border-sky-500/40 hover:bg-sky-500/10`}
              >
                Email Legal Support
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Complete Immersive content */}
        <div className={`flex-1 min-w-0 border rounded-3xl p-6 sm:p-10 backdrop-blur-xl ${t.surface} ${t.border} shadow-2xl space-y-12`}>
          {/* Top Notice */}
          <div className="p-4.5 rounded-2xl border leading-normal text-[12px] font-medium flex items-center gap-3 border-emerald-500/30 bg-emerald-500/5 text-emerald-300">
            <Scale size={20} className="shrink-0 text-emerald-400" />
            <span>
              By accessing, browsing, or contributing to the AiVerse platform, you confirm your legal agreement to these Terms. All users are expected to contribute truthfully, respect open-weights licenses, and support safe AI practices.
            </span>
          </div>

          {/* Section 1: Acceptance & Eligibility */}
          <section id="acceptance" className="space-y-4 pt-2 first:pt-0 scroll-mt-28">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <CheckCircle2 size={18} />
              </div>
              <h2 className={`text-xl font-black tracking-tight ${t.textPrimary}`}>
                1. Acceptance of Terms & Eligibility
              </h2>
            </div>
            <p className={`text-[13px] leading-relaxed font-light ${t.textSecondary}`}>
              These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between you (&quot;User,&quot; &quot;Developer,&quot; or &quot;Contributor&quot;) and <strong>AiVerse</strong> (&quot;Platform,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), accessible at <a href="https://aiverse.frozenn.in" className="text-emerald-400 hover:text-emerald-300 hover:underline font-semibold">https://aiverse.frozenn.in</a>.
            </p>
            <p className={`text-[13px] leading-relaxed font-light ${t.textSecondary}`}>
              By accessing our website, querying our catalog, utilizing the Discovery Wizard, or authenticating an account, you represent and warrant that:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-[13px] font-light text-neutral-300 pl-2">
              <li>You are at least 13 years of age (or the minimum legal age in your jurisdiction required to consent to online services).</li>
              <li>You possess the legal capacity and authority to enter into these Terms on behalf of yourself or an entity.</li>
              <li>Your use of AiVerse does not violate any local, national, or international software and cryptographic export laws.</li>
            </ul>
          </section>

          <hr className={t.border} />

          {/* Section 2: Platform Scope & Services */}
          <section id="purpose" className="space-y-4 scroll-mt-28">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400">
                <FileText size={18} />
              </div>
              <h2 className={`text-xl font-black tracking-tight ${t.textPrimary}`}>
                2. Platform Scope & Artificial Intelligence Directory
              </h2>
            </div>
            <p className={`text-[13px] leading-relaxed font-light ${t.textSecondary}`}>
              AiVerse operates as a modern open-source index, benchmark comparison engine, and educational compendium covering over 228+ artificial intelligence technologies across five primary domains:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
              {[
                { title: "Models & LLMs", desc: "Open weights, proprietary foundations, reasoning models, and multimodal architectures." },
                { title: "Frameworks & Libs", desc: "Training frameworks, inference engines, quantization tooling, and orchestration pipelines." },
                { title: "Datasets & Corpora", desc: "Pre-training text corpuses, instruction datasets, multimodal vision pairs, and evaluation sets." },
                { title: "Compute & Platforms", desc: "Serverless model hosting, distributed training clusters, and fine-tuning infrastructures." },
                { title: "AI Applications", desc: "Production consumer tools, autonomous developer agents, and voice/audio synthesis platforms." },
                { title: "Daily Pulse Sync", desc: "Automated daily crawling of trending Hugging Face models, ArXiv papers, and spotlight entries." },
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-sky-500/20 bg-sky-500/5 space-y-1">
                  <h4 className="text-[12px] font-bold text-sky-300">{item.title}</h4>
                  <p className={`text-[11px] leading-relaxed font-light ${t.textSecondary}`}>{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <hr className={t.border} />

          {/* Section 3: Accounts & Security */}
          <section id="accounts" className="space-y-4 scroll-mt-28">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-400">
                <ShieldAlert size={18} />
              </div>
              <h2 className={`text-xl font-black tracking-tight ${t.textPrimary}`}>
                3. Accounts, Authentication & Security Responsibilities
              </h2>
            </div>
            <p className={`text-[13px] leading-relaxed font-light ${t.textSecondary}`}>
              While the public AiVerse directory can be browsed anonymously without authentication, personalized features (such as bookmarks, custom feeds, submission auditing, and rating submissions) require user authentication.
            </p>
            <div className="space-y-3 pt-1">
              <div className="p-4 rounded-xl border border-violet-500/20 bg-violet-500/5 space-y-2">
                <h4 className="text-[13px] font-bold text-violet-300">Third-Party OAuth Authentication</h4>
                <p className={`text-[12px] leading-relaxed font-light ${t.textSecondary}`}>
                  Authentication is handled through industry-standard OAuth 2.0 via Supabase Auth (connecting GitHub and Google OAuth). We do not store raw account passwords. You are responsible for preserving access to your linked provider accounts.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-violet-500/20 bg-violet-500/5 space-y-2">
                <h4 className="text-[13px] font-bold text-violet-300">Suspension & Administrative Sanctions</h4>
                <p className={`text-[12px] leading-relaxed font-light ${t.textSecondary}`}>
                  AiVerse administrators reserve the authority to temporarily suspend, restrict, or permanently ban accounts that repeatedly violate submission policies, engage in automated rating manipulation, or disseminate malicious links.
                </p>
              </div>
            </div>
          </section>

          <hr className={t.border} />

          {/* Section 4: Community Submissions */}
          <section id="contributions" className="space-y-4 scroll-mt-28">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                <AlertTriangle size={18} />
              </div>
              <h2 className={`text-xl font-black tracking-tight ${t.textPrimary}`}>
                4. Community Submissions & Content Verification
              </h2>
            </div>
            <p className={`text-[13px] leading-relaxed font-light ${t.textSecondary}`}>
              AiVerse thrives on builder community submissions. When you submit a new model, framework, dataset, or platform to our directory:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[13px] font-light text-neutral-300 pl-2">
              <li><strong>Accuracy Representation:</strong> You warrant that all parameter sizes, release dates, benchmark results, and organization attributions are factual to the best of your knowledge.</li>
              <li><strong>License Transparency:</strong> You must state the authentic open-source or commercial license (e.g. MIT, Apache 2.0, OpenRAIL, CC-BY-4.0). Submitting deceptive license designations is strictly prohibited.</li>
              <li><strong>Editorial Discretion:</strong> All submissions undergo review in the Admin Queue. AiVerse reviewers reserve the unilateral right to approve, request revisions, or discard submissions that do not meet architectural standards.</li>
            </ul>
          </section>

          <hr className={t.border} />

          {/* Section 5: Licensing & Model Weights */}
          <section id="licensing" className="space-y-4 scroll-mt-28">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
                <Code2 size={18} />
              </div>
              <h2 className={`text-xl font-black tracking-tight ${t.textPrimary}`}>
                5. Intellectual Property & Model Weights Distribution
              </h2>
            </div>
            <p className={`text-[13px] leading-relaxed font-light ${t.textSecondary}`}>
              Understanding ownership of artificial intelligence assets is paramount in our community:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 space-y-2">
                <h4 className="text-[13px] font-bold text-cyan-300">AiVerse Codebase & Platform</h4>
                <p className={`text-[12px] leading-relaxed font-light ${t.textSecondary}`}>
                  The AiVerse user interface, search indexing algorithms, and custom front-end components are licensed under the MIT Open Source License. You are free to inspect, fork, and study the platform on GitHub.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 space-y-2">
                <h4 className="text-[13px] font-bold text-cyan-300">Indexed Third-Party Technologies</h4>
                <p className={`text-[12px] leading-relaxed font-light ${t.textSecondary}`}>
                  All listed model weights, checkpoints, framework libraries, and papers remain the intellectual property of their original creators (e.g. Meta, Anthropic, DeepSeek, Mistral, Google). AiVerse does not host model weights directly.
                </p>
              </div>
            </div>
          </section>

          <hr className={t.border} />

          {/* Section 6: DMCA & Copyright Policy */}
          <section id="dmca" className="space-y-4 scroll-mt-28">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-fuchsia-500/15 border border-fuchsia-500/30 text-fuchsia-400">
                <BookOpen size={18} />
              </div>
              <h2 className={`text-xl font-black tracking-tight ${t.textPrimary}`}>
                6. DMCA & Copyright Infringement Notice
              </h2>
            </div>
            <p className={`text-[13px] leading-relaxed font-light ${t.textSecondary}`}>
              AiVerse complies with the Digital Millennium Copyright Act (&quot;DMCA&quot;). If you believe your copyrighted materials or trademarked brand assets are displayed in our directory in an unauthorized manner, submit a formal notice to our designated agent containing:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-[13px] font-light text-neutral-300 pl-2">
              <li>Identification of the copyrighted asset claimed to have been infringed.</li>
              <li>Identification of the specific AiVerse URL or entry metadata to be modified or removed.</li>
              <li>Your contact coordinates (full name, company affiliation, email address, physical address).</li>
              <li>A physical or electronic signature of the authorized copyright holder.</li>
            </ul>
            <p className={`text-[12px] font-mono text-fuchsia-300 pt-1`}>
              Direct notices to: dmca@frozenn.in or frozennheart47@gmail.com
            </p>
          </section>

          <hr className={t.border} />

          {/* Section 7: Acceptable Use */}
          <section id="acceptable-use" className="space-y-4 scroll-mt-28">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400">
                <Ban size={18} />
              </div>
              <h2 className={`text-xl font-black tracking-tight ${t.textPrimary}`}>
                7. Acceptable Use & System Integrity Guidelines
              </h2>
            </div>
            <p className={`text-[13px] leading-relaxed font-light ${t.textSecondary}`}>
              To preserve system performance for all global builders, you agree NOT to engage in the following prohibited behaviors:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {[
                { title: "Aggressive Automated Scraping", desc: "Bombarding platform endpoints with automated scrapers without rate limit respect." },
                { title: "Sybil Manipulation", desc: "Creating ghost accounts to artificially inflate likes, ratings, or popularity metrics." },
                { title: "Adversarial Injection", desc: "Submitting script tags or malicious payloads into summary or architecture fields." },
                { title: "Malware Distribution", desc: "Linking to unauthorized binaries, trojan checkpoints, or malicious repositories." },
              ].map((rule, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-orange-500/20 bg-orange-500/5 space-y-1">
                  <span className="text-[12px] font-bold text-orange-400">{rule.title}</span>
                  <p className={`text-[11px] font-light leading-relaxed ${t.textSecondary}`}>{rule.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <hr className={t.border} />

          {/* Section 8: Third-Party Integrations */}
          <section id="third-party" className="space-y-4 scroll-mt-28">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-400">
                <ExternalLink size={18} />
              </div>
              <h2 className={`text-xl font-black tracking-tight ${t.textPrimary}`}>
                8. Third-Party Links & External Repositories
              </h2>
            </div>
            <p className={`text-[13px] leading-relaxed font-light ${t.textSecondary}`}>
              AiVerse contains hyperlinks to external web assets, including Hugging Face model cards, GitHub source trees, ArXiv whitepapers, and corporate technical portals. We have no control over and assume no liability for the content, privacy policies, safety, or stability of any third-party websites or services.
            </p>
            <p className={`text-[13px] leading-relaxed font-light ${t.textSecondary}`}>
              Before downloading weights or executing terminal commands from external sources, always review the original repository&apos;s code and security policies.
            </p>
          </section>

          <hr className={t.border} />

          {/* Section 9: Warranties & Liability */}
          <section id="disclaimer" className="space-y-4 scroll-mt-28">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
                <Scale size={18} />
              </div>
              <h2 className={`text-xl font-black tracking-tight ${t.textPrimary}`}>
                9. Disclaimer of Warranties & Limitation of Liability
              </h2>
            </div>
            <div className="p-4.5 rounded-2xl border border-rose-500/30 bg-rose-500/5 space-y-2.5">
              <p className="text-[12px] font-bold uppercase tracking-wider text-rose-400">
                &quot;AS-IS&quot; AND &quot;AS-AVAILABLE&quot; PROVISION
              </p>
              <p className={`text-[12px] leading-relaxed font-light ${t.textSecondary}`}>
                AIVERSE IS PROVIDED STRICTLY ON AN &quot;AS IS&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR ACCURACY OF BENCHMARK SCORES.
              </p>
              <p className={`text-[12px] leading-relaxed font-light ${t.textSecondary}`}>
                UNDER NO CIRCUMSTANCES SHALL AIVERSE, ITS FOUNDERS, OR CONTRIBUTORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES RESULTING FROM YOUR USE OF (OR INABILITY TO USE) ANY LISTED AI TOOL, PIPELINE, OR REPOSITORY.
              </p>
            </div>
          </section>

          <hr className={t.border} />

          {/* Section 10: Modifications & Contact */}
          <section id="contact" className="space-y-4 scroll-mt-28">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
                <HelpCircle size={18} />
              </div>
              <h2 className={`text-xl font-black tracking-tight ${t.textPrimary}`}>
                10. Agreement Modifications & Contact Channels
              </h2>
            </div>
            <p className={`text-[13px] leading-relaxed font-light ${t.textSecondary}`}>
              We reserve the prerogative to revise these Terms of Service periodically to account for new system capabilities, community features, and regulatory requirements. Continued use of the platform after updates take effect represents your acceptance of the revised Terms.
            </p>
            <p className={`text-[13px] leading-relaxed font-light ${t.textSecondary}`}>
              For inquiries, legal notices, or feedback regarding these Terms, contact our engineering maintenance team:
            </p>
            <div className="flex flex-wrap gap-3.5 mt-3">
              <a
                href="https://github.com/Frozen-47/AiVerse"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${t.surface2} ${t.border} text-indigo-400 hover:border-indigo-500/40 hover:bg-indigo-500/10`}
              >
                GitHub Project
              </a>
              <a
                href="https://github.com/Frozen-47/AiVerse/issues"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${t.surface2} ${t.border} text-amber-400 hover:border-amber-500/40 hover:bg-amber-500/10`}
              >
                Feedback & Issues
              </a>
              <a
                href="mailto:frozennheart47@gmail.com"
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${t.surface2} ${t.border} text-sky-400 hover:border-sky-500/40 hover:bg-sky-500/10`}
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
