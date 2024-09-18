import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserProvider from "./context/userContextProvider";
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
    element: <Room />,
    errorElement: <NotFound />,
  },
  {
    path: "/game/:ID",
    element: <Game />,
    errorElement: <NotFound />,
  },
]);


export default function App() {
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}
