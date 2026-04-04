// Planification des collectes — événements programmés

export const PICKUP_STATUS = {
  planned: 'Planifié',
  confirmed: 'Confirmé',
  collected: 'Collecté',
  certified: 'Certifié',
}

const PARTNER_IDS = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8']

function addDays(d, n) {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  r.setHours(0, 0, 0, 0)
  return r
}

function generatePickups() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const pickups = []
  const statuses = ['planned', 'planned', 'confirmed', 'confirmed', 'collected', 'certified']

  // Génère des collectes réparties sur 4 semaines (au moins 2 par jour sur plusieurs jours)
  const dayOffsets = [
    -3, -1, 0, 1, 2, 4, 5, 7, 8, 10, 12, 14, 16, 18, 20, 22, 25,
  ]
  dayOffsets.forEach((offset, idx) => {
    const date = addDays(today, offset)
    const partnerId = PARTNER_IDS[idx % PARTNER_IDS.length]
    const kg = [12, 28, 35, 47, 52, 68, 85, 120][idx % 8]
    const status = statuses[idx % statuses.length]

    pickups.push({
      id: `pickup-${offset}-${idx}-${Math.random().toString(36).slice(2, 9)}`,
      partnerId,
      date,
      kg,
      status,
    })
  })

  return pickups.sort((a, b) => a.date - b.date)
}

export const SCHEDULED_PICKUPS = generatePickups()
