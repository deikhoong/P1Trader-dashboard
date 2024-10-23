import { createBrowserRouter } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import MainPage from "./pages/MainPage";
import ProtectedRoute from "./ProtectedRoutes";
import UserList from "./pages/users/UserList";
import UserDetail from "./pages/users/UserDetail";

// eslint-disable-next-line react-refresh/only-export-components
const MainRoutes = () => (
  <ProtectedRoute>
    <MainPage />
  </ProtectedRoute>
);

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <MainRoutes />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/users",
        element: <UserList />,
      },   
      {
        path: "/users/:userId",
        element: <UserDetail />,
      },
    ],
  },
]);