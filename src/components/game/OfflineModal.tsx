"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/store/gameStore";
import { fmtNum } from "@/lib/game/formulas";

export function OfflineModal() {
  const offlineEarnings = useGameStore((s) => s.offlineEarnings);
  const dismissOffline = useGameStore((s) => s.dismissOffline);

  return (
    <AnimatePresence>
      {offlineEarnings > 0 && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-xs rounded-2xl border border-yellow-500/30 bg-[#120924] p-6 shadow-2xl text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
          >
            <div className="text-5xl mb-3">🌙</div>
            <h2 className="text-white font-bold text-lg mb-1">¡Bienvenido de vuelta!</h2>
            <p className="text-white/50 text-sm mb-4">Tus héroes trabajaron mientras no estabas.</p>

            <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/20 py-4 px-6 mb-5">
              <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Oro ganado</p>
              <p className="text-yellow-300 font-bold text-3xl">+{fmtNum(offlineEarnings)} 🪙</p>
            </div>

            <button
              onClick={dismissOffline}
              className="w-full py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 active:scale-95 text-black font-bold transition-all"
            >
              ¡Gracias!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
