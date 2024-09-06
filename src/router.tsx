import { createBrowserRouter } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
    errorElement: <NotFound />,
  },
]);