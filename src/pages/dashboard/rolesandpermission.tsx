import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Checkbox,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface Permission {
  name: string;
  roles: {
    [key: string]: boolean;
  };
}

const initialPermissions: Permission[] = [
  { name: 'Process Request', roles: { 'Super Admin': false, 'Admin': false, 'Manager': false, 'Associate': false } },
  { name: 'Mark as Under Review', roles: { 'Super Admin': false, 'Admin': false, 'Manager': false, 'Associate': false } },
  { name: 'Mark as On Hold', roles: { 'Super Admin': false, 'Admin': false, 'Manager': false, 'Associate': false } },
  { name: 'Add Comment', roles: { 'Super Admin': false, 'Admin': false, 'Manager': false, 'Associate': false } },
  { name: 'Edit/Delete Comment', roles: { 'Super Admin': false, 'Admin': false, 'Manager': false, 'Associate': false } },
  { name: 'Deny', roles: { 'Super Admin': false, 'Admin': false, 'Manager': false, 'Associate': false } },
  { name: 'Complete', roles: { 'Super Admin': false, 'Admin': false, 'Manager': false, 'Associate': false } },
  { name: 'Members', roles: { 'Super Admin': false, 'Admin': false, 'Manager': false, 'Associate': false } },
  { name: 'Add Member', roles: { 'Super Admin': false, 'Admin': false, 'Manager': false, 'Associate': false } },
  { name: 'View Member', roles: { 'Super Admin': false, 'Admin': false, 'Manager': false, 'Associate': false } },
  { name: 'Remove Member', roles: { 'Super Admin': false, 'Admin': false, 'Manager': false, 'Associate': false } },
  { name: 'Activate Member', roles: { 'Super Admin': false, 'Admin': false, 'Manager': false, 'Associate': false } },
  { name: 'Add Non Member', roles: { 'Super Admin': false, 'Admin': false, 'Manager': false, 'Associate': false } },
  { name: 'Users', roles: { 'Super Admin': false, 'Admin': false, 'Manager': false, 'Associate': false } },
  { name: 'Add User', roles: { 'Super Admin': false, 'Admin': false, 'Manager': false, 'Associate': false } },
  { name: 'Delete User', roles: { 'Super Admin': false, 'Admin': false, 'Manager': false, 'Associate': false } },
  { name: 'Modify User', roles: { 'Super Admin': false, 'Admin': false, 'Manager': false, 'Associate': false } },
];

const roles = ['Super Admin', 'Admin', 'Manager', 'Associate'];

export default function RolesAndPermission() {
  const [permissions, setPermissions] = useState(initialPermissions);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const handleRolePermissionChange = (permissionName: string, roleName: string) => {
    setPermissions(prevPermissions =>
      prevPermissions.map(permission =>
        permission.name === permissionName
          ? {
              ...permission,
              roles: {
                ...permission.roles,
                [roleName]: !permission.roles[roleName],
              },
            }
          : permission
      )
    );
  };

  const handleSave = () => {
    setOpenConfirmDialog(true);
  };

  const confirmSave = () => {
    console.log('Saving permissions:', permissions);
    setOpenConfirmDialog(false);
  };

  return (
    <Box sx={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column', p: 3 }}>
      {/* <Typography variant="h5" gutterBottom>
        Roles & Permissions
      </Typography> */}
      <TableContainer component={Paper} sx={{ flexGrow: 1, mb: 2, overflow: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', color: 'rgba(0, 0, 0, 0.87)' }}>Permissions</TableCell>
              {roles.map(role => (
                <TableCell key={role} align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', color: 'rgba(0, 0, 0, 0.87)' }}>{role}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {permissions.map((permission) => (
              <React.Fragment key={permission.name}>
                {(permission.name === 'Process Request' || permission.name === 'Members' || permission.name === 'Users') && (
                  <TableRow>
                    <TableCell colSpan={roles.length + 1} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', color: 'rgba(0, 0, 0, 0.87)' }}>
                      {permission.name}
                    </TableCell>
                  </TableRow>
                )}
                {permission.name !== 'Process Request' && permission.name !== 'Members' && permission.name !== 'Users' && (
                  <TableRow>
                    <TableCell component="th" scope="row">{permission.name}</TableCell>
                    {roles.map(role => (
                      <TableCell key={role} align="center">
                        <Checkbox
                          checked={permission.roles[role]}
                          onChange={() => handleRolePermissionChange(permission.name, role)}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </Box>
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle>Confirm Save</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to save these permission changes?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>Cancel</Button>
          <Button onClick={confirmSave} variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
