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

export const fetchOwnerServices = createAsyncThunk(
  'services/fetchOwnerServices',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getAuthToken(getState())
      if (!token) throw new Error('Not authenticated')

      const data = await authedRequest('/api/services/admin', {
        method: 'GET',
        token,
      })

      return data.services || []
    } catch (err) {
      return rejectWithValue(err.message || 'Unable to load services')
    }
  },
)

export const createOwnerService = createAsyncThunk(
  'services/createOwnerService',
  async (payload, { getState, rejectWithValue }) => {
    try {
      const token = getAuthToken(getState())
      if (!token) throw new Error('Not authenticated')

      const data = await authedRequest('/api/services', {
        method: 'POST',
        token,
        body: JSON.stringify(payload),
      })

      return data.service
    } catch (err) {
      return rejectWithValue(err.message || 'Unable to create service')
    }
  },
)

export const updateOwnerService = createAsyncThunk(
  'services/updateOwnerService',
  async ({ serviceId, payload }, { getState, rejectWithValue }) => {
    try {
      const token = getAuthToken(getState())
      if (!token) throw new Error('Not authenticated')

      const data = await authedRequest(`/api/services/${serviceId}`, {
        method: 'PUT',
        token,
        body: JSON.stringify(payload),
      })

      return data.service
    } catch (err) {
      return rejectWithValue(err.message || 'Unable to update service')
    }
  },
)

export const deleteOwnerService = createAsyncThunk(
  'services/deleteOwnerService',
  async (serviceId, { getState, rejectWithValue }) => {
    try {
      const token = getAuthToken(getState())
      if (!token) throw new Error('Not authenticated')

      await authedRequest(`/api/services/${serviceId}`, {
        method: 'DELETE',
        token,
      })

      return serviceId
    } catch (err) {
      return rejectWithValue(err.message || 'Unable to delete service')
    }
  },
)
