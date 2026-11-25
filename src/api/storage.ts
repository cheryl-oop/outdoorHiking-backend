import { supabase } from "../supabaseClient";

const BUCKET = "audio";
export const MAX_MB = 20;

// Validate mp3 files
export function validateMp3(file: File): string | null {
  if (!file.name.toLowerCase().endsWith(".mp3") || file.type !== "audio/mpeg") {
    return "Only .mp3 files are allowed.";
  }
  if (file.size > MAX_MB * 1024 * 1024) {
    return `File is too large (max ${MAX_MB} MB).`;
  }
  return null;
}
// Get audio duration (dynamically)
export function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio(url);
    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(Math.round(audio.duration));
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read the audio file."));
    };
  });
}
// Upload audio (when soundwork gets added)
export async function uploadAudio(file: File): Promise<string> {
  const path = `${crypto.randomUUID()}.mp3`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: "audio/mpeg" });
  if (error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
//delete audio (when soundworks get deleted)
export async function deleteAudio(url: string): Promise<void> {
  const path = url.split(`/${BUCKET}/`)[1];
  if (!path) return; // not one of our files (e.g. a fake test URL)
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw error;
}
