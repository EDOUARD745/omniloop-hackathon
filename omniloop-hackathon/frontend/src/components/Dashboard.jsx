import { useState, useEffect } from 'react'
import OffboardingTrigger from './OffboardingTrigger'
import AnimatedCounter from './AnimatedCounter'
import SkeletonCard from './SkeletonCard'
import SkeletonTable from './SkeletonTable'
import EmptyState from './EmptyState'

const API_URL = ''

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null)
  const [business, setBusiness] = useState(null)
  const [employees, setEmployees] = useState(null)

  useEffect(() => {
    fetch(`${API_URL}/api/dashboard`)
      .then(res => res.json())
      .then(setMetrics)
    fetch(`${API_URL}/api/business-metrics`)
      .then(res => res.json())
      .then(setBusiness)
    fetch(`${API_URL}/api/employees`)
      .then(res => res.json())
      .then(data => setEmployees(data.employees || []))
      .catch(() => setEmployees([]))
  }, [])

  const scrollToOffboarding = () => {
    document.querySelector('.offboarding-trigger')?.scrollIntoView({ behavior: 'smooth' })
  }

  if (!metrics) {
    return (
      <div className="dashboard-page">
        <div className="uvp-banner">
          <div className="skeleton-block skeleton-title" style={{ width: 320 }} />
          <div className="skeleton-block skeleton-text" />
        </div>
        <div className="skeleton-block" style={{ height: 24, width: 280, marginBottom: '1.5rem' }} />
        <div className="card" style={{ minHeight: 200 }}>
          <div className="skeleton-block" style={{ height: 20, width: 200, marginBottom: '1rem' }} />
          <div className="skeleton-block" style={{ height: 16, width: '80%', marginBottom: '1.5rem' }} />
        </div>
        <div className="metrics-grid">
          <SkeletonCard count={6} />
        </div>
        <div className="card">
          <div className="skeleton-block" style={{ height: 20, width: 220, marginBottom: '1rem' }} />
          <div className="metrics-grid" style={{ marginBottom: 0 }}>
            <SkeletonCard count={4} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <div className="uvp-banner">
        <h3>💡 Proposition de valeur unique</h3>
        <p>
          L'outil s'autofinance : les économies sur le matériel IT paient le recyclage textile.
          Pour le directeur financier, le ROI est positif dès le premier mois.
        </p>
      </div>

      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Tableau de bord RSE</h2>

      <OffboardingTrigger />

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-value">
            <AnimatedCounter value={metrics.economies_mensuelles ?? 0} suffix=" €" duration={1.5} />
          </div>
          <div className="metric-label">Économies mensuelles</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">
            <AnimatedCounter value={metrics.equipements_reaffectes ?? 0} duration={1.5} />
          </div>
          <div className="metric-label">Équipements réaffectés</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">
            <AnimatedCounter value={metrics.tonnes_textile_recyclees ?? 0} suffix=" t" duration={1.5} />
          </div>
          <div className="metric-label">Textile recyclé</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">
            <AnimatedCounter value={metrics.achats_evites ?? 0} duration={1.5} />
          </div>
          <div className="metric-label">Achats évités</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">
            <AnimatedCounter value={metrics.roi_percent ?? 0} suffix="%" duration={1.5} />
          </div>
          <div className="metric-label">ROI</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">
            <AnimatedCounter value={metrics.co2_evite_kg ?? 0} suffix=" kg" duration={1.5} />
          </div>
          <div className="metric-label">CO₂ évité</div>
        </div>
      </div>

      {employees !== null && (
        <div className="card">
          <h3 className="card-title">Employés en cours d'offboarding</h3>
          {employees.length === 0 ? (
            <EmptyState
              icon="👋"
              title="Aucun offboarding en cours"
              message="Aucun employé n'est actuellement en processus d'offboarding. Déclenchez un offboarding pour commencer."
              ctaLabel="Déclencher un offboarding"
              onCta={scrollToOffboarding}
            />
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Département</th>
                  <th>Date de départ</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {employees.slice(0, 5).map(emp => (
                  <tr key={emp.id}>
                    <td><strong>{emp.name}</strong></td>
                    <td>{emp.department}</td>
                    <td>{emp.departure_date}</td>
                    <td>
                      <span className={`badge ${emp.status === 'completed' ? 'badge-success' : emp.status === 'in_progress' ? 'badge-in-progress' : 'badge-warning'}`}>
                        {emp.status === 'completed' ? 'Terminé' : emp.status === 'in_progress' ? 'En cours' : 'En attente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {employees === null && (
        <div className="card">
          <h3 className="card-title">Employés en cours d'offboarding</h3>
          <SkeletonTable cols={4} rows={4} />
        </div>
      )}

      <div className="card">
        <h3 className="card-title">💰 Business Model (simulation)</h3>
        {business ? (
          <div className="metrics-grid" style={{ marginBottom: 0 }}>
            <div className="metric-card">
              <div className="metric-value">
                <AnimatedCounter value={business.abonnement_saas_mois} suffix=" €" duration={1.5} />
              </div>
              <div className="metric-label">Abonnement SaaS/mois</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">
                <AnimatedCounter value={business.success_fee_mois} suffix=" €" duration={1.5} />
              </div>
              <div className="metric-label">Success Fee (10% achats évités)</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">
                <AnimatedCounter value={business.recyclage_textile_mois} suffix=" €" duration={1.5} />
              </div>
              <div className="metric-label">Recyclage textile (facturé au kg)</div>
            </div>
            <div className="metric-card">
              <div className="metric-value" style={{ color: 'var(--color-accent)' }}>
                <AnimatedCounter value={business.total_revenus_mois} suffix=" €" duration={1.5} />
              </div>
              <div className="metric-label">Revenus totaux/mois</div>
            </div>
          </div>
        ) : (
          <div className="metrics-grid" style={{ marginBottom: 0 }}>
            <SkeletonCard count={4} />
          </div>
        )}
      </div>
    </div>
  )
}
