import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
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
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Collapse,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Category as CategoryIcon,
  Search as SearchIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { ValidationMessages, SuccessMessages, ErrorMessages, ConfirmMessages } from '../../config/messages';

interface Material {
  materialId: number;
  materialName: string;
  materialCode: string;
  isActive: boolean;
}

interface MaterialComposition {
  id?: number;
  materialId: number;
  materialName?: string;
  weight: number;
  minPercentage: number;
  maxPercentage: number;
  notes?: string;
}

interface Component {
  componentId?: number;
  componentName: string;
  componentCode: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  componentWeight?: number;
  componentLabel?: string;
  totalPercentage?: number;
  materialCompositions?: MaterialComposition[];
}

interface ComponentFormData {
  componentName: string;
  componentCode: string;
  description: string;
  sortOrder: number;
  componentWeight: number;
  componentLabel: string;
}

const ComponentManagement: React.FC = () => {
  const [components, setComponents] = useState<Component[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredComponents, setFilteredComponents] = useState<Component[]>([]);
  const [filterBy, setFilterBy] = useState<string>('active');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [expandedComponent, setExpandedComponent] = useState<number | null>(null);

  // Dialog states
  const [showModal, setShowModal] = useState(false);
  const [editingComponent, setEditingComponent] = useState<Component | null>(null);
  const [formData, setFormData] = useState<ComponentFormData>({
    componentName: '',
    componentCode: '',
    description: '',
    sortOrder: 1,
    componentWeight: 0,
    componentLabel: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [dialogError, setDialogError] = useState<string | null>(null);

  // Material Composition states
  const [materialCompositions, setMaterialCompositions] = useState<MaterialComposition[]>([]);
  const [compositionFormData, setCompositionFormData] = useState<MaterialComposition>({
    materialId: 0,
    weight: 0,
    minPercentage: 0,
    maxPercentage: 0,
    notes: '',
  });
  const [editingCompositionIndex, setEditingCompositionIndex] = useState<number | null>(null);

  useEffect(() => {
    loadComponents();
    loadMaterials();
  }, [filterBy]);

  useEffect(() => {
    filterComponents();
  }, [components, searchTerm]);

  const loadComponents = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API endpoint
      const response = await fetch('http://localhost:8080/api/components');
      if (!response.ok) throw new Error(ErrorMessages.LOAD_FAILED('components'));
      const data = await response.json();
      
      let filteredData = data;
      if (filterBy === 'active') {
        filteredData = data.filter((comp: Component) => comp.isActive);
      } else if (filterBy === 'inactive') {
        filteredData = data.filter((comp: Component) => !comp.isActive);
      }
      
      setComponents(filteredData);
      setError(null);
    } catch (err: any) {
      setError(err.message || ErrorMessages.LOAD_FAILED('components'));
    } finally {
      setLoading(false);
    }
  };

  const loadMaterials = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/materials');
      if (!response.ok) throw new Error(ErrorMessages.LOAD_FAILED('materials'));
      const data = await response.json();
      setMaterials(data.filter((m: Material) => m.isActive));
    } catch (err: any) {
      console.error('Error loading materials:', err);
    }
  };

  const filterComponents = () => {
    if (!searchTerm.trim()) {
      setFilteredComponents(components);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = components.filter(
      (comp) =>
        comp.componentName.toLowerCase().includes(searchLower) ||
        comp.componentCode.toLowerCase().includes(searchLower) ||
        (comp.description && comp.description.toLowerCase().includes(searchLower))
    );
    setFilteredComponents(filtered);
  };

  const handleInputChange = (field: keyof ComponentFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
    if (dialogError) {
      setDialogError(null);
    }
  };

  const handleCompositionInputChange = (field: keyof MaterialComposition, value: string | number) => {
    setCompositionFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.componentName.trim()) {
      errors.componentName = ValidationMessages.COMPONENT_NAME_REQUIRED;
    }

    if (!formData.componentCode.trim()) {
      errors.componentCode = ValidationMessages.COMPONENT_CODE_REQUIRED;
    }

    if (!formData.sortOrder || formData.sortOrder < 1) {
      errors.sortOrder = ValidationMessages.COMPONENT_SORT_ORDER_MIN;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateComposition = (): string | null => {
    if (!compositionFormData.materialId || compositionFormData.materialId === 0) {
      return ValidationMessages.MATERIAL_ID_REQUIRED;
    }
    if (!compositionFormData.weight || compositionFormData.weight <= 0) {
      return ValidationMessages.WEIGHT_POSITIVE;
    }
    if (compositionFormData.minPercentage < 0 || compositionFormData.minPercentage > 100) {
      return ValidationMessages.PERCENTAGE_RANGE;
    }
    if (compositionFormData.maxPercentage < 0 || compositionFormData.maxPercentage > 100) {
      return ValidationMessages.PERCENTAGE_RANGE;
    }
    if (compositionFormData.minPercentage > compositionFormData.maxPercentage) {
      return ValidationMessages.MIN_MAX_PERCENTAGE_INVALID;
    }
    return null;
  };

  const handleAddComposition = () => {
    const validationError = validateComposition();
    if (validationError) {
      setDialogError(validationError);
      return;
    }

    const material = materials.find((m) => m.materialId === compositionFormData.materialId);
    const newComposition: MaterialComposition = {
      ...compositionFormData,
      materialName: material?.materialName,
    };

    let updatedCompositions: MaterialComposition[];
    if (editingCompositionIndex !== null) {
      updatedCompositions = [...materialCompositions];
      updatedCompositions[editingCompositionIndex] = newComposition;
      setEditingCompositionIndex(null);
    } else {
      updatedCompositions = [...materialCompositions, newComposition];
    }

    // Validate total percentage
    const totalPercentage = updatedCompositions.reduce((sum, comp) => sum + (comp.maxPercentage || 0), 0);
    if (totalPercentage > 100) {
      setDialogError(`Total max percentage (${totalPercentage.toFixed(2)}%) cannot exceed 100%`);
      return;
    }

    setMaterialCompositions(updatedCompositions);

    // Reset composition form
    setCompositionFormData({
      materialId: 0,
      weight: 0,
      minPercentage: 0,
      maxPercentage: 0,
      notes: '',
    });
    setDialogError(null);
  };

  const handleEditComposition = (index: number) => {
    setCompositionFormData(materialCompositions[index]);
    setEditingCompositionIndex(index);
  };

  const handleDeleteComposition = (index: number) => {
    const updated = materialCompositions.filter((_, i) => i !== index);
    setMaterialCompositions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setDialogError(null);

    try {
      setLoading(true);
      const componentData: Component = {
        ...formData,
        isActive: true,
        materialCompositions,
      };

      const url = editingComponent
        ? `http://localhost:8080/api/components/${editingComponent.componentId}`
        : 'http://localhost:8080/api/components';
      const method = editingComponent ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(componentData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        let errorMessage = `Error ${response.status} - `;

        try {
          const jsonError = JSON.parse(errorData);
          errorMessage += jsonError.message || jsonError.error || ErrorMessages.UNKNOWN_ERROR;
        } catch {
          errorMessage += errorData || ErrorMessages.UNKNOWN_ERROR;
        }

        throw new Error(errorMessage);
      }

      setSuccess(editingComponent ? SuccessMessages.COMPONENT_UPDATED : SuccessMessages.COMPONENT_CREATED);
      closeModal();
      loadComponents();
    } catch (err: any) {
      setDialogError(err.message || ErrorMessages.CREATE_FAILED('component'));
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalWeight = (): number => {
    return materialCompositions.reduce((sum, comp) => sum + (comp.weight || 0), 0);
  };

  const calculateTotalPercentage = (): number => {
    return materialCompositions.reduce((sum, comp) => sum + (comp.maxPercentage || 0), 0);
  };

  const handleEdit = (component: Component) => {
    setEditingComponent(component);
    setFormData({
      componentName: component.componentName,
      componentCode: component.componentCode,
      description: component.description || '',
      sortOrder: component.sortOrder,
      componentWeight: component.componentWeight || 0,
      componentLabel: component.componentLabel || '',
    });
    setMaterialCompositions(component.materialCompositions || []);
    setShowModal(true);
  };

  const handleDelete = async (component: Component) => {
    if (!window.confirm(ConfirmMessages.CONFIRM_MARK_INACTIVE('component', component.componentName))) {
      return;
    }

    try {
      setLoading(true);
      await fetch(`http://localhost:8080/api/components/${component.componentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...component, isActive: false }),
      });
      setSuccess(SuccessMessages.COMPONENT_INACTIVE);
      loadComponents();
    } catch (err: any) {
      setError(err.message || ErrorMessages.MARK_INACTIVE_FAILED('component'));
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingComponent(null);
    setFormData({
      componentName: '',
      componentCode: '',
      description: '',
      sortOrder: 1,
      componentWeight: 0,
      componentLabel: '',
    });
    setMaterialCompositions([]);
    setCompositionFormData({
      materialId: 0,
      weight: 0,
      minPercentage: 0,
      maxPercentage: 0,
      notes: '',
    });
    setFormErrors({});
    setDialogError(null);
    setEditingCompositionIndex(null);
  };

  if (loading && components.length === 0) {
    return <Typography>Loading components...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <CategoryIcon color="primary" />
        <Typography variant="h4">Component Management</Typography>
      </Box>

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

      {/* Toolbar */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowModal(true)}>
          Add Component
        </Button>
        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadComponents}>
          Refresh
        </Button>
        <TextField
          size="small"
          placeholder="Search components..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} /> }}
          sx={{ minWidth: 300 }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Filter</InputLabel>
          <Select value={filterBy} onChange={(e) => setFilterBy(e.target.value)} label="Filter">
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
          <Tooltip title="Table View">
            <IconButton
              onClick={() => setViewMode('table')}
              color={viewMode === 'table' ? 'primary' : 'default'}
              size="small"
            >
              <ViewListIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Grid View">
            <IconButton
              onClick={() => setViewMode('grid')}
              color={viewMode === 'grid' ? 'primary' : 'default'}
              size="small"
            >
              <ViewModuleIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Components Display - Table or Grid View */}
      {viewMode === 'table' ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width="50px"></TableCell>
                <TableCell>Component Name</TableCell>
                <TableCell>Component Code</TableCell>
                <TableCell>Label</TableCell>
                <TableCell>Weight (kg)</TableCell>
                <TableCell>Total %</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredComponents.map((component) => {
                const totalWeight = component.materialCompositions?.reduce((sum, comp) => sum + (comp.weight || 0), 0) || 0;
                const totalPercentage = component.materialCompositions?.reduce((sum, comp) => sum + (comp.maxPercentage || 0), 0) || 0;
                const isExpanded = expandedComponent === component.componentId;

                return (
                  <React.Fragment key={component.componentId}>
                    <TableRow hover>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => setExpandedComponent(isExpanded ? null : component.componentId!)}
                        >
                          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {component.componentName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={component.componentCode} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>{component.componentLabel || '-'}</TableCell>
                      <TableCell>{totalWeight.toFixed(3)}</TableCell>
                      <TableCell>
                        <Chip
                          label={`${totalPercentage.toFixed(2)}%`}
                          size="small"
                          color={totalPercentage > 100 ? 'error' : 'success'}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={component.isActive ? 'Active' : 'Inactive'}
                          color={component.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Edit">
                          <IconButton onClick={() => handleEdit(component)} size="small" color="primary">
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        {component.isActive && (
                          <Tooltip title="Mark as Inactive">
                            <IconButton onClick={() => handleDelete(component)} size="small" color="error">
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow>
                        <TableCell colSpan={8} sx={{ bgcolor: 'grey.50', p: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Material Compositions
                          </Typography>
                          {component.materialCompositions && component.materialCompositions.length > 0 ? (
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Material</TableCell>
                                  <TableCell>Weight (kg)</TableCell>
                                  <TableCell>Min %</TableCell>
                                  <TableCell>Max %</TableCell>
                                  <TableCell>Notes</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {component.materialCompositions.map((comp, idx) => (
                                  <TableRow key={idx}>
                                    <TableCell>{comp.materialName || `Material ID: ${comp.materialId}`}</TableCell>
                                    <TableCell>{comp.weight.toFixed(3)}</TableCell>
                                    <TableCell>{comp.minPercentage.toFixed(2)}%</TableCell>
                                    <TableCell>{comp.maxPercentage.toFixed(2)}%</TableCell>
                                    <TableCell>{comp.notes || '-'}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No material compositions defined
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 3 }}>
          {filteredComponents.map((component) => {
            const totalWeight = component.materialCompositions?.reduce((sum, comp) => sum + (comp.weight || 0), 0) || 0;
            const totalPercentage = component.materialCompositions?.reduce((sum, comp) => sum + (comp.maxPercentage || 0), 0) || 0;
            const isExpanded = expandedComponent === component.componentId;

            return (
              <Card key={component.componentId} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {component.componentName}
                      </Typography>
                      <Chip label={component.componentCode} size="small" variant="outlined" sx={{ mb: 1 }} />
                    </Box>
                    <Chip
                      label={component.isActive ? 'Active' : 'Inactive'}
                      color={component.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>

                  {component.componentLabel && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Label:</strong> {component.componentLabel}
                    </Typography>
                  )}

                  <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Weight
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {totalWeight.toFixed(3)} kg
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Total %
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        color={totalPercentage > 100 ? 'error.main' : 'success.main'}
                      >
                        {totalPercentage.toFixed(2)}%
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    size="small"
                    onClick={() => setExpandedComponent(isExpanded ? null : component.componentId!)}
                    endIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    sx={{ mb: 2 }}
                  >
                    {isExpanded ? 'Hide' : 'Show'} Materials ({component.materialCompositions?.length || 0})
                  </Button>

                  {isExpanded && (
                    <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
                      {component.materialCompositions && component.materialCompositions.length > 0 ? (
                        component.materialCompositions.map((comp, idx) => (
                          <Box key={idx} sx={{ mb: 1, pb: 1, borderBottom: idx < component.materialCompositions!.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
                            <Typography variant="body2" fontWeight="medium">
                              {comp.materialName || `Material ID: ${comp.materialId}`}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Weight: {comp.weight.toFixed(3)} kg | {comp.minPercentage.toFixed(2)}% - {comp.maxPercentage.toFixed(2)}%
                            </Typography>
                            {comp.notes && (
                              <Typography variant="caption" display="block" color="text.secondary">
                                {comp.notes}
                              </Typography>
                            )}
                          </Box>
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No materials
                        </Typography>
                      )}
                    </Box>
                  )}
                </CardContent>
                <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(component)}
                    fullWidth
                  >
                    Edit
                  </Button>
                  {component.isActive && (
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(component)}
                      fullWidth
                    >
                      Deactivate
                    </Button>
                  )}
                </Box>
              </Card>
            );
          })}
        </Box>
      )}

      {/* Create/Edit Modal */}
      <Dialog open={showModal} onClose={closeModal} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{editingComponent ? 'Edit Component' : 'Create New Component'}</DialogTitle>
          <DialogContent>
            {dialogError && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setDialogError(null)}>
                {dialogError}
              </Alert>
            )}

            {/* Component Basic Info */}
            <Box sx={{ pt: 1 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Component Name *"
                  value={formData.componentName}
                  onChange={(e) => handleInputChange('componentName', e.target.value)}
                  error={!!formErrors.componentName}
                  helperText={formErrors.componentName}
                  disabled={loading}
                />
                <TextField
                  fullWidth
                  label="Component Code *"
                  value={formData.componentCode}
                  onChange={(e) => handleInputChange('componentCode', e.target.value)}
                  error={!!formErrors.componentCode}
                  helperText={formErrors.componentCode}
                  disabled={loading}
                />
                <TextField
                  fullWidth
                  label="Description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  multiline
                  rows={2}
                  disabled={loading}
                />
                <TextField
                  fullWidth
                  label="Sort Order *"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => handleInputChange('sortOrder', parseInt(e.target.value) || 1)}
                  error={!!formErrors.sortOrder}
                  helperText={formErrors.sortOrder}
                  disabled={loading}
                  inputProps={{ min: 1 }}
                />
                <TextField
                  fullWidth
                  label="Component Label"
                  value={formData.componentLabel}
                  onChange={(e) => handleInputChange('componentLabel', e.target.value)}
                  disabled={loading}
                  helperText="Optional label for this component"
                />
                <TextField
                  fullWidth
                  label="Component Weight (kg)"
                  type="number"
                  value={calculateTotalWeight().toFixed(3)}
                  disabled
                  helperText="Auto-calculated from material weights"
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Total Max Percentage (%)"
                  type="number"
                  value={calculateTotalPercentage().toFixed(2)}
                  disabled
                  helperText="Auto-calculated from max percentages (must not exceed 100%)"
                  error={calculateTotalPercentage() > 100}
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                />
              </Box>

              {/* Material Composition Section */}
              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Material Composition
              </Typography>

              {/* Add/Edit Composition Form - All fields in one row */}
              <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                  <FormControl sx={{ minWidth: 200, flex: '1 1 200px' }} size="small">
                    <InputLabel>Material *</InputLabel>
                    <Select
                      value={compositionFormData.materialId}
                      onChange={(e) => handleCompositionInputChange('materialId', Number(e.target.value))}
                      label="Material *"
                    >
                      <MenuItem value={0}>Select Material</MenuItem>
                      {materials.map((material) => (
                        <MenuItem key={material.materialId} value={material.materialId}>
                          {material.materialName} ({material.materialCode})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    label="Weight (kg) *"
                    type="number"
                    size="small"
                    value={compositionFormData.weight}
                    onChange={(e) => handleCompositionInputChange('weight', parseFloat(e.target.value) || 0)}
                    inputProps={{ min: 0, step: 0.001 }}
                    sx={{ minWidth: 120, flex: '0 1 120px' }}
                  />
                  <TextField
                    label="Min % *"
                    type="number"
                    size="small"
                    value={compositionFormData.minPercentage}
                    onChange={(e) => handleCompositionInputChange('minPercentage', parseFloat(e.target.value) || 0)}
                    inputProps={{ min: 0, max: 100, step: 0.01 }}
                    sx={{ minWidth: 100, flex: '0 1 100px' }}
                  />
                  <TextField
                    label="Max % *"
                    type="number"
                    size="small"
                    value={compositionFormData.maxPercentage}
                    onChange={(e) => handleCompositionInputChange('maxPercentage', parseFloat(e.target.value) || 0)}
                    inputProps={{ min: 0, max: 100, step: 0.01 }}
                    sx={{ minWidth: 100, flex: '0 1 100px' }}
                  />
                  <TextField
                    label="Notes"
                    size="small"
                    value={compositionFormData.notes}
                    onChange={(e) => handleCompositionInputChange('notes', e.target.value)}
                    sx={{ minWidth: 150, flex: '1 1 150px' }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddComposition}
                    size="small"
                    sx={{ minWidth: 100 }}
                  >
                    {editingCompositionIndex !== null ? 'Update' : 'Add'}
                  </Button>
                  {editingCompositionIndex !== null && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setEditingCompositionIndex(null);
                        setCompositionFormData({
                          materialId: 0,
                          weight: 0,
                          minPercentage: 0,
                          maxPercentage: 0,
                          notes: '',
                        });
                        setDialogError(null);
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </Box>
              </Card>

              {/* Material Compositions List */}
              {materialCompositions.length > 0 && (
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Material</TableCell>
                        <TableCell>Weight (kg)</TableCell>
                        <TableCell>Min %</TableCell>
                        <TableCell>Max %</TableCell>
                        <TableCell>Notes</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {materialCompositions.map((comp, index) => (
                        <TableRow key={index}>
                          <TableCell>{comp.materialName}</TableCell>
                          <TableCell>{comp.weight}</TableCell>
                          <TableCell>{comp.minPercentage}%</TableCell>
                          <TableCell>{comp.maxPercentage}%</TableCell>
                          <TableCell>{comp.notes || '-'}</TableCell>
                          <TableCell>
                            <Tooltip title="Edit">
                              <IconButton onClick={() => handleEditComposition(index)} size="small" color="primary">
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton onClick={() => handleDeleteComposition(index)} size="small" color="error">
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeModal}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {editingComponent ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ComponentManagement;

