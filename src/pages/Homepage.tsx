import { useNavigate } from "react-router";
import { supabase } from "../supabaseClient";

export const Homepage = () => {
  const navigate = useNavigate();

  async function logout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  return (
    <div className="dashboard">
      <header>
        <h1>Soundworks admin</h1>
        <button onClick={logout}>Log out</button>
      </header>
    </div>
  );
};
