import { Header } from "../componenten/Layout/Header";
import { Soundworks } from "../componenten/Soundwork/Soundworks";

export const Homepage = () => {
  return (
    <>
      <Header />
      <section className="dashboard">
        <h1>Dashboard</h1>
        <Soundworks />
      </section>
    </>
  );
};
