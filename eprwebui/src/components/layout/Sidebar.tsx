import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Home,
  Building2,
  Factory,
  Recycle,
  Shield,
  Settings,
  ChevronRight,
  ChevronDown,
  Users,
  FileText,
  Package,
  Target,
  Award,
  BarChart3,
  Layers,
  Truck,
  Tag,
  Plus
} from 'lucide-react'
import './Sidebar.css'

interface MenuItem {
  name: string
  path: string
  icon: any
  subItems?: MenuItem[]
}

interface SidebarProps {
  collapsed: boolean
  currentModule: string
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, currentModule }) => {
  const location = useLocation()
  const { t } = useTranslation()
  const [expandedItems, setExpandedItems] = useState<string[]>(['Material Management'])

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    )
  }

  const modules = [
    {
      id: 'dashboard',
      name: t('dashboard'),
      path: '/dashboard',
      icon: Home
    },
    {
      id: 'epr',
      name: t('modules.epr'),
      path: '/epr',
      icon: Building2
    },
    {
      id: 'producer',
      name: t('modules.producer'),
      path: '/producer',
      icon: Factory
    },
    {
      id: 'recycler',
      name: t('modules.recycler'),
      path: '/recycler',
      icon: Recycle
    },
    {
      id: 'vendor',
      name: 'Vendor',
      path: '/vendor',
      icon: Truck
    },
    {
      id: 'compliance',
      name: t('modules.compliance'),
      path: '/compliance',
      icon: Shield
    },
    {
      id: 'admin',
      name: t('modules.admin'),
      path: '/admin',
      icon: Settings
    }
  ]

  const getModuleMenuItems = (moduleId: string): MenuItem[] => {
    switch (moduleId) {
      case 'epr':
        return [
          { name: 'Dashboard', path: '/epr/dashboard', icon: Home },
          { name: 'Organization', path: '/epr/organization', icon: Building2 },
          { name: 'Organization Onboarding', path: '/epr/onboarding', icon: Users },
          { name: 'Company Profile', path: '/epr/company-profile', icon: FileText },
          { name: 'Account', path: '/epr/account', icon: Users }
        ]
      case 'producer':
        return [
          { name: 'Dashboard', path: '/producer/dashboard', icon: Home },
          {
            name: 'Product Management',
            path: '/producer/product-management',
            icon: Package,
            subItems: [
              { name: 'Product Groups', path: '/producer/product-groups', icon: Tag },
              { name: 'Product Categories', path: '/producer/product-categories', icon: Tag },
              { name: 'Product Types', path: '/producer/product-types', icon: Tag },
              { name: 'Products', path: '/producer/products', icon: Package }
            ]
          },
          {
            name: 'Material Management',
            path: '/producer/material-management',
            icon: Layers,
            subItems: [
              { name: 'Materials', path: '/producer/materials', icon: Layers },
              { name: 'Components', path: '/producer/components', icon: Layers }
            ]
          },
          { name: 'Tracking Compliance', path: '/producer/compliance', icon: Target },
          { name: 'Reports', path: '/producer/reports', icon: BarChart3 }
        ]
      case 'recycler':
        return [
          { name: 'Dashboard', path: '/recycler/dashboard', icon: Home },
          { name: 'Log Recycle Details', path: '/recycler/recycle-logs', icon: FileText },
          { name: 'Upload Recycling Certifications', path: '/recycler/certifications', icon: Award },
          { name: 'Tracing Targets', path: '/recycler/tracing-targets', icon: Target }
        ]
      case 'vendor':
        return [
          { name: 'Dashboard', path: '/vendor/dashboard', icon: Home },
          {
            name: 'Vendor Management',
            path: '/vendor/vendor-management',
            icon: Truck,
            subItems: [
              { name: 'All Vendors', path: '/vendor/management', icon: Users },
              { name: 'Create Vendor', path: '/vendor/create', icon: Plus },
              { name: 'Vendor Performance', path: '/vendor/performance', icon: BarChart3 }
            ]
          }
        ]
      case 'compliance':
        return [
          { name: 'Dashboard', path: '/compliance/dashboard', icon: Home },
          { name: 'Option 1', path: '/compliance/option1', icon: Shield },
          { name: 'Option 2', path: '/compliance/option2', icon: FileText },
          { name: 'Option 3', path: '/compliance/option3', icon: BarChart3 }
        ]
      case 'admin':
        return [
          { name: 'Dashboard', path: '/admin/dashboard', icon: Home },
          { name: 'Option 1', path: '/admin/option1', icon: Users },
          { name: 'Option 2', path: '/admin/option2', icon: Settings },
          { name: 'Option 3', path: '/admin/option3', icon: FileText }
        ]
      default:
        return []
    }
  }

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const moduleMenuItems = getModuleMenuItems(currentModule)

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <nav className="sidebar-nav">
        {/* Main Modules */}
        <div className="nav-section">
          <div className="nav-section-title">
            {!collapsed && 'Modules'}
          </div>
          {modules.map((module) => {
            const Icon = module.icon
            return (
              <Link
                key={module.id}
                to={module.path}
                className={`nav-item ${isActive(module.path) ? 'active' : ''}`}
                title={collapsed ? module.name : ''}
              >
                <Icon size={20} />
                {!collapsed && <span>{module.name}</span>}
                {!collapsed && currentModule === module.id && (
                  <ChevronRight size={16} className="nav-arrow" />
                )}
              </Link>
            )
          })}
        </div>

        {/* Current Module Menu Items */}
        {!collapsed && moduleMenuItems.length > 0 && (
          <div className="nav-section">
            <div className="nav-section-title">
              {t(`modules.${currentModule}`)} Menu
            </div>
            {moduleMenuItems.map((item) => {
              const Icon = item.icon
              const hasSubItems = item.subItems && item.subItems.length > 0
              const isExpanded = expandedItems.includes(item.name)

              return (
                <div key={item.path || item.name}>
                  {hasSubItems ? (
                    <>
                      <div
                        className={`nav-item sub-item expandable ${isActive(item.path) ? 'active' : ''}`}
                        onClick={() => toggleExpanded(item.name)}
                      >
                        <Icon size={18} />
                        <span>{item.name}</span>
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </div>
                      {isExpanded && item.subItems && (
                        <div className="sub-menu">
                          {item.subItems.map((subItem) => {
                            const SubIcon = subItem.icon
                            return (
                              <Link
                                key={subItem.path}
                                to={subItem.path}
                                className={`nav-item sub-sub-item ${isActive(subItem.path) ? 'active' : ''}`}
                              >
                                <SubIcon size={16} />
                                <span>{subItem.name}</span>
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      className={`nav-item sub-item ${isActive(item.path) ? 'active' : ''}`}
                    >
                      <Icon size={18} />
                      <span>{item.name}</span>
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </nav>
      
      
    </aside>
  )
}

export default Sidebar
