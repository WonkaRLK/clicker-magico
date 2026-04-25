import { useEffect } from "react";
import { useGameStore } from "@/lib/store/gameStore";
import { saveGame } from "@/lib/store/persistence";

export function useAutoSave(intervalMs = 5000): void {
  useEffect(() => {
    const id = setInterval(() => {
      const state = useGameStore.getState();
      saveGame(state);
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
}
