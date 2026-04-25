"use client";

import { useGameStore } from "@/lib/store/gameStore";
import { clickDamage, clickUpgradeCost } from "@/lib/game/formulas";

function UpgradeCard({
  icon,
  name,
  level,
  currentVal,
  nextVal,
  cost,
  canAfford,
  onBuy,
  suffix,
}: {
  icon: string;
  name: string;
  level: number;
  currentVal: number;
  nextVal: number;
  cost: number;
  canAfford: boolean;
  onBuy: () => void;
  suffix?: string;
}) {
  return (
    <button
      onClick={onBuy}
      disabled={!canAfford}
      className={`w-full text-left rounded-lg border p-3 transition-all ${
        canAfford
          ? "border-yellow-500/40 bg-yellow-500/10 hover:bg-yellow-500/20 active:scale-95 cursor-pointer"
          : "border-white/10 bg-white/5 opacity-50 cursor-not-allowed"
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-white text-sm font-semibold">
          {icon} {name}
        </span>
        <span className="text-white/40 text-xs">Nv.{level}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-white/50 text-xs">
          {currentVal}{suffix} → <span className="text-white/80">{nextVal}{suffix}</span>
        </span>
        <span className={`flex items-center gap-0.5 text-xs font-bold ${canAfford ? "text-yellow-300" : "text-white/30"}`}>
          🪙 {cost.toLocaleString()}
        </span>
      </div>
    </button>
  );
}

export function UpgradeShop() {
  const gold = useGameStore((s) => s.gold);
  const level = useGameStore((s) => s.upgrades.clickDamage);
  const buyClickUpgrade = useGameStore((s) => s.buyClickUpgrade);

  const cost = clickUpgradeCost(level);

  return (
    <div className="flex flex-col gap-2">
      <UpgradeCard
        icon="⚔️"
        name="Daño de Click"
        level={level}
        currentVal={clickDamage(level)}
        nextVal={clickDamage(level + 1)}
        cost={cost}
        canAfford={gold >= cost}
        onBuy={buyClickUpgrade}
        suffix=" dmg"
      />
    </div>
  );
}
