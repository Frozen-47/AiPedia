import { X, Sparkles } from "lucide-react";
import { useAuth } from "./AuthContext";
import { useTokens } from "../lib/theme";

interface PreferencesLoginPromptProps {
  onClose: () => void;
  label?: string;
  title?: string;
  description?: string;
}

export function PreferencesLoginPrompt({
  onClose,
  label = "Personal preferences",
  title = "Sign in to personalize AiVerse",
  description = "Create a free account to save your role and interests and get a catalog feed picked for you. Preferences stay synced to your account.",
}: PreferencesLoginPromptProps) {
  const t = useTokens();
  const { openAuthModal } = useAuth();

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative w-full max-w-md rounded-3xl border shadow-2xl p-8 ${t.modal} border-indigo-500/30 shadow-indigo-500/5`}
      >
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-lg border cursor-pointer transition-all ${t.surface} ${t.border} ${t.textMuted} hover:text-white`}
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 text-[10px] font-extrabold uppercase tracking-widest mb-3 shadow-xs">
          <Sparkles size={11} className="fill-indigo-400" />
          {label}
        </div>
        <h2 className={`text-xl font-black tracking-tight mb-2 ${t.textPrimary}`}>
          {title}
        </h2>
        <p className={`text-sm leading-relaxed mb-6 ${t.textSecondary} font-light`}>
          {description}
        </p>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={() => {
              onClose();
              openAuthModal("signin");
            }}
            className={`flex-1 px-4 py-3 rounded-xl font-semibold text-sm border transition-all cursor-pointer ${t.surface} ${t.border} ${t.textPrimary} hover:border-indigo-500/40 hover:text-indigo-300`}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              openAuthModal("signup");
            }}
            className="flex-1 px-4 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/25 transition-all active:scale-[0.98] cursor-pointer"
          >
            Create account
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className={`w-full mt-4 text-[12px] ${t.textMuted} hover:underline cursor-pointer`}
        >
          Continue browsing without preferences
        </button>
      </div>
    </div>
  );
}
