"use client";

import { useGameStore } from "@/lib/store/gameStore";
import { getZoneForArena } from "@/lib/data/zones";
import { Enemy } from "./Enemy";

export function Arena() {
  const currentZone = useGameStore((s) => s.currentZone);
  const zone = getZoneForArena(currentZone);

  return (
    <div
      className="flex flex-col items-center justify-center flex-1 w-full min-h-0 px-4 py-8"
      style={{
        background: `linear-gradient(180deg, ${zone.colorFrom} 0%, ${zone.colorTo} 100%)`,
      }}
    >
      <Enemy />
    </div>
  );
}
