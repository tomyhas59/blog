import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./pages/Layout/AppLayout";
import GlobalStyle from "./style/global";
import { PaginationProvider } from "./hooks/PaginationProvider";
import Main from "./pages/Main";
import Login from "./pages/Auth/Login";
import Chat from "./pages/Chat";
import Sign from "./pages/Auth/Sign";
import Info from "./pages/Info";
import User from "./pages/User";
import NotFound from "./pages/NotFound";
import SearchPage from "./pages/Search/SearchPage";
import PostDetail from "./pages/Post/PostDetail";
import SearchedPostDetail from "./pages/Post/SearchedDetail";
import HashtagPage from "./pages/Search/HashtagPage";
import HashtagPostDetail from "./pages/Post/HashtagDetail";

const routes = [
  { path: "/", element: <Main /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Sign /> },
  { path: "/chat", element: <Chat /> },
  { path: "/info", element: <Info /> },
  { path: "/search", element: <SearchPage /> },
  { path: "/post/:postId", element: <PostDetail /> },
  { path: "/searchedPost/:postId", element: <SearchedPostDetail /> },
  { path: "*", element: <NotFound /> },
  { path: "/user/:userId", element: <User /> },
  { path: "/hashtag", element: <HashtagPage /> },
  { path: "/hashtagPost/:postId", element: <HashtagPostDetail /> },
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
