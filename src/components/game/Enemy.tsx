"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/store/gameStore";
import { DamageNumbers } from "./DamageNumbers";
import { BossTimer } from "./BossTimer";
import { DamageNumber } from "@/types/game";
import { getZoneForArena } from "@/lib/data/zones";
import { isBossZone } from "@/lib/game/formulas";

const ENEMY_EMOJIS: Record<string, string[]> = {
  "Bosque Encantado": ["🐺", "🌿", "🦊", "🍄", "🌑"],
  "Cuevas Cristalinas": ["💠", "🪨", "🔮", "🦎", "⚗️"],
  "Catacumbas Profanas": ["💀", "👻", "🦴", "🕷️", "⚰️"],
  "Cumbre Tormentosa": ["⚡", "🦅", "🌩️", "🌪️", "🐉"],
  "Plano Astral": ["👁️", "🌀", "✨", "🌌", "🔯"],
};

const BOSS_EMOJIS: Record<string, string> = {
  "Bosque Encantado": "🌳",
  "Cuevas Cristalinas": "💎",
  "Catacumbas Profanas": "💀",
  "Cumbre Tormentosa": "🐉",
  "Plano Astral": "🌀",
};

let idCounter = 0;

export function Enemy() {
  const currentZone = useGameStore((s) => s.currentZone);
  const currentEnemyHp = useGameStore((s) => s.currentEnemyHp);
  const currentEnemyMaxHp = useGameStore((s) => s.currentEnemyMaxHp);
  const enemiesKilledInZone = useGameStore((s) => s.enemiesKilledInZone);
  const inBossFight = useGameStore((s) => s.inBossFight);
  const clickEnemy = useGameStore((s) => s.clickEnemy);
  const goToZone = useGameStore((s) => s.goToZone);
  const highestZone = useGameStore((s) => s.highestZone);

  const [damageNums, setDamageNums] = useState<DamageNumber[]>([]);
  const [shaking, setShaking] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const zone = getZoneForArena(currentZone);
  const isBoss = isBossZone(currentZone);
  const emojis = ENEMY_EMOJIS[zone.name] ?? ["👾"];
  const enemyEmoji = isBoss
    ? BOSS_EMOJIS[zone.name] ?? "👹"
    : emojis[enemiesKilledInZone % emojis.length];

  const hpPercent = Math.max(0, (currentEnemyHp / currentEnemyMaxHp) * 100);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const { damage, isCrit } = clickEnemy();

      const rect = containerRef.current?.getBoundingClientRect();
      const x = rect ? e.clientX - rect.left - 20 : 50;
      const y = rect ? e.clientY - rect.top - 20 : 50;

      const num: DamageNumber = { id: ++idCounter, value: damage, x, y, isCrit };
      setDamageNums((prev) => [...prev.slice(-12), num]);
      setShaking(true);
      setTimeout(() => setShaking(false), 150);
      setTimeout(() => setDamageNums((prev) => prev.filter((n) => n.id !== num.id)), 900);
    },
    [clickEnemy]
  );

  const hpBarColor = isBoss
    ? "bg-orange-500"
    : hpPercent > 50 ? "bg-green-500" : hpPercent > 25 ? "bg-yellow-500" : "bg-red-500";

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-xs mx-auto">
      {/* Zone + arena label + navigation */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-white/80 text-sm font-semibold">
          {zone.emoji} {zone.name}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => goToZone(currentZone - 1)}
            disabled={currentZone <= 1}
            className="text-white/50 hover:text-white disabled:opacity-20 transition-colors w-6 h-6 flex items-center justify-center rounded hover:bg-white/10"
          >
            ◀
          </button>
          <span className={`text-xs font-bold tabular-nums min-w-20 text-center ${isBoss ? "text-orange-300" : "text-white/40"}`}>
            {isBoss ? "⚔️ BOSS " : ""}Arena {currentZone}
          </span>
          <button
            onClick={() => goToZone(currentZone + 1)}
            disabled={currentZone >= highestZone}
            className="text-white/50 hover:text-white disabled:opacity-20 transition-colors w-6 h-6 flex items-center justify-center rounded hover:bg-white/10"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Boss timer */}
      <BossTimer />

      {/* HP bar */}
      <div className="w-full">
        <div className="flex justify-between text-xs text-white/60 mb-1 px-1">
          <span>HP</span>
          <span>
            {Math.ceil(currentEnemyHp).toLocaleString()} /{" "}
            {Math.ceil(currentEnemyMaxHp).toLocaleString()}
          </span>
        </div>
        <div className={`w-full h-3 bg-white/10 rounded-full overflow-hidden border ${isBoss ? "border-orange-500/30" : "border-white/10"}`}>
          <motion.div
            className={`h-full rounded-full ${hpBarColor} transition-colors duration-300`}
            animate={{ width: `${hpPercent}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>

      {/* Enemy clickable area */}
      <div
        ref={containerRef}
        className="relative flex items-center justify-center cursor-pointer select-none"
        style={{ width: 180, height: 180 }}
        onClick={handleClick}
      >
        <DamageNumbers numbers={damageNums} />

        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentZone}-${enemiesKilledInZone}-${inBossFight}`}
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.div
              animate={shaking ? { x: [-4, 4, -3, 3, 0] } : {}}
              transition={{ duration: 0.15 }}
              className={`flex items-center justify-center rounded-full border-2 hover:scale-105 active:scale-95 transition-colors ${
                isBoss
                  ? "bg-orange-500/10 border-orange-500/40 hover:bg-orange-500/20"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
              style={{ width: isBoss ? 180 : 160, height: isBoss ? 180 : 160, fontSize: isBoss ? 100 : 80 }}
            >
              {enemyEmoji}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress */}
      <div className="text-white/40 text-xs">
        {isBoss
          ? "¡Matá al boss antes de que se acabe el tiempo!"
          : `Enemigo ${enemiesKilledInZone + 1} / 10 en arena ${currentZone}`}
      </div>
    </div>
  );
}
