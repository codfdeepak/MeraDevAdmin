import { createAsyncThunk } from '@reduxjs/toolkit'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5500'

const authedRequest = async (path, { token, ...options }) => {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data?.message || 'Request failed')
  }

  return data
}

const getAuthToken = (state) => state.auth.token || localStorage.getItem('authToken')

export const fetchOwnerHeroSlides = createAsyncThunk(
  'hero/fetchOwnerHeroSlides',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getAuthToken(getState())
      if (!token) throw new Error('Not authenticated')

      const data = await authedRequest('/api/hero/admin', {
        method: 'GET',
        token,
      })

      return data.slides || []
    } catch (err) {
      return rejectWithValue(err.message || 'Unable to load hero slides')
    }
  },
)

export const createOwnerHeroSlide = createAsyncThunk(
  'hero/createOwnerHeroSlide',
  async (payload, { getState, rejectWithValue }) => {
    try {
      const token = getAuthToken(getState())
      if (!token) throw new Error('Not authenticated')

      const data = await authedRequest('/api/hero', {
        method: 'POST',
        token,
        body: JSON.stringify(payload),
      })

      return data.slide
    } catch (err) {
      return rejectWithValue(err.message || 'Unable to create hero slide')
    }
  },
)

export const updateOwnerHeroSlide = createAsyncThunk(
  'hero/updateOwnerHeroSlide',
  async ({ heroId, payload }, { getState, rejectWithValue }) => {
    try {
      const token = getAuthToken(getState())
      if (!token) throw new Error('Not authenticated')

      const data = await authedRequest(`/api/hero/${heroId}`, {
        method: 'PUT',
        token,
        body: JSON.stringify(payload),
      })

      return data.slide
    } catch (err) {
      return rejectWithValue(err.message || 'Unable to update hero slide')
    }
  },
)

export const deleteOwnerHeroSlide = createAsyncThunk(
  'hero/deleteOwnerHeroSlide',
  async (heroId, { getState, rejectWithValue }) => {
    try {
      const token = getAuthToken(getState())
      if (!token) throw new Error('Not authenticated')

      await authedRequest(`/api/hero/${heroId}`, {
        method: 'DELETE',
        token,
      })

      return heroId
    } catch (err) {
      return rejectWithValue(err.message || 'Unable to delete hero slide')
    }
  },
)
