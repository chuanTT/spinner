import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Gift from "./gift.tsx";
import Reset from "./reset.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/gift" element={<Gift />} />
      <Route path="/reset" element={<Reset />} />
    </Routes>
  </BrowserRouter>
);
