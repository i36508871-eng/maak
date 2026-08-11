import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

if ("serviceWorker" in navigator && window.location.protocol === "https:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js", {
      scope: "./",
    }).catch(() => {
      // The app remains fully usable when service workers are unavailable.
    });
  });
}

createRoot(document.getElementById("root")!).render(<React.StrictMode><App /></React.StrictMode>);