import { createBrowserRouter, redirect } from "react-router";
import { supabase } from "../supabaseClient";
import { Login } from "../pages/Login.tsx";
import { Homepage } from "../pages/Homepage.tsx";
import { EditSoundwork } from "../pages/EditSoundwork.tsx";

async function requireLogin() {
  const { data } = await supabase.auth.getSession();
  if (!data.session) throw redirect("/login");
  return null;
}
export const router = createBrowserRouter(
  [
    { path: "/login", element: <Login /> },
    { path: "/", element: <Homepage />, loader: requireLogin },
    { path: "/editsoundwork", element: <EditSoundwork /> },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
);
