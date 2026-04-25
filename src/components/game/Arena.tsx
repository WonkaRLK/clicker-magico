"use client";

import { useGameStore } from "@/lib/store/gameStore";
import { getZoneForArena } from "@/lib/data/zones";
import { Enemy } from "./Enemy";
import { UpgradeShop } from "./UpgradeShop";

export function Arena() {
  const currentZone = useGameStore((s) => s.currentZone);
  const zone = getZoneForArena(currentZone);

  return (
    <div
      className="flex flex-col items-center justify-between flex-1 w-full min-h-0 py-6"
      style={{
        background: `linear-gradient(180deg, ${zone.colorFrom} 0%, ${zone.colorTo} 100%)`,
      }}
    >
      <div className="flex-1 flex items-center justify-center w-full">
        <Enemy />
      </div>
      <UpgradeShop />
    </div>
  );
}
