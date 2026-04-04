import { motion } from 'framer-motion'
import { CATALOGUE_ITEMS } from '../data/catalogue'
import { usePurchase } from '../context/PurchaseContext'
import { useTab } from '../context/TabContext'
import EmptyState from './EmptyState'

const CONDITION_STYLES = {
  Neuf: 'catalogue-condition-neuf',
  'Très bon': 'catalogue-condition-tresbon',
  Bon: 'catalogue-condition-bon',
}

export default function CatalogueInterne() {
  const { reservedIds, reserveItem } = usePurchase()
  const { setActiveTab } = useTab() || {}

  const handleReserve = (id) => {
    reserveItem(id)
  }

  return (
    <div className="catalogue-interne">
      <div className="catalogue-banner">
        <span className="catalogue-banner-icon">⚠️</span>
        <p className="catalogue-banner-text">
          Avant d'acheter du matériel neuf, consultez le catalogue interne.{' '}
          <strong>
            {CATALOGUE_ITEMS.length === 0
              ? 'Aucun article disponible.'
              : `${CATALOGUE_ITEMS.length} articles disponibles cette semaine.`}
          </strong>
        </p>
      </div>

      <h2 className="catalogue-title">Catalogue Interne</h2>
      <p className="catalogue-subtitle">
        Équipements reconditionnés issus des offboardings — réservez avant d'acheter du neuf
      </p>

      {CATALOGUE_ITEMS.length === 0 ? (
        <div className="card">
          <EmptyState
            icon="📦"
            title="Catalogue vide"
            message="Aucun équipement reconditionné n'est disponible pour le moment. Les articles apparaîtront après les offboardings."
            ctaLabel="Voir les offboardings"
            onCta={() => setActiveTab?.('dashboard')}
          />
        </div>
      ) : (
      <div className="catalogue-grid">
        {CATALOGUE_ITEMS.map((item, i) => (
          <motion.article
            key={item.id}
            className="catalogue-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.08)' }}
          >
            <div className="catalogue-card-photo">
              <span className="catalogue-card-placeholder">
                {item.type === 'Écran' && '🖥️'}
                {item.type === 'Casque' && '🎧'}
                {item.type === 'Clavier' && '⌨️'}
                {item.type === 'Chaise' && '🪑'}
              </span>
            </div>
            <div className="catalogue-card-body">
              <div className="catalogue-card-type">{item.type}</div>
              <h3 className="catalogue-card-name">
                {item.brand} {item.model}
              </h3>
              <span className={`catalogue-condition ${CONDITION_STYLES[item.condition]}`}>
                {item.condition}
              </span>
              <div className="catalogue-card-price">
                Prix d'origine : <strong>{item.originalPrice.toLocaleString('fr-FR')} €</strong>
              </div>
              <button
                className="primary catalogue-btn-reserve"
                onClick={() => handleReserve(item.id)}
                disabled={reservedIds.has(item.id)}
              >
                {reservedIds.has(item.id) ? 'Réservé ✓' : 'Réserver'}
              </button>
            </div>
          </motion.article>
        ))}
      </div>
      )}
    </div>
  )
}
