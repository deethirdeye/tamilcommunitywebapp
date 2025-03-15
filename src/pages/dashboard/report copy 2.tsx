import * as React from 'react';
import { 
  DataGrid, 
  GridColDef, 
  GridRowParams, 
  GridToolbarContainer, 
  GridToolbarFilterButton, 
  GridToolbarDensitySelector, 
  GridToolbarExport 
} from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import AppConfig from '../../AppConfig';
import AidViewReport from './AidViewReport';

interface AidRequest {
  requestId: string;
  fullName: string;
  aidType: string;
  createdOn: string;
  processStatus: string;
  description: string;
  userId: string;
  createdOnDisplay: string;
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
  },
  { 
    field: 'processStatus', 
    headerName: 'Status', 
    flex: 1,
    resizable: false,
    renderCell: (params) => (
      <Chip 
        label={params.value} 
        color={params.value === 'Completed' ? 'success' : 'error'} 
      />
    ),
  },
];

export default function Report() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [rows, setRows] = React.useState<AidRequest[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedRequestId, setSelectedRequestId] = React.useState<string | null>(null);
  const [startDate, setStartDate] = React.useState(null);
const [endDate, setEndDate] = React.useState(null);
  const fetchRequests = async () => {
    try {
      const response = await fetch(`${AppConfig.API_BASE_URL}/Aid/GetAllBasicAidRequests`);
      const data = await response.json();
      
      if (data.ResponseData && data.ResponseData[0]) {
        const filteredRequests = data.ResponseData[0]
          .filter((item: any) => 
            item.ProcessStatus === 'Completed' || item.ProcessStatus === 'Denied' || item.ProcessStatus === 'Cancelled'
          )
          .map((item: any) => ({
            requestId: item.RequestID,
            fullName: item.FullName,
            aidType: item.AidType,
            createdOn: new Date(item.CreatedOn), // Store as Date object
            createdOnDisplay: new Date(item.CreatedOn).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }), // Store formatted string for display
            processStatus: item.ProcessStatus,
            description: item.Description,
            userId: item.UserId
          }));
        setRows(filteredRequests);
      }
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRows = rows.filter(row =>
    (row.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.requestId.toLowerCase().includes(searchTerm))||
    row.aidType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.processStatus.toLowerCase().includes(searchTerm.toLowerCase())|| 
    row.createdOnDisplay.toLowerCase().includes(searchTerm.toLowerCase())

    
  );

  const handleRowClick = (params: GridRowParams) => {
    setSelectedRequestId(params.row.requestId);
  };

  if (selectedRequestId) {
    return <AidViewReport requestId={selectedRequestId} onBack={() => {
      setSelectedRequestId(null);
      fetchRequests(); // Refresh data on back
    }} />;
  }

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
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
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
        getRowId={(row) => row.requestId}
        onRowClick={handleRowClick}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        pageSizeOptions={[10, 25, 50]}
        disableColumnMenu
        disableColumnSelector
        slots={{
          toolbar: GridToolbarContainer,
        }}
        slotProps={{
          toolbar: {
            sx: { justifyContent: 'flex-end' },
            children: (
              <>
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <GridToolbarExport
            printOptions={{ disableToolbarButton: true }} csvOptions={{
              fileName: 'Reports',
              utf8WithBom: true, // Ensure UTF-8 encoding with BOM
            }}// Disable the print option here
          />
              </>
            ),
          },
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
