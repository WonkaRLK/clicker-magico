"use client";

import { useGameStore } from "@/lib/store/gameStore";
import { clickDamage } from "@/lib/game/formulas";

function StatPill({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: string | number;
  color: string;
}) {
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

export function TopBar({ onOpenGacha, onOpenPrestige }: { onOpenGacha: () => void; onOpenPrestige: () => void }) {
  const gold = useGameStore((s) => s.gold);
  const gems = useGameStore((s) => s.gems);
  const clickDmgLevel = useGameStore((s) => s.upgrades.clickDamage);
  const dmg = clickDamage(clickDmgLevel);

  const goldDisplay =
    gold >= 1_000_000
      ? `${(gold / 1_000_000).toFixed(2)}M`
      : gold >= 1_000
      ? `${(gold / 1_000).toFixed(1)}k`
      : Math.floor(gold).toString();

  return (
    <div
      className="flex items-center justify-between px-8 py-4 shrink-0"
      style={{ background: "linear-gradient(90deg, #1a0533 0%, #0d1f3c 40%, #1a0533 100%)" }}
    >
      <StatPill icon="🪙" label="Oro" value={goldDisplay} color="text-yellow-300" />

      {/* Center — click damage */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-white/30 text-[10px] uppercase tracking-widest">Daño por Click</span>
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10">
          <span className="text-base">⚔️</span>
          <span className="text-orange-300 font-bold text-2xl tabular-nums leading-none">{dmg}</span>
        </div>
      </div>

      {/* Right — gems + action buttons */}
      <div className="flex items-center gap-2">
        <StatPill icon="💎" label="Gemas" value={gems} color="text-cyan-300" />
        <button
          onClick={onOpenGacha}
          className="flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 active:scale-95 transition-all"
        >
          <span className="text-base">🪄</span>
          <span className="text-purple-300 text-[10px] font-semibold uppercase tracking-widest">Invocar</span>
        </button>
        <button
          onClick={onOpenPrestige}
          className="flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl border border-yellow-500/40 bg-yellow-500/10 hover:bg-yellow-500/20 active:scale-95 transition-all"
        >
          <span className="text-base">🔮</span>
          <span className="text-yellow-300 text-[10px] font-semibold uppercase tracking-widest">Ascender</span>
        </button>
      </div>
    </div>
  );
}
