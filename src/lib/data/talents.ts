export type TalentDefinition = {
  id: string;
  name: string;
  emoji: string;
  description: (level: number) => string;
  maxLevel: number;
  costPerLevel: number[];
};

export const TALENTS: TalentDefinition[] = [
  {
    id: "click_power",
    name: "Golpe Arcano",
    emoji: "⚔️",
    description: (l) => `+${l * 15}% daño por click`,
    maxLevel: 5,
    costPerLevel: [1, 2, 3, 4, 5],
  },
  {
    id: "dps_power",
    name: "Aura Mágica",
    emoji: "✨",
    description: (l) => `+${l * 15}% DPS de héroes`,
    maxLevel: 5,
    costPerLevel: [1, 2, 3, 4, 5],
  },
  {
    id: "gold_power",
    name: "Avaricia",
    emoji: "💰",
    description: (l) => `+${l * 20}% oro por enemigo`,
    maxLevel: 5,
    costPerLevel: [1, 2, 3, 4, 5],
  },
  {
    id: "starting_gold",
    name: "Herencia",
    emoji: "🪙",
    description: (l) => `Empieza con ${l * 200} oro extra`,
    maxLevel: 5,
    costPerLevel: [1, 1, 2, 3, 4],
  },
  {
    id: "gem_bonus",
    name: "Minero Arcano",
    emoji: "💎",
    description: (l) => `+${l} gema extra por boss`,
    maxLevel: 3,
    costPerLevel: [2, 3, 5],
  },
  {
    id: "boss_timer",
    name: "Tiempo Extra",
    emoji: "⏱️",
    description: (l) => `+${l * 5}s al timer del boss`,
    maxLevel: 3,
    costPerLevel: [2, 3, 5],
  },
  {
    id: "hero_discount",
    name: "Gremio Arcano",
    emoji: "🤝",
    description: (l) => `-${l * 8}% costo de héroes`,
    maxLevel: 4,
    costPerLevel: [1, 2, 3, 5],
  },
  {
    id: "pity_start",
    name: "Suerte Arcana",
    emoji: "🎲",
    description: (l) => `Empieza con ${l * 10} pity`,
    maxLevel: 3,
    costPerLevel: [2, 3, 4],
  },
];
