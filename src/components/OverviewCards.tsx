import React, { useEffect, useState } from "react";
import { useTokens } from "../lib/theme";
import { fetchDashboardStats } from "../lib/dashboard";
import { Database, Users, Award } from "lucide-react";

interface Stats {
  totalEntries: number;
  totalUsers: number;
  averageRating: number;
}

interface OverviewCardsProps {
  totalEntriesCount?: number;
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({ totalEntriesCount }) => {
  const [stats, setStats] = useState<Stats>({ totalEntries: 0, totalUsers: 0, averageRating: 0 });
  const t = useTokens();

  useEffect(() => {
    (async () => {
      const data = await fetchDashboardStats();
      setStats(data);
    })();
  }, []);

  const displayEntries = stats.totalEntries > 0 ? stats.totalEntries : (totalEntriesCount || 228);

  const cards = [
    { 
      label: "Registered Entries", 
      value: displayEntries, 
      icon: Database,
      trend: "+12 new",
      trendColor: "text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/10",
      iconColor: "text-sky-500 dark:text-sky-400 bg-sky-500/10 border-sky-500/20"
    },
    { 
      label: "Active Builders", 
      value: stats.totalUsers, 
      icon: Users,
      trend: "+4 today",
      trendColor: "text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/10",
      iconColor: "text-amber-500 dark:text-amber-400 bg-amber-500/10 border-amber-500/20"
    },
    { 
      label: "Average Rating", 
      value: stats.averageRating.toFixed(2), 
      icon: Award,
      trend: "out of 5.0",
      trendColor: "text-indigo-500 dark:text-indigo-400 bg-indigo-500/10 border border-indigo-500/10",
      iconColor: "text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className={`group relative overflow-hidden p-6 rounded-2xl border transition-all duration-300 glow-card ${t.card}`}
          >
            {/* Subtle decorative glow element */}
            <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-linear-to-br from-white/[0.02] to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="flex items-center justify-between gap-3 mb-4">
              <span className={`text-[11px] font-bold tracking-wider uppercase ${t.textSecondary}`}>
                {c.label}
              </span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${c.iconColor}`}>
                <Icon size={16} className="stroke-[2.5px]" />
              </div>
            </div>

            <div className="flex items-end justify-between gap-2 mt-2">
              <div className={`text-3xl font-black tracking-tight ${t.textPrimary}`}>
                {c.value}
              </div>
              <span className={`inline-flex items-center gap-1 text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-lg ${c.trendColor}`}>
                {c.trend}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

