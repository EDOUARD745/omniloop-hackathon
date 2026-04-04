import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTab } from '../context/TabContext'
import { NOTIFICATIONS, formatNotificationTime } from '../data/notifications'

function IconBell() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

export default function NotificationCenter() {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const { setActiveTab } = useTab() || {}

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleViewDetail = (targetTab) => {
    setActiveTab?.(targetTab)
    setOpen(false)
  }

  const count = NOTIFICATIONS.length

  return (
    <div className="notification-center" ref={containerRef}>
      <button
        className="notification-trigger"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={`${count} notifications`}
      >
        <span className="notification-icon">
          <IconBell />
        </span>
        {count > 0 && (
          <span className="notification-badge">{count > 99 ? '99+' : count}</span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="notification-dropdown"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="notification-header">
              <h3 className="notification-title">Notifications</h3>
              <span className="notification-count">{count} alerte{count > 1 ? 's' : ''}</span>
            </div>

            <div className="notification-list">
              {NOTIFICATIONS.map((alert) => (
                <div
                  key={alert.id}
                  className={`notification-item notification-item--${alert.severity}`}
                >
                  <div className="notification-item-content">
                    <p className="notification-message">{alert.message}</p>
                    <span className="notification-time">
                      {formatNotificationTime(alert.timestamp)}
                    </span>
                  </div>
                  <button
                    className="notification-action secondary"
                    onClick={() => handleViewDetail(alert.targetTab)}
                  >
                    Voir le détail
                  </button>
                </div>
              ))}
            </div>

            {count === 0 && (
              <div className="notification-empty">
                Aucune notification
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
