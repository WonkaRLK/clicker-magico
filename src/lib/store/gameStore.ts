import { create } from "zustand";
import { GameState, ActiveBuff } from "@/types/game";
import {
  enemyHp, bossHp, goldPerKill, isBossZone,
  clickDamage, clickUpgradeCost,
  critChancePercent, critMultiplierValue, critChanceUpgradeCost, critMultUpgradeCost,
  goldBonusMultiplier, goldBonusUpgradeCost,
  heroDps, heroLevelCost, heroUnlockCost,
  talentClickMult, talentDpsMult, talentGoldMult,
  talentStartingGold, talentGemBonus, talentBossTimerBonus, talentHeroDiscount, talentPityStart,
  eternalRunesGained, PRESTIGE_MIN_ZONE,
  ENEMIES_PER_ZONE, BASE_BOSS_TIMER,
} from "@/lib/game/formulas";
import { HEROES, RARITY_MULTIPLIER, HeroDefinition, HeroRarity } from "@/lib/data/heroes";
import { TALENTS } from "@/lib/data/talents";
import { loadGame } from "./persistence";

const DEFAULT_STATE: GameState = {
  gold: 0,
  gems: 0,
  eternalRunes: 0,
  currentZone: 1,
  highestZone: 1,
  enemiesKilledInZone: 0,
  totalEnemiesKilled: 0,
  currentEnemyHp: enemyHp(1),
  currentEnemyMaxHp: enemyHp(1),
  upgrades: { clickDamage: 0, critChance: 0, critMultiplier: 0, goldBonus: 0, bossDamage: 0, autoClick: 0 },
  unlockedHeroes: {},
  pityCounter: 0,
  totalSummons: 0,
  talents: {},
  inBossFight: false,
  bossTimer: BASE_BOSS_TIMER,
  bossStartedAt: null,
  skillCooldowns: {},
  activeBuffs: [],
  lastSavedAt: Date.now(),
  totalPrestiges: 0,
  gameStartedAt: Date.now(),
};

export function computeTotalDps(state: GameState): number {
  const base = Object.entries(state.unlockedHeroes).reduce((total, [heroId, heroState]) => {
    const def = HEROES.find((h) => h.id === heroId);
    if (!def || heroState.level === 0) return total;
    return total + heroDps(heroState.level, def.baseDps, RARITY_MULTIPLIER[def.rarity]);
  }, 0);
  return base * talentDpsMult(state.talents.dps_power ?? 0);
}

function rollGachaRarity(pity: number): HeroRarity {
  if (pity >= 100) return "mythic";
  if (pity >= 50) return Math.random() < 0.1 ? "mythic" : "legendary";
  const r = Math.random() * 100;
  if (r < 0.5) return "mythic";
  if (r < 5) return "legendary";
  if (r < 17) return "epic";
  if (r < 45) return "rare";
  return "common";
}

function getBuffMult(buffs: ActiveBuff[], effect: ActiveBuff["effect"]): number {
  const now = Date.now();
  const active = buffs.filter((b) => b.effect === effect && b.expiresAt > now);
  if (active.length === 0) return 1;
  if (effect === "dps_x3") return 3;
  if (effect === "click_x10") return 10;
  if (effect === "gold_x2") return 2;
  if (effect === "gold_x3") return 3;
  return 1;
}

function isBossPaused(buffs: ActiveBuff[]): boolean {
  const now = Date.now();
  return buffs.some((b) => b.effect === "boss_pause" && b.expiresAt > now);
}

function zoneMaxHp(zone: number): number {
  return isBossZone(zone) ? bossHp(zone) : enemyHp(zone);
}

function bossTimerMax(talents: Record<string, number>): number {
  return BASE_BOSS_TIMER + talentBossTimerBonus(talents.boss_timer ?? 0);
}

function zoneState(zone: number, talents: Record<string, number> = {}): Partial<GameState> {
  const boss = isBossZone(zone);
  return {
    currentZone: zone,
    currentEnemyHp: zoneMaxHp(zone),
    currentEnemyMaxHp: zoneMaxHp(zone),
    inBossFight: boss,
    bossTimer: bossTimerMax(talents),
    enemiesKilledInZone: 0,
  };
}

