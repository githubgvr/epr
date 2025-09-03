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

interface ProductGroup {
  productGroupId?: number;
  productGroupName: string;
  description?: string;
  groupCode?: string;
  sortOrder?: number;
  isActive?: boolean;
}

interface ProductGroupFormData {
  productGroupName: string;
  description?: string;
  groupCode?: string;
  sortOrder?: number;
}

const ProductGroupManagement: React.FC = () => {
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<ProductGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ProductGroup | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<ProductGroup | null>(null);

  // Form data
  const [formData, setFormData] = useState<ProductGroupFormData>({
    productGroupName: '',
    description: '',
    groupCode: '',
    sortOrder: 1
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadProductGroups();
  }, []);

  useEffect(() => {
    filterGroups();
  }, [productGroups, searchTerm]);

  const loadProductGroups = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/product-groups');
      if (response.ok) {
        const data = await response.json();
        setProductGroups(data);
        setError(null);
      } else {
        setError('Failed to load product groups');
      }
    } catch (err) {
      setError('Failed to load product groups');
      console.error('Error loading product groups:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterGroups = () => {
    let filtered = productGroups;

    if (searchTerm.trim()) {
      filtered = filtered.filter(group =>
        group.productGroupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (group.description && group.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (group.groupCode && group.groupCode.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredGroups(filtered);
  };

  const handleInputChange = (field: keyof ProductGroupFormData, value: any) => {
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
    
    if (!formData.productGroupName.trim()) {
      errors.productGroupName = 'Product group name is required';
    }
    
    if (formData.productGroupName.length > 100) {
      errors.productGroupName = 'Product group name must not exceed 100 characters';
    }
    
    if (formData.description && formData.description.length > 500) {
      errors.description = 'Description must not exceed 500 characters';
    }
    
    if (formData.groupCode && formData.groupCode.length > 20) {
      errors.groupCode = 'Group code must not exceed 20 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const url = editingGroup 
        ? `http://localhost:8080/api/product-groups/${editingGroup.productGroupId}`
        : 'http://localhost:8080/api/product-groups';
      
      const method = editingGroup ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(editingGroup ? 'Product group updated successfully' : 'Product group created successfully');
        handleCloseDialog();
        loadProductGroups();
      } else if (response.status === 409) {
        setError('Product group name or code already exists');
      } else {
        setError(editingGroup ? 'Failed to update product group' : 'Failed to create product group');
      }
    } catch (err) {
      setError(editingGroup ? 'Failed to update product group' : 'Failed to create product group');
      console.error('Error saving product group:', err);
    }
  };

  const handleEdit = (group: ProductGroup) => {
    setEditingGroup(group);
    setFormData({
      productGroupName: group.productGroupName,
      description: group.description || '',
      groupCode: group.groupCode || '',
      sortOrder: group.sortOrder || 1
    });
    setOpenDialog(true);
  };

  const handleDelete = (group: ProductGroup) => {
    setGroupToDelete(group);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (groupToDelete) {
      try {
        const response = await fetch(`http://localhost:8080/api/product-groups/${groupToDelete.productGroupId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setSuccess('Product group deleted successfully');
          loadProductGroups();
        } else {
          setError('Failed to delete product group');
        }
      } catch (err) {
        setError('Failed to delete product group');
        console.error('Error deleting product group:', err);
      }
    }
    setDeleteConfirmOpen(false);
    setGroupToDelete(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingGroup(null);
    setFormData({
      productGroupName: '',
      description: '',
      groupCode: '',
      sortOrder: 1
    });
    setFormErrors({});
  };

  if (loading) {
    return <Typography>Loading product groups...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Product Group Management
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
                label="Search product groups"
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
                  onClick={loadProductGroups}
                >
                  Refresh
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenDialog(true)}
                >
                  Add Product Group
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
              <TableCell>Group Name</TableCell>
              <TableCell>Group Code</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Sort Order</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredGroups.map((group) => (
              <TableRow key={group.productGroupId}>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {group.productGroupName}
                  </Typography>
                </TableCell>
                <TableCell>
                  {group.groupCode ? (
                    <Chip label={group.groupCode} size="small" variant="outlined" />
                  ) : (
                    'Not set'
                  )}
                </TableCell>
                <TableCell>
                  <Tooltip title={group.description || 'No description'}>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                      {group.description || 'No description'}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>{group.sortOrder || 'Not set'}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(group)}
                    size="small"
                    title="Edit Group"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(group)}
                    size="small"
                    title="Delete Group"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredGroups.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No product groups found
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
            {editingGroup ? 'Edit Product Group' : 'Add New Product Group'}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Group Name *"
                value={formData.productGroupName}
                onChange={(e) => handleInputChange('productGroupName', e.target.value)}
                error={!!formErrors.productGroupName}
                helperText={formErrors.productGroupName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Group Code"
                value={formData.groupCode}
                onChange={(e) => handleInputChange('groupCode', e.target.value)}
                error={!!formErrors.groupCode}
                helperText={formErrors.groupCode || 'Optional unique identifier'}
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
                helperText={formErrors.description || 'Optional description of the product group'}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingGroup ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the product group "{groupToDelete?.productGroupName}"?
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

export default ProductGroupManagement;
