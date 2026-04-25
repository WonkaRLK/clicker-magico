import { GameState } from "@/types/game";

const SAVE_KEY = "clicker_magico_save";

export function saveGame(state: GameState): void {
  try {
    const serialized = JSON.stringify({ ...state, lastSavedAt: Date.now() });
    localStorage.setItem(SAVE_KEY, serialized);
  } catch {
    // localStorage may be unavailable (SSR, private mode)
  }
}

export function loadGame(): Partial<GameState> | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<GameState>;
  } catch {
    return null;
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // ignore
  }
}
