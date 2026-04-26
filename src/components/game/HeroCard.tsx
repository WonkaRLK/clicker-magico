"use client";

import { useGameStore } from "@/lib/store/gameStore";
import { heroDps, heroLevelCost, heroUnlockCost, talentHeroDiscount, fmtNum } from "@/lib/game/formulas";
import { HeroDefinition, RARITY_MULTIPLIER, RARITY_COLOR, RARITY_LABEL } from "@/lib/data/heroes";

type Props = { hero: HeroDefinition };

export function HeroCard({ hero }: Props) {
  const gold = useGameStore((s) => s.gold);
  const heroState = useGameStore((s) => s.unlockedHeroes[hero.id]);
  const discountLevel = useGameStore((s) => s.talents.hero_discount ?? 0);
  const unlockHero = useGameStore((s) => s.unlockHero);
  const levelUpHero = useGameStore((s) => s.levelUpHero);
  const levelUpHeroN = useGameStore((s) => s.levelUpHeroN);

  const isUnlocked = !!heroState;
  const level = heroState?.level ?? 0;
  const rarityMult = RARITY_MULTIPLIER[hero.rarity];
  const discount = talentHeroDiscount(discountLevel);
  const currentDps = heroDps(level, hero.baseDps, rarityMult);
  const nextDps = heroDps(level + 1, hero.baseDps, rarityMult);
  const cost1 = isUnlocked ? heroLevelCost(level, hero.levelCost, discount) : heroUnlockCost(hero.unlockCost, discount);

  // Compute x10 cost (sum of next 10 levels)
  const cost10 = isUnlocked ? Array.from({ length: 10 }, (_, i) =>
    heroLevelCost(level + i, hero.levelCost, discount)
  ).reduce((a, b) => a + b, 0) : 0;

  const [textClass, borderClass] = RARITY_COLOR[hero.rarity].split(" ");

  return (
    <div className={`rounded-xl border p-3 bg-black/20 ${borderClass} transition-all`}>
      {/* Header row */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{hero.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="text-white text-xs font-bold leading-tight truncate">{hero.name}</p>
          <p className={`text-[10px] font-medium ${textClass}`}>{RARITY_LABEL[hero.rarity]}</p>
        </div>
        {isUnlocked && (
          <span className={`text-xs font-bold tabular-nums ${textClass}`}>Nv.{level}</span>
        )}
      </div>

      {/* DPS row */}
      {isUnlocked ? (
        <div className="flex items-baseline gap-1 mb-2">
          {hero.baseDps === 0 ? (
            <span className="text-white/40 text-[10px]">Solo daño por click</span>
          ) : (
            <>
              <span className={`font-bold text-sm tabular-nums ${textClass}`}>{fmtNum(currentDps)}</span>
              <span className="text-white/30 text-[10px]">→ {fmtNum(nextDps)} DPS</span>
            </>
          )}
        </div>
      ) : (
        <div className="mb-2">
          {hero.baseDps === 0 ? (
            <span className="text-white/40 text-[10px]">Mejora daño por click</span>
          ) : (
            <span className="text-white/40 text-[10px]">DPS: {fmtNum(heroDps(1, hero.baseDps, rarityMult))}</span>
          )}
        </div>
      )}

      {/* Action buttons */}
      {isUnlocked ? (
        <div className="flex gap-1">
          <button
            onClick={() => levelUpHero(hero.id)}
            disabled={gold < cost1}
            className={`flex-1 flex items-center justify-center gap-1 text-[10px] font-bold py-1 rounded-lg transition-all ${
              gold >= cost1
                ? "bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 active:scale-95 cursor-pointer"
                : "bg-white/5 text-white/20 cursor-not-allowed"
            }`}
          >
            +1 🪙{fmtNum(cost1)}
          </button>
          <button
            onClick={() => levelUpHeroN(hero.id, 10)}
            disabled={gold < cost1}
            className={`flex-[1.2] flex items-center justify-center gap-1 text-[10px] font-bold py-1 rounded-lg transition-all ${
              gold >= cost10
                ? "bg-yellow-500/30 text-yellow-200 hover:bg-yellow-500/40 active:scale-95 cursor-pointer border border-yellow-400/20"
                : gold >= cost1
                ? "bg-white/5 text-white/30 cursor-not-allowed"
                : "bg-white/5 text-white/20 cursor-not-allowed"
            }`}
          >
            ×10 🪙{fmtNum(cost10)}
          </button>
        </div>
      ) : (
        <button
          onClick={() => unlockHero(hero.id)}
          disabled={gold < cost1}
          className={`w-full flex items-center justify-center gap-1 text-[10px] font-bold py-1.5 rounded-lg transition-all ${
            gold >= cost1
              ? "bg-green-500/20 text-green-300 hover:bg-green-500/30 active:scale-95 cursor-pointer"
              : "bg-white/5 text-white/20 cursor-not-allowed"
          }`}
        >
          🔓 Desbloquear — 🪙{fmtNum(cost1)}
        </button>
      )}
    </div>
  );
}
