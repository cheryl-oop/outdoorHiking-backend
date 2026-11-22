import { createBrowserRouter, redirect } from "react-router";
import { supabase } from "../supabaseClient";
import { Login } from "../pages/Login.tsx";
import { Homepage } from "../pages/Homepage.tsx";

async function requireLogin() {
  const { data } = await supabase.auth.getSession();
  if (!data.session) throw redirect("/login");
  return null;
}
export const router = createBrowserRouter(
  [
    { path: "/login", element: <Login /> },
    { path: "/", element: <Homepage />, loader: requireLogin },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
);
