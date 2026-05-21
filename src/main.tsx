/**
 * main.tsx
 *
 * Application entry point — this is the first file that runs.
 *
 * It sets up three global providers:
 *   1. Redux <Provider>      → makes the Redux store available everywhere
 *   2. <BrowserRouter>       → enables React Router navigation
 *   3. <App>                 → renders the full application
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "@/store";
import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root was not found.");
}

// Mount the app into the <div id="root"> in index.html
createRoot(rootElement).render(
  <StrictMode>
    {/* Redux store — all components can access state via useAppSelector */}
    <Provider store={store}>
      {/* BrowserRouter — enables <Link>, useNavigate, and <Routes> */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
