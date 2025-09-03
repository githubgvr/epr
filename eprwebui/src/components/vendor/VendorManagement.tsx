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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
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
  Refresh as RefreshIcon
} from '@mui/icons-material';
import vendorService, { Vendor, VendorFormData } from '../../services/vendorService';

const VendorManagement: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<Vendor | null>(null);

  // Form data
  const [formData, setFormData] = useState<VendorFormData>({
    vendorName: '',
    vendorCode: '',
    vendorCapacityTonnes: 1,
    assignedTasks: '',
    vendorPerformanceMetrics: '',
    vendorCertificationStatus: 'VALID',
    vendorFeedback: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      setLoading(true);
      const vendorData = await vendorService.getAllVendors();
      setVendors(vendorData);
      setError(null);
    } catch (err) {
      setError('Failed to load vendors');
      console.error('Error loading vendors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadVendors();
      return;
    }

    try {
      setLoading(true);
      const searchResults = await vendorService.searchVendors(searchTerm);
      setVendors(searchResults);
      setError(null);
    } catch (err) {
      setError('Failed to search vendors');
      console.error('Error searching vendors:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.vendorName.trim()) {
      errors.vendorName = 'Vendor name is required';
    } else if (formData.vendorName.length > 100) {
      errors.vendorName = 'Vendor name must not exceed 100 characters';
    }

    if (!formData.vendorCode.trim()) {
      errors.vendorCode = 'Vendor code is required';
    } else if (formData.vendorCode.length > 50) {
      errors.vendorCode = 'Vendor code must not exceed 50 characters';
    }

    if (formData.vendorCapacityTonnes < 1) {
      errors.vendorCapacityTonnes = 'Vendor capacity must be at least 1 tonne';
    }

    if (!formData.assignedTasks.trim()) {
      errors.assignedTasks = 'Assigned tasks are required';
    } else if (formData.assignedTasks.length > 250) {
      errors.assignedTasks = 'Assigned tasks must not exceed 250 characters';
    }

    if (formData.vendorFeedback && formData.vendorFeedback.length > 250) {
      errors.vendorFeedback = 'Vendor feedback must not exceed 250 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      if (editingVendor) {
        await vendorService.updateVendor(editingVendor.vendorId!, formData);
        setSuccess('Vendor updated successfully');
      } else {
        await vendorService.createVendor(formData);
        setSuccess('Vendor created successfully');
      }
      
      handleCloseDialog();
      loadVendors();
    } catch (err) {
      setError(editingVendor ? 'Failed to update vendor' : 'Failed to create vendor');
      console.error('Error saving vendor:', err);
    }
  };

  const handleEdit = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setFormData({
      vendorName: vendor.vendorName,
      vendorCode: vendor.vendorCode,
      vendorCapacityTonnes: vendor.vendorCapacityTonnes,
      assignedTasks: vendor.assignedTasks,
      vendorPerformanceMetrics: vendor.vendorPerformanceMetrics || '',
      vendorCertificationStatus: vendor.vendorCertificationStatus,
      vendorFeedback: vendor.vendorFeedback || ''
    });
    setOpenDialog(true);
  };

  const handleDelete = (vendor: Vendor) => {
    setVendorToDelete(vendor);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (vendorToDelete) {
      try {
        await vendorService.deleteVendor(vendorToDelete.vendorId!);
        setSuccess('Vendor deleted successfully');
        loadVendors();
      } catch (err) {
        setError('Failed to delete vendor');
        console.error('Error deleting vendor:', err);
      }
    }
    setDeleteConfirmOpen(false);
    setVendorToDelete(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingVendor(null);
    setFormData({
      vendorName: '',
      vendorCode: '',
      vendorCapacityTonnes: 1,
      assignedTasks: '',
      vendorPerformanceMetrics: '',
      vendorCertificationStatus: 'VALID',
      vendorFeedback: ''
    });
    setFormErrors({});
  };

  const handleInputChange = (field: keyof VendorFormData, value: any) => {
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

  const getCertificationStatusColor = (status: string) => {
    return status === 'VALID' ? 'success' : 'error';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading vendors...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Vendor Management
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
                label="Search vendors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" gap={1}>
                <Button
                  variant="outlined"
                  startIcon={<SearchIcon />}
                  onClick={handleSearch}
                >
                  Search
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={loadVendors}
                >
                  Refresh
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenDialog(true)}
                >
                  Add Vendor
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
              <TableCell>Vendor Name</TableCell>
              <TableCell>Vendor Code</TableCell>
              <TableCell>Capacity (Tonnes)</TableCell>
              <TableCell>Assigned Tasks</TableCell>
              <TableCell>Certification Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vendors.map((vendor) => (
              <TableRow key={vendor.vendorId}>
                <TableCell>{vendor.vendorName}</TableCell>
                <TableCell>{vendor.vendorCode}</TableCell>
                <TableCell>{vendor.vendorCapacityTonnes}</TableCell>
                <TableCell>
                  <Tooltip title={vendor.assignedTasks}>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                      {vendor.assignedTasks}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Chip
                    label={vendor.vendorCertificationStatus}
                    color={getCertificationStatusColor(vendor.vendorCertificationStatus) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(vendor)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(vendor)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {vendors.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No vendors found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Vendor Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Vendor Name *"
                value={formData.vendorName}
                onChange={(e) => handleInputChange('vendorName', e.target.value)}
                error={!!formErrors.vendorName}
                helperText={formErrors.vendorName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Vendor Code *"
                value={formData.vendorCode}
                onChange={(e) => handleInputChange('vendorCode', e.target.value)}
                error={!!formErrors.vendorCode}
                helperText={formErrors.vendorCode}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Vendor Capacity (Tonnes) *"
                type="number"
                value={formData.vendorCapacityTonnes}
                onChange={(e) => handleInputChange('vendorCapacityTonnes', parseFloat(e.target.value) || 0)}
                error={!!formErrors.vendorCapacityTonnes}
                helperText={formErrors.vendorCapacityTonnes}
                inputProps={{ min: 1, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Certification Status *</InputLabel>
                <Select
                  value={formData.vendorCertificationStatus}
                  onChange={(e) => handleInputChange('vendorCertificationStatus', e.target.value)}
                  label="Certification Status *"
                >
                  <MenuItem value="VALID">Valid</MenuItem>
                  <MenuItem value="EXPIRED">Expired</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Assigned Tasks *"
                multiline
                rows={3}
                value={formData.assignedTasks}
                onChange={(e) => handleInputChange('assignedTasks', e.target.value)}
                error={!!formErrors.assignedTasks}
                helperText={formErrors.assignedTasks}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Vendor Performance Metrics (JSON)"
                multiline
                rows={3}
                value={formData.vendorPerformanceMetrics}
                onChange={(e) => handleInputChange('vendorPerformanceMetrics', e.target.value)}
                helperText="Auto-calculated based on task completion"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Vendor Feedback"
                multiline
                rows={3}
                value={formData.vendorFeedback}
                onChange={(e) => handleInputChange('vendorFeedback', e.target.value)}
                error={!!formErrors.vendorFeedback}
                helperText={formErrors.vendorFeedback}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingVendor ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete vendor "{vendorToDelete?.vendorName}"?
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

export default VendorManagement;
