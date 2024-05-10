import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Sign";
import { useEffect } from "react";
import Main from "./pages/Main";
import AppLayout from "./pages/Layout/AppLayout";
import GlobalStyle from "./style/global";
/* import Chat from "./pages/Chat"; */
import { PaginationProvider } from "./pages/PaginationProvider";
import React from "react";
import Chat from "./pages/Chat";
function App() {
  useEffect(() => {
    console.log(`기본 지원 모드:${process.env.NODE_ENV}`);
    //개발용인가 배포용인가
    //리액트에서 자체 지원
    //npm start => development
    //npm build => production
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
          </Routes>
        </AppLayout>
      </PaginationProvider>
    </BrowserRouter>
  );
}

export default App;
