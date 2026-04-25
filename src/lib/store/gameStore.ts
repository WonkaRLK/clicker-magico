import { create } from "zustand";
import { GameState } from "@/types/game";
import {
  enemyHp,
  goldPerKill,
  clickDamage,
  clickUpgradeCost,
  critChancePercent,
  critMultiplierValue,
  critChanceUpgradeCost,
  critMultUpgradeCost,
  goldBonusMultiplier,
  goldBonusUpgradeCost,
  heroDps,
  heroLevelCost,
  ENEMIES_PER_ZONE,
} from "@/lib/game/formulas";
import { HEROES, RARITY_MULTIPLIER } from "@/lib/data/heroes";
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

  upgrades: {
    clickDamage: 0,
    critChance: 0,
    critMultiplier: 0,
    goldBonus: 0,
    bossDamage: 0,
    autoClick: 0,
  },

  unlockedHeroes: {},
  pityCounter: 0,
  totalSummons: 0,
  talents: {},

  inBossFight: false,
  bossTimer: 30,
  bossStartedAt: null,

  skillCooldowns: {},
  activeBuffs: [],

  lastSavedAt: Date.now(),
  totalPrestiges: 0,
  gameStartedAt: Date.now(),
};

function computeTotalDps(state: GameState): number {
  return Object.entries(state.unlockedHeroes).reduce((total, [heroId, heroState]) => {
    const def = HEROES.find((h) => h.id === heroId);
    if (!def || heroState.level === 0) return total;
    return total + heroDps(heroState.level, def.baseDps, RARITY_MULTIPLIER[def.rarity]);
  }, 0);
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
  loadSave: () => void;
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...DEFAULT_STATE,

  loadSave: () => {
    const saved = loadGame();
    if (!saved) return;
    const zone = saved.currentZone ?? 1;
    const maxHp = enemyHp(zone);
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
    const base = clickDamage(state.upgrades.clickDamage);
    const critChance = critChancePercent(state.upgrades.critChance) / 100;
    const isCrit = Math.random() < critChance;
    const mult = isCrit ? critMultiplierValue(state.upgrades.critMultiplier) : 1;
    const damage = Math.floor(base * mult);
    const goldMult = goldBonusMultiplier(state.upgrades.goldBonus);

    const newHp = state.currentEnemyHp - damage;
    if (newHp > 0) {
      set({ currentEnemyHp: newHp });
      return { damage, isCrit };
    }

    const goldEarned = goldPerKill(state.currentZone, goldMult);
    const newKilled = state.enemiesKilledInZone + 1;
    const totalKilled = state.totalEnemiesKilled + 1;

    if (newKilled >= ENEMIES_PER_ZONE) {
      const nextZone = state.currentZone + 1;
      const nextHp = enemyHp(nextZone);
      set({
        gold: state.gold + goldEarned,
        currentZone: nextZone,
        highestZone: Math.max(state.highestZone, nextZone),
        enemiesKilledInZone: 0,
        totalEnemiesKilled: totalKilled,
        currentEnemyHp: nextHp,
        currentEnemyMaxHp: nextHp,
      });
    } else {
      const nextHp = enemyHp(state.currentZone);
      set({
        gold: state.gold + goldEarned,
        enemiesKilledInZone: newKilled,
        totalEnemiesKilled: totalKilled,
        currentEnemyHp: nextHp,
        currentEnemyMaxHp: nextHp,
      });
    }

    return { damage, isCrit };
  },

  applyDpsTick: (deltaSeconds: number) => {
    const state = get();
    const totalDps = computeTotalDps(state);
    if (totalDps === 0) return;

    const goldMult = goldBonusMultiplier(state.upgrades.goldBonus);
    let damage = totalDps * deltaSeconds;
    let hp = state.currentEnemyHp;
    let zone = state.currentZone;
    let killed = state.enemiesKilledInZone;
    let totalKilled = state.totalEnemiesKilled;
    let gold = state.gold;
    let highest = state.highestZone;

    // Handle potential multi-kill in one tick
    let iterations = 0;
    while (damage >= hp && iterations < 50) {
      damage -= hp;
      gold += goldPerKill(zone, goldMult);
      totalKilled++;
      killed++;
      if (killed >= ENEMIES_PER_ZONE) {
        zone++;
        highest = Math.max(highest, zone);
        killed = 0;
      }
      hp = enemyHp(zone);
      iterations++;
    }

    set({
      currentEnemyHp: Math.max(0.01, hp - damage),
      currentEnemyMaxHp: enemyHp(zone),
      currentZone: zone,
      highestZone: highest,
      enemiesKilledInZone: killed,
      totalEnemiesKilled: totalKilled,
      gold,
    });
  },

  buyClickUpgrade: () => {
    const state = get();
    const cost = clickUpgradeCost(state.upgrades.clickDamage);
    if (state.gold < cost) return;
    set({
      gold: state.gold - cost,
      upgrades: { ...state.upgrades, clickDamage: state.upgrades.clickDamage + 1 },
    });
  },

  buyCritChance: () => {
    const state = get();
    const cost = critChanceUpgradeCost(state.upgrades.critChance);
    if (state.gold < cost) return;
    set({
      gold: state.gold - cost,
      upgrades: { ...state.upgrades, critChance: state.upgrades.critChance + 1 },
    });
  },

  buyCritMult: () => {
    const state = get();
    const cost = critMultUpgradeCost(state.upgrades.critMultiplier);
    if (state.gold < cost) return;
    set({
      gold: state.gold - cost,
      upgrades: { ...state.upgrades, critMultiplier: state.upgrades.critMultiplier + 1 },
    });
  },

  buyGoldBonus: () => {
    const state = get();
    const cost = goldBonusUpgradeCost(state.upgrades.goldBonus);
    if (state.gold < cost) return;
    set({
      gold: state.gold - cost,
      upgrades: { ...state.upgrades, goldBonus: state.upgrades.goldBonus + 1 },
    });
  },

  unlockHero: (heroId: string) => {
    const state = get();
    const def = HEROES.find((h) => h.id === heroId);
    if (!def || state.unlockedHeroes[heroId]) return;
    if (state.gold < def.unlockCost) return;
    set({
      gold: state.gold - def.unlockCost,
      unlockedHeroes: {
        ...state.unlockedHeroes,
        [heroId]: { level: 1, stars: 1, fragments: 0 },
      },
    });
  },

  levelUpHero: (heroId: string) => {
    const state = get();
    const def = HEROES.find((h) => h.id === heroId);
    const heroState = state.unlockedHeroes[heroId];
    if (!def || !heroState) return;
    const cost = heroLevelCost(heroState.level, def.levelCost);
    if (state.gold < cost) return;
    set({
      gold: state.gold - cost,
      unlockedHeroes: {
        ...state.unlockedHeroes,
        [heroId]: { ...heroState, level: heroState.level + 1 },
      },
    });
  },
}));

export { computeTotalDps };
