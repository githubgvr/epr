
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LoginPage from './components/auth/LoginPage'
import MainLayout from './components/layout/MainLayout'
import { useAuth } from './hooks/useAuth'

// Module imports
import EPRModule from './modules/epr/EPRModule'
import ProducerModule from './modules/producer/ProducerModule'
import RecyclerModule from './modules/recycler/RecyclerModule'
import VendorModule from './modules/vendor/VendorModule'
import ComplianceModule from './modules/compliance/ComplianceModule'
import AdminModule from './modules/admin/AdminModule'

function App() {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route 
            path="/login" 
            element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/*" 
            element={
              isAuthenticated ? (
                <MainLayout>
                  <Routes>
                    <Route path="/dashboard" element={<div className="dashboard-home">
                      <h1>{t('welcome_to_epr_vault')}</h1>
                      <p>{t('select_module_to_continue')}</p>
                    </div>} />
                    <Route path="/epr/*" element={<EPRModule />} />
                    <Route path="/producer/*" element={<ProducerModule />} />
                    <Route path="/recycler/*" element={<RecyclerModule />} />
                    <Route path="/vendor/*" element={<VendorModule />} />
                    <Route path="/compliance/*" element={<ComplianceModule />} />
                    <Route path="/admin/*" element={<AdminModule />} />
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                  </Routes>
                </MainLayout>
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
