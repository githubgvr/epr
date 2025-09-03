import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Alert,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  Star as StarIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { Vendor } from '../../services/vendorService';

interface VendorPerformanceMetrics {
  vendorId: number;
  vendorName: string;
  vendorType: string;
  totalCapacity: number;
  utilizationRate: number;
  completedTasks: number;
  totalTasks: number;
  averageRating: number;
  onTimeDelivery: number;
  qualityScore: number;
  certificationStatus: string;
  lastUpdated: string;
}

const VendorPerformance: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [performanceData, setPerformanceData] = useState<VendorPerformanceMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

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
    loadVendorPerformance();
  }, []);

  const loadVendorPerformance = async () => {
    try {
      setLoading(true);
      
      // Load vendors
      const vendorResponse = await fetch('http://localhost:8080/api/vendors');
      if (vendorResponse.ok) {
        const vendorData = await vendorResponse.json();
        setVendors(vendorData);
        
        // Generate mock performance data
        const mockPerformanceData = generateMockPerformanceData(vendorData);
        setPerformanceData(mockPerformanceData);
        
        setError(null);
      } else {
        setError('Failed to load vendor performance data');
      }
    } catch (err) {
      setError('Failed to load vendor performance data');
      console.error('Error loading vendor performance:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateMockPerformanceData = (vendors: Vendor[]): VendorPerformanceMetrics[] => {
    return vendors.map(vendor => ({
      vendorId: vendor.vendorId || 0,
      vendorName: vendor.vendorName,
      vendorType: vendor.vendorType || 'RECYCLING',
      totalCapacity: vendor.vendorCapacityTonnes,
      utilizationRate: Math.floor(Math.random() * 40) + 60, // 60-100%
      completedTasks: Math.floor(Math.random() * 50) + 10,
      totalTasks: Math.floor(Math.random() * 60) + 15,
      averageRating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0-5.0
      onTimeDelivery: Math.floor(Math.random() * 30) + 70, // 70-100%
      qualityScore: Math.floor(Math.random() * 25) + 75, // 75-100%
      certificationStatus: vendor.vendorCertificationStatus,
      lastUpdated: new Date().toISOString()
    }));
  };

  const getPerformanceColor = (score: number, threshold: { good: number; average: number }) => {
    if (score >= threshold.good) return 'success';
    if (score >= threshold.average) return 'warning';
    return 'error';
  };

  const getRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={i} sx={{ color: '#ffd700', fontSize: 16 }} />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarIcon key="half" sx={{ color: '#ffd700', fontSize: 16, opacity: 0.5 }} />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarIcon key={`empty-${i}`} sx={{ color: '#e0e0e0', fontSize: 16 }} />);
    }
    
    return stars;
  };

  const filteredPerformanceData = filterType === 'all' 
    ? performanceData 
    : performanceData.filter(vendor => vendor.vendorType === filterType);

  const overallStats = {
    totalVendors: performanceData.length,
    averageUtilization: Math.round(performanceData.reduce((sum, v) => sum + v.utilizationRate, 0) / performanceData.length),
    averageRating: Math.round(performanceData.reduce((sum, v) => sum + v.averageRating, 0) / performanceData.length * 10) / 10,
    validCertifications: performanceData.filter(v => v.certificationStatus === 'VALID').length
  };

  if (loading) {
    return <Typography>Loading vendor performance data...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Vendor Performance Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Overall Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <AssessmentIcon color="primary" />
                <Typography variant="h6">Total Vendors</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {overallStats.totalVendors}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <TrendingUpIcon color="success" />
                <Typography variant="h6">Avg Utilization</Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                {overallStats.averageUtilization}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <StarIcon color="warning" />
                <Typography variant="h6">Avg Rating</Typography>
              </Box>
              <Typography variant="h4" color="warning.main">
                {overallStats.averageRating}/5.0
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <CheckCircleIcon color="success" />
                <Typography variant="h6">Valid Certs</Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                {overallStats.validCertifications}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter and Refresh Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Filter by Vendor Type</InputLabel>
                <Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  label="Filter by Vendor Type"
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
            <Grid item xs={12} md={8}>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={loadVendorPerformance}
                >
                  Refresh Data
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Performance Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Vendor Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Utilization</TableCell>
              <TableCell>Task Completion</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>On-Time Delivery</TableCell>
              <TableCell>Quality Score</TableCell>
              <TableCell>Certification</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPerformanceData.map((vendor) => (
              <TableRow key={vendor.vendorId}>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {vendor.vendorName}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Capacity: {vendor.totalCapacity} tonnes
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={vendor.vendorType.replace(/_/g, ' ')}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ width: '100%' }}>
                    <LinearProgress
                      variant="determinate"
                      value={vendor.utilizationRate}
                      color={getPerformanceColor(vendor.utilizationRate, { good: 80, average: 60 })}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption">
                      {vendor.utilizationRate}%
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {vendor.completedTasks}/{vendor.totalTasks}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    ({Math.round((vendor.completedTasks / vendor.totalTasks) * 100)}%)
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box display="flex">
                      {getRatingStars(vendor.averageRating)}
                    </Box>
                    <Typography variant="caption">
                      {vendor.averageRating}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={`${vendor.onTimeDelivery}%`}
                    color={getPerformanceColor(vendor.onTimeDelivery, { good: 90, average: 75 })}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={`${vendor.qualityScore}%`}
                    color={getPerformanceColor(vendor.qualityScore, { good: 90, average: 80 })}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={vendor.certificationStatus}
                    color={vendor.certificationStatus === 'VALID' ? 'success' : 'error'}
                    size="small"
                    icon={vendor.certificationStatus === 'VALID' ? <CheckCircleIcon /> : <WarningIcon />}
                  />
                </TableCell>
              </TableRow>
            ))}
            {filteredPerformanceData.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No vendor performance data found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default VendorPerformance;
