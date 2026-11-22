import { useEffect, useState } from "react";
import { Header } from "../componenten/Layout/Header";
import type { Soundwork } from "../types/Soundwork";
import { supabase } from "../supabaseClient";

export const Homepage = () => {
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
      <Header />
      <div className="dashboard">
        <h1>Soundworks admin</h1>
        {error && <p className="error">{error}</p>}
        {loading && <p>Loading...</p>}
        {!loading && soundworks.length === 0 && <p>No soundworks yet.</p>}
        <div className="soundworks-container">
          {soundworks.map((sw) => (
            <div className="soundwork-card" key={sw.id}>
              <h2>{sw.title}</h2>
              <p>{sw.artist ?? "-"}</p>
              <p>{formatDuration(sw.duration_s)}</p>
              <p>{sw.radius_m} m</p>
              <p>
                {sw.lat.toFixed(4)}, {sw.lng.toFixed(4)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
