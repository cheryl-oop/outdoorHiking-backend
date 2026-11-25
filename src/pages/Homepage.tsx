import { Header } from "../componenten/Layout/Header";
import { SoundworksTable } from "../componenten/Soundwork/SoundworksTable";
import TracksTable from "../componenten/Track/TracksTable";

export const Homepage = () => {
  return (
    <>
      <Header />
      <section className="dashboard">
        <SoundworksTable />
        <TracksTable />
      </section>
    </>
  );
};
