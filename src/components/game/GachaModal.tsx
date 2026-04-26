"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/store/gameStore";
import { HeroDefinition, RARITY_COLOR, RARITY_LABEL } from "@/lib/data/heroes";

const RATES = [
  { rarity: "common" as const,    pct: "55",  label: "Común" },
  { rarity: "rare" as const,      pct: "28",  label: "Raro" },
  { rarity: "epic" as const,      pct: "12",  label: "Épico" },
  { rarity: "legendary" as const, pct: "4.5", label: "Legendario" },
  { rarity: "mythic" as const,    pct: "0.5", label: "Mítico" },
];

function ResultCard({ hero, single }: { hero: HeroDefinition; single: boolean }) {
  const [textClass, borderClass] = RARITY_COLOR[hero.rarity].split(" ");
  return (
    <motion.div
      variants={{
        hidden: { scale: 0, opacity: 0, rotateY: 90 },
        show: { scale: 1, opacity: 1, rotateY: 0 },
      }}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}
      className={`flex flex-col items-center gap-1 p-3 rounded-xl border bg-black/40 ${borderClass}`}
    >
      <span className={single ? "text-7xl" : "text-3xl"}>{hero.emoji}</span>
      <span className={`font-bold text-center leading-tight ${single ? "text-base" : "text-[11px]"} ${textClass}`}>
        {hero.name}
      </span>
      <span className={`text-[10px] uppercase tracking-wider ${textClass} opacity-70`}>
        {RARITY_LABEL[hero.rarity]}
      </span>
    </motion.div>
  );
}

export function GachaModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const gems = useGameStore((s) => s.gems);
  const pityCounter = useGameStore((s) => s.pityCounter);
  const pullGacha = useGameStore((s) => s.pullGacha);
  const [results, setResults] = useState<HeroDefinition[] | null>(null);
  const [lastCount, setLastCount] = useState<1 | 10>(1);

  const handlePull = (count: 1 | 10) => {
    const res = pullGacha(count);
    if (res.length > 0) {
      setLastCount(count);
      setResults(res);
    }
  };

  const canPull1 = gems >= 10;
  const canPull10 = gems >= 90;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-lg rounded-2xl border border-purple-500/30 bg-[#120924] p-6 shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-xl">✨ Convocar Héroes</h2>
              <button
                onClick={onClose}
                className="text-white/40 hover:text-white text-xl leading-none transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Resources + pity */}
            <div className="flex flex-wrap items-center gap-3 mb-5 text-sm">
              <span className="text-cyan-300 font-bold">💎 {gems} gemas</span>
              <span className="text-white/30">|</span>
              <span className="text-white/50">
                Pity: <span className="text-white/80 font-semibold">{pityCounter}/50</span>
                {" → "}
                <span className="text-orange-300">Legendario garantizado</span>
              </span>
            </div>

            {results === null ? (
              <>
                {/* Rates */}
                <div className="grid grid-cols-5 gap-1.5 mb-5">
                  {RATES.map((r) => {
                    const [textClass, borderClass] = RARITY_COLOR[r.rarity].split(" ");
                    return (
                      <div
                        key={r.rarity}
                        className={`flex flex-col items-center gap-0.5 py-2 px-1 rounded-lg bg-black/30 border ${borderClass}`}
                      >
                        <span className={`text-sm font-bold ${textClass}`}>{r.pct}%</span>
                        <span className="text-white/40 text-[10px]">{r.label}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Pull buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handlePull(1)}
                    disabled={!canPull1}
                    className="flex-1 py-3 rounded-xl bg-purple-700 hover:bg-purple-600 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-white transition-all"
                  >
                    Invocar x1
                    <div className="text-sm font-normal text-purple-200 mt-0.5">10 💎</div>
                  </button>
                  <button
                    onClick={() => handlePull(10)}
                    disabled={!canPull10}
                    className="flex-1 py-3 rounded-xl bg-purple-900 hover:bg-purple-800 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-white border border-purple-400/30 transition-all"
                  >
                    Invocar x10
                    <div className="text-sm font-normal text-purple-200 mt-0.5">90 💎</div>
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Results grid */}
                <motion.div
                  className={`grid gap-2 mb-4 ${results.length === 1 ? "grid-cols-1 justify-items-center" : "grid-cols-5"}`}
                  variants={{ show: { transition: { staggerChildren: 0.06 } } }}
                  initial="hidden"
                  animate="show"
                >
                  {results.map((hero, i) => (
                    <ResultCard key={i} hero={hero} single={results.length === 1} />
                  ))}
                </motion.div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setResults(null)}
                    className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/60 text-sm transition-all"
                  >
                    ← Volver
                  </button>
                  <button
                    onClick={() => { setResults(null); handlePull(lastCount); }}
                    disabled={lastCount === 10 ? !canPull10 : !canPull1}
                    className="flex-1 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-white text-sm transition-all"
                  >
                    Invocar otra vez
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
