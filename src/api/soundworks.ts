import { supabase } from '../supabaseClient';
import type { Soundwork } from '../types/Soundwork';

// Admin doesn't have to fill id and created_at in (Supabase does it automatically)
export type SoundworkInput = Omit<Soundwork, 'id' | 'created_at'>;

export async function getSoundworks(): Promise<Soundwork[]> {
  const { data, error } = await supabase
    .from('soundworks')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Soundwork[];
}

