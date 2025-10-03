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
  TableSortLabel,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  Tooltip,
  Grid,
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
  Category as CategoryIcon,
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
  productCategoryId?: number;
  productCategoryName: string;
  description?: string;
  sortOrder?: number;
  productGroupId?: number;
  productGroup?: ProductGroup;
  isActive?: boolean;
}

interface ProductCategoryFormData {
  productCategoryName: string;
  description?: string;
  sortOrder?: number;
  productGroupId?: number;
}

const ProductCategoryManagement: React.FC = () => {
  const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter and sort states
  const [filterBy, setFilterBy] = useState<string>('active'); // Default to active
  const [sortBy, setSortBy] = useState<string>('productCategoryName');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<ProductCategory | null>(null);

  // Form data
  const [formData, setFormData] = useState<ProductCategoryFormData>({
    productCategoryName: '',
    description: '',
    sortOrder: 1,
    productGroupId: undefined
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [dialogError, setDialogError] = useState<string | null>(null);

  useEffect(() => {
    loadProductCategories();
    loadProductGroups();
  }, []);

  useEffect(() => {
    loadProductCategories();
  }, [filterBy, sortBy, sortOrder]);

  useEffect(() => {
    filterCategories();
  }, [productCategories, searchTerm]);

  const loadProductCategories = async () => {
    try {
      setLoading(true);

      // Load product categories
      const categoriesResponse = await fetch('http://localhost:8080/api/product-categories');
      if (!categoriesResponse.ok) {
        throw new Error('Failed to load product categories');
      }
      const categoriesData = await categoriesResponse.json();

      // Load product groups if not already loaded
      if (productGroups.length === 0) {
        await loadProductGroups();
      }

      // Map categories with their corresponding groups
      const categoriesWithGroups = categoriesData.map((category: ProductCategory) => ({
        ...category,
        productGroup: productGroups.find((group: ProductGroup) => group.productGroupId === category.productGroupId)
      }));

      setProductCategories(categoriesWithGroups);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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
      } else {
        console.error('Failed to load product groups');
      }
    } catch (err) {
      console.error('Error loading product groups:', err);
    }
  };

  const filterCategories = () => {
    let filtered = productCategories;

    if (searchTerm.trim()) {
      filtered = filtered.filter(category =>
        category.productCategoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (category.productGroup && category.productGroup.productGroupName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredCategories(filtered);
  };

  const handleInputChange = (field: keyof ProductCategoryFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Clear dialog error when user starts typing
    if (dialogError) {
      setDialogError(null);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.productCategoryName.trim()) {
      errors.productCategoryName = 'Product category name is required';
    }
    
    if (formData.productCategoryName.length > 100) {
      errors.productCategoryName = 'Product category name must not exceed 100 characters';
    }
    
    if (formData.description && formData.description.length > 500) {
      errors.description = 'Description must not exceed 500 characters';
    }
    
    if (!formData.productGroupId) {
      errors.productGroupId = 'Product group is required';
    }

    if (formData.sortOrder && formData.sortOrder < 1) {
      errors.sortOrder = 'Sort order must be at least 1';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    // Clear any previous dialog errors
    setDialogError(null);

    try {
      const url = editingCategory
        ? `http://localhost:8080/api/product-categories/${editingCategory.productCategoryId}`
        : 'http://localhost:8080/api/product-categories';

      const method = editingCategory ? 'PUT' : 'POST';

      // Prepare the data with isActive field
      const submitData = {
        ...formData,
        isActive: true // Default to active for new categories
      };

      // For updates, preserve the existing isActive status
      if (editingCategory) {
        submitData.isActive = editingCategory.isActive ?? true;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        setSuccess(editingCategory ? 'Product category updated successfully' : 'Product category created successfully');
        handleCloseDialog();
        loadProductCategories();
      } else if (response.status === 409) {
        setDialogError('Product category name already exists');
      } else {
        const errorText = await response.text();
        console.error('Server error:', errorText);
        setDialogError(editingCategory ? 'Failed to update product category' : 'Failed to create product category');
      }
    } catch (err) {
      setDialogError(editingCategory ? 'Failed to update product category' : 'Failed to create product category');
      console.error('Error saving product category:', err);
    }
  };

  const handleEdit = (category: ProductCategory) => {
    setEditingCategory(category);
    setFormData({
      productCategoryName: category.productCategoryName,
      description: category.description || '',
      sortOrder: category.sortOrder || 1,
      productGroupId: category.productGroupId
    });
    setOpenDialog(true);
  };

  const handleDelete = (category: ProductCategory) => {
    setCategoryToDelete(category);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (categoryToDelete) {
      try {
        const response = await fetch(`http://localhost:8080/api/product-categories/${categoryToDelete.productCategoryId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setSuccess('Product category deleted successfully');
          loadProductCategories();
        } else {
          setError('Failed to delete product category');
        }
      } catch (err) {
        setError('Failed to delete product category');
        console.error('Error deleting product category:', err);
      }
    }
    setDeleteConfirmOpen(false);
    setCategoryToDelete(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
    setFormData({
      productCategoryName: '',
      description: '',
      sortOrder: 1,
      productGroupId: undefined
    });
    setFormErrors({});
    setDialogError(null);
  };

  if (loading) {
    return <Typography>Loading product categories...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Product Category Management
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
          {/* First Row: Refresh, Add Category, View Toggle */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={loadProductCategories}
                size="small"
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog(true)}
              >
                Add Category
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

          {/* Second Row: Search, Filter, Sort, Order */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
            <TextField
              label="Search categories"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                label="Filter"
                onChange={(e) => setFilterBy(e.target.value)}
              >
                <MenuItem value="active">Active Only</MenuItem>
                <MenuItem value="inactive">Inactive Only</MenuItem>
                <MenuItem value="all">All Categories</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="productCategoryName">Name</MenuItem>
                <MenuItem value="sortOrder">Sort Order</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small">
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
          </Box>
        </CardContent>
      </Card>

      {/* Conditional rendering based on view mode */}
      {viewMode === 'table' ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category Name</TableCell>
                <TableCell>Product Group</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Sort Order</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.productCategoryId}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {category.productCategoryName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {category.productGroup ? (
                      <Chip
                        label={category.productGroup.productGroupName}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">No group assigned</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Tooltip title={category.description || 'No description'}>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {category.description || 'No description'}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{category.sortOrder || 'Not set'}</TableCell>
                  <TableCell>
                    <Chip
                      label={category.isActive ? 'Active' : 'Inactive'}
                      color={category.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(category)}
                      size="small"
                      title="Edit Category"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(category)}
                      size="small"
                      title="Delete Category"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCategories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No product categories found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        /* Grid View */
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {filteredCategories.map((category) => (
            <Card
              key={category.productCategoryId}
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
                <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography variant="h6" component="h3" noWrap sx={{ flexGrow: 1, mr: 1 }}>
                      {category.productCategoryName}
                    </Typography>
                    <Box display="flex" gap={0.5}>
                      <Tooltip title="Edit Category">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEdit(category)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Category">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(category)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  {category.productGroup && (
                    <Box mb={2}>
                      <Chip
                        label={category.productGroup.productGroupName}
                        size="small"
                        variant="outlined"
                        color="primary"
                        icon={<CategoryIcon />}
                      />
                    </Box>
                  )}

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: '3.6em'
                    }}
                  >
                    {category.description || 'No description available'}
                  </Typography>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                      Sort Order: {category.sortOrder || 'Not set'}
                    </Typography>
                    <Chip
                      label={category.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      color={category.isActive ? 'success' : 'default'}
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
              </Card>
          ))}

          {/* Empty State */}
          {filteredCategories.length === 0 && (
            <Paper
              sx={{
                p: 6,
                textAlign: 'center',
                backgroundColor: 'grey.50',
                border: '2px dashed',
                borderColor: 'grey.300',
                width: '100%'
              }}
            >
              <CategoryIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No product categories found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Try adjusting your search or filter criteria, or create a new category.
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog(true)}
                sx={{ mt: 1 }}
              >
                Create Product Category
              </Button>
            </Paper>
          )}
        </Box>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <CategoryIcon />
            {editingCategory ? 'Edit Product Category' : 'Add New Product Category'}
          </Box>
        </DialogTitle>
        <DialogContent>
          {dialogError && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setDialogError(null)}>
              {dialogError}
            </Alert>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Product Category Name *"
              value={formData.productCategoryName}
              onChange={(e) => handleInputChange('productCategoryName', e.target.value)}
              error={!!formErrors.productCategoryName}
              helperText={formErrors.productCategoryName}
            />
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
                      minWidth: 250
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
            <TextField
              fullWidth
              label="Sort Order"
              type="number"
              value={formData.sortOrder}
              onChange={(e) => handleInputChange('sortOrder', parseInt(e.target.value) || 1)}
              error={!!formErrors.sortOrder}
              helperText={formErrors.sortOrder || 'Display order'}
              slotProps={{ htmlInput: { min: 1 } }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              helperText="Optional description of the product category"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingCategory ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the product category "{categoryToDelete?.productCategoryName}"?
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

export default ProductCategoryManagement;
