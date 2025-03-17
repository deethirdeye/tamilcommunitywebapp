// import * as React from 'react';
// import { 
//   DataGrid, 
//   GridColDef, 
//   GridToolbarContainer, 
//   GridToolbarFilterButton, 
//   GridToolbarDensitySelector, 
//   GridToolbarExport,
//   GridRowParams
// } from '@mui/x-data-grid';
// import Paper from '@mui/material/Paper';
// import TextField from '@mui/material/TextField';
// import Box from '@mui/material/Box';
// import Chip from '@mui/material/Chip';
// import MemberDetails from './MemberDetails';
// import AddMember from './AddMember';
// import Button from '@mui/material/Button';
// import AddIcon from '@mui/icons-material/Add';
// import { useEffect, useState } from 'react';
// import  AppConfig from '../../AppConfig';
// import AddMemberDetails from './AddMemberDetails';

// interface Member {
//   mode?: string;
//   id: string;
//   userCode: string;
//   applicantName: string;
//   email: string;
//   mobileNo: string;
//   dob: string;
//   status: string;
//   details?: any;
// }



// export default function Members() {
//   const [searchTerm, setSearchTerm] = React.useState('');
//   const [rows, setRows] = React.useState<Member[]>([]);
//   const [isAddingMember, setIsAddingMember] = React.useState(false);
//   const [selectedMember, setSelectedMember] = useState<Member | null>(null);

//   const fetchMembers = async () => {
//     try {
//       const response = await fetch(`${AppConfig.API_BASE_URL}/Account/GetUserMaster`);
//       const data = await response.json();
      
//       if (data.ResponseCode === 1) {
//         const members = data.ResponseData[0].map((member: any) => ({
//           id: member.UserId,
//           userCode: member.UserCode,
//           applicantName: member.FullName,
//           email: member.Email,
//           mobileNo: member.MobileNumber,
//           dob: new Date(member.CreatedOn).toLocaleDateString(),
//           status: member.Status === 1 ? 'Active' : 'Removed'
//         }));
//         setRows(members);
//       }
//     } catch (error) {
//       console.error('Error fetching members:', error);
//     }
//   };



//   useEffect(() => {
//     fetchMembers();
//   }, []);
// const columns: GridColDef[] = [
//   { field: 'userCode', headerName: 'User Code', flex: 1, resizable: false },
//   { field: 'applicantName', headerName: 'Applicant Name', flex: 1, resizable: false },
//   { field: 'email', headerName: 'Email', flex: 1, resizable: false },
//   { field: 'mobileNo', headerName: 'Mobile No.', flex: 1, resizable: false },
//   // { field: 'dob', headerName: 'DOB', flex: 1, resizable: false },
//   {
//     field: 'status',
//     headerName: 'Status',
//     flex: 1,
//     resizable: false,
//     renderCell: (params) => (
//       <Chip
//         label={params.value}
//         color={params.value === 'Active' ? 'success' : 'error'}
//         size="small"
//       />
//     ),
//   }
// ];
//   const filteredRows = rows.filter(row =>
//     row.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     row.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     row.userCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     row.mobileNo.toLowerCase().includes(searchTerm.toLowerCase())||
//     row.status.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleRowClick = async (params: GridRowParams<Member>) => {
//     if (params.row) {
//       await handleViewDetails(params.row);
//     }
//   };

//   const handleBack = () => {
//     setSelectedMember(null);
//   };

//   const handleAddMember = () => {
//     setIsAddingMember(true);
//     handleRefresh();
//     fetchMembers();
//   };

//   const handleAddMemberBack = () => {
//     setIsAddingMember(false);
//     handleRefresh();
//     fetchMembers();
//   };

//   const handleViewDetails = async (member: Member) => {
//     try {
//       const response = await fetch(`${AppConfig.API_BASE_URL}/BasicDetails/GetByUserId/${member.id}`);
//       const data = await response.json();
      