type ClickResult = { damage: number; isCrit: boolean };

type GameStore = GameState & {
  clickEnemy: () => ClickResult;
  applyDpsTick: (deltaSeconds: number) => void;
  buyClickUpgrade: () => void;
  buyCritChance: () => void;
  buyCritMult: () => void;
  buyGoldBonus: () => void;
  unlockHero: (heroId: string) => void;
  levelUpHero: (heroId: string) => void;
  activateSkill: (heroId: string) => void;
  pullGacha: (count: 1 | 10) => HeroDefinition[];
  buyTalent: (talentId: string) => void;
  prestige: () => void;
  goToZone: (zone: number) => void;
  loadSave: () => void;
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...DEFAULT_STATE,

  loadSave: () => {
    const saved = loadGame();
    if (!saved) return;
    const zone = saved.currentZone ?? 1;
    const maxHp = zoneMaxHp(zone);
    const savedHp = saved.currentEnemyHp ?? maxHp;
    set({
      ...DEFAULT_STATE,
      ...saved,
      currentEnemyMaxHp: maxHp,
      currentEnemyHp: Math.min(savedHp, maxHp),
    });
  },

  clickEnemy: () => {
    const state = get();
    const base = clickDamage(state.upgrades.clickDamage, state.talents.click_power ?? 0);
    const critChance = critChancePercent(state.upgrades.critChance) / 100;
    const isCrit = Math.random() < critChance;
    const critMult = isCrit ? critMultiplierValue(state.upgrades.critMultiplier) : 1;
    const clickBuff = getBuffMult(state.activeBuffs, "click_x10");
    const damage = Math.floor(base * critMult * clickBuff);

    const goldMult = goldBonusMultiplier(state.upgrades.goldBonus)
      * getBuffMult(state.activeBuffs, "gold_x2")
      * getBuffMult(state.activeBuffs, "gold_x3")
      * talentGoldMult(state.talents.gold_power ?? 0);

    const newHp = state.currentEnemyHp - damage;
    if (newHp > 0) {
      set({ currentEnemyHp: newHp });
      return { damage, isCrit };
    }

    const goldEarned = goldPerKill(state.currentZone, goldMult) * (state.inBossFight ? 10 : 1);
    const baseGems = state.inBossFight ? Math.max(1, Math.floor(state.currentZone / 5)) : 0;
    const gemsEarned = baseGems > 0 ? baseGems + talentGemBonus(state.talents.gem_bonus ?? 0) : 0;
    const newKilled = state.inBossFight ? 0 : state.enemiesKilledInZone + 1;
    const totalKilled = state.totalEnemiesKilled + 1;

    let nextZone = state.currentZone;
    if (state.inBossFight || newKilled >= ENEMIES_PER_ZONE) {
      nextZone = state.currentZone + 1;
    }

    const highest = Math.max(state.highestZone, nextZone);
    set({
      gold: state.gold + goldEarned,
      gems: state.gems + gemsEarned,
      totalEnemiesKilled: totalKilled,
      highestZone: highest,
      ...zoneState(nextZone, state.talents),
      ...(nextZone === state.currentZone ? { enemiesKilledInZone: newKilled, currentZone: state.currentZone } : {}),
    });

    return { damage, isCrit };
  },

  applyDpsTick: (deltaSeconds: number) => {
    const state = get();
    const now = Date.now();

    const activeBuffs = state.activeBuffs.filter((b) => b.expiresAt > now);

    let bossTimer = state.bossTimer;
    if (state.inBossFight && !isBossPaused(activeBuffs)) {
      bossTimer -= deltaSeconds;
      if (bossTimer <= 0) {
        set({
          bossTimer: bossTimerMax(state.talents),
          currentEnemyHp: bossHp(state.currentZone),
          currentEnemyMaxHp: bossHp(state.currentZone),
          activeBuffs,
        });
        return;
      }
    }

    const totalDps = computeTotalDps(state);
    const dpsBuffMult = getBuffMult(activeBuffs, "dps_x3");
    const effectiveDps = totalDps * dpsBuffMult;

    if (effectiveDps === 0) {
      set({ bossTimer, activeBuffs });
      return;
    }

    const goldMult = goldBonusMultiplier(state.upgrades.goldBonus)
      * getBuffMult(activeBuffs, "gold_x2")
      * getBuffMult(activeBuffs, "gold_x3")
      * talentGoldMult(state.talents.gold_power ?? 0);

    const timerMax = bossTimerMax(state.talents);
    let damage = effectiveDps * deltaSeconds;
    let hp = state.currentEnemyHp;
    let zone = state.currentZone;
    let killed = state.enemiesKilledInZone;
    let totalKilled = state.totalEnemiesKilled;
    let gold = state.gold;
    let gems = state.gems;
    let highest = state.highestZone;
    let inBoss = state.inBossFight;
    let newBossTimer = bossTimer;

    let iterations = 0;
    while (damage >= hp && iterations < 50) {
      damage -= hp;

      if (inBoss) {
        const baseGems = Math.max(1, Math.floor(zone / 5));
        gems += baseGems + talentGemBonus(state.talents.gem_bonus ?? 0);
        gold += goldPerKill(zone, goldMult) * 10;
        zone++;
        highest = Math.max(highest, zone);
        killed = 0;
        inBoss = isBossZone(zone);
        newBossTimer = timerMax;
      } else {
        gold += goldPerKill(zone, goldMult);
        totalKilled++;
        killed++;
        if (killed >= ENEMIES_PER_ZONE) {
          zone++;
          highest = Math.max(highest, zone);
          killed = 0;
          inBoss = isBossZone(zone);
          newBossTimer = timerMax;
        }
      }

      hp = inBoss ? bossHp(zone) : enemyHp(zone);
      iterations++;
    }

    set({
      currentEnemyHp: Math.max(0.01, hp - damage),
      currentEnemyMaxHp: inBoss ? bossHp(zone) : enemyHp(zone),
      currentZone: zone,
      highestZone: highest,
      enemiesKilledInZone: killed,
      totalEnemiesKilled: totalKilled,
      gold,
      gems,
      bossTimer: newBossTimer,
      inBossFight: inBoss,
      activeBuffs,
    });
  },

  activateSkill: (heroId: string) => {
    const state = get();
    const def = HEROES.find((h) => h.id === heroId);
    if (!def?.skill) return;
    if (!state.unlockedHeroes[heroId]) return;

    const now = Date.now();
    if (now < (state.skillCooldowns[heroId] ?? 0)) return;

    const buff: ActiveBuff = {
      id: `${heroId}-${now}`,
      effect: def.skill.effect,
      expiresAt: now + def.skill.durationSeconds * 1000,
    };

    set({
      activeBuffs: [...state.activeBuffs, buff],
      skillCooldowns: { ...state.skillCooldowns, [heroId]: now + def.skill.cooldownSeconds * 1000 },
    });
  },

  buyClickUpgrade: () => {
    const s = get();
    const cost = clickUpgradeCost(s.upgrades.clickDamage);
    if (s.gold < cost) return;
    set({ gold: s.gold - cost, upgrades: { ...s.upgrades, clickDamage: s.upgrades.clickDamage + 1 } });
  },

  buyCritChance: () => {
    const s = get();
    const cost = critChanceUpgradeCost(s.upgrades.critChance);
    if (s.gold < cost) return;
    set({ gold: s.gold - cost, upgrades: { ...s.upgrades, critChance: s.upgrades.critChance + 1 } });
  },

  buyCritMult: () => {
    const s = get();
    const cost = critMultUpgradeCost(s.upgrades.critMultiplier);
    if (s.gold < cost) return;
    set({ gold: s.gold - cost, upgrades: { ...s.upgrades, critMultiplier: s.upgrades.critMultiplier + 1 } });
  },

  buyGoldBonus: () => {
    const s = get();
    const cost = goldBonusUpgradeCost(s.upgrades.goldBonus);
    if (s.gold < cost) return;
    set({ gold: s.gold - cost, upgrades: { ...s.upgrades, goldBonus: s.upgrades.goldBonus + 1 } });
  },

  unlockHero: (heroId: string) => {
    const s = get();
    const def = HEROES.find((h) => h.id === heroId);
    if (!def || s.unlockedHeroes[heroId]) return;
    const discount = talentHeroDiscount(s.talents.hero_discount ?? 0);
    const cost = heroUnlockCost(def.unlockCost, discount);
    if (s.gold < cost) return;
    set({
      gold: s.gold - cost,
      unlockedHeroes: { ...s.unlockedHeroes, [heroId]: { level: 1, stars: 1, fragments: 0 } },
    });
  },

  levelUpHero: (heroId: string) => {
    const s = get();
    const def = HEROES.find((h) => h.id === heroId);
    const heroState = s.unlockedHeroes[heroId];
    if (!def || !heroState) return;
    const discount = talentHeroDiscount(s.talents.hero_discount ?? 0);
    const cost = heroLevelCost(heroState.level, def.levelCost, discount);
    if (s.gold < cost) return;
    set({
      gold: s.gold - cost,
      unlockedHeroes: { ...s.unlockedHeroes, [heroId]: { ...heroState, level: heroState.level + 1 } },
    });
  },

  pullGacha: (count: 1 | 10) => {
    const state = get();
    const cost = count === 1 ? 10 : 90;
    if (state.gems < cost) return [];

    const results: HeroDefinition[] = [];
    let pity = state.pityCounter;
    let totalSummons = state.totalSummons;
    const newUnlocked = { ...state.unlockedHeroes };

    for (let i = 0; i < count; i++) {
      pity++;
      totalSummons++;

      const rarity = rollGachaRarity(pity);
      if (rarity === "legendary" || rarity === "mythic") pity = 0;

      const pool = HEROES.filter((h) => h.rarity === rarity);
      const hero = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : HEROES[0];

      results.push(hero);
      if (newUnlocked[hero.id]) {
        newUnlocked[hero.id] = { ...newUnlocked[hero.id], level: newUnlocked[hero.id].level + 1 };
      } else {
        newUnlocked[hero.id] = { level: 1, stars: 1, fragments: 0 };
      }
    }

    set({ gems: state.gems - cost, unlockedHeroes: newUnlocked, pityCounter: pity, totalSummons });
    return results;
  },

  buyTalent: (talentId: string) => {
    const s = get();
    const def = TALENTS.find((t) => t.id === talentId);
    if (!def) return;
    const currentLevel = s.talents[talentId] ?? 0;
    if (currentLevel >= def.maxLevel) return;
    const cost = def.costPerLevel[currentLevel];
    if (s.eternalRunes < cost) return;
    set({
      eternalRunes: s.eternalRunes - cost,
      talents: { ...s.talents, [talentId]: currentLevel + 1 },
    });
  },

  prestige: () => {
    const s = get();
    if (s.highestZone < PRESTIGE_MIN_ZONE) return;
    const runesEarned = eternalRunesGained(s.highestZone);
    set({
      ...DEFAULT_STATE,
      gems: s.gems,
      eternalRunes: s.eternalRunes + runesEarned,
      talents: s.talents,
      totalPrestiges: s.totalPrestiges + 1,
      highestZone: s.highestZone,
      totalSummons: s.totalSummons,
      gameStartedAt: s.gameStartedAt,
      gold: talentStartingGold(s.talents.starting_gold ?? 0),
      pityCounter: talentPityStart(s.talents.pity_start ?? 0),
      currentEnemyHp: enemyHp(1),
      currentEnemyMaxHp: enemyHp(1),
    });
  },

  goToZone: (zone: number) => {
    const s = get();
    if (zone < 1 || zone > s.highestZone) return;
    set(zoneState(zone, s.talents));
  },
}));
