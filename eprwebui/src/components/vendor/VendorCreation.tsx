import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Divider
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Business as BusinessIcon,
  ContactPhone as ContactIcon,
  LocationOn as LocationIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface VendorFormData {
  vendorName: string;
  vendorCode: string;
  vendorCapacityTonnes: number;
  vendorType: string;
  assignedTasks: string;
  vendorPerformanceMetrics: string;
  vendorCertificationStatus: 'VALID' | 'EXPIRED';
  vendorFeedback: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const VendorCreation: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    'Basic Information',
    'Contact Details',
    'Address Information',
    'Business Details'
  ];

  const [formData, setFormData] = useState<VendorFormData>({
    vendorName: '',
    vendorCode: '',
    vendorCapacityTonnes: 0,
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

  const isStepValid = (): boolean => {
    switch (activeStep) {
      case 0: // Basic Information
        return !!(formData.vendorName && formData.vendorCode && formData.vendorCapacityTonnes > 0);
      case 1: // Contact Details
        return !!(formData.contactPerson && formData.contactEmail);
      case 2: // Address Information
        return !!(formData.address && formData.city && formData.state);
      case 3: // Business Details
        return !!(formData.assignedTasks);
      default:
        return false;
    }
  };

  const isFormValid = (): boolean => {
    return validateForm();
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.vendorName.trim()) {
      errors.vendorName = 'Vendor name is required';
    }

    if (!formData.vendorCode.trim()) {
      errors.vendorCode = 'Vendor code is required';
    }

    if (formData.vendorCapacityTonnes <= 0) {
      errors.vendorCapacityTonnes = 'Vendor capacity must be greater than 0';
    }

    if (!formData.assignedTasks.trim()) {
      errors.assignedTasks = 'Assigned tasks are required';
    }

    if (!formData.contactPerson.trim()) {
      errors.contactPerson = 'Contact person is required';
    }

    if (!formData.contactEmail.trim()) {
      errors.contactEmail = 'Contact email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      errors.contactEmail = 'Please enter a valid email address';
    }

    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      errors.state = 'State is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/vendors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          isActive: true
        }),
      });

      if (response.ok) {
        setSuccess('Vendor created successfully');
        setError(null);
        // Reset form
        setFormData({
          vendorName: '',
          vendorCode: '',
          vendorCapacityTonnes: 0,
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
        
        // Navigate back to vendor management after a short delay
        setTimeout(() => {
          navigate('/vendor/management');
        }, 2000);
      } else {
        const errorData = await response.text();
        setError(errorData || 'Failed to create vendor');
        setSuccess(null);
      }
    } catch (err) {
      setError('Failed to create vendor');
      setSuccess(null);
      console.error('Error creating vendor:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return renderBasicInformation();
      case 1:
        return renderContactDetails();
      case 2:
        return renderAddressInformation();
      case 3:
        return renderBusinessDetails();
      default:
        return null;
    }
  };

  const renderBasicInformation = () => {
    return (
      <Box>
        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <BusinessIcon color="primary" />
          <Typography variant="h6">Basic Information</Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Vendor Name *"
              value={formData.vendorName}
              onChange={(e) => handleInputChange('vendorName', e.target.value)}
              error={!!formErrors.vendorName}
              helperText={formErrors.vendorName}
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth disabled={loading}>
              <InputLabel>Vendor Type *</InputLabel>
              <Select
                value={formData.vendorType}
                onChange={(e) => handleInputChange('vendorType', e.target.value)}
                label="Vendor Type *"
              >
                {vendorTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.replace(/_/g, ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderContactDetails = () => {
    return (
      <Box>
        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <ContactIcon color="primary" />
          <Typography variant="h6">Contact Details</Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Contact Person *"
              value={formData.contactPerson}
              onChange={(e) => handleInputChange('contactPerson', e.target.value)}
              error={!!formErrors.contactPerson}
              helperText={formErrors.contactPerson}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Contact Email *"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => handleInputChange('contactEmail', e.target.value)}
              error={!!formErrors.contactEmail}
              helperText={formErrors.contactEmail}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Contact Phone"
              value={formData.contactPhone}
              onChange={(e) => handleInputChange('contactPhone', e.target.value)}
              error={!!formErrors.contactPhone}
              helperText={formErrors.contactPhone}
              disabled={loading}
            />
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderAddressInformation = () => {
    return (
      <Box>
        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <LocationIcon color="primary" />
          <Typography variant="h6">Address Information</Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address *"
              multiline
              rows={2}
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              error={!!formErrors.address}
              helperText={formErrors.address}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="City *"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              error={!!formErrors.city}
              helperText={formErrors.city}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="State *"
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              error={!!formErrors.state}
              helperText={formErrors.state}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="ZIP Code"
              value={formData.zipCode}
              onChange={(e) => handleInputChange('zipCode', e.target.value)}
              error={!!formErrors.zipCode}
              helperText={formErrors.zipCode}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Country"
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              error={!!formErrors.country}
              helperText={formErrors.country}
              disabled={loading}
            />
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderBusinessDetails = () => {
    return (
      <Box>
        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <AssignmentIcon color="primary" />
          <Typography variant="h6">Business Details</Typography>
        </Box>

        <Grid container spacing={3}>
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
              disabled={loading}
              placeholder="Describe the tasks and services this vendor will handle..."
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Performance Metrics"
              multiline
              rows={2}
              value={formData.vendorPerformanceMetrics}
              onChange={(e) => handleInputChange('vendorPerformanceMetrics', e.target.value)}
              error={!!formErrors.vendorPerformanceMetrics}
              helperText={formErrors.vendorPerformanceMetrics}
              disabled={loading}
              placeholder="Performance expectations and metrics..."
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth disabled={loading}>
              <InputLabel>Certification Status</InputLabel>
              <Select
                value={formData.vendorCertificationStatus}
                onChange={(e) => handleInputChange('vendorCertificationStatus', e.target.value)}
                label="Certification Status"
              >
                <MenuItem value="VALID">Valid</MenuItem>
                <MenuItem value="EXPIRED">Expired</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Additional Feedback"
              multiline
              rows={2}
              value={formData.vendorFeedback}
              onChange={(e) => handleInputChange('vendorFeedback', e.target.value)}
              error={!!formErrors.vendorFeedback}
              helperText={formErrors.vendorFeedback}
              disabled={loading}
              placeholder="Any additional notes or feedback about this vendor..."
            />
          </Grid>
        </Grid>
      </Box>
    );
  };

  const handleCancel = () => {
    navigate('/vendor/management');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Create New Vendor
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

      {/* Stepper */}
      <Paper elevation={2} sx={{ mb: 3 }}>
        <Box sx={{ p: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Paper>

      <Paper elevation={2}>
        <Card>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>
      </Paper>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          onClick={() => navigate('/vendor/management')}
          startIcon={<CancelIcon />}
          disabled={loading}
        >
          Cancel
        </Button>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {activeStep > 0 && (
            <Button
              onClick={() => setActiveStep(activeStep - 1)}
              disabled={loading}
            >
              Back
            </Button>
          )}

          {activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={() => setActiveStep(activeStep + 1)}
              disabled={loading || !isStepValid()}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || !isFormValid()}
              startIcon={<SaveIcon />}
            >
              {loading ? 'Creating...' : 'Create Vendor'}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );

};

export default VendorCreation;
