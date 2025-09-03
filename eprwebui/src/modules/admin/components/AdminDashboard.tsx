import React from 'react'
import { Users, Settings, FileText, BarChart3, Shield, Database, CreditCard } from 'lucide-react'
import { Link } from 'react-router-dom'
import './AdminDashboard.css'

const AdminDashboard: React.FC = () => {
  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>System administration and user management</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card users">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>156</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card organizations">
          <div className="stat-icon">
            <Shield size={24} />
          </div>
          <div className="stat-content">
            <h3>23</h3>
            <p>Organizations</p>
          </div>
        </div>
        <div className="stat-card reports">
          <div className="stat-icon">
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <h3>89</h3>
            <p>System Reports</p>
          </div>
        </div>
        <div className="stat-card performance">
          <div className="stat-icon">
            <BarChart3 size={24} />
          </div>
          <div className="stat-content">
            <h3>99.2%</h3>
            <p>System Uptime</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <div className="action-card disabled">
            <div className="action-icon">
              <Users size={32} />
            </div>
            <div className="action-content">
              <h3>User Management</h3>
              <p>Coming Soon</p>
            </div>
          </div>

          <div className="action-card disabled">
            <div className="action-icon">
              <Settings size={32} />
            </div>
            <div className="action-content">
              <h3>System Settings</h3>
              <p>Coming Soon</p>
            </div>
          </div>

          <div className="action-card disabled">
            <div className="action-icon">
              <Database size={32} />
            </div>
            <div className="action-content">
              <h3>Database Management</h3>
              <p>Coming Soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
