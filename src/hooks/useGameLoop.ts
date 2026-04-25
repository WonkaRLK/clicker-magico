import { useEffect } from "react";
import { useGameStore } from "@/lib/store/gameStore";

export function useGameLoop(): void {
  useEffect(() => {
    let rafId: number;
    let lastTime: number | null = null;

    function tick(time: number) {
      if (lastTime !== null) {
        // Cap delta at 100ms to avoid huge jumps after tab switch
        const delta = Math.min((time - lastTime) / 1000, 0.1);
        useGameStore.getState().applyDpsTick(delta);
      }
      lastTime = time;
      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);
}
