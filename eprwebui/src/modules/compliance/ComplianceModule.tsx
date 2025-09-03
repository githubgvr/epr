import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ComplianceDashboard from './components/ComplianceDashboard'
import Option1Page from './components/Option1Page'
import Option2Page from './components/Option2Page'
import Option3Page from './components/Option3Page'

const ComplianceModule: React.FC = () => {
  return (
    <div className="compliance-module">
      <Routes>
        <Route path="/dashboard" element={<ComplianceDashboard />} />
        <Route path="/option1" element={<Option1Page />} />
        <Route path="/option2" element={<Option2Page />} />
        <Route path="/option3" element={<Option3Page />} />
        <Route path="/" element={<Navigate to="/compliance/dashboard" />} />
      </Routes>
    </div>
  )
}

export default ComplianceModule
