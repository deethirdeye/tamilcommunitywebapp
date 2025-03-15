import React, { useEffect } from 'react';
import { 
  DataGrid, 
  GridColDef, 
  GridToolbarContainer, 
  GridToolbarFilterButton, 
  GridToolbarDensitySelector, 
  GridToolbarExport,
  GridRenderCellParams
} from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import AppConfig from '../../AppConfig';
import { ApiEndpoints } from '../../APIEndpoint';


interface User {
  id: string;
  userId: string;
  name: string;
  role: string;
  emailId: string;
  phoneNo: string;
  status: string;
  lastLogin: string;
  password: string;
}

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <Box sx={{ flexGrow: 1 }} />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport
            printOptions={{ disableToolbarButton: true }} // Disable the print option here
          />
    </GridToolbarContainer>
  );
}

export default function AdminUser() {
  console.log("localStorage contents:", {
    loggedInUserId: localStorage.getItem('loggedInUserId'),
    allKeys: Object.keys(localStorage)
  });

  const [searchTerm, setSearchTerm] = React.useState('');
  const [rows, setRows] = React.useState<User[]>([]);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState('');
  const [passwordConfirmDialogOpen, setPasswordConfirmDialogOpen] = React.useState(false);
  const [addUserDialogOpen, setAddUserDialogOpen] = React.useState(false);
  const [newUser, setNewUser] = React.useState<Partial<User & { password: string }>>({});
  const [EditUser, setEditUser] = React.useState<Partial<User & { password: string }>>({});
  const [addUserConfirmDialogOpen, setAddUserConfirmDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState<User | null>(null);
  const [errors, setErrors] = React.useState({
    newPassword: '',
  });
  const [validationErrors, setValidationErrors] = React.useState<Partial<Record<keyof User, string>>>({});
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${AppConfig.API_BASE_URL}${ApiEndpoints.GetUserMaster}`);
      const data = await response.json();
      if (data.ResponseCode === 1) {
        const users = data.ResponseData[0].map((user: any) => ({
          id: user.UserId,
          userId: user.UserCode,
          name: user.FullName,
          role: user.RoleId === 2 ? 'Super Admin' 
                : user.RoleId === 5 ? 'Admin' 
                : user.RoleId === 4 ? 'Associate' 
                : user.RoleId === 3 ? 'Manager' 
                : 'User',
          emailId: user.Email,
          phoneNo: user.MobileNumber,
          status: user.Status === 1 ? 'Active' : 'Inactive',
          lastLogin: user.LastModifiedOn
        }));
        setRows(users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
const validateUpdatePasswordFields = () => {
  const newErrors = {
    newPassword: newPassword ? '' : 'New password is required',
  };
  setErrors(newErrors);
  return Object.values(newErrors).every((error) => error === '');
};

  const validateUser  = () => {
    const errors: Partial<Record<keyof User, string>> = {};
    if (!newUser .name) {
      errors.name = 'Name is required';
    }
    if (!newUser .emailId) {
      errors.emailId = 'Email ID is required';
    } else if (!/\S+@\S+\.\S+/.test(newUser .emailId)) {
      errors.emailId = 'Email ID is not valid';
    }
    if (!newUser.phoneNo) {
      errors.phoneNo = 'Phone number is required';
  } else if (!/^\d+$/.test(newUser.phoneNo)) {
      errors.phoneNo = 'Phone number must contain only numbers';
  } else {
      // Remove any whitespace and common phone number characters for length check
      const cleanPhone = newUser.phoneNo.replace(/[\s-()]/g, '');
      
      // Check minimum length (typically 10 digits for US numbers)
      if (cleanPhone.length < 8) {
          errors.phoneNo = 'Phone number must be at least 8 digits';
      }
      
      // Check maximum length (typically 15 digits including country code)
      if (cleanPhone.length > 15) {
          errors.phoneNo = 'Phone number cannot exceed 15 digits';
      }
      
      // Optional: Add specific format validation
      // This regex accepts formats like: 1234567890, (123)4567890, 123-456-7890, +11234567890
      const phoneRegex = /^(?:\+?\d{1,3})?[-.\s]?(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}$/;
      if (!phoneRegex.test(newUser.phoneNo)) {
          errors.phoneNo = 'Please enter a valid phone number format';
      }
  }
  if (!newUser.password) {
    errors.password = 'Password is required';
} else {
    // Minimum length check (8 characters)
    if (newUser.password.length < 6) {
        errors.password = 'Password must be at least 6 characters long';
    }
    
    // Maximum length check (optional, 64 characters)
    if (newUser.password.length > 64) {
        errors.password = 'Password cannot exceed 64 characters';
    }
    
    // Complexity requirements
    const hasUpperCase = /[A-Z]/.test(newUser.password);
    const hasLowerCase = /[a-z]/.test(newUser.password);
    const hasNumbers = /\d/.test(newUser.password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newUser.password);
    
    if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
        errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
    }
    
    // Check for whitespace
    if (/\s/.test(newUser.password)) {
        errors.password = 'Password cannot contain spaces';
    }
    
    // Optional: Check for common weak passwords
    const weakPasswords = ['password', '12345678', 'qwerty123', 'admin123'];
    if (weakPasswords.includes(newUser.password.toLowerCase())) {
        errors.password = 'This password is too common and not secure';
    }
}
if (!newUser.role) {
  errors.role = 'Role is required';
}
if (!newUser.status) {
  errors.status = 'Status is required';
}
setValidationErrors(errors);
return Object.keys(errors).length === 0;
};
  
 
  const filteredRows = rows.filter(row =>
    (row.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (row.emailId?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    ||
    (row.userId.toLowerCase() || '').includes(searchTerm.toLowerCase())  ||
    (row.role.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (row.phoneNo.toLowerCase() || '').includes(searchTerm.toLowerCase())
    ||
    (row.status.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );
  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setEditingUser(null);
  };

  const handleEditSave = () => {
    setEditDialogOpen(false);
    setConfirmDialogOpen(true);
  };

  const handleConfirmSave = async () => {
    if (editingUser) {
      try {
        const loggedInUserId = localStorage.getItem('loggedInUserId');
        console.log("Updating user with loggedInUserId:", loggedInUserId);
        
        if (!loggedInUserId) {
          console.warn("No logged in user ID found in localStorage");
          return;
        }

        const userToUpdate = {
          FullName: editingUser.name,
          Email: editingUser.emailId,
          MobileNumber: editingUser.phoneNo,
          RoleId: editingUser.role === 'Super Admin' 
            ? 2 
            : editingUser.role === 'Admin'
            ? 5
            : editingUser.role === 'Manager'
            ? 3
            : editingUser.role === 'Associate'
            ? 4
            : 1,
          Status: editingUser.status === 'Active' ? 1 : 0,
          UserCode: editingUser.userId,
          LastModifiedBy: loggedInUserId
        };

        const response = await fetch(`${AppConfig.API_BASE_URL}/Account/UpdateAdminUser?userCode=${editingUser.userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userToUpdate),
        });

        const data = await response.json();
        if (data.ResponseCode === 1) {
          await fetchUsers(); // Refresh the user list
          console.log('User updated successfully:', data.Message);
        } else {
          console.error('Error updating user:', data.ErrorDesc);
        }
      } catch (error) {
        console.error('Error updating user:', error);
      }

      setConfirmDialogOpen(false);
      setEditingUser(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setEditingUser((prevUser) => {
      if (prevUser) {
        return { ...prevUser, [name]: value };
      }
      return null;
    });
  };

  const handleUpdatePasswordClick = () => {
    setPasswordDialogOpen(true);
  };

  const handlePasswordDialogClose = () => {
    setPasswordDialogOpen(false);
    setNewPassword('');
  };

  const handlePasswordUpdate = () => {
    if (!validateUpdatePasswordFields()) {
      return;
    }
    setPasswordDialogOpen(false);
    setPasswordConfirmDialogOpen(true);
  };
  const loggedInUserId = localStorage.getItem('loggedInUserId');
  console.log("lodinguser",loggedInUserId);
  const handleConfirmPasswordUpdate = async () => {
    if (editingUser) {
      try {
        const loggedInUserId = localStorage.getItem('loggedInUserId');
        console.log("Updating password with loggedInUserId:", loggedInUserId);
        
        if (!loggedInUserId) {
          console.warn("No logged in user ID found in localStorage");
          return;
        }

        const passwordUpdateData = {
          Email: editingUser.emailId,
          Password: newPassword,
          LastModifiedOn: new Date().toISOString(),
          LastModifiedBy: loggedInUserId
        };

        const response = await fetch(
          `${AppConfig.API_BASE_URL}/Account/UpdateAdminUserPassword?userCode=${editingUser.userId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(passwordUpdateData),
          }
        );

        const data = await response.json();
        if (data.ResponseCode === 1) {
          console.log('Password updated successfully');
          // Show success message to user
          alert('Password updated successfully');
        } else {
          console.error('Error updating password:', data.ErrorDesc);
          alert('Failed to update password');
        }
      } catch (error) {
        console.error('Error updating password:', error);
        alert('An error occurred while updating password');
      }

      setPasswordConfirmDialogOpen(false);
      setPasswordDialogOpen(false);
      setNewPassword('');
    }
  };

  const handleAddUserClick = () => {
    setNewUser({});
    setAddUserDialogOpen(true);
  };

  const handleAddUserClose = () => {
    setAddUserDialogOpen(false);
    setNewUser({});
  };

  const handleAddUserInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleAddUserSave = () => {
    if (validateUser ()) {
    setAddUserDialogOpen(false);
    setAddUserConfirmDialogOpen(true);
  }
  };

  const handleConfirmAddUser = async () => {
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    
    const userToAdd = {
      FullName: newUser.name || '',
      Email: newUser.emailId || '',
      MobileNumber: newUser.phoneNo || '',
      Password: newUser.password || '',
      RoleId: newUser.role === 'Super Admin'
        ? 2
        : newUser.role === 'Admin'
        ? 5
        : newUser.role === 'Manager'
        ? 3
        : newUser.role === 'Associate'
        ? 4
        : 10,
      Status: newUser.status === 'Active' ? 1 : 0,
      LastModifiedBy: loggedInUserId || '0'
    };

    try {
      const response = await fetch(`${AppConfig.API_BASE_URL}/Account/AdminSignup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userToAdd),
      });

      const data = await response.json();
      if (data.ResponseCode === 1) {
        await fetchUsers();
        alert('User added successfully');
        setAddUserConfirmDialogOpen(false);
        setNewUser({});
      } else if (data.ResponseCode === 2) {
        if (data.Message.toLowerCase().includes('mobile')) {
          alert('Mobile number already exists. Please use a different mobile number.');
        } else if (data.Message.toLowerCase().includes('email')) {
          alert('Email already exists. Please use a different email address.');
        } else {
          alert(data.Message || 'Failed to add user');
        }
        setAddUserConfirmDialogOpen(false);
        setAddUserDialogOpen(true);
      } else {
        alert(data.ErrorDesc || 'Failed to add user');
        setAddUserConfirmDialogOpen(false);
      }
    } catch (error) {
      console.error('Error adding user:', error);
      alert('An error occurred while adding the user');
      setAddUserConfirmDialogOpen(false);
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        const response = await fetch(
          `${AppConfig.API_BASE_URL}/Account/DeleteAdminUser?userCode=${userToDelete.userId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const data = await response.json();
        if (data.ResponseCode === 1) {
          await fetchUsers(); // Refresh the user list
          console.log('User deleted successfully');
        } else {
          console.error('Error deleting user:', data.ErrorDesc);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }

      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const columns: GridColDef[] = [
    { field: 'userId', headerName: 'User ID', flex: 1, resizable: false },
    { field: 'name', headerName: 'Name', flex: 1, resizable: false },
    { field: 'role', headerName: 'Role', flex: 1, resizable: false },
    { field: 'emailId', headerName: 'Email ID', flex: 1, resizable: false },
    { field: 'phoneNo', headerName: 'Phone No.', flex: 1, resizable: false },
    { field: 'status', headerName: 'Status', flex: 1, resizable: false },
 
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      resizable: false,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <IconButton aria-label="edit" onClick={() => handleEditClick(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton aria-label="delete" onClick={() => handleDeleteClick(params.row)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

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
          InputProps={{
            endAdornment: (
              <IconButton>
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddUserClick}
          sx={{
            backgroundColor: '#2196f3',
            color: 'white',
            '&:hover': {
              backgroundColor: '#1976d2',
            },
          }}
        >
          Add User
        </Button>
      </Box>
      <DataGrid
        rows={filteredRows}
        columns={columns}
        getRowId={(row) => row.userId}  
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
        }}
        pageSizeOptions={[10]}
        disableColumnMenu
        disableColumnSelector
        slotProps={{ toolbar: { printOptions: { disableToolbarButton: true } } }}
        slots={{
          toolbar: CustomToolbar,
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
      <Dialog open={editDialogOpen} onClose={handleEditClose}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label="Name"
            fullWidth
            value={editingUser?.name || ''}
            onChange={handleInputChange}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            margin="dense"
            name="emailId"
            label="Email ID"
            fullWidth
            value={editingUser?.emailId || ''}
            onChange={handleInputChange}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            margin="dense"
            name="phoneNo"
            label="Phone No."
            fullWidth
            value={editingUser?.phoneNo || ''}
            onChange={handleInputChange}
              InputProps={{
    readOnly: true,
  }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={editingUser?.role || ''}
              onChange={handleInputChange}
            >
              <MenuItem value="Super Admin">Super Admin</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Manager">Manager</MenuItem>
              <MenuItem value="Associate">Associate</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={editingUser?.status || ''}
              onChange={handleInputChange}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Link
              component="button"
              variant="body2"
              onClick={handleUpdatePasswordClick}
            >
              Update Password
            </Link>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={passwordDialogOpen} onClose={handlePasswordDialogClose}>
        <DialogTitle>Update Password</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={editingUser?.emailId || ''}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            error={!!errors.newPassword}
            helperText={errors.newPassword}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePasswordDialogClose}>Cancel</Button>
          <Button onClick={handlePasswordUpdate} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={passwordConfirmDialogOpen} onClose={() => setPasswordConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Password Update</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to update the password for {editingUser?.emailId}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmPasswordUpdate} variant="contained">Confirm</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Save</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to save these changes?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmSave} variant="contained">Confirm</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={addUserDialogOpen} onClose={handleAddUserClose}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label="Name"
            fullWidth
            value={newUser.name || ''}
            onChange={handleAddUserInputChange}
            error={!!validationErrors.name}
      helperText={validationErrors.name}
          />
          <TextField
            margin="dense"
            name="emailId"
            label="Email ID"
            fullWidth
            value={newUser.emailId || ''}
            onChange={handleAddUserInputChange}
            error={!!validationErrors.emailId}
      helperText={validationErrors.emailId}

          />
          <TextField
            margin="dense"
            name="phoneNo"
            label="Phone No."
            fullWidth
            value={newUser.phoneNo || ''}
            onChange={handleAddUserInputChange}
            error={!!validationErrors.phoneNo}
            helperText={validationErrors.phoneNo}
          />
          <TextField
            margin="dense"
            name="password"
            label="Password"
            type="password"
            fullWidth
            value={newUser.password || ''}
            onChange={handleAddUserInputChange}
            error={!!validationErrors.password}
            helperText={validationErrors.password}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={newUser.role || ''}
              onChange={handleAddUserInputChange}
            >  error={!!validationErrors.role}
              <MenuItem value="Super Admin">Super Admin</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Manager">Manager</MenuItem>
              <MenuItem value="Associate">Associate</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={newUser.status || ''}
              onChange={handleAddUserInputChange}
            
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
              error={!!validationErrors.status}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddUserClose}>Cancel</Button>
          <Button onClick={handleAddUserSave} variant="contained">Add User</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={addUserConfirmDialogOpen} onClose={() => setAddUserConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Add User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to add this new user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddUserConfirmDialogOpen(false)}  >Cancel</Button>
          <Button onClick={handleConfirmAddUser} variant="contained">Confirm</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteDialogOpen} onClose={handleDeleteClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete user {userToDelete?.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
