import { createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5500";

const authedRequest = async (path, { token, ...options }) => {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.message || "Request failed";
    throw new Error(message);
  }
  return data;
};

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("Not authenticated");
      const data = await authedRequest("/api/profile/me", {
        method: "GET",
        token,
      });
      return data.profile;
    } catch (err) {
      if (err?.message === "Profile not found" || err?.message === "Profile not set yet") {
        return null;
      }
      return rejectWithValue(err.message);
    }
  },
);

export const saveProfile = createAsyncThunk(
  "profile/saveProfile",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("Not authenticated");
      const data = await authedRequest("/api/profile/me", {
        method: "PUT",
        body: JSON.stringify(payload),
        token,
      });
      return data.profile;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);
