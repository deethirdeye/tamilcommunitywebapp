import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Grid, TextField } from '@mui/material';

interface AddNonMemberProps {
  onSave: (newNonMember: any) => void;
  onCancel: () => void;
}

export const AddNonMember: React.FC<AddNonMemberProps> = ({ onSave, onCancel }) => {
  const [newNonMember, setNewNonMember] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    emergencyContactPersonName: '',
    emergencyContactPersonMobile: '',
    currentAddress: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewNonMember(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(newNonMember);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, mr: 5}}>
        <Button onClick={onCancel}>← Back</Button>
        <Typography variant="h5">Add Non Member</Typography>
      </Box>
      <Paper elevation={3} sx={{ flexGrow: 1, overflow: 'auto', p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={newNonMember.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={newNonMember.email}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mobile Number"
                name="mobileNumber"
                value={newNonMember.mobileNumber}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Emergency Contact Person"
                name="emergencyContactPersonName"
                value={newNonMember.emergencyContactPersonName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Emergency Contact Mobile"
                name="emergencyContactPersonMobile"
                value={newNonMember.emergencyContactPersonMobile}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Current Address"
                name="currentAddress"
                value={newNonMember.currentAddress}
                onChange={handleChange}
                multiline
                rows={3}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button onClick={onCancel} variant="outlined">Cancel</Button>
                <Button type="submit" variant="contained">Save</Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};
