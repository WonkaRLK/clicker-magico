"use client";

import { useGameStore } from "@/lib/store/gameStore";
import { heroDps, heroLevelCost } from "@/lib/game/formulas";
import { HeroDefinition, RARITY_MULTIPLIER, RARITY_COLOR, RARITY_LABEL } from "@/lib/data/heroes";

type Props = { hero: HeroDefinition };

function fmt(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(Math.floor(n));
}

function fmtDps(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toFixed(1);
}

export function HeroCard({ hero }: Props) {
  const gold = useGameStore((s) => s.gold);
  const heroState = useGameStore((s) => s.unlockedHeroes[hero.id]);
  const unlockHero = useGameStore((s) => s.unlockHero);
  const levelUpHero = useGameStore((s) => s.levelUpHero);

  const isUnlocked = !!heroState;
  const level = heroState?.level ?? 0;
  const rarityMult = RARITY_MULTIPLIER[hero.rarity];
  const currentDps = heroDps(level, hero.baseDps, rarityMult);
  const nextDps = heroDps(level + 1, hero.baseDps, rarityMult);
  const cost = isUnlocked ? heroLevelCost(level, hero.levelCost) : hero.unlockCost;
  const canAfford = gold >= cost;
  const colorClass = RARITY_COLOR[hero.rarity];

  return (
    <div className={`rounded-lg border p-2.5 transition-all ${colorClass} bg-black/20`}>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-xl">{hero.emoji}</span>
          <div>
            <p className="text-white text-xs font-semibold leading-tight">{hero.name}</p>
            <p className={`text-[10px] font-medium ${colorClass.split(" ")[0]}`}>
              {RARITY_LABEL[hero.rarity]}
            </p>
          </div>
        </div>
        {isUnlocked && (
          <span className="text-white/30 text-[10px]">Nv.{level}</span>
        )}
      </div>

      {isUnlocked ? (
        <div className="flex items-center justify-between">
          <span className="text-white/50 text-[10px]">
            {fmtDps(currentDps)} → <span className="text-white/80">{fmtDps(nextDps)}</span> DPS
          </span>
          <button
            onClick={() => levelUpHero(hero.id)}
            disabled={!canAfford}
            className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full transition-all ${
              canAfford
                ? "bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 active:scale-95 cursor-pointer"
                : "bg-white/5 text-white/20 cursor-not-allowed"
            }`}
          >
            🪙 {fmt(cost)}
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <span className="text-white/30 text-[10px]">
            DPS: {fmtDps(heroDps(1, hero.baseDps, rarityMult))}
          </span>
          <button
            onClick={() => unlockHero(hero.id)}
            disabled={!canAfford}
            className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full transition-all ${
              canAfford
                ? "bg-green-500/20 text-green-300 hover:bg-green-500/30 active:scale-95 cursor-pointer"
                : "bg-white/5 text-white/20 cursor-not-allowed"
            }`}
          >
            🔓 {fmt(cost)}
          </button>
        </div>
      )}
    </div>
  );
}
