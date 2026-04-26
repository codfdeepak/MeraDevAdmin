import { createSlice } from '@reduxjs/toolkit'
import { fetchOwnerConsultations } from '../thunks/consultationThunks'

const initialState = {
  items: [],
  status: 'idle',
  error: null,
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
  },
})

export default consultationSlice.reducer
