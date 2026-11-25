import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { TrackForm } from "../componenten/Forms/TrackForm";
import { addTrack } from "../api/tracks";
import { getSoundworks } from "../api/soundworks";
import type { Soundwork } from "../types/Soundwork";

export const AddTrack = () => {
  const navigate = useNavigate();
  const [soundworks, setSoundworks] = useState<Soundwork[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getSoundworks()
      .then(setSoundworks)
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!soundworks) return <p>Loading...</p>;

  return (
    <div className="form-page">
      <h1>Add track</h1>
      <TrackForm
        allSoundworks={soundworks}
        submitLabel="Add track"
        onSubmit={async (values, soundworkIds) => {
          await addTrack(values, soundworkIds);
          navigate("/");
        }}
      />
    </div>
  );
};
