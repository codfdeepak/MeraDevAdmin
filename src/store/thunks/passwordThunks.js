import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../../config/api";

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

export const fetchMyPasswordMeta = createAsyncThunk(
  "password/fetchMyPasswordMeta",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("Not authenticated");

      const data = await authedRequest("/api/auth/me/password-meta", {
        method: "GET",
        token,
      });

      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Unable to fetch password details");
    }
  },
);

export const updateMyPassword = createAsyncThunk(
  "password/updateMyPassword",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("Not authenticated");

      const data = await authedRequest("/api/auth/me/password", {
        method: "PATCH",
        body: JSON.stringify(payload),
        token,
      });

      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Unable to update password");
    }
  },
);

