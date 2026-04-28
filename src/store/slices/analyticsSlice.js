import { createSlice } from '@reduxjs/toolkit'
import { fetchOwnerAnalytics, fetchOwnerVisitorJourney } from '../thunks/analyticsThunks'

const initialState = {
  dashboard: null,
  status: 'idle',
  error: null,
  lastUpdatedAt: null,
  filters: {
    timeRange: 'last_1h',
    startAt: '',
    endAt: '',
    eventType: 'all',
    status: 'all',
    path: 'all',
    chartGranularity: 'auto',
  },
  selectedVisitorKey: '',
  visitorJourney: null,
  visitorJourneyStatus: 'idle',
  visitorJourneyError: null,
}

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setAnalyticsFilters: (state, action) => {
      const payload = action.payload && typeof action.payload === 'object' ? action.payload : {}
      state.filters = {
        ...state.filters,
        ...payload,
      }
    },
    setSelectedVisitorKey: (state, action) => {
      state.selectedVisitorKey = String(action.payload || '').trim()
      if (!state.selectedVisitorKey) {
        state.visitorJourney = null
        state.visitorJourneyStatus = 'idle'
        state.visitorJourneyError = null
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOwnerAnalytics.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchOwnerAnalytics.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.dashboard = action.payload?.analytics || null
        state.lastUpdatedAt = new Date().toISOString()

        if (action.payload?.requestFilters) {
          state.filters = {
            ...state.filters,
            ...action.payload.requestFilters,
          }
        }

        const applied = action.payload?.analytics?.filtersApplied || {}
        if (applied.chartGranularity) {
          state.filters.chartGranularity = applied.chartGranularity
        }
        if (applied.path) {
          state.filters.path = applied.path
        }

        const visitorItems = Array.isArray(action.payload?.analytics?.visitorOverview?.items)
          ? action.payload.analytics.visitorOverview.items
          : []

        if (
          state.selectedVisitorKey &&
          !visitorItems.some((item) => String(item?.visitorKey || '') === state.selectedVisitorKey)
        ) {
          state.selectedVisitorKey = ''
          state.visitorJourney = null
          state.visitorJourneyStatus = 'idle'
          state.visitorJourneyError = null
        }
      })
      .addCase(fetchOwnerAnalytics.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Unable to load analytics'
      })
      .addCase(fetchOwnerVisitorJourney.pending, (state, action) => {
        state.visitorJourneyStatus = 'loading'
        state.visitorJourneyError = null
        const visitorKey = String(action.meta.arg?.visitorKey || '').trim()
        if (visitorKey) {
          state.selectedVisitorKey = visitorKey
        }
      })
      .addCase(fetchOwnerVisitorJourney.fulfilled, (state, action) => {
        state.visitorJourneyStatus = 'succeeded'
        state.visitorJourney = action.payload?.journey || null

        if (action.payload?.requestFilters) {
          state.filters = {
            ...state.filters,
            ...action.payload.requestFilters,
          }
        }

        const visitorKey = String(action.payload?.visitorKey || '').trim()
        if (visitorKey) {
          state.selectedVisitorKey = visitorKey
        }
      })
      .addCase(fetchOwnerVisitorJourney.rejected, (state, action) => {
        state.visitorJourneyStatus = 'failed'
        state.visitorJourneyError = action.payload || 'Unable to load visitor journey'
      })
  },
})

export const { setAnalyticsFilters, setSelectedVisitorKey } = analyticsSlice.actions
export default analyticsSlice.reducer
