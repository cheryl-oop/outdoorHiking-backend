import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { TrackForm } from "../componenten/Forms/TrackForm";
import { getTrack, updateTrack } from "../api/tracks";
import { getSoundworks } from "../api/soundworks";
import type { Soundwork } from "../types/Soundwork";
import type { Track } from "../types/Track";

export const EditTrack = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [track, setTrack] = useState<Track | null>(null);
  const [soundworkIds, setSoundworkIds] = useState<string[]>([]);
  const [soundworks, setSoundworks] = useState<Soundwork[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    Promise.all([getTrack(id), getSoundworks()])
      .then(([trackData, all]) => {
        setTrack(trackData.track);
        setSoundworkIds(trackData.soundworkIds);
        setSoundworks(all);
      })
      .catch((err: Error) => setError(err.message));
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!track || !soundworks) return <p>Loading...</p>;

  return (
    <div className="form-page">
      <h1>Edit track</h1>
      <TrackForm
        initial={track}
        initialSoundworkIds={soundworkIds}
        allSoundworks={soundworks}
        submitLabel="Save changes"
        onSubmit={async (values, ids) => {
          await updateTrack(track.id, values, ids);
          navigate("/");
        }}
      />
    </div>
  );
};
