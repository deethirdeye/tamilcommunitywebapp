import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import { AppProvider, type Navigation } from '@toolpad/core/AppProvider';

import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import DataTable from '../recentrequests/datatable'; // Adjust the path as necessary
import StatsOverview from '../../components/StatsOverview'; 
import Report from './report';
import AppBar from '@mui/material/AppBar'; // Import AppBar
import Toolbar from '@mui/material/Toolbar'; 
import RequestAidComplaint from './requestaidcomplaint'; 
import RequestPageIcon from '@mui/icons-material/RequestPage';
import GroupIcon from '@mui/icons-material/Group';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import PolicyIcon from '@mui/icons-material/Policy';
import Members from './members';
import AdminUser from './adminuser';
import RolesAndPermission from './rolesandpermission';
import AidView from '../recentrequests/AidView';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField, Grid, Paper, Button } from '@mui/material';
import { subDays } from 'date-fns'; // Make sure to install date-fns if not already installed
import NonMembers from './NonMembers';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ListItemIcon from '@mui/material/ListItemIcon';
import EditIcon from '@mui/icons-material/Edit';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useNavigate } from 'react-router-dom';
import NewsMagazine from './NewsMagazine';
import { DataGrid } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';
import { SubscriptionDetails } from './SubscriptionDetails';
import CircularProgress from '@mui/material/CircularProgress';
import AppConfig from '../../AppConfig';
import ImageConfig from '../../ImageConfig';
//import { rows } from './NewsMagazine';

const SIDEBAR_WIDTH = 200;
const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'requestaidcomplaints',
    title: 'Grievances',
    icon: <RequestPageIcon />,
  },
  
        {
            segment: 'tamilcommunitymembers',
            title: 'Tamil Community Members',
            icon: <GroupIcon />,
        },
        {
            segment: 'nonmember',
            title: 'Non Members',
            icon: <GroupIcon />,
        },
  
  {
    segment: 'newsmagazine',
    title: 'News and Magazine (Pending)',
    icon: <DescriptionIcon />,
  },
  {
    segment: 'report',
    title: 'Report',
    icon: <AssessmentIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Admin',
  },

  
      {
        segment: 'users',
        title: 'Users',
        icon: <ContactPageIcon />,
      },
      // Need to worked on 15/10/2021
      // {
      //   segment: 'rolesandpermissions',
      //   title: 'Roles and Permissions (Pending)',
      //   icon: <PolicyIcon />,
      // },
    ]
  
  


const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

// Add these interfaces at the top
interface AidRequest {
  AidType: string;
  ProcessStatus: string;
  CreatedOn: string;
  RequestID: string;
  FullName: string;
}

interface AidTypeData {
  name: string;
  count: number;
}

interface RequestStatusData {
  date: string;
  underReview: number;
  onHold: number;
  sent: number;
  denied: number;
  completed: number;
  averageDaysLapsed: number;
}

// Add this interface with the properties you need
interface DashboardSubscription {
  id: number;
  memberCode: string;
  name: string;
  subscriptionPeriod: string;
  paymentAmount: number;
  paymentDate: string;
  status: string;
  startDate?: string;
  endDate?: string;
}

// Add this mock data near the top of the file, before the component definitions
const mockPendingSubscriptions: DashboardSubscription[] = [
  {
    id: 1,
    memberCode: 'M001',
    name: 'John Doe',
    subscriptionPeriod: '1 Year',
    paymentAmount: 100,
    paymentDate: '2024-03-15',
    status: 'Pending'
  },
  // Add more mock data as needed
];

// Add this mock data near the top of the file, with the other mock data
const mockSubscriptionData = [
  { name: '1 Year', count: 45 },
  { name: '2 Years', count: 30 },
  { name: '3 Years', count: 25 }
];

const mockSubscriptionStatusData = [
  { name: 'Active', count: 150 },
  { name: 'Expired', count: 30 },
  { name: 'Pending', count: 20 }
];

const mockMonthlySubscriptions = [
  { month: 'Jan', new: 20, renewed: 15 },
  { month: 'Feb', new: 25, renewed: 18 },
  { month: 'Mar', new: 30, renewed: 22 }
];

function UserMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditProfile = () => {
    setOpenEditDialog(true);
    handleClose();
  };

  const handleLogout = () => {
    // Add any logout logic here (e.g., clearing tokens or state)
    navigate('/login');
    handleClose();
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setPassword('');
    setConfirmPassword('');
  };

  const handleOpenPasswordDialog = () => {
    setOpenPasswordDialog(true);
    setOpenEditDialog(false);
  };

  const handleClosePasswordDialog = () => {
    setOpenPasswordDialog(false);
    setPassword('');
    setConfirmPassword('');
  };

  const handleUpdatePassword = () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    setOpenConfirmDialog(true);
  };

  const handleConfirmUpdate = () => {
    // Add logic to update the password
    setOpenConfirmDialog(false);
    handleClosePasswordDialog();
    // Optionally, show a success message
    alert("Password updated successfully");
  };

  const handleCancelUpdate = () => {
    setOpenConfirmDialog(false);
  };




  

  return (
    <>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
        sx={{ width: 48, height: 48 }}
      >
        <AccountCircle sx={{ fontSize: 32 }} />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {/* <MenuItem onClick={handleEditProfile}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit Profile
        </MenuItem> */}
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <ExitToAppIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      <Dialog 
        open={openEditDialog} 
        onClose={handleCloseEditDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Name"
              defaultValue="John Doe"
              InputProps={{ readOnly: true }}
              variant="filled"
              fullWidth
            />
            <TextField
              label="Email"
              defaultValue="john.doe@example.com"
              InputProps={{ readOnly: true }}
              variant="filled"
              fullWidth
            />
            <TextField
              label="Mobile"
              defaultValue="+1234567890"
              InputProps={{ readOnly: true }}
              variant="filled"
              fullWidth
            />
            <TextField
              label="User ID"
              defaultValue="JD001"
              InputProps={{ readOnly: true }}
              variant="filled"
              fullWidth
            />
            <TextField
              label="Role"
              defaultValue="Admin"
              InputProps={{ readOnly: true }}
              variant="filled"
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleOpenPasswordDialog} color="primary">
            Update Password
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={openPasswordDialog} 
        onClose={handleClosePasswordDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Update Password</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Email"
              defaultValue="john.doe@example.com"
              InputProps={{ readOnly: true }}
              variant="filled"
              fullWidth
            />
            <TextField
              label="Mobile"
              defaultValue="+1234567890"
              InputProps={{ readOnly: true }}
              variant="filled"
              fullWidth
            />
            <TextField
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
            />
            <TextField
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePasswordDialog}>Cancel</Button>
          <Button onClick={handleUpdatePassword} variant="contained" color="primary">
            Update Password
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openConfirmDialog}
        onClose={handleCancelUpdate}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Confirm Password Update</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to update your password?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelUpdate}>Cancel</Button>
          <Button onClick={handleConfirmUpdate} variant="contained" color="primary">
            Confirm Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function DemoPageContent({ pathname }: { pathname: string }) {
  // Add these states
  const [aidTypeData, setAidTypeData] = useState<AidTypeData[]>([]);
  const [requestStatusData, setRequestStatusData] = useState<RequestStatusData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubscription, setSelectedSubscription] = React.useState<DashboardSubscription | null>(null);
  const [selectedAidRequest, setSelectedAidRequest] = React.useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [filteredRequestStatusData, setFilteredRequestStatusData] = useState<RequestStatusData[]>([]);
  useEffect(() => {
    setFilteredRequestStatusData(requestStatusData);
  }, [requestStatusData]);
  useEffect(() => {
    if (startDate && endDate) {
      const filteredData = requestStatusData.filter((item) => {
        const itemDate = new Date(item.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return itemDate >= start && itemDate <= end;
      });
      setFilteredRequestStatusData(filteredData);
    } else {
      setFilteredRequestStatusData(requestStatusData);
    }
  }, [startDate, endDate, requestStatusData]);
  // Add this useEffect to fetch and process the data

  const validateDates = (start: string, end: string): boolean => {
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
  
    // Check if start date is not more than the current date
    if (start > currentDate) {
      alert("Start date cannot be more than the current date.");
      return false;
    }
  
    // Check if end date is not less than the start date
    if (end < start) {
      alert("End date cannot be less than the start date.");
      return false;
    }
  
    return true;
  }; 
  
  useEffect(() => {
    const fetchAidData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${AppConfig.API_BASE_URL}/Aid/GetAllBasicAidRequests`);
        const data = await response.json();
        
        if (data.ResponseData && data.ResponseData[0]) {
          const requests: AidRequest[] = data.ResponseData[0];

          // Process Aid Type Data
          const aidTypeCounts = requests.reduce((acc: { [key: string]: number }, request) => {
            const type = request.AidType.charAt(0).toUpperCase() + request.AidType.slice(1);
            acc[type] = (acc[type] || 0) + 1;
            return acc;
          }, {});

          const processedAidTypeData = Object.entries(aidTypeCounts).map(([name, count]) => ({
            name,
            count
          }));

          // Process Request Status Data
          const groupedByDate = requests.reduce((acc: { [key: string]: any }, request) => {
            const date = new Date(request.CreatedOn).toLocaleDateString();
            if (!acc[date]) {
              acc[date] = {
                date,
                underReview: 0,
                onHold: 0,
                sent: 0,
                denied: 0,
                completed: 0,
                totalDaysLapsed: 0,
                requestCount: 0
              };
            }

            // Count status
            switch (request.ProcessStatus) {
              case 'Under Review':
                acc[date].underReview++;
                break;
              case 'On Hold':
                acc[date].onHold++;
                break;
              case 'Sent':
                acc[date].sent++;
                break;
              case 'Denied':
                acc[date].denied++;
                break;
              case 'Completed':
                acc[date].completed++;
                break;
            }

            // Calculate days lapsed
            const daysLapsed = Math.floor((new Date().getTime() - new Date(request.CreatedOn).getTime()) / (1000 * 3600 * 24));
            acc[date].totalDaysLapsed += daysLapsed;
            acc[date].requestCount++;

            return acc;
          }, {});

          const processedStatusData = Object.values(groupedByDate).map((item: any) => ({
            ...item,
            averageDaysLapsed: Math.round(item.totalDaysLapsed / item.requestCount)
          }));

          setAidTypeData(processedAidTypeData);
          setRequestStatusData(processedStatusData);
        }
      } catch (error) {
        console.error('Error fetching aid data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (pathname === '/dashboard') {
      fetchAidData();
    }
  }, [pathname]);

  // Add handlers for subscription
  const handleSubscriptionRowClick = (params: any) => {
    const subscription = mockPendingSubscriptions.find(sub => sub.id === params.id);
    if (subscription) {
      setSelectedSubscription(subscription);
    }
  };

  const handleSubscriptionBack = () => {
    setSelectedSubscription(null);
  };

  const handleSubscriptionApprove = (id: number) => {
    // In a real application, you would make an API call here
    const updatedSubscriptions = mockPendingSubscriptions.map(sub => {
      if (sub.id === id) {
        return {
          ...sub,
          status: 'Active',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        };
      }
      return sub;
    });
    // Update the subscription list
    // In a real app, this would be handled by your state management solution
    setSelectedSubscription(null);
  };

  const handleSubscriptionDeny = (id: number) => {
    // In a real application, you would make an API call here
    const updatedSubscriptions = mockPendingSubscriptions.map(sub => {
      if (sub.id === id) {
        return {
          ...sub,
          status: 'Expired',
        };
      }
      return sub;
    });
    // Update the subscription list
    // In a real app, this would be handled by your state management solution
    setSelectedSubscription(null);
  };

  const handleRowClick = (requestId: string) => {
    setSelectedAidRequest(requestId);
  };

  const handleBack = () => {
    setSelectedAidRequest(null);
  };

  // Filter function for recent requests
  const filterRecentRequests = (rows: any[]): any[] => {
    const fifteenDaysAgo = subDays(new Date(), 15);
    return rows.filter((row: any) => new Date(row.dateSubmitted) >= fifteenDaysAgo);
  };
  const maxLabelLength = Math.max(...aidTypeData.map(item => item.name.length));

  // Dynamically set the X-axis height based on the maximum label length
  const xAxisHeight = Math.max(30, maxLabelLength * 6 + 50);
  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Box component="main" sx={{ flexGrow: 1, display: 'flex', 
        flexDirection: 'column', width: 200, marginLeft: 2, overflow: 'auto', padding: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <UserMenu />
        </Box>
        {pathname === '/dashboard' && (
          <Box sx={{ p: 2 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
              Dashboard
            </Typography>
            <StatsOverview />
            
            {/* Existing Aid Type and Pending Requests charts */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                {/* <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>Type of Aid</Typography>
                  {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={aidTypeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#8884d8" name="Number of Requests" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </Paper> */}
                
                <Paper sx={{ p: 2 }}>
  <Typography variant="h6" gutterBottom>Type of Aid</Typography>
  {isLoading ? (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
      <CircularProgress />
    </Box>
  ) : (
    <ResponsiveContainer width="100%" height={380}>
      <BarChart data={aidTypeData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          angle={-45} // Rotate labels by -45 degrees for better readability
          textAnchor="end" // Align the text to the end of the tick
          interval={0} // Ensure all labels are displayed
          dy={10} // Adjust vertical position for better alignment
          height={xAxisHeight} // Increase height to accommodate rotated labels
        />
        <YAxis />
        <Tooltip />
        <Legend 
          verticalAlign="top" // Position the legend at the top
           // Align the legend to the right
        />
        <Bar dataKey="count" fill="#8884d8" name="Number of Requests" />
      </BarChart>
    </ResponsiveContainer>
  )}
</Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>Request Status Overview</Typography>
                  {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <>
                      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <TextField
                          label="Start Date"
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                        />
                        <TextField
                          label="End Date"
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                        />
                      </Box>
                      <ResponsiveContainer width="100%" height={300}>
  <BarChart data={filteredRequestStatusData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis yAxisId="left" orientation="left" />
    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
    <Tooltip />
    <Legend />
    <Bar yAxisId="left" dataKey="underReview" fill="#ffc658" name="Under Review" />
    <Bar yAxisId="left" dataKey="onHold" fill="#ff9800" name="On Hold" />
    <Bar yAxisId="left" dataKey="sent" fill="#9c27b0" name="Yet to Start Review" />
    <Bar yAxisId="left" dataKey="denied" fill="#f44336" name="Denied" />
    <Bar yAxisId="left" dataKey="completed" fill="#4caf50" name="Completed" />
    <Bar yAxisId="right" dataKey="averageDaysLapsed" fill="#82ca9d" name="Avg Days Lapsed" />
  </BarChart>
</ResponsiveContainer>
                    </>
                  )}
                </Paper>
              </Grid>
            </Grid>

            {/* New News & Magazine Section */}
            <Typography variant="h5" sx={{ mb: 2, mt: 4 }}>
              News & Magazine Overview
            </Typography>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              {/* Subscription Period Distribution */}
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>Subscription Period Distribution</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={mockSubscriptionData}
                        dataKey="count"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label
                      >
                        {mockSubscriptionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#8884d8', '#82ca9d', '#ffc658'][index]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>

              {/* Subscription Status */}
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>Subscription Status</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={mockSubscriptionStatusData}
                        dataKey="count"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label
                      >
                        {mockSubscriptionStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#4caf50', '#f44336', '#ff9800'][index]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>

              {/* Monthly Subscription Trends */}
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>Monthly Subscription Trends</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockMonthlySubscriptions}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="new" fill="#8884d8" name="New Subscriptions" />
                      <Bar dataKey="renewed" fill="#82ca9d" name="Renewals" />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>

            {/* Pending Subscriptions Table */}
            <Typography variant="h6" sx={{ mb: 2 }}>
              Pending Subscription Approvals
            </Typography>
            <Paper sx={{ mb: 3 }}>
              <Box sx={{ height: '400px' }}>
                {selectedSubscription ? (
                  <SubscriptionDetails 
                    subscription={{
                      ...selectedSubscription,
                      startDate: selectedSubscription.startDate || '',
                      endDate: selectedSubscription.endDate || '',
                      paymentAmount: selectedSubscription.paymentAmount || 0,
                      paymentDate: selectedSubscription.paymentDate || ''
                   
                    }}
                    onBack={handleSubscriptionBack}
                    onApprove={handleSubscriptionApprove}
                    onDeny={handleSubscriptionDeny}
                  />
                ) : (
                  <DataGrid
                    rows={mockPendingSubscriptions}
                    columns={[
                      { field: 'memberCode', headerName: 'Member Code', flex: 1 },
                      { field: 'name', headerName: 'Name', flex: 1 },
                      { field: 'subscriptionPeriod', headerName: 'Period', flex: 1 },
                      { 
                        field: 'paymentAmount', 
                        headerName: 'Amount', 
                        flex: 1,
                        //valueFormatter: (params) => `$${params.value}`
                      },
                      { field: 'paymentDate', headerName: 'Payment Date', flex: 1 },
                      {
                        field: 'status',
                        headerName: 'Status',
                        flex: 1,
                        renderCell: (params) => (
                          <Chip
                            label={params.value}
                            color="warning"
                            size="small"
                          />
                        ),
                      },
                    ]}
                    onRowClick={handleSubscriptionRowClick}
                    pageSizeOptions={[5]}
                    disableColumnMenu
                    disableColumnSelector
                    disableRowSelectionOnClick
                    sx={{
                      '& .MuiDataGrid-cell': {
                        borderBottom: '1px solid #e0e0e0',
                      },
                    }}
                  />
                )}
              </Box>
            </Paper>

            {/* Existing Recent Requests section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Recent Requests
              </Typography>
              <Box sx={{ height: '400px' }}> {/* Adjust height as needed */}
                {selectedAidRequest ? (
                  <AidView requestId={selectedAidRequest} onBack={handleBack} />
                ) : (
                  <DataTable onRowClick={handleRowClick} />
                )}
              </Box>
            </Box>
          </Box>
        )}
        {pathname === '/requestaidcomplaints' && (
          <>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
              Grievances
            </Typography>   
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', mt: 2 }}>
              <RequestAidComplaint onRowClick={handleRowClick} />
            </Box>
          </>
        )}
        {pathname === '/tamilcommunitymembers' && (
          <>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
              Tamil Community Members
            </Typography>
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', mt: 2 }}>
              <Members />
            </Box>
          </>
        )}
         {pathname === '/newsmagazine' && (
            <>
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
                News and Magazine
              </Typography>
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', mt: 2 }}>
                <NewsMagazine />
              </Box>
            </>
          )}
           {pathname === '/report' && (
            <>
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
                Report
              </Typography>
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', mt: 2 }}>
                <Report />
              </Box>
            </>
          )}
           {pathname === '/users' && (
            <>
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
                Admin Users
              </Typography>
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', mt: 2 }}>
                <AdminUser />
              </Box>
            </>
          )}
           {pathname === '/rolesandpermissions' && (
            <>
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
                Roles & Permissions
              </Typography>
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', mt: 2 }}>
                <RolesAndPermission />
              </Box>
            </>
          )}
        {pathname === '/nonmember' && (
          <>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
              Non Members
            </Typography>
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', mt: 2 }}>
              <NonMembers />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

interface DemoProps {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window?: () => Window;
}

const DashboardLayoutBasic = (props: DemoProps) => {
  const { window } = props;
  const router = useDemoRouter('/dashboard');
  const demoWindow = window !== undefined ? window() : undefined;
  const navigate = useNavigate();

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
      branding={{
        logo: "",
        title: '',
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100vh', 
          overflow: 'hidden'
        }}
      >
        {/* Top Banner */}
        <Box 
          sx={{ 
            backgroundImage: `url("${ImageConfig.IMAGE_BASE_URL}images/LoginBG.PNG")`, // Background image for the banner
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '75px', // Adjust height as needed
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              color: '#FFFFFF', // White text for contrast
              fontFamily: 'Arial, sans-serif', // Font matching the login page
              fontWeight: 'bold' // Bold font
            }}
          >
            Tamil Community Admin Portal
          </Typography>
        </Box>

        <DashboardLayout defaultSidebarCollapsed
          toolbarItems={<UserMenu />}
        >
          <DemoPageContent pathname={router.pathname} />
        </DashboardLayout>
      </Box>
    </AppProvider>
  );
};

export default DashboardLayoutBasic;
