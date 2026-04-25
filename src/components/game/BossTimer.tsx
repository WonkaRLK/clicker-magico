"use client";

import { motion } from "framer-motion";
import { useGameStore } from "@/lib/store/gameStore";

export function BossTimer() {
  const inBossFight = useGameStore((s) => s.inBossFight);
  const bossTimer = useGameStore((s) => s.bossTimer);

  if (!inBossFight) return null;

  const pct = (bossTimer / 30) * 100;
  const isUrgent = bossTimer <= 10;

  return (
    <div className="flex flex-col items-center gap-1 w-full max-w-xs mx-auto">
      <div className="flex items-center justify-between w-full px-1">
        <span className={`text-xs font-bold ${isUrgent ? "text-red-400 animate-pulse" : "text-orange-300"}`}>
          ⚠️ BOSS
        </span>
        <span className={`text-xs font-bold tabular-nums ${isUrgent ? "text-red-400" : "text-orange-300"}`}>
          {Math.ceil(bossTimer)}s
        </span>
      </div>
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${isUrgent ? "bg-red-500" : "bg-orange-400"}`}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
    </div>
  );
}
