"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/store/gameStore";
import { DamageNumbers } from "./DamageNumbers";
import { DamageNumber } from "@/types/game";
import { getZoneForArena } from "@/lib/data/zones";

const ENEMY_EMOJIS: Record<string, string[]> = {
  "Bosque Encantado": ["🐺", "🌿", "🦊", "🍄", "🌑"],
  "Cuevas Cristalinas": ["💠", "🪨", "🔮", "🦎", "⚗️"],
  "Catacumbas Profanas": ["💀", "👻", "🦴", "🕷️", "⚰️"],
  "Cumbre Tormentosa": ["⚡", "🦅", "🌩️", "🌪️", "🐉"],
  "Plano Astral": ["👁️", "🌀", "✨", "🌌", "🔯"],
};

let idCounter = 0;

export function Enemy() {
  const currentZone = useGameStore((s) => s.currentZone);
  const currentEnemyHp = useGameStore((s) => s.currentEnemyHp);
  const currentEnemyMaxHp = useGameStore((s) => s.currentEnemyMaxHp);
  const enemiesKilledInZone = useGameStore((s) => s.enemiesKilledInZone);
  const clickEnemy = useGameStore((s) => s.clickEnemy);

  const [damageNums, setDamageNums] = useState<DamageNumber[]>([]);
  const [shaking, setShaking] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const zone = getZoneForArena(currentZone);
  const emojis = ENEMY_EMOJIS[zone.name] ?? ["👾"];
  const enemyEmoji = emojis[enemiesKilledInZone % emojis.length];
  const hpPercent = Math.max(0, (currentEnemyHp / currentEnemyMaxHp) * 100);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const { damage, isCrit } = clickEnemy();

      const rect = containerRef.current?.getBoundingClientRect();
      const x = rect ? e.clientX - rect.left - 20 : 50;
      const y = rect ? e.clientY - rect.top - 20 : 50;

      const num: DamageNumber = {
        id: ++idCounter,
        value: damage,
        x,
        y,
        isCrit,
      };
      setDamageNums((prev) => [...prev.slice(-12), num]);

      // Shake animation
      setShaking(true);
      setTimeout(() => setShaking(false), 150);

      // Cleanup old numbers
      setTimeout(() => {
        setDamageNums((prev) => prev.filter((n) => n.id !== num.id));
      }, 900);
    },
    [clickEnemy]
  );

  const hpBarColor =
    hpPercent > 50 ? "bg-green-500" : hpPercent > 25 ? "bg-yellow-500" : "bg-red-500";

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-xs mx-auto">
      {/* Zone + arena label */}
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-white/80 text-sm font-semibold">
          {zone.emoji} {zone.name}
        </span>
        <span className="text-white/40 text-xs">Arena {currentZone}</span>
      </div>

      {/* HP bar */}
      <div className="w-full">
        <div className="flex justify-between text-xs text-white/60 mb-1 px-1">
          <span>HP</span>
          <span>
            {Math.ceil(currentEnemyHp).toLocaleString()} /{" "}
            {Math.ceil(currentEnemyMaxHp).toLocaleString()}
          </span>
        </div>
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/10">
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
            key={`${currentZone}-${enemiesKilledInZone}`}
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.div
              animate={shaking ? { x: [-4, 4, -3, 3, 0] } : {}}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center rounded-full bg-white/5 border-2 border-white/10 hover:bg-white/10 hover:scale-105 active:scale-95 transition-colors"
              style={{ width: 160, height: 160, fontSize: 80 }}
            >
              {enemyEmoji}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress in zone */}
      <div className="text-white/40 text-xs">
        Enemigo {enemiesKilledInZone + 1} / 10 en arena {currentZone}
      </div>
    </div>
  );
}
