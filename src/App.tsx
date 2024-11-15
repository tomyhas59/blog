import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import AppLayout from "./pages/Layout/AppLayout";
import GlobalStyle from "./style/global";
import { PaginationProvider } from "./pages/PaginationProvider";
import Spinner from "./components/Spinner";

const Main = lazy(() => import("./pages/Main"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Sign"));
const Chat = lazy(() => import("./pages/Chat"));
const Info = lazy(() => import("./pages/Info"));
const NotFound = lazy(() => import("./pages/NotFound"));

const routes = [
  { path: "/", element: <Main /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/chat", element: <Chat /> },
  { path: "/info", element: <Info /> },
  { path: "*", element: <NotFound /> },
];

function App() {
  useEffect(() => {
    console.log(`기본 지원 모드: ${process.env.NODE_ENV}`);
  }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={<Spinner />}>
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
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
