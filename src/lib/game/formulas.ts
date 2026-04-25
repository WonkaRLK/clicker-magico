export function enemyHp(zone: number): number {
  const zoneMultiplier = Math.pow(10, Math.floor(zone / 50));
  return 10 * Math.pow(1.55, zone - 1) * zoneMultiplier;
}

export function bossHp(zone: number): number {
  return enemyHp(zone) * 10;
}

export function goldPerKill(zone: number, goldMultiplier = 1): number {
  return Math.max(1, Math.floor(enemyHp(zone) * 0.05 * goldMultiplier));
}

export function clickDamage(level: number): number {
  return Math.ceil(5 * Math.pow(1.15, level));
}

export function clickUpgradeCost(level: number): number {
  return Math.ceil(15 * Math.pow(1.12, level));
}

export function eternalRunesGained(highestZone: number): number {
  return Math.floor(Math.sqrt(highestZone / 50));
}

export function isBossZone(zone: number): boolean {
  return zone % 5 === 0;
}

export const ENEMIES_PER_ZONE = 10;
