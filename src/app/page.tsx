"use client";

import { useEffect } from "react";
import { useGameStore } from "@/lib/store/gameStore";
import { useAutoSave } from "@/hooks/useAutoSave";
import { useGameLoop } from "@/hooks/useGameLoop";
import { TopBar } from "@/components/layout/TopBar";
import { Arena } from "@/components/game/Arena";

export default function GamePage() {
  const loadSave = useGameStore((s) => s.loadSave);
  useAutoSave();
  useGameLoop();

  useEffect(() => {
    loadSave();
  }, [loadSave]);

  return (
    <main className="flex flex-col h-dvh bg-gray-950 text-white overflow-hidden">
      <TopBar />
      <div className="flex flex-col flex-1 min-h-0">
        <Arena />
      </div>
    </main>
  );
}
