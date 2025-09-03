import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Package, Target, BarChart3, FileText, Plus, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'

const ProducerDashboard: React.FC = () => {
  const { t } = useTranslation()

  const stats = [
    {
      title: 'Total Products',
      value: 156,
      icon: Package,
      color: '#2c5530',
      change: '+12%',
      link: '/producer/products'
    },
    {
      title: 'Compliance Rate',
      value: '94%',
      icon: Target,
      color: '#28a745',
      change: '+2%',
      link: '/producer/compliance'
    },
    {
      title: 'Active Vendors',
      value: 23,
      icon: BarChart3,
      color: '#17a2b8',
      change: '+5',
      link: '/producer/products'
    },
    {
      title: 'Pending Reports',
      value: 8,
      icon: FileText,
      color: '#ffc107',
      change: '-3',
      link: '/producer/option4'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'product',
      message: 'New product "Eco-Friendly Laptop" added',
      time: '2 hours ago',
      status: 'success'
    },
    {
      id: 2,
      type: 'compliance',
      message: 'Compliance report submitted for Q4',
      time: '4 hours ago',
      status: 'success'
    },
    {
      id: 3,
      type: 'vendor',
      message: 'Vendor "GreenTech Solutions" linked to 5 products',
      time: '1 day ago',
      status: 'info'
    },
    {
      id: 4,
      type: 'alert',
      message: 'Compliance deadline approaching for Product ID: P-001',
      time: '2 days ago',
      status: 'warning'
    }
  ]

  const quickActions = [
    {
      title: 'Add New Product',
      description: 'Register a new product for EPR compliance',
      icon: Plus,
      link: '/producer/products',
      color: '#2c5530'
    },
    {
      title: 'Manage Materials',
      description: 'Add and manage materials for your products',
      icon: Package,
      link: '/producer/material-management',
      color: '#6f42c1'
    },
    {
      title: 'Track Compliance',
      description: 'Monitor compliance status and deadlines',
      icon: Target,
      link: '/producer/compliance',
      color: '#28a745'
    },
    {
      title: 'Generate Report',
      description: 'Create compliance and performance reports',
      icon: FileText,
      link: '/producer/reports',
      color: '#17a2b8'
    }
  ]

  return (
    <div className="producer-dashboard">
      <div className="dashboard-header">
        <h1>Producer Dashboard</h1>
        <p>Manage your products and track EPR compliance</p>
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

      <div className="dashboard-content">
        {/* Quick Actions */}
        <div className="quick-actions-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Link key={index} to={action.link} className="quick-action-card">
                  <div className="action-icon" style={{ backgroundColor: action.color }}>
                    <Icon size={20} color="white" />
                  </div>
                  <div className="action-content">
                    <h4>{action.title}</h4>
                    <p>{action.description}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="recent-activities-section">
          <h2>Recent Activities</h2>
          <div className="activities-list">
            {recentActivities.map((activity) => (
              <div key={activity.id} className={`activity-item ${activity.status}`}>
                <div className="activity-icon">
                  {activity.status === 'success' && <CheckCircle size={16} />}
                  {activity.status === 'warning' && <AlertCircle size={16} />}
                  {activity.status === 'info' && <BarChart3 size={16} />}
                </div>
                <div className="activity-content">
                  <p>{activity.message}</p>
                  <small>{activity.time}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .producer-dashboard {
          padding: 0;
        }

        .dashboard-header {
          margin-bottom: 2rem;
        }

        .dashboard-header h1 {
          color: #2c5530;
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .dashboard-header p {
          color: #666;
          font-size: 1.1rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
          text-decoration: none;
          color: inherit;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-content {
          flex: 1;
        }

        .stat-content h3 {
          font-size: 2rem;
          font-weight: bold;
          margin: 0 0 0.25rem 0;
          color: #333;
        }

        .stat-content p {
          margin: 0 0 0.5rem 0;
          color: #666;
          font-size: 0.9rem;
        }

        .stat-change {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #28a745;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .dashboard-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }

        .quick-actions-section,
        .recent-activities-section {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .quick-actions-section h2,
        .recent-activities-section h2 {
          color: #333;
          margin-bottom: 1rem;
          font-size: 1.2rem;
        }

        .quick-actions-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .quick-action-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border: 1px solid #eee;
          border-radius: 6px;
          text-decoration: none;
          color: inherit;
          transition: all 0.2s ease;
        }

        .quick-action-card:hover {
          border-color: #2c5530;
          background-color: #f8f9fa;
        }

        .action-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-content h4 {
          margin: 0 0 0.25rem 0;
          color: #333;
          font-size: 0.9rem;
        }

        .action-content p {
          margin: 0;
          color: #666;
          font-size: 0.8rem;
          line-height: 1.3;
        }

        .activities-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 1rem;
          border-radius: 6px;
          border-left: 3px solid;
        }

        .activity-item.success {
          background-color: #f8f9fa;
          border-left-color: #28a745;
        }

        .activity-item.warning {
          background-color: #fff3cd;
          border-left-color: #ffc107;
        }

        .activity-item.info {
          background-color: #e3f2fd;
          border-left-color: #17a2b8;
        }

        .activity-icon {
          margin-top: 0.1rem;
        }

        .activity-item.success .activity-icon {
          color: #28a745;
        }

        .activity-item.warning .activity-icon {
          color: #ffc107;
        }

        .activity-item.info .activity-icon {
          color: #17a2b8;
        }

        .activity-content p {
          margin: 0 0 0.25rem 0;
          color: #333;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .activity-content small {
          color: #666;
          font-size: 0.8rem;
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .dashboard-content {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default ProducerDashboard
