import { useEffect, useMemo, useRef, useState } from 'react'

const RANGE_OPTIONS = [
  { key: 'last_1h', label: 'Last 1 Hour' },
  { key: 'today', label: 'Today' },
  { key: 'last_24h', label: 'Last 24 Hours' },
  { key: 'last_7d', label: 'Last 7 Days' },
  { key: 'last_30d', label: 'Last 30 Days' },
  { key: 'custom', label: 'Custom Range' },
]

const DEFAULT_FILTERS = {
  timeRange: 'last_1h',
  startAt: '',
  endAt: '',
  eventType: 'all',
  status: 'all',
  path: 'all',
  chartGranularity: 'auto',
}

const EVENT_TYPE_LABELS = {
  page_view: 'Page View',
  click: 'Click',
  api_call: 'API Call',
  form_submit: 'Form Submit',
  error: 'Error',
  session_start: 'Session Start',
  custom: 'Custom',
}

const numberFormatter = new Intl.NumberFormat('en-IN')

const asList = (value) => (Array.isArray(value) ? value : [])

const toDatetimeLocalValue = (isoString) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return ''

  const pad = (value) => String(value).padStart(2, '0')
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hour = pad(date.getHours())
  const minute = pad(date.getMinutes())
  return `${year}-${month}-${day}T${hour}:${minute}`
}

const toIsoFromDatetimeLocal = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString()
}

