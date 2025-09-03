import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProducerDashboard from './components/ProducerDashboard'
import ProductManagement from './components/ProductManagement'
import ProductCompositionManagement from './components/ProductCompositionManagement'
import MaterialTypes from './components/MaterialTypes'
import MaterialComponent from './components/Material'
import MaterialManagementDashboard from './components/MaterialManagementDashboard'
import TrackingCompliance from './components/TrackingCompliance'
import ReportsPage from './components/ReportsPage'

const ProducerModule: React.FC = () => {
  return (
    <div className="producer-module">
      <Routes>
        <Route path="/dashboard" element={<ProducerDashboard />} />
        <Route path="/products" element={<ProductManagement />} />
        <Route path="/product-compositions" element={<ProductCompositionManagement />} />
        <Route path="/material-management" element={<MaterialManagementDashboard />} />
        <Route path="/material-types" element={<MaterialTypes />} />
        <Route path="/materials" element={<MaterialComponent />} />
        <Route path="/compliance" element={<TrackingCompliance />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/" element={<Navigate to="/producer/dashboard" />} />
      </Routes>
    </div>
  )
}

export default ProducerModule
