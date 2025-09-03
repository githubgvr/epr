import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckCircle, Circle, ArrowRight, ArrowLeft, Save } from 'lucide-react'

interface OnboardingStep {
  id: number
  title: string
  description: string
  completed: boolean
}

const OrganizationOnboarding: React.FC = () => {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    organizationName: '',
    registrationNumber: '',
    establishedDate: '',
    
    // Step 2: Contact Information
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    
    // Step 3: Business Details
    industryType: '',
    businessType: '',
    employeeCount: '',
    annualRevenue: '',
    
    // Step 4: Compliance Information
    eprLicense: '',
    environmentalCertifications: '',
    complianceOfficer: '',
    
    // Step 5: Documentation
    registrationDocument: null as File | null,
    complianceDocument: null as File | null,
    businessLicense: null as File | null
  })

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: 'Basic Information',
      description: 'Organization details and registration',
      completed: currentStep > 1
    },
    {
      id: 2,
      title: 'Contact Information',
      description: 'Address and location details',
      completed: currentStep > 2
    },
    {
      id: 3,
      title: 'Business Details',
      description: 'Industry and business information',
      completed: currentStep > 3
    },
    {
      id: 4,
      title: 'Compliance Information',
      description: 'EPR and environmental compliance',
      completed: currentStep > 4
    },
    {
      id: 5,
      title: 'Documentation',
      description: 'Upload required documents',
      completed: currentStep > 5
    }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    // Handle final submission
    console.log('Onboarding completed:', formData)
    alert('Organization onboarding completed successfully!')
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h3>Basic Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Organization Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.organizationName}
                  onChange={(e) => handleInputChange('organizationName', e.target.value)}
                  placeholder="Enter organization name"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Registration Number *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.registrationNumber}
                  onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                  placeholder="Enter registration number"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Established Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.establishedDate}
                  onChange={(e) => handleInputChange('establishedDate', e.target.value)}
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="step-content">
            <h3>Contact Information</h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Address *</label>
                <textarea
                  className="form-input"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter complete address"
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label className="form-label">City *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Enter city"
                />
              </div>
              <div className="form-group">
                <label className="form-label">State *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="Enter state"
                />
              </div>
              <div className="form-group">
                <label className="form-label">ZIP Code</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  placeholder="Enter ZIP code"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Country *</label>
                <select
                  className="form-input"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                >
                  <option value="">Select Country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="IN">India</option>
                  <option value="UK">United Kingdom</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                </select>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="step-content">
            <h3>Business Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Industry Type *</label>
                <select
                  className="form-input"
                  value={formData.industryType}
                  onChange={(e) => handleInputChange('industryType', e.target.value)}
                >
                  <option value="">Select Industry</option>
                  <option value="Technology">Technology</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Retail">Retail</option>
                  <option value="Energy">Energy</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Business Type *</label>
                <select
                  className="form-input"
                  value={formData.businessType}
                  onChange={(e) => handleInputChange('businessType', e.target.value)}
                >
                  <option value="">Select Type</option>
                  <option value="Corporation">Corporation</option>
                  <option value="LLC">LLC</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Sole Proprietorship">Sole Proprietorship</option>
                  <option value="Non-Profit">Non-Profit</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Employee Count</label>
                <select
                  className="form-input"
                  value={formData.employeeCount}
                  onChange={(e) => handleInputChange('employeeCount', e.target.value)}
                >
                  <option value="">Select Range</option>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="201-500">201-500</option>
                  <option value="501-1000">501-1000</option>
                  <option value="1000+">1000+</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Annual Revenue</label>
                <select
                  className="form-input"
                  value={formData.annualRevenue}
                  onChange={(e) => handleInputChange('annualRevenue', e.target.value)}
                >
                  <option value="">Select Range</option>
                  <option value="<1M">Less than $1M</option>
                  <option value="1M-10M">$1M - $10M</option>
                  <option value="10M-50M">$10M - $50M</option>
                  <option value="50M-100M">$50M - $100M</option>
                  <option value="100M+">$100M+</option>
                </select>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="step-content">
            <h3>Compliance Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">EPR License Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.eprLicense}
                  onChange={(e) => handleInputChange('eprLicense', e.target.value)}
                  placeholder="Enter EPR license number"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Environmental Certifications</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.environmentalCertifications}
                  onChange={(e) => handleInputChange('environmentalCertifications', e.target.value)}
                  placeholder="e.g., ISO 14001, LEED"
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Compliance Officer</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.complianceOfficer}
                  onChange={(e) => handleInputChange('complianceOfficer', e.target.value)}
                  placeholder="Name of compliance officer"
                />
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="step-content">
            <h3>Documentation</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Registration Document</label>
                <input
                  type="file"
                  className="form-input"
                  onChange={(e) => handleFileChange('registrationDocument', e.target.files?.[0] || null)}
                  accept=".pdf,.doc,.docx"
                />
                <small className="form-help">Upload registration certificate (PDF, DOC, DOCX)</small>
              </div>
              <div className="form-group">
                <label className="form-label">Business License</label>
                <input
                  type="file"
                  className="form-input"
                  onChange={(e) => handleFileChange('businessLicense', e.target.files?.[0] || null)}
                  accept=".pdf,.doc,.docx"
                />
                <small className="form-help">Upload business license (PDF, DOC, DOCX)</small>
              </div>
              <div className="form-group">
                <label className="form-label">Compliance Document</label>
                <input
                  type="file"
                  className="form-input"
                  onChange={(e) => handleFileChange('complianceDocument', e.target.files?.[0] || null)}
                  accept=".pdf,.doc,.docx"
                />
                <small className="form-help">Upload compliance certificate (PDF, DOC, DOCX)</small>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="organization-onboarding">
      <div className="onboarding-header">
        <h1>Organization Onboarding</h1>
        <p>Complete the following steps to register your organization</p>
      </div>

      {/* Progress Steps */}
      <div className="progress-steps">
        {steps.map((step, index) => (
          <div key={step.id} className={`step ${currentStep === step.id ? 'active' : ''} ${step.completed ? 'completed' : ''}`}>
            <div className="step-indicator">
              {step.completed ? (
                <CheckCircle size={24} className="step-icon completed" />
              ) : (
                <Circle size={24} className={`step-icon ${currentStep === step.id ? 'active' : ''}`} />
              )}
              <span className="step-number">{step.id}</span>
            </div>
            <div className="step-content">
              <h4>{step.title}</h4>
              <p>{step.description}</p>
            </div>
            {index < steps.length - 1 && <div className="step-connector"></div>}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="form-container">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="navigation-buttons">
        <button
          className="btn btn-secondary"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ArrowLeft size={16} />
          Previous
        </button>

        <div className="step-indicator-text">
          Step {currentStep} of {steps.length}
        </div>

        {currentStep < steps.length ? (
          <button className="btn btn-primary" onClick={nextStep}>
            Next
            <ArrowRight size={16} />
          </button>
        ) : (
          <button className="btn btn-primary" onClick={handleSubmit}>
            <Save size={16} />
            Complete Onboarding
          </button>
        )}
      </div>

      <style jsx>{`
        .organization-onboarding {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0;
        }

        .onboarding-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .onboarding-header h1 {
          color: #2c5530;
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }

        .onboarding-header p {
          color: #666;
          font-size: 1.1rem;
        }

        .progress-steps {
          display: flex;
          justify-content: space-between;
          margin-bottom: 3rem;
          position: relative;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          position: relative;
        }

        .step-indicator {
          position: relative;
          margin-bottom: 1rem;
        }

        .step-icon {
          color: #ddd;
        }

        .step-icon.active {
          color: #2c5530;
        }

        .step-icon.completed {
          color: #28a745;
        }

        .step-number {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 0.8rem;
          font-weight: bold;
          color: white;
        }

        .step.active .step-number {
          color: white;
        }

        .step.completed .step-number {
          display: none;
        }

        .step-content {
          text-align: center;
          max-width: 150px;
        }

        .step-content h4 {
          margin: 0 0 0.25rem 0;
          font-size: 0.9rem;
          color: #333;
        }

        .step-content p {
          margin: 0;
          font-size: 0.8rem;
          color: #666;
          line-height: 1.3;
        }

        .step.active .step-content h4 {
          color: #2c5530;
          font-weight: 600;
        }

        .step-connector {
          position: absolute;
          top: 12px;
          left: 50%;
          width: 100%;
          height: 2px;
          background: #ddd;
          z-index: -1;
        }

        .step.completed .step-connector {
          background: #28a745;
        }

        .form-container {
          background: white;
          border-radius: 8px;
          padding: 2rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }

        .step-content h3 {
          color: #2c5530;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-help {
          display: block;
          color: #666;
          font-size: 0.8rem;
          margin-top: 0.25rem;
        }

        .navigation-buttons {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
        }

        .step-indicator-text {
          color: #666;
          font-size: 0.9rem;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .progress-steps {
            flex-direction: column;
            gap: 1rem;
          }

          .step {
            flex-direction: row;
            text-align: left;
          }

          .step-indicator {
            margin-right: 1rem;
            margin-bottom: 0;
          }

          .step-content {
            max-width: none;
            text-align: left;
          }

          .step-connector {
            display: none;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .navigation-buttons {
            flex-direction: column;
            gap: 1rem;
          }

          .step-indicator-text {
            order: -1;
          }
        }
      `}</style>
    </div>
  )
}

export default OrganizationOnboarding
