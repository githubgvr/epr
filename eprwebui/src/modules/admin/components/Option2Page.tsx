import React from 'react'
import { Settings } from 'lucide-react'

const Option2Page: React.FC = () => {
  return (
    <div className="option-page">
      <div className="page-header">
        <Settings size={32} />
        <h1>System Settings</h1>
        <p>Configure system settings and preferences</p>
      </div>
      <div className="coming-soon">
        <h2>Coming Soon</h2>
        <p>This feature is currently under development.</p>
      </div>
    </div>
  )
}

export default Option2Page
