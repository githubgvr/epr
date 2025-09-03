import React, { useState } from 'react'
import { FileText, Download, Upload, Calendar, Filter, Search } from 'lucide-react'

interface Report {
  id: string
  name: string
  type: string
  status: 'generated' | 'pending' | 'draft'
  createdDate: string
  size: string
  description: string
}

const Option4Page: React.FC = () => {
  const [reports] = useState<Report[]>([
    {
      id: '1',
      name: 'Q4 2024 Compliance Report',
      type: 'Compliance',
      status: 'generated',
      createdDate: '2024-01-15',
      size: '2.4 MB',
      description: 'Quarterly compliance report including all product categories'
    },
    {
      id: '2',
      name: 'Annual Environmental Impact',
      type: 'Environmental',
      status: 'generated',
      createdDate: '2024-01-10',
      size: '5.1 MB',
      description: 'Annual report on environmental impact and sustainability metrics'
    },
    {
      id: '3',
      name: 'Product Lifecycle Analysis',
      type: 'Analysis',
      status: 'pending',
      createdDate: '2024-01-08',
      size: '1.8 MB',
      description: 'Detailed analysis of product lifecycle and recycling potential'
    },
    {
      id: '4',
      name: 'Vendor Performance Review',
      type: 'Performance',
      status: 'draft',
      createdDate: '2024-01-05',
      size: '0.9 MB',
      description: 'Performance review of all linked vendors and recycling partners'
    }
  ])

  const [selectedType, setSelectedType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const reportTypes = ['all', 'compliance', 'environmental', 'analysis', 'performance']

  const filteredReports = reports.filter(report => {
    const matchesType = selectedType === 'all' || report.type.toLowerCase() === selectedType
    const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generated':
        return '#28a745'
      case 'pending':
        return '#ffc107'
      case 'draft':
        return '#6c757d'
      default:
        return '#6c757d'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="option4-page">
      <div className="page-header">
        <h1>Reports & Documentation</h1>
        <p>Generate, manage, and download compliance reports and documentation</p>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button className="action-btn primary">
          <FileText size={16} />
          Generate New Report
        </button>
        <button className="action-btn secondary">
          <Upload size={16} />
          Upload Document
        </button>
        <button className="action-btn secondary">
          <Calendar size={16} />
          Schedule Report
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-bar">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="type-filters">
          <Filter size={16} />
          <span>Filter by type:</span>
          {reportTypes.map(type => (
            <button
              key={type}
              className={`filter-btn ${selectedType === type ? 'active' : ''}`}
              onClick={() => setSelectedType(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="reports-section">
        <h2>Available Reports</h2>
        <div className="reports-grid">
          {filteredReports.map(report => (
            <div key={report.id} className="report-card">
              <div className="report-header">
                <div className="report-icon">
                  <FileText size={24} />
                </div>
                <div className="report-info">
                  <h3>{report.name}</h3>
                  <p className="report-type">{report.type}</p>
                </div>
                <div className={`status-badge ${report.status}`}>
                  {report.status}
                </div>
              </div>
              
              <div className="report-details">
                <p className="description">{report.description}</p>
                
                <div className="report-meta">
                  <div className="meta-item">
                    <span className="label">Created:</span>
                    <span>{formatDate(report.createdDate)}</span>
                  </div>
                  <div className="meta-item">
                    <span className="label">Size:</span>
                    <span>{report.size}</span>
                  </div>
                </div>
              </div>

              <div className="report-actions">
                {report.status === 'generated' && (
                  <button className="action-btn download">
                    <Download size={14} />
                    Download
                  </button>
                )}
                {report.status === 'draft' && (
                  <button className="action-btn edit">
                    <FileText size={14} />
                    Edit
                  </button>
                )}
                {report.status === 'pending' && (
                  <button className="action-btn view">
                    <FileText size={14} />
                    View Status
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="empty-state">
            <FileText size={48} />
            <h3>No reports found</h3>
            <p>No reports match your current filter criteria.</p>
          </div>
        )}
      </div>

      {/* Report Templates */}
      <div className="templates-section">
        <h2>Report Templates</h2>
        <div className="templates-grid">
          <div className="template-card">
            <h4>Compliance Report Template</h4>
            <p>Standard template for quarterly compliance reporting</p>
            <button className="template-btn">Use Template</button>
          </div>
          <div className="template-card">
            <h4>Environmental Impact Template</h4>
            <p>Template for environmental impact assessment reports</p>
            <button className="template-btn">Use Template</button>
          </div>
          <div className="template-card">
            <h4>Custom Report Builder</h4>
            <p>Create custom reports with your specific requirements</p>
            <button className="template-btn">Build Custom</button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .option4-page {
          padding: 0;
        }

        .page-header {
          margin-bottom: 2rem;
        }

        .page-header h1 {
          color: #2c5530;
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .page-header p {
          color: #666;
          font-size: 1.1rem;
        }

        .quick-actions {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .action-btn.primary {
          background: #2c5530;
          color: white;
        }

        .action-btn.primary:hover {
          background: #1e3a21;
        }

        .action-btn.secondary {
          background: white;
          color: #2c5530;
          border: 1px solid #2c5530;
        }

        .action-btn.secondary:hover {
          background: #f8f9fa;
        }

        .filters-section {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .search-bar {
          position: relative;
          margin-bottom: 1rem;
          max-width: 400px;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 2.5rem 0.75rem 1rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
        }

        .search-icon {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #666;
        }

        .type-filters {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .type-filters span {
          color: #666;
          font-size: 0.9rem;
        }

        .filter-btn {
          padding: 0.5rem 1rem;
          border: 1px solid #ddd;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .filter-btn:hover {
          border-color: #2c5530;
        }

        .filter-btn.active {
          background: #2c5530;
          color: white;
          border-color: #2c5530;
        }

        .reports-section {
          margin-bottom: 3rem;
        }

        .reports-section h2 {
          color: #333;
          margin-bottom: 1.5rem;
        }

        .reports-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .report-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .report-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .report-header {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .report-icon {
          width: 48px;
          height: 48px;
          background: #f0f8f0;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2c5530;
        }

        .report-info {
          flex: 1;
        }

        .report-info h3 {
          margin: 0 0 0.25rem 0;
          color: #333;
          font-size: 1.1rem;
        }

        .report-type {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
          text-transform: capitalize;
        }

        .status-badge.generated {
          background-color: #d4edda;
          color: #155724;
        }

        .status-badge.pending {
          background-color: #fff3cd;
          color: #856404;
        }

        .status-badge.draft {
          background-color: #e2e3e5;
          color: #383d41;
        }

        .description {
          color: #666;
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .report-meta {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .meta-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .meta-item .label {
          font-size: 0.8rem;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .report-actions {
          display: flex;
          gap: 0.5rem;
          justify-content: flex-end;
          padding-top: 1rem;
          border-top: 1px solid #f0f0f0;
        }

        .action-btn.download {
          background: #e8f5e8;
          color: #2c5530;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.8rem;
        }

        .action-btn.edit {
          background: #e3f2fd;
          color: #1976d2;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.8rem;
        }

        .action-btn.view {
          background: #fff3cd;
          color: #856404;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.8rem;
        }

        .empty-state {
          text-align: center;
          padding: 3rem;
          color: #666;
        }

        .empty-state h3 {
          margin: 1rem 0 0.5rem 0;
          color: #333;
        }

        .templates-section h2 {
          color: #333;
          margin-bottom: 1.5rem;
        }

        .templates-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .template-card {
          background: white;
          border: 2px dashed #ddd;
          border-radius: 8px;
          padding: 1.5rem;
          text-align: center;
          transition: border-color 0.2s ease;
        }

        .template-card:hover {
          border-color: #2c5530;
        }

        .template-card h4 {
          margin: 0 0 0.5rem 0;
          color: #333;
        }

        .template-card p {
          margin: 0 0 1rem 0;
          color: #666;
          font-size: 0.9rem;
        }

        .template-btn {
          background: #2c5530;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background-color 0.2s ease;
        }

        .template-btn:hover {
          background: #1e3a21;
        }

        @media (max-width: 768px) {
          .quick-actions {
            flex-direction: column;
          }

          .type-filters {
            flex-direction: column;
            align-items: flex-start;
          }

          .reports-grid {
            grid-template-columns: 1fr;
          }

          .report-meta {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  )
}

export default Option4Page
