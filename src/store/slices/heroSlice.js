import { createSlice } from '@reduxjs/toolkit'
import {
  createOwnerHeroSlide,
  deleteOwnerHeroSlide,
  fetchOwnerHeroSlides,
  updateOwnerHeroSlide,
} from '../thunks/heroThunks'

const initialState = {
  items: [],
  status: 'idle',
  error: null,
}

const heroSlice = createSlice({
  name: 'hero',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOwnerHeroSlides.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchOwnerHeroSlides.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload || []
      })
      .addCase(fetchOwnerHeroSlides.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Unable to load hero slides'
      })
      .addCase(createOwnerHeroSlide.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(createOwnerHeroSlide.fulfilled, (state, action) => {
        state.status = 'succeeded'
        if (action.payload) {
          state.items = [action.payload, ...state.items]
        }
      })
      .addCase(createOwnerHeroSlide.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Unable to create hero slide'
      })
      .addCase(updateOwnerHeroSlide.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(updateOwnerHeroSlide.fulfilled, (state, action) => {
        state.status = 'succeeded'
        if (action.payload?._id) {
          state.items = state.items.map((item) => (item._id === action.payload._id ? action.payload : item))
        }
      })
      .addCase(updateOwnerHeroSlide.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Unable to update hero slide'
      })
      .addCase(deleteOwnerHeroSlide.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(deleteOwnerHeroSlide.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = state.items.filter((item) => item._id !== action.payload)
      })
      .addCase(deleteOwnerHeroSlide.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Unable to delete hero slide'
      })
  },
})

export default heroSlice.reducer
