import { useEffect } from "react";
import { useGameStore } from "@/lib/store/gameStore";

const TICK_MS = 50; // 20 ticks/s — suficiente para DPS pasivo y boss timer

export function useGameLoop(): void {
  useEffect(() => {
    let lastTime = Date.now();

    const id = setInterval(() => {
      const now = Date.now();
      const delta = Math.min((now - lastTime) / 1000, 0.5);
      lastTime = now;
      try {
        useGameStore.getState().applyDpsTick(delta);
      } catch (e) {
        console.error("applyDpsTick error:", e);
      }
    }, TICK_MS);

    return () => clearInterval(id);
  }, []);
}
