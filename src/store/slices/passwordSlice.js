import { createSlice } from "@reduxjs/toolkit";
import { fetchMyPasswordMeta, updateMyPassword } from "../thunks/passwordThunks";

const initialState = {
  hasPassword: false,
  maskedPassword: "",
  revealSupported: false,
  note: "",
  status: "idle",
  updateStatus: "idle",
  error: null,
  updateError: null,
  updateMessage: "",
};

const passwordSlice = createSlice({
  name: "password",
  initialState,
  reducers: {
    clearPasswordUpdateMessage(state) {
      state.updateMessage = "";
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyPasswordMeta.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMyPasswordMeta.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.hasPassword = Boolean(action.payload?.hasPassword);
        state.maskedPassword = String(action.payload?.maskedPassword || "");
        state.revealSupported = Boolean(action.payload?.revealSupported);
        state.note = String(action.payload?.note || "");
      })
      .addCase(fetchMyPasswordMeta.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unable to fetch password details";
      })
      .addCase(updateMyPassword.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
        state.updateMessage = "";
      })
      .addCase(updateMyPassword.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        state.updateMessage =
          String(action.payload?.message || "") || "Password updated successfully";
      })
      .addCase(updateMyPassword.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload || "Unable to update password";
      });
  },
});

export const { clearPasswordUpdateMessage } = passwordSlice.actions;

export default passwordSlice.reducer;

