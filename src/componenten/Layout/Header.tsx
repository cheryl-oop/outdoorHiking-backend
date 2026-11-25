import { Link, useNavigate } from "react-router";
import { supabase } from "../../supabaseClient";

export const Header = () => {
  const navigate = useNavigate();

  async function logout() {
    await supabase.auth.signOut();
    navigate("/login");
  }
  return (
    <header>
      <h1>Dashboard Park Den Brandt</h1>
      <Link className="logout" to="/login" onClick={logout}>
        Log out
      </Link>
    </header>
  );
};
