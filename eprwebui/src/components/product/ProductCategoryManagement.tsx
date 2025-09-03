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
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Category as CategoryIcon
} from '@mui/icons-material';

interface ProductCategory {
  productCategoryId?: number;
  productCategoryName: string;
  description?: string;
  categoryCode?: string;
  sortOrder?: number;
  isActive?: boolean;
}

interface ProductCategoryFormData {
  productCategoryName: string;
  description?: string;
  categoryCode?: string;
  sortOrder?: number;
}

const ProductCategoryManagement: React.FC = () => {
  const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<ProductCategory | null>(null);

  // Form data
  const [formData, setFormData] = useState<ProductCategoryFormData>({
    productCategoryName: '',
    description: '',
    categoryCode: '',
    sortOrder: 1
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadProductCategories();
  }, []);

  useEffect(() => {
    filterCategories();
  }, [productCategories, searchTerm]);

  const loadProductCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/product-categories');
      if (response.ok) {
        const data = await response.json();
        setProductCategories(data);
        setError(null);
      } else {
        setError('Failed to load product categories');
      }
    } catch (err) {
      setError('Failed to load product categories');
      console.error('Error loading product categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterCategories = () => {
    let filtered = productCategories;

    if (searchTerm.trim()) {
      filtered = filtered.filter(category =>
        category.productCategoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (category.categoryCode && category.categoryCode.toLowerCase().includes(searchTerm.toLowerCase()))
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
    
    if (formData.categoryCode && formData.categoryCode.length > 20) {
      errors.categoryCode = 'Category code must not exceed 20 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const url = editingCategory 
        ? `http://localhost:8080/api/product-categories/${editingCategory.productCategoryId}`
        : 'http://localhost:8080/api/product-categories';
      
      const method = editingCategory ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(editingCategory ? 'Product category updated successfully' : 'Product category created successfully');
        handleCloseDialog();
        loadProductCategories();
      } else if (response.status === 409) {
        setError('Product category name or code already exists');
      } else {
        setError(editingCategory ? 'Failed to update product category' : 'Failed to create product category');
      }
    } catch (err) {
      setError(editingCategory ? 'Failed to update product category' : 'Failed to create product category');
      console.error('Error saving product category:', err);
    }
  };

  const handleEdit = (category: ProductCategory) => {
    setEditingCategory(category);
    setFormData({
      productCategoryName: category.productCategoryName,
      description: category.description || '',
      categoryCode: category.categoryCode || '',
      sortOrder: category.sortOrder || 1
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
      categoryCode: '',
      sortOrder: 1
    });
    setFormErrors({});
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
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search product categories"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, description, or code"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" gap={1}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={loadProductCategories}
                >
                  Refresh
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenDialog(true)}
                >
                  Add Product Category
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category Name</TableCell>
              <TableCell>Category Code</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Sort Order</TableCell>
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
                  {category.categoryCode ? (
                    <Chip label={category.categoryCode} size="small" variant="outlined" />
                  ) : (
                    'Not set'
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
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No product categories found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <CategoryIcon />
            {editingCategory ? 'Edit Product Category' : 'Add New Product Category'}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Category Name *"
                value={formData.productCategoryName}
                onChange={(e) => handleInputChange('productCategoryName', e.target.value)}
                error={!!formErrors.productCategoryName}
                helperText={formErrors.productCategoryName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Category Code"
                value={formData.categoryCode}
                onChange={(e) => handleInputChange('categoryCode', e.target.value)}
                error={!!formErrors.categoryCode}
                helperText={formErrors.categoryCode || 'Optional unique identifier'}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Sort Order"
                type="number"
                value={formData.sortOrder}
                onChange={(e) => handleInputChange('sortOrder', parseInt(e.target.value) || 1)}
                inputProps={{ min: 1 }}
                helperText="Display order (lower numbers appear first)"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                error={!!formErrors.description}
                helperText={formErrors.description || 'Optional description of the product category'}
              />
            </Grid>
          </Grid>
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
