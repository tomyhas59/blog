import Todo from "./pages/Todo";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Sign";
import { useEffect } from "react";

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
      <Routes>
        <Route path="/" element={<Todo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign" element={<Signup />} />
        <Route path="/blog/userid=:id" element={<Signup />} />
        <Route path="/chat" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
