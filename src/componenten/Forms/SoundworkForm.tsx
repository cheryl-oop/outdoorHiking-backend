import { useState } from "react";
import type { SoundworkInput } from "../../api/soundworks";

type Props = {
  initial?: SoundworkInput;
  submitLabel: string;
  onSubmit: (values: SoundworkInput) => Promise<void>;
};

export const SoundworkForm = ({ initial, submitLabel, onSubmit }: Props) => {
  const [sound_number, setsound_number] = useState(initial?.sound_number ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [artist, setArtist] = useState(initial?.artist ?? "");
  const [audioUrl, setAudioUrl] = useState(initial?.audio_url ?? "");
  const [duration, setDuration] = useState(String(initial?.duration_s ?? ""));
  const [lat, setLat] = useState(String(initial?.lat ?? ""));
  const [lng, setLng] = useState(String(initial?.lng ?? ""));
  const [radius, setRadius] = useState(String(initial?.radius_m ?? 30));
  const [description, setDescription] = useState(initial?.description ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  return (
    <form
      className="soundwork-form"
      onSubmit={async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        try {
          await onSubmit({
            sound_number: Number(sound_number),
            title,
            artist: artist || null,
            audio_url: audioUrl,
            duration_s: Number(duration),
            lat: Number(lat),
            lng: Number(lng),
            radius_m: Number(radius),
            description: description || null,
            image_url: initial?.image_url ?? null,
          });
        } catch (err) {
          setError(err instanceof Error ? err.message : "Something went wrong");
          setSaving(false);
        }
      }}
    >
      <input
        placeholder="Number of soundwork"
        value={sound_number}
        onChange={(e) => setsound_number(e.target.value)}
        required
      />
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        placeholder="Artist"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
      />
      <input
        placeholder="Audio URL"
        value={audioUrl}
        onChange={(e) => setAudioUrl(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Duration (seconds)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        required
      />
      <input
        type="number"
        step="any"
        placeholder="Latitude"
        value={lat}
        onChange={(e) => setLat(e.target.value)}
        required
      />
      <input
        type="number"
        step="any"
        placeholder="Longitude"
        value={lng}
        onChange={(e) => setLng(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Radius (meters)"
        value={radius}
        onChange={(e) => setRadius(e.target.value)}
        required
      />
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={saving}>
        {saving ? "Saving..." : submitLabel}
      </button>
    </form>
  );
};
