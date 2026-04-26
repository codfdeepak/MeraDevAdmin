import { createAsyncThunk } from '@reduxjs/toolkit'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5500'

const authedRequest = async (path, { token, ...options }) => {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data?.message || 'Request failed')
  }

  return data
}

export const fetchOwnerConsultations = createAsyncThunk(
  'consultations/fetchOwnerConsultations',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('authToken')
      if (!token) throw new Error('Not authenticated')

      const data = await authedRequest('/api/consultations/admin', {
        method: 'GET',
        token,
      })

      return data.consultations || []
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to load consultations')
    }
  },
)
