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
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Assessment as AssessmentIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import vendorService, { Vendor, VendorFormData } from '../../services/vendorService';

const VendorManagement: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [viewingVendor, setViewingVendor] = useState<Vendor | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<Vendor | null>(null);

  // Form data
  const [formData, setFormData] = useState<VendorFormData>({
    vendorName: '',
    vendorCode: '',
    vendorCapacityTonnes: 1,
    vendorType: 'RECYCLING',
    assignedTasks: '',
    vendorPerformanceMetrics: '',
    vendorCertificationStatus: 'VALID',
    vendorFeedback: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const vendorTypes = [
    'RECYCLING',
    'COLLECTION',
    'PROCESSING',
    'TRANSPORTATION',
    'DISPOSAL',
    'CONSULTING',
    'OTHER'
  ];

  useEffect(() => {
    loadVendors();
  }, []);

  useEffect(() => {
    filterVendors();
  }, [vendors, searchTerm, filterType]);

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

  const filterVendors = () => {
    let filtered = vendors;

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(vendor =>
        vendor.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.vendorCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (vendor.contactPerson && vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (vendor.contactEmail && vendor.contactEmail.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(vendor => vendor.vendorType === filterType);
    }

    setFilteredVendors(filtered);
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
      vendorType: vendor.vendorType,
      assignedTasks: vendor.assignedTasks,
      vendorPerformanceMetrics: vendor.vendorPerformanceMetrics || '',
      vendorCertificationStatus: vendor.vendorCertificationStatus,
      vendorFeedback: vendor.vendorFeedback || '',
      contactPerson: vendor.contactPerson || '',
      contactEmail: vendor.contactEmail || '',
      contactPhone: vendor.contactPhone || '',
      address: vendor.address || '',
      city: vendor.city || '',
      state: vendor.state || '',
      zipCode: vendor.zipCode || '',
      country: vendor.country || 'India'
    });
    setOpenDialog(true);
  };

  const handleView = (vendor: Vendor) => {
    setViewingVendor(vendor);
    setOpenViewDialog(true);
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
      vendorType: 'RECYCLING',
      assignedTasks: '',
      vendorPerformanceMetrics: '',
      vendorCertificationStatus: 'VALID',
      vendorFeedback: '',
      contactPerson: '',
      contactEmail: '',
      contactPhone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
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
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search vendors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, code, contact person, or email"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Filter by Type</InputLabel>
                <Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  label="Filter by Type"
                >
                  <MenuItem value="all">All Types</MenuItem>
                  {vendorTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.replace(/_/g, ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box display="flex" gap={1}>
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
              <TableCell>Type</TableCell>
              <TableCell>Capacity (Tonnes)</TableCell>
              <TableCell>Contact Person</TableCell>
              <TableCell>Contact Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVendors.map((vendor) => (
              <TableRow key={vendor.vendorId}>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {vendor.vendorName}
                  </Typography>
                </TableCell>
                <TableCell>{vendor.vendorCode}</TableCell>
                <TableCell>
                  <Chip
                    label={vendor.vendorType?.replace(/_/g, ' ') || 'RECYCLING'}
                    color="primary"
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{vendor.vendorCapacityTonnes}</TableCell>
                <TableCell>{vendor.contactPerson || 'Not specified'}</TableCell>
                <TableCell>{vendor.contactEmail || 'Not specified'}</TableCell>
                <TableCell>
                  <Chip
                    label={vendor.vendorCertificationStatus}
                    color={getCertificationStatusColor(vendor.vendorCertificationStatus) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="info"
                    onClick={() => handleView(vendor)}
                    size="small"
                    title="View Details"
                  >
                    <ViewIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(vendor)}
                    size="small"
                    title="Edit Vendor"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(vendor)}
                    size="small"
                    title="Delete Vendor"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredVendors.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
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

      {/* View Vendor Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <BusinessIcon />
            Vendor Details - {viewingVendor?.vendorName}
          </Box>
        </DialogTitle>
        <DialogContent>
          {viewingVendor && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom color="primary">
                  Basic Information
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">Vendor Name</Typography>
                  <Typography variant="body1" fontWeight="medium">{viewingVendor.vendorName}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">Vendor Code</Typography>
                  <Typography variant="body1" fontWeight="medium">{viewingVendor.vendorCode}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">Vendor Type</Typography>
                  <Chip
                    label={viewingVendor.vendorType?.replace(/_/g, ' ') || 'RECYCLING'}
                    color="primary"
                    size="small"
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">Capacity</Typography>
                  <Typography variant="body1" fontWeight="medium">{viewingVendor.vendorCapacityTonnes} Tonnes</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">Certification Status</Typography>
                  <Chip
                    label={viewingVendor.vendorCertificationStatus}
                    color={getCertificationStatusColor(viewingVendor.vendorCertificationStatus) as any}
                    size="small"
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom color="primary">
                  Contact Information
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">Contact Person</Typography>
                  <Typography variant="body1" fontWeight="medium">{viewingVendor.contactPerson || 'Not specified'}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">Email</Typography>
                  <Typography variant="body1" fontWeight="medium">{viewingVendor.contactEmail || 'Not specified'}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">Phone</Typography>
                  <Typography variant="body1" fontWeight="medium">{viewingVendor.contactPhone || 'Not specified'}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">Address</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {viewingVendor.address ? (
                      <>
                        {viewingVendor.address}
                        {viewingVendor.city && <><br />{viewingVendor.city}</>}
                        {viewingVendor.state && <>, {viewingVendor.state}</>}
                        {viewingVendor.zipCode && <> - {viewingVendor.zipCode}</>}
                        {viewingVendor.country && <><br />{viewingVendor.country}</>}
                      </>
                    ) : 'Not specified'}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom color="primary">
                  Tasks & Performance
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">Assigned Tasks</Typography>
                  <Typography variant="body1">{viewingVendor.assignedTasks}</Typography>
                </Box>
                {viewingVendor.vendorPerformanceMetrics && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="textSecondary">Performance Metrics</Typography>
                    <Typography variant="body1">{viewingVendor.vendorPerformanceMetrics}</Typography>
                  </Box>
                )}
                {viewingVendor.vendorFeedback && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="textSecondary">Feedback</Typography>
                    <Typography variant="body1">{viewingVendor.vendorFeedback}</Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
          <Button
            onClick={() => {
              setOpenViewDialog(false);
              if (viewingVendor) handleEdit(viewingVendor);
            }}
            variant="contained"
            startIcon={<EditIcon />}
          >
            Edit Vendor
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
