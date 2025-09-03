import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import './MainLayout.css'

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const location = useLocation()

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  // Determine current module from path
  const getCurrentModule = () => {
    const path = location.pathname
    if (path.startsWith('/epr')) return 'epr'
    if (path.startsWith('/producer')) return 'producer'
    if (path.startsWith('/recycler')) return 'recycler'
    if (path.startsWith('/compliance')) return 'compliance'
    if (path.startsWith('/admin')) return 'admin'
    return 'dashboard'
  }

  const currentModule = getCurrentModule()

  return (
    <div className="main-layout">
      <Header onToggleSidebar={toggleSidebar} />
      <div className="layout-body">
        <Sidebar 
          collapsed={sidebarCollapsed} 
          currentModule={currentModule}
        />
        <main className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <div className="content-wrapper">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default MainLayout
