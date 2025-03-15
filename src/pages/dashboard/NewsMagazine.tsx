import * as React from 'react';
import { 
  DataGrid, 
  GridColDef, 
  GridToolbarContainer, 
  GridToolbarFilterButton, 
  GridToolbarDensitySelector, 
  GridToolbarExport,
  GridRowParams
} from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { SubscriptionDetails } from './SubscriptionDetails';


interface Subscription {
  id: number;
  memberCode: string;
  name: string;
  subscriptionPeriod: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Expired' | 'Approval Pending';
  paymentAmount?: number;
  paymentDate?: string;
  paymentMethod?: string;
  receiptUrl?: string;
}

const columns: GridColDef[] = [
  { field: 'memberCode', headerName: 'Member Code', flex: 1, resizable: false },
  { field: 'name', headerName: 'Name', flex: 1, resizable: false },
  { field: 'subscriptionPeriod', headerName: 'Subscription Period', flex: 1, resizable: false },
  { field: 'startDate', headerName: 'Start Date', flex: 1, resizable: false },
  { field: 'endDate', headerName: 'End Date', flex: 1, resizable: false },
  {
    field: 'status',
    headerName: 'Status',
    flex: 1,
    resizable: false,
    renderCell: (params) => (
      <Chip
        label={params.value}
        color={
          params.value === 'Active' 
            ? 'success' 
            : params.value === 'Approval Pending' 
              ? 'warning' 
              : 'error'
        }
        size="small"
      />
    ),
  },
];

const rows: Subscription[] = [
  { 
    id: 1, 
    memberCode: 'MC001', 
    name: 'John Doe', 
    subscriptionPeriod: '1 Year', 
    startDate: '2023-01-01', 
    endDate: '2023-12-31', 
    status: 'Active',
    paymentAmount: 100,
    paymentDate: '2023-01-01',
    paymentMethod: 'Credit Card'
  },
  { id: 2, memberCode: 'MC002', name: 'Jane Smith', subscriptionPeriod: '6 Months', startDate: '2023-06-01', endDate: '2023-11-30', status: 'Active' },
  { id: 3, memberCode: 'MC003', name: 'Bob Johnson', subscriptionPeriod: '1 Year', startDate: '2022-07-01', endDate: '2023-06-30', status: 'Expired' },
  { id: 4, memberCode: 'MC004', name: 'Alice Brown', subscriptionPeriod: '3 Months', startDate: '2023-05-01', endDate: '2023-07-31', status: 'Active' },
  { id: 5, memberCode: 'MC005', name: 'Charlie Wilson', subscriptionPeriod: '1 Year', startDate: '2023-03-01', endDate: '2024-02-29', status: 'Active' },
  { 
    id: 6, 
    memberCode: 'MC006', 
    name: 'David Lee', 
    subscriptionPeriod: '1 Year', 
    startDate: 'Pending', 
    endDate: 'Pending', 
    status: 'Approval Pending',
    paymentAmount: 100,
    paymentDate: '2024-03-15',
    paymentMethod: 'Bank Transfer',
    receiptUrl: 'https://example.com/receipt.pdf'
  }
];

const NewsMagazine: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedSubscription, setSelectedSubscription] = React.useState<Subscription | null>(null);

  const filteredRows = rows.filter(row =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.memberCode.toLowerCase().includes(searchTerm.toLowerCase())||
    row.subscriptionPeriod.toLowerCase().includes(searchTerm.toLowerCase())||
    row.startDate.toLowerCase().includes(searchTerm.toLowerCase())||
    row.endDate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (params: GridRowParams) => {
    setSelectedSubscription(params.row as Subscription);
  };

  const handleBack = () => {
    setSelectedSubscription(null);
  };

  const handleApprove = (subscriptionId: number) => {
    // In a real application, you would make an API call here
    const subscription = rows.find(row => row.id === subscriptionId);
    if (subscription) {
      subscription.status = 'Active';
      subscription.startDate = new Date().toISOString().split('T')[0];
      subscription.endDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0];
      setSelectedSubscription({ ...subscription });
    }
  };

  const handleDeny = (subscriptionId: number) => {
    // In a real application, you would make an API call here
    const subscription = rows.find(row => row.id === subscriptionId);
    if (subscription) {
      subscription.status = 'Expired';
      setSelectedSubscription({ ...subscription });
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {selectedSubscription ? (
        <SubscriptionDetails 
          subscription={selectedSubscription} 
          onBack={handleBack}
          onApprove={handleApprove}
          onDeny={handleDeny}
        />
      ) : (
        <Paper sx={{ /* ... (keep existing Paper styles) */ }}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '5' }}>
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: '250px' }}
            />
          </Box>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            onRowClick={handleRowClick}
            // ... (keep existing DataGrid props)
          />
        </Paper>
      )}
    </Box>
  );
};

export default NewsMagazine;
