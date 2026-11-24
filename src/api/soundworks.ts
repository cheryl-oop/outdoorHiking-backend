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

//Get one soundwork
export async function getSoundwork(id: string): Promise<Soundwork> {
  const { data, error } = await supabase
    .from("soundworks")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as Soundwork;
}

// Delete Soundwork out the table (using id)
export async function deleteSoundwork(id: string): Promise<void> {
  const { data, error } = await supabase
    .from("soundworks")
    .delete()
    .eq("id", id)
    .select();
  if (error) throw error;
  if (!data) throw new Error("Nothing was deleted");
}
// Updates Soundwork (will need a form)
export async function updateSoundwork(
  id: string,
  input: Partial<SoundworkInput>,
): Promise<Soundwork> {
  const { data, error } = await supabase
    .from("soundworks")
    .update(input)
    .eq("id", id)
    .select();
  if (error) throw error;
  if (!data || data.length === 0)
    throw new Error("Nothing was updated (check permissions).");
  return data[0] as Soundwork;
}
// Add Soundwork (will need a form)

export async function addSoundwork(input: SoundworkInput): Promise<Soundwork> {
  const { data, error } = await supabase
    .from("soundworks")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data as Soundwork;
}
