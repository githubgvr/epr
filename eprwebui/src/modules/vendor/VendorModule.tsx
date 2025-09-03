import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import VendorDashboard from '../../components/vendor/VendorDashboard'
import VendorManagement from '../../components/vendor/VendorManagement'
import VendorCreation from '../../components/vendor/VendorCreation'
import VendorPerformance from '../../components/vendor/VendorPerformance'

const VendorModule: React.FC = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<VendorDashboard />} />
      <Route path="/management" element={<VendorManagement />} />
      <Route path="/create" element={<VendorCreation />} />
      <Route path="/performance" element={<VendorPerformance />} />
      <Route path="/" element={<Navigate to="/vendor/dashboard" />} />
    </Routes>
  )
}

export default VendorModule
