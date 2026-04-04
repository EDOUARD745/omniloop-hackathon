import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  const login = (username, domain) => {
    setUser({
      username,
      domain,
      displayName: username,
      email: `${username}@${domain?.toLowerCase().replace(/\s/g, '')}.com`,
    })
    setLoginModalOpen(false)
  }

  const logout = () => {
    setUser(null)
  }

  const openLoginModal = () => setLoginModalOpen(true)
  const closeLoginModal = () => setLoginModalOpen(false)

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loginModalOpen,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
