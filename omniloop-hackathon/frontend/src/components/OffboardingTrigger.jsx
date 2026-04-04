import { useState } from 'react'

const API_URL = ''

const TRACK_STATUS = { pending: 'Pending', in_progress: 'In Progress', done: 'Done' }

export default function OffboardingTrigger() {
  const [form, setForm] = useState({
    name: '',
    department: '',
    role: '',
    exitDate: '',
    assets: {
      laptop: 0,
      screen: 0,
      headset: 0,
      badge: 0,
      uniformKg: 0,
    },
  })
  const [workflow, setWorkflow] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name.startsWith('assets.')) {
      const key = name.split('.')[1]
      setForm(prev => ({
        ...prev,
        assets: {
          ...prev.assets,
          [key]: type === 'checkbox' ? (checked ? 1 : 0) : (parseFloat(value) || 0),
        },
      }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  const runWorkflowAnimation = () => {
    setWorkflow({
      it: 'pending',
      security: 'pending',
      hr: 'pending',
    })

    // IT Track: 0 → 1s pending, 1s → 3s in_progress, 3s → done
    setTimeout(() => setWorkflow(w => ({ ...w, it: 'in_progress' })), 800)
    setTimeout(() => setWorkflow(w => ({ ...w, it: 'done' })), 2500)

    // Security Track: 0.5s → 2s pending, 2s → 4s in_progress, 4s → done
    setTimeout(() => setWorkflow(w => ({ ...w, security: 'in_progress' })), 1500)
    setTimeout(() => setWorkflow(w => ({ ...w, security: 'done' })), 3500)

    // HR Track: 1s → 2.5s pending, 2.5s → 4.5s in_progress, 4.5s → done
    setTimeout(() => setWorkflow(w => ({ ...w, hr: 'in_progress' })), 2200)
    setTimeout(() => setWorkflow(w => ({ ...w, hr: 'done' })), 4200)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await fetch(`${API_URL}/api/offboarding/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    } catch (_) {}
    runWorkflowAnimation()
    setSubmitting(false)
  }

  const getStatusBadgeClass = (status) => {
    if (status === 'done') return 'workflow-badge workflow-badge-done'
    if (status === 'in_progress') return 'workflow-badge workflow-badge-progress'
    return 'workflow-badge workflow-badge-pending'
  }

  return (
    <div className="offboarding-trigger card">
      <h3 className="card-title">Offboarding Trigger</h3>
      <div className="offboarding-ssh-info">
        <span className="offboarding-ssh-icon">⌘</span>
        Les employés accèdent via <strong>SSH</strong> avec leur compte entreprise
      </div>

      <form onSubmit={handleSubmit} className="offboarding-form">
        <div className="form-row">
          <div className="form-group">
            <label>Nom de l'employé</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Marie Dupont"
              required
            />
          </div>
          <div className="form-group">
            <label>Département</label>
            <input
              type="text"
              name="department"
              value={form.department}
              onChange={handleChange}
              placeholder="IT Support"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Poste / Rôle</label>
            <input
              type="text"
              name="role"
              value={form.role}
              onChange={handleChange}
              placeholder="Technicien support"
              required
            />
          </div>
          <div className="form-group">
            <label>Date de départ</label>
            <input
              type="date"
              name="exitDate"
              value={form.exitDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <label className="form-section-label">Équipements assignés</label>
          <div className="assets-grid">
            <div className="form-group asset-field">
              <label>Ordinateur portable</label>
              <input
                type="number"
                name="assets.laptop"
                min="0"
                value={form.assets.laptop}
                onChange={handleChange}
              />
            </div>
            <div className="form-group asset-field">
              <label>Écran(s)</label>
              <input
                type="number"
                name="assets.screen"
                min="0"
                value={form.assets.screen}
                onChange={handleChange}
              />
            </div>
            <div className="form-group asset-field">
              <label>Casque(s)</label>
              <input
                type="number"
                name="assets.headset"
                min="0"
                value={form.assets.headset}
                onChange={handleChange}
              />
            </div>
            <div className="form-group asset-field">
              <label>Badge(s)</label>
              <input
                type="number"
                name="assets.badge"
                min="0"
                value={form.assets.badge}
                onChange={handleChange}
              />
            </div>
            <div className="form-group asset-field">
              <label>Uniforme (kg)</label>
              <input
                type="number"
                name="assets.uniformKg"
                min="0"
                step="0.1"
                value={form.assets.uniformKg}
                onChange={handleChange}
                placeholder="2.5"
              />
            </div>
          </div>
        </div>

        <button type="submit" className="primary" disabled={submitting}>
          {submitting ? 'Envoi...' : 'Déclencher l\'offboarding'}
        </button>
      </form>

      {workflow && (
        <div className="workflow-container">
          <h4 className="workflow-title">Workflow en cours</h4>
          <div className="workflow-tracks">
            <div className="workflow-track">
              <div className="workflow-track-header">
                <span className="workflow-track-icon">🖥️</span>
                <span className="workflow-track-name">IT Track</span>
                <span className={getStatusBadgeClass(workflow.it)}>
                  {TRACK_STATUS[workflow.it]}
                </span>
              </div>
              <p className="workflow-track-desc">Actifs redirigés vers le catalogue interne</p>
            </div>

            <div className="workflow-track">
              <div className="workflow-track-header">
                <span className="workflow-track-icon">🔒</span>
                <span className="workflow-track-name">Security Track</span>
                <span className={getStatusBadgeClass(workflow.security)}>
                  {TRACK_STATUS[workflow.security]}
                </span>
              </div>
              <p className="workflow-track-desc">Uniforme envoyé au partenaire recyclage</p>
            </div>

            <div className="workflow-track">
              <div className="workflow-track-header">
                <span className="workflow-track-icon">👤</span>
                <span className="workflow-track-name">HR Track</span>
                <span className={getStatusBadgeClass(workflow.hr)}>
                  {TRACK_STATUS[workflow.hr]}
                </span>
              </div>
              <p className="workflow-track-desc">Checklist offboarding mise à jour</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
