"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/lib/store/gameStore";
import { clickDamage, fmtNum } from "@/lib/game/formulas";
import { supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

function StatPill({ icon, label, value, color }: { icon: string; label: string; value: string | number; color: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-white/40 text-[10px] uppercase tracking-widest">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className="text-base">{icon}</span>
        <span className={`font-bold text-lg tabular-nums ${color}`}>{value}</span>
      </div>
    </div>
  );
}

function IconButton({ emoji, label, color, onClick }: { emoji: string; label: string; color: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl border ${color} active:scale-95 transition-all`}
    >
      <span className="text-base">{emoji}</span>
      <span className={`text-[10px] font-semibold uppercase tracking-widest ${color.includes("purple") ? "text-purple-300" : color.includes("yellow") ? "text-yellow-300" : color.includes("cyan") ? "text-cyan-300" : "text-white/60"}`}>
        {label}
      </span>
    </button>
  );
}

export function TopBar({
  onOpenGacha,
  onOpenPrestige,
  onOpenAuth,
  onOpenLeaderboard,
}: {
  onOpenGacha: () => void;
  onOpenPrestige: () => void;
  onOpenAuth: () => void;
  onOpenLeaderboard: () => void;
}) {
  const gold = useGameStore((s) => s.gold);
  const gems = useGameStore((s) => s.gems);
  const clickDmgLevel = useGameStore((s) => s.upgrades.clickDamage);
  const clickTalent = useGameStore((s) => s.talents.click_power ?? 0);
  const dmg = clickDamage(clickDmgLevel, clickTalent);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const username = user?.email?.split("@")[0];

  return (
    <div
      className="flex items-center justify-between px-4 py-3 shrink-0 gap-2"
      style={{ background: "linear-gradient(90deg, #1a0533 0%, #0d1f3c 40%, #1a0533 100%)" }}
    >
      {/* Left — gold + auth */}
      <div className="flex items-center gap-3">
        <StatPill icon="🪙" label="Oro" value={fmtNum(gold)} color="text-yellow-300" />
        <button
          onClick={user ? onOpenAuth : onOpenAuth}
          className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 active:scale-95 transition-all"
          title={user ? `${user.email}` : "Iniciar sesión"}
        >
          <span className="text-base">{user ? "🧙" : "👤"}</span>
          <span className="text-white/40 text-[10px] font-semibold uppercase tracking-widest truncate max-w-12">
            {username ?? "Login"}
          </span>
        </button>
        <button
          onClick={onOpenLeaderboard}
          className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl border border-yellow-500/30 bg-yellow-500/5 hover:bg-yellow-500/10 active:scale-95 transition-all"
        >
          <span className="text-base">🏆</span>
          <span className="text-yellow-400/60 text-[10px] font-semibold uppercase tracking-widest">Ranking</span>
        </button>
      </div>

      {/* Center — click damage */}
      <div className="flex flex-col items-center gap-1 shrink-0">
        <span className="text-white/30 text-[10px] uppercase tracking-widest">Daño / Click</span>
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10">
          <span className="text-base">⚔️</span>
          <span className="text-orange-300 font-bold text-2xl tabular-nums leading-none">{fmtNum(dmg)}</span>
        </div>
      </div>

      {/* Right — gems + gacha + prestige */}
      <div className="flex items-center gap-2">
        <StatPill icon="💎" label="Gemas" value={gems} color="text-cyan-300" />
        <IconButton emoji="🪄" label="Invocar" color="border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20" onClick={onOpenGacha} />
        <IconButton emoji="🔮" label="Ascender" color="border-yellow-500/40 bg-yellow-500/10 hover:bg-yellow-500/20" onClick={onOpenPrestige} />
      </div>
    </div>
  );
}
