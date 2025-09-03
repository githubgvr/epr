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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  Business as BusinessIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  Star as StarIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  LocalShipping as ShippingIcon,
  Recycling as RecyclingIcon,
  Assignment as AssignmentIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { Vendor } from '../../services/vendorService';

interface DashboardStats {
  totalVendors: number;
  activeVendors: number;
  validCertifications: number;
  expiredCertifications: number;
  averageCapacity: number;
  totalCapacity: number;
  averagePerformance: number;
  topPerformers: number;
}

interface RecentActivity {
  id: number;
  type: 'vendor_added' | 'certification_updated' | 'performance_review' | 'contract_signed';
  vendorName: string;
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'info';
}

const VendorDashboard: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalVendors: 0,
    activeVendors: 0,
    validCertifications: 0,
    expiredCertifications: 0,
    averageCapacity: 0,
    totalCapacity: 0,
    averagePerformance: 0,
    topPerformers: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load vendors
      const response = await fetch('http://localhost:8080/api/vendors');
      if (response.ok) {
        const vendorData = await response.json();
        setVendors(vendorData);
        
        // Calculate statistics
        const dashboardStats = calculateStats(vendorData);
        setStats(dashboardStats);
        
        // Generate recent activities
        const activities = generateRecentActivities(vendorData);
        setRecentActivities(activities);
        
        setError(null);
      } else {
        setError('Failed to load vendor data');
      }
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (vendors: Vendor[]): DashboardStats => {
    const totalVendors = vendors.length;
    const activeVendors = vendors.filter(v => v.isActive).length;
    const validCertifications = vendors.filter(v => v.vendorCertificationStatus === 'VALID').length;
    const expiredCertifications = vendors.filter(v => v.vendorCertificationStatus === 'EXPIRED').length;
    const totalCapacity = vendors.reduce((sum, v) => sum + (v.vendorCapacityTonnes || 0), 0);
    const averageCapacity = totalVendors > 0 ? totalCapacity / totalVendors : 0;
    
    // Mock performance data
    const averagePerformance = 85; // Mock average performance score
    const topPerformers = Math.floor(totalVendors * 0.3); // Top 30% performers

    return {
      totalVendors,
      activeVendors,
      validCertifications,
      expiredCertifications,
      averageCapacity,
      totalCapacity,
      averagePerformance,
      topPerformers
    };
  };

  const generateRecentActivities = (vendors: Vendor[]): RecentActivity[] => {
    const activities: RecentActivity[] = [];
    const activityTypes = ['vendor_added', 'certification_updated', 'performance_review', 'contract_signed'] as const;
    
    vendors.slice(0, 5).forEach((vendor, index) => {
      const type = activityTypes[index % activityTypes.length];
      let description = '';
      let status: 'success' | 'warning' | 'info' = 'info';
      
      switch (type) {
        case 'vendor_added':
          description = `New vendor registered with ${vendor.vendorCapacityTonnes} tonnes capacity`;
          status = 'success';
          break;
        case 'certification_updated':
          description = `Certification status updated to ${vendor.vendorCertificationStatus}`;
          status = vendor.vendorCertificationStatus === 'VALID' ? 'success' : 'warning';
          break;
        case 'performance_review':
          description = 'Monthly performance review completed';
          status = 'info';
          break;
        case 'contract_signed':
          description = 'New service contract signed';
          status = 'success';
          break;
      }
      
      activities.push({
        id: index + 1,
        type,
        vendorName: vendor.vendorName,
        description,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        status
      });
    });
    
    return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'vendor_added': return <BusinessIcon />;
      case 'certification_updated': return <CheckCircleIcon />;
      case 'performance_review': return <AssessmentIcon />;
      case 'contract_signed': return <AssignmentIcon />;
      default: return <ScheduleIcon />;
    }
  };

  const getStatusColor = (status: RecentActivity['status']) => {
    switch (status) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'default';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (loading) {
    return <Typography>Loading vendor dashboard...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Vendor Dashboard
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={loadDashboardData}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <BusinessIcon color="primary" />
                <Typography variant="h6">Total Vendors</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {stats.totalVendors}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {stats.activeVendors} active
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <CheckCircleIcon color="success" />
                <Typography variant="h6">Valid Certifications</Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                {stats.validCertifications}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {stats.expiredCertifications} expired
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <RecyclingIcon color="info" />
                <Typography variant="h6">Total Capacity</Typography>
              </Box>
              <Typography variant="h4" color="info.main">
                {stats.totalCapacity.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                tonnes per month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <TrendingUpIcon color="warning" />
                <Typography variant="h6">Avg Performance</Typography>
              </Box>
              <Typography variant="h4" color="warning.main">
                {stats.averagePerformance}%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {stats.topPerformers} top performers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Vendor Types Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Vendor Types Distribution
              </Typography>
              <Box sx={{ mt: 2 }}>
                {['RECYCLING', 'COLLECTION', 'PROCESSING', 'TRANSPORTATION'].map((type) => {
                  const count = vendors.filter(v => v.vendorType === type).length;
                  const percentage = stats.totalVendors > 0 ? (count / stats.totalVendors) * 100 : 0;
                  
                  return (
                    <Box key={type} sx={{ mb: 2 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2">
                          {type.replace(/_/g, ' ')}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {count} ({percentage.toFixed(1)}%)
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{ height: 8, borderRadius: 4, mt: 0.5 }}
                      />
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              <List>
                {recentActivities.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem>
                      <ListItemIcon>
                        <Chip
                          icon={getActivityIcon(activity.type)}
                          label=""
                          color={getStatusColor(activity.status)}
                          size="small"
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.vendorName}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="textSecondary">
                              {activity.description}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {formatTimeAgo(activity.timestamp)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentActivities.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VendorDashboard;
