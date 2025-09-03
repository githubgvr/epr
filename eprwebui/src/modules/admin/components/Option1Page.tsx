import React from 'react'
import { Users } from 'lucide-react'

const Option1Page: React.FC = () => {
  return (
    <div className="option-page">
      <div className="page-header">
        <Users size={32} />
        <h1>User Management</h1>
        <p>Manage system users and permissions</p>
      </div>
      <div className="coming-soon">
        <h2>Coming Soon</h2>
        <p>This feature is currently under development.</p>
      </div>
    </div>
  )
}

export default Option1Page
