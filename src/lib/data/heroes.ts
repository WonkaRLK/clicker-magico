export type HeroRarity = "common" | "rare" | "epic" | "legendary" | "mythic";

export type HeroSkill = {
  name: string;
  description: string;
  emoji: string;
  durationSeconds: number;
  cooldownSeconds: number;
  effect: "dps_x3" | "gold_x2" | "click_x10" | "boss_pause";
};

export type HeroDefinition = {
  id: string;
  name: string;
  emoji: string;
  rarity: HeroRarity;
  description: string;
  baseDps: number;
  unlockCost: number;
  levelCost: number;
  skill?: HeroSkill;
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
    description: "Ya había leído todos los libros antes del primer día de clases.",
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
  {
    id: "drako",
    name: "Drako el Puro",
    emoji: "🐍",
    rarity: "legendary",
    description: "De sangre pura y apellido ilustre. Cuando actúa, nadie se interpone.",
    baseDps: 45,
    unlockCost: 15000,
    levelCost: 2000,
    skill: {
      name: "Cruciatus",
      description: "DPS x3 durante 30 segundos.",
      emoji: "😈",
      durationSeconds: 30,
      cooldownSeconds: 300,
      effect: "dps_x3",
    },
  },
  {
    id: "minerva",
    name: "Minerva la Transformista",
    emoji: "🦁",
    rarity: "legendary",
    description: "Puede convertirse en gata a voluntad. Rigurosa, justa e implacable en combate.",
    baseDps: 60,
    unlockCost: 25000,
    levelCost: 3000,
    skill: {
      name: "Lluvia Dorada",
      description: "+200% oro por 60 segundos.",
      emoji: "💛",
      durationSeconds: 60,
      cooldownSeconds: 480,
      effect: "gold_x2",
    },
  },
  {
    id: "innombrable",
    name: "El Innombrable",
    emoji: "💀",
    rarity: "mythic",
    description: "No se dice su nombre. Ni siquiera en susurros. Tiene poderes que ningún mortal debería poseer.",
    baseDps: 200,
    unlockCost: 150000,
    levelCost: 15000,
    skill: {
      name: "Tiempo Detenido",
      description: "Pausa el timer del boss por 8 segundos.",
      emoji: "⏸️",
      durationSeconds: 8,
      cooldownSeconds: 600,
      effect: "boss_pause",
    },
  },
];
