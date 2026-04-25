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

export function clickDamage(level: number): number {
  return Math.ceil(5 * Math.pow(1.15, level));
}

export function clickUpgradeCost(level: number): number {
  return Math.ceil(15 * Math.pow(1.12, level));
}

// === Crit ===

export function critChancePercent(level: number): number {
  return Math.min(level * 2, 80); // 2% per level, cap 80%
}

export function critMultiplierValue(level: number): number {
  return 2 + level * 0.25; // 2x base, +0.25x per level
}

export function critChanceUpgradeCost(level: number): number {
  return Math.ceil(25 * Math.pow(1.12, level));
}

export function critMultUpgradeCost(level: number): number {
  return Math.ceil(75 * Math.pow(1.15, level));
}

// === Gold bonus ===

export function goldBonusMultiplier(level: number): number {
  return 1 + level * 0.05; // +5% per level
}

export function goldBonusUpgradeCost(level: number): number {
  return Math.ceil(30 * Math.pow(1.12, level));
}

// === Heroes ===

export function heroDps(level: number, baseDps: number, rarityMult: number): number {
  if (level === 0) return 0;
  return baseDps * Math.pow(1.06, level - 1) * rarityMult;
}

export function heroLevelCost(level: number, baseCost: number): number {
  return Math.ceil(baseCost * Math.pow(1.08, level));
}

// === Prestige ===

export function eternalRunesGained(highestZone: number): number {
  return Math.floor(Math.sqrt(highestZone / 50));
}

// === Misc ===

export function isBossZone(zone: number): boolean {
  return zone % 5 === 0;
}

export const ENEMIES_PER_ZONE = 10;
