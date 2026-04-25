"use client";

import { useGameStore } from "@/lib/store/gameStore";
import { clickDamage } from "@/lib/game/formulas";

export function TopBar() {
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
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-8 border-b border-white/10" style={{ background: "linear-gradient(90deg, #1a0533 0%, #0d1f3c 40%, #1a0533 100%)" }}>
      <div className="flex items-center gap-1.5">
        <span className="text-yellow-400 text-lg">🪙</span>
        <span className="text-yellow-300 font-bold text-sm tabular-nums">
          {goldDisplay}
        </span>
      </div>

      <div className="flex items-center gap-3 text-sm">
        <span className="text-white/40 text-xs">DMG por click</span>
        <span className="text-orange-300 font-bold tabular-nums">{dmg}</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-cyan-400 text-lg">💎</span>
        <span className="text-cyan-300 font-bold text-sm tabular-nums">{gems}</span>
      </div>
    </div>
  );
}
