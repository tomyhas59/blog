import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "styled-components";
import { theme } from "./style/theme";
import { Provider } from "react-redux";
import configureStore from "./store/store";

const store = configureStore();

const rootElement = document.getElementById("root");

if (rootElement !== null) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </ThemeProvider>
    </Provider>
  );
} else {
  console.error("Root element with id 'root' not found.");
}
