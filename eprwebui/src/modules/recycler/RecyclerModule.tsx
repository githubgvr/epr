import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import RecyclerDashboard from './components/RecyclerDashboard'
import Option1Page from './components/Option1Page'
import Option2Page from './components/Option2Page'
import Option3Page from './components/Option3Page'
import Option4Page from './components/Option4Page'

const RecyclerModule: React.FC = () => {
  return (
    <div className="recycler-module">
      <Routes>
        <Route path="/dashboard" element={<RecyclerDashboard />} />
        <Route path="/option1" element={<Option1Page />} />
        <Route path="/option2" element={<Option2Page />} />
        <Route path="/option3" element={<Option3Page />} />
        <Route path="/option4" element={<Option4Page />} />
        <Route path="/" element={<Navigate to="/recycler/dashboard" />} />
      </Routes>
    </div>
  )
}

export default RecyclerModule