//       if (data.ResponseCode === 1) {
//         setSelectedMember({
//           ...member,
//           mode: 'view',
//           details: data.ResponseData[0]
//         });
//       } else if (data.ResponseCode === 2 && data.Message === "User not found") {
//         setSelectedMember({
//           ...member,
//           mode: 'add'
//         });
//       } else {
//         throw new Error(data.Message || 'Failed to fetch member details');
//       }
//     } catch (error) {
//       console.error('Error fetching member details:', error);
//       alert('Error accessing member details');
//     }
//   };
//   const handleRefresh = () => {
//     fetchMembers(); // Re-fetch members to get the updated data
//   };
//   return (
//     <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
//       {isAddingMember ? (
//         <AddMember onBack={handleAddMemberBack} />
//       ) : selectedMember ? (
//         selectedMember.mode === 'add' ? (
//           <AddMemberDetails 
//             member={{ ...selectedMember, id: Number(selectedMember.id) }}
//             onBack={() => {
//               setSelectedMember(null);
//               handleRefresh();
//             }}
//             onSubmit={() => {
//               setSelectedMember(null);
//               handleRefresh();
//             }}
//           />
//         ) : (
//           <MemberDetails 
//             memberCode={selectedMember.userCode}
//             userId={selectedMember.id}
//             onBack={() => setSelectedMember(null)}
            
//           />
//         )
//       ) : (
//         <Paper
//           sx={{
//             flexGrow: 1,
//             display: 'flex',
//             flexDirection: 'column',
//             overflow: 'hidden',
//             height: '100%',
//             width: '100%',
//             boxShadow: 3,
//             borderRadius: 2,
//           }}
//         >
//             <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '5' }}>
//             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//               <TextField
//               label="Search"
//               variant="outlined"
//               size="small"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               sx={{ width: '250px' }}
//               />
//               <Box
//               sx={{
//                 ml: 1,
//                 cursor: 'pointer',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 width: '24px',
//                 height: '24px',
//                 borderRadius: '50%',
//                 backgroundColor: '#1976d2',
//                 color: '#fff',
//                 fontSize: '16px',
//                 fontWeight: 'bold',
//                 position: 'relative',
//               }}
//               onMouseEnter={(e) => {
//                 const tooltip = document.createElement('div');
//                 tooltip.innerText = 'You can search by User Code, Applicant Name, Email, Mobile No., and Status';
//                 tooltip.style.position = 'absolute';
//                 tooltip.style.backgroundColor = '#000';
//                 tooltip.style.color = '#fff';
//                 tooltip.style.padding = '5px';
//                 tooltip.style.borderRadius = '5px';
//                 tooltip.style.top = `${e.clientY + 10}px`;
//                 tooltip.style.left = `${e.clientX + 10}px`;
//                 tooltip.style.zIndex = '1000';
//                 tooltip.id = 'search-tooltip';
//                 document.body.appendChild(tooltip);
//               }}
//               onMouseLeave={() => {
//                 const tooltip = document.getElementById('search-tooltip');
//                 if (tooltip) {
//                 document.body.removeChild(tooltip);
//                 }
//               }}
//               >
//               <i className="material-icons">i</i>
//               </Box>
//             </Box>
//             <Button
//               variant="contained"
//               startIcon={<AddIcon />}
//               onClick={handleAddMember}
//             >
//               Add Member
//             </Button>
//             </Box>
//           <DataGrid
//             rows={filteredRows}
//             columns={columns}
//             onRowClick={handleRowClick}
//             initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
//             pageSizeOptions={[10, 25, 50]}
//             disableColumnMenu
//             disableColumnSelector
//             slots={{
//               toolbar: GridToolbarContainer,
//             }}
//             slotProps={{
//               toolbar: {
//                 sx: { justifyContent: 'flex-end' },
                
//                 children: (
//                   <>
//                     <GridToolbarFilterButton />
//                     <GridToolbarDensitySelector />
//                     <GridToolbarExport
//             printOptions={{ disableToolbarButton: true }} 
//             csvOptions={{
//               fileName: 'Members',
//               utf8WithBom: true, // Ensure UTF-8 encoding with BOM
             
//             }}
//           />
//                   </>
//                 ),
//               },
//             }}
//             sx={{
//               border: 0,
//               flexGrow: 1,
//               width: '100%',
//               '& .MuiDataGrid-main': { overflow: 'hidden' },
//               '& .MuiDataGrid-virtualScroller': { overflow: 'auto' },
//               '& .MuiDataGrid-cell, & .MuiDataGrid-columnHeader': {
//                 whiteSpace: 'normal',
//                 wordWrap: 'break-word',
//               },
//               '& .MuiDataGrid-row, & .MuiDataGrid-columnHeaders': {
//                 maxWidth: '100%',
//               },
//             }}
//           />
//         </Paper>
//       )}
//     </Box>
//   );
// }
