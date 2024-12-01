import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import AppLayout from "./pages/Layout/AppLayout";
import GlobalStyle from "./style/global";
import { PaginationProvider } from "./pages/PaginationProvider";
import Main from "./pages/Main";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import Sign from "./pages/Sign";
import Info from "./pages/Info";
import NotFound from "./pages/NotFound";
import SearchPage from "./pages/SearchPage";
import PostDetail from "./pages/PostDetail";

const routes = [
  { path: "/", element: <Main /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Sign /> },
  { path: "/chat", element: <Chat /> },
  { path: "/info", element: <Info /> },
  { path: "/search", element: <SearchPage /> },
  { path: "/post/:postId", element: <PostDetail /> },
  { path: "*", element: <NotFound /> },
];

function App() {
  useEffect(() => {
    console.log(`기본 지원 모드: ${process.env.NODE_ENV}`);
  }, []);

  return (
    <BrowserRouter>
      <GlobalStyle />
      <PaginationProvider>
        <AppLayout>
          <Routes>
            {routes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Routes>
        </AppLayout>
      </PaginationProvider>
    </BrowserRouter>
  );
}

export default App;
