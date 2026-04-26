"use client";

import { useGameStore } from "@/lib/store/gameStore";
import {
  clickDamage, clickUpgradeCost,
  critChancePercent, critChanceUpgradeCost,
  critMultiplierValue, critMultUpgradeCost,
  goldBonusMultiplier, goldBonusUpgradeCost,
  autoClickRate, autoClickCost,
  fmtNum,
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
      className={`w-full text-left rounded-xl border p-3 transition-all ${
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
        <span className={`text-xs font-bold ${canAfford ? "text-yellow-300" : "text-white/30"}`}>
          🪙 {fmtNum(cost)}
        </span>
      </div>
    </button>
  );
}

export function UpgradeShop() {
  const gold = useGameStore((s) => s.gold);
  const upgrades = useGameStore((s) => s.upgrades);
  const clickTalent = useGameStore((s) => s.talents.click_power ?? 0);
  const buyClickUpgrade = useGameStore((s) => s.buyClickUpgrade);
  const buyCritChance = useGameStore((s) => s.buyCritChance);
  const buyCritMult = useGameStore((s) => s.buyCritMult);
  const buyGoldBonus = useGameStore((s) => s.buyGoldBonus);
  const buyAutoClick = useGameStore((s) => s.buyAutoClick);

  const lvClick = upgrades.clickDamage;
  const lvCrit = upgrades.critChance;
  const lvCritM = upgrades.critMultiplier;
  const lvGold = upgrades.goldBonus;
  const lvAuto = upgrades.autoClick;

  return (
    <div className="flex flex-col gap-2">
      <UpgradeCard
        icon="⚔️" name="Daño de Click"
        level={lvClick}
        current={`${fmtNum(clickDamage(lvClick, clickTalent))} dmg`}
        next={`${fmtNum(clickDamage(lvClick + 1, clickTalent))} dmg`}
        cost={clickUpgradeCost(lvClick)}
        canAfford={gold >= clickUpgradeCost(lvClick)}
        onBuy={buyClickUpgrade}
      />
      <UpgradeCard
        icon="🖱️" name="Auto-Click"
        level={lvAuto}
        current={lvAuto === 0 ? "inactivo" : `${autoClickRate(lvAuto).toFixed(1)}/s`}
        next={`${autoClickRate(lvAuto + 1).toFixed(1)}/s`}
        cost={autoClickCost(lvAuto)}
        canAfford={gold >= autoClickCost(lvAuto)}
        onBuy={buyAutoClick}
      />
      <UpgradeCard
        icon="🎯" name="Prob. Crítico"
        level={lvCrit}
        current={`${critChancePercent(lvCrit)}%`}
        next={`${critChancePercent(lvCrit + 1)}%`}
        cost={critChanceUpgradeCost(lvCrit)}
        canAfford={gold >= critChanceUpgradeCost(lvCrit)}
        onBuy={buyCritChance}
      />
      <UpgradeCard
        icon="💥" name="Mult. Crítico"
        level={lvCritM}
        current={`${critMultiplierValue(lvCritM).toFixed(2)}x`}
        next={`${critMultiplierValue(lvCritM + 1).toFixed(2)}x`}
        cost={critMultUpgradeCost(lvCritM)}
        canAfford={gold >= critMultUpgradeCost(lvCritM)}
        onBuy={buyCritMult}
      />
      <UpgradeCard
        icon="💰" name="Bonus de Oro"
        level={lvGold}
        current={`+${((goldBonusMultiplier(lvGold) - 1) * 100).toFixed(0)}%`}
        next={`+${((goldBonusMultiplier(lvGold + 1) - 1) * 100).toFixed(0)}%`}
        cost={goldBonusUpgradeCost(lvGold)}
        canAfford={gold >= goldBonusUpgradeCost(lvGold)}
        onBuy={buyGoldBonus}
      />
    </div>
  );
}
