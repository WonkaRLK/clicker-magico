import { supabase } from "./client";
import { GameState } from "@/types/game";

export type LeaderboardEntry = {
  username: string;
  highest_zone: number;
  total_prestiges: number;
  updated_at: string;
};

export async function uploadSave(userId: string, username: string, state: GameState): Promise<void> {
  await supabase.from("cloud_saves").upsert({
    user_id: userId,
    username,
    save_data: state,
    highest_zone: state.highestZone,
    total_prestiges: state.totalPrestiges,
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id" });
}

export async function downloadSave(userId: string): Promise<GameState | null> {
  const { data, error } = await supabase
    .from("cloud_saves")
    .select("save_data")
    .eq("user_id", userId)
    .single();
  if (error || !data) return null;
  return data.save_data as GameState;
}

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  const { data } = await supabase
    .from("cloud_saves")
    .select("username, highest_zone, total_prestiges, updated_at")
    .order("highest_zone", { ascending: false })
    .limit(20);
  return data ?? [];
}
