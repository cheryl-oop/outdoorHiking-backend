import { useEffect, useState } from "react";
import { getTracks, deleteTrack } from "../../api/tracks";
import type { TrackListItem } from "../../api/tracks";
import { Link } from "react-router";

export default function TracksTable() {
  const [tracks, setTracks] = useState<TrackListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getTracks()
      .then(setTracks)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(track: TrackListItem) {
    if (!confirm(`Delete "${track.name}"?`)) return;
    try {
      await deleteTrack(track.id);
      setTracks((prev) => prev.filter((t) => t.id !== track.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <>
      <h2>Tracks</h2>
      <Link className="btn btn-blue" to="/tracks/new">
        + Add track
      </Link>
      {error && <p className="error">{error}</p>}
      {loading && <p>Loading...</p>}
      {!loading && tracks.length === 0 && <p>No tracks yet.</p>}
      {tracks.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Name Track</th>
              <th>Description</th>
              <th>Distance</th>
              <th>Duration</th>
              <th>Soundworks</th>
            </tr>
          </thead>
          <tbody>
            {tracks.map((t) => (
              <tr key={t.id}>
                <td>{t.name}</td>
                <td>{t.description ?? "-"}</td>
                <td>{t.distance}</td>
                <td>{t.duration_min}</td>
                <td>{t.track_soundworks[0]?.count ?? 0}</td>
                <td>
                  <Link className="btn btn-green" to={`/tracks/${t.id}/edit`}>
                    Edit
                  </Link>
                  <button
                    className="btn btn-red"
                    onClick={() => handleDelete(t)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
