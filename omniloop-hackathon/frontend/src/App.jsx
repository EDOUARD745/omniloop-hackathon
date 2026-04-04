import { useState, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { lazy, Suspense } from 'react'
import { PurchaseProvider, usePurchase } from './context/PurchaseContext'
import { AuthProvider } from './context/AuthContext'
import { TabProvider } from './context/TabContext'
import PurchaseInterceptorModal from './components/PurchaseInterceptorModal'
import LoginModal from './components/LoginModal'
import UserMenu from './components/UserMenu'
import NotificationCenter from './components/NotificationCenter'
import PageLoading from './components/PageLoading'
import AnimatedPage from './components/AnimatedPage'
import {
  IconLogo,
  IconDashboard,
  IconOffboarding,
  IconCatalogue,
  IconRecycling,
  IconMap,
  IconROI,
  IconScorecard,
  IconActivity,
  IconAbout,
} from './components/SidebarIcons'
import './App.css'

const RSEKpiDashboard = lazy(() => import('./components/RSEKpiDashboard'))
const Dashboard = lazy(() => import('./components/Dashboard'))
const CatalogueInterne = lazy(() => import('./components/CatalogueInterne'))
const ROISimulator = lazy(() => import('./components/ROISimulator'))
const About = lazy(() => import('./components/About'))
const Textile = lazy(() => import('./components/Textile'))
const DepartmentScorecard = lazy(() => import('./components/DepartmentScorecard'))
const ActivityJournal = lazy(() => import('./components/ActivityJournal'))
const ReseauPartenaires = lazy(() => import('./components/ReseauPartenaires'))

const SIDEBAR_NAV = [
  { id: 'rse', label: 'Dashboard RSE', component: RSEKpiDashboard, icon: IconDashboard },
  { id: 'dashboard', label: 'Offboarding', component: Dashboard, icon: IconOffboarding },
  { id: 'activity', label: "Journal d'activité", component: ActivityJournal, icon: IconActivity },
  { id: 'scorecard', label: 'Département Scorecard', component: DepartmentScorecard, icon: IconScorecard },
  { id: 'catalogue', label: 'Catalogue Interne', component: CatalogueInterne, icon: IconCatalogue },
  { id: 'textile', label: 'Partenaires Recyclage', component: Textile, icon: IconRecycling },
  { id: 'partenaires', label: 'Réseau Partenaires', component: ReseauPartenaires, icon: IconMap },
  { id: 'roi', label: 'Simulateur ROI', component: ROISimulator, icon: IconROI },
  { id: 'about', label: 'À propos', component: About, icon: IconAbout },
]

const SidebarItem = memo(function SidebarItem({ item, isActive, onClick }) {
  const Icon = item.icon
  return (
    <motion.button
      className={`sidebar-item ${isActive ? 'active' : ''}`}
      onClick={onClick}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <span className="sidebar-icon">
        <Icon />
      </span>
      <span className="sidebar-label">{item.label}</span>
    </motion.button>
  )
})

function AppContent() {
  const [activeTab, setActiveTab] = useState('rse')
  const { openPurchaseModal } = usePurchase()

  const handleTabChange = useCallback((id) => {
    setActiveTab(id)
  }, [])

  const ActiveComponent = SIDEBAR_NAV.find((t) => t.id === activeTab)?.component
  const activeLabel = SIDEBAR_NAV.find((t) => t.id === activeTab)?.label

  return (
    <TabProvider setActiveTab={handleTabChange}>
    <>
      <motion.aside
        className="sidebar"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="sidebar-header">
          <motion.div
            className="logo"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <span className="logo-icon">
              <IconLogo />
            </span>
            <span className="logo-text">OmniLoop</span>
          </motion.div>
        </div>
        <nav className="sidebar-nav">
          {SIDEBAR_NAV.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            >
              <SidebarItem
                item={item}
                isActive={activeTab === item.id}
                onClick={() => handleTabChange(item.id)}
              />
            </motion.div>
          ))}
        </nav>
      </motion.aside>

      <div className="main-wrapper">
        <motion.header
          className="topbar"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
        >
          <AnimatePresence mode="wait">
            <motion.h1
              key={activeLabel}
              className="topbar-title"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
            >
              {activeLabel}
            </motion.h1>
          </AnimatePresence>
          <div className="topbar-actions">
            {activeTab !== 'about' && activeTab !== 'scorecard' && activeTab !== 'activity' && activeTab !== 'partenaires' && (
              <motion.button
                className="btn-nouvel-achat primary"
                onClick={openPurchaseModal}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Nouvel achat
              </motion.button>
            )}
            <NotificationCenter />
            <UserMenu />
          </div>
        </motion.header>

        <main className="app-content">
          <Suspense fallback={<PageLoading />}>
            <AnimatePresence mode="wait">
              {ActiveComponent && (
                <AnimatedPage key={activeTab}>
                  <ActiveComponent />
                </AnimatedPage>
              )}
            </AnimatePresence>
          </Suspense>
        </main>
      </div>

      <PurchaseInterceptorModal />
      <LoginModal />
    </>
    </TabProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <PurchaseProvider>
        <div className="app">
          <AppContent />
        </div>
      </PurchaseProvider>
    </AuthProvider>
  )
}
