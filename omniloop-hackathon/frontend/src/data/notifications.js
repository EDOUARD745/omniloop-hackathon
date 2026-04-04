// Alertes intelligentes OmniLoop

export const SEVERITY = {
  info: 'info',
  warning: 'warning',
  success: 'success',
}

export const NOTIFICATIONS = [
  {
    id: 'n1',
    message: '3 départs prévus ce mois — 12 équipements à réaffecter',
    severity: SEVERITY.info,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // il y a 2h
    targetTab: 'dashboard',
  },
  {
    id: 'n2',
    message: "Le département IT a ignoré 2 suggestions du catalogue interne cette semaine",
    severity: SEVERITY.warning,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // il y a 5h
    targetTab: 'catalogue',
  },
  {
    id: 'n3',
    message: 'Stock uniforme : 47kg en attente de collecte partenaire',
    severity: SEVERITY.warning,
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // il y a 8h
    targetTab: 'textile',
  },
  {
    id: 'n4',
    message: "Objectif CO2 trimestriel atteint à 78% — en avance sur le planning",
    severity: SEVERITY.success,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // il y a 1 jour
    targetTab: 'rse',
  },
]

export function formatNotificationTime(date) {
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "À l'instant"
  if (diffMins < 60) return `Il y a ${diffMins} min`
  if (diffHours < 24) return `Il y a ${diffHours}h`
  if (diffDays === 1) return 'Hier'
  if (diffDays < 7) return `Il y a ${diffDays} jours`
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}
