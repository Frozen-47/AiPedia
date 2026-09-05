import React from "react";
import { Sparkles, Cpu, Layers, Bot, ArrowRight, Shield } from "lucide-react";
import { useTokens } from "../lib/theme";

interface FeatureRibbonProps {
  user: any;
  onOpenAuth: (mode: "signin" | "signup") => void;
  onOpenWizard: () => void;
  onOpenArena: () => void;
  onOpenPlayground: () => void;
  onOpenSuite: () => void;
}

export const FeatureRibbon: React.FC<FeatureRibbonProps> = ({
  user,
  onOpenAuth,
  onOpenWizard,
  onOpenArena,
  onOpenPlayground,
  onOpenSuite,
}) => {
  const t = useTokens();

  const features = [
    {
      title: "Discovery Wizard",
      desc: "Interactive matching quiz based on your goals & stack",
      icon: Sparkles,
      iconColor: "text-white bg-white/10 border-white/15",
      isLocked: !user,
      onClick: () => (!user ? onOpenAuth("signin") : onOpenWizard()),
    },
    {
      title: "Comparison Arena",
      desc: "Side-by-side architectural & benchmark comparisons",
      icon: Cpu,
      iconColor: "text-white bg-white/10 border-white/15",
      isLocked: !user,
      onClick: () => (!user ? onOpenAuth("signin") : onOpenArena()),
    },
    {
      title: "Model Playground",
      desc: "Prompt LLMs side-by-side with system constraints",
      icon: Bot,
      iconColor: "text-white bg-white/10 border-white/15",
      isLocked: !user,
      onClick: () => (!user ? onOpenAuth("signin") : onOpenPlayground()),
    },
    {
      title: "Ecosystem Suite",
      desc: "Category dashboards & system capacity metrics",
      icon: Layers,
      iconColor: "text-white bg-white/10 border-white/15",
      isLocked: false,
      onClick: onOpenSuite,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
      {features.map((f, idx) => {
        const Icon = f.icon;
        return (
          <button
            key={idx}
            onClick={f.onClick}
            className={`group relative overflow-hidden p-5 rounded-2xl border text-left transition-all duration-300 hover:border-white/30 cursor-pointer flex flex-col justify-between ${t.card}`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${f.iconColor}`}>
                  <Icon size={18} />
                </div>
                {f.isLocked && (
                  <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/10 text-white/80 border border-white/15">
                    <Shield size={9} /> Unlock
                  </span>
                )}
              </div>
              <h4 className={`text-sm font-bold mb-1 transition-colors group-hover:text-white ${t.textPrimary}`}>
                {f.title}
              </h4>
              <p className={`text-[12px] leading-relaxed font-light ${t.textSecondary} line-clamp-2`}>
                {f.desc}
              </p>
            </div>
            <div className={`mt-4 pt-2 flex items-center gap-1 text-[11px] font-extrabold text-white group-hover:translate-x-0.5 transition-transform`}>
              <span>Launch</span> <ArrowRight size={11} />
            </div>
          </button>
        );
      })}
    </div>
  );
};
