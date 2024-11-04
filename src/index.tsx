import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "styled-components";
import { theme } from "./style/theme";
import { Provider } from "react-redux";
import configureStore from "./store/store";
import { Analytics } from "@vercel/analytics/react";

const store = configureStore();

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
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
