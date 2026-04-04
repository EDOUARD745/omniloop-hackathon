import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePurchase } from '../context/PurchaseContext'
import { ITEM_TYPES, findMatchingItem } from '../data/catalogue'

export default function PurchaseInterceptorModal() {
  const { modalOpen, closePurchaseModal, preselectedType, reservedIds, reserveItem } = usePurchase()
  const [selectedType, setSelectedType] = useState(ITEM_TYPES[0])
  const [confirmNewPurchase, setConfirmNewPurchase] = useState(false)

  useEffect(() => {
    if (modalOpen) {
      setSelectedType(preselectedType || ITEM_TYPES[0])
    }
  }, [modalOpen, preselectedType])

  const matchingItem = findMatchingItem(selectedType, reservedIds)
  const showInterceptor = !!matchingItem

  const handleReserveInternal = () => {
    reserveItem(matchingItem.id)
    closePurchaseModal()
    setConfirmNewPurchase(false)
  }

  const handleBuyNew = () => {
    if (!confirmNewPurchase) {
      setConfirmNewPurchase(true)
      return
    }
    closePurchaseModal()
    setConfirmNewPurchase(false)
  }

  const handleClose = () => {
    closePurchaseModal()
    setConfirmNewPurchase(false)
  }

  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          className="modal-overlay"
          onClick={handleClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="modal-content purchase-interceptor"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
        <button className="modal-close" onClick={handleClose} aria-label="Fermer">
          ×
        </button>

        <h2 className="modal-title">Nouvel achat</h2>
        <p className="modal-subtitle">Que souhaitez-vous acheter ?</p>

        <select
          className="modal-select"
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value)
            setConfirmNewPurchase(false)
          }}
        >
          {ITEM_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {showInterceptor ? (
          <div className="interceptor-block">
            <div className="interceptor-alert">
              <span className="interceptor-icon">⚠️</span>
              <p className="interceptor-message">
                Un <strong>{matchingItem.brand} {matchingItem.model}</strong> est disponible en interne.
              </p>
              <div className="interceptor-stats">
                <span>Économie potentielle : <strong>{matchingItem.originalPrice.toLocaleString('fr-FR')} €</strong></span>
                <span>CO₂ évité : <strong>{matchingItem.co2Evite} kg</strong></span>
              </div>
            </div>
            <div className="interceptor-actions">
              <button className="primary interceptor-btn-reserve" onClick={handleReserveInternal}>
                Réserver l'équipement interne
              </button>
              <button
                className="secondary interceptor-btn-new"
                onClick={handleBuyNew}
              >
                {confirmNewPurchase ? "Confirmer l'achat neuf" : "Acheter neuf quand même"}
              </button>
            </div>
            {confirmNewPurchase && (
              <p className="interceptor-warning">
                Cela génère du gaspillage et des coûts supplémentaires. Êtes-vous sûr ?
              </p>
            )}
          </div>
        ) : (
          <div className="interceptor-no-match">
            <p>Aucun équipement correspondant disponible dans le catalogue interne.</p>
            <p className="interceptor-no-match-sub">Vous pouvez procéder à l'achat neuf.</p>
            <button className="primary" onClick={handleClose}>
              Compris
            </button>
          </div>
        )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
