import { createSlice } from '@reduxjs/toolkit'
import {
  createOwnerService,
  deleteOwnerService,
  fetchOwnerServices,
  updateOwnerService,
} from '../thunks/serviceThunks'

const initialState = {
  items: [],
  status: 'idle',
  error: null,
}

const serviceSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOwnerServices.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchOwnerServices.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload || []
      })
      .addCase(fetchOwnerServices.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Unable to load services'
      })
      .addCase(createOwnerService.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(createOwnerService.fulfilled, (state, action) => {
        state.status = 'succeeded'
        if (action.payload) {
          state.items = [action.payload, ...state.items]
        }
      })
      .addCase(createOwnerService.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Unable to create service'
      })
      .addCase(updateOwnerService.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(updateOwnerService.fulfilled, (state, action) => {
        state.status = 'succeeded'
        if (action.payload?._id) {
          state.items = state.items.map((item) => (item._id === action.payload._id ? action.payload : item))
        }
      })
      .addCase(updateOwnerService.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Unable to update service'
      })
      .addCase(deleteOwnerService.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(deleteOwnerService.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = state.items.filter((item) => item._id !== action.payload)
      })
      .addCase(deleteOwnerService.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Unable to delete service'
      })
  },
})

export default serviceSlice.reducer
