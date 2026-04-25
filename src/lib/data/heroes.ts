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
    id: "hari",
    name: "Hari el Elegido",
    emoji: "⚡",
    rarity: "common",
    description: "Sobrevivió a la maldición siendo bebé. Lleva una cicatriz que no recuerda haber ganado.",
    baseDps: 1,
    unlockCost: 30,
    levelCost: 10,
  },
  {
    id: "herminia",
    name: "Herminia la Erudita",
    emoji: "📚",
    rarity: "common",
    description: "Ya había leído todos los libros antes del primer día de clases. La más brillante de su generación.",
    baseDps: 2,
    unlockCost: 80,
    levelCost: 25,
  },
  {
    id: "ronal",
    name: "Ronal el Leal",
    emoji: "♟️",
    rarity: "rare",
    description: "De familia numerosa y varita de segunda mano. Nunca falla cuando más importa.",
    baseDps: 5,
    unlockCost: 500,
    levelCost: 80,
  },
  {
    id: "severo",
    name: "Severo el Sombrío",
    emoji: "🖤",
    rarity: "rare",
    description: "Maestro de pociones con pasado oscuro. Nadie sabe si es aliado o enemigo.",
    baseDps: 7,
    unlockCost: 800,
    levelCost: 120,
  },
  {
    id: "albeus",
    name: "Albeus el Rector",
    emoji: "🔮",
    rarity: "epic",
    description: "El mago más poderoso del mundo. Tiene demasiados secretos y un fénix de mascota.",
    baseDps: 18,
    unlockCost: 3000,
    levelCost: 500,
  },
];
