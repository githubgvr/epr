import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, Save, X } from 'lucide-react'
import { accountService } from '../services/accountService'
import { Account, CreateAccountDto, UpdateAccountDto } from '../types'

const AccountComponent: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [formData, setFormData] = useState<CreateAccountDto>({
    accountName: ''
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      setLoading(true)
      const data = await accountService.getAll()
      setAccounts(data)
    } catch (error) {
      console.error('Error fetching accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchAccounts()
      return
    }

    try {
      setLoading(true)
      const results = await accountService.search(searchQuery)
      setAccounts(results)
    } catch (error) {
      console.error('Error searching accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  const openCreateModal = () => {
    setEditingAccount(null)
    setFormData({
      accountName: ''
    })
    setFormErrors({})
    setShowModal(true)
  }

  const openEditModal = (account: Account) => {
    setEditingAccount(account)
    setFormData({
      accountName: account.accountName
    })
    setFormErrors({})
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingAccount(null)
    setFormData({
      accountName: ''
    })
    setFormErrors({})
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.accountName.trim()) {
      errors.accountName = 'Account name is required'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      setSubmitting(true)
      
      if (editingAccount) {
        const updateData: UpdateAccountDto = {
          accountId: editingAccount.accountId,
          ...formData
        }
        await accountService.update(updateData)
      } else {
        await accountService.create(formData)
      }
      
      await fetchAccounts()
      closeModal()
    } catch (error) {
      console.error('Error saving account:', error)
      alert('Error saving account. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this account?')) {
      return
    }

    try {
      await accountService.delete(id)
      await fetchAccounts()
    } catch (error) {
      console.error('Error deleting account:', error)
      alert('Error deleting account. Please try again.')
    }
  }

  const handleInputChange = (field: keyof CreateAccountDto, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="account">
      <div className="page-header">
        <h1>Account Management</h1>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={16} />
          Add Account
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search accounts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="search-btn" onClick={handleSearch}>
            <Search size={16} />
          </button>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="card">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        ) : accounts.length === 0 ? (
          <div className="empty-state">
            <p>No accounts found</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Account ID</th>
                <th>Account Name</th>
                <th>Status</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.accountId}>
                  <td>{account.accountId}</td>
                  <td>
                    <div className="account-info">
                      <strong>{account.accountName}</strong>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${account.isActive ? 'active' : 'inactive'}`}>
                      {account.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{new Date(account.createdDate).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-secondary"
                        onClick={() => openEditModal(account)}
                        style={{ marginRight: '0.5rem' }}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleDelete(account.accountId)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingAccount ? 'Edit Account' : 'Add Account'}</h2>
              <button className="btn-icon" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">Account Name *</label>
                  <input
                    type="text"
                    className={`form-input ${formErrors.accountName ? 'error' : ''}`}
                    value={formData.accountName}
                    onChange={(e) => handleInputChange('accountName', e.target.value)}
                    placeholder="Enter account name"
                  />
                  {formErrors.accountName && (
                    <span className="error-text">{formErrors.accountName}</span>
                  )}
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  <Save size={16} />
                  {submitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AccountComponent