const formatBucketTimestamp = (value) => {
  const date = value ? new Date(value) : null
  if (!date || Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

const formatShortDateTime = (value) => {
  const date = value ? new Date(value) : null
  if (!date || Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

const formatDuration = (secondsValue) => {
  const seconds = Math.max(0, Number(secondsValue) || 0)
  if (!seconds) return '0s'
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  const parts = []
  if (days) parts.push(`${days}d`)
  if (hours) parts.push(`${hours}h`)
  if (minutes) parts.push(`${minutes}m`)
  if (!parts.length || secs) parts.push(`${secs}s`)
  return parts.slice(0, 3).join(' ')
}

const toSmartTimelinePoint = (item, index) => {
  const visits = Number(item?.pageViews || item?.total || 0)
  const unique = Number(item?.uniqueVisitors || 0)

  return {
    ...item,
    key: item?.key || `timeline-${index}`,
    visits,
    unique,
  }
}

const SmartTrafficGraph = ({ points, activeIndex, onHoverPoint }) => {
  const data = asList(points)
  if (!data.length) {
    return (
      <div className="analytics-empty analytics-smart-empty">
        <p className="muted">No traffic recorded in selected filters.</p>
      </div>
    )
  }

  const pointGap = data.length <= 16 ? 46 : data.length <= 32 ? 34 : data.length <= 64 ? 24 : 18
  const width = Math.max(560, 76 + Math.max(0, data.length - 1) * pointGap)
  const height = 250
  const padLeft = 48
  const padRight = 20
  const padTop = 20
  const padBottom = 40
  const chartWidth = width - padLeft - padRight
  const chartHeight = height - padTop - padBottom
  const chartBottom = height - padBottom

  const maxPoint = Math.max(1, ...data.flatMap((item) => [Number(item.visits || 0), Number(item.unique || 0)]))

  const xFor = (index) => {
    if (data.length === 1) return width / 2
    return padLeft + (index * chartWidth) / (data.length - 1)
  }

  const yFor = (value) => chartBottom - (Number(value || 0) / maxPoint) * chartHeight

  const buildLine = (seriesKey) =>
    data
      .map((item, index) => `${index === 0 ? 'M' : 'L'} ${xFor(index)} ${yFor(item?.[seriesKey] || 0)}`)
      .join(' ')

  const areaPath =
    data.length > 0
      ? [
          `M ${xFor(0)} ${chartBottom}`,
          ...data.map((item, index) => `L ${xFor(index)} ${yFor(item.visits)}`),
          `L ${xFor(data.length - 1)} ${chartBottom}`,
          'Z',
        ].join(' ')
      : ''

  const safeActiveIndex =
    activeIndex >= 0 && activeIndex < data.length
      ? activeIndex
      : data.length - 1

  const activePoint = data[safeActiveIndex]
  const activeX = xFor(safeActiveIndex)
  const axisLabelStep = data.length <= 10 ? 1 : data.length <= 22 ? 2 : data.length <= 44 ? 4 : 6
  const activeXPercent = chartWidth > 0 ? ((activeX - padLeft) / chartWidth) * 100 : 50
  const tooltipLeft = Math.max(10, Math.min(90, activeXPercent))

  return (
    <div className="smart-line-chart smart-line-chart-dark">
      {activePoint && (
        <div className="analytics-graph-tooltip" style={{ left: `${tooltipLeft}%` }}>
          <strong>{activePoint.label || "Traffic Bucket"}</strong>
          <p>Visits: {numberFormatter.format(activePoint.visits || 0)}</p>
          <p>Unique: {numberFormatter.format(activePoint.unique || 0)}</p>
        </div>
      )}

      <div className="smart-line-chart-scroll">
        <svg
          className="analytics-traffic-svg"
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label="Smart website traffic graph"
          style={{ minWidth: `${width}px`, height: `${height}px` }}
        >
          <defs>
            <linearGradient id="trafficAreaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#21d4fd" stopOpacity="0.44" />
              <stop offset="100%" stopColor="#21d4fd" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="trafficBarFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1ad9ff" stopOpacity="0.62" />
              <stop offset="100%" stopColor="#1ad9ff" stopOpacity="0.06" />
            </linearGradient>
          </defs>

          {Array.from({ length: 5 }, (_, idx) => {
            const ratio = idx / 4
            const y = padTop + chartHeight * ratio
            const value = Math.round(maxPoint * (1 - ratio))
            return (
              <g key={`grid-${idx}`}>
                <line x1={padLeft} y1={y} x2={width - padRight} y2={y} className="analytics-grid-line analytics-grid-line-dark" />
                <text x={16} y={y + 4} className="analytics-axis-label analytics-axis-label-dark">
                  {numberFormatter.format(value)}
                </text>
              </g>
            )
          })}

          <path d={areaPath} fill="url(#trafficAreaFill)" className="analytics-area-path" />

          {data.map((item, index) => {
            const x = xFor(index)
            return (
              <line
                key={`${item.key}-bar`}
                x1={x}
                y1={chartBottom}
                x2={x}
                y2={yFor(item.visits)}
                className="analytics-visit-bar"
              />
            )
          })}

          <path d={buildLine('visits')} fill="none" stroke="#21d4fd" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="analytics-line-path analytics-visits-path" />
          <path d={buildLine('unique')} fill="none" stroke="#de3fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="analytics-line-path analytics-unique-path" />

          {data.map((item, index) => (
            <g key={`${item.key}-dots`}>
              <circle cx={xFor(index)} cy={yFor(item.visits)} r="2.1" className="analytics-point-dot analytics-point-dot-visits" />
              <circle cx={xFor(index)} cy={yFor(item.unique)} r="1.9" className="analytics-point-dot analytics-point-dot-unique" />
            </g>
          ))}

          {activePoint && (
            <g>
              <line
                x1={activeX}
                y1={padTop}
                x2={activeX}
                y2={chartBottom}
                className="analytics-active-line"
              />
              <circle cx={activeX} cy={yFor(activePoint.visits)} r="4.8" className="analytics-active-dot analytics-active-dot-visits" />
              <circle cx={activeX} cy={yFor(activePoint.unique)} r="4.2" className="analytics-active-dot analytics-active-dot-unique" />
            </g>
          )}

          {data.map((item, index) => {
            const x = xFor(index)
            const shouldShow = index % axisLabelStep === 0 || index === data.length - 1
            return shouldShow ? (
              <text key={`${item.key}-label`} x={x} y={height - 14} textAnchor="middle" className="analytics-x-label-dark">
                {item.label || '-'}
              </text>
            ) : null
          })}

          {data.map((item, index) => {
            const x = xFor(index)
            return (
              <circle
                key={`${item.key}-hit`}
                cx={x}
                cy={chartBottom - chartHeight / 2}
                r={Math.max(13, chartWidth / Math.max(data.length * 2.7, 4))}
                className="analytics-hit-area"
                onMouseEnter={() => onHoverPoint?.(index)}
                onTouchStart={() => onHoverPoint?.(index)}
                onFocus={() => onHoverPoint?.(index)}
                tabIndex={0}
                aria-label={`Traffic bucket ${item.label || index + 1}`}
              />
            )
          })}
        </svg>
      </div>
    </div>
  )
}

const TopList = ({ title, items, itemKey }) => (
  <div className="analytics-top-card">
    <h4>{title}</h4>
    {!items.length && <p className="muted">No records yet.</p>}
    {!!items.length && (
      <ul className="analytics-top-list">
        {items.map((item, index) => (
          <li key={`${item[itemKey]}-${index}`}>
            <span title={item[itemKey]}>{item[itemKey]}</span>
            <strong>{numberFormatter.format(item.count || 0)}</strong>
          </li>
        ))}
      </ul>
    )}
  </div>
)

function AnalyticsPanel({
  canAccessAnalytics,
  status,
  error,
  dashboard,
  filters,
  selectedVisitorKey,
  visitorJourney,
  visitorJourneyStatus,
  visitorJourneyError,
  onSetFilters,
  onRefresh,
  onSelectVisitor,
}) {
  const [draft, setDraft] = useState(DEFAULT_FILTERS)
  const [activeBucketIndex, setActiveBucketIndex] = useState(-1)
  const lastAutoSelectRef = useRef('')
  const lastJourneySyncRef = useRef('')

  useEffect(() => {
    setDraft({
      ...DEFAULT_FILTERS,
      ...(filters && typeof filters === 'object' ? filters : {}),
    })
  }, [filters])

  const summary = dashboard?.summary || {}
  const timelineData = asList(dashboard?.timeline)
  const topPages = asList(dashboard?.topPages)
  const pageTraffic = asList(dashboard?.pageTraffic).slice(0, 12)
  const visitorItems = asList(dashboard?.visitorOverview?.items)

  const smartTimeline = useMemo(
    () => timelineData.map((item, index) => toSmartTimelinePoint(item, index)),
    [timelineData],
  )

  useEffect(() => {
    if (!smartTimeline.length) {
      setActiveBucketIndex(-1)
      return
    }
    setActiveBucketIndex(smartTimeline.length - 1)
  }, [smartTimeline])

  const selectedBucket =
    smartTimeline[
      activeBucketIndex >= 0 && activeBucketIndex < smartTimeline.length
        ? activeBucketIndex
        : smartTimeline.length - 1
    ] || null
  const peakVisitsBucket = smartTimeline.reduce(
    (best, item) => (!best || Number(item.visits || 0) > Number(best.visits || 0) ? item : best),
    null,
  )
  const peakUniqueBucket = smartTimeline.reduce(
    (best, item) => (!best || Number(item.unique || 0) > Number(best.unique || 0) ? item : best),
    null,
  )
  const averageVisits = smartTimeline.length
    ? Math.round(
      smartTimeline.reduce((sum, item) => sum + Number(item.visits || 0), 0) /
          smartTimeline.length,
    )
    : 0

  const metricItems = [
    { label: 'Total Visitors', value: summary.uniqueVisitors || 0 },
    { label: 'Visitors Last 1h', value: summary.visitorsLast1Hour || 0 },
    { label: 'Visitors Last 24h', value: summary.visitorsLast24Hours || 0 },
    { label: 'Visitors Last 7d', value: summary.visitorsLast7Days || 0 },
    { label: 'Page Views', value: summary.pageViews || 0 },
    { label: 'Clicks', value: summary.clicks || 0 },
    { label: 'Form Submissions', value: summary.formSubmissions || 0 },
    { label: 'Sessions', value: summary.uniqueSessions || 0 },
  ]

  const hasFilterChanges = useMemo(() => {
    const source = filters && typeof filters === 'object' ? filters : DEFAULT_FILTERS
    return (
      String(source.timeRange || '') !== String(draft.timeRange || '') ||
      String(source.startAt || '') !== String(draft.startAt || '') ||
      String(source.endAt || '') !== String(draft.endAt || '') ||
      String(source.eventType || '') !== String(draft.eventType || '') ||
      String(source.status || '') !== String(draft.status || '') ||
      String(source.path || '') !== String(draft.path || '') ||
      String(source.chartGranularity || '') !== String(draft.chartGranularity || '')
    )
  }, [draft, filters])

  const selectedVisitorSummary = visitorItems.find(
    (item) => String(item?.visitorKey || '') === String(selectedVisitorKey || ''),
  )

  const hasJourneyForSelected =
    visitorJourney &&
    String(visitorJourney?.visitorKey || '') === String(selectedVisitorKey || '')

  useEffect(() => {
    if (!visitorItems.length) return

    const selected = String(selectedVisitorKey || '')
    const selectedExists = selected
      ? visitorItems.some((item) => String(item?.visitorKey || '') === selected)
      : false

    if (selectedExists) return

    const firstVisitorKey = String(visitorItems[0]?.visitorKey || '').trim()
    if (!firstVisitorKey || firstVisitorKey === lastAutoSelectRef.current) return

    lastAutoSelectRef.current = firstVisitorKey
    onSelectVisitor?.(firstVisitorKey)
  }, [visitorItems, selectedVisitorKey, onSelectVisitor])

  useEffect(() => {
    const generatedAt = String(dashboard?.generatedAt || '')
    const selected = String(selectedVisitorKey || '').trim()
    if (!generatedAt || !selected) return
    if (!visitorItems.some((item) => String(item?.visitorKey || '') === selected)) return

    const syncKey = `${generatedAt}|${selected}`
    if (lastJourneySyncRef.current === syncKey) return

    lastJourneySyncRef.current = syncKey
    onSelectVisitor?.(selected)
  }, [dashboard?.generatedAt, selectedVisitorKey, visitorItems, onSelectVisitor])

  if (!canAccessAnalytics) {
    return <p className="muted">Owner has not enabled web analytics access for your account yet.</p>
  }

  const setDraftValue = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  const applyQuickRange = (rangeKey) => {
    const nextFilters = {
      ...draft,
      timeRange: rangeKey,
    }
    if (rangeKey !== 'custom') {
      nextFilters.startAt = ''
      nextFilters.endAt = ''
    }
    setDraft(nextFilters)
    onSetFilters?.(nextFilters)
    if (rangeKey !== 'custom') {
      onRefresh?.(nextFilters)
    }
  }

  const applyFilters = () => {
    const nextFilters = {
      ...draft,
    }
    onSetFilters?.(nextFilters)
    onRefresh?.(nextFilters)
  }

  const resetFilters = () => {
    setDraft(DEFAULT_FILTERS)
    onSetFilters?.(DEFAULT_FILTERS)
    onRefresh?.(DEFAULT_FILTERS)
  }

  return (
    <div className="section analytics-section">
      <div className="section-head">
        <h3>Web Analytics</h3>
        <button className="ghost" type="button" onClick={() => onRefresh?.()} disabled={status === 'loading'}>
          {status === 'loading' ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      <p className="hint">
        Visitor-level analytics with real activity trail: who came, which page visited, what clicked, and how long stayed.
      </p>

      {error && <p className="error">{error}</p>}

      <div className="analytics-range-chips">
        {RANGE_OPTIONS.map((option) => (
          <button
            key={option.key}
            type="button"
            className={`toggle-btn ${String(draft.timeRange) === option.key ? 'active' : ''}`}
            onClick={() => applyQuickRange(option.key)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {String(draft.timeRange) === 'custom' && (
        <div className="analytics-custom-range-grid">
          <label className="field">
            <span>Start Date & Time</span>
            <input
              type="datetime-local"
              value={toDatetimeLocalValue(draft.startAt)}
              onChange={(e) => setDraftValue('startAt', toIsoFromDatetimeLocal(e.target.value))}
            />
          </label>
          <label className="field">
            <span>End Date & Time</span>
            <input
              type="datetime-local"
              value={toDatetimeLocalValue(draft.endAt)}
              onChange={(e) => setDraftValue('endAt', toIsoFromDatetimeLocal(e.target.value))}
            />
          </label>
        </div>
      )}

      <div className="analytics-filter-actions">
        <button className="primary analytics-apply-btn" type="button" onClick={applyFilters} disabled={status === 'loading'}>
          Apply Filters
        </button>
        <button className="analytics-reset-btn" type="button" onClick={resetFilters} disabled={status === 'loading'}>
          Reset
        </button>
        {hasFilterChanges && <span className="muted">Unsaved filter changes</span>}
      </div>

      <div className="analytics-meta-row">
        <span className="pill analytics-meta-pill">
          <span className="analytics-meta-label">Timezone:</span>
          <span className="analytics-meta-value">{dashboard?.timezone || 'UTC'}</span>
        </span>
        <span className="pill analytics-meta-pill analytics-meta-pill-range">
          <span className="analytics-meta-label">Range:</span>
          <span className="analytics-meta-value">
            {dashboard?.filtersApplied?.startAt ? new Date(dashboard.filtersApplied.startAt).toLocaleString() : '—'} to {dashboard?.filtersApplied?.endAt ? new Date(dashboard.filtersApplied.endAt).toLocaleString() : '—'}
          </span>
        </span>
      </div>

      <div className="analytics-visual-grid analytics-visual-grid-single">
        <div className="analytics-smart-card">
          <div className="analytics-smart-head">
            <div>
              <h4>Smart Traffic Graph</h4>
              <p>Dual-series trend for visits and unique users across selected interval.</p>
            </div>
            <div className="analytics-smart-chips">
              <span className="analytics-series-chip visits"><i />VISITS</span>
              <span className="analytics-series-chip unique"><i />UNIQUE</span>
            </div>
          </div>

          <SmartTrafficGraph
            points={smartTimeline}
            activeIndex={activeBucketIndex}
            onHoverPoint={setActiveBucketIndex}
          />

          <div className="analytics-smart-footer-metrics">
            <div className="analytics-smart-footer-card time">
              <small>TIME BUCKET</small>
              <strong>{formatBucketTimestamp(selectedBucket?.startAt)}</strong>
            </div>
            <div className="analytics-smart-footer-card visits">
              <small>VISITS</small>
              <strong>{numberFormatter.format(selectedBucket?.visits || 0)}</strong>
            </div>
            <div className="analytics-smart-footer-card unique">
              <small>UNIQUE USERS</small>
              <strong>{numberFormatter.format(selectedBucket?.unique || 0)}</strong>
            </div>
            <div className="analytics-smart-footer-card peak">
              <small>PEAK VISITS</small>
              <strong>{numberFormatter.format(peakVisitsBucket?.visits || 0)}</strong>
              <span>{peakVisitsBucket?.label || '-'}</span>
            </div>
            <div className="analytics-smart-footer-card peak-unique">
              <small>PEAK UNIQUE</small>
              <strong>{numberFormatter.format(peakUniqueBucket?.unique || 0)}</strong>
              <span>{peakUniqueBucket?.label || '-'}</span>
            </div>
            <div className="analytics-smart-footer-card avg">
              <small>AVG VISITS</small>
              <strong>{numberFormatter.format(averageVisits || 0)}</strong>
              <span>Per interval</span>
            </div>
          </div>
        </div>
      </div>

      <div className="analytics-metrics-grid">
        {metricItems.map((metric) => (
          <div className="analytics-metric-card" key={metric.label}>
            <small>{metric.label}</small>
            <strong>{numberFormatter.format(metric.value)}</strong>
          </div>
        ))}
      </div>

      <section className="analytics-visitor-explorer">
        <div className="analytics-visitors-list-card">
          <div className="analytics-visitor-card-head">
            <h4 className="analytics-user-heading analytics-user-heading-list">User Records</h4>
            <span className="pill small">{numberFormatter.format(dashboard?.visitorOverview?.totalVisitors || 0)} Users</span>
          </div>

          {!visitorItems.length && <p className="muted">No users found in current filter range.</p>}

          {!!visitorItems.length && (
            <ul className="analytics-visitor-list">
              {visitorItems.map((visitor) => {
                const isActive = String(visitor?.visitorKey || '') === String(selectedVisitorKey || '')
                return (
                  <li key={visitor.visitorKey}>
                    <button
                      type="button"
                      className={`analytics-visitor-row ${isActive ? 'active' : ''}`}
                      onClick={() => onSelectVisitor?.(visitor.visitorKey)}
                    >
                      <div className="analytics-visitor-row-head">
                        <strong title={visitor.displayId || visitor.visitorKey}>{visitor.displayId || visitor.visitorKey}</strong>
                        <span>{formatDuration(visitor.durationSeconds)}</span>
                      </div>
                      <div className="analytics-visitor-row-meta">
                        <span>Last: {formatShortDateTime(visitor.lastSeenAt)}</span>
                        <span>Area: {visitor.primaryArea || 'Unknown Area'}</span>
                        <span>Pages: {numberFormatter.format(visitor.pageViews || 0)}</span>
                        <span>Clicks: {numberFormatter.format(visitor.clicks || 0)}</span>
                        <span>Unique Pages: {numberFormatter.format(visitor.uniquePages || 0)}</span>
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="analytics-visitor-detail-card">
          <div className="analytics-visitor-card-head">
            <h4 className="analytics-user-heading analytics-user-heading-timeline">User Activity Timeline</h4>
            {selectedVisitorSummary && (
              <span className="pill small">{selectedVisitorSummary.displayId || selectedVisitorSummary.visitorKey}</span>
            )}
          </div>

          {!selectedVisitorSummary && <p className="muted">Select any user from left to inspect full journey.</p>}

          {selectedVisitorSummary && visitorJourneyStatus === 'loading' && (
            <p className="muted">Loading selected user activity...</p>
          )}

          {selectedVisitorSummary && visitorJourneyStatus === 'failed' && (
            <p className="error">{visitorJourneyError || 'Unable to load user journey.'}</p>
          )}

          {selectedVisitorSummary && visitorJourneyStatus !== 'loading' && hasJourneyForSelected && (
            <>
              <div className="analytics-visitor-summary-grid">
                <div className="analytics-visitor-summary-pill">
                  <small>First Seen</small>
                  <strong>{formatShortDateTime(visitorJourney?.firstSeenAt)}</strong>
                </div>
                <div className="analytics-visitor-summary-pill">
                  <small>Last Seen</small>
                  <strong>{formatShortDateTime(visitorJourney?.lastSeenAt)}</strong>
                </div>
                <div className="analytics-visitor-summary-pill">
                  <small>Duration</small>
                  <strong>{formatDuration(visitorJourney?.durationSeconds)}</strong>
                </div>
                <div className="analytics-visitor-summary-pill">
                  <small>Total Events</small>
                  <strong>{numberFormatter.format(visitorJourney?.totalEvents || 0)}</strong>
                </div>
                <div className="analytics-visitor-summary-pill">
                  <small>Primary Area</small>
                  <strong>{visitorJourney?.primaryArea || selectedVisitorSummary?.primaryArea || 'Unknown Area'}</strong>
                </div>
              </div>

              <div className="analytics-visitor-subgrid">
                <div className="analytics-visitor-subcard">
                  <h5 className="analytics-user-subheading analytics-user-subheading-pages">Top Pages Opened by User</h5>
                  {!asList(visitorJourney?.topPages).length && <p className="muted">No pages captured.</p>}
                  {!!asList(visitorJourney?.topPages).length && (
                    <ul className="analytics-top-list">
                      {asList(visitorJourney?.topPages).map((item, index) => (
                        <li key={`${item.path}-${index}`}>
                          <span title={item.path}>{item.path}</span>
                          <strong>{numberFormatter.format(item.count || 0)}</strong>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="analytics-visitor-subcard">
                  <h5 className="analytics-user-subheading analytics-user-subheading-journey">User Journey Sequence</h5>
                  {!asList(visitorJourney?.pageSequence).length && <p className="muted">No page-sequence available.</p>}
                  {!!asList(visitorJourney?.pageSequence).length && (
                    <ul className="analytics-journey-list">
                      {asList(visitorJourney?.pageSequence).slice(-18).map((item, index) => (
                        <li key={`${item.path}-${item.occurredAt}-${index}`}>
                          <span>{item.pageLabel || item.path}</span>
                          <small>{formatShortDateTime(item.occurredAt)}</small>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="analytics-activity-feed-card">
                <h5 className="analytics-user-subheading analytics-user-subheading-activity">Detailed Activities</h5>
                {!asList(visitorJourney?.activities).length && <p className="muted">No detailed activity captured.</p>}
                {!!asList(visitorJourney?.activities).length && (
                  <ul className="analytics-activity-list">
                    {asList(visitorJourney?.activities).slice(0, 70).map((item, index) => (
                      <li key={`${item.occurredAt}-${item.eventType}-${index}`}>
                        <div>
                          <strong>{item.activityLabel || EVENT_TYPE_LABELS[item.eventType] || item.eventType}</strong>
                          <p>{item.pageLabel || item.path || item.label || item.action || '-'}</p>
                        </div>
                        <span>{formatShortDateTime(item.occurredAt)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      <div className="analytics-insights-grid">
        <TopList title="Top Pages" items={topPages} itemKey="path" />
      </div>

      <div className="analytics-page-table-card">
        <h4>Page Level Traffic (Selected Filters)</h4>
        {!pageTraffic.length && <p className="muted">No page traffic found for this filter.</p>}
        {!!pageTraffic.length && (
          <div className="analytics-page-table-wrap">
            <table className="analytics-page-table">
              <thead>
                <tr>
                  <th>Path</th>
                  <th>Total</th>
                  <th>Views</th>
                  <th>Clicks</th>
                  <th>Forms</th>
                  <th>Errors</th>
                </tr>
              </thead>
              <tbody>
                {pageTraffic.map((row) => (
                  <tr key={row.path}>
                    <td title={row.path} data-label="Path">{row.path}</td>
                    <td data-label="Total">{numberFormatter.format(row.total || 0)}</td>
                    <td data-label="Views">{numberFormatter.format(row.pageViews || 0)}</td>
                    <td data-label="Clicks">{numberFormatter.format(row.clicks || 0)}</td>
                    <td data-label="Forms">{numberFormatter.format(row.forms || 0)}</td>
                    <td data-label="Errors">{numberFormatter.format(row.errors || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AnalyticsPanel
