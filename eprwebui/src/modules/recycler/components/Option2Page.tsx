import React from 'react'
import { Award } from 'lucide-react'

const Option2Page: React.FC = () => {
  return (
    <div className="option-page">
      <div className="page-header">
        <Award size={32} />
        <h1>Certifications</h1>
        <p>Manage recycling certifications and compliance documents</p>
      </div>
      <div className="coming-soon">
        <h2>Coming Soon</h2>
        <p>This feature is currently under development.</p>
      </div>
    </div>
  )
}

export default Option2Page
