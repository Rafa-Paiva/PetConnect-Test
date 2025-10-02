import { createRoot } from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "@/styles/globals.css";

import { Login } from "@/pages/Login";
import { Cadastro } from "@/pages/Cadastro";
import { Senha } from "@/pages/Senha";
import { Forget } from "@/pages/Forget";
import { Email } from "@/pages/Email";
import { Pet } from "./pages/Pet";
import { PetProvider } from "./context/PetProvider";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/cadastro",
    element: <Cadastro />,
  },
  {
    path: "/senha",
    element: <Senha />,
  },
  {
    path: "/forget",
    element: <Forget />,
  },
  {
    path: "/email",
    element: <Email />,
  },
  {
    path: "/pet",
    element: <Pet />,
  },
]);

const root = createRoot(document.getElementById("root"));

root.render(
  <PetProvider>
    <RouterProvider router={router} />
  </PetProvider>
);
