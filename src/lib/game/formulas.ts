// === Enemy ===

export function enemyHp(zone: number): number {
  const zoneMultiplier = Math.pow(10, Math.floor(zone / 50));
  return 10 * Math.pow(1.55, zone - 1) * zoneMultiplier;
}

export function bossHp(zone: number): number {
  return enemyHp(zone) * 10;
}

export function goldPerKill(zone: number, goldMultiplier = 1): number {
  return Math.max(8, Math.floor(enemyHp(zone) * 0.2 * goldMultiplier));
}

// === Click damage ===

export function clickDamage(level: number, talentLevel = 0): number {
  return Math.ceil(5 * Math.pow(1.15, level) * (1 + talentLevel * 0.15));
}

export function clickUpgradeCost(level: number): number {
  return Math.ceil(15 * Math.pow(1.12, level));
}

// === Crit ===

export function critChancePercent(level: number): number {
  return Math.min(level * 2, 80);
}

export function critMultiplierValue(level: number): number {
  return 2 + level * 0.25;
}

export function critChanceUpgradeCost(level: number): number {
  return Math.ceil(25 * Math.pow(1.12, level));
}

export function critMultUpgradeCost(level: number): number {
  return Math.ceil(75 * Math.pow(1.15, level));
}

// === Gold bonus ===

export function goldBonusMultiplier(level: number): number {
  return 1 + level * 0.05;
}

export function goldBonusUpgradeCost(level: number): number {
  return Math.ceil(30 * Math.pow(1.12, level));
}

// === Heroes ===

export function heroDps(level: number, baseDps: number, rarityMult: number): number {
  if (level === 0) return 0;
  return baseDps * Math.pow(1.06, level - 1) * rarityMult;
}

export function heroLevelCost(level: number, baseCost: number, discountMult = 1): number {
  return Math.ceil(baseCost * Math.pow(1.08, level) * discountMult);
}

export function heroUnlockCost(baseCost: number, discountMult = 1): number {
  return Math.ceil(baseCost * discountMult);
}

// === Talents ===

export function talentClickMult(level: number): number { return 1 + level * 0.15; }
export function talentDpsMult(level: number): number { return 1 + level * 0.15; }
export function talentGoldMult(level: number): number { return 1 + level * 0.20; }
export function talentStartingGold(level: number): number { return level * 200; }
export function talentGemBonus(level: number): number { return level; }
export function talentBossTimerBonus(level: number): number { return level * 5; }
export function talentHeroDiscount(level: number): number { return Math.max(0.2, 1 - level * 0.08); }
export function talentPityStart(level: number): number { return level * 10; }

// === Prestige ===

export const PRESTIGE_MIN_ZONE = 25;

export function eternalRunesGained(highestZone: number): number {
  return Math.floor(highestZone / 5);
}

// === Number formatting ===

const SUFFIXES = ["", "k", "M", "B", "T", "q", "Q", "s", "S", "O", "N", "D"];

export function fmtNum(n: number): string {
  if (!isFinite(n) || n === 0) return "0";
  if (n < 1000) return n.toFixed(n < 10 ? 1 : 0);
  const exp = Math.min(Math.floor(Math.log10(n) / 3), SUFFIXES.length - 1);
  const val = n / Math.pow(1000, exp);
  return `${val >= 100 ? val.toFixed(1) : val.toFixed(2)}${SUFFIXES[exp]}`;
}

// === Misc ===

export function isBossZone(zone: number): boolean {
  return zone % 5 === 0;
}

export const ENEMIES_PER_ZONE = 10;
export const BASE_BOSS_TIMER = 30;
