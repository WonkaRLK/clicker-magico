"use client";

import { useGameStore } from "@/lib/store/gameStore";
import { clickDamage, clickUpgradeCost } from "@/lib/game/formulas";

export function UpgradeShop() {
  const gold = useGameStore((s) => s.gold);
  const level = useGameStore((s) => s.upgrades.clickDamage);
  const buyClickUpgrade = useGameStore((s) => s.buyClickUpgrade);

  const cost = clickUpgradeCost(level);
  const nextDamage = clickDamage(level + 1);
  const canAfford = gold >= cost;

  return (
    <div className="w-full max-w-xs mx-auto px-4 pb-6">
      <button
        onClick={buyClickUpgrade}
        disabled={!canAfford}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
          canAfford
            ? "border-yellow-500/50 bg-yellow-500/10 hover:bg-yellow-500/20 active:scale-95 cursor-pointer"
            : "border-white/10 bg-white/5 opacity-50 cursor-not-allowed"
        }`}
      >
        <div className="flex flex-col items-start">
          <span className="text-white font-semibold text-sm">⚔️ Daño de Click</span>
          <span className="text-white/40 text-xs">
            Nivel {level} → {level + 1} · {clickDamage(level)} → {nextDamage} dmg
          </span>
        </div>
        <div className={`flex items-center gap-1 font-bold text-sm ${canAfford ? "text-yellow-300" : "text-white/40"}`}>
          <span>🪙</span>
          <span>{cost.toLocaleString()}</span>
        </div>
      </button>
    </div>
  );
}
