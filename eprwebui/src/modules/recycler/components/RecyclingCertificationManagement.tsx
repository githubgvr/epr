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
  Upload as UploadIcon
} from '@mui/icons-material';

interface RecyclingCertification {
  certificationId?: number;
  certificationName: string;
  certificationNumber: string;
  certificationType: string;
  issuingAuthority: string;
  issueDate: string;
  expiryDate: string;
  materialType: string;
  recyclerName: string;
  recyclerId?: string;
  certificationStatus: string;
  certificationFilePath?: string;
  description?: string;
  scope?: string;
  standards?: string;
  isActive?: boolean;
}

interface CertificationFormData {
  certificationName: string;
  certificationNumber: string;
  certificationType: string;
  issuingAuthority: string;
  issueDate: string;
  expiryDate: string;
  materialType: string;
  recyclerName: string;
  recyclerId?: string;
  certificationStatus: string;
  certificationFilePath?: string;
  description?: string;
  scope?: string;
  standards?: string;
}

const RecyclingCertificationManagement: React.FC = () => {
  const [certifications, setCertifications] = useState<RecyclingCertification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCertification, setEditingCertification] = useState<RecyclingCertification | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [certificationToDelete, setCertificationToDelete] = useState<RecyclingCertification | null>(null);

  // Form data
  const [formData, setFormData] = useState<CertificationFormData>({
    certificationName: '',
    certificationNumber: '',
    certificationType: 'RECYCLING_FACILITY',
    issuingAuthority: '',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    materialType: '',
    recyclerName: '',
    recyclerId: '',
    certificationStatus: 'VALID',
    certificationFilePath: '',
    description: '',
    scope: '',
    standards: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const certificationTypes = [
    'ISO_14001',
    'ISO_9001',
    'RECYCLING_FACILITY',
    'MATERIAL_RECOVERY',
    'WASTE_MANAGEMENT',
    'ENVIRONMENTAL_COMPLIANCE',
    'QUALITY_ASSURANCE',
    'CHAIN_OF_CUSTODY',
    'OTHER'
  ];

  const certificationStatuses = [
    'VALID',
    'EXPIRED',
    'SUSPENDED',
    'REVOKED',
    'PENDING_RENEWAL'
  ];

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/recycling-certifications');
      if (response.ok) {
        const data = await response.json();
        setCertifications(data);
        setError(null);
      } else {
        setError('Failed to load certifications');
      }
    } catch (err) {
      setError('Failed to load certifications');
      console.error('Error loading certifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadCertifications();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/recycling-certifications/search/name?name=${encodeURIComponent(searchTerm)}`);
      if (response.ok) {
        const data = await response.json();
        setCertifications(data);
        setError(null);
      } else {
        setError('Failed to search certifications');
      }
    } catch (err) {
      setError('Failed to search certifications');
      console.error('Error searching certifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CertificationFormData, value: any) => {
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
    
    if (!formData.certificationName.trim()) {
      errors.certificationName = 'Certification name is required';
    }
    
    if (!formData.certificationNumber.trim()) {
      errors.certificationNumber = 'Certification number is required';
    }
    
    if (!formData.issuingAuthority.trim()) {
      errors.issuingAuthority = 'Issuing authority is required';
    }
    
    if (!formData.materialType.trim()) {
      errors.materialType = 'Material type is required';
    }
    
    if (!formData.recyclerName.trim()) {
      errors.recyclerName = 'Recycler name is required';
    }
    
    if (!formData.issueDate) {
      errors.issueDate = 'Issue date is required';
    }
    
    if (!formData.expiryDate) {
      errors.expiryDate = 'Expiry date is required';
    }
    
    if (formData.issueDate && formData.expiryDate && new Date(formData.expiryDate) <= new Date(formData.issueDate)) {
      errors.expiryDate = 'Expiry date must be after issue date';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const url = editingCertification 
        ? `http://localhost:8080/api/recycling-certifications/${editingCertification.certificationId}`
        : 'http://localhost:8080/api/recycling-certifications';
      
      const method = editingCertification ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(editingCertification ? 'Certification updated successfully' : 'Certification created successfully');
        handleCloseDialog();
        loadCertifications();
      } else if (response.status === 409) {
        setError('Certification number already exists');
      } else {
        setError(editingCertification ? 'Failed to update certification' : 'Failed to create certification');
      }
    } catch (err) {
      setError(editingCertification ? 'Failed to update certification' : 'Failed to create certification');
      console.error('Error saving certification:', err);
    }
  };

  const handleEdit = (certification: RecyclingCertification) => {
    setEditingCertification(certification);
    setFormData({
      certificationName: certification.certificationName,
      certificationNumber: certification.certificationNumber,
      certificationType: certification.certificationType,
      issuingAuthority: certification.issuingAuthority,
      issueDate: certification.issueDate.split('T')[0],
      expiryDate: certification.expiryDate.split('T')[0],
      materialType: certification.materialType,
      recyclerName: certification.recyclerName,
      recyclerId: certification.recyclerId || '',
      certificationStatus: certification.certificationStatus,
      certificationFilePath: certification.certificationFilePath || '',
      description: certification.description || '',
      scope: certification.scope || '',
      standards: certification.standards || ''
    });
    setOpenDialog(true);
  };

  const handleDelete = (certification: RecyclingCertification) => {
    setCertificationToDelete(certification);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (certificationToDelete) {
      try {
        const response = await fetch(`http://localhost:8080/api/recycling-certifications/${certificationToDelete.certificationId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setSuccess('Certification deleted successfully');
          loadCertifications();
        } else {
          setError('Failed to delete certification');
        }
      } catch (err) {
        setError('Failed to delete certification');
        console.error('Error deleting certification:', err);
      }
    }
    setDeleteConfirmOpen(false);
    setCertificationToDelete(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCertification(null);
    setFormData({
      certificationName: '',
      certificationNumber: '',
      certificationType: 'RECYCLING_FACILITY',
      issuingAuthority: '',
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      materialType: '',
      recyclerName: '',
      recyclerId: '',
      certificationStatus: 'VALID',
      certificationFilePath: '',
      description: '',
      scope: '',
      standards: ''
    });
    setFormErrors({});
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VALID': return 'success';
      case 'EXPIRED': return 'error';
      case 'SUSPENDED': return 'warning';
      case 'REVOKED': return 'error';
      case 'PENDING_RENEWAL': return 'info';
      default: return 'default';
    }
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
    return expiry <= thirtyDaysFromNow && expiry > today;
  };

  if (loading) {
    return <Typography>Loading certifications...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Recycling Certification Management
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
                label="Search certifications"
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
                  onClick={loadCertifications}
                >
                  Refresh
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenDialog(true)}
                >
                  Add Certification
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
              <TableCell>Certification Name</TableCell>
              <TableCell>Number</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Material Type</TableCell>
              <TableCell>Recycler</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Expiry Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {certifications.map((cert) => (
              <TableRow key={cert.certificationId}>
                <TableCell>
                  <Tooltip title={cert.description || 'No description'}>
                    <Typography variant="body2">
                      {cert.certificationName}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>{cert.certificationNumber}</TableCell>
                <TableCell>{cert.certificationType.replace(/_/g, ' ')}</TableCell>
                <TableCell>{cert.materialType}</TableCell>
                <TableCell>
                  <Tooltip title={cert.recyclerId || 'No ID'}>
                    <Typography variant="body2">
                      {cert.recyclerName}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Chip
                    label={cert.certificationStatus.replace(/_/g, ' ')}
                    color={getStatusColor(cert.certificationStatus) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">
                      {new Date(cert.expiryDate).toLocaleDateString()}
                    </Typography>
                    {isExpiringSoon(cert.expiryDate) && (
                      <Chip
                        label="Expiring Soon"
                        color="warning"
                        size="small"
                        sx={{ mt: 0.5 }}
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(cert)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(cert)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                  {cert.certificationFilePath && (
                    <IconButton
                      size="small"
                      color="info"
                      title="View Certificate"
                    >
                      <UploadIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingCertification ? 'Edit Certification' : 'Add New Certification'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Certification Name *"
                value={formData.certificationName}
                onChange={(e) => handleInputChange('certificationName', e.target.value)}
                error={!!formErrors.certificationName}
                helperText={formErrors.certificationName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Certification Number *"
                value={formData.certificationNumber}
                onChange={(e) => handleInputChange('certificationNumber', e.target.value)}
                error={!!formErrors.certificationNumber}
                helperText={formErrors.certificationNumber}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Certification Type *</InputLabel>
                <Select
                  value={formData.certificationType}
                  onChange={(e) => handleInputChange('certificationType', e.target.value)}
                  label="Certification Type *"
                >
                  {certificationTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.replace(/_/g, ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Issuing Authority *"
                value={formData.issuingAuthority}
                onChange={(e) => handleInputChange('issuingAuthority', e.target.value)}
                error={!!formErrors.issuingAuthority}
                helperText={formErrors.issuingAuthority}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Issue Date *"
                type="date"
                value={formData.issueDate}
                onChange={(e) => handleInputChange('issueDate', e.target.value)}
                error={!!formErrors.issueDate}
                helperText={formErrors.issueDate}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Expiry Date *"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                error={!!formErrors.expiryDate}
                helperText={formErrors.expiryDate}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Material Type *"
                value={formData.materialType}
                onChange={(e) => handleInputChange('materialType', e.target.value)}
                error={!!formErrors.materialType}
                helperText={formErrors.materialType}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Recycler Name *"
                value={formData.recyclerName}
                onChange={(e) => handleInputChange('recyclerName', e.target.value)}
                error={!!formErrors.recyclerName}
                helperText={formErrors.recyclerName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Recycler ID"
                value={formData.recyclerId}
                onChange={(e) => handleInputChange('recyclerId', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status *</InputLabel>
                <Select
                  value={formData.certificationStatus}
                  onChange={(e) => handleInputChange('certificationStatus', e.target.value)}
                  label="Status *"
                >
                  {certificationStatuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status.replace(/_/g, ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Scope"
                value={formData.scope}
                onChange={(e) => handleInputChange('scope', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Standards"
                value={formData.standards}
                onChange={(e) => handleInputChange('standards', e.target.value)}
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
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingCertification ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the certification "{certificationToDelete?.certificationName}"?
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

export default RecyclingCertificationManagement;
