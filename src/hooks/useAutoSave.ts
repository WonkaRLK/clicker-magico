import { useEffect } from "react";
import { useGameStore } from "@/lib/store/gameStore";
import { saveGame } from "@/lib/store/persistence";
import { supabase } from "@/lib/supabase/client";
import { uploadSave } from "@/lib/supabase/cloudSave";

export function useAutoSave(intervalMs = 5000): void {
  useEffect(() => {
    const id = setInterval(async () => {
      const state = useGameStore.getState();
      saveGame(state);

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const username = session.user.email?.split("@")[0] ?? "Mago";
        uploadSave(session.user.id, username, state);
      }
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
}
