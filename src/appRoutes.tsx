import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useColorMode, IconButton } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import Home from "./pages/home";
import Room from "./pages/room";
import Game from "./pages/game";
import NotFound from "./pages/notFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <NotFound />,
  },
  {
    path: "/room/:ID",
    element: (
        <Room />
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/game/:ID",
    element: <Game />,
    errorElement: <NotFound />,
  },
]);

export default function App() {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <>
      <IconButton onClick={toggleColorMode} aria-label="Toggle Color Mode" icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />} style={{ position: "absolute", top: "1rem", right: "1rem" }} />
      <RouterProvider router={router} />
      </>
  );
}
