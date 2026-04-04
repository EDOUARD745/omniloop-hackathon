// Données mock pour le Département Scorecard
// Score = 0-100 basé sur: % actifs réutilisés, % uniformes recyclés, taux d'interception achats

const WEIGHTS = {
  assetsReused: 0.4,
  uniformsRecycled: 0.35,
  purchaseInterception: 0.25,
}

function calcScore(assetsReused, uniformsRecycled, purchaseInterception) {
  return Math.round(
    assetsReused * WEIGHTS.assetsReused +
    uniformsRecycled * WEIGHTS.uniformsRecycled +
    purchaseInterception * WEIGHTS.purchaseInterception
  )
}

export const DEPARTMENTS = [
  {
    id: 'it',
    name: 'IT & Support',
    assetsReusedPct: 92,
    uniformsRecycledPct: 88,
    purchaseInterceptionRate: 78,
    scoreLastQuarter: 82,
  },
  {
    id: 'rh',
    name: 'Ressources Humaines',
    assetsReusedPct: 85,
    uniformsRecycledPct: 95,
    purchaseInterceptionRate: 72,
    scoreLastQuarter: 79,
  },
  {
    id: 'finance',
    name: 'Finance & Contrôle',
    assetsReusedPct: 78,
    uniformsRecycledPct: 82,
    purchaseInterceptionRate: 91,
    scoreLastQuarter: 88,
  },
  {
    id: 'commercial',
    name: 'Commercial',
    assetsReusedPct: 72,
    uniformsRecycledPct: 68,
    purchaseInterceptionRate: 65,
    scoreLastQuarter: 71,
  },
  {
    id: 'marketing',
    name: 'Marketing',
    assetsReusedPct: 88,
    uniformsRecycledPct: 75,
    purchaseInterceptionRate: 68,
    scoreLastQuarter: 74,
  },
  {
    id: 'ops',
    name: 'Opérations',
    assetsReusedPct: 65,
    uniformsRecycledPct: 72,
    purchaseInterceptionRate: 58,
    scoreLastQuarter: 62,
  },
  {
    id: 'legal',
    name: 'Juridique',
    assetsReusedPct: 82,
    uniformsRecycledPct: 90,
    purchaseInterceptionRate: 85,
    scoreLastQuarter: 84,
  },
  {
    id: 'rnd',
    name: 'R&D',
    assetsReusedPct: 68,
    uniformsRecycledPct: 55,
    purchaseInterceptionRate: 62,
    scoreLastQuarter: 64,
  },
].map((d) => ({
  ...d,
  score: calcScore(d.assetsReusedPct, d.uniformsRecycledPct, d.purchaseInterceptionRate),
})).sort((a, b) => b.score - a.score)
