import Chat from "../pages/Chat";
import AppLayout from "../pages/Layout/AppLayout";
import Login from "../pages/Login";
import Main from "../pages/Main";
import Sign from "../pages/Sign";

export const Path = [
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Main /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Sign /> },
      { path: "/chat", element: <Chat /> },
    ],
  },
];
