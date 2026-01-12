import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // 1. Import this
import App from "./App.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  // 2. Wrap App inside BrowserRouter
  <BrowserRouter>
    <App />
  </BrowserRouter>
);