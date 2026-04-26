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

export const fetchOwnerProjects = createAsyncThunk(
  'ownerProjects/fetchOwnerProjects',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getAuthToken(getState())
      if (!token) throw new Error('Not authenticated')

      const data = await authedRequest('/api/projects/admin', {
        method: 'GET',
        token,
      })

      return data.projects || []
    } catch (err) {
      return rejectWithValue(err.message || 'Unable to load projects')
    }
  },
)

export const createOwnerProject = createAsyncThunk(
  'ownerProjects/createOwnerProject',
  async (payload, { getState, rejectWithValue }) => {
    try {
      const token = getAuthToken(getState())
      if (!token) throw new Error('Not authenticated')

      const data = await authedRequest('/api/projects', {
        method: 'POST',
        token,
        body: JSON.stringify(payload),
      })

      return data.project
    } catch (err) {
      return rejectWithValue(err.message || 'Unable to create project')
    }
  },
)

export const updateOwnerProject = createAsyncThunk(
  'ownerProjects/updateOwnerProject',
  async ({ projectId, payload }, { getState, rejectWithValue }) => {
    try {
      const token = getAuthToken(getState())
      if (!token) throw new Error('Not authenticated')

      const data = await authedRequest(`/api/projects/${projectId}`, {
        method: 'PUT',
        token,
        body: JSON.stringify(payload),
      })

      return data.project
    } catch (err) {
      return rejectWithValue(err.message || 'Unable to update project')
    }
  },
)

export const deleteOwnerProject = createAsyncThunk(
  'ownerProjects/deleteOwnerProject',
  async (projectId, { getState, rejectWithValue }) => {
    try {
      const token = getAuthToken(getState())
      if (!token) throw new Error('Not authenticated')

      await authedRequest(`/api/projects/${projectId}`, {
        method: 'DELETE',
        token,
      })

      return projectId
    } catch (err) {
      return rejectWithValue(err.message || 'Unable to delete project')
    }
  },
)
