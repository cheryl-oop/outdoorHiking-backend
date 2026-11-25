import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getSoundwork, updateSoundwork } from "../api/soundworks";
import type { Soundwork } from "../types/Soundwork";
import { SoundworkForm } from "../componenten/Forms/SoundworkForm";
import { deleteAudio } from "../api/storage";

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
    <div className="form-page">
      <h1>Edit soundwork</h1>
      <SoundworkForm
        initial={soundwork}
        submitLabel="Save changes"
        onSubmit={async (values) => {
          await updateSoundwork(soundwork.id, values);
          if (values.audio_url !== soundwork.audio_url) {
            await deleteAudio(soundwork.audio_url).catch(() => {});
          }
          navigate("/");
        }}
      />
    </div>
  );
};
