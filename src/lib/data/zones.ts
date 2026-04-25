export type Zone = {
  id: number; // starts at 0, increments every 50 arenas
  name: string;
  colorFrom: string;
  colorTo: string;
  emoji: string;
};

export const ZONES: Zone[] = [
  { id: 0, name: "Bosque Encantado", colorFrom: "#134e1b", colorTo: "#1a6b26", emoji: "🌲" },
  { id: 1, name: "Cuevas Cristalinas", colorFrom: "#1a1a4e", colorTo: "#2d2d8f", emoji: "💎" },
  { id: 2, name: "Catacumbas Profanas", colorFrom: "#1a0a0a", colorTo: "#4a1010", emoji: "💀" },
  { id: 3, name: "Cumbre Tormentosa", colorFrom: "#0a1a2e", colorTo: "#1a3a5e", emoji: "⚡" },
  { id: 4, name: "Plano Astral", colorFrom: "#0a0a1e", colorTo: "#1a0a3e", emoji: "✨" },
];

export function getZoneForArena(arena: number): Zone {
  const index = Math.floor((arena - 1) / 50) % ZONES.length;
  return ZONES[index];
}
