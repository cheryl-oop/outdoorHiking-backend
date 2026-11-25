import { useNavigate } from "react-router";
import { SoundworkForm } from "../componenten/Forms/SoundworkForm";
import { addSoundwork } from "../api/soundworks";

export const AddSoundwork = () => {
  const navigate = useNavigate();

  return (
    <div className="form-page">
      <h1>Add soundwork</h1>
      <SoundworkForm
        submitLabel="Add soundwork"
        onSubmit={async (values) => {
          await addSoundwork(values);
          navigate("/");
        }}
      />
    </div>
  );
};
