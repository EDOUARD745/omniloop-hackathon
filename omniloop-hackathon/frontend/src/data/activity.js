// Journal d'activité OmniLoop — événements en temps réel

export const EVENT_TYPES = {
  offboarding: 'offboarding',
  reaffected: 'reaffected',
  pickup: 'pickup',
  report: 'report',
}

export const EVENT_TYPE_LABELS = {
  offboarding: "Offboarding déclenché",
  reaffected: "Actif réaffecté",
  pickup: "Collecte programmée",
  report: "Rapport généré",
}

export const DEPARTMENTS_LIST = ['IT & Support', 'Ressources Humaines', 'Finance', 'Commercial', 'Marketing', 'Opérations', 'Juridique', 'R&D']

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function addHours(d, h) {
  const r = new Date(d)
  r.setTime(r.getTime() + h * 60 * 60 * 1000)
  return r
}

function addDays(d, n) {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

// Génère des événements sur les 7 derniers jours
function generateEvents() {
  const now = new Date()
  const events = []

  const templates = [
    {
      type: EVENT_TYPES.offboarding,
      icon: '👋',
      desc: (dept) => `Offboarding déclenché pour un employé du département ${dept}`,
      impact: () => `💚 ${randInt(200, 800)}€ économisés · ${randInt(15, 45)}kg CO₂ évité`,
    },
    {
      type: EVENT_TYPES.reaffected,
      icon: '🔄',
      desc: (dept) => `Écran Dell P2422H réaffecté depuis le catalogue vers ${dept}`,
      impact: () => `💚 ${randInt(150, 350)}€ économisés · ${randInt(12, 35)}kg CO₂ évité`,
    },
    {
      type: EVENT_TYPES.reaffected,
      icon: '🔄',
      desc: (dept) => `Casque Jabra Evolve réaffecté à un nouvel arrivant — ${dept}`,
      impact: () => `💚 ${randInt(80, 120)}€ économisés · ${randInt(5, 12)}kg CO₂ évité`,
    },
    {
      type: EVENT_TYPES.pickup,
      icon: '📦',
      desc: (dept) => `Collecte uniformes programmée — ${randInt(8, 65)}kg en attente`,
      impact: () => `♻️ ${randInt(15, 55)}kg textile à recycler`,
    },
    {
      type: EVENT_TYPES.pickup,
      icon: '📦',
      desc: (dept) => `Bon d'expédition généré pour le centre partenaire (${dept})`,
      impact: () => `♻️ ${randInt(20, 80)}kg uniformes collectés`,
    },
    {
      type: EVENT_TYPES.report,
      icon: '📊',
      desc: (dept) => `Rapport CSRD généré — synthèse trimestrielle`,
      impact: () => `📈 ${randInt(1200, 4500)}kg CO₂ évité ce trimestre`,
    },
    {
      type: EVENT_TYPES.report,
      icon: '📊',
      desc: (dept) => `Rapport Département Scorecard envoyé à ${dept}`,
      impact: () => `📈 Score économie circulaire partagé`,
    },
    {
      type: EVENT_TYPES.offboarding,
      icon: '👋',
      desc: (dept) => `Nouveau départ annoncé — ${dept} — 3 équipements à récupérer`,
      impact: () => `💚 ${randInt(400, 1200)}€ économisés · ${randInt(40, 90)}kg CO₂ évité`,
    },
  ]

  let id = 1
  for (let day = 0; day < 7; day++) {
    const eventsPerDay = randInt(2, 6)
    for (let i = 0; i < eventsPerDay; i++) {
      const t = rand(templates)
      const dept = rand(DEPARTMENTS_LIST)
      const baseDate = addDays(now, -day)
      const hour = randInt(8, 18)
      const minute = randInt(0, 59)
      const date = new Date(baseDate)
      date.setHours(hour, minute, 0, 0)

      events.push({
        id: `evt-${id++}`,
        type: t.type,
        icon: t.icon,
        description: t.desc(dept),
        department: dept,
        impact: t.impact(),
        timestamp: date,
      })
    }
  }

  return events.sort((a, b) => b.timestamp - a.timestamp)
}

export const ACTIVITY_EVENTS = generateEvents()

