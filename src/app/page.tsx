"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/lib/store/gameStore";
import { useAutoSave } from "@/hooks/useAutoSave";
import { useGameLoop } from "@/hooks/useGameLoop";
import { TopBar } from "@/components/layout/TopBar";
import { Arena } from "@/components/game/Arena";
import { GachaModal } from "@/components/game/GachaModal";

export default function GamePage() {
  const loadSave = useGameStore((s) => s.loadSave);
  const [gachaOpen, setGachaOpen] = useState(false);
  useAutoSave();
  useGameLoop();

  useEffect(() => {
    loadSave();
  }, [loadSave]);

  return (
    <main className="flex flex-col h-dvh bg-gray-950 text-white overflow-hidden">
      <TopBar onOpenGacha={() => setGachaOpen(true)} />
      <div className="flex flex-col flex-1 min-h-0">
        <Arena />
      </div>
      <GachaModal isOpen={gachaOpen} onClose={() => setGachaOpen(false)} />
    </main>
  );
}
