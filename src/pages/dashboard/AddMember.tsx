import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Grid, TextField, MenuItem } from '@mui/material';
import AppConfig from '../../AppConfig';

interface AddMemberProps {
  onBack: () => void;
}

const countryCodes = [
  { code: '+60', label: 'Malaysia (+60)' },
  { code: '+91', label: 'India (+91)' },
  { code: '+94', label: 'Sri Lanka (+94)' },
  { code: '+65', label: 'Singapore (+65)' },

];

export default function AddMember({ onBack }: AddMemberProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    countryCode: '+60',
    mobileNumber: '',
    password: '',
  });
  
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
  });

  const validateForm = () => {
    const newErrors = {
      fullName: formData.fullName.trim() ? '' : 'Full Name is required',
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? '' : 'Invalid Email',
      mobileNumber: /^\d{6,15}$/.test(formData.mobileNumber) ? '' : 'Mobile Number must be 6-15 digits',
      password: formData.password.length >= 6 ? '' : 'Password must be at least 6 characters',
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === '');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [event.target.name]: '', // Clear error when user starts typing
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch(`${AppConfig.API_BASE_URL}/Account/UserSignUpByAdmin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          FullName: formData.fullName,
          Email: formData.email,
          MobileNumber: formData.countryCode + formData.mobileNumber,
          Password: formData.password,
          RoleId: 1,
          Status: 1,
        }),
      });

      const data = await response.json();
      if (data.ResponseCode === 1) {
        alert(data.Message || 'Member added successfully');
        onBack();
      } else {
        alert(data.Message || 'Failed to add member');
      }
    } catch (error) {
      console.error('Error adding member:', error);
      alert('An error occurred while adding member');
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Button onClick={onBack}>← Back</Button>
        <Typography variant="h5">Add Member</Typography>
      </Box>
      
      <Paper elevation={3} sx={{ p: 3, flexGrow: 1, overflow: 'auto', maxHeight: 'calc(100vh - 100px)' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                error={!!errors.fullName}
                helperText={errors.fullName}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                required
              />
            </Grid>
            
            <Grid item xs={12} container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  select
                  fullWidth
                  label="Country Code"
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  required
                >
                  {countryCodes.map((option) => (
                    <MenuItem key={option.code} value={option.code}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  error={!!errors.mobileNumber}
                  helperText={errors.mobileNumber}
                  required
                />
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                required
              />
            </Grid>

            <Grid item xs={12} sx={{ textAlign: 'right' }}>
              <Button type="submit" variant="contained" color="primary">
                Add Member
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}
