import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  Alert,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Restore as RestoreIcon,
  Search as SearchIcon,
  Category as CategoryIcon,
  Refresh as RefreshIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon
} from '@mui/icons-material';
import { ProductType, CreateProductTypeRequest, productTypeService } from '../../services/productTypeService';

// Import ProductGroup and ProductCategory interfaces
interface ProductGroup {
  productGroupId: number;
  productGroupName: string;
  description?: string;
  isActive: boolean;
}

interface ProductCategory {
  productCategoryId: number;
  productCategoryName: string;
  description?: string;
  productGroupId?: number;
  productGroup?: ProductGroup;
  isActive: boolean;
}

interface ProductTypeFormData {
  productTypeName: string;
  productTypeDescription: string;
  sortOrder: number;
  productCategoryId: number;
}

const ProductTypeManagement: React.FC = () => {
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProductTypes, setFilteredProductTypes] = useState<ProductType[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [filterBy, setFilterBy] = useState<string>('active');
  const [sortBy, setSortBy] = useState<string>('productTypeName');
  const [sortOrder, setSortOrder] = useState<string>('asc');

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingProductType, setEditingProductType] = useState<ProductType | null>(null);
  const [formData, setFormData] = useState<ProductTypeFormData>({
    productTypeName: '',
    productTypeDescription: '',
    sortOrder: 1,
    productCategoryId: 0
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [dialogError, setDialogError] = useState<string | null>(null);

  useEffect(() => {
    loadProductTypes();
    loadProductCategories();
  }, []);

  useEffect(() => {
    filterProductTypes();
  }, [productTypes, searchQuery, filterBy, sortBy, sortOrder]);

  const loadProductTypes = async () => {
    try {
      setLoading(true);
      const data = await productTypeService.getAllProductTypes();
      setProductTypes(data);
      setError(null);
    } catch (err) {
      setError('Failed to load product types');
      console.error('Error loading product types:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadProductCategories = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/product-categories');
      const data = await response.json();
      setProductCategories(data);
    } catch (err) {
      console.error('Error loading product categories:', err);
    }
  };

  const filterProductTypes = () => {
    if (!searchQuery.trim()) {
      setFilteredProductTypes(productTypes);
    } else {
      const filtered = productTypes.filter(type =>
        type.productTypeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (type.productTypeDescription && type.productTypeDescription.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredProductTypes(filtered);
    }
  };

  const openCreateModal = () => {
    setEditingProductType(null);
    setFormData({
      productTypeName: '',
      productTypeDescription: '',
      sortOrder: 1,
      productCategoryId: 0
    });
    setFormErrors({});
    setShowModal(true);
  };

  const openEditModal = (productType: ProductType) => {
    setEditingProductType(productType);
    setFormData({
      productTypeName: productType.productTypeName,
      productTypeDescription: productType.productTypeDescription || '',
      sortOrder: productType.sortOrder || 1,
      productCategoryId: productType.productCategoryId || 0
    });
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProductType(null);
    setFormData({
      productTypeName: '',
      productTypeDescription: '',
      sortOrder: 1,
      productCategoryId: 0
    });
    setFormErrors({});
    setDialogError(null);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.productTypeName.trim()) {
      errors.productTypeName = 'Product type name is required';
    } else if (formData.productTypeName.length > 100) {
      errors.productTypeName = 'Product type name cannot exceed 100 characters';
    }

    if (formData.productTypeDescription && formData.productTypeDescription.length > 500) {
      errors.productTypeDescription = 'Description cannot exceed 500 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Clear any previous dialog errors
    setDialogError(null);

    try {
      setLoading(true);
      const productTypeData: CreateProductTypeRequest = {
        productTypeName: formData.productTypeName.trim(),
        productTypeDescription: formData.productTypeDescription.trim() || undefined
      };

      if (editingProductType) {
        await productTypeService.updateProductType(editingProductType.productTypeId, productTypeData);
        setSuccess('Product type updated successfully');
      } else {
        await productTypeService.createProductType(productTypeData);
        setSuccess('Product type created successfully');
      }

      closeModal();
      await loadProductTypes();
    } catch (err: any) {
      setDialogError(err.message || 'Failed to save product type');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productType: ProductType) => {
    if (!window.confirm(`Are you sure you want to delete "${productType.productTypeName}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await productTypeService.deleteProductType(productType.productTypeId);
      setSuccess('Product type deleted successfully');
      await loadProductTypes();
    } catch (err: any) {
      setError(err.message || 'Failed to delete product type');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (productType: ProductType) => {
    try {
      setLoading(true);
      await productTypeService.restoreProductType(productType.productTypeId);
      setSuccess('Product type restored successfully');
      await loadProductTypes();
    } catch (err: any) {
      setError(err.message || 'Failed to restore product type');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProductTypeFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
    // Clear dialog error when user starts typing
    if (dialogError) {
      setDialogError(null);
    }
  };

  if (loading && productTypes.length === 0) {
    return <Typography>Loading product types...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <CategoryIcon color="primary" />
        <Typography variant="h4">Product Type Management</Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Search and Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          {/* First Row: Refresh, Add Type, View Toggle */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={loadProductTypes}
                size="small"
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowModal(true)}
              >
                Add Type
              </Button>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                View:
              </Typography>
              <Box sx={{ display: 'flex', border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <Tooltip title="Grid View">
                  <IconButton
                    size="small"
                    onClick={() => setViewMode('grid')}
                    sx={{
                      borderRadius: 0,
                      backgroundColor: viewMode === 'grid' ? 'primary.main' : 'transparent',
                      color: viewMode === 'grid' ? 'white' : 'text.secondary',
                      '&:hover': {
                        backgroundColor: viewMode === 'grid' ? 'primary.dark' : 'action.hover'
                      }
                    }}
                  >
                    <ViewModuleIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Table View">
                  <IconButton
                    size="small"
                    onClick={() => setViewMode('table')}
                    sx={{
                      borderRadius: 0,
                      backgroundColor: viewMode === 'table' ? 'primary.main' : 'transparent',
                      color: viewMode === 'table' ? 'white' : 'text.secondary',
                      '&:hover': {
                        backgroundColor: viewMode === 'table' ? 'primary.dark' : 'action.hover'
                      }
                    }}
                  >
                    <ViewListIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>

          {/* Second Row: Search, Filter, Sort By, and Order */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
            <TextField
              label="Search product types"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or description"
              size="small"
              slotProps={{
                input: {
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }
              }}
            />
            <FormControl size="small">
              <InputLabel>Filter</InputLabel>
              <Select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                label="Filter"
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="active">Active Only</MenuItem>
                <MenuItem value="inactive">Inactive Only</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Sort By"
              >
                <MenuItem value="productTypeName">Name</MenuItem>
                <MenuItem value="sortOrder">Sort Order</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small">
              <InputLabel>Order</InputLabel>
              <Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                label="Order"
              >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
          </Box>


        </CardContent>
      </Card>



      {/* Product Types Display */}
      {viewMode === 'table' ? (
        <Card>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Product Category</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Sort Order</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
              <TableBody>
                {filteredProductTypes.map((productType) => {
                  const category = productCategories.find(cat => cat.productCategoryId === productType.productCategoryId);
                  return (
                    <TableRow key={productType.productTypeId}>
                      <TableCell>{productType.productTypeId}</TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {productType.productTypeName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {category ? (
                          <Chip
                            label={category.productCategoryName}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No category assigned
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="textSecondary">
                          {productType.productTypeDescription || 'No description'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={productType.sortOrder || 'Not set'}
                          size="small"
                          variant="outlined"
                          color="secondary"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={productType.isActive ? 'Active' : 'Inactive'}
                          color={productType.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => openEditModal(productType)}
                          disabled={loading}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      {productType.isActive ? (
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => handleDelete(productType)}
                            disabled={loading}
                            size="small"
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Restore">
                          <IconButton
                            onClick={() => handleRestore(productType)}
                            disabled={loading}
                            size="small"
                            color="success"
                          >
                            <RestoreIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                  );
                })}
                {filteredProductTypes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography color="textSecondary">
                        {searchQuery ? 'No product types found matching your search' : 'No product types available'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      ) : (
        /* Grid View */
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {filteredProductTypes.map((productType) => {
            const category = productCategories.find(cat => cat.productCategoryId === productType.productCategoryId);
            return (
              <Card
                key={productType.productTypeId}
                sx={{
                  width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)', lg: 'calc(25% - 18px)' },
                  height: 280,
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                    borderColor: 'primary.main'
                  },
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2
                }}
              >
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                      {productType.productTypeName}
                    </Typography>
                    <Chip
                      label={productType.isActive ? 'Active' : 'Inactive'}
                      color={productType.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>

                  {category && (
                    <Box sx={{ mb: 1 }}>
                      <Chip
                        label={category.productCategoryName}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    </Box>
                  )}

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                    {productType.productTypeDescription || 'No description available'}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        ID: {productType.productTypeId}
                      </Typography>
                      <Chip
                        label={`Order: ${productType.sortOrder || 'Not set'}`}
                        size="small"
                        variant="outlined"
                        color="secondary"
                      />
                    </Box>
                    <Box>
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => openEditModal(productType)}
                          disabled={loading}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      {productType.isActive ? (
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => handleDelete(productType)}
                            disabled={loading}
                            size="small"
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Restore">
                          <IconButton
                            onClick={() => handleRestore(productType)}
                            disabled={loading}
                            size="small"
                            color="success"
                          >
                            <RestoreIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
          {filteredProductTypes.length === 0 && (
            <Box sx={{ width: '100%', textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No product types found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {searchQuery || filterBy !== 'active'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by adding your first product type'
                }
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowModal(true)}
              >
                Add Product Type
              </Button>
            </Box>
          )}
        </Box>
      )}

      {/* Create/Edit Modal */}
      <Dialog open={showModal} onClose={closeModal} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingProductType ? 'Edit Product Type' : 'Create New Product Type'}
          </DialogTitle>
          <DialogContent>
            {dialogError && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setDialogError(null)}>
                {dialogError}
              </Alert>
            )}
            <Box sx={{ pt: 1 }}>
              <TextField
                fullWidth
                label="Product Type Name *"
                value={formData.productTypeName}
                onChange={(e) => handleInputChange('productTypeName', e.target.value)}
                error={!!formErrors.productTypeName}
                helperText={formErrors.productTypeName}
                margin="normal"
                disabled={loading}
              />

              <FormControl fullWidth margin="normal" error={!!formErrors.productCategoryId}>
                <InputLabel>Product Category *</InputLabel>
                <Select
                  value={formData.productCategoryId}
                  onChange={(e) => handleInputChange('productCategoryId', Number(e.target.value))}
                  label="Product Category *"
                  disabled={loading}
                >
                  <MenuItem value={0}>Select Product Category</MenuItem>
                  {productCategories.map((category) => (
                    <MenuItem key={category.productCategoryId} value={category.productCategoryId}>
                      {category.productCategoryName}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.productCategoryId && (
                  <FormHelperText>{formErrors.productCategoryId}</FormHelperText>
                )}
              </FormControl>

              <TextField
                fullWidth
                label="Description"
                value={formData.productTypeDescription}
                onChange={(e) => handleInputChange('productTypeDescription', e.target.value)}
                error={!!formErrors.productTypeDescription}
                helperText={formErrors.productTypeDescription}
                margin="normal"
                multiline
                rows={3}
                disabled={loading}
              />

              <TextField
                fullWidth
                label="Sort Order"
                type="number"
                value={formData.sortOrder}
                onChange={(e) => handleInputChange('sortOrder', Number(e.target.value))}
                error={!!formErrors.sortOrder}
                helperText={formErrors.sortOrder}
                margin="normal"
                disabled={loading}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeModal} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Saving...' : editingProductType ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ProductTypeManagement;
