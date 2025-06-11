import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import LandingPage from "./components/LandingPage";
import PaginaError from "./pages/PaginaError";
import LogIn from "./components/LogIn";
import SignIn from "./components/SignIn";
import Home from "./pages/Home";
import Unauthorized from "./components/Unauthorized";
import Bienvenida from "./components/Bienvenida";
import Carta from "./components/Carta";
import Reservas from "./components/Reservas";
import PanelAdmin from "./components/PanelAdmin";

import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import '@fontsource-variable/Oswald';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';




let router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <PaginaError />,
  },
  {
    path: "/login",
    element: <LogIn />
  },
  {
    path: "/signin",
    element: <SignIn />
  },
  {
    path: "/home",
    element: <Home />,
    children: [
      {
        path: "unauthorized",
        element: <Unauthorized />,
      },
      {
        path: "bienvenida",
        element: <Bienvenida />,
      },
      {
        path: "menu",
        element: <Carta />,
      },
      {
        path: "reservations",
        element: <Reservas />,
      },
      {
        path: "admin",
        element: <PanelAdmin />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);

