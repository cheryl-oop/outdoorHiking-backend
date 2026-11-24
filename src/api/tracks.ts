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
// Soundworks in tracks resetten and replacing with new soundtracks (for add and edit tracks!!!)
async function setTrackSoundworks(trackId: string, soundworkIds: string[]) {
  const { error: deleteError } = await supabase
    .from('track_soundworks')
    .delete()
    .eq('track_id', trackId);
  if (deleteError) throw deleteError;

  if (soundworkIds.length === 0) return;

  const rows = soundworkIds.map((soundwork_id, i) => ({
    track_id: trackId,
    soundwork_id,
    position: i + 1,
  }));
  const { error: insertError } = await supabase.from('track_soundworks').insert(rows);
  if (insertError) throw insertError;
}

// edit track
export async function updateTrack(id: string, input: TrackInput, soundworkIds: string[]): Promise<void> {
  const { data, error } = await supabase.from('tracks').update(input).eq('id', id).select();
  if (error) throw error;
  if (!data || data.length === 0) throw new Error('Nothing was updated (check permissions).');

  await setTrackSoundworks(id, soundworkIds);
}
// add track
