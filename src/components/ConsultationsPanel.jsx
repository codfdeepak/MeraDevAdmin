import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOwnerConsultations } from '../store/thunks/consultationThunks'

const formatDateTime = (value) => {
  if (!value) return '—'
  return new Date(value).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function ConsultationsPanel() {
  const dispatch = useDispatch()
  const { items, status, error } = useSelector((state) => state.consultations)
  const userRole = String(useSelector((state) => state.auth.user?.role) || '').toLowerCase()
  const canView = userRole === 'owner' || userRole === 'admin'

  useEffect(() => {
    if (canView && status === 'idle') {
      dispatch(fetchOwnerConsultations())
    }
  }, [dispatch, canView, status])

  if (!canView) {
    return (
      <div className="section">
        <p className="muted">Only owner/admin accounts can view consultation requests.</p>
      </div>
    )
  }

  return (
    <div className="section consultations-panel">
      <div className="section-head">
        <h3>Consultation Requests</h3>
        <button
          className="ghost"
          type="button"
          onClick={() => dispatch(fetchOwnerConsultations())}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {status === 'loading' && items.length === 0 && <p className="muted">Loading consultations...</p>}
      {error && <p className="error">{error}</p>}

      {status !== 'loading' && items.length === 0 && (
        <p className="muted">No consultation requests yet.</p>
      )}

      <div className="consultation-list">
        {items.map((item) => (
          <article className="consultation-card" key={item._id}>
            <div className="consultation-top">
              <h4>{item.name}</h4>
              <span className="badge">{item.status || 'new'}</span>
            </div>

            <div className="consultation-meta">
              <span>Mobile: {item.mobile}</span>
              <span>City: {item.city || 'Not specified'}</span>
              <span>Service: {item.serviceName || 'Not specified'}</span>
              <span>Booked At: {formatDateTime(item.bookedAt || item.createdAt)}</span>
              <span>Created At: {formatDateTime(item.createdAt)}</span>
            </div>

            <p className="consultation-topic">{item.topic}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

export default ConsultationsPanel
