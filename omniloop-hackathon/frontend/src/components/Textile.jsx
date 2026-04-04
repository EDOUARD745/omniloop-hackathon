import { useState, useEffect } from 'react'
import SkeletonTable from './SkeletonTable'
import EmptyState from './EmptyState'
import { useTab } from '../context/TabContext'

const API_URL = ''

export default function Textile() {
  const [orders, setOrders] = useState(null)
  const [loading, setLoading] = useState(null)
  const { setActiveTab } = useTab() || {}

  useEffect(() => {
    fetch(`${API_URL}/api/textile-orders`)
      .then(res => res.json())
      .then(data => setOrders(data.orders || []))
  }, [])

  const generateShipping = async (orderId) => {
    setLoading(orderId)
    try {
      const res = await fetch(`${API_URL}/api/textile-orders/${orderId}/generate-shipping`, {
        method: 'POST'
      })
      const data = await res.json()
      alert(`Bon généré !\nTracking: ${data.tracking_number}\nCentre: ${data.partner_center}`)
      setOrders(prev => prev.map(o =>
        o.id === orderId ? { ...o, status: 'shipped' } : o
      ))
    } catch (e) {
      alert('Erreur: ' + e.message)
    }
    setLoading(null)
  }

  return (
    <div className="textile-page">
      <h2 style={{ marginBottom: '0.35rem', fontSize: '1.25rem', fontWeight: 600 }}>
        Recyclage sécurisé — Uniformes & EPI
      </h2>
      <p style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
        Centres partenaires pour la destruction du logo et le recyclage textile
      </p>

      <div className="uvp-banner">
        <h3>♻️ Destruction logo + recyclage textile</h3>
        <p>
          OmniLoop génère le bon d'expédition. Le vêtement part vers un centre partenaire
          qui garantit la destruction sécurisée du logo (certificat) et le recyclage de 95%
          du textile restant.
        </p>
      </div>

      <div className="card">
        <h3 className="card-title">Commandes de recyclage</h3>
        {orders === null ? (
          <SkeletonTable cols={6} rows={5} />
        ) : orders.length === 0 ? (
          <EmptyState
            icon="🤝"
            title="Aucun partenaire configuré"
            message="Aucun centre de recyclage textile n'est configuré. Configurez vos partenaires pour activer le recyclage des uniformes et EPI."
            ctaLabel="Configurer un partenaire"
            onCta={() => setActiveTab?.('dashboard')}
          />
        ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Commande</th>
              <th>Employé</th>
              <th>Articles</th>
              <th>Poids</th>
              <th>Statut</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td><code>{order.id}</code></td>
                <td>{order.employee_id}</td>
                <td>
                  {order.items?.map((i, idx) => (
                    <span key={idx}>
                      {i.type} ({i.kg} kg){idx < order.items.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </td>
                <td><strong>{order.total_kg} kg</strong></td>
                <td>
                  <span className={`badge ${
                    order.status === 'shipped' ? 'badge-success' :
                    order.status === 'recycled' ? 'badge-success' : 'badge-warning'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  {order.status === 'pending' && (
                    <button
                      className="primary"
                      onClick={() => generateShipping(order.id)}
                      disabled={loading === order.id}
                    >
                      {loading === order.id ? '...' : 'Générer bon expédition'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </div>
  )
}
