// Catalogue interne partagé — utilisé par CatalogueInterne et Purchase Interceptor
export const CATALOGUE_ITEMS = [
  { id: 1, type: 'Écran', brand: 'Dell', model: 'P2422H', condition: 'Très bon', originalPrice: 249, co2Evite: 28 },
  { id: 2, type: 'Écran', brand: 'HP', model: 'E24 G4', condition: 'Bon', originalPrice: 199, co2Evite: 25 },
  { id: 3, type: 'Écran', brand: 'LG', model: '24MP88HV', condition: 'Neuf', originalPrice: 279, co2Evite: 32 },
  { id: 4, type: 'Casque', brand: 'Jabra', model: 'Evolve 40', condition: 'Très bon', originalPrice: 89, co2Evite: 5 },
  { id: 5, type: 'Casque', brand: 'Sennheiser', model: 'SC 660', condition: 'Bon', originalPrice: 149, co2Evite: 8 },
  { id: 6, type: 'Casque', brand: 'Logitech', model: 'H390', condition: 'Très bon', originalPrice: 45, co2Evite: 3 },
  { id: 7, type: 'Clavier', brand: 'Logitech', model: 'K380', condition: 'Bon', originalPrice: 59, co2Evite: 8 },
  { id: 8, type: 'Clavier', brand: 'Microsoft', model: 'Surface Keyboard', condition: 'Neuf', originalPrice: 129, co2Evite: 12 },
  { id: 9, type: 'Clavier', brand: 'Dell', model: 'KB216', condition: 'Très bon', originalPrice: 35, co2Evite: 6 },
  { id: 10, type: 'Chaise', brand: 'Herman Miller', model: 'Aeron', condition: 'Très bon', originalPrice: 1299, co2Evite: 85 },
  { id: 11, type: 'Chaise', brand: 'Steelcase', model: 'Think', condition: 'Bon', originalPrice: 699, co2Evite: 52 },
  { id: 12, type: 'Chaise', brand: 'Ikea', model: 'Markus', condition: 'Très bon', originalPrice: 199, co2Evite: 28 },
]

export const ITEM_TYPES = ['Écran', 'Casque', 'Clavier', 'Chaise']

export function findMatchingItem(type, reservedIds = new Set()) {
  return CATALOGUE_ITEMS.find(
    (item) => item.type === type && !reservedIds.has(item.id)
  )
}
