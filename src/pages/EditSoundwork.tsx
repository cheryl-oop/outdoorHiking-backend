import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getSoundwork, updateSoundwork } from "../api/soundworks";
import type { Soundwork } from "../types/Soundwork";

export const EditSoundwork = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [soundwork, setSoundwork] = useState<Soundwork | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    getSoundwork(id)
      .then(setSoundwork)
      .catch((err: Error) => setError(err.message));
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!soundwork) return <p>Loading...</p>;

  return (
    <section className="dashboard">
      <h1>Edit soundwork</h1>
      <p>Form here</p>
    </section>
  );
};
