"use client";

import { AnimatePresence, motion } from "framer-motion";
import { DamageNumber } from "@/types/game";

type Props = {
  numbers: DamageNumber[];
};

export function DamageNumbers({ numbers }: Props) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {numbers.map((n) => (
          <motion.span
            key={n.id}
            className={`absolute font-bold select-none ${
              n.isCrit ? "text-orange-400 text-2xl" : "text-yellow-300 text-lg"
            }`}
            style={{ left: n.x, top: n.y }}
            initial={{ opacity: 1, y: 0, scale: n.isCrit ? 1.4 : 1 }}
            animate={{ opacity: 0, y: -60, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {n.isCrit ? `✦ ${n.value}` : n.value}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
