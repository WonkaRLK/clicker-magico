"use client";

import { useGameStore } from "@/lib/store/gameStore";
import { HEROES } from "@/lib/data/heroes";
import { RARITY_COLOR } from "@/lib/data/heroes";

function SkillButton({ heroId }: { heroId: string }) {
  const heroState = useGameStore((s) => s.unlockedHeroes[heroId]);
  const cooldownExpiry = useGameStore((s) => s.skillCooldowns[heroId] ?? 0);
  const activeBuffs = useGameStore((s) => s.activeBuffs);
  const activateSkill = useGameStore((s) => s.activateSkill);

  const def = HEROES.find((h) => h.id === heroId);
  if (!def?.skill || !heroState) return null;

  const now = Date.now();
  const onCooldown = now < cooldownExpiry;
  const remainingSecs = onCooldown ? Math.ceil((cooldownExpiry - now) / 1000) : 0;
  const isActive = activeBuffs.some((b) => b.effect === def.skill!.effect && b.expiresAt > now);
  const colorClass = RARITY_COLOR[def.rarity].split(" ")[0];

  const formatCd = (s: number) =>
    s >= 60 ? `${Math.floor(s / 60)}m${s % 60 > 0 ? `${s % 60}s` : ""}` : `${s}s`;

  return (
    <button
      onClick={() => activateSkill(heroId)}
      disabled={onCooldown}
      title={`${def.skill.name} — ${def.skill.description}`}
      className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl border transition-all relative ${
        isActive
          ? "border-yellow-400/60 bg-yellow-400/20 shadow-lg shadow-yellow-400/20"
          : onCooldown
          ? "border-white/10 bg-white/5 opacity-50 cursor-not-allowed"
          : `border-current/40 bg-black/20 hover:bg-white/10 active:scale-95 cursor-pointer ${colorClass}`
      }`}
    >
      <span className="text-2xl">{def.skill.emoji}</span>
      <span className="text-[10px] text-white/70 font-semibold leading-tight text-center max-w-16 truncate">
        {def.skill.name}
      </span>
      {onCooldown && (
        <span className="text-[10px] text-white/40 tabular-nums">{formatCd(remainingSecs)}</span>
      )}
      {isActive && (
        <span className="text-[10px] text-yellow-300 tabular-nums animate-pulse">ACTIVO</span>
      )}
    </button>
  );
}

export function SkillBar() {
  const unlockedHeroes = useGameStore((s) => s.unlockedHeroes);
  const skillHeroes = HEROES.filter(
    (h) => h.skill && (h.rarity === "legendary" || h.rarity === "mythic") && unlockedHeroes[h.id]
  );

  if (skillHeroes.length === 0) return null;

  return (
    <div className="flex items-center justify-center gap-3 py-3 px-4 bg-black/30 border-t border-white/10">
      {skillHeroes.map((h) => (
        <SkillButton key={h.id} heroId={h.id} />
      ))}
    </div>
  );
}
