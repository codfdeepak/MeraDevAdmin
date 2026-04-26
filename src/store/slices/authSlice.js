import { createSlice } from "@reduxjs/toolkit";
import {
  loginUser,
  registerUser,
  fetchMe,
  updateMyName,
} from "../thunks/authThunks";

const tokenFromStorage =
  typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

const initialState = {
  user: null,
  token: tokenFromStorage,
  status: "idle",
  error: null,
  signupNotice: null,
  mode: "login",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    toggleMode(state) {
      state.mode = state.mode === "login" ? "signup" : "login";
      state.error = null;
    },
    setMode(state, action) {
      state.mode = action.payload;
      state.error = null;
      state.signupNotice = null;
    },
    clearError(state) {
      state.error = null;
      state.signupNotice = null;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.signupNotice = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        const message = action.payload || "Login failed";
        const pendingApproval = String(message).toLowerCase().includes("pending approval");
        if (pendingApproval) {
          state.error = null;
          state.signupNotice = message;
        } else {
          state.error = message;
          state.signupNotice = null;
        }
      })
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.signupNotice = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload.pendingApproval) {
          state.user = null;
          state.token = null;
          state.signupNotice =
            action.payload?.message ||
            "Signup request sent. Wait for owner approval before login.";
        } else {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.signupNotice = null;
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Signup failed";
      })
      .addCase(fetchMe.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.status = "idle";
        state.user = null;
        state.token = null;
        state.error = action.payload || null;
      })
      .addCase(updateMyName.fulfilled, (state, action) => {
        if (state.user && action.payload?.fullName) {
          state.user.fullName = action.payload.fullName;
        }
      });
  },
});

export const { toggleMode, setMode, clearError, logout } = authSlice.actions;

export default authSlice.reducer;
