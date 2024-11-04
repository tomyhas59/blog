import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Sign";
import Main from "./pages/Main";
import AppLayout from "./pages/Layout/AppLayout";
import GlobalStyle from "./style/global";
import { PaginationProvider } from "./pages/PaginationProvider";
import Chat from "./pages/Chat";
import Info from "./pages/Info";
import NotFound from "./pages/NotFound";

const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  CHAT: "/chat",
  INFO: "/info",
};

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
            <Route path={ROUTES.HOME} element={<Main />} />
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.SIGNUP} element={<Signup />} />
            <Route path={ROUTES.CHAT} element={<Chat />} />
            <Route path={ROUTES.INFO} element={<Info />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </PaginationProvider>
    </BrowserRouter>
  );
}

export default App;
