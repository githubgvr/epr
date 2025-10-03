import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Category as CategoryIcon,
  Search as SearchIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon
} from '@mui/icons-material';

interface ProductGroup {
  productGroupId?: number;
  productGroupName: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}

interface ProductGroupFormData {
  productGroupName: string;
  description: string;
  sortOrder: number;
}

const ProductGroupManagement: React.FC = () => {
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<ProductGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<keyof ProductGroup>('productGroupName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterBy, setFilterBy] = useState<string>('active');

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ProductGroup | null>(null);
  const [formData, setFormData] = useState<ProductGroupFormData>({
    productGroupName: '',
    description: '',
    sortOrder: 1
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [dialogError, setDialogError] = useState<string | null>(null);

  useEffect(() => {
    loadProductGroups();
  }, [filterBy, sortBy, sortOrder]);

  useEffect(() => {
    filterGroups();
  }, [productGroups, searchTerm]);

  const loadProductGroups = async () => {
    try {
      setLoading(true);

      // Determine activeOnly parameter based on current filter
      const activeOnly = filterBy === 'all' ? 'false' : (filterBy === 'active' ? 'true' : 'false');

      // Map sortBy to backend field names
      const backendSortBy = sortBy === 'productGroupName' ? 'name' : 'sortOrder';

      const url = `http://localhost:8080/api/product-groups?activeOnly=${activeOnly}&sortBy=${backendSortBy}&sortOrder=${sortOrder}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to load product groups');
      }
      const data = await response.json();

      // Apply additional client-side filtering for inactive-only when needed
      let filteredData = data;
      if (filterBy === 'inactive') {
        filteredData = data.filter((group: ProductGroup) => !group.isActive);
      }

      setProductGroups(filteredData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filterGroups = () => {
    let filtered = productGroups;

    // Apply search filter (backend handles active/inactive filtering and sorting)
    if (searchTerm.trim()) {
      filtered = filtered.filter(group =>
        group.productGroupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (group.description && group.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredGroups(filtered);
  };

  const handleSort = (field: keyof ProductGroup) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
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

    // Clear dialog error when user starts typing
    if (dialogError) {
      setDialogError(null);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.productGroupName.trim()) {
      errors.productGroupName = 'Product group name is required';
    }
    
    // Removed groupCode validation as it's no longer needed
    
    if (formData.sortOrder < 1) {
      errors.sortOrder = 'Sort order must be at least 1';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Clear any previous dialog errors
    setDialogError(null);

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

      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = `Failed to ${editingGroup ? 'update' : 'create'} product group`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch {
          // If response is not JSON, use default message
        }
        throw new Error(errorMessage);
      }

      setSuccess(`Product group ${editingGroup ? 'updated' : 'created'} successfully`);
      handleCloseDialog();
      loadProductGroups();
    } catch (err) {
      // Set error in dialog instead of global error
      setDialogError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleEdit = (group: ProductGroup) => {
    setEditingGroup(group);
    setFormData({
      productGroupName: group.productGroupName,
      description: group.description || '',
      sortOrder: group.sortOrder || 1
    });
    setOpenDialog(true);
  };

  const handleDelete = async (group: ProductGroup) => {
    if (!window.confirm(`Are you sure you want to delete "${group.productGroupName}"?`)) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:8080/api/product-groups/${group.productGroupId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete product group');
      }
      
      setSuccess('Product group deleted successfully');
      loadProductGroups();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingGroup(null);
    setFormData({
      productGroupName: '',
      description: '',
      sortOrder: 1
    });
    setFormErrors({});
    setDialogError(null);
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

      {/* Search and Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          {/* First Row: Refresh, Add Group, View Toggle */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={loadProductGroups}
                size="small"
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog(true)}
              >
                Add Group
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
              label="Search product groups"
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
                onChange={(e) => setFilterBy(e.target.value)}
                label="Filter"
              >
                <MenuItem value="all">All Groups</MenuItem>
                <MenuItem value="active">Active Only</MenuItem>
                <MenuItem value="inactive">Inactive Only</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as keyof ProductGroup)}
                label="Sort By"
              >
                <MenuItem value="productGroupName">Name</MenuItem>
                <MenuItem value="sortOrder">Sort Order</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small">
              <InputLabel>Order</InputLabel>
              <Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                label="Order"
              >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Product Groups Display */}
      {viewMode === 'grid' ? (
        /* Grid View */
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {filteredGroups.map((group) => (
            <Card
              key={group.productGroupId}
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
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                {/* Header with Icon and Title */}
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      backgroundColor: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}
                  >
                    <CategoryIcon />
                  </Box>
                  <Box flexGrow={1}>
                    <Typography variant="h6" component="h3" fontWeight="600" noWrap>
                      {group.productGroupName}
                    </Typography>
                    {group.sortOrder && (
                      <Chip
                        label={`Order: ${group.sortOrder}`}
                        size="small"
                        variant="outlined"
                        sx={{ mt: 0.5 }}
                      />
                    )}
                  </Box>
                </Box>

                {/* Description */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    minHeight: 40,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {group.description || 'No description available'}
                </Typography>

                {/* Sort Order */}
                {group.sortOrder && (
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Typography variant="caption" color="text.secondary">
                      Sort Order:
                    </Typography>
                    <Chip
                      label={group.sortOrder}
                      size="small"
                      color="default"
                      variant="filled"
                    />
                  </Box>
                )}

                {/* Actions */}
                <Box display="flex" justifyContent="flex-end" gap={1} mt="auto">
                  <Tooltip title="Edit Group">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(group)}
                      size="small"
                      sx={{
                        '&:hover': {
                          backgroundColor: 'primary.light',
                          color: 'white'
                        }
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Group">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(group)}
                      size="small"
                      sx={{
                        '&:hover': {
                          backgroundColor: 'error.light',
                          color: 'white'
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          ))}

          {/* Empty State */}
          {filteredGroups.length === 0 && (
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
                No product groups found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {searchTerm
                  ? 'No groups match your search criteria. Try adjusting your search terms.'
                  : 'Get started by creating your first product group.'
                }
              </Typography>
              {!searchTerm && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenDialog(true)}
                  sx={{ mt: 1 }}
                >
                  Create Product Group
                </Button>
              )}
            </Paper>
          )}
        </Box>
      ) : (
        /* Table View */
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'productGroupName'}
                    direction={sortBy === 'productGroupName' ? sortOrder : 'asc'}
                    onClick={() => handleSort('productGroupName')}
                  >
                    Group Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'sortOrder'}
                    direction={sortBy === 'sortOrder' ? sortOrder : 'asc'}
                    onClick={() => handleSort('sortOrder')}
                  >
                    Sort Order
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'description'}
                    direction={sortBy === 'description' ? sortOrder : 'asc'}
                    onClick={() => handleSort('description')}
                  >
                    Description
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'isActive'}
                    direction={sortBy === 'isActive' ? sortOrder : 'asc'}
                    onClick={() => handleSort('isActive')}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredGroups.map((group) => (
                <TableRow key={group.productGroupId} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {group.productGroupName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={group.sortOrder || 1}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title={group.description || 'No description'}>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {group.description || 'No description'}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={group.isActive ? 'Active' : 'Inactive'}
                      color={group.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
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
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body2" color="textSecondary" sx={{ py: 4 }}>
                      No product groups found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <CategoryIcon />
            {editingGroup ? 'Edit Product Group' : 'Add New Product Group'}
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
              label="Product Group Name *"
              value={formData.productGroupName}
              onChange={(e) => handleInputChange('productGroupName', e.target.value)}
              error={!!formErrors.productGroupName}
              helperText={formErrors.productGroupName}
            />
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
              helperText="Optional description of the product group"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingGroup ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductGroupManagement;
