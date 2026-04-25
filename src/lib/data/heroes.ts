export type HeroRarity = "common" | "rare" | "epic" | "legendary" | "mythic";

export type HeroDefinition = {
  id: string;
  name: string;
  emoji: string;
  rarity: HeroRarity;
  description: string;
  baseDps: number;
  unlockCost: number;
  levelCost: number;
};

export const RARITY_MULTIPLIER: Record<HeroRarity, number> = {
  common: 1,
  rare: 1.5,
  epic: 2.5,
  legendary: 5,
  mythic: 10,
};

export const RARITY_COLOR: Record<HeroRarity, string> = {
  common: "text-gray-400 border-gray-500/40",
  rare: "text-blue-400 border-blue-500/40",
  epic: "text-purple-400 border-purple-500/40",
  legendary: "text-orange-400 border-orange-500/40",
  mythic: "text-pink-400 border-pink-500/40",
};

export const RARITY_LABEL: Record<HeroRarity, string> = {
  common: "Común",
  rare: "Raro",
  epic: "Épico",
  legendary: "Legendario",
  mythic: "Mítico",
};

export const HEROES: HeroDefinition[] = [
  {
    id: "pip",
    name: "Pip el Aprendiz",
    emoji: "🧙",
    rarity: "common",
    description: "Un joven estudiante con mucho entusiasmo.",
    baseDps: 1,
    unlockCost: 50,
    levelCost: 10,
  },
  {
    id: "mira",
    name: "Mira la Herbolaria",
    emoji: "🌿",
    rarity: "common",
    description: "Experta en pociones y magia natural.",
    baseDps: 2,
    unlockCost: 150,
    levelCost: 25,
  },
  {
    id: "bartholomew",
    name: "Bartholomew Ashwick",
    emoji: "⚗️",
    rarity: "rare",
    description: "Alquimista maestro.",
    baseDps: 5,
    unlockCost: 500,
    levelCost: 80,
  },
  {
    id: "garruk",
    name: "Garruk el Forjarunas",
    emoji: "🛡️",
    rarity: "rare",
    description: "Guerrero rúnico.",
    baseDps: 7,
    unlockCost: 800,
    levelCost: 120,
  },
  {
    id: "lyra",
    name: "Lyra Stormcaller",
    emoji: "⚡",
    rarity: "epic",
    description: "Hechicera del trueno.",
    baseDps: 18,
    unlockCost: 3000,
    levelCost: 500,
  },
];
