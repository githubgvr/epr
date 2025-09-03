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

interface RecycleLog {
  recycleLogId?: number;
  materialType: string;
  quantityRecycled: number;
  unit: string;
  recycleDate: string;
  recyclerName: string;
  recyclerId?: string;
  location: string;
  processingMethod: string;
  qualityGrade: string;
  notes?: string;
  batchNumber?: string;
  recoveryRate?: number;
  isActive?: boolean;
}

interface RecycleLogFormData {
  materialType: string;
  quantityRecycled: number;
  unit: string;
  recycleDate: string;
  recyclerName: string;
  recyclerId?: string;
  location: string;
  processingMethod: string;
  qualityGrade: string;
  notes?: string;
  batchNumber?: string;
  recoveryRate?: number;
}

const RecycleLogManagement: React.FC = () => {
  const [recycleLogs, setRecycleLogs] = useState<RecycleLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingLog, setEditingLog] = useState<RecycleLog | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState<RecycleLog | null>(null);

  // Form data
  const [formData, setFormData] = useState<RecycleLogFormData>({
    materialType: '',
    quantityRecycled: 0,
    unit: 'kg',
    recycleDate: new Date().toISOString().split('T')[0],
    recyclerName: '',
    recyclerId: '',
    location: '',
    processingMethod: 'MECHANICAL_RECYCLING',
    qualityGrade: 'GRADE_B',
    notes: '',
    batchNumber: '',
    recoveryRate: 0
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const processingMethods = [
    'MECHANICAL_RECYCLING',
    'CHEMICAL_RECYCLING',
    'ENERGY_RECOVERY',
    'BIOLOGICAL_TREATMENT',
    'REUSE',
    'OTHER'
  ];

  const qualityGrades = [
    'GRADE_A',
    'GRADE_B',
    'GRADE_C',
    'CONTAMINATED',
    'MIXED'
  ];

  const units = ['kg', 'tonnes', 'pieces', 'liters', 'cubic_meters'];

  useEffect(() => {
    loadRecycleLogs();
  }, []);

  const loadRecycleLogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/recycle-logs');
      if (response.ok) {
        const data = await response.json();
        setRecycleLogs(data);
        setError(null);
      } else {
        setError('Failed to load recycle logs');
      }
    } catch (err) {
      setError('Failed to load recycle logs');
      console.error('Error loading recycle logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadRecycleLogs();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/recycle-logs/search/material-type?materialType=${encodeURIComponent(searchTerm)}`);
      if (response.ok) {
        const data = await response.json();
        setRecycleLogs(data);
        setError(null);
      } else {
        setError('Failed to search recycle logs');
      }
    } catch (err) {
      setError('Failed to search recycle logs');
      console.error('Error searching recycle logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof RecycleLogFormData, value: any) => {
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
    
    if (!formData.materialType.trim()) {
      errors.materialType = 'Material type is required';
    }
    
    if (formData.quantityRecycled <= 0) {
      errors.quantityRecycled = 'Quantity must be greater than 0';
    }
    
    if (!formData.recyclerName.trim()) {
      errors.recyclerName = 'Recycler name is required';
    }
    
    if (!formData.location.trim()) {
      errors.location = 'Location is required';
    }
    
    if (!formData.recycleDate) {
      errors.recycleDate = 'Recycle date is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const url = editingLog 
        ? `http://localhost:8080/api/recycle-logs/${editingLog.recycleLogId}`
        : 'http://localhost:8080/api/recycle-logs';
      
      const method = editingLog ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          recycleDate: new Date(formData.recycleDate).toISOString()
        }),
      });

      if (response.ok) {
        setSuccess(editingLog ? 'Recycle log updated successfully' : 'Recycle log created successfully');
        handleCloseDialog();
        loadRecycleLogs();
      } else {
        setError(editingLog ? 'Failed to update recycle log' : 'Failed to create recycle log');
      }
    } catch (err) {
      setError(editingLog ? 'Failed to update recycle log' : 'Failed to create recycle log');
      console.error('Error saving recycle log:', err);
    }
  };

  const handleEdit = (log: RecycleLog) => {
    setEditingLog(log);
    setFormData({
      materialType: log.materialType,
      quantityRecycled: log.quantityRecycled,
      unit: log.unit,
      recycleDate: log.recycleDate.split('T')[0],
      recyclerName: log.recyclerName,
      recyclerId: log.recyclerId || '',
      location: log.location,
      processingMethod: log.processingMethod,
      qualityGrade: log.qualityGrade,
      notes: log.notes || '',
      batchNumber: log.batchNumber || '',
      recoveryRate: log.recoveryRate || 0
    });
    setOpenDialog(true);
  };

  const handleDelete = (log: RecycleLog) => {
    setLogToDelete(log);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (logToDelete) {
      try {
        const response = await fetch(`http://localhost:8080/api/recycle-logs/${logToDelete.recycleLogId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setSuccess('Recycle log deleted successfully');
          loadRecycleLogs();
        } else {
          setError('Failed to delete recycle log');
        }
      } catch (err) {
        setError('Failed to delete recycle log');
        console.error('Error deleting recycle log:', err);
      }
    }
    setDeleteConfirmOpen(false);
    setLogToDelete(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingLog(null);
    setFormData({
      materialType: '',
      quantityRecycled: 0,
      unit: 'kg',
      recycleDate: new Date().toISOString().split('T')[0],
      recyclerName: '',
      recyclerId: '',
      location: '',
      processingMethod: 'MECHANICAL_RECYCLING',
      qualityGrade: 'GRADE_B',
      notes: '',
      batchNumber: '',
      recoveryRate: 0
    });
    setFormErrors({});
  };

  const getQualityGradeColor = (grade: string) => {
    switch (grade) {
      case 'GRADE_A': return 'success';
      case 'GRADE_B': return 'primary';
      case 'GRADE_C': return 'warning';
      case 'CONTAMINATED': return 'error';
      case 'MIXED': return 'default';
      default: return 'default';
    }
  };

  if (loading) {
    return <Typography>Loading recycle logs...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Recycle Log Management
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
                label="Search by material type"
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
                  onClick={loadRecycleLogs}
                >
                  Refresh
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenDialog(true)}
                >
                  Add Recycle Log
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
              <TableCell>Material Type</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Recycler</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Processing Method</TableCell>
              <TableCell>Quality Grade</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recycleLogs.map((log) => (
              <TableRow key={log.recycleLogId}>
                <TableCell>{log.materialType}</TableCell>
                <TableCell>{log.quantityRecycled} {log.unit}</TableCell>
                <TableCell>
                  <Tooltip title={log.recyclerId || 'No ID'}>
                    <Typography variant="body2">
                      {log.recyclerName}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>{log.location}</TableCell>
                <TableCell>{log.processingMethod.replace(/_/g, ' ')}</TableCell>
                <TableCell>
                  <Chip
                    label={log.qualityGrade.replace(/_/g, ' ')}
                    color={getQualityGradeColor(log.qualityGrade) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(log.recycleDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(log)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(log)}
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
          {editingLog ? 'Edit Recycle Log' : 'Add New Recycle Log'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
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
                label="Quantity Recycled *"
                type="number"
                value={formData.quantityRecycled}
                onChange={(e) => handleInputChange('quantityRecycled', parseFloat(e.target.value) || 0)}
                error={!!formErrors.quantityRecycled}
                helperText={formErrors.quantityRecycled}
                inputProps={{ min: 0.01, step: 0.01 }}
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
                label="Recycle Date *"
                type="date"
                value={formData.recycleDate}
                onChange={(e) => handleInputChange('recycleDate', e.target.value)}
                error={!!formErrors.recycleDate}
                helperText={formErrors.recycleDate}
                InputLabelProps={{ shrink: true }}
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
              <TextField
                fullWidth
                label="Location *"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                error={!!formErrors.location}
                helperText={formErrors.location}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Processing Method *</InputLabel>
                <Select
                  value={formData.processingMethod}
                  onChange={(e) => handleInputChange('processingMethod', e.target.value)}
                  label="Processing Method *"
                >
                  {processingMethods.map((method) => (
                    <MenuItem key={method} value={method}>
                      {method.replace(/_/g, ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Quality Grade *</InputLabel>
                <Select
                  value={formData.qualityGrade}
                  onChange={(e) => handleInputChange('qualityGrade', e.target.value)}
                  label="Quality Grade *"
                >
                  {qualityGrades.map((grade) => (
                    <MenuItem key={grade} value={grade}>
                      {grade.replace(/_/g, ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Batch Number"
                value={formData.batchNumber}
                onChange={(e) => handleInputChange('batchNumber', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Recovery Rate (%)"
                type="number"
                value={formData.recoveryRate}
                onChange={(e) => handleInputChange('recoveryRate', parseFloat(e.target.value) || 0)}
                inputProps={{ min: 0, max: 100, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingLog ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this recycle log for {logToDelete?.materialType}?
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

export default RecycleLogManagement;
