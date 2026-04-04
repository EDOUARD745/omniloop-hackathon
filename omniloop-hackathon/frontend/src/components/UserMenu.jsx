import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function UserMenu() {
  const { user, logout, openLoginModal } = useAuth()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  if (user) {
    return (
      <div className="user-menu" ref={menuRef}>
        <button
          className="user-menu-trigger"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
        >
          <span className="user-avatar">
            {user.displayName?.charAt(0)?.toUpperCase() || 'U'}
          </span>
          <span className="user-name">{user.displayName}</span>
          <span className="user-domain">@{user.domain}</span>
        </button>
        {open && (
          <div className="user-menu-dropdown">
            <div className="user-menu-info">
              <span className="user-menu-email">{user.email}</span>
              <span className="user-menu-ssh">Connexion SSH active</span>
            </div>
            <button className="user-menu-item" onClick={() => { logout(); setOpen(false); }}>
              Déconnexion
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <button className="btn-login secondary" onClick={openLoginModal}>
      Connexion
    </button>
  )
}
