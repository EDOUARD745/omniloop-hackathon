import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function LoginModal() {
  const { loginModalOpen, closeLoginModal, login } = useAuth()
  const [username, setUsername] = useState('')
  const [domain, setDomain] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (username.trim() && domain.trim()) {
      login(username.trim(), domain.trim())
      setUsername('')
      setDomain('')
    }
  }

  return (
    <AnimatePresence>
      {loginModalOpen && (
        <motion.div
          className="modal-overlay"
          onClick={closeLoginModal}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="modal-content login-modal"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
        <button className="modal-close" onClick={closeLoginModal} aria-label="Fermer">
          ×
        </button>

        <div className="login-header">
          <div className="login-ssh-badge">
            <span className="login-ssh-icon">⌘</span>
            Connexion SSH — Compte entreprise
          </div>
          <h2 className="login-title">Connexion</h2>
          <p className="login-subtitle">
            Utilisez vos identifiants entreprise pour accéder à OmniLoop
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-form-group">
            <label>Identifiant</label>
            <input
              type="text"
              placeholder="prenom.nom"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="login-form-group">
            <label>Domaine entreprise</label>
            <input
              type="text"
              placeholder="sncf, orange, laposte..."
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
            />
          </div>
          <div className="login-form-hint">
            Format SSH : <code>identifiant@domaine.corp</code>
          </div>
          <button type="submit" className="primary login-submit">
            Se connecter
          </button>
        </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
