import { createSlice } from '@reduxjs/toolkit'
import {
  fetchOwnerConsultations,
  deleteOwnerConsultation,
} from '../thunks/consultationThunks'

const initialState = {
  items: [],
  status: 'idle',
  error: null,
  deletingById: {},
  deleteError: null,
}

const consultationSlice = createSlice({
  name: 'consultations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOwnerConsultations.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchOwnerConsultations.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload || []
      })
      .addCase(fetchOwnerConsultations.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Unable to load consultations'
      })
      .addCase(deleteOwnerConsultation.pending, (state, action) => {
        const consultationId = action.meta.arg
        state.deleteError = null
        if (consultationId) {
          state.deletingById[consultationId] = true
        }
      })
      .addCase(deleteOwnerConsultation.fulfilled, (state, action) => {
        const consultationId = action.payload
        if (consultationId) {
          state.items = state.items.filter((item) => item?._id !== consultationId)
          delete state.deletingById[consultationId]
        }
      })
      .addCase(deleteOwnerConsultation.rejected, (state, action) => {
        const consultationId = action.meta.arg
        if (consultationId) {
          delete state.deletingById[consultationId]
        }
        state.deleteError = action.payload || 'Unable to delete consultation'
      })
  },
})

export default consultationSlice.reducer
