import { createSlice } from '@reduxjs/toolkit'
import {
  deleteManagedUser,
  fetchManagedUsers,
  resetManagedUserPassword,
  updateManagedUserAnalyticsAccess,
  updateManagedUserPartnerCategory,
  updateManagedUserPartnerVisibility,
  updateManagedUserApproval,
  updateManagedUserStatus,
} from '../thunks/userManagementThunks'

const initialState = {
  items: [],
  status: 'idle',
  error: null,
}

const userManagementSlice = createSlice({
  name: 'userManagement',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchManagedUsers.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchManagedUsers.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload || []
      })
      .addCase(fetchManagedUsers.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Unable to load users'
      })
      .addCase(updateManagedUserStatus.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(updateManagedUserStatus.fulfilled, (state, action) => {
        state.status = 'succeeded'
        if (action.payload?.id) {
          state.items = state.items.map((item) =>
            item.id === action.payload.id ? action.payload : item,
          )
        }
      })
      .addCase(updateManagedUserStatus.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Unable to update user status'
      })
      .addCase(updateManagedUserApproval.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(updateManagedUserApproval.fulfilled, (state, action) => {
        state.status = 'succeeded'
        if (action.payload?.id) {
          state.items = state.items.map((item) =>
            item.id === action.payload.id ? action.payload : item,
          )
        }
      })
      .addCase(updateManagedUserApproval.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Unable to update user approval'
      })
      .addCase(updateManagedUserAnalyticsAccess.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(updateManagedUserAnalyticsAccess.fulfilled, (state, action) => {
        state.status = 'succeeded'
        if (action.payload?.id) {
          state.items = state.items.map((item) =>
            item.id === action.payload.id ? action.payload : item,
          )
        }
      })
      .addCase(updateManagedUserAnalyticsAccess.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Unable to update user analytics access'
      })
      .addCase(updateManagedUserPartnerVisibility.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(updateManagedUserPartnerVisibility.fulfilled, (state, action) => {
        state.status = 'succeeded'
        if (action.payload?.id) {
          state.items = state.items.map((item) =>
            item.id === action.payload.id ? action.payload : item,
          )
        }
      })
      .addCase(updateManagedUserPartnerVisibility.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Unable to update partner page visibility'
      })
      .addCase(updateManagedUserPartnerCategory.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(updateManagedUserPartnerCategory.fulfilled, (state, action) => {
        state.status = 'succeeded'
        if (action.payload?.id) {
          state.items = state.items.map((item) =>
            item.id === action.payload.id ? action.payload : item,
          )
        }
      })
      .addCase(updateManagedUserPartnerCategory.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Unable to update partner category'
      })
      .addCase(deleteManagedUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(deleteManagedUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = state.items.filter((item) => item.id !== action.payload)
      })
      .addCase(deleteManagedUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Unable to delete user'
      })
      .addCase(resetManagedUserPassword.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(resetManagedUserPassword.fulfilled, (state, action) => {
        state.status = 'succeeded'
        if (action.payload?.id) {
          state.items = state.items.map((item) =>
            item.id === action.payload.id ? action.payload : item,
          )
        }
      })
      .addCase(resetManagedUserPassword.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Unable to reset password'
      })
  },
})

export default userManagementSlice.reducer
