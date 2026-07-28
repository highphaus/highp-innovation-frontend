import React from "react";    
import ReactDOM from "react-dom/client";
import App from "./App.jsx"; // 🌟 Changed from ".App.jsx" to "./App.jsx"
import "./app/globals.css";   
import axios from "axios";

// Intercept axios requests to rewrite base URL dynamically on production/mobile deployment
axios.interceptors.request.use((config) => {
  const apiUrl = (import.meta.env.VITE_API_URL || "").trim();
  if (apiUrl && config.url) {
    if (config.url.startsWith("/api")) {
      config.url = `${apiUrl.replace(/\/$/, "")}${config.url}`;
    } else if (config.url.startsWith("http://localhost:5000")) {
      config.url = config.url.replace("http://localhost:5000", apiUrl.replace(/\/$/, ""));
    }
  }
  return config;
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);