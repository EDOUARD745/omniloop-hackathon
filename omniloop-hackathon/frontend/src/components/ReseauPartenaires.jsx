import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { Link } from 'react-router-dom'
import { PARTNERS, SORT_OPTIONS } from '../data/partners'
import PlanificationCollectes from './PlanificationCollectes'
import 'leaflet/dist/leaflet.css'


// Fix default marker icons in bundlers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

function PartnerPopup({ partner }) {
  return (
    <div className="partner-popup">
      <h4 className="partner-popup-name">{partner.name}</h4>
      <div className="partner-popup-certs">
        {partner.certifications.map((c) => (
          <span key={c} className="partner-popup-cert">{c}</span>
        ))}
      </div>
      <dl className="partner-popup-dl">
        <dt>Zone couverte</dt>
        <dd>{partner.coverageZone}</dd>
        <dt>Capacité</dt>
        <dd>{partner.capacityKgMonth.toLocaleString('fr-FR')} kg/mois</dd>
        <dt>Délai collecte moyen</dt>
        <dd>{partner.pickupDelayDays} jour{partner.pickupDelayDays > 1 ? 's' : ''}</dd>
      </dl>
      <div className="partner-popup-rating">★ {partner.rating}/5</div>
    </div>
  )
}

export default function ReseauPartenaires() {
  const [sortBy, setSortBy] = useState('distance')
  const [contactOpen, setContactOpen] = useState(false)
  const [contactForm, setContactForm] = useState({ company: '', email: '', message: '' })

  const sortedPartners = useMemo(() => {
    const arr = [...PARTNERS]
    if (sortBy === 'distance') arr.sort((a, b) => a.distanceFromParis - b.distanceFromParis)
    else if (sortBy === 'rating') arr.sort((a, b) => b.rating - a.rating)
    else if (sortBy === 'capacity') arr.sort((a, b) => b.capacityKgMonth - a.capacityKgMonth)
    return arr
  }, [sortBy])

  const handleContactSubmit = (e) => {
    e.preventDefault()
    // Simulate submit
    alert('Demande envoyée ! Un commercial vous contactera sous 48h.')
    setContactOpen(false)
    setContactForm({ company: '', email: '', message: '' })
  }

  return (
    <div className="reseau-partenaires">
      <div className="reseau-header">
        <div>
          <h1 className="reseau-title">Réseau Partenaires</h1>
          <p className="reseau-subtitle">
            Centres de recyclage textile partenaires OmniLoop — carte interactive et liste triable
          </p>
        </div>
        <div className="reseau-header-actions">
          <Link to="/partner-portal" className="reseau-link-portal secondary">
            Vue partenaire
          </Link>
          <button className="btn-nouveau-partenaire primary" onClick={() => setContactOpen(true)}>
            Demander un nouveau partenaire
          </button>
        </div>
      </div>

      <div className="reseau-layout">
        <aside className="reseau-sidebar card">
          <h3 className="reseau-sidebar-title">Partenaires</h3>
          <div className="reseau-sort">
            <label>Trier par</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="reseau-select">
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <ul className="reseau-partner-list">
            {sortedPartners.map((p) => (
              <li key={p.id} className="reseau-partner-item">
                <div className="reseau-partner-item-name">{p.name}</div>
                <div className="reseau-partner-item-meta">
                  {sortBy === 'distance' && (
                    <span>{p.distanceFromParis === 0 ? 'Paris' : `${p.distanceFromParis} km`}</span>
                  )}
                  {sortBy === 'rating' && <span>★ {p.rating}</span>}
                  {sortBy === 'capacity' && (
                    <span>{p.capacityKgMonth.toLocaleString('fr-FR')} kg/mois</span>
                  )}
                </div>
                <div className="reseau-partner-item-zone">{p.coverageZone}</div>
              </li>
            ))}
          </ul>
        </aside>

        <div className="reseau-map-wrap">
          <MapContainer
            center={[46.8, 2.5]}
            zoom={6}
            className="reseau-map"
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {PARTNERS.map((p) => (
              <Marker key={p.id} position={[p.lat, p.lng]} icon={greenIcon}>
                <Popup>
                  <PartnerPopup partner={p} />
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      <PlanificationCollectes />

      {contactOpen && (
        <div className="reseau-modal-overlay" onClick={() => setContactOpen(false)}>
          <motion.div
            className="reseau-modal card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="reseau-modal-title">Demander un nouveau partenaire</h3>
            <p className="reseau-modal-desc">
              Décrivez vos besoins et notre équipe vous recontactera pour intégrer un centre de recyclage dans votre zone.
            </p>
            <form onSubmit={handleContactSubmit} className="reseau-form">
              <div className="reseau-form-group">
                <label>Entreprise / Organisation</label>
                <input
                  type="text"
                  value={contactForm.company}
                  onChange={(e) => setContactForm((f) => ({ ...f, company: e.target.value }))}
                  placeholder="Nom de votre entreprise"
                  required
                />
              </div>
              <div className="reseau-form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="contact@entreprise.fr"
                  required
                />
              </div>
              <div className="reseau-form-group">
                <label>Message</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="Zone géographique, volume estimé (kg/mois), certifications souhaitées..."
                  rows={4}
                  required
                />
              </div>
              <div className="reseau-form-actions">
                <button type="button" className="secondary" onClick={() => setContactOpen(false)}>
                  Annuler
                </button>
                <button type="submit" className="primary">
                  Envoyer la demande
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
