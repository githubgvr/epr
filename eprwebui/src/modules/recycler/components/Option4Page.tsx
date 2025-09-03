import React from 'react'
import { BarChart3 } from 'lucide-react'

const Option4Page: React.FC = () => {
  return (
    <div className="option-page">
      <div className="page-header">
        <BarChart3 size={32} />
        <h1>Analytics & Reports</h1>
        <p>View recycling analytics and generate reports</p>
      </div>
      <div className="coming-soon">
        <h2>Coming Soon</h2>
        <p>This feature is currently under development.</p>
      </div>
    </div>
  )
}

export default Option4Page
