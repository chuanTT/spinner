import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Gift from "./gift.tsx";
import Reset from "./reset.tsx";
import { LayoutServiceWorker } from "./context";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={
          <LayoutServiceWorker>
            <App />
          </LayoutServiceWorker>
        }
      />
      <Route
        path="/gift"
        element={
          <LayoutServiceWorker>
            <Gift />
          </LayoutServiceWorker>
        }
      />
      <Route
        path="/reset"
        element={
          <LayoutServiceWorker>
            <Reset />
          </LayoutServiceWorker>
        }
      />
    </Routes>
  </BrowserRouter>
);
