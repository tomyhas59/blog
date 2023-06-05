import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Sign";
import { useEffect } from "react";
import Blog from "./pages/Blog";
import Chat from "./pages/Chat";
import Main from "./pages/Main";
import AppLayout from "./pages/Layout/AppLayout";
import GlobalStyle from "./style/global";
function App() {
  useEffect(() => {
    console.log(`기본 지원 모드:${process.env.NODE_ENV}`);
    //개발용인가 배포용인가
    //리액트에서 자체 지원
    //npm start => development
    //npm build => production
  });

  return (
    <BrowserRouter>
      <GlobalStyle />
      <AppLayout>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign" element={<Signup />} />
          <Route path="/blog/userid=:id" element={<Blog />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
