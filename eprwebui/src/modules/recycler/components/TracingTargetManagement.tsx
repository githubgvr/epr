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
  LinearProgress,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

interface TracingTarget {
  targetId?: number;
  targetName: string;
  materialType: string;
  targetQuantity: number;
  achievedQuantity: number;
  unit: string;
  targetDate: string;
  startDate: string;
  targetType: string;
  priorityLevel: string;
  targetStatus: string;
  responsibleParty?: string;
  description?: string;
  location?: string;
  progressPercentage: number;
  notes?: string;
  isActive?: boolean;
}

interface TargetFormData {
  targetName: string;
  materialType: string;
  targetQuantity: number;
  achievedQuantity: number;
  unit: string;
  targetDate: string;
  startDate: string;
  targetType: string;
  priorityLevel: string;
  targetStatus: string;
  responsibleParty?: string;
  description?: string;
  location?: string;
  notes?: string;
}

const TracingTargetManagement: React.FC = () => {
  const [targets, setTargets] = useState<TracingTarget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTarget, setEditingTarget] = useState<TracingTarget | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [targetToDelete, setTargetToDelete] = useState<TracingTarget | null>(null);

  // Form data
  const [formData, setFormData] = useState<TargetFormData>({
    targetName: '',
    materialType: '',
    targetQuantity: 0,
    achievedQuantity: 0,
    unit: 'kg',
    targetDate: '',
    startDate: new Date().toISOString().split('T')[0],
    targetType: 'RECYCLING_TARGET',
    priorityLevel: 'MEDIUM',
    targetStatus: 'NOT_STARTED',
    responsibleParty: '',
    description: '',
    location: '',
    notes: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const targetTypes = [
    'COLLECTION_TARGET',
    'RECYCLING_TARGET',
    'RECOVERY_TARGET',
    'REDUCTION_TARGET',
    'REUSE_TARGET',
    'COMPLIANCE_TARGET',
    'ENVIRONMENTAL_TARGET'
  ];

  const priorityLevels = [
    'LOW',
    'MEDIUM',
    'HIGH',
    'CRITICAL'
  ];

  const targetStatuses = [
    'NOT_STARTED',
    'IN_PROGRESS',
    'ON_TRACK',
    'AT_RISK',
    'DELAYED',
    'COMPLETED',
    'CANCELLED',
    'EXCEEDED'
  ];

  const units = ['kg', 'tonnes', 'pieces', 'liters', 'cubic_meters'];

  useEffect(() => {
    loadTargets();
  }, []);

  const loadTargets = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/tracing-targets');
      if (response.ok) {
        const data = await response.json();
        setTargets(data);
        setError(null);
      } else {
        setError('Failed to load tracing targets');
      }
    } catch (err) {
      setError('Failed to load tracing targets');
      console.error('Error loading targets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadTargets();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/tracing-targets/search/name?name=${encodeURIComponent(searchTerm)}`);
      if (response.ok) {
        const data = await response.json();
        setTargets(data);
        setError(null);
      } else {
        setError('Failed to search targets');
      }
    } catch (err) {
      setError('Failed to search targets');
      console.error('Error searching targets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof TargetFormData, value: any) => {
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
    
    if (!formData.targetName.trim()) {
      errors.targetName = 'Target name is required';
    }
    
    if (!formData.materialType.trim()) {
      errors.materialType = 'Material type is required';
    }
    
    if (formData.targetQuantity <= 0) {
      errors.targetQuantity = 'Target quantity must be greater than 0';
    }
    
    if (formData.achievedQuantity < 0) {
      errors.achievedQuantity = 'Achieved quantity cannot be negative';
    }
    
    if (!formData.targetDate) {
      errors.targetDate = 'Target date is required';
    }
    
    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
    }
    
    if (formData.startDate && formData.targetDate && new Date(formData.targetDate) <= new Date(formData.startDate)) {
      errors.targetDate = 'Target date must be after start date';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const url = editingTarget 
        ? `http://localhost:8080/api/tracing-targets/${editingTarget.targetId}`
        : 'http://localhost:8080/api/tracing-targets';
      
      const method = editingTarget ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(editingTarget ? 'Target updated successfully' : 'Target created successfully');
        handleCloseDialog();
        loadTargets();
      } else {
        setError(editingTarget ? 'Failed to update target' : 'Failed to create target');
      }
    } catch (err) {
      setError(editingTarget ? 'Failed to update target' : 'Failed to create target');
      console.error('Error saving target:', err);
    }
  };

  const handleEdit = (target: TracingTarget) => {
    setEditingTarget(target);
    setFormData({
      targetName: target.targetName,
      materialType: target.materialType,
      targetQuantity: target.targetQuantity,
      achievedQuantity: target.achievedQuantity,
      unit: target.unit,
      targetDate: target.targetDate.split('T')[0],
      startDate: target.startDate.split('T')[0],
      targetType: target.targetType,
      priorityLevel: target.priorityLevel,
      targetStatus: target.targetStatus,
      responsibleParty: target.responsibleParty || '',
      description: target.description || '',
      location: target.location || '',
      notes: target.notes || ''
    });
    setOpenDialog(true);
  };

  const handleDelete = (target: TracingTarget) => {
    setTargetToDelete(target);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (targetToDelete) {
      try {
        const response = await fetch(`http://localhost:8080/api/tracing-targets/${targetToDelete.targetId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setSuccess('Target deleted successfully');
          loadTargets();
        } else {
          setError('Failed to delete target');
        }
      } catch (err) {
        setError('Failed to delete target');
        console.error('Error deleting target:', err);
      }
    }
    setDeleteConfirmOpen(false);
    setTargetToDelete(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTarget(null);
    setFormData({
      targetName: '',
      materialType: '',
      targetQuantity: 0,
      achievedQuantity: 0,
      unit: 'kg',
      targetDate: '',
      startDate: new Date().toISOString().split('T')[0],
      targetType: 'RECYCLING_TARGET',
      priorityLevel: 'MEDIUM',
      targetStatus: 'NOT_STARTED',
      responsibleParty: '',
      description: '',
      location: '',
      notes: ''
    });
    setFormErrors({});
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'default';
      case 'MEDIUM': return 'primary';
      case 'HIGH': return 'warning';
      case 'CRITICAL': return 'error';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NOT_STARTED': return 'default';
      case 'IN_PROGRESS': return 'info';
      case 'ON_TRACK': return 'success';
      case 'AT_RISK': return 'warning';
      case 'DELAYED': return 'error';
      case 'COMPLETED': return 'success';
      case 'CANCELLED': return 'default';
      case 'EXCEEDED': return 'success';
      default: return 'default';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'success';
    if (percentage >= 75) return 'primary';
    if (percentage >= 50) return 'warning';
    return 'error';
  };

  if (loading) {
    return <Typography>Loading tracing targets...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Tracing Target Management
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
                label="Search targets"
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
                  onClick={loadTargets}
                >
                  Refresh
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenDialog(true)}
                >
                  Add Target
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
              <TableCell>Target Name</TableCell>
              <TableCell>Material Type</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Target Date</TableCell>
              <TableCell>Responsible Party</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {targets.map((target) => (
              <TableRow key={target.targetId}>
                <TableCell>
                  <Tooltip title={target.description || 'No description'}>
                    <Typography variant="body2">
                      {target.targetName}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>{target.materialType}</TableCell>
                <TableCell>
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(target.progressPercentage, 100)}
                      color={getProgressColor(target.progressPercentage)}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                      {target.achievedQuantity} / {target.targetQuantity} {target.unit} ({target.progressPercentage.toFixed(1)}%)
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={target.priorityLevel}
                    color={getPriorityColor(target.priorityLevel) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={target.targetStatus.replace(/_/g, ' ')}
                    color={getStatusColor(target.targetStatus) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(target.targetDate).toLocaleDateString()}
                  </Typography>
                  {new Date(target.targetDate) < new Date() && target.targetStatus !== 'COMPLETED' && (
                    <Chip
                      label="Overdue"
                      color="error"
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  )}
                </TableCell>
                <TableCell>{target.responsibleParty || 'Not assigned'}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(target)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(target)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingTarget ? 'Edit Target' : 'Add New Target'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Target Name *"
                value={formData.targetName}
                onChange={(e) => handleInputChange('targetName', e.target.value)}
                error={!!formErrors.targetName}
                helperText={formErrors.targetName}
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
                label="Target Quantity *"
                type="number"
                value={formData.targetQuantity}
                onChange={(e) => handleInputChange('targetQuantity', parseFloat(e.target.value) || 0)}
                error={!!formErrors.targetQuantity}
                helperText={formErrors.targetQuantity}
                inputProps={{ min: 0.01, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Achieved Quantity"
                type="number"
                value={formData.achievedQuantity}
                onChange={(e) => handleInputChange('achievedQuantity', parseFloat(e.target.value) || 0)}
                error={!!formErrors.achievedQuantity}
                helperText={formErrors.achievedQuantity}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Unit *</InputLabel>
                <Select
                  value={formData.unit}
                  onChange={(e) => handleInputChange('unit', e.target.value)}
                  label="Unit *"
                >
                  {units.map((unit) => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Start Date *"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                error={!!formErrors.startDate}
                helperText={formErrors.startDate}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Target Date *"
                type="date"
                value={formData.targetDate}
                onChange={(e) => handleInputChange('targetDate', e.target.value)}
                error={!!formErrors.targetDate}
                helperText={formErrors.targetDate}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Target Type *</InputLabel>
                <Select
                  value={formData.targetType}
                  onChange={(e) => handleInputChange('targetType', e.target.value)}
                  label="Target Type *"
                >
                  {targetTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.replace(/_/g, ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Priority Level *</InputLabel>
                <Select
                  value={formData.priorityLevel}
                  onChange={(e) => handleInputChange('priorityLevel', e.target.value)}
                  label="Priority Level *"
                >
                  {priorityLevels.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status *</InputLabel>
                <Select
                  value={formData.targetStatus}
                  onChange={(e) => handleInputChange('targetStatus', e.target.value)}
                  label="Status *"
                >
                  {targetStatuses.map((status) => (
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
                label="Responsible Party"
                value={formData.responsibleParty}
                onChange={(e) => handleInputChange('responsibleParty', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={2}
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingTarget ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the target "{targetToDelete?.targetName}"?
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

export default TracingTargetManagement;
