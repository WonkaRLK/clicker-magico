"use client";

import { useGameStore, computeTotalDps } from "@/lib/store/gameStore";
import { HEROES } from "@/lib/data/heroes";
import { HeroCard } from "./HeroCard";

function fmtDps(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toFixed(1);
}

export function HeroPanel() {
  const state = useGameStore((s) => s);
  const totalDps = computeTotalDps(state);

  return (
    <div className="flex flex-col gap-2 h-full overflow-y-auto">
      <div className="flex items-center justify-between px-1">
        <span className="text-white/40 text-[10px] uppercase tracking-widest">DPS Total</span>
        <span className="text-purple-300 font-bold text-sm">{fmtDps(totalDps)}/s</span>
      </div>
      {HEROES.map((hero) => (
        <HeroCard key={hero.id} hero={hero} />
      ))}
    </div>
  );
}
