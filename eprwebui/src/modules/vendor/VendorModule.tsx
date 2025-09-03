import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import VendorManagement from '../../components/vendor/VendorManagement'

const VendorModule: React.FC = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={
        <div className="module-dashboard">
          <h1>Vendor Dashboard</h1>
          <p>Welcome to the Vendor Management module</p>
        </div>
      } />
      <Route path="/management" element={<VendorManagement />} />
      <Route path="/" element={<Navigate to="/vendor/dashboard" />} />
    </Routes>
  )
}

export default VendorModule
