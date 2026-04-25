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
      className="flex flex-row flex-1 w-full min-h-0"
      style={{
        background: `linear-gradient(135deg, ${zone.colorFrom} 0%, ${zone.colorTo} 100%)`,
      }}
    >
      {/* Left panel — upgrades */}
      <div className="w-64 shrink-0 flex flex-col gap-2 p-3 bg-black/20 overflow-y-auto">
        <p className="text-white/40 text-xs font-semibold uppercase tracking-widest px-1 pt-1">
          Mejoras
        </p>
        <UpgradeShop />
      </div>

      {/* Center — enemy */}
      <div className="flex-1 flex items-center justify-center">
        <Enemy />
      </div>

      {/* Right panel — heroes (Fase 2) */}
      <div className="w-64 shrink-0 flex flex-col gap-2 p-3 bg-black/20">
        <p className="text-white/40 text-xs font-semibold uppercase tracking-widest px-1 pt-1">
          Héroes
        </p>
        <div className="text-white/20 text-xs px-1">Fase 2</div>
      </div>
    </div>
  );
}
