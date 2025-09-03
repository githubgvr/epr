import React from 'react'
import { Recycle } from 'lucide-react'

const Option1Page: React.FC = () => {
  return (
    <div className="option-page">
      <div className="page-header">
        <Recycle size={32} />
        <h1>Log Recycling Details</h1>
        <p>Record recycling activities for linked products</p>
      </div>
      <div className="coming-soon">
        <h2>Coming Soon</h2>
        <p>This feature is currently under development.</p>
      </div>
    </div>
  )
}

export default Option1Page
