import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Grid, TextField, MenuItem, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
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
    countryCode: '+60', // Default to the first country code
    mobileNumber: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const maxLengths = {
    fullName: 50,
    email: 100,
    mobileNumber: 13, // Maximum 13 digits
    password: 128,
  };

  const validateForm = () => {
    const newErrors = {
      fullName: '',
      email: '',
      mobileNumber: '',
      password: '',
    };

    // Full Name Validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Full Name must be at least 3 characters';
    } else if (formData.fullName.trim().length > maxLengths.fullName) {
      newErrors.fullName = `Full Name must be less than ${maxLengths.fullName} characters`;
    }

    // Email Validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid Email';
    } else if (formData.email.length > maxLengths.email) {
      newErrors.email = `Email must be less than ${maxLengths.email} characters`;
    }

    // Mobile Number Validation
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile Number is required';
    } else if (!/^\d{9,11}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Mobile Number must be 9–11 digits';
    }

    // Password Validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (formData.password.length > maxLengths.password) {
      newErrors.password = `Password must be less than ${maxLengths.password} characters`;
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === '');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;

    // Restrict mobileNumber to numbers only and enforce max length
    if (name === 'mobileNumber') {
      const numericValue = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
      if (numericValue.length <= maxLengths.mobileNumber) {
        setFormData((prev) => ({ ...prev, [name]: numericValue }));
      }
    } else {
      // Enforce max length for other fields
      if (value.length <= maxLengths[name as keyof typeof maxLengths]) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '', // Clear error when user starts typing
    }));
  };

  const handleCountryCodeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFormData((prev) => ({ ...prev, countryCode: event.target.value as string }));
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
        alert('Member added successfully');
        onBack();
      } else {
        alert(data.Message || 'Failed to add member');
      }
    } catch (error) {
      console.error('Error adding member:', error);
      alert('An error occurred while adding member');
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
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
                inputProps={{ maxLength: maxLengths.fullName }}
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
                inputProps={{ maxLength: maxLengths.email }}
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
                  onChange={handleCountryCodeChange}
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
                  inputProps={{ maxLength: maxLengths.mobileNumber }}
                />
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                required
                inputProps={{ maxLength: maxLengths.password }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
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