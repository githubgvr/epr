import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import EPRDashboard from './components/EPRDashboard'
import Organization from './components/Organization'
import OrganizationOnboarding from './components/OrganizationOnboarding'
import CompanyProfile from './components/CompanyProfile'
import Account from './components/Account'

const EPRModule: React.FC = () => {
  return (
    <div className="epr-module">
      <Routes>
        <Route path="/dashboard" element={<EPRDashboard />} />
        <Route path="/organization" element={<Organization />} />
        <Route path="/onboarding" element={<OrganizationOnboarding />} />
        <Route path="/company-profile" element={<CompanyProfile />} />
        <Route path="/account" element={<Account />} />
        <Route path="/" element={<Navigate to="/epr/dashboard" />} />
      </Routes>
    </div>
  )
}

export default EPRModule
