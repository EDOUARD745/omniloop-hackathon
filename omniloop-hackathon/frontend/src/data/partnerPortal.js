// Données pour le portail partenaire (vue du centre de recyclage)

// Partenaire connecté simulé : OmniRecycle Île-de-France (p6)
export const CURRENT_PARTNER_ID = 'p6'

// Collectes en attente assignées à ce partenaire
export const PENDING_PICKUPS = [
  {
    id: 'pp1',
    location: '15 rue de Rivoli, 75001 Paris',
    volume: 47,
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    status: 'planned',
  },
  {
    id: 'pp2',
    location: '8 avenue des Champs-Élysées, 75008 Paris',
    volume: 28,
    date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    status: 'planned',
  },
  {
    id: 'pp3',
    location: '42 boulevard Haussmann, 75009 Paris',
    volume: 85,
    date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    status: 'planned',
  },
]

// Performance mensuelle du partenaire
export const PARTNER_PERFORMANCE = {
  kgProcessed: 2840,
  certificatesIssued: 18,
  averageTurnaroundDays: 2.4,
}
