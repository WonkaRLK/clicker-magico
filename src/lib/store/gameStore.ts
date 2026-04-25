import { create } from "zustand";
import { GameState } from "@/types/game";
import {
  enemyHp,
  goldPerKill,
  clickDamage,
  clickUpgradeCost,
  ENEMIES_PER_ZONE,
} from "@/lib/game/formulas";
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

type GameStore = GameState & {
  clickEnemy: () => number; // returns damage dealt (for floating numbers)
  buyClickUpgrade: () => void;
  loadSave: () => void;
  _spawnEnemy: (zone: number) => void;
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...DEFAULT_STATE,

  loadSave: () => {
    const saved = loadGame();
    if (!saved) return;
    // Recalculate enemy HP in case formulas changed
    const zone = saved.currentZone ?? 1;
    const maxHp = enemyHp(zone);
    // Clamp saved hp to valid range
    const savedHp = saved.currentEnemyHp ?? maxHp;
    const clampedHp = Math.min(savedHp, maxHp);
    set({
      ...DEFAULT_STATE,
      ...saved,
      currentEnemyMaxHp: maxHp,
      currentEnemyHp: clampedHp,
    });
  },

  _spawnEnemy: (zone: number) => {
    const hp = enemyHp(zone);
    set({ currentEnemyHp: hp, currentEnemyMaxHp: hp });
  },

  clickEnemy: () => {
    const state = get();
    const damage = clickDamage(state.upgrades.clickDamage);
    const newHp = state.currentEnemyHp - damage;

    if (newHp > 0) {
      set({ currentEnemyHp: newHp });
      return damage;
    }

    // Enemy dies
    const goldEarned = goldPerKill(state.currentZone);
    const newKilled = state.enemiesKilledInZone + 1;
    const totalKilled = state.totalEnemiesKilled + 1;

    if (newKilled >= ENEMIES_PER_ZONE) {
      // Advance to next zone
      const nextZone = state.currentZone + 1;
      const newHighest = Math.max(state.highestZone, nextZone);
      const nextHp = enemyHp(nextZone);
      set({
        gold: state.gold + goldEarned,
        currentZone: nextZone,
        highestZone: newHighest,
        enemiesKilledInZone: 0,
        totalEnemiesKilled: totalKilled,
        currentEnemyHp: nextHp,
        currentEnemyMaxHp: nextHp,
      });
    } else {
      // Spawn next enemy in same zone
      const nextHp = enemyHp(state.currentZone);
      set({
        gold: state.gold + goldEarned,
        enemiesKilledInZone: newKilled,
        totalEnemiesKilled: totalKilled,
        currentEnemyHp: nextHp,
        currentEnemyMaxHp: nextHp,
      });
    }

    return damage;
  },

  buyClickUpgrade: () => {
    const state = get();
    const currentLevel = state.upgrades.clickDamage;
    const cost = clickUpgradeCost(currentLevel);
    if (state.gold < cost) return;
    set({
      gold: state.gold - cost,
      upgrades: { ...state.upgrades, clickDamage: currentLevel + 1 },
    });
  },
}));
