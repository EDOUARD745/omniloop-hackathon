import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PARTNERS } from '../data/partners'
import { PENDING_PICKUPS, PARTNER_PERFORMANCE } from '../data/partnerPortal'
import './PartnerPortal.css'

const partner = PARTNERS.find((p) => p.id === 'p6') || PARTNERS[0]

export default function PartnerPortal() {
  const [pickups, setPickups] = useState(PENDING_PICKUPS)
  const [certUploads, setCertUploads] = useState({})

  const handleConfirmPickup = (pickupId) => {
    setPickups((prev) =>
      prev.map((p) => (p.id === pickupId ? { ...p, status: 'confirmed' } : p))
    )
  }

  const handleFileUpload = (pickupId, e) => {
    const file = e.target.files?.[0]
    if (file) {
      setCertUploads((prev) => ({ ...prev, [pickupId]: file.name }))
    }
  }

  return (
    <div className="partner-portal">
      <header className="partner-portal-header">
        <div className="partner-portal-brand">
          <Link to="/" className="partner-portal-back" title="Retour à l'app principale">
            ←
          </Link>
          <span className="partner-portal-logo">♻️</span>
          <span className="partner-portal-title">OmniLoop — Portail Partenaire</span>
        </div>
        <div className="partner-portal-user">
          <span className="partner-portal-partner-name">{partner.name}</span>
          <span className="partner-portal-badge">Partenaire</span>
        </div>
      </header>

      <main className="partner-portal-main">
        <section className="partner-portal-section">
          <h2 className="partner-portal-section-title">Collectes en attente</h2>
          <p className="partner-portal-section-desc">
            Collectes assignées à votre centre — confirmez et uploadez le certificat de destruction
          </p>

          <div className="partner-portal-pickups">
            {pickups.map((pickup) => (
              <motion.div
                key={pickup.id}
                className="partner-portal-pickup-card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="partner-portal-pickup-info">
                  <div className="partner-portal-pickup-location">
                    <span className="partner-portal-pickup-icon">📍</span>
                    {pickup.location}
                  </div>
                  <div className="partner-portal-pickup-meta">
                    <span className="partner-portal-pickup-volume">
                      {pickup.volume} kg
                    </span>
                    <span className="partner-portal-pickup-date">
                      {pickup.date.toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <div className="partner-portal-pickup-actions">
                  {pickup.status === 'planned' ? (
                    <button
                      className="partner-portal-btn-confirm primary"
                      onClick={() => handleConfirmPickup(pickup.id)}
                    >
                      Confirmer la collecte
                    </button>
                  ) : (
                    <span className="partner-portal-status-badge confirmed">
                      ✓ Confirmé
                    </span>
                  )}

                  <div className="partner-portal-upload">
                    <label className="partner-portal-upload-label">
                      Certificat de destruction (PDF)
                    </label>
                    <div className="partner-portal-upload-zone">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileUpload(pickup.id, e)}
                        className="partner-portal-upload-input"
                      />
                      {certUploads[pickup.id] ? (
                        <span className="partner-portal-upload-success">
                          ✓ {certUploads[pickup.id]}
                        </span>
                      ) : (
                        <span className="partner-portal-upload-placeholder">
                          Glissez un PDF ou cliquez pour sélectionner
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="partner-portal-section partner-portal-performance">
          <h2 className="partner-portal-section-title">Votre performance ce mois</h2>
          <div className="partner-portal-metrics">
            <div className="partner-portal-metric">
              <span className="partner-portal-metric-value">
                {PARTNER_PERFORMANCE.kgProcessed.toLocaleString('fr-FR')} kg
              </span>
              <span className="partner-portal-metric-label">Traités</span>
            </div>
            <div className="partner-portal-metric">
              <span className="partner-portal-metric-value">
                {PARTNER_PERFORMANCE.certificatesIssued}
              </span>
              <span className="partner-portal-metric-label">Certificats émis</span>
            </div>
            <div className="partner-portal-metric">
              <span className="partner-portal-metric-value">
                {PARTNER_PERFORMANCE.averageTurnaroundDays} j
              </span>
              <span className="partner-portal-metric-label">Délai moyen</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
