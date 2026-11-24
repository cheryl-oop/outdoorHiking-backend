import { createBrowserRouter, redirect } from "react-router";
import { supabase } from "../supabaseClient";
import { Login } from "../pages/Login.tsx";
import { Homepage } from "../pages/Homepage.tsx";
import { EditSoundwork } from "../pages/EditSoundwork.tsx";
import { AddSoundwork } from "../pages/AddSoundwork.tsx";
import { EditTrack } from "../pages/EditTrack.tsx";


async function requireLogin() {
  const { data } = await supabase.auth.getSession();
  if (!data.session) throw redirect("/login");
  return null;
}
export const router = createBrowserRouter(
  [
    { path: "/login", element: <Login /> },
    { path: "/", element: <Homepage />, loader: requireLogin },
    {
      path: "/soundworks/:id/edit",
      element: <EditSoundwork />,
      loader: requireLogin,
    },
    {
      path: "/soundworks/add",
      element: <AddSoundwork />,
      loader: requireLogin,
    },
    { path: "/tracks/:id/edit", element: <EditTrack />, loader: requireLogin },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
);
