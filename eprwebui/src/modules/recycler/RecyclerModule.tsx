import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import RecyclerDashboard from './components/RecyclerDashboard'
import RecycleLogManagement from './components/RecycleLogManagement'
import RecyclingCertificationManagement from './components/RecyclingCertificationManagement'
import TracingTargetManagement from './components/TracingTargetManagement'

const RecyclerModule: React.FC = () => {
  return (
    <div className="recycler-module">
      <Routes>
        <Route path="/dashboard" element={<RecyclerDashboard />} />
        <Route path="/recycle-logs" element={<RecycleLogManagement />} />
        <Route path="/certifications" element={<RecyclingCertificationManagement />} />
        <Route path="/tracing-targets" element={<TracingTargetManagement />} />
        <Route path="/" element={<Navigate to="/recycler/dashboard" />} />
      </Routes>
    </div>
  )
}

export default RecyclerModule
