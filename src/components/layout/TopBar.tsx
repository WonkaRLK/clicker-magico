"use client";

import { useGameStore } from "@/lib/store/gameStore";
import { getZoneForArena } from "@/lib/data/zones";

export function TopBar() {
  const gold = useGameStore((s) => s.gold);
  const currentZone = useGameStore((s) => s.currentZone);
  const zone = getZoneForArena(currentZone);

  const goldDisplay =
    gold >= 1_000_000
      ? `${(gold / 1_000_000).toFixed(2)}M`
      : gold >= 1_000
      ? `${(gold / 1_000).toFixed(1)}k`
      : Math.floor(gold).toString();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 bg-black/70 backdrop-blur border-b border-yellow-900/40">
      <div className="flex items-center gap-1.5">
        <span className="text-yellow-400 text-lg">🪙</span>
        <span className="text-yellow-300 font-bold text-sm tabular-nums">
          {goldDisplay}
        </span>
      </div>

      <div className="flex flex-col items-center">
        <span className="text-purple-300 text-xs font-semibold">
          {zone.emoji} {zone.name}
        </span>
        <span className="text-white/60 text-xs">Arena {currentZone}</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-cyan-400 text-lg">💎</span>
        <span className="text-cyan-300 font-bold text-sm tabular-nums">
          {useGameStore((s) => s.gems)}
        </span>
      </div>
    </div>
  );
}
