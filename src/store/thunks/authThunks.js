import { createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5500";

const request = async (path, options = {}) => {
  const mergedHeaders = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: mergedHeaders,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.message || "Request failed";
    throw new Error(message);
  }
  return data;
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await request("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Unable to login");
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await request("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }
      return {
        ...data,
        pendingApproval: !data.token,
      };
    } catch (err) {
      return rejectWithValue(err.message || "Unable to sign up");
    }
  },
);

export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Not authenticated");

      const data = await request("/api/auth/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      return { ...data, token };
    } catch (err) {
      localStorage.removeItem("authToken");
      return rejectWithValue(err.message || "Unable to fetch session");
    }
  },
);

export const updateMyName = createAsyncThunk(
  "auth/updateMyName",
  async (fullName, { getState, rejectWithValue }) => {
    try {
      const token =
        getState().auth.token ||
        (typeof window !== "undefined" ? localStorage.getItem("authToken") : null);
      if (!token) throw new Error("Not authenticated");

      const data = await request("/api/auth/me", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ fullName }),
      });

      return data.user;
    } catch (err) {
      return rejectWithValue(err.message || "Unable to update name");
    }
  },
);
