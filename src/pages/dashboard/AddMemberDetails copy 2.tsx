import React, { useState } from 'react';
import { Box, Typography, Button, Grid, TextField, Tabs, Tab, Alert, Snackbar } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import AppConfig from '../../AppConfig';

interface Member {
  id: number;
  email: string;
  applicantName: string;
  mobileNo: string;
  userCode: string;
}

interface AddMemberDetailsProps {
  member: Member;
  onBack: () => void;
  onSubmit: () => void;
}

interface FormData {
  basicDetails: {
    Email: string;
    DOB: Date | null;
    CurrentLocation: string;
    FullName: string;
    MobileNumber: string;
  };
  nativeDetails: {
    NativeAddress: string;
    NativeCity: string;
    NativeState: string;
    NativePinCode: string;
    NativeContactPersonName: string;
    NativeContactPersonPhone: string;
  };
  malaysiaWorkDetails: {
    MalaysiaWorkAddress: string;
    MalaysiaCity: string;
    MalaysiaState: string;
    MalaysiaPinCode: string;
    MalaysiaWorkContactPersonName: string;
    MalaysiaWorkContactPersonPhone: string;
  };
  malaysiaResidenceDetails: {
    MalaysiaAddress: string;
    MalaysiaResidenceCity: string;
    MalaysiaResidenceState: string;
    MalaysiaResidencePinCode: string;
    MalaysiaContactPersonName: string;
    MalaysiaContactPersonPhone: string;
  };
  emergencyDetails: {
    MalaysiaEmergencyContactPerson: string;
    MalaysiaEmergencyPhone: string;
    OtherEmergencyContactPerson: string;
    OtherEmergencyPhone: string;
  };
  employerDetails: {
    EmployerFullName: string;
    CompanyName: string;
    MobileNumber: string;
    IDNumber: string;
    EmployerAddress: string;
    City: string;
    State: string;
    EmployerCountry: string;
    PinCode: string;
  };
  passportDetails: {
    PassportNumber: string;
    Surname: string;
    GivenNames: string;
    Nationality: string;
    DateOfIssue: string;
    DateOfExpiry: string;
    PlaceOfIssue: string;
  };
  AdminUserLogin: {
    UserId: number;
    Email: string;
    MobileNumber: string;
    UserCode: string;
    Password: string;
  };
}

