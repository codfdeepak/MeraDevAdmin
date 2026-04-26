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

export const fetchManagedUsers = createAsyncThunk(
  'users/fetchManagedUsers',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getAuthToken(getState())
      if (!token) throw new Error('Not authenticated')

      const data = await authedRequest('/api/auth/users', {
        method: 'GET',
        token,
      })

      return data.users || []
    } catch (err) {
      return rejectWithValue(err.message || 'Unable to load users')
    }
  },
)

export const updateManagedUserStatus = createAsyncThunk(
  'users/updateManagedUserStatus',
  async ({ userId, isActive }, { getState, rejectWithValue }) => {
    try {
      const token = getAuthToken(getState())
      if (!token) throw new Error('Not authenticated')

      const data = await authedRequest(`/api/auth/users/${userId}/status`, {
        method: 'PATCH',
        token,
        body: JSON.stringify({ isActive }),
      })

      return data.user
    } catch (err) {
      return rejectWithValue(err.message || 'Unable to update user status')
    }
  },
)

export const updateManagedUserApproval = createAsyncThunk(
  'users/updateManagedUserApproval',
  async ({ userId, approvalStatus }, { getState, rejectWithValue }) => {
    try {
      const token = getAuthToken(getState())
      if (!token) throw new Error('Not authenticated')

      const data = await authedRequest(`/api/auth/users/${userId}/approval`, {
        method: 'PATCH',
        token,
        body: JSON.stringify({ approvalStatus }),
      })

      return data.user
    } catch (err) {
      return rejectWithValue(err.message || 'Unable to update user approval')
    }
  },
)

export const deleteManagedUser = createAsyncThunk(
  'users/deleteManagedUser',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const token = getAuthToken(getState())
      if (!token) throw new Error('Not authenticated')

      await authedRequest(`/api/auth/users/${userId}`, {
        method: 'DELETE',
        token,
      })

      return userId
    } catch (err) {
      return rejectWithValue(err.message || 'Unable to delete user')
    }
  },
)

export const resetManagedUserPassword = createAsyncThunk(
  'users/resetManagedUserPassword',
  async ({ userId, newPassword }, { getState, rejectWithValue }) => {
    try {
      const token = getAuthToken(getState())
      if (!token) throw new Error('Not authenticated')

      const data = await authedRequest(`/api/auth/users/${userId}/password`, {
        method: 'PATCH',
        token,
        body: JSON.stringify({ newPassword }),
      })

      return data.user
    } catch (err) {
      return rejectWithValue(err.message || 'Unable to reset password')
    }
  },
)
