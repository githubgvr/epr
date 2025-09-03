import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Target, AlertCircle, CheckCircle, Clock, Calendar, FileText, Download } from 'lucide-react'

interface ComplianceItem {
  id: string
  productName: string
  productSku: string
  requirement: string
  status: 'compliant' | 'pending' | 'overdue' | 'upcoming'
  dueDate: string
  completedDate?: string
  progress: number
  description: string
  documents: string[]
}

const TrackingCompliance: React.FC = () => {
  const { t } = useTranslation()
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [complianceItems] = useState<ComplianceItem[]>([
    {
      id: '1',
      productName: 'Eco-Friendly Laptop',
      productSku: 'EFL-001',
      requirement: 'EPR Registration',
      status: 'compliant',
      dueDate: '2024-03-15',
      completedDate: '2024-02-28',
      progress: 100,
      description: 'Complete EPR registration with environmental authorities',
      documents: ['epr_certificate.pdf', 'registration_form.pdf']
    },
    {
      id: '2',
      productName: 'Sustainable Smartphone',
      productSku: 'SSP-002',
      requirement: 'Recycling Plan Submission',
      status: 'pending',
      dueDate: '2024-04-01',
      progress: 75,
      description: 'Submit detailed recycling plan for end-of-life management',
      documents: ['draft_plan.pdf']
    },
    {
      id: '3',
      productName: 'Green Monitor',
      productSku: 'GM-003',
      requirement: 'Material Declaration',
      status: 'overdue',
      dueDate: '2024-02-15',
      progress: 30,
      description: 'Declare all materials used in product manufacturing',
      documents: []
    },
    {
      id: '4',
      productName: 'Eco Keyboard',
      productSku: 'EK-004',
      requirement: 'Compliance Audit',
      status: 'upcoming',
      dueDate: '2024-05-30',
      progress: 0,
      description: 'Annual compliance audit by certified third party',
      documents: []
    }
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle size={20} className="status-icon compliant" />
      case 'pending':
        return <Clock size={20} className="status-icon pending" />
      case 'overdue':
        return <AlertCircle size={20} className="status-icon overdue" />
      case 'upcoming':
        return <Calendar size={20} className="status-icon upcoming" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return '#28a745'
      case 'pending':
        return '#ffc107'
      case 'overdue':
        return '#dc3545'
      case 'upcoming':
        return '#17a2b8'
      default:
        return '#6c757d'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const filteredItems = selectedStatus === 'all' 
    ? complianceItems 
    : complianceItems.filter(item => item.status === selectedStatus)

  const statusCounts = {
    all: complianceItems.length,
    compliant: complianceItems.filter(item => item.status === 'compliant').length,
    pending: complianceItems.filter(item => item.status === 'pending').length,
    overdue: complianceItems.filter(item => item.status === 'overdue').length,
    upcoming: complianceItems.filter(item => item.status === 'upcoming').length
  }

  return (
    <div className="tracking-compliance">
      <div className="page-header">
        <h1>Tracking Compliance</h1>
        <p>Monitor compliance status and deadlines for all products</p>
      </div>

      {/* Status Summary */}
      <div className="status-summary">
        <div className="summary-cards">
          <div className="summary-card compliant">
            <div className="card-icon">
              <CheckCircle size={24} />
            </div>
            <div className="card-content">
              <h3>{statusCounts.compliant}</h3>
              <p>Compliant</p>
            </div>
          </div>
          <div className="summary-card pending">
            <div className="card-icon">
              <Clock size={24} />
            </div>
            <div className="card-content">
              <h3>{statusCounts.pending}</h3>
              <p>Pending</p>
            </div>
          </div>
          <div className="summary-card overdue">
            <div className="card-icon">
              <AlertCircle size={24} />
            </div>
            <div className="card-content">
              <h3>{statusCounts.overdue}</h3>
              <p>Overdue</p>
            </div>
          </div>
          <div className="summary-card upcoming">
            <div className="card-icon">
              <Calendar size={24} />
            </div>
            <div className="card-content">
              <h3>{statusCounts.upcoming}</h3>
              <p>Upcoming</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            className={`filter-tab ${selectedStatus === status ? 'active' : ''}`}
            onClick={() => setSelectedStatus(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
          </button>
        ))}
      </div>

      {/* Compliance Items */}
      <div className="compliance-list">
        {filteredItems.map((item) => (
          <div key={item.id} className={`compliance-item ${item.status}`}>
            <div className="item-header">
              <div className="item-info">
                {getStatusIcon(item.status)}
                <div className="product-info">
                  <h3>{item.productName}</h3>
                  <p className="product-sku">{item.productSku}</p>
                </div>
              </div>
              <div className="requirement-info">
                <h4>{item.requirement}</h4>
                <p className="due-date">
                  Due: {formatDate(item.dueDate)}
                  {item.status !== 'compliant' && (
                    <span className="days-remaining">
                      ({getDaysUntilDue(item.dueDate)} days)
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="item-content">
              <p className="description">{item.description}</p>
              
              <div className="progress-section">
                <div className="progress-header">
                  <span>Progress</span>
                  <span>{item.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${item.progress}%`,
                      backgroundColor: getStatusColor(item.status)
                    }}
                  ></div>
                </div>
              </div>

              {item.documents.length > 0 && (
                <div className="documents-section">
                  <h5>Documents:</h5>
                  <div className="documents-list">
                    {item.documents.map((doc, index) => (
                      <div key={index} className="document-item">
                        <FileText size={16} />
                        <span>{doc}</span>
                        <button className="download-btn" title="Download">
                          <Download size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {item.completedDate && (
                <div className="completion-info">
                  <CheckCircle size={16} />
                  <span>Completed on {formatDate(item.completedDate)}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="empty-state">
          <Target size={48} />
          <h3>No compliance items found</h3>
          <p>No items match the selected filter criteria.</p>
        </div>
      )}

      <style jsx>{`
        .tracking-compliance {
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

        .status-summary {
          margin-bottom: 2rem;
        }

        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .summary-card {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
          border-left: 4px solid;
        }

        .summary-card.compliant {
          border-left-color: #28a745;
        }

        .summary-card.pending {
          border-left-color: #ffc107;
        }

        .summary-card.overdue {
          border-left-color: #dc3545;
        }

        .summary-card.upcoming {
          border-left-color: #17a2b8;
        }

        .card-icon {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .summary-card.compliant .card-icon {
          background: #28a745;
        }

        .summary-card.pending .card-icon {
          background: #ffc107;
        }

        .summary-card.overdue .card-icon {
          background: #dc3545;
        }

        .summary-card.upcoming .card-icon {
          background: #17a2b8;
        }

        .card-content h3 {
          margin: 0 0 0.25rem 0;
          font-size: 2rem;
          font-weight: bold;
          color: #333;
        }

        .card-content p {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
        }

        .filter-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          border-bottom: 1px solid #eee;
        }

        .filter-tab {
          padding: 0.75rem 1rem;
          border: none;
          background: none;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          color: #666;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .filter-tab:hover {
          color: #2c5530;
        }

        .filter-tab.active {
          color: #2c5530;
          border-bottom-color: #2c5530;
          font-weight: 500;
        }

        .compliance-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .compliance-item {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          border-left: 4px solid;
        }

        .compliance-item.compliant {
          border-left-color: #28a745;
        }

        .compliance-item.pending {
          border-left-color: #ffc107;
        }

        .compliance-item.overdue {
          border-left-color: #dc3545;
        }

        .compliance-item.upcoming {
          border-left-color: #17a2b8;
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .item-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .status-icon.compliant {
          color: #28a745;
        }

        .status-icon.pending {
          color: #ffc107;
        }

        .status-icon.overdue {
          color: #dc3545;
        }

        .status-icon.upcoming {
          color: #17a2b8;
        }

        .product-info h3 {
          margin: 0 0 0.25rem 0;
          color: #333;
          font-size: 1.1rem;
        }

        .product-sku {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
          font-family: monospace;
        }

        .requirement-info {
          text-align: right;
        }

        .requirement-info h4 {
          margin: 0 0 0.25rem 0;
          color: #333;
          font-size: 1rem;
        }

        .due-date {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
        }

        .days-remaining {
          color: #dc3545;
          font-weight: 500;
        }

        .item-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .description {
          margin: 0;
          color: #666;
          line-height: 1.5;
        }

        .progress-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9rem;
          color: #666;
        }

        .progress-bar {
          height: 8px;
          background: #e9ecef;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .documents-section h5 {
          margin: 0 0 0.5rem 0;
          color: #333;
          font-size: 0.9rem;
        }

        .documents-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .document-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          background: #f8f9fa;
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .download-btn {
          margin-left: auto;
          background: none;
          border: none;
          cursor: pointer;
          color: #2c5530;
          padding: 0.25rem;
          border-radius: 4px;
          transition: background-color 0.2s ease;
        }

        .download-btn:hover {
          background: #e8f5e8;
        }

        .completion-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #28a745;
          font-size: 0.9rem;
          font-weight: 500;
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

        @media (max-width: 768px) {
          .summary-cards {
            grid-template-columns: 1fr 1fr;
          }

          .filter-tabs {
            flex-wrap: wrap;
          }

          .item-header {
            flex-direction: column;
            gap: 1rem;
          }

          .requirement-info {
            text-align: left;
          }
        }
      `}</style>
    </div>
  )
}

export default TrackingCompliance
