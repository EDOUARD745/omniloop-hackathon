import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { jsPDF } from 'jspdf'
import { PARTNERS } from '../data/partners'
import { SCHEDULED_PICKUPS, PICKUP_STATUS } from '../data/pickups'

const DAYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']

function getPartner(id) {
  return PARTNERS.find((p) => p.id === id) || { name: '—', address: '—' }
}

function getDaysInView(viewMode, currentDate) {
  const start = new Date(currentDate)
  start.setDate(1)
  start.setHours(0, 0, 0, 0)

  if (viewMode === 'week') {
    const day = currentDate.getDay()
    const monday = new Date(start)
    monday.setDate(currentDate.getDate() - (day === 0 ? 6 : day - 1))
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      return d
    })
  }

  // Month: get first day of month and pad to start on Monday
  const first = new Date(start.getFullYear(), start.getMonth(), 1)
  const firstDay = first.getDay()
  const padStart = firstDay === 0 ? 6 : firstDay - 1
  const begin = new Date(first)
  begin.setDate(begin.getDate() - padStart)

  const days = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(begin)
    d.setDate(begin.getDate() + i)
    days.push(d)
  }
  return days
}

function generatePickupPDF(pickup, partner) {
  const doc = new jsPDF()
  const w = doc.internal.pageSize.getWidth()

  doc.setFontSize(18)
  doc.setTextColor(0, 200, 150)
  doc.text('Bon de collecte — OmniLoop', 20, 22)

  doc.setFontSize(9)
  doc.setTextColor(80, 80, 80)
  doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`, 20, 30)

  doc.setDrawColor(0, 200, 150)
  doc.setLineWidth(0.5)
  doc.line(20, 35, w - 20, 35)

  doc.setFontSize(11)
  doc.setTextColor(0, 0, 0)
  doc.text('Détails de la collecte', 20, 48)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(`Partenaire : ${partner.name}`, 20, 58)
  doc.text(`Adresse de collecte : ${partner.address || '—'}`, 20, 66)
  doc.text(`Poids estimé : ${pickup.kg} kg`, 20, 74)
  doc.text(`Date prévue : ${pickup.date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`, 20, 82)
  doc.text(`Statut : ${PICKUP_STATUS[pickup.status]}`, 20, 90)

  doc.setDrawColor(200, 200, 200)
  doc.setLineWidth(0.3)
  doc.rect(20, 100, w - 40, 45)
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text('Certificat de destruction sécurisée du logo', 25, 112)
  doc.setFontSize(9)
  doc.text('Le partenaire s\'engage à fournir un certificat attestant de la destruction sécurisée des logos', 25, 120)
  doc.text('et marques sur les textiles collectés, conformément aux normes en vigueur.', 25, 127)
  doc.text('Signature partenaire : _________________________  Date : ___/___/______', 25, 138)

  doc.setFontSize(8)
  doc.setTextColor(120, 120, 120)
  doc.text('OmniLoop — Logistique circulaire IT & Textile', 20, doc.internal.pageSize.getHeight() - 10)

  doc.save(`bon-collecte-${pickup.id}.pdf`)
}

export default function PlanificationCollectes() {
  const [viewMode, setViewMode] = useState('week')
  const [currentDate, setCurrentDate] = useState(new Date())

  const daysInView = useMemo(() => getDaysInView(viewMode, currentDate), [viewMode, currentDate])

  const pickupsByDate = useMemo(() => {
    const map = {}
    SCHEDULED_PICKUPS.forEach((p) => {
      const key = p.date.toDateString()
      if (!map[key]) map[key] = []
      map[key].push(p)
    })
    return map
  }, [])

  const prevPeriod = () => {
    const d = new Date(currentDate)
    if (viewMode === 'week') d.setDate(d.getDate() - 7)
    else d.setMonth(d.getMonth() - 1)
    setCurrentDate(d)
  }

  const nextPeriod = () => {
    const d = new Date(currentDate)
    if (viewMode === 'week') d.setDate(d.getDate() + 7)
    else d.setMonth(d.getMonth() + 1)
    setCurrentDate(d)
  }

  const periodLabel =
    viewMode === 'week'
      ? `Semaine du ${daysInView[0]?.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`
      : `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`

  const isCurrentMonth = (d) => d.getMonth() === currentDate.getMonth()

  return (
    <div className="planification-collectes card">
      <div className="planification-header">
        <h3 className="planification-title">Planification des Collectes</h3>
        <div className="planification-controls">
          <div className="planification-toggle">
            <button
              className={viewMode === 'week' ? 'active' : ''}
              onClick={() => setViewMode('week')}
            >
              Semaine
            </button>
            <button
              className={viewMode === 'month' ? 'active' : ''}
              onClick={() => setViewMode('month')}
            >
              Mois
            </button>
          </div>
          <div className="planification-nav">
            <button onClick={prevPeriod} aria-label="Période précédente">‹</button>
            <span className="planification-period">{periodLabel}</span>
            <button onClick={nextPeriod} aria-label="Période suivante">›</button>
          </div>
        </div>
      </div>

      <div className={`planification-calendar planification-calendar--${viewMode}`}>
        {viewMode === 'month' && (
          <div className="planification-weekdays">
            {DAYS.map((d) => (
              <div key={d} className="planification-weekday">{d}</div>
            ))}
          </div>
        )}
        <div className="planification-days">
          {daysInView.map((d) => {
            const key = d.toDateString()
            const pickups = pickupsByDate[key] || []
            const isOtherMonth = viewMode === 'month' && !isCurrentMonth(d)

            return (
              <div
                key={key}
                className={`planification-day ${isOtherMonth ? 'planification-day--other' : ''}`}
              >
                <div className="planification-day-num">
                  {d.getDate()}
                </div>
                <div className="planification-day-events">
                  {pickups.map((pickup) => {
                    const partner = getPartner(pickup.partnerId)
                    return (
                      <motion.div
                        key={pickup.id}
                        className="planification-event"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="planification-event-header">
                          <span className="planification-event-partner">{partner.name}</span>
                          <span className={`planification-event-status planification-event-status--${pickup.status}`}>
                            {PICKUP_STATUS[pickup.status]}
                          </span>
                        </div>
                        <div className="planification-event-details">
                          <span>{pickup.kg} kg</span>
                          <span>{partner.address}</span>
                        </div>
                        <button
                          className="planification-event-btn secondary"
                          onClick={() => generatePickupPDF(pickup, partner)}
                        >
                          Générer bon de collecte
                        </button>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
