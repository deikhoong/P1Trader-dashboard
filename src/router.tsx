import {createBrowserRouter} from "react-router-dom";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import MainPage from "./pages/MainPage";
import ProtectedRoute from "./ProtectedRoutes";
import UserList from "./pages/users/UserList";
import UserDetail from "./pages/users/UserDetail";
import EventDetail from "./pages/events/EventDetail";
import EventList from "./pages/events/EventList";
import EventCreate from "./pages/events/EventCreate";
import NewsList from "./pages/news/NewsList";
import NewsCreate from "./pages/news/NewsCreate";
import NewsDetail from "./pages/news/NewsDetail";

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
      // User routes
      {
        path: "users",
        children: [
          {index: true, element: <UserList />},
          {path: ":userId", element: <UserDetail />},
        ],
      },
      // Event routes
      {
        path: "events",
        children: [
          {index: true, element: <EventList />},
          {path: "create", element: <EventCreate />},
          {path: ":eventId", element: <EventDetail />},
        ],
      },

      // Event routes
      {
        path: "news",
        children: [
          {index: true, element: <NewsList />},
          {path: "create", element: <NewsCreate />},
          {path: ":newsId", element: <NewsDetail />},
        ],
      },
    ],
  },
]);
