import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  ACTIVITY_EVENTS,
  EVENT_TYPE_LABELS,
  DEPARTMENTS_LIST,
} from '../data/activity'

function formatDate(d) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const evtDay = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const diffDays = Math.floor((today - evtDay) / 86400000)

  if (diffDays === 0) return "Aujourd'hui"
  if (diffDays === 1) return 'Hier'
  if (diffDays < 7) return `Il y a ${diffDays} jours`
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatTime(d) {
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

export default function ActivityJournal() {
  const [typeFilter, setTypeFilter] = useState('')
  const [deptFilter, setDeptFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const filteredEvents = useMemo(() => {
    return ACTIVITY_EVENTS.filter((evt) => {
      if (typeFilter && evt.type !== typeFilter) return false
      if (deptFilter && evt.department !== deptFilter) return false
      if (dateFrom) {
        const from = new Date(dateFrom)
        from.setHours(0, 0, 0, 0)
        if (evt.timestamp < from) return false
      }
      if (dateTo) {
        const to = new Date(dateTo)
        to.setHours(23, 59, 59, 999)
        if (evt.timestamp > to) return false
      }
      return true
    })
  }, [typeFilter, deptFilter, dateFrom, dateTo])

  const groupedByDate = useMemo(() => {
    const groups = {}
    filteredEvents.forEach((evt) => {
      const key = evt.timestamp.toDateString()
      if (!groups[key]) groups[key] = []
      groups[key].push(evt)
    })
    return Object.entries(groups)
  }, [filteredEvents])

  return (
    <div className="activity-journal">
      <div className="activity-header">
        <h1 className="activity-title">Journal d'activité</h1>
        <p className="activity-subtitle">
          Timeline des événements OmniLoop en temps réel : offboardings, réaffectations, collectes, rapports
        </p>
      </div>

      <div className="activity-filters card">
        <h3 className="activity-filters-title">Filtres</h3>
        <div className="activity-filters-grid">
          <div className="activity-filter-group">
            <label>Type d'événement</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="activity-select"
            >
              <option value="">Tous les types</option>
              {Object.entries(EVENT_TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div className="activity-filter-group">
            <label>Département</label>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="activity-select"
            >
              <option value="">Tous les départements</option>
              {DEPARTMENTS_LIST.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="activity-filter-group">
            <label>Du</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="activity-input"
            />
          </div>
          <div className="activity-filter-group">
            <label>Au</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="activity-input"
            />
          </div>
        </div>
      </div>

      <div className="activity-timeline">
        {groupedByDate.map(([dateKey, events]) => (
          <div key={dateKey} className="activity-day-group">
            <div className="activity-day-label">
              {formatDate(events[0].timestamp)}
            </div>
            <div className="activity-timeline-line">
              {events.map((evt, idx) => (
                <motion.div
                  key={evt.id}
                  className="activity-event"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03, duration: 0.25 }}
                >
                  <div className="activity-event-icon">{evt.icon}</div>
                  <div className="activity-event-content">
                    <p className="activity-event-desc">{evt.description}</p>
                    <div className="activity-event-meta">
                      <span className="activity-event-dept">{evt.department}</span>
                      <span className="activity-event-impact">{evt.impact}</span>
                    </div>
                    <span className="activity-event-time">
                      {formatTime(evt.timestamp)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {filteredEvents.length === 0 && (
          <div className="activity-empty">
            Aucun événement ne correspond aux filtres sélectionnés.
          </div>
        )}
      </div>
    </div>
  )
}
