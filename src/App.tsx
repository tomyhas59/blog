import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Sign";
import { useEffect } from "react";
import Main from "./pages/Main";
import AppLayout from "./pages/Layout/AppLayout";
import GlobalStyle from "./style/global";
import { PaginationProvider } from "./pages/PaginationProvider";
import React from "react";
import Chat from "./pages/Chat";
import Info from "./pages/Info";
function App() {
  useEffect(() => {
    console.log(`기본 지원 모드:${process.env.NODE_ENV}`);
  }, []);

  return (
    <BrowserRouter>
      <GlobalStyle />
      <PaginationProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/info" element={<Info />} />
          </Routes>
        </AppLayout>
      </PaginationProvider>
    </BrowserRouter>
  );
}

export default App;
