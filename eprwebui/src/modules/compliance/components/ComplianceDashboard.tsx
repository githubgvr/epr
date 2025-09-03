import React from 'react'
import { Shield, FileText, BarChart3, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import './ComplianceDashboard.css'

const ComplianceDashboard: React.FC = () => {
  return (
    <div className="compliance-dashboard">
      <div className="dashboard-header">
        <h1>Compliance Dashboard</h1>
        <p>Monitor compliance status and regulatory requirements</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card compliant">
          <div className="stat-icon">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>94%</h3>
            <p>Compliance Rate</p>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <h3>12</h3>
            <p>Pending Reviews</p>
          </div>
        </div>
        <div className="stat-card alerts">
          <div className="stat-icon">
            <AlertCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>3</h3>
            <p>Active Alerts</p>
          </div>
        </div>
        <div className="stat-card reports">
          <div className="stat-icon">
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <h3>28</h3>
            <p>Reports Generated</p>
          </div>
        </div>
      </div>

      <div className="coming-soon">
        <Shield size={48} />
        <h2>Compliance Module</h2>
        <p>Advanced compliance monitoring and reporting features are currently under development.</p>
      </div>


    </div>
  )
}

export default ComplianceDashboard
