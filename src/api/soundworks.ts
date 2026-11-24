import { supabase } from "../supabaseClient";
import type { Soundwork } from "../types/Soundwork";

// Admin doesn't have to fill id and created_at in (Supabase does it automatically)
export type SoundworkInput = Omit<Soundwork, "id" | "created_at">;

// Gets soundworks
export async function getSoundworks(): Promise<Soundwork[]> {
  const { data, error } = await supabase
    .from("soundworks")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Soundwork[];
}

// Delete Soundwork out the table (using id)µ
export async function deleteSoundwork(id: string): Promise<void> {
  const { data, error } = await supabase
    .from("soundworks")
    .delete()
    .eq("id", id)
    .select();
  if (error) throw error;
  if (!data) throw new Error("Nothing was deleted");
}
// Add Soundwork (will need a form)
// Updates Soundwork (will need a form)
