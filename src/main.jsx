import React from "react";    
import ReactDOM from "react-dom/client";
import App from "./App.jsx"; // 🌟 Changed from ".App.jsx" to "./App.jsx"
import "./app/globals.css";   
import axios from "axios";

// Intercept axios requests to rewrite base URL dynamically on production/mobile deployment
axios.interceptors.request.use((config) => {
  const isLocal = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
  const fallbackUrl = isLocal ? "http://localhost:5000" : "https://highp-innovation-backend.onrender.com";
  let apiUrl = (import.meta.env.VITE_API_URL || fallbackUrl).trim().replace(/\/$/, "");

  if (apiUrl.endsWith("/api")) {
    apiUrl = apiUrl.slice(0, -4);
  }

  if (config.url) {
    if (config.url.startsWith("http://localhost:5000") && !isLocal) {
      config.url = config.url.replace("http://localhost:5000", apiUrl);
    } else if (config.url.startsWith("/")) {
      const cleanPath = config.url.startsWith("/api/") ? config.url : `/api${config.url}`;
      config.url = `${apiUrl}${cleanPath}`;
    }
  }

  return config;
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);