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
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';
import { NonMemberDetails } from './NonMemberDetails';
import { AddNonMember } from './AddNonMember';
import AppConfig from '../../AppConfig';
// import { AddNonMember } from './AddNonMember';

// Add interface for the API response
interface NonMemberData {
  FullName: string;
  Email: string;
  MobileNumber: string;
  EmergencyContactPersonName: string;
  EmergencyContactNumber: string;
  SomeoneUserCode: string;
  UserId: number;
  Addedbymembercode: string;
}

interface ApiResponse {
  ResponseCode: number;
  Message: string;
  ErrorDesc: string;
  ResponseData: NonMemberData[][];
}

// Add this interface near your other interfaces
interface NonMember {
  userCode: string;
  name: string;
  email: string;
  mobileNumber: string;
  emergencyContactPersonName: string;
  emergencyContactPersonMobile: string;
  addedByMemberCode: string;
}

const columns: GridColDef[] = [
  { field: 'userCode', headerName: 'Non Member User Code', flex: 1, resizable: false },
  { field: 'name', headerName: 'Name', flex: 1, resizable: false },
  { field: 'email', headerName: 'Email', flex: 1, resizable: false },
  { field: 'mobileNumber', headerName: 'Mobile Number', flex: 1, resizable: false },
  { field: 'addedByMemberCode', headerName: 'Added by Member Code', flex: 1, resizable: false },
];

interface NonMembersProps {
  userCode?: string;
  onBack?: () => void;
}

const NonMembers: React.FC<NonMembersProps> = ({ userCode, onBack }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedNonMember, setSelectedNonMember] = React.useState<NonMember | null>(null);
  const [isAddingNonMember, setIsAddingNonMember] = React.useState(false);
  const [rows, setRows] = React.useState<any[]>([]);

  const fetchNonMembers = async () => {
    try {
      const response = await fetch(`${AppConfig.API_BASE_URL}/NonMember/GetNonMeberDetails`);
      const data: ApiResponse = await response.json();
      
      if (data.ResponseCode === 1 && data.ResponseData[0]) {
        const formattedRows = data.ResponseData[0].map((item, index) => ({
          id: index + 1,
          userCode: item.SomeoneUserCode,
          name: item.FullName,
          email: item.Email,
          mobileNumber: item.MobileNumber,
          emergencyContactPersonName: item.EmergencyContactPersonName,
          emergencyContactPersonMobile: item.EmergencyContactNumber,
          addedByMemberCode: item.Addedbymembercode
        }));
        setRows(formattedRows);
      }
    } catch (error) {
      console.error('Error fetching non-members:', error);
    }
  };

  React.useEffect(() => {
    fetchNonMembers();
  }, []);

  const filteredRows = rows.filter((row) =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.userCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.addedByMemberCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.mobileNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    
    row.emergencyContactPersonName.toLowerCase().includes(searchTerm.toLowerCase())|
    row.emergencyContactPersonMobile.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (params: GridRowParams) => {
    // Transform the row data to match NonMember interface
    const nonMember: NonMember = {
      userCode: params.row.userCode,
      name: params.row.name,
      email: params.row.email,
      mobileNumber: params.row.mobileNumber,
      emergencyContactPersonName: params.row.emergencyContactPersonName,
      emergencyContactPersonMobile: params.row.emergencyContactPersonMobile,
      addedByMemberCode: params.row.addedByMemberCode
    };
    setSelectedNonMember(nonMember);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setSelectedNonMember(null);
      setIsAddingNonMember(false);
    }
  };

  const handleAddNonMember = () => {
    setIsAddingNonMember(true);
  };

  const handleSaveNonMember = (newNonMember: any) => {
    // Here you would typically send the new non-member data to your backend
    // For now, we'll just add it to the rows array
    const newId = Math.max(...rows.map(r => r.id)) + 1;
    const newRow = {
      ...newNonMember,
      id: newId,
      userCode: `NM${new Date().getFullYear()}${String(newId).padStart(6, '0')}`,
      addedByMemberCode: 'Admin: Joe', // Replace 'Joe' with the actual admin name
    };
    rows.push(newRow);
    setIsAddingNonMember(false);
    setSelectedNonMember(newRow);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {isAddingNonMember ? (
        <AddNonMember onSave={handleSaveNonMember} onCancel={handleBack} />
      ) : selectedNonMember ? (
        <NonMemberDetails nonMember={selectedNonMember} onBack={handleBack} />
      ) : (
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
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: '250px' }}
            />
            <Box
              sx={{
                ml: 1,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#1976d2',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 'bold',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                const tooltip = document.createElement('div');
                tooltip.innerText = 'You can search by Non Member User Code, Name, Email, Mobile No., and Added by Member Code';
                tooltip.style.position = 'absolute';
                tooltip.style.backgroundColor = '#000';
                tooltip.style.color = '#fff';
                tooltip.style.padding = '5px';
                tooltip.style.borderRadius = '5px';
                tooltip.style.top = `${e.clientY + 10}px`;
                tooltip.style.left = `${e.clientX + 10}px`;
                tooltip.style.zIndex = '1000';
                tooltip.id = 'search-tooltip';
                document.body.appendChild(tooltip);
              }}
              onMouseLeave={() => {
                const tooltip = document.getElementById('search-tooltip');
                if (tooltip) {
                document.body.removeChild(tooltip);
                }
              }}
              >
              <i className="material-icons">i</i>
              </Box>
          </Box>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            onRowClick={handleRowClick}
            initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
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
            printOptions={{ disableToolbarButton: true }} // Disable the print option here
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
            }}
          />
        </Paper>
      )}
    </Box>
  );
};

const NonMembersPage = () => {
  return <NonMembers />;
};

export default NonMembersPage;
