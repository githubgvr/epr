import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { 
  Package, 
  Layers, 
  Plus, 
  BarChart3, 
  TrendingUp,
  ArrowRight
} from 'lucide-react'
import './MaterialManagementDashboard.css'

const MaterialManagementDashboard: React.FC = () => {
  const { t } = useTranslation()

  const stats = [
    {
      title: 'Total Material Types',
      value: 12,
      icon: Package,
      color: '#2c5530',
      change: '+2',
      link: '/producer/material-types'
    },
    {
      title: 'Total Materials',
      value: 156,
      icon: Layers,
      color: '#6f42c1',
      change: '+15',
      link: '/producer/materials'
    },
    {
      title: 'Active Materials',
      value: 142,
      icon: TrendingUp,
      color: '#28a745',
      change: '+8',
      link: '/producer/materials'
    },
    {
      title: 'Compliance Rate',
      value: '94%',
      icon: BarChart3,
      color: '#17a2b8',
      change: '+3%',
      link: '/producer/compliance'
    }
  ]

  const quickActions = [
    {
      title: 'Manage Material Types',
      description: 'Add, edit, and organize material type categories',
      icon: Package,
      link: '/producer/material-types',
      color: '#2c5530'
    },
    {
      title: 'Manage Materials',
      description: 'Add and manage individual materials for your products',
      icon: Layers,
      link: '/producer/materials',
      color: '#6f42c1'
    },
    {
      title: 'Add Material Type',
      description: 'Create a new material type category',
      icon: Plus,
      link: '/producer/material-types',
      color: '#28a745'
    },
    {
      title: 'Add Material',
      description: 'Register a new material for EPR compliance',
      icon: Plus,
      link: '/producer/materials',
      color: '#17a2b8'
    }
  ]

  return (
    <div className="material-management-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <Layers className="header-icon" />
            <h1>Material Management</h1>
          </div>
          <p className="header-description">
            Manage material types and materials for EPR compliance tracking
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Link key={index} to={stat.link} className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                <Icon size={24} color="white" />
              </div>
              <div className="stat-content">
                <h3>{stat.value}</h3>
                <p>{stat.title}</p>
                <div className="stat-change">
                  <TrendingUp size={14} />
                  <span>{stat.change}</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Link key={index} to={action.link} className="action-card">
                <div className="action-icon" style={{ backgroundColor: action.color }}>
                  <Icon size={24} color="white" />
                </div>
                <div className="action-content">
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </div>
                <ArrowRight size={20} className="action-arrow" />
              </Link>
            )
          })}
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="navigation-cards">
        <div className="nav-card">
          <div className="nav-card-header">
            <Package size={32} />
            <h3>Material Types</h3>
          </div>
          <p>Manage and organize material type categories for better classification</p>
          <Link to="/producer/material-types" className="nav-card-link">
            Manage Material Types
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="nav-card">
          <div className="nav-card-header">
            <Layers size={32} />
            <h3>Materials</h3>
          </div>
          <p>Add and manage individual materials used in your products</p>
          <Link to="/producer/materials" className="nav-card-link">
            Manage Materials
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default MaterialManagementDashboard
