import * as React from 'react';
import { 
  DataGrid, 
  GridColDef, 
  GridToolbarContainer, 
  GridToolbarFilterButton, 
  GridToolbarExport,
  GridRowParams
} from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import AppConfig from '../../AppConfig';

interface AidRequest {
  requestId: string;
  fullName: string;
  aidType: string;
  createdOn: string;
  processStatus: string;
  description: string;
  userId: string;
}

const columns: GridColDef[] = [
  { field: 'requestId', headerName: 'Request ID', flex: 1, resizable: false },
  { field: 'fullName', headerName: 'Applicant Name', flex: 1, resizable: false },
  { field: 'aidType', headerName: 'Type of Aid', flex: 2, resizable: false },
  { 
    field: 'createdOn', 
    headerName: 'Date Submitted', 
    flex: 1, 
    resizable: false
    // valueFormatter: (params: { value: string }) => {
    //   if (!params.value) return 'Invalid Date';
      
    //   // Try parsing different date formats
    //   const possibleDate = new Date(params.value);
    //   if (!isNaN(possibleDate.getTime())) {
    //     return possibleDate.toLocaleDateString('en-US', {
    //       year: 'numeric',
    //       month: 'short',
    //       day: 'numeric'
    //     });
    //   }

    //   // If still invalid, try parsing as ISO string
    //   const isoDate = new Date(params.value + 'Z');  // Append Z to handle UTC
    //   if (!isNaN(isoDate.getTime())) {
    //     return isoDate.toLocaleDateString('en-US', {
    //       year: 'numeric',
    //       month: 'short',
    //       day: 'numeric'
    //     });
    //   }

    //   return 'Invalid Date';
    // }
  },
  { 
    field: 'processStatus', 
    headerName: 'Status', 
    flex: 1,
    resizable: false,
    renderCell: (params) => (
      <Box
        sx={{
          backgroundColor: getStatusColor(params.value),
          color: getStatusTextColor(params.value),
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '0.875rem',
          fontWeight: 500,
          width: 'auto',
          minWidth: '80px',
          textAlign: 'center',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '24px'
        }}
      >
        {params.value}
      </Box>
    ),
  },
];

interface DataTableProps {
  onRowClick: (requestId: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'under review':
      return '#4CAF50'; // Light green for Under Review
    case 'sent':
      return '#2E7D32'; // Dark green for Sent
    case 'denied':
      return '#FFA500'; // Orange for Denied
    case 'on hold':
      return '#FFA500'; // Orange for On Hold
    default:
      return '#FFA500'; // Default orange
  }
};

const getStatusTextColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'under review':
    case 'sent':
      return '#FFFFFF'; // White text for green backgrounds
    default:
      return '#000000'; // Black text for orange background
  }
};

export default function DataTable({ onRowClick }: DataTableProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [rows, setRows] = React.useState<AidRequest[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch data
  React.useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(`${AppConfig.API_BASE_URL}/Aid/GetAllBasicAidRequests`);
        const data = await response.json();
        // Extract the first array from ResponseData
        const aidRequests = data.ResponseData[0].map((item: any) => ({
          requestId: item.RequestID,
          fullName: item.FullName,
          aidType: item.AidType,
          createdOn:new Date(item.CreatedOn).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          processStatus: item.ProcessStatus,
          description: item.Description,
          userId: item.UserId
        }));
        setRows(aidRequests);
      } catch (error) {
        console.error('Failed to fetch requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleDelete = async (requestId: string) => {
    try {
      await fetch(`${AppConfig.API_BASE_URL}/Aid/CancelAidRequest?requestId=${requestId}`, {
        method: 'POST',
      });
      // Refresh the data after deletion
      const updatedRows = rows.filter(row => row.requestId !== requestId);
      setRows(updatedRows);
    } catch (error) {
      console.error('Failed to delete request:', error);
    }
  };

  const filteredRows = Array.isArray(rows) 
    ? rows.filter(row =>
        row.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.aidType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.processStatus.toLowerCase().includes(searchTerm.toLowerCase())||
        row.createdOn.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleRowClick = (params: GridRowParams) => {
    onRowClick(params.row.requestId);
  };

  return (
    <Paper
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: '100%',
        width: '100%',
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
        getRowId={(row) => `${row.requestId}_${row.createdOn}`}
        onRowClick={handleRowClick}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        pageSizeOptions={[10, 25, 50]}
        disableColumnMenu
        disableColumnSelector
        slots={{
         // toolbar: CustomToolbar,
        }}
        sx={{
          border: 0,
          flexGrow: 1,
          width: '100%',
          '& .MuiDataGrid-main': { overflow: 'hidden' },
          '& .MuiDataGrid-virtualScroller': { overflow: 'auto' },
          '& .MuiDataGrid-cell, & .MuiDataGrid-columnHeader': {
            whiteSpace: 'normal',
            wordWrap: 'break-word',
          },
          '& .MuiDataGrid-row, & .MuiDataGrid-columnHeaders': {
            maxWidth: '100%',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#e6f2ff',
            borderBottom: 'none',
          },
          '& .MuiDataGrid-row': {
            cursor: 'pointer',
          },
        }}
      />
    </Paper>
  );
}
