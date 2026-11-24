import { useEffect, useState } from "react";
import type { Soundwork } from "../../types/Soundwork";
import { getSoundworks, deleteSoundwork } from "../../api/soundworks";
import { Link } from "react-router";
import "./SoundworksTable.css";

export const SoundworksTable = () => {
  const [soundworks, setSoundworks] = useState<Soundwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getSoundworks()
      .then(setSoundworks)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(sw: Soundwork) {
    if (!confirm(`Delete "${sw.title}"?`)) return;
    try {
      await deleteSoundwork(sw.id);
      setSoundworks((prev) => prev.filter((s) => s.id !== sw.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  function formatDuration(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  }
  return (
    <>
      {error && <p className="error">{error}</p>}
      {loading && <p>Loading...</p>}
      {!loading && soundworks.length === 0 && <p>No soundworks yet.</p>}
      <Link to={"/soundworks/add"}>Add</Link>

      {soundworks.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Number</th>
              <th>Title</th>
              <th>Artist</th>
              <th>Length</th>
              <th>Radius</th>
              <th>Location</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {soundworks.map((sw) => (
              <tr key={sw.id}>
                <td>{sw.sound_number}</td>
                <td>{sw.title}</td>
                <td>{sw.artist ?? "-"}</td>
                <td>{formatDuration(sw.duration_s)}</td>
                <td>{sw.radius_m} m</td>
                <td>
                  {sw.lat.toFixed(4)}, {sw.lng.toFixed(4)}
                </td>
                <td>
                  <Link to={`/soundworks/${sw.id}/edit`}>Edit</Link>
                  <button onClick={() => handleDelete(sw)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};
