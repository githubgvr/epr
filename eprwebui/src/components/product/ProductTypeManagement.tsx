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
  InputAdornment,
  Tooltip,
  Grid
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Restore as RestoreIcon,
  Search as SearchIcon,
  Category as CategoryIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { ProductType, CreateProductTypeRequest, productTypeService } from '../../services/productTypeService';

interface ProductTypeFormData {
  productTypeName: string;
  productTypeDescription: string;
}

const ProductTypeManagement: React.FC = () => {
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProductTypes, setFilteredProductTypes] = useState<ProductType[]>([]);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingProductType, setEditingProductType] = useState<ProductType | null>(null);
  const [formData, setFormData] = useState<ProductTypeFormData>({
    productTypeName: '',
    productTypeDescription: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadProductTypes();
  }, []);

  useEffect(() => {
    filterProductTypes();
  }, [productTypes, searchQuery]);

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
      productTypeDescription: ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  const openEditModal = (productType: ProductType) => {
    setEditingProductType(productType);
    setFormData({
      productTypeName: productType.productTypeName,
      productTypeDescription: productType.productTypeDescription || ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProductType(null);
    setFormData({
      productTypeName: '',
      productTypeDescription: ''
    });
    setFormErrors({});
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
      setError(err.message || 'Failed to save product type');
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

  const handleInputChange = (field: keyof ProductTypeFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (loading && productTypes.length === 0) {
    return <Typography>Loading product types...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <CategoryIcon color="primary" />
          <Typography variant="h4">Product Type Management</Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadProductTypes}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreateModal}
            disabled={loading}
          >
            Add Product Type
          </Button>
        </Box>
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

      {/* Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search product types..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                Total Product Types
              </Typography>
              <Typography variant="h4">
                {productTypes.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="success.main">
                Active
              </Typography>
              <Typography variant="h4">
                {productTypes.filter(pt => pt.isActive).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="error.main">
                Inactive
              </Typography>
              <Typography variant="h4">
                {productTypes.filter(pt => !pt.isActive).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Product Types Table */}
      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProductTypes.map((productType) => (
                  <TableRow key={productType.productTypeId}>
                    <TableCell>{productType.productTypeId}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {productType.productTypeName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {productType.productTypeDescription || 'No description'}
                      </Typography>
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
                ))}
                {filteredProductTypes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
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

      {/* Create/Edit Modal */}
      <Dialog open={showModal} onClose={closeModal} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingProductType ? 'Edit Product Type' : 'Create New Product Type'}
          </DialogTitle>
          <DialogContent>
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
