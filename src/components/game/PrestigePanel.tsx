"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/store/gameStore";
import { TALENTS } from "@/lib/data/talents";
import { eternalRunesGained, PRESTIGE_MIN_ZONE, fmtNum } from "@/lib/game/formulas";

type Tab = "talentos" | "prestige";

function TalentCard({ talentId }: { talentId: string }) {
  const def = TALENTS.find((t) => t.id === talentId)!;
  const level = useGameStore((s) => s.talents[talentId] ?? 0);
  const runes = useGameStore((s) => s.eternalRunes);
  const buyTalent = useGameStore((s) => s.buyTalent);

  const maxed = level >= def.maxLevel;
  const cost = maxed ? 0 : def.costPerLevel[level];
  const canBuy = !maxed && runes >= cost;

  return (
    <div className={`flex flex-col gap-2 p-3 rounded-xl border bg-black/30 ${maxed ? "border-yellow-400/40" : "border-white/10"}`}>
      <div className="flex items-center gap-2">
        <span className="text-xl">{def.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm leading-tight">{def.name}</p>
          <p className="text-white/50 text-xs">{level > 0 ? def.description(level) : "Sin desbloquear"}</p>
        </div>
        <span className={`text-xs font-bold tabular-nums ${maxed ? "text-yellow-400" : "text-white/40"}`}>
          {level}/{def.maxLevel}
        </span>
      </div>

      <button
        onClick={() => buyTalent(talentId)}
        disabled={!canBuy}
        className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
          maxed
            ? "bg-yellow-400/10 text-yellow-400 cursor-default"
            : canBuy
            ? "bg-purple-600 hover:bg-purple-500 active:scale-95 text-white cursor-pointer"
            : "bg-white/5 text-white/30 cursor-not-allowed"
        }`}
      >
        {maxed ? "✓ Máximo" : `Subir — ${cost} 🔮`}
      </button>
    </div>
  );
}

function PrestigeTab({ onClose }: { onClose: () => void }) {
  const highestZone = useGameStore((s) => s.highestZone);
  const eternalRunes = useGameStore((s) => s.eternalRunes);
  const totalPrestiges = useGameStore((s) => s.totalPrestiges);
  const prestige = useGameStore((s) => s.prestige);
  const [confirmed, setConfirmed] = useState(false);

  const canPrestige = highestZone >= PRESTIGE_MIN_ZONE;
  const runesWillEarn = canPrestige ? eternalRunesGained(highestZone) : 0;

  const handlePrestige = () => {
    if (!confirmed) { setConfirmed(true); return; }
    prestige();
    onClose();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-purple-500/20 bg-black/20 p-4 flex flex-col gap-3">
        <div className="flex justify-between text-sm">
          <span className="text-white/50">Arena más alta</span>
          <span className="text-white font-bold">{highestZone}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/50">Prestigios totales</span>
          <span className="text-white font-bold">{totalPrestiges}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/50">🔮 Runas actuales</span>
          <span className="text-purple-300 font-bold">{eternalRunes}</span>
        </div>
        {canPrestige && (
          <div className="flex justify-between text-sm border-t border-white/10 pt-3">
            <span className="text-white/50">🔮 Runas a ganar</span>
            <span className="text-yellow-300 font-bold">+{runesWillEarn}</span>
          </div>
        )}
      </div>

      {!canPrestige && (
        <p className="text-center text-white/40 text-sm">
          Necesitás llegar a la arena {PRESTIGE_MIN_ZONE} para presticar.
          <br />
          <span className="text-white/60">(Estás en arena {highestZone}/{PRESTIGE_MIN_ZONE})</span>
        </p>
      )}

      {canPrestige && (
        <>
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-300 leading-relaxed">
            ⚠️ <strong>Resetea:</strong> oro, héroes, upgrades, zona.<br />
            ✅ <strong>Conserva:</strong> gemas, runas, talentos, récord de arena.
          </div>

          <button
            onClick={handlePrestige}
            className={`py-3 rounded-xl font-bold text-white transition-all active:scale-95 ${
              confirmed
                ? "bg-red-600 hover:bg-red-500 border border-red-400/40 animate-pulse"
                : "bg-purple-700 hover:bg-purple-600"
            }`}
          >
            {confirmed
              ? `⚠️ ¿SEGURO? → +${runesWillEarn} 🔮 (click para confirmar)`
              : `✨ Presticar → +${runesWillEarn} 🔮 Runas Eternas`}
          </button>
          {confirmed && (
            <button
              onClick={() => setConfirmed(false)}
              className="text-white/30 text-xs hover:text-white/60 transition-colors"
            >
              Cancelar
            </button>
          )}
        </>
      )}
    </div>
  );
}

export function PrestigePanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>("talentos");
  const eternalRunes = useGameStore((s) => s.eternalRunes);

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
            className="w-full max-w-lg rounded-2xl border border-purple-500/30 bg-[#120924] p-6 shadow-2xl max-h-[90dvh] flex flex-col"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 shrink-0">
              <h2 className="text-white font-bold text-xl">🔮 Ascensión</h2>
              <div className="flex items-center gap-3">
                <span className="text-purple-300 font-bold text-sm">{eternalRunes} 🔮</span>
                <button onClick={onClose} className="text-white/40 hover:text-white text-xl leading-none transition-colors">✕</button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-4 shrink-0 p-1 bg-black/30 rounded-xl">
              {(["talentos", "prestige"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    tab === t ? "bg-purple-600 text-white" : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {t === "talentos" ? "✨ Talentos" : "🌀 Presticar"}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1 pr-1">
              {tab === "talentos" ? (
                <div className="grid grid-cols-2 gap-2">
                  {TALENTS.map((t) => (
                    <TalentCard key={t.id} talentId={t.id} />
                  ))}
                </div>
              ) : (
                <PrestigeTab onClose={onClose} />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
