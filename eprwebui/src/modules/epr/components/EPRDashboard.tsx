import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Building2, Users, FileText, BarChart3, Plus, Eye } from 'lucide-react'
import { organizationService } from '../services/organizationService'
import { companyProfileService } from '../services/companyProfileService'
import { Organization, CompanyProfile } from '../types'

const EPRDashboard: React.FC = () => {
  const { t } = useTranslation()
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [companyProfiles, setCompanyProfiles] = useState<CompanyProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orgsData, profilesData] = await Promise.all([
          organizationService.getAll(),
          companyProfileService.getAll()
        ])
        setOrganizations(orgsData)
        setCompanyProfiles(profilesData)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const stats = [
    {
      title: 'Total Organizations',
      value: organizations.length,
      icon: Building2,
      color: '#2c5530',
      link: '/epr/organization'
    },
    {
      title: 'Active Organizations',
      value: organizations.filter(org => org.status === 'active').length,
      icon: Users,
      color: '#4a7c59',
      link: '/epr/organization'
    },
    {
      title: 'Company Profiles',
      value: companyProfiles.length,
      icon: FileText,
      color: '#6b8e6b',
      link: '/epr/company-profile'
    },
    {
      title: 'Active Profiles',
      value: companyProfiles.filter(profile => profile.isActive).length,
      icon: BarChart3,
      color: '#8ba08b',
      link: '/epr/company-profile'
    }
  ]

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>{t('common.loading')}</p>
      </div>
    )
  }

  return (
    <div className="epr-dashboard">
      <div className="dashboard-header">
        <h1>EPR Module Dashboard</h1>
        <p>Extended Producer Responsibility Management</p>
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
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/epr/organization" className="action-card">
            <Plus size={20} />
            <span>Add Organization</span>
          </Link>
          <Link to="/epr/company-profile" className="action-card">
            <Plus size={20} />
            <span>Add Company Profile</span>
          </Link>
          <Link to="/epr/onboarding" className="action-card">
            <Users size={20} />
            <span>Organization Onboarding</span>
          </Link>
        </div>
      </div>

      {/* Recent Organizations */}
      <div className="recent-section">
        <div className="section-header">
          <h2>Recent Organizations</h2>
          <Link to="/epr/organization" className="view-all-btn">
            <Eye size={16} />
            View All
          </Link>
        </div>
        <div className="recent-list">
          {organizations.slice(0, 3).map((org) => (
            <div key={org.id} className="recent-item">
              <div className="item-info">
                <h4>{org.organizationName}</h4>
                <p>{org.registrationNumber}</p>
              </div>
              <div className={`status-badge ${org.status}`}>
                {org.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .epr-dashboard {
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

        .stat-content h3 {
          font-size: 2rem;
          font-weight: bold;
          margin: 0;
          color: #333;
        }

        .stat-content p {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
        }

        .quick-actions {
          margin-bottom: 2rem;
        }

        .quick-actions h2 {
          color: #333;
          margin-bottom: 1rem;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .action-card {
          background: white;
          border: 2px dashed #ddd;
          border-radius: 8px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          color: #666;
          transition: all 0.2s ease;
        }

        .action-card:hover {
          border-color: #2c5530;
          color: #2c5530;
          background-color: #f8f9fa;
        }

        .recent-section {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .section-header h2 {
          color: #333;
          margin: 0;
        }

        .view-all-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #2c5530;
          text-decoration: none;
          font-size: 0.9rem;
        }

        .view-all-btn:hover {
          text-decoration: underline;
        }

        .recent-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .recent-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border: 1px solid #eee;
          border-radius: 6px;
        }

        .item-info h4 {
          margin: 0 0 0.25rem 0;
          color: #333;
        }

        .item-info p {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
          text-transform: capitalize;
        }

        .status-badge.active {
          background-color: #d4edda;
          color: #155724;
        }

        .status-badge.inactive {
          background-color: #f8d7da;
          color: #721c24;
        }

        .dashboard-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #2c5530;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .actions-grid {
            grid-template-columns: 1fr;
          }
          
          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  )
}

export default EPRDashboard
