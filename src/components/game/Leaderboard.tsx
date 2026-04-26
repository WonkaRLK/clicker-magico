"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchLeaderboard, LeaderboardEntry } from "@/lib/supabase/cloudSave";
import { fmtNum } from "@/lib/game/formulas";

const MEDALS = ["🥇", "🥈", "🥉"];

export function Leaderboard({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await fetchLeaderboard();
    setEntries(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isOpen) load();
  }, [isOpen, load]);

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
            className="w-full max-w-md rounded-2xl border border-yellow-500/30 bg-[#120924] p-6 shadow-2xl max-h-[85dvh] flex flex-col"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 shrink-0">
              <h2 className="text-white font-bold text-xl">🏆 Ranking Global</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={load}
                  disabled={loading}
                  className="text-white/40 hover:text-white text-sm transition-colors disabled:opacity-30"
                >
                  {loading ? "⏳" : "↻"}
                </button>
                <button onClick={onClose} className="text-white/40 hover:text-white text-xl leading-none">✕</button>
              </div>
            </div>

            {/* Column headers */}
            <div className="grid grid-cols-[2rem_1fr_5rem_4rem] gap-2 px-2 mb-2 shrink-0">
              <span className="text-white/30 text-[10px] uppercase">#</span>
              <span className="text-white/30 text-[10px] uppercase">Mago</span>
              <span className="text-white/30 text-[10px] uppercase text-right">Arena</span>
              <span className="text-white/30 text-[10px] uppercase text-right">Prestig.</span>
            </div>

            {/* Entries */}
            <div className="overflow-y-auto flex-1 flex flex-col gap-1.5">
              {loading && entries.length === 0 && (
                <div className="flex items-center justify-center flex-1">
                  <span className="text-white/30 text-sm animate-pulse">Cargando ranking...</span>
                </div>
              )}
              {!loading && entries.length === 0 && (
                <div className="flex flex-col items-center justify-center flex-1 gap-2">
                  <span className="text-4xl">🪄</span>
                  <span className="text-white/30 text-sm">Nadie en el ranking todavía.</span>
                  <span className="text-white/20 text-xs">¡Sé el primero en aparecer!</span>
                </div>
              )}
              {entries.map((entry, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-[2rem_1fr_5rem_4rem] gap-2 items-center px-3 py-2 rounded-xl ${
                    i === 0 ? "bg-yellow-500/10 border border-yellow-500/20"
                    : i === 1 ? "bg-white/5 border border-white/10"
                    : i === 2 ? "bg-orange-500/5 border border-orange-500/10"
                    : "bg-black/20 border border-white/5"
                  }`}
                >
                  <span className="text-base text-center">{MEDALS[i] ?? `${i + 1}`}</span>
                  <span className="text-white text-sm font-semibold truncate">{entry.username}</span>
                  <span className="text-purple-300 font-bold tabular-nums text-sm text-right">
                    {fmtNum(entry.highest_zone)}
                  </span>
                  <span className="text-yellow-400/70 text-xs tabular-nums text-right">
                    {entry.total_prestiges}×
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
