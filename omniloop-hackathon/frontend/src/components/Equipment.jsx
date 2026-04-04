import { useState, useEffect } from 'react'
import SkeletonTable from './SkeletonTable'
import EmptyState from './EmptyState'

const API_URL = ''

export default function Equipment() {
  const [equipment, setEquipment] = useState(null)
  const [purchaseRequests, setPurchaseRequests] = useState(null)

  useEffect(() => {
    fetch(`${API_URL}/api/equipment`)
      .then(res => res.json())
      .then(data => setEquipment(data.equipment || []))
    fetch(`${API_URL}/api/purchase-requests`)
      .then(res => res.json())
      .then(data => setPurchaseRequests(data.requests || []))
  }, [])

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>
        Interception IT — Inventaire & réaffectation
      </h2>

      <div className="uvp-banner">
        <h3>🛡️ Blocage des achats superflus</h3>
        <p>
          Quand un manager demande un casque neuf, OmniLoop vérifie le catalogue.
          Si un casque du partant est disponible → achat bloqué, réaffectation automatique.
        </p>
      </div>

      <div className="card">
        <h3 className="card-title">Demandes d'achat bloquées / réaffectées</h3>
        {purchaseRequests === null ? (
          <SkeletonTable cols={5} rows={4} />
        ) : purchaseRequests.length === 0 ? (
          <EmptyState
            icon="🛒"
            title="Aucune demande bloquée"
            message="Aucune demande d'achat n'a été bloquée ou réaffectée pour le moment."
          />
        ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Manager</th>
              <th>Article demandé</th>
              <th>Qté</th>
              <th>Statut</th>
              <th>Économie</th>
            </tr>
          </thead>
          <tbody>
            {purchaseRequests.map(pr => (
              <tr key={pr.id}>
                <td>{pr.manager}</td>
                <td>{pr.item_type}</td>
                <td>{pr.quantity}</td>
                <td>
                  <span className={`badge ${
                    pr.status === 'reassigned' ? 'badge-success' :
                    pr.status === 'blocked' ? 'badge-warning' : 'badge-info'
                  }`}>
                    {pr.status === 'reassigned' ? 'Réaffecté' : 'Bloqué'}
                  </span>
                </td>
                <td style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                  {pr.savings} €
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>

      <div className="card">
        <h3 className="card-title">Inventaire équipements</h3>
        {equipment === null ? (
          <SkeletonTable cols={5} rows={5} />
        ) : equipment.length === 0 ? (
          <EmptyState
            icon="📋"
            title="Inventaire vide"
            message="Aucun équipement n'est enregistré dans l'inventaire."
          />
        ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Marque</th>
              <th>N° Série</th>
              <th>Assigné à</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {equipment.map(eq => (
              <tr key={eq.id}>
                <td>{eq.type}</td>
                <td>{eq.brand}</td>
                <td><code>{eq.serial_number}</code></td>
                <td>{eq.employee_id || '—'}</td>
                <td>
                  <span className={`badge ${
                    eq.status === 'available' ? 'badge-success' :
                    eq.status === 'assigned' ? 'badge-info' : 'badge-warning'
                  }`}>
                    {eq.status === 'available' ? 'Disponible' :
                     eq.status === 'assigned' ? 'Assigné' : eq.status}
                  </span>
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