export default function AddMemberDetails({ member, onBack, onSubmit }: AddMemberDetailsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    basicDetails: {
      Email: member.email || '',
      DOB: null,
      CurrentLocation: '',
      FullName: member.applicantName || '',
      MobileNumber: member.mobileNo || ''
    },
    nativeDetails: {
      NativeAddress: '',
      NativeCity: '',
      NativeState: '',
      NativePinCode: '',
      NativeContactPersonName: '',
      NativeContactPersonPhone: ''
    },
    malaysiaWorkDetails: {
      MalaysiaWorkAddress: '',
      MalaysiaCity: '',
      MalaysiaState: '',
      MalaysiaPinCode: '',
      MalaysiaWorkContactPersonName: '',
      MalaysiaWorkContactPersonPhone: ''
    },
    malaysiaResidenceDetails: {
      MalaysiaAddress: '',
      MalaysiaResidenceCity: '',
      MalaysiaResidenceState: '',
      MalaysiaResidencePinCode: '',
      MalaysiaContactPersonName: '',
      MalaysiaContactPersonPhone: ''
    },
    emergencyDetails: {
      MalaysiaEmergencyContactPerson: '',
      MalaysiaEmergencyPhone: '',
      OtherEmergencyContactPerson: '',
      OtherEmergencyPhone: ''
    },
    employerDetails: {
      EmployerFullName: '',
      CompanyName: '',
      MobileNumber: '',
      IDNumber: '',
      EmployerAddress: '',
      City: '',
      State: '',
      EmployerCountry: '',
      PinCode: ''
    },
    passportDetails: {
      PassportNumber: '',
      Surname: '',
      GivenNames: '',
      Nationality: '',
      DateOfIssue: '',
      DateOfExpiry: '',
      PlaceOfIssue: ''
    },
    AdminUserLogin: {
      UserId: member.id,
      Email: member.email,
      MobileNumber: member.mobileNo,
      UserCode: member.userCode,
      Password: ''
    }
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const validateBasicDetails = () => {
    const basicErrors: {[key: string]: string} = {};
    
    if (!formData.basicDetails.FullName.trim()) {
      basicErrors.FullName = 'Full Name is required';
    }
    if (!formData.basicDetails.Email.trim()) {
      basicErrors.Email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.basicDetails.Email)) {
      basicErrors.Email = 'Invalid email format';
    }
    if (!formData.basicDetails.MobileNumber.trim()) {
      basicErrors.MobileNumber = 'Mobile Number is required11';
    } 
    if (!formData.basicDetails.DOB) {
      basicErrors.DOB = 'Date of Birth is required';
    }
    if (!formData.basicDetails.CurrentLocation.trim()) {
      basicErrors.CurrentLocation = 'Current Location is required';
    }

    return basicErrors;
  };

  const validateNativeDetails = () => {
    const nativeErrors: {[key: string]: string} = {};
    
    if (!formData.nativeDetails.NativeAddress.trim()) {
      nativeErrors.NativeAddress = 'Native Address is required';
    }
    if (!formData.nativeDetails.NativeCity.trim()) {
      nativeErrors.NativeCity = 'Native City is required';
    }
    if (!formData.nativeDetails.NativeState.trim()) {
      nativeErrors.NativeState = 'Native State is required';
    }
    if (!formData.nativeDetails.NativePinCode.trim()) {
      nativeErrors.NativePinCode = 'Native Pin Code is required';
    }
    if (!formData.nativeDetails.NativeContactPersonName.trim()) {
      nativeErrors.NativeContactPersonName = 'Contact Person Name is required';
    }
    if (!formData.nativeDetails.NativeContactPersonPhone.trim()) {
      nativeErrors.NativeContactPersonPhone = 'Contact Person Phone is required';
    }

    return nativeErrors;
  };

  const validateMalaysiaWorkDetails = () => {
    const workErrors: {[key: string]: string} = {};
    
    if (!formData.malaysiaWorkDetails.MalaysiaWorkAddress.trim()) {
      workErrors.MalaysiaWorkAddress = 'Work Address is required';
    }
    if (!formData.malaysiaWorkDetails.MalaysiaCity.trim()) {
      workErrors.MalaysiaCity = 'City is required';
    }
    if (!formData.malaysiaWorkDetails.MalaysiaState.trim()) {
      workErrors.MalaysiaState = 'State is required';
    }
    if (!formData.malaysiaWorkDetails.MalaysiaPinCode.trim()) {
      workErrors.MalaysiaPinCode = 'Pin Code is required';
    }
    if (!formData.malaysiaWorkDetails.MalaysiaWorkContactPersonName.trim()) {
      workErrors.MalaysiaWorkContactPersonName = 'Contact Person Name is required';
    }
    if (!formData.malaysiaWorkDetails.MalaysiaWorkContactPersonPhone.trim()) {
      workErrors.MalaysiaWorkContactPersonPhone = 'Contact Person Phone is required';
    }

    return workErrors;
  };

  const validateMalaysiaResidenceDetails = () => {
    const residenceErrors: {[key: string]: string} = {};
    
    if (!formData.malaysiaResidenceDetails.MalaysiaAddress.trim()) {
      residenceErrors.MalaysiaAddress = 'Malaysia Address is required';
    }
    if (!formData.malaysiaResidenceDetails.MalaysiaResidenceCity.trim()) {
      residenceErrors.MalaysiaResidenceCity = 'Residence City is required';
    }
    if (!formData.malaysiaResidenceDetails.MalaysiaResidenceState.trim()) {
      residenceErrors.MalaysiaResidenceState = 'Residence State is required';
    }
    if (!formData.malaysiaResidenceDetails.MalaysiaResidencePinCode.trim()) {
      residenceErrors.MalaysiaResidencePinCode = 'Residence Pin Code is required';
    }
    if (!formData.malaysiaResidenceDetails.MalaysiaContactPersonName.trim()) {
      residenceErrors.MalaysiaContactPersonName = 'Contact Person Name is required';
    }
    if (!formData.malaysiaResidenceDetails.MalaysiaContactPersonPhone.trim()) {
      residenceErrors.MalaysiaContactPersonPhone = 'Contact Person Phone is required';
    }

    return residenceErrors;
  };

  const validateEmergencyDetails = () => {
    const emergencyErrors: {[key: string]: string} = {};
    
    if (!formData.emergencyDetails.MalaysiaEmergencyContactPerson.trim()) {
      emergencyErrors.MalaysiaEmergencyContactPerson = 'Malaysia Emergency Contact Person is required';
    }
    if (!formData.emergencyDetails.MalaysiaEmergencyPhone.trim()) {
      emergencyErrors.MalaysiaEmergencyPhone = 'Malaysia Emergency Phone is required';
    }
    if (!formData.emergencyDetails.OtherEmergencyContactPerson.trim()) {
      emergencyErrors.OtherEmergencyContactPerson = 'Other Emergency Contact Person is required';
    }
    if (!formData.emergencyDetails.OtherEmergencyPhone.trim()) {
      emergencyErrors.OtherEmergencyPhone = 'Other Emergency Phone is required';
    }

    return emergencyErrors;
  };

  const validateEmployerDetails = () => {
    const employerErrors: {[key: string]: string} = {};
    
    if (!formData.employerDetails.EmployerFullName.trim()) {
      employerErrors.EmployerFullName = 'Employer Full Name is required';
    }
    if (!formData.employerDetails.CompanyName.trim()) {
      employerErrors.CompanyName = 'Company Name is required';
    }
    if (!formData.employerDetails.MobileNumber.trim()) {
      employerErrors.MobileNumber = 'Mobile Number is required';
    }
    if (!formData.employerDetails.IDNumber.trim()) {
      employerErrors.IDNumber = 'ID Number is required';
    }
    if (!formData.employerDetails.EmployerAddress.trim()) {
      employerErrors.EmployerAddress = 'Employer Address is required';
    }
    if (!formData.employerDetails.City.trim()) {
      employerErrors.City = 'City is required';
    }
    if (!formData.employerDetails.State.trim()) {
      employerErrors.State = 'State is required';
    }
    if (!formData.employerDetails.EmployerCountry.trim()) {
      employerErrors.EmployerCountry = 'Employer Country is required';
    }
    if (!formData.employerDetails.PinCode.trim()) {
      employerErrors.PinCode = 'Pin Code is required';
    }

    return employerErrors;
  };

  const validatePassportDetails = () => {
    const passportErrors: {[key: string]: string} = {};
    
    if (!formData.passportDetails.PassportNumber.trim()) {
      passportErrors.PassportNumber = 'Passport Number is required';
    }
    if (!formData.passportDetails.Surname.trim()) {
      passportErrors.Surname = 'Surname is required';
    }
    if (!formData.passportDetails.GivenNames.trim()) {
      passportErrors.GivenNames = 'Given Names are required';
    }
    if (!formData.passportDetails.Nationality.trim()) {
      passportErrors.Nationality = 'Nationality is required';
    }
    if (!formData.passportDetails.DateOfIssue.trim()) {
      passportErrors.DateOfIssue = 'Date of Issue is required';
    }
    if (!formData.passportDetails.DateOfExpiry.trim()) {
      passportErrors.DateOfExpiry = 'Date of Expiry is required';
    }
    if (!formData.passportDetails.PlaceOfIssue.trim()) {
      passportErrors.PlaceOfIssue = 'Place of Issue is required';
    }

    return passportErrors;
  };

  // Validation function to check current tab
  const validateCurrentTab = () => {
    let currentErrors = {};
    switch (activeTab) {
      case 0:
        currentErrors = validateBasicDetails();
        break;
      case 1:
        currentErrors = validateNativeDetails();
        break;
      case 2:
        currentErrors = validateMalaysiaWorkDetails();
        break;
      case 3:
        currentErrors = validateMalaysiaResidenceDetails();
        break;
      case 4:
        currentErrors = validateEmergencyDetails();
        break;
      case 5:
        currentErrors = validateEmployerDetails();
        break;
      case 6:
        currentErrors = validatePassportDetails();
        break;
    }
    return currentErrors;
  };

  // Handle tab change with validation
  const handleTabChange = (newValue: number) => {
    // Validate current tab before changing
    const currentErrors = validateCurrentTab();
    
    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      setSnackbarMessage('Please fill in all required fields');
      setOpenSnackbar(true);
      return;
    }

    // Clear previous errors if validation passes
    setErrors({});
    setActiveTab(newValue);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const allErrors = {
      ...validateBasicDetails(),
      ...validateNativeDetails(),
      ...validateMalaysiaWorkDetails(),
      ...validateMalaysiaResidenceDetails(),
      ...validateEmergencyDetails(),
      ...validateEmployerDetails(),
      ...validatePassportDetails()
    };

    
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      setSnackbarMessage('Please fill in all required fields');
      setOpenSnackbar(true);
      return;
    }
    try {
      const response = await fetch(`${AppConfig.API_BASE_URL}/BasicDetails/AddBasicDetailsByAdmin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.ResponseCode === 1) {
        alert('Details added successfully');
        onSubmit();
      } else {
        alert(data.Message || 'Failed to add details');
      }
    } catch (error) {
      console.error('Error adding details:', error);
      alert('An error occurred while adding details');
    }
  };

  const handleChange = (section: keyof FormData, field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    
    // Remove the specific error for this field when it's updated
    setErrors(prev => {
      const newErrors = {...prev};
      delete newErrors[field];
      return newErrors;
    });

    // Update form data
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: newValue
      }
    }));
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, mr: 5}}>
        <Button onClick={onBack}>← Back</Button>
        <Typography variant="h5" >Add Member Details</Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="Basic Details" />
          <Tab label="Native Details" />
          <Tab label="Malaysia Work" />
          <Tab label="Malaysia Residence" />
          <Tab label="Emergency Contacts" />
          <Tab label="Employer Details" />
          <Tab label="Passport Details" />
        </Tabs>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Box component="form" onSubmit={handleSubmit} sx={{ flexGrow: 1, overflow: 'auto', p: 3 }}>
        {activeTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.basicDetails.FullName}
                onChange={handleChange('basicDetails', 'FullName')}
                error={!!errors.FullName}
                helperText={errors.FullName}
                disabled
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                value={formData.basicDetails.Email}
                onChange={handleChange('basicDetails', 'Email')}
                error={!!errors.Email}
                helperText={errors.Email}
                disabled
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Mobile Number"
                value={formData.basicDetails.MobileNumber}
                onChange={handleChange('basicDetails', 'MobileNumber')}
                // error={!!errors.MobileNumber}
                // helperText={errors.MobileNumber}
                disabled
                inputProps={{
                  maxLength: 15,
                  pattern: '[0-9]*', // Restrict input to digits only
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date of Birth"
                  value={formData.basicDetails.DOB}
              
                  onChange={(newValue) => {
                    setFormData(prev => ({
                      ...prev,
                      basicDetails: {
                        ...prev.basicDetails,
                        DOB: newValue
                      }
                    }));
                  }}
                 
       
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Current Location"
                value={formData.basicDetails.CurrentLocation}
                onChange={handleChange('basicDetails', 'CurrentLocation')}
                error={!!errors.CurrentLocation}
                helperText={errors.CurrentLocation}
              />
            </Grid>
          </Grid>
        )}

        {activeTab === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Native Address"
                value={formData.nativeDetails.NativeAddress}
                onChange={handleChange('nativeDetails', 'NativeAddress')}
                error={!!errors.NativeAddress}
                helperText={errors.NativeAddress}
                
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Native City"
                value={formData.nativeDetails.NativeCity}
                onChange={handleChange('nativeDetails', 'NativeCity')}
                error={!!errors.NativeCity}
                helperText={errors.NativeCity}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Native State"
                value={formData.nativeDetails.NativeState}
                onChange={handleChange('nativeDetails', 'NativeState')}
                error={!!errors.NativeState}
                helperText={errors.NativeState}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Native Pin Code"
                value={formData.nativeDetails.NativePinCode}
                onChange={handleChange('nativeDetails', 'NativePinCode')}
                error={!!errors.NativePinCode}
                helperText={errors.NativePinCode}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact Person Name"
                value={formData.nativeDetails.NativeContactPersonName}
                onChange={handleChange('nativeDetails', 'NativeContactPersonName')}
                error={!!errors.NativeContactPersonName}
                helperText={errors.NativeContactPersonName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact Person Phone"
                value={formData.nativeDetails.NativeContactPersonPhone}
                onChange={handleChange('nativeDetails', 'NativeContactPersonPhone')}
                error={!!errors.NativeContactPersonPhone}
                helperText={errors.NativeContactPersonPhone}
              />
            </Grid>
          </Grid>
        )}

        {activeTab === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Work Address"
                value={formData.malaysiaWorkDetails.MalaysiaWorkAddress}
                onChange={handleChange('malaysiaWorkDetails', 'MalaysiaWorkAddress')}
                error={!!errors.MalaysiaWorkAddress}
                helperText={errors.MalaysiaWorkAddress}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="City"
                value={formData.malaysiaWorkDetails.MalaysiaCity}
                onChange={handleChange('malaysiaWorkDetails', 'MalaysiaCity')}
                error={!!errors.MalaysiaCity}
                helperText={errors.MalaysiaCity}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="State"
                value={formData.malaysiaWorkDetails.MalaysiaState}
                onChange={handleChange('malaysiaWorkDetails', 'MalaysiaState')}
                error={!!errors.MalaysiaState}
                helperText={errors.MalaysiaState}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Pin Code"
                value={formData.malaysiaWorkDetails.MalaysiaPinCode}
                onChange={handleChange('malaysiaWorkDetails', 'MalaysiaPinCode')}
                error={!!errors.MalaysiaPinCode}
                helperText={errors.MalaysiaPinCode}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact Person Name"
                value={formData.malaysiaWorkDetails.MalaysiaWorkContactPersonName}
                onChange={handleChange('malaysiaWorkDetails', 'MalaysiaWorkContactPersonName')}
                error={!!errors.MalaysiaWorkContactPersonName}
                helperText={errors.MalaysiaWorkContactPersonName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact Person Phone"
                value={formData.malaysiaWorkDetails.MalaysiaWorkContactPersonPhone}
                onChange={handleChange('malaysiaWorkDetails', 'MalaysiaWorkContactPersonPhone')}
                error={!!errors.MalaysiaWorkContactPersonPhone}
                helperText={errors.MalaysiaWorkContactPersonPhone}
              />
            </Grid>
          </Grid>
        )}

        {activeTab === 3 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Malaysia Address"
                value={formData.malaysiaResidenceDetails.MalaysiaAddress}
                onChange={handleChange('malaysiaResidenceDetails', 'MalaysiaAddress')}
                error={!!errors.MalaysiaAddress}
                helperText={errors.MalaysiaAddress}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Residence City"
                value={formData.malaysiaResidenceDetails.MalaysiaResidenceCity}
                onChange={handleChange('malaysiaResidenceDetails', 'MalaysiaResidenceCity')}
                error={!!errors.MalaysiaResidenceCity}
                helperText={errors.MalaysiaResidenceCity}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Residence State"
                value={formData.malaysiaResidenceDetails.MalaysiaResidenceState}
                onChange={handleChange('malaysiaResidenceDetails', 'MalaysiaResidenceState')}
                error={!!errors.MalaysiaResidenceState}
                helperText={errors.MalaysiaResidenceState}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Residence Pin Code"
                value={formData.malaysiaResidenceDetails.MalaysiaResidencePinCode}
                onChange={handleChange('malaysiaResidenceDetails', 'MalaysiaResidencePinCode')}
                error={!!errors.MalaysiaResidencePinCode}
                helperText={errors.MalaysiaResidencePinCode}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact Person Name"
                value={formData.malaysiaResidenceDetails.MalaysiaContactPersonName}
                onChange={handleChange('malaysiaResidenceDetails', 'MalaysiaContactPersonName')}
                error={!!errors.MalaysiaContactPersonName}
                helperText={errors.MalaysiaContactPersonName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact Person Phone"
                value={formData.malaysiaResidenceDetails.MalaysiaContactPersonPhone}
                onChange={handleChange('malaysiaResidenceDetails', 'MalaysiaContactPersonPhone')}
                error={!!errors.MalaysiaContactPersonPhone}
                helperText={errors.MalaysiaContactPersonPhone}
              />
            </Grid>
          </Grid>
        )}

        {activeTab === 4 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Malaysia Emergency Contact Person"
                value={formData.emergencyDetails.MalaysiaEmergencyContactPerson}
                onChange={handleChange('emergencyDetails', 'MalaysiaEmergencyContactPerson')}
                error={!!errors.MalaysiaEmergencyContactPerson}
                helperText={errors.MalaysiaEmergencyContactPerson}
              />
              
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Malaysia Emergency Phone"
                value={formData.emergencyDetails.MalaysiaEmergencyPhone}
                onChange={handleChange('emergencyDetails', 'MalaysiaEmergencyPhone')}
                error={!!errors.MalaysiaEmergencyPhone}
                helperText={errors.MalaysiaEmergencyPhone}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Other Emergency Contact Person"
                value={formData.emergencyDetails.OtherEmergencyContactPerson}
                onChange={handleChange('emergencyDetails', 'OtherEmergencyContactPerson')}
                error={!!errors.OtherEmergencyContactPerson}
                helperText={errors.OtherEmergencyContactPerson}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Other Emergency Phone"
                value={formData.emergencyDetails.OtherEmergencyPhone}
                onChange={handleChange('emergencyDetails', 'OtherEmergencyPhone')}
                error={!!errors.OtherEmergencyPhone}
                helperText={errors.OtherEmergencyPhone}
              />
            </Grid>
          </Grid>
        )}

        {activeTab === 5 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Employer Full Name"
                value={formData.employerDetails.EmployerFullName}
                onChange={handleChange('employerDetails', 'EmployerFullName')}
                error={!!errors.EmployerFullName}
                helperText={errors.EmployerFullName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Company Name"
                value={formData.employerDetails.CompanyName}
                onChange={handleChange('employerDetails', 'CompanyName')}
                error={!!errors.CompanyName}
                helperText={errors.CompanyName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Mobile Number"
                value={formData.employerDetails.MobileNumber}
                onChange={handleChange('employerDetails', 'MobileNumber')}
                error={!!errors.MobileNumber}
                helperText={errors.MobileNumber}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="ID Number"
                value={formData.employerDetails.IDNumber}
                onChange={handleChange('employerDetails', 'IDNumber')}
                error={!!errors.IDNumber}
                helperText={errors.IDNumber}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Employer Address"
                value={formData.employerDetails.EmployerAddress}
                onChange={handleChange('employerDetails', 'EmployerAddress')}
                error={!!errors.EmployerAddress}
                helperText={errors.EmployerAddress}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="City"
                value={formData.employerDetails.City}
                onChange={handleChange('employerDetails', 'City')}
                error={!!errors.City}
                helperText={errors.City}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="State"
                value={formData.employerDetails.State}
                onChange={handleChange('employerDetails', 'State')}
                error={!!errors.State}
                helperText={errors.State}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Employer Country"
                value={formData.employerDetails.EmployerCountry}
                onChange={handleChange('employerDetails', 'EmployerCountry')}
                error={!!errors.EmployerCountry}
                helperText={errors.EmployerCountry}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Pin Code"
                value={formData.employerDetails.PinCode}
                onChange={handleChange('employerDetails', 'PinCode')}
                error={!!errors.PinCode}
                helperText={errors.PinCode}
              />
            </Grid>
          </Grid>
        )}

        {activeTab === 6 && (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Passport Number"
                  value={formData.passportDetails.PassportNumber}
                  onChange={handleChange('passportDetails', 'PassportNumber')}
                  error={!!errors.PassportNumber}
                  helperText={errors.PassportNumber}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Surname"
                  value={formData.passportDetails.Surname}
                  onChange={handleChange('passportDetails', 'Surname')}
                  error={!!errors.Surname}
                  helperText={errors.Surname}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Given Names"
                  value={formData.passportDetails.GivenNames}
                  onChange={handleChange('passportDetails', 'GivenNames')}
                  error={!!errors.GivenNames}
                  helperText={errors.GivenNames}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nationality"
                  value={formData.passportDetails.Nationality}
                  onChange={handleChange('passportDetails', 'Nationality')}
                  error={!!errors.Nationality}
                  helperText={errors.Nationality}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Date of Issue"
                  type="date"
                  value={formData.passportDetails.DateOfIssue}
                  onChange={handleChange('passportDetails', 'DateOfIssue')}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.DateOfIssue}
                  helperText={errors.DateOfIssue}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Date of Expiry"
                  type="date"
                  value={formData.passportDetails.DateOfExpiry}
                  onChange={handleChange('passportDetails', 'DateOfExpiry')}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.DateOfExpiry}
                  helperText={errors.DateOfExpiry}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Place of Issue"
                  value={formData.passportDetails.PlaceOfIssue}
                  onChange={handleChange('passportDetails', 'PlaceOfIssue')}
                  error={!!errors.PlaceOfIssue}
                  helperText={errors.PlaceOfIssue}
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" variant="contained" color="primary">
                Submit All Details
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
} 