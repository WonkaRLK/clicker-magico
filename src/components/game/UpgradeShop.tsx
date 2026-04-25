"use client";

import { useGameStore } from "@/lib/store/gameStore";
import {
  clickDamage, clickUpgradeCost,
  critChancePercent, critChanceUpgradeCost,
  critMultiplierValue, critMultUpgradeCost,
  goldBonusMultiplier, goldBonusUpgradeCost,
} from "@/lib/game/formulas";

type UpgradeCardProps = {
  icon: string;
  name: string;
  level: number;
  current: string;
  next: string;
  cost: number;
  canAfford: boolean;
  onBuy: () => void;
};

function UpgradeCard({ icon, name, level, current, next, cost, canAfford, onBuy }: UpgradeCardProps) {
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
        <span className="text-white text-sm font-semibold">{icon} {name}</span>
        <span className="text-white/40 text-xs">Nv.{level}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-white/50 text-xs">
          {current} → <span className="text-white/80">{next}</span>
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
  const upgrades = useGameStore((s) => s.upgrades);
  const buyClickUpgrade = useGameStore((s) => s.buyClickUpgrade);
  const buyCritChance = useGameStore((s) => s.buyCritChance);
  const buyCritMult = useGameStore((s) => s.buyCritMult);
  const buyGoldBonus = useGameStore((s) => s.buyGoldBonus);

  return (
    <div className="flex flex-col gap-2">
      <UpgradeCard
        icon="⚔️" name="Daño de Click"
        level={upgrades.clickDamage}
        current={`${clickDamage(upgrades.clickDamage)} dmg`}
        next={`${clickDamage(upgrades.clickDamage + 1)} dmg`}
        cost={clickUpgradeCost(upgrades.clickDamage)}
        canAfford={gold >= clickUpgradeCost(upgrades.clickDamage)}
        onBuy={buyClickUpgrade}
      />
      <UpgradeCard
        icon="🎯" name="Prob. Crítico"
        level={upgrades.critChance}
        current={`${critChancePercent(upgrades.critChance)}%`}
        next={`${critChancePercent(upgrades.critChance + 1)}%`}
        cost={critChanceUpgradeCost(upgrades.critChance)}
        canAfford={gold >= critChanceUpgradeCost(upgrades.critChance)}
        onBuy={buyCritChance}
      />
      <UpgradeCard
        icon="💥" name="Mult. Crítico"
        level={upgrades.critMultiplier}
        current={`${critMultiplierValue(upgrades.critMultiplier).toFixed(2)}x`}
        next={`${critMultiplierValue(upgrades.critMultiplier + 1).toFixed(2)}x`}
        cost={critMultUpgradeCost(upgrades.critMultiplier)}
        canAfford={gold >= critMultUpgradeCost(upgrades.critMultiplier)}
        onBuy={buyCritMult}
      />
      <UpgradeCard
        icon="💰" name="Bonus de Oro"
        level={upgrades.goldBonus}
        current={`+${((goldBonusMultiplier(upgrades.goldBonus) - 1) * 100).toFixed(0)}%`}
        next={`+${((goldBonusMultiplier(upgrades.goldBonus + 1) - 1) * 100).toFixed(0)}%`}
        cost={goldBonusUpgradeCost(upgrades.goldBonus)}
        canAfford={gold >= goldBonusUpgradeCost(upgrades.goldBonus)}
        onBuy={buyGoldBonus}
      />
    </div>
  );
}
