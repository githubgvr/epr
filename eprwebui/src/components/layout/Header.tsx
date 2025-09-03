import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, LogOut, User } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import LanguageSelector from '../common/LanguageSelector'
import './Header.css'

interface HeaderProps {
  onToggleSidebar: () => void
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="header">
      <div className="header-left">
        <button 
          className="sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <h1 className="header-title">{t('app_title')}</h1>
      </div>
      
      <div className="header-right">
        <LanguageSelector />
        
        <div className="user-menu">
          <div className="user-info">
            <User size={16} />
            <span className="username">{user?.username}</span>
          </div>
          
          <button 
            className="logout-btn"
            onClick={handleLogout}
            title={t('logout')}
          >
            <LogOut size={16} />
            <span>{t('logout')}</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
