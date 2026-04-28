import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchOwnerConsultations,
  deleteOwnerConsultation,
} from '../store/thunks/consultationThunks'

const formatDateTime = (value) => {
  if (!value) return '—'
  return new Date(value).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function ConsultationsPanel() {
  const dispatch = useDispatch()
  const { items, status, error, deleteError, deletingById } = useSelector((state) => state.consultations)
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

  const handleDelete = (item) => {
    const consultationId = item?._id
    if (!consultationId) return

    const userName = String(item?.name || 'this user').trim()
    const isConfirmed = window.confirm(
      `Delete consultation request for ${userName}? This action cannot be undone.`,
    )
    if (!isConfirmed) return

    dispatch(deleteOwnerConsultation(consultationId))
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
      {deleteError && <p className="error">{deleteError}</p>}

      {status !== 'loading' && items.length === 0 && (
        <p className="muted">No consultation requests yet.</p>
      )}

      <div className="consultation-list">
        {items.map((item) => (
          <article className="consultation-card" key={item._id}>
            <div className="consultation-top">
              <h4>{item.name}</h4>
              <div className="item-actions">
                <span className="badge">{item.status || 'new'}</span>
                <button
                  className="link-btn danger"
                  type="button"
                  onClick={() => handleDelete(item)}
                  disabled={Boolean(deletingById?.[item._id])}
                >
                  {deletingById?.[item._id] ? 'Deleting…' : 'Delete'}
                </button>
              </div>
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
