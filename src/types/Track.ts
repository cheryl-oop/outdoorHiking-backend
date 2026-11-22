export type Track = {
  id: string;
  name: string;
  description: string | null;
  duration_min: number;
  distance: "short" | "medium" | "long";
  image_url: string | null;
  created_at: string;
};
