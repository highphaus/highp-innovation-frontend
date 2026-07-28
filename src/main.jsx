import React from "react";    
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./app/globals.css";   
import axios from "axios";
import { getApiBaseUrl } from "./config/api";

// Intercept axios requests to rewrite base URL dynamically across Vercel, Render & Localhost
axios.interceptors.request.use((config) => {
  const apiBase = getApiBaseUrl(); // Returns e.g. "https://highp-innovation-backend.onrender.com/api"
  const rootBase = apiBase.replace(/\/api$/, "");

  if (config.url) {
    if (config.url.startsWith("http://localhost:5000") && !window.location.hostname.includes("localhost")) {
      config.url = config.url.replace("http://localhost:5000", rootBase);
    } else if (config.url.startsWith("/")) {
      if (config.url.startsWith("/api/")) {
        config.url = `${rootBase}${config.url}`;
      } else {
        config.url = `${apiBase}${config.url}`;
      }
    }
  }

  return config;
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);