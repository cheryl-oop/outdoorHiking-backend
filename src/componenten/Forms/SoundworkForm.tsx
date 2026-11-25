import { useState } from "react";
import type { SoundworkInput } from "../../api/soundworks";
import {
  validateMp3,
  getAudioDuration,
  uploadAudio,
  deleteAudio,
} from "../../api/storage";

type Props = {
  initial?: SoundworkInput;
  submitLabel: string;
  onSubmit: (values: SoundworkInput) => Promise<void>;
};

export const SoundworkForm = ({ initial, submitLabel, onSubmit }: Props) => {
  const [sound_number, setsound_number] = useState(initial?.sound_number ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [artist, setArtist] = useState(initial?.artist ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [lat, setLat] = useState(String(initial?.lat ?? ""));
  const [lng, setLng] = useState(String(initial?.lng ?? ""));
  const [radius, setRadius] = useState(String(initial?.radius_m ?? 30));
  const [description, setDescription] = useState(initial?.description ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="form-container">
      <form
        className="form"
        onSubmit={async (e) => {
          e.preventDefault();
          setError("");

          if (file) {
            const problem = validateMp3(file);
            if (problem) return setError(problem);
          }

          setSaving(true);
          let uploadedUrl: string | null = null;

          try {
            let audioUrl = initial?.audio_url ?? "";
            let duration = initial?.duration_s ?? 0;

            if (file) {
              duration = await getAudioDuration(file);
              uploadedUrl = await uploadAudio(file);
              audioUrl = uploadedUrl;
            }

            await onSubmit({
              sound_number: Number(sound_number),
              title,
              artist: artist || null,
              audio_url: audioUrl,
              duration_s: duration,
              lat: Number(lat),
              lng: Number(lng),
              radius_m: Number(radius),
              description: description || null,
              image_url: initial?.image_url ?? null,
            });
          } catch (err) {
            // saving failed: don't leave the freshly uploaded file orphaned
            if (uploadedUrl) await deleteAudio(uploadedUrl).catch(() => {});
            setError(
              err instanceof Error ? err.message : "Something went wrong",
            );
            setSaving(false);
          }
        }}
      >
        <input
          placeholder="Number of soundwork"
          type="number"
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
        <label>
          MP3 file {initial && "(leave empty to keep the current file)"}
          <input
            type="file"
            accept=".mp3,audio/mpeg"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            required={!initial}
          />
        </label>
        {initial && (
          <audio controls src={initial.audio_url}>
            Your browser does not support audio.
          </audio>
        )}

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
        <button className="btn btn-blue" type="submit" disabled={saving}>
          {saving ? "Saving..." : submitLabel}
        </button>
      </form>
    </div>
  );
};
