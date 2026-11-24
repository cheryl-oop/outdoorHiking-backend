export type Soundwork = {
  id: string;
  title: string;
  artist: string | null;
  audio_url: string;
  duration_s: number;
  lat: number;
  lng: number;
  radius_m: number;
  description: string | null;
  image_url: string | null;
  created_at: string;
  sound_number: number;
};
