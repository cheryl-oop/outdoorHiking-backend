import { supabase } from "../supabaseClient";
import type { Track } from "../types/Track";

export type TrackInput = Omit<Track, "id" | "created_at">;
export type TrackListItem = Track & { track_soundworks: { count: number }[] };

//get all tracks
export async function getTracks(): Promise<TrackListItem[]> {
  const { data, error } = await supabase
    .from("tracks")
    .select("*, track_soundworks(count)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as TrackListItem[];
}
//get one track
export async function getTrack(
  id: string,
): Promise<{ track: Track; soundworkIds: string[] }> {
  const { data, error } = await supabase
    .from("tracks")
    .select("*, track_soundworks(soundwork_id, position)")
    .eq("id", id)
    .single();
  if (error) throw error;

  const { track_soundworks, ...track } = data as Track & {
    track_soundworks: { soundwork_id: string; position: number }[];
  };
  const soundworkIds = [...track_soundworks]
    .sort((a, b) => a.position - b.position)
    .map((t) => t.soundwork_id);

  return { track, soundworkIds };
}
//delete track
export async function deleteTrack(id: string): Promise<void> {
  // track_soundworks rows are removed automatically (with delete cascade)
  const { data, error } = await supabase
    .from("tracks")
    .delete()
    .eq("id", id)
    .select();
  if (error) throw error;
  if (!data || data.length === 0)
    throw new Error("Nothing was deleted (check permissions).");
}
// edit track
// add track
