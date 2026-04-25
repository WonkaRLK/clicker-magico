export type HeroId = string;
export type TalentId = string;

export type HeroRarity = "common" | "rare" | "epic" | "legendary" | "mythic";

export type HeroState = {
  level: number;
  stars: number;
  fragments: number;
};

export type ActiveBuff = {
  id: string;
  effect: "gold_x2" | "dps_x3" | "click_x10" | "boss_pause";
  expiresAt: number;
};

export type UpgradesState = {
  clickDamage: number;
  critChance: number;
  critMultiplier: number;
  goldBonus: number;
  bossDamage: number;
  autoClick: number;
};

export type GameState = {
  // Resources
  gold: number;
  gems: number;
  eternalRunes: number;

  // Progress
  currentZone: number;
  highestZone: number;
  enemiesKilledInZone: number;
  totalEnemiesKilled: number;

  // Current enemy
  currentEnemyHp: number;
  currentEnemyMaxHp: number;

  // Combat upgrades
  upgrades: UpgradesState;

  // Heroes
  unlockedHeroes: Record<HeroId, HeroState>;

  // Gacha
  pityCounter: number;
  totalSummons: number;

  // Talents
  talents: Record<TalentId, number>;

  // Boss
  inBossFight: boolean;
  bossTimer: number;
  bossStartedAt: number | null;

  // Skills
  skillCooldowns: Record<HeroId, number>;
  activeBuffs: ActiveBuff[];

  // Meta
  lastSavedAt: number;
  totalPrestiges: number;
  gameStartedAt: number;
};

export type DamageNumber = {
  id: number;
  value: number;
  x: number;
  y: number;
  isCrit: boolean;
};
