import React from 'react'
import { FileText } from 'lucide-react'

const Option2Page: React.FC = () => {
  return (
    <div className="option-page">
      <div className="page-header">
        <FileText size={32} />
        <h1>Compliance Reports</h1>
        <p>Generate and manage compliance reports</p>
      </div>
      <div className="coming-soon">
        <h2>Coming Soon</h2>
        <p>This feature is currently under development.</p>
      </div>
    </div>
  )
}

export default Option2Page
