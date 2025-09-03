import React from 'react'
import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react'

const Option3Page: React.FC = () => {
  return (
    <div className="option3-page">
      <div className="page-header">
        <h1>Producer Analytics</h1>
        <p>View detailed analytics and performance metrics</p>
      </div>

      <div className="content-grid">
        <div className="feature-card">
          <div className="feature-icon">
            <BarChart3 size={32} />
          </div>
          <h3>Performance Metrics</h3>
          <p>Track key performance indicators and compliance metrics across all products.</p>
          <div className="feature-stats">
            <div className="stat">
              <span className="stat-value">94%</span>
              <span className="stat-label">Compliance Rate</span>
            </div>
            <div className="stat">
              <span className="stat-value">156</span>
              <span className="stat-label">Products Tracked</span>
            </div>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <TrendingUp size={32} />
          </div>
          <h3>Trend Analysis</h3>
          <p>Analyze trends in compliance, recycling rates, and environmental impact over time.</p>
          <div className="feature-stats">
            <div className="stat">
              <span className="stat-value">+12%</span>
              <span className="stat-label">Monthly Growth</span>
            </div>
            <div className="stat">
              <span className="stat-value">87%</span>
              <span className="stat-label">Recycling Rate</span>
            </div>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <PieChart size={32} />
          </div>
          <h3>Category Breakdown</h3>
          <p>View distribution of products across different categories and their compliance status.</p>
          <div className="feature-stats">
            <div className="stat">
              <span className="stat-value">5</span>
              <span className="stat-label">Categories</span>
            </div>
            <div className="stat">
              <span className="stat-value">23</span>
              <span className="stat-label">Vendors</span>
            </div>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <Activity size={32} />
          </div>
          <h3>Real-time Monitoring</h3>
          <p>Monitor compliance status and deadlines in real-time with automated alerts.</p>
          <div className="feature-stats">
            <div className="stat">
              <span className="stat-value">3</span>
              <span className="stat-label">Active Alerts</span>
            </div>
            <div className="stat">
              <span className="stat-value">99.2%</span>
              <span className="stat-label">Uptime</span>
            </div>
          </div>
        </div>
      </div>

      <div className="coming-soon">
        <h2>Coming Soon</h2>
        <p>Advanced analytics features are currently under development. Stay tuned for comprehensive reporting and data visualization tools.</p>
      </div>

      
    </div>
  )
}

export default Option3Page
