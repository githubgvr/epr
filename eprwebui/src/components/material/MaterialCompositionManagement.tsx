import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  Alert,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
  Restore as RestoreIcon
} from '@mui/icons-material';
import materialCompositionService from '../../services/materialCompositionService';
import { MaterialComposition, CreateMaterialCompositionRequest } from '../../types/materialComposition';

interface MaterialCompositionFormData {
  compositionName: string;
  compositionCode: string;
  description: string;
  materialId: string;
  weightKg: string;
  minPercentage: string;
  maxPercentage: string;
  sortOrder: string;
  notes: string;
}

const MaterialCompositionManagement: React.FC = () => {
  const [compositions, setCompositions] = useState<MaterialComposition[]>([]);
  const [filteredCompositions, setFilteredCompositions] = useState<MaterialComposition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [filterBy, setFilterBy] = useState<string>('active');
  const [sortBy, setSortBy] = useState<string>('sortOrder');
  const [sortOrder, setSortOrder] = useState<string>('asc');

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingComposition, setEditingComposition] = useState<MaterialComposition | null>(null);
  const [formData, setFormData] = useState<MaterialCompositionFormData>({
    compositionName: '',
    compositionCode: '',
    description: '',
    materialId: '',
    weightKg: '',
    minPercentage: '',
    maxPercentage: '',
    sortOrder: '1',
    notes: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<MaterialCompositionFormData>>({});

  useEffect(() => {
    loadCompositions();
  }, []);

  useEffect(() => {
    filterCompositions();
  }, [compositions, searchQuery, filterBy, sortBy, sortOrder]);

  const loadCompositions = async () => {
    try {
      setLoading(true);
      const data = await materialCompositionService.getAllCompositions();
      setCompositions(data);
      setError(null);
    } catch (err) {
      setError('Failed to load material compositions');
      console.error('Error loading material compositions:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterCompositions = () => {
    let filtered = [...compositions];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(comp =>
        comp.compositionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.compositionCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (comp.description && comp.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (comp.notes && comp.notes.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply status filter
    if (filterBy === 'active') {
      filtered = filtered.filter(comp => comp.isActive);
    } else if (filterBy === 'inactive') {
      filtered = filtered.filter(comp => !comp.isActive);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof MaterialComposition];
      let bValue: any = b[sortBy as keyof MaterialComposition];

      if (sortBy === 'sortOrder') {
        aValue = aValue || 999;
        bValue = bValue || 999;
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredCompositions(filtered);
  };

  const handleInputChange = (field: keyof MaterialCompositionFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<MaterialCompositionFormData> = {};

    if (!formData.compositionName.trim()) {
      errors.compositionName = 'Composition name is required';
    }

    if (!formData.compositionCode.trim()) {
      errors.compositionCode = 'Composition code is required';
    }

    if (!formData.materialId.trim()) {
      errors.materialId = 'Material ID is required';
    } else if (isNaN(Number(formData.materialId)) || Number(formData.materialId) < 1) {
      errors.materialId = 'Material ID must be a valid positive number';
    }

    if (!formData.weightKg.trim()) {
      errors.weightKg = 'Weight is required';
    } else if (isNaN(Number(formData.weightKg)) || Number(formData.weightKg) <= 0) {
      errors.weightKg = 'Weight must be greater than 0';
    }

    if (!formData.minPercentage.trim()) {
      errors.minPercentage = 'Minimum percentage is required';
    } else if (isNaN(Number(formData.minPercentage)) || Number(formData.minPercentage) < 0 || Number(formData.minPercentage) > 100) {
      errors.minPercentage = 'Minimum percentage must be between 0 and 100';
    }

    if (!formData.maxPercentage.trim()) {
      errors.maxPercentage = 'Maximum percentage is required';
    } else if (isNaN(Number(formData.maxPercentage)) || Number(formData.maxPercentage) < 0 || Number(formData.maxPercentage) > 100) {
      errors.maxPercentage = 'Maximum percentage must be between 0 and 100';
    }

    if (formData.minPercentage && formData.maxPercentage && Number(formData.minPercentage) > Number(formData.maxPercentage)) {
      errors.maxPercentage = 'Maximum percentage must be greater than or equal to minimum percentage';
    }

    if (!formData.sortOrder.trim()) {
      errors.sortOrder = 'Sort order is required';
    } else if (isNaN(Number(formData.sortOrder)) || Number(formData.sortOrder) < 1) {
      errors.sortOrder = 'Sort order must be at least 1';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const compositionData: CreateMaterialCompositionRequest = {
        compositionName: formData.compositionName,
        compositionCode: formData.compositionCode,
        description: formData.description || undefined,
        materialId: Number(formData.materialId),
        weightKg: Number(formData.weightKg),
        minPercentage: Number(formData.minPercentage),
        maxPercentage: Number(formData.maxPercentage),
        sortOrder: Number(formData.sortOrder),
        notes: formData.notes || undefined
      };

      if (editingComposition) {
        await materialCompositionService.updateComposition(editingComposition.materialCompositionId, compositionData);
        setSuccess('Material composition updated successfully');
      } else {
        await materialCompositionService.createComposition(compositionData);
        setSuccess('Material composition created successfully');
      }

      closeModal();
      loadCompositions();
    } catch (err: any) {
      setError(err.message || 'Failed to save material composition');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (composition: MaterialComposition) => {
    setEditingComposition(composition);
    setFormData({
      compositionName: composition.compositionName,
      compositionCode: composition.compositionCode,
      description: composition.description || '',
      materialId: composition.materialId.toString(),
      weightKg: composition.weightKg.toString(),
      minPercentage: composition.minPercentage.toString(),
      maxPercentage: composition.maxPercentage.toString(),
      sortOrder: composition.sortOrder.toString(),
      notes: composition.notes || ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingComposition(null);
    setFormData({
      compositionName: '',
      compositionCode: '',
      description: '',
      materialId: '',
      weightKg: '',
      minPercentage: '',
      maxPercentage: '',
      sortOrder: '1',
      notes: ''
    });
    setFormErrors({});
  };

  const handleDelete = async (composition: MaterialComposition) => {
    if (window.confirm(`Are you sure you want to delete "${composition.compositionName}"?`)) {
      try {
        setLoading(true);
        await materialCompositionService.deleteComposition(composition.materialCompositionId);
        setSuccess('Material composition deleted successfully');
        loadCompositions();
      } catch (err: any) {
        setError(err.message || 'Failed to delete material composition');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRestore = async (composition: MaterialComposition) => {
    try {
      setLoading(true);
      await materialCompositionService.updateComposition(composition.materialCompositionId, { isActive: true });
      setSuccess('Material composition restored successfully');
      loadCompositions();
    } catch (err: any) {
      setError(err.message || 'Failed to restore material composition');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Material Composition Management
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
          {/* First Row: Refresh, Add Composition, View Toggle */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={loadCompositions}
                size="small"
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowModal(true)}
              >
                Add Composition
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
              placeholder="Search compositions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
              }}
            />

            <FormControl size="small">
              <InputLabel>Filter</InputLabel>
              <Select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                label="Filter"
              >
                <MenuItem value="all">All Compositions</MenuItem>
                <MenuItem value="active">Active Only</MenuItem>
                <MenuItem value="inactive">Inactive Only</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Sort By"
              >
                <MenuItem value="compositionName">Name</MenuItem>
                <MenuItem value="compositionCode">Code</MenuItem>
                <MenuItem value="materialId">Material ID</MenuItem>
                <MenuItem value="weightKg">Weight</MenuItem>
                <MenuItem value="sortOrder">Sort Order</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small">
              <InputLabel>Order</InputLabel>
              <Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                label="Order"
              >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Composition Display */}
      {viewMode === 'table' ? (
        <Card>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Material ID</TableCell>
                    <TableCell>Weight (kg)</TableCell>
                    <TableCell>Min %</TableCell>
                    <TableCell>Max %</TableCell>
                    <TableCell>Sort Order</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCompositions.map((composition) => (
                    <TableRow key={composition.materialCompositionId}>
                      <TableCell>{composition.materialCompositionId}</TableCell>
                      <TableCell>
                        <Chip
                          label={composition.compositionCode}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {composition.compositionName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={composition.materialId}
                          size="small"
                          variant="outlined"
                          color="info"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {composition.weightKg.toFixed(3)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {composition.minPercentage.toFixed(2)}%
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {composition.maxPercentage.toFixed(2)}%
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={composition.sortOrder}
                          size="small"
                          variant="outlined"
                          color="secondary"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={composition.isActive ? 'Active' : 'Inactive'}
                          color={composition.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => openEditModal(composition)}
                            disabled={loading}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        {composition.isActive ? (
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={() => handleDelete(composition)}
                              disabled={loading}
                              size="small"
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Restore">
                            <IconButton
                              onClick={() => handleRestore(composition)}
                              disabled={loading}
                              size="small"
                              color="success"
                            >
                              <RestoreIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredCompositions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        <Typography variant="body2" color="text.secondary">
                          No material compositions found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      ) : (
        /* Grid View */
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {filteredCompositions.map((composition) => (
            <Card
              key={composition.materialCompositionId}
              sx={{
                width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)', lg: 'calc(25% - 18px)' },
                height: 320,
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
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                    {composition.compositionName}
                  </Typography>
                  <Chip
                    label={composition.isActive ? 'Active' : 'Inactive'}
                    color={composition.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </Box>

                <Box sx={{ mb: 1, display: 'flex', gap: 1 }}>
                  <Chip
                    label={composition.compositionCode}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                  <Chip
                    label={`Material: ${composition.materialId}`}
                    size="small"
                    variant="outlined"
                    color="info"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Weight: {composition.weightKg.toFixed(3)} kg
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Range: {composition.minPercentage.toFixed(2)}% - {composition.maxPercentage.toFixed(2)}%
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      ID: {composition.materialCompositionId}
                    </Typography>
                    <Chip
                      label={`Order: ${composition.sortOrder}`}
                      size="small"
                      variant="outlined"
                      color="secondary"
                    />
                  </Box>
                  <Box>
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() => openEditModal(composition)}
                        disabled={loading}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    {composition.isActive ? (
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => handleDelete(composition)}
                          disabled={loading}
                          size="small"
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Restore">
                        <IconButton
                          onClick={() => handleRestore(composition)}
                          disabled={loading}
                          size="small"
                          color="success"
                        >
                          <RestoreIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
          {filteredCompositions.length === 0 && (
            <Box sx={{ width: '100%', textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No material compositions found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {searchQuery || filterBy !== 'active'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by adding your first material composition'
                }
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowModal(true)}
              >
                Add Composition
              </Button>
            </Box>
          )}
        </Box>
      )}

      {/* Create/Edit Modal */}
      <Dialog open={showModal} onClose={closeModal} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingComposition ? 'Edit Material Composition' : 'Create New Material Composition'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Composition Name *"
                    value={formData.compositionName}
                    onChange={(e) => handleInputChange('compositionName', e.target.value)}
                    error={!!formErrors.compositionName}
                    helperText={formErrors.compositionName}
                    margin="normal"
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Composition Code *"
                    value={formData.compositionCode}
                    onChange={(e) => handleInputChange('compositionCode', e.target.value)}
                    error={!!formErrors.compositionCode}
                    helperText={formErrors.compositionCode}
                    margin="normal"
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    error={!!formErrors.description}
                    helperText={formErrors.description}
                    margin="normal"
                    multiline
                    rows={2}
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Material ID *"
                    type="number"
                    value={formData.materialId}
                    onChange={(e) => handleInputChange('materialId', e.target.value)}
                    error={!!formErrors.materialId}
                    helperText={formErrors.materialId}
                    margin="normal"
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Weight (kg) *"
                    type="number"
                    inputProps={{ step: '0.001', min: '0' }}
                    value={formData.weightKg}
                    onChange={(e) => handleInputChange('weightKg', e.target.value)}
                    error={!!formErrors.weightKg}
                    helperText={formErrors.weightKg}
                    margin="normal"
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Minimum Percentage *"
                    type="number"
                    inputProps={{ step: '0.01', min: '0', max: '100' }}
                    value={formData.minPercentage}
                    onChange={(e) => handleInputChange('minPercentage', e.target.value)}
                    error={!!formErrors.minPercentage}
                    helperText={formErrors.minPercentage}
                    margin="normal"
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Maximum Percentage *"
                    type="number"
                    inputProps={{ step: '0.01', min: '0', max: '100' }}
                    value={formData.maxPercentage}
                    onChange={(e) => handleInputChange('maxPercentage', e.target.value)}
                    error={!!formErrors.maxPercentage}
                    helperText={formErrors.maxPercentage}
                    margin="normal"
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Sort Order *"
                    type="number"
                    inputProps={{ min: '1' }}
                    value={formData.sortOrder}
                    onChange={(e) => handleInputChange('sortOrder', e.target.value)}
                    error={!!formErrors.sortOrder}
                    helperText={formErrors.sortOrder}
                    margin="normal"
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    error={!!formErrors.notes}
                    helperText={formErrors.notes}
                    margin="normal"
                    multiline
                    rows={2}
                    disabled={loading}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeModal} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Saving...' : editingComposition ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default MaterialCompositionManagement;
