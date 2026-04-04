import { useState, useEffect } from 'react'

const API_URL = ''

const statusLabels = {
  pending: 'En attente',
  in_progress: 'En cours',
  completed: 'Terminé'
}

const statusBadge = {
  pending: 'badge-warning',
  in_progress: 'badge-in-progress',
  completed: 'badge-success'
}

export default function Employees() {
  const [employees, setEmployees] = useState([])
  const [selected, setSelected] = useState(null)
  const [detail, setDetail] = useState(null)

  useEffect(() => {
    fetch(`${API_URL}/api/employees`)
      .then(res => res.json())
      .then(data => setEmployees(data.employees || []))
  }, [])

  useEffect(() => {
    if (!selected) {
      setDetail(null)
      return
    }
    fetch(`${API_URL}/api/employees/${selected}`)
      .then(res => res.json())
      .then(setDetail)
  }, [selected])

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>
        Départs annoncés (connexion Workday)
      </h2>

      <div className="card">
        <h3 className="card-title">Employés en cours d'offboarding</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Département</th>
              <th>Date de départ</th>
              <th>Statut</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id}>
                <td><strong>{emp.name}</strong></td>
                <td>{emp.department}</td>
                <td>{emp.departure_date}</td>
                <td>
                  <span className={`badge ${statusBadge[emp.status] || 'badge-info'}`}>
                    {statusLabels[emp.status] || emp.status}
                  </span>
                </td>
                <td>
                  <button
                    className="secondary"
                    onClick={() => setSelected(selected === emp.id ? null : emp.id)}
                  >
                    {selected === emp.id ? 'Masquer' : 'Détails'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {detail && (
        <div className="card">
          <h3 className="card-title">
            Empreinte matérielle — {detail.employee.name}
          </h3>

          <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>🖥️ Équipements IT</h4>
          {detail.equipment?.length > 0 ? (
            <table className="table" style={{ marginBottom: '1.5rem' }}>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Marque</th>
                  <th>N° Série</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {detail.equipment.map(eq => (
                  <tr key={eq.id}>
                    <td>{eq.type}</td>
                    <td>{eq.brand}</td>
                    <td><code>{eq.serial_number}</code></td>
                    <td><span className="badge badge-info">{eq.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
              Aucun équipement assigné
            </p>
          )}

          <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>👕 Recyclage textile</h4>
          {detail.textile_order ? (
            <div style={{
              background: 'var(--color-surface-hover)',
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1rem'
            }}>
              <p><strong>Commande :</strong> {detail.textile_order.id}</p>
              <p><strong>Poids total :</strong> {detail.textile_order.total_kg} kg</p>
              <p><strong>Statut :</strong>
                <span className={`badge ${statusBadge[detail.textile_order.status] || 'badge-info'}`}
                  style={{ marginLeft: '0.5rem' }}
                >
                  {detail.textile_order.status}
                </span>
              </p>
            </div>
          ) : (
            <p style={{ color: 'var(--color-text-muted)' }}>
              Aucune commande textile
            </p>
          )}
        </div>
      )}
    </div>
  )
}
