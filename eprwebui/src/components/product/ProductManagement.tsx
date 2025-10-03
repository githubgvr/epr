import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  Grid,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Inventory as InventoryIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon
} from '@mui/icons-material';

interface ProductGroup {
  productGroupId: number;
  productGroupName: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}

interface ProductCategory {
  productCategoryId: number;
  productCategoryName: string;
  description?: string;
  sortOrder?: number;
  productGroupId?: number;
  isActive?: boolean;
}

interface Product {
  productId?: number;
  productName: string;
  skuProductCode: string;
  productDescription?: string;
  productWeight: number;
  productLifecycleDuration: number;
  complianceTargetPercentage: number;
  productManufacturingDate?: string;
  productExpiryDate?: string;
  productGroupId?: number;
  productCategoryId?: number;
  registrationDate?: string;
  isActive?: boolean;
}

interface ProductFormData {
  productName: string;
  skuProductCode: string;
  productDescription: string;
  productWeight: number;
  productLifecycleDuration: number;
  complianceTargetPercentage: number;
  productManufacturingDate: string;
  productExpiryDate: string;
  productGroupId: number;
  productCategoryId: number;
}

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([]);
  const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter and sort states
  const [filterBy, setFilterBy] = useState<string>('active');
  const [sortBy, setSortBy] = useState<string>('productName');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Form data
  const [formData, setFormData] = useState<ProductFormData>({
    productName: '',
    skuProductCode: '',
    productDescription: '',
    productWeight: 0,
    productLifecycleDuration: 1,
    complianceTargetPercentage: 0,
    productManufacturingDate: '',
    productExpiryDate: '',
    productGroupId: 0,
    productCategoryId: 0
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadProducts();
    loadProductGroups();
    loadProductCategories();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, filterBy, sortBy, sortOrder]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/products');
      if (!response.ok) {
        throw new Error('Failed to load products');
      }
      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadProductGroups = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/product-groups');
      if (response.ok) {
        const data = await response.json();
        setProductGroups(data);
      }
    } catch (err) {
      console.error('Error loading product groups:', err);
    }
  };

  const loadProductCategories = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/product-categories');
      if (response.ok) {
        const data = await response.json();
        setProductCategories(data);
      }
    } catch (err) {
      console.error('Error loading product categories:', err);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Apply active/inactive filter
    if (filterBy === 'active') {
      filtered = filtered.filter(product => product.isActive !== false);
    } else if (filterBy === 'inactive') {
      filtered = filtered.filter(product => product.isActive === false);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.skuProductCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.productDescription && product.productDescription.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Product];
      let bValue: any = b[sortBy as keyof Product];

      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.productName.trim()) {
      errors.productName = 'Product name is required';
    }

    if (!formData.skuProductCode.trim()) {
      errors.skuProductCode = 'SKU/Product code is required';
    }

    if (formData.productWeight <= 0) {
      errors.productWeight = 'Product weight must be greater than 0';
    }

    if (formData.productLifecycleDuration <= 0) {
      errors.productLifecycleDuration = 'Lifecycle duration must be greater than 0';
    }

    if (formData.complianceTargetPercentage < 0 || formData.complianceTargetPercentage > 100) {
      errors.complianceTargetPercentage = 'Compliance target must be between 0 and 100';
    }

    if (!formData.productGroupId) {
      errors.productGroupId = 'Product group is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const url = editingProduct 
        ? `http://localhost:8080/api/products/${editingProduct.productId}`
        : 'http://localhost:8080/api/products';
      
      const method = editingProduct ? 'PUT' : 'POST';
      
      const submitData = {
        ...formData,
        isActive: true
      };

      if (editingProduct) {
        submitData.isActive = editingProduct.isActive ?? true;
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        setSuccess(editingProduct ? 'Product updated successfully' : 'Product created successfully');
        handleCloseDialog();
        loadProducts();
      } else if (response.status === 409) {
        setError('Product SKU already exists');
      } else {
        const errorText = await response.text();
        console.error('Server error:', errorText);
        setError(editingProduct ? 'Failed to update product' : 'Failed to create product');
      }
    } catch (err) {
      setError(editingProduct ? 'Failed to update product' : 'Failed to create product');
      console.error('Error saving product:', err);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      productName: product.productName,
      skuProductCode: product.skuProductCode,
      productDescription: product.productDescription || '',
      productWeight: product.productWeight,
      productLifecycleDuration: product.productLifecycleDuration,
      complianceTargetPercentage: product.complianceTargetPercentage,
      productManufacturingDate: product.productManufacturingDate || '',
      productExpiryDate: product.productExpiryDate || '',
      productGroupId: product.productGroupId || 0,
      productCategoryId: product.productCategoryId || 0
    });
    setOpenDialog(true);
  };

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        const response = await fetch(`http://localhost:8080/api/products/${productToDelete.productId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setSuccess('Product deleted successfully');
          loadProducts();
        } else {
          setError('Failed to delete product');
        }
      } catch (err) {
        setError('Failed to delete product');
        console.error('Error deleting product:', err);
      }
    }
    setDeleteConfirmOpen(false);
    setProductToDelete(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setFormData({
      productName: '',
      skuProductCode: '',
      productDescription: '',
      productWeight: 0,
      productLifecycleDuration: 1,
      complianceTargetPercentage: 0,
      productManufacturingDate: '',
      productExpiryDate: '',
      productGroupId: 0,
      productCategoryId: 0
    });
    setFormErrors({});
  };

  if (loading) {
    return <Typography>Loading products...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Product Management
      </Typography>

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

      <Card sx={{ mb: 3 }}>
        <CardContent>
          {/* First Row: Search, Filter, Sort, Order */}
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Search products"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, SKU, or description"
                slotProps={{
                  input: {
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Filter</InputLabel>
                <Select
                  value={filterBy}
                  label="Filter"
                  onChange={(e) => setFilterBy(e.target.value)}
                >
                  <MenuItem value="active">Active Only</MenuItem>
                  <MenuItem value="inactive">Inactive Only</MenuItem>
                  <MenuItem value="all">All Products</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="productName">Name</MenuItem>
                  <MenuItem value="skuProductCode">SKU</MenuItem>
                  <MenuItem value="registrationDate">Registration Date</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Order</InputLabel>
                <Select
                  value={sortOrder}
                  label="Order"
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <MenuItem value="asc">Ascending</MenuItem>
                  <MenuItem value="desc">Descending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Second Row: View Toggle, Refresh, Add Product */}
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
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
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" gap={1} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={loadProducts}
                  size="small"
                >
                  Refresh
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenDialog(true)}
                >
                  Add Product
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Products Display */}
      {viewMode === 'table' ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell>Group</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Weight (kg)</TableCell>
                <TableCell>Compliance %</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.productId}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {product.productName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={product.skuProductCode}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    {productGroups.find(g => g.productGroupId === product.productGroupId)?.productGroupName || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {productCategories.find(c => c.productCategoryId === product.productCategoryId)?.productCategoryName || 'N/A'}
                  </TableCell>
                  <TableCell>{product.productWeight}</TableCell>
                  <TableCell>{product.complianceTargetPercentage}%</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(product)}
                      size="small"
                      title="Edit Product"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(product)}
                      size="small"
                      title="Delete Product"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.productId}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '8px',
                        backgroundColor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}
                    >
                      <InventoryIcon />
                    </Box>
                    <Box flexGrow={1}>
                      <Typography variant="h6" component="h3" fontWeight="600" noWrap>
                        {product.productName}
                      </Typography>
                      <Chip
                        label={product.skuProductCode}
                        size="small"
                        variant="outlined"
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                    {product.productDescription || 'No description available'}
                  </Typography>

                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="body2">
                      <strong>Weight:</strong> {product.productWeight} kg
                    </Typography>
                    <Typography variant="body2">
                      <strong>Compliance:</strong> {product.complianceTargetPercentage}%
                    </Typography>
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Group: {productGroups.find(g => g.productGroupId === product.productGroupId)?.productGroupName || 'N/A'}
                      </Typography>
                    </Box>
                    <Box display="flex" gap={1}>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(product)}
                        size="small"
                        title="Edit Product"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(product)}
                        size="small"
                        title="Delete Product"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {filteredProducts.length === 0 && (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <InventoryIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No products found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your search or filter criteria
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <InventoryIcon />
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* First Row */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Product Name *"
                value={formData.productName}
                onChange={(e) => handleInputChange('productName', e.target.value)}
                error={!!formErrors.productName}
                helperText={formErrors.productName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="SKU/Product Code *"
                value={formData.skuProductCode}
                onChange={(e) => handleInputChange('skuProductCode', e.target.value)}
                error={!!formErrors.skuProductCode}
                helperText={formErrors.skuProductCode}
              />
            </Grid>

            {/* Second Row */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.productGroupId}>
                <InputLabel>Product Group *</InputLabel>
                <Select
                  value={formData.productGroupId || ''}
                  onChange={(e) => handleInputChange('productGroupId', e.target.value)}
                  label="Product Group *"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                        width: 'auto',
                        minWidth: 300
                      }
                    }
                  }}
                >
                  {productGroups.map((group) => (
                    <MenuItem key={group.productGroupId} value={group.productGroupId}>
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {group.productGroupName}
                        </Typography>
                        {group.description && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            {group.description}
                          </Typography>
                        )}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.productGroupId && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                    {formErrors.productGroupId}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Product Category</InputLabel>
                <Select
                  value={formData.productCategoryId || ''}
                  onChange={(e) => handleInputChange('productCategoryId', e.target.value)}
                  label="Product Category"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                        width: 'auto',
                        minWidth: 300
                      }
                    }
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {productCategories
                    .filter(category => !formData.productGroupId || category.productGroupId === formData.productGroupId)
                    .map((category) => (
                    <MenuItem key={category.productCategoryId} value={category.productCategoryId}>
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {category.productCategoryName}
                        </Typography>
                        {category.description && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            {category.description}
                          </Typography>
                        )}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Third Row */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Weight (kg) *"
                type="number"
                value={formData.productWeight}
                onChange={(e) => handleInputChange('productWeight', parseFloat(e.target.value) || 0)}
                error={!!formErrors.productWeight}
                helperText={formErrors.productWeight}
                slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Lifecycle Duration (years) *"
                type="number"
                value={formData.productLifecycleDuration}
                onChange={(e) => handleInputChange('productLifecycleDuration', parseInt(e.target.value) || 1)}
                error={!!formErrors.productLifecycleDuration}
                helperText={formErrors.productLifecycleDuration}
                slotProps={{ htmlInput: { min: 1 } }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Compliance Target (%)"
                type="number"
                value={formData.complianceTargetPercentage}
                onChange={(e) => handleInputChange('complianceTargetPercentage', parseFloat(e.target.value) || 0)}
                error={!!formErrors.complianceTargetPercentage}
                helperText={formErrors.complianceTargetPercentage}
                slotProps={{ htmlInput: { min: 0, max: 100, step: 0.1 } }}
              />
            </Grid>

            {/* Fourth Row */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Manufacturing Date"
                type="date"
                value={formData.productManufacturingDate}
                onChange={(e) => handleInputChange('productManufacturingDate', e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Expiry Date"
                type="date"
                value={formData.productExpiryDate}
                onChange={(e) => handleInputChange('productExpiryDate', e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>

            {/* Fifth Row */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.productDescription}
                onChange={(e) => handleInputChange('productDescription', e.target.value)}
                helperText="Optional description of the product"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingProduct ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the product "{productToDelete?.productName}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductManagement;
