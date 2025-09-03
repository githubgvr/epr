import React from 'react'
import { BarChart3 } from 'lucide-react'

const ReportsPage: React.FC = () => {
  return (
    <div className="reports-page">
      <div className="page-header">
        <div className="header-content">
          <div className="header-title">
            <BarChart3 className="header-icon" />
            <h1>Reports</h1>
          </div>
          <p className="header-description">
            View and generate EPR compliance reports
          </p>
        </div>
      </div>

      <div className="coming-soon">
        <BarChart3 size={64} />
        <h2>Reports Coming Soon</h2>
        <p>
          This section will contain comprehensive reporting features for EPR compliance tracking,
          including material type usage reports, compliance status reports, and regulatory submissions.
        </p>
      </div>
    </div>
  )
}

export default ReportsPage
