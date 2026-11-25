import { useState } from "react";
import type { Soundwork } from "../../types/Soundwork";
import type { Track } from "../../types/Track";
import type { TrackInput } from "../../api/tracks";

type Props = {
  initial?: TrackInput;
  initialSoundworkIds?: string[];
  allSoundworks: Soundwork[];
  submitLabel: string;
  onSubmit: (values: TrackInput, soundworkIds: string[]) => Promise<void>;
};

export const TrackForm = ({
  initial,
  initialSoundworkIds = [],
  allSoundworks,
  submitLabel,
  onSubmit,
}: Props) => {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [duration, setDuration] = useState(String(initial?.duration_min ?? ""));
  const [distance, setDistance] = useState<Track["distance"]>(
    initial?.distance ?? "short",
  );
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSoundworkIds);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const byId = new Map(allSoundworks.map((s) => [s.id, s]));
  const available = allSoundworks.filter((s) => !selectedIds.includes(s.id));
  const totalAudioSeconds = selectedIds.reduce(
    (sum, id) => sum + (byId.get(id)?.duration_s ?? 0),
    0,
  );

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= selectedIds.length) return;
    setSelectedIds((prev) => {
      const copy = [...prev];
      [copy[index], copy[target]] = [copy[target], copy[index]];
      return copy;
    });
  }

  return (
    <div className="form-container">
      <form
        className="form"
        onSubmit={async (e) => {
          e.preventDefault();
          setSaving(true);
          setError("");
          try {
            await onSubmit(
              {
                name,
                description: description || null,
                duration_min: Number(duration),
                distance,
                image_url: initial?.image_url ?? null,
              },
              selectedIds,
            );
          } catch (err) {
            setError(
              err instanceof Error ? err.message : "Something went wrong",
            );
            setSaving(false);
          }
        }}
      >
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Duration (minutes)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />
        <select
          value={distance}
          onChange={(e) => setDistance(e.target.value as Track["distance"])}
        >
          <option value="short">Short</option>
          <option value="medium">Medium</option>
          <option value="long">Long</option>
        </select>

        <h3>Soundworks in this track (in order)</h3>
        {selectedIds.length === 0 && <p>None selected yet.</p>}
        <ol className="picker-list">
          {selectedIds.map((id, index) => (
            <li key={id}>
              <span>{byId.get(id)?.title ?? "Unknown soundwork"}</span>
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === selectedIds.length - 1}
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() =>
                  setSelectedIds((prev) => prev.filter((x) => x !== id))
                }
              >
                Remove
              </button>
            </li>
          ))}
        </ol>
        {selectedIds.length > 0 && (
          <p>Total audio: {Math.round(totalAudioSeconds / 60)} min</p>
        )}

        <h3>Available soundworks</h3>
        {available.length === 0 && <p>No more soundworks to add.</p>}
        <ul className="picker-list">
          {available.map((s) => (
            <li key={s.id}>
              <span>{s.title}</span>
              <button
              className="btn btn-blue"
                type="button"
                onClick={() => setSelectedIds((prev) => [...prev, s.id])}
              >
                Add
              </button>
            </li>
          ))}
        </ul>

        {error && <p className="error">{error}</p>}
        <button className="btn btn-blue" type="submit" disabled={saving}>
          {saving ? "Saving..." : submitLabel}
        </button>
      </form>
    </div>
  );
};
