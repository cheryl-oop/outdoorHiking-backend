import { Header } from "../componenten/Layout/Header";
import { SoundworksTable } from "../componenten/Soundwork/SoundworksTable";

export const Homepage = () => {
  return (
    <>
      <Header />
      <section className="dashboard">
        <h1>Dashboard</h1>
        <SoundworksTable />
      </section>
    </>
  );
};
