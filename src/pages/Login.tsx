import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../supabaseClient";
import "../styles/pages/Login.css";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <div className="login">
        <h1>Admin login</h1>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            setError("");
            const { error } = await supabase.auth.signInWithPassword({
              email,
              password,
            });
            setLoading(false);
            if (error) setError(error.message);
            else navigate("/");
          }}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
};
