import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProducerDashboard from './components/ProducerDashboard'
import ProductManagement from './components/ProductManagement'
import ProductGroupManagement from '../../components/product/ProductGroupManagement'
import ProductCategoryManagement from '../../components/product/ProductCategoryManagement'
import ProductTypeManagement from '../../components/product/ProductTypeManagement'
import MaterialManagement from '../../components/material/MaterialManagement'
import ComponentManagement from '../../components/material/ComponentManagement'
import MaterialComponent from './components/Material'
import MaterialManagementDashboard from './components/MaterialManagementDashboard'
import TrackingCompliance from './components/TrackingCompliance'
import ReportsPage from './components/ReportsPage'

const ProducerModule: React.FC = () => {
  return (
    <div className="producer-module">
      <Routes>
        <Route path="/dashboard" element={<ProducerDashboard />} />
        <Route path="/product-groups" element={<ProductGroupManagement />} />
        <Route path="/product-categories" element={<ProductCategoryManagement />} />
        <Route path="/product-types" element={<ProductTypeManagement />} />
        <Route path="/products" element={<ProductManagement />} />
        <Route path="/material-management" element={<MaterialManagementDashboard />} />
        <Route path="/materials" element={<MaterialManagement />} />
        <Route path="/components" element={<ComponentManagement />} />
        <Route path="/material-component" element={<MaterialComponent />} />
        <Route path="/compliance" element={<TrackingCompliance />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/" element={<Navigate to="/producer/dashboard" />} />
      </Routes>
    </div>
  )
}

export default ProducerModule
