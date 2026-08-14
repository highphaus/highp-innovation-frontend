// ────────────────────────────────────────────────────────────
// frontend/src/config/api.js
// Universal API Base URL Resolver for Vercel, Render, Localhost & Custom Domains
// ────────────────────────────────────────────────────────────

export const getApiBaseUrl = () => {
  // 1. Explicit Environment Variable (Vercel / Netlify / Vite env override)
  if (import.meta.env.VITE_API_URL) {
    let url = import.meta.env.VITE_API_URL.trim().replace(/\/$/, "");
    return url.endsWith("/api") ? url : `${url}/api`;
  }

  // 2. Local Development (localhost / 127.0.0.1 / local network IP)
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1" || hostname.startsWith("192.168.")) {
      return "http://localhost:5000/api";
    }
  }

  // 3. Production Default (Vercel Backend Serverless Gateway)
  return "https://highp-innovation-backend.vercel.app/api";
};

export const API_BASE_URL = getApiBaseUrl();
