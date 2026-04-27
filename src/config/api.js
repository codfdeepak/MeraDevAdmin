const LOCAL_API_URL = "http://localhost:5500";
const LIVE_API_URL = "https://meradevbackend.onrender.com";

const normalizeUrl = (url = "") => url.trim().replace(/\/$/, "");

const getDefaultApiUrl = () => {
  if (typeof window !== "undefined") {
    const currentHost = window.location.hostname;
    if (currentHost === "localhost" || currentHost === "127.0.0.1") {
      return LOCAL_API_URL;
    }
  }

  return LIVE_API_URL;
};

export const API_URL = normalizeUrl(import.meta.env.VITE_API_URL) || getDefaultApiUrl();
