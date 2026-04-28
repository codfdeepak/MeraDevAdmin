import { createAsyncThunk } from '@reduxjs/toolkit'
import { API_URL } from '../../config/api'

const DEFAULT_RANGE = 'last_1h'

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

const asValidDate = (value) => {
  const date = value ? new Date(value) : null
  return date && !Number.isNaN(date.getTime()) ? date : null
}

const resolveDateRange = (filters = {}) => {
  const now = new Date()
  const timeRange = String(filters.timeRange || DEFAULT_RANGE).trim().toLowerCase()

  let startAt = null
  let endAt = new Date(now.getTime())

  if (timeRange === 'today') {
    startAt = new Date(now.getTime())
    startAt.setHours(0, 0, 0, 0)
  } else if (timeRange === 'last_24h') {
    startAt = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  } else if (timeRange === 'last_7d') {
    startAt = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  } else if (timeRange === 'last_30d') {
    startAt = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  } else if (timeRange === 'custom') {
    startAt = asValidDate(filters.startAt)
    endAt = asValidDate(filters.endAt) || endAt
  } else {
    startAt = new Date(now.getTime() - 60 * 60 * 1000)
  }

  if (!startAt) {
    startAt = new Date(now.getTime() - 60 * 60 * 1000)
  }

  if (startAt.getTime() > endAt.getTime()) {
    const tmp = startAt
    startAt = endAt
    endAt = tmp
  }

  return {
    timeRange:
      timeRange === 'today' ||
      timeRange === 'last_24h' ||
      timeRange === 'last_7d' ||
      timeRange === 'last_30d' ||
      timeRange === 'custom' ||
      timeRange === 'last_1h'
        ? timeRange
        : DEFAULT_RANGE,
    startAt,
    endAt,
  }
}

const normalizeFilter = (value, fallback = 'all') => {
  const normalized = String(value || '').trim()
  return normalized ? normalized : fallback
}

const buildAnalyticsRequestContext = (state, filtersArg = {}) => {
  const stateFilters = state.analytics?.filters || {}
  const mergedFilters = {
    ...stateFilters,
    ...(filtersArg && typeof filtersArg === 'object' ? filtersArg : {}),
  }

  const { timeRange, startAt, endAt } = resolveDateRange(mergedFilters)
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'

  const query = new URLSearchParams({
    timezone,
    startAt: startAt.toISOString(),
    endAt: endAt.toISOString(),
  })

  const eventType = normalizeFilter(mergedFilters.eventType, 'all')
  const status = normalizeFilter(mergedFilters.status, 'all')
  const path = normalizeFilter(mergedFilters.path, 'all')
  const chartGranularity = normalizeFilter(mergedFilters.chartGranularity, 'auto')

  if (eventType.toLowerCase() !== 'all') query.set('eventType', eventType)
  if (status.toLowerCase() !== 'all') query.set('status', status)
  if (path.toLowerCase() !== 'all') query.set('path', path)
  if (chartGranularity) query.set('chartGranularity', chartGranularity)

  return {
    query,
    requestFilters: {
      ...mergedFilters,
      timeRange,
      startAt: startAt.toISOString(),
      endAt: endAt.toISOString(),
      eventType,
      status,
      path,
      chartGranularity,
    },
  }
}

export const fetchOwnerAnalytics = createAsyncThunk(
  'analytics/fetchOwnerAnalytics',
  async (filtersArg = {}, { getState, rejectWithValue }) => {
    try {
      const state = getState()
      const token = getAuthToken(state)
      if (!token) throw new Error('Not authenticated')

      const { query, requestFilters } = buildAnalyticsRequestContext(state, filtersArg)

      const data = await authedRequest(`/api/analytics/owner/dashboard?${query.toString()}`, {
        method: 'GET',
        token,
      })

      return {
        analytics: data.analytics || null,
        requestFilters,
      }
    } catch (err) {
      return rejectWithValue(err.message || 'Unable to load analytics')
    }
  },
)

export const fetchOwnerVisitorJourney = createAsyncThunk(
  'analytics/fetchOwnerVisitorJourney',
  async (payload = {}, { getState, rejectWithValue }) => {
    try {
      const visitorKey = String(payload?.visitorKey || '').trim()
      if (!visitorKey) throw new Error('Visitor key is required')

      const state = getState()
      const token = getAuthToken(state)
      if (!token) throw new Error('Not authenticated')

      const { query, requestFilters } = buildAnalyticsRequestContext(state, payload?.filters || {})
      query.set('visitor', visitorKey)

      const data = await authedRequest(`/api/analytics/owner/visitor-journey?${query.toString()}`, {
        method: 'GET',
        token,
      })

      return {
        visitorKey,
        journey: data.visitorJourney || null,
        requestFilters,
      }
    } catch (err) {
      return rejectWithValue(err.message || 'Unable to load visitor journey')
    }
  },
)
