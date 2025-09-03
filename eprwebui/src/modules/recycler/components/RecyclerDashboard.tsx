import React from 'react'
import { Link } from 'react-router-dom'
import { Recycle, Award, Target, BarChart3, Package, TrendingUp } from 'lucide-react'

const RecyclerDashboard: React.FC = () => {
  const stats = [
    {
      title: 'Products Processed',
      value: 1247,
      icon: Package,
      color: '#2c5530',
      change: '+18%'
    },
    {
      title: 'Recycling Rate',
      value: '92%',
      icon: Recycle,
      color: '#28a745',
      change: '+5%'
    },
    {
      title: 'Certifications',
      value: 15,
      icon: Award,
      color: '#17a2b8',
      change: '+3'
    },
    {
      title: 'Target Achievement',
      value: '87%',
      icon: Target,
      color: '#ffc107',
      change: '+12%'
    }
  ]

  const quickActions = [
    {
      title: 'Log Recycling Details',
      description: 'Record recycling activities for linked products',
      icon: Recycle,
      link: '/recycler/option1',
      color: '#2c5530'
    },
    {
      title: 'Manage Certifications',
      description: 'View and update recycling certifications',
      icon: Award,
      link: '/recycler/option2',
      color: '#28a745'
    },
    {
      title: 'Track Targets',
      description: 'Monitor recycling targets and achievements',
      icon: Target,
      link: '/recycler/option3',
      color: '#17a2b8'
    }
  ]

  return (
    <div className="recycler-dashboard">
      <div className="dashboard-header">
        <h1>Recycler Dashboard</h1>
        <p>Manage recycling operations and track environmental impact</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="stat-card">
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
            </div>
          )
        })}
      </div>

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
      <div className="recent-activities">
        <h2>Recent Activities</h2>
        <div className="activities-list">
          <div className="activity-item">
            <div className="activity-icon success">
              <Recycle size={16} />
            </div>
            <div className="activity-content">
              <p>Processed 50 units of Eco-Friendly Laptops</p>
              <small>2 hours ago</small>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon info">
              <Award size={16} />
            </div>
            <div className="activity-content">
              <p>ISO 14001 certification renewed</p>
              <small>1 day ago</small>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon success">
              <Target size={16} />
            </div>
            <div className="activity-content">
              <p>Monthly recycling target achieved</p>
              <small>3 days ago</small>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .recycler-dashboard {
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
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
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

        .quick-actions-section {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }

        .quick-actions-section h2 {
          color: #333;
          margin-bottom: 1rem;
        }

        .quick-actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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

        .recent-activities {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .recent-activities h2 {
          color: #333;
          margin-bottom: 1rem;
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

        .activity-item:nth-child(1) {
          background-color: #f8f9fa;
          border-left-color: #28a745;
        }

        .activity-item:nth-child(2) {
          background-color: #e3f2fd;
          border-left-color: #17a2b8;
        }

        .activity-item:nth-child(3) {
          background-color: #f8f9fa;
          border-left-color: #28a745;
        }

        .activity-icon {
          margin-top: 0.1rem;
        }

        .activity-icon.success {
          color: #28a745;
        }

        .activity-icon.info {
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
          
          .quick-actions-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default RecyclerDashboard
