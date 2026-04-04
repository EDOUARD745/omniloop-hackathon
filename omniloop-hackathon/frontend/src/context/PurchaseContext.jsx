import { createContext, useContext, useState } from 'react'

const PurchaseContext = createContext(null)

export function PurchaseProvider({ children }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [preselectedType, setPreselectedType] = useState(null)
  const [reservedIds, setReservedIds] = useState(new Set())

  const openPurchaseModal = (itemType = null) => {
    setPreselectedType(itemType)
    setModalOpen(true)
  }

  const closePurchaseModal = () => {
    setModalOpen(false)
    setPreselectedType(null)
  }

  const reserveItem = (id) => {
    setReservedIds((prev) => new Set([...prev, id]))
  }

  return (
    <PurchaseContext.Provider
      value={{
        modalOpen,
        openPurchaseModal,
        closePurchaseModal,
        preselectedType,
        reservedIds,
        reserveItem,
      }}
    >
      {children}
    </PurchaseContext.Provider>
  )
}

export function usePurchase() {
  const ctx = useContext(PurchaseContext)
  if (!ctx) throw new Error('usePurchase must be used within PurchaseProvider')
  return ctx
}
