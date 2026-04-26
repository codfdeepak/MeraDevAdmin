import { createSlice } from '@reduxjs/toolkit'
import {
  createOwnerProject,
  deleteOwnerProject,
  fetchOwnerProjects,
  updateOwnerProject,
} from '../thunks/projectThunks'

const initialState = {
  items: [],
  status: 'idle',
  error: null,
}

const projectSlice = createSlice({
  name: 'ownerProjects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOwnerProjects.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchOwnerProjects.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload || []
      })
      .addCase(fetchOwnerProjects.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Unable to load projects'
      })
      .addCase(createOwnerProject.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(createOwnerProject.fulfilled, (state, action) => {
        state.status = 'succeeded'
        if (action.payload) {
          state.items = [action.payload, ...state.items]
        }
      })
      .addCase(createOwnerProject.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Unable to create project'
      })
      .addCase(updateOwnerProject.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(updateOwnerProject.fulfilled, (state, action) => {
        state.status = 'succeeded'
        if (action.payload?._id) {
          state.items = state.items.map((item) => (item._id === action.payload._id ? action.payload : item))
        }
      })
      .addCase(updateOwnerProject.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Unable to update project'
      })
      .addCase(deleteOwnerProject.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(deleteOwnerProject.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = state.items.filter((item) => item._id !== action.payload)
      })
      .addCase(deleteOwnerProject.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Unable to delete project'
      })
  },
})

export default projectSlice.reducer
