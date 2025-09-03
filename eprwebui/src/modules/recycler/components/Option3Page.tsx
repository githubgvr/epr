import React from 'react'
import { Target } from 'lucide-react'

const Option3Page: React.FC = () => {
  return (
    <div className="option-page">
      <div className="page-header">
        <Target size={32} />
        <h1>Tracking Targets</h1>
        <p>Monitor recycling targets and achievement metrics</p>
      </div>
      <div className="coming-soon">
        <h2>Coming Soon</h2>
        <p>This feature is currently under development.</p>
      </div>
    </div>
  )
}

export default Option3Page
