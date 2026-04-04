import { createContext, useContext } from 'react'

const TabContext = createContext(null)

export function TabProvider({ children, setActiveTab }) {
  return (
    <TabContext.Provider value={{ setActiveTab }}>
      {children}
    </TabContext.Provider>
  )
}

export function useTab() {
  const ctx = useContext(TabContext)
  return ctx
}
