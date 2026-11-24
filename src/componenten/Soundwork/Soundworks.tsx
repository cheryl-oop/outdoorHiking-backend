import { useEffect, useState } from "react";
import type { Soundwork } from "../../types/Soundwork";
import { supabase } from "../../supabaseClient";
import "./Soundworks.css";

export const Soundworks = () => {
  const [soundworks, setSoundworks] = useState<Soundwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadSoundworks() {
    const { data, error } = await supabase
      .from("soundworks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) setError(error.message);
    else setSoundworks(data as Soundwork[]);
    setLoading(false);
  }

  useEffect(() => {
    loadSoundworks();
  }, []);

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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};
