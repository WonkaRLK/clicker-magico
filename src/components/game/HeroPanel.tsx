"use client";

import { useGameStore, computeTotalDps } from "@/lib/store/gameStore";
import { HEROES } from "@/lib/data/heroes";
import { fmtNum } from "@/lib/game/formulas";
import { HeroCard } from "./HeroCard";

export function HeroPanel() {
  const state = useGameStore((s) => s);
  const totalDps = computeTotalDps(state);

  // Show hero if: it's the first, it's already unlocked (gacha), or the previous is unlocked
  const visibleHeroes = HEROES.filter((hero, i) => {
    if (i === 0) return true;
    if (state.unlockedHeroes[hero.id]) return true;
    const prev = HEROES[i - 1];
    return !!state.unlockedHeroes[prev.id];
  });

  return (
    <div className="flex flex-col gap-2 h-full overflow-y-auto">
      <div className="flex items-center justify-between px-1">
        <span className="text-white/40 text-[10px] uppercase tracking-widest">DPS Total</span>
        <span className="text-purple-300 font-bold text-sm">{fmtNum(totalDps)}/s</span>
      </div>
      {visibleHeroes.map((hero) => (
        <HeroCard key={hero.id} hero={hero} />
      ))}
    </div>
  );
}
