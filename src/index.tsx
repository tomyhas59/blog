import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./style/theme";
import { Provider, useSelector } from "react-redux";
import configureStore from "./store/store";
import { Analytics } from "@vercel/analytics/react";
import { RootState } from "./reducer";

const store = configureStore();

const rootElement = document.getElementById("root");

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const darkMode = useSelector((state: RootState) => state.post.darkMode);
  const theme = darkMode ? darkTheme : lightTheme;

  return <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>;
};

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <Provider store={store}>
      <ThemeProvider>
        <React.StrictMode>
          <App />
          <Analytics />
        </React.StrictMode>
      </ThemeProvider>
    </Provider>
  );
} else {
  const errorMessage = document.createElement("div");
  errorMessage.innerText =
    "앱을 초기화할 수 없습니다. 나중에 다시 시도해주세요.";
  errorMessage.style.color = "red";
  errorMessage.style.textAlign = "center";
  errorMessage.style.marginTop = "50px";
  document.body.appendChild(errorMessage);
  console.error("Root element with id 'root' not found.");
}
