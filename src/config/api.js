const LOCAL_API_URL = "http://localhost:5500";
const LIVE_API_URL = "https://api.meradevtechnologies.com";

const normalizeUrl = (url = "") => url.trim().replace(/\/$/, "");
const isPrivateIPv4 = (host = "") => {
  const parts = host.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) {
    return false;
  }
  if (parts[0] === 10) return true;
  if (parts[0] === 192 && parts[1] === 168) return true;
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  return false;
};

const getDefaultApiUrl = () => {
  if (typeof window !== "undefined") {
    const currentHost = window.location.hostname;
    if (
      currentHost === "localhost" ||
      currentHost === "127.0.0.1" ||
      currentHost === "::1"
    ) {
      return LOCAL_API_URL;
    }

    // iPhone or any LAN device testing local Vite build by IP/hostname.
    if (isPrivateIPv4(currentHost) || currentHost.endsWith(".local")) {
      return `http://${currentHost}:5500`;
    }
  }

  return LIVE_API_URL;
};

export const API_URL = normalizeUrl(import.meta.env.VITE_API_URL) || getDefaultApiUrl();
