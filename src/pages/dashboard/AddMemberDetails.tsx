import React, { useState } from 'react';
import { Box, Typography, Button, Grid, TextField, Tabs, Tab, Alert, Snackbar } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import AppConfig from '../../AppConfig';
import dayjs from 'dayjs';

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
    MobileNumberemp: string;
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
      MobileNumberemp: '',
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
  // const validateBasicDetails = () => {
  //   const basicErrors: { [key: string]: string } = {};
  
  //   // Full Name: 2-50 characters
  //   const fullName = formData.basicDetails.FullName.trim();
  //   if (!fullName) {
  //     basicErrors.FullName = 'Full Name is required';
  //   } else if (fullName.length < 3 || fullName.length > 50) {
  //     basicErrors.FullName = 'Full Name must be between 3 and 50 characters';
  //   }
  
  //   // Email: Valid format, 5-100 characters
  //   const email = formData.basicDetails.Email.trim();
  //   if (!email) {
  //     basicErrors.Email = 'Email is required';
  //   } else if (!/\S+@\S+\.\S+/.test(email)) {
  //     basicErrors.Email = 'Invalid email format';
  //   } else if (email.length < 5 || email.length > 100) {
  //     basicErrors.Email = 'Email must be between 5 and 100 characters';
  //   }
  
  //   // Mobile Number: 8-15 digits
  //   const mobileNumber = formData.basicDetails.MobileNumber.trim();
  //   if (!mobileNumber) {
  //     basicErrors.MobileNumberbasic = 'Mobile Number is required';
  //   } else if (!/^\d{9,15}$/.test(mobileNumber)) {
  //     basicErrors.MobileNumberbasic = 'Mobile Number must be 9-15 digits';
  //   }
  
  //   // Date of Birth: Not in future, not before 1900
  //   const dob = formData.basicDetails.DOB;
  //   if (!dob) {
  //     basicErrors.dob = 'DOB  is required';
  //   } 
  //   const dobObj = dob ? new Date(dob) : new Date('');
  //   const currentDate = new Date();
  //   const minDate = new Date('1900-01-01');
  //   if (!dob) {
  //     basicErrors.DOB = 'Date of Birth is required';
  //   } else if (isNaN(dobObj.getTime())) {
  //     basicErrors.DOB = 'Invalid Date of Birth';
  //   } else if (dobObj > currentDate) {
  //     basicErrors.DOB = 'Date of Birth cannot be in the future';
  //   } else if (dobObj < minDate) {
  //     basicErrors.DOB = 'Date of Birth cannot be before 1900';
  //   }
  
  //   // Current Location: 2-100 characters
  //   const currentLocation = formData.basicDetails.CurrentLocation.trim();
  //   if (!currentLocation) {
  //     basicErrors.CurrentLocation = 'Current Location is required';
  //   } else if (currentLocation.length < 2 || currentLocation.length > 100) {
  //     basicErrors.CurrentLocation = 'Current Location must be between 2 and 100 characters';
  //   }
  
  //   return basicErrors;
  // };

  const validateBasicDetails = () => {
    const basicErrors: { [key: string]: string } = {};
  
    // Full Name: 2-50 characters
    const fullName = formData.basicDetails.FullName.trim();
    if (!fullName) {
      basicErrors.FullName = 'Full Name is required';
    } else if (fullName.length < 3 || fullName.length > 50) {
      basicErrors.FullName = 'Full Name must be between 3 and 50 characters';
    }
  
    // Email: Valid format, 5-100 characters
    const email = formData.basicDetails.Email.trim();
    if (!email) {
      basicErrors.Email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      basicErrors.Email = 'Invalid email format';
    } else if (email.length < 5 || email.length > 100) {
      basicErrors.Email = 'Email must be between 5 and 100 characters';
    }
  
    // Mobile Number: 8-15 digits
    const mobileNumber = formData.basicDetails.MobileNumber.trim();
    if (!mobileNumber) {
      basicErrors.MobileNumber = 'Mobile Number is required';
    } else if (!/^\d{8,15}$/.test(mobileNumber)) {
      basicErrors.MobileNumber = 'Mobile Number must be 8-15 digits';
    }
  
    // Date of Birth: Not in future, not before 1900
    const dob = formData.basicDetails.DOB;
    if (!dob) {
      basicErrors.DOB = 'Date of Birth is required';
    } else {
      const dobObj = new Date(dob);
      const currentDate = new Date();
      const minDate = new Date('1900-01-01');
  
      if (isNaN(dobObj.getTime())) {
        basicErrors.DOB = 'Invalid Date of Birth';
      } else if (dobObj > currentDate) {
        basicErrors.DOB = 'Date of Birth cannot be in the future';
      } else if (dobObj < minDate) {
        basicErrors.DOB = 'Date of Birth cannot be before 1900';
      }
    }
  
    // Current Location: 2-100 characters
    const currentLocation = formData.basicDetails.CurrentLocation.trim();
    if (!currentLocation) {
      basicErrors.CurrentLocation = 'Current Location is required';
    } else if (currentLocation.length < 2 || currentLocation.length > 100) {
      basicErrors.CurrentLocation = 'Current Location must be between 2 and 100 characters';
    }
  
    return basicErrors;
  };

  const validateNativeDetails = () => {
    const nativeErrors: { [key: string]: string } = {};
  
    // Native Address: 5-200 characters
    const nativeAddress = formData.nativeDetails.NativeAddress.trim();
    if (!nativeAddress) {
      nativeErrors.NativeAddress = 'Native Address is required';
    } else if (nativeAddress.length < 5 || nativeAddress.length > 200) {
      nativeErrors.NativeAddress = 'Native Address must be between 5 and 200 characters';
    }
  
    // Native City: 2-50 characters
    const nativeCity = formData.nativeDetails.NativeCity.trim();
    if (!nativeCity) {
      nativeErrors.NativeCity = 'Native City is required';
    } else if (nativeCity.length < 2 || nativeCity.length > 50) {
      nativeErrors.NativeCity = 'Native City must be between 2 and 50 characters';
    }
  
    // Native State: 2-50 characters
    const nativeState = formData.nativeDetails.NativeState.trim();
    if (!nativeState) {
      nativeErrors.NativeState = 'Native State is required';
    } else if (nativeState.length < 2 || nativeState.length > 50) {
      nativeErrors.NativeState = 'Native State must be between 2 and 50 characters';
    }
  
    // Native Pin Code: 4-10 digits (generic, as country isn’t specified)
    const nativePinCode = formData.nativeDetails.NativePinCode.trim();
    if (!nativePinCode) {
      nativeErrors.NativePinCode = 'Native Pin Code is required';
    } else if (!/^\d{4,10}$/.test(nativePinCode)) {
      nativeErrors.NativePinCode = 'Native Pin Code must be 4-10 digits';
    }
  
    // Native Contact Person Name: 2-50 characters
    const nativeContactName = formData.nativeDetails.NativeContactPersonName.trim();
    if (!nativeContactName) {
      nativeErrors.NativeContactPersonName = 'Contact Person Name is required';
    } else if (nativeContactName.length < 2 || nativeContactName.length > 50) {
      nativeErrors.NativeContactPersonName = 'Contact Person Name must be between 2 and 50 characters';
    }
  
    // Native Contact Person Phone: 8-15 digits
    const nativeContactPhone = formData.nativeDetails.NativeContactPersonPhone.trim();
    if (!nativeContactPhone) {
      nativeErrors.NativeContactPersonPhone = 'Contact Person Phone is required';
    } else if (!/^\d{8,15}$/.test(nativeContactPhone)) {
      nativeErrors.NativeContactPersonPhone = 'Contact Person Phone must be 8-15 digits';
    }
  
    return nativeErrors;
  };

  const validateMalaysiaWorkDetails = () => {
    const workErrors: { [key: string]: string } = {};
  
    // Malaysia Work Address: 5-200 characters
    const workAddress = formData.malaysiaWorkDetails.MalaysiaWorkAddress.trim();
    if (!workAddress) {
      workErrors.MalaysiaWorkAddress = 'Work Address is required';
    } else if (workAddress.length < 5 || workAddress.length > 200) {
      workErrors.MalaysiaWorkAddress = 'Work Address must be between 5 and 200 characters';
    }
  
    // Malaysia City: 2-50 characters
    const malaysiaCity = formData.malaysiaWorkDetails.MalaysiaCity.trim();
    if (!malaysiaCity) {
      workErrors.MalaysiaCity = 'City is required';
    } else if (malaysiaCity.length < 2 || malaysiaCity.length > 50) {
      workErrors.MalaysiaCity = 'City must be between 2 and 50 characters';
    }
  
    // Malaysia State: 2-50 characters
    const malaysiaState = formData.malaysiaWorkDetails.MalaysiaState.trim();
    if (!malaysiaState) {
      workErrors.MalaysiaState = 'State is required';
    } else if (malaysiaState.length < 2 || malaysiaState.length > 50) {
      workErrors.MalaysiaState = 'State must be between 2 and 50 characters';
    }
  
    // Malaysia Pin Code: 5 digits (Malaysia-specific)
    const malaysiaPinCode = formData.malaysiaWorkDetails.MalaysiaPinCode.trim();
    if (!malaysiaPinCode) {
      workErrors.MalaysiaPinCode = 'Pin Code is required';
    } else if (!/^\d{4,10}$/.test(malaysiaPinCode)) {
      workErrors.MalaysiaPinCode  = 'Malaysia Pin Code must be 4-10 digits';
    }
  
    // Malaysia Work Contact Person Name: 2-50 characters
    const workContactName = formData.malaysiaWorkDetails.MalaysiaWorkContactPersonName.trim();
    if (!workContactName) {
      workErrors.MalaysiaWorkContactPersonName = 'Contact Person Name is required';
    } else if (workContactName.length < 2 || workContactName.length > 50) {
      workErrors.MalaysiaWorkContactPersonName = 'Contact Person Name must be between 2 and 50 characters';
    }
  
    // Malaysia Work Contact Person Phone: 8-15 digits
    const workContactPhone = formData.malaysiaWorkDetails.MalaysiaWorkContactPersonPhone.trim();
    if (!workContactPhone) {
      workErrors.MalaysiaWorkContactPersonPhone = 'Contact Person Phone is required';
    } else if (!/^\d{8,15}$/.test(workContactPhone)) {
      workErrors.MalaysiaWorkContactPersonPhone = 'Contact Person Phone must be 8-15 digits';
    }
  
    return workErrors;
  };

  const validateMalaysiaResidenceDetails = () => {
    const residenceErrors: { [key: string]: string } = {};
  
    // Malaysia Address: 5-200 characters
    const malaysiaAddress = formData.malaysiaResidenceDetails.MalaysiaAddress.trim();
    if (!malaysiaAddress) {
      residenceErrors.MalaysiaAddress = 'Malaysia Address is required';
    } else if (malaysiaAddress.length < 5 || malaysiaAddress.length > 200) {
      residenceErrors.MalaysiaAddress = 'Malaysia Address must be between 5 and 200 characters';
    }
  
    // Malaysia Residence City: 2-50 characters
    const malaysiaCity = formData.malaysiaResidenceDetails.MalaysiaResidenceCity.trim();
    if (!malaysiaCity) {
      residenceErrors.MalaysiaResidenceCity = 'Residence City is required';
    } else if (malaysiaCity.length < 2 || malaysiaCity.length > 50) {
      residenceErrors.MalaysiaResidenceCity = 'Residence City must be between 2 and 50 characters';
    }
  
    // Malaysia Residence State: 2-50 characters
    const malaysiaState = formData.malaysiaResidenceDetails.MalaysiaResidenceState.trim();
    if (!malaysiaState) {
      residenceErrors.MalaysiaResidenceState = 'Residence State is required';
    } else if (malaysiaState.length < 2 || malaysiaState.length > 50) {
      residenceErrors.MalaysiaResidenceState = 'Residence State must be between 2 and 50 characters';
    }
  
    // Malaysia Residence Pin Code: 5 digits (Malaysia-specific)
    const malaysiaPinCode = formData.malaysiaResidenceDetails.MalaysiaResidencePinCode.trim();
    if (!malaysiaPinCode) {
      residenceErrors.MalaysiaResidencePinCode = 'Residence Pin Code is required';
    } else if (!/^\d{4,10}$/.test(malaysiaPinCode)) {
      residenceErrors.MalaysiaResidencePinCode = 'Residence Pin Code must be 4-10 digits';
    }
  
    // Malaysia Contact Person Name: 2-50 characters
    const malaysiaContactName = formData.malaysiaResidenceDetails.MalaysiaContactPersonName.trim();
    if (!malaysiaContactName) {
      residenceErrors.MalaysiaContactPersonName = 'Contact Person Name is required';
    } else if (malaysiaContactName.length < 2 || malaysiaContactName.length > 50) {
      residenceErrors.MalaysiaContactPersonName = 'Contact Person Name must be between 2 and 50 characters';
    }
  
    // Malaysia Contact Person Phone: 8-15 digits
    const malaysiaContactPhone = formData.malaysiaResidenceDetails.MalaysiaContactPersonPhone.trim();
    if (!malaysiaContactPhone) {
      residenceErrors.MalaysiaContactPersonPhone = 'Contact Person Phone is required';
    } else if (!/^\d{8,15}$/.test(malaysiaContactPhone)) {
      residenceErrors.MalaysiaContactPersonPhone = 'Contact Person Phone must be 8-15 digits';
    }
  
    return residenceErrors;
  };

  const validateEmergencyDetails = () => {
    const emergencyErrors: { [key: string]: string } = {};
  
    // Malaysia Emergency Contact Person: 2-50 characters
    const malaysiaContactPerson = formData.emergencyDetails.MalaysiaEmergencyContactPerson.trim();
    if (!malaysiaContactPerson) {
      emergencyErrors.MalaysiaEmergencyContactPerson = 'Malaysia Emergency Contact Person is required';
    } else if (malaysiaContactPerson.length < 2 || malaysiaContactPerson.length > 50) {
      emergencyErrors.MalaysiaEmergencyContactPerson = 'Malaysia Emergency Contact Person must be between 2 and 50 characters';
    }
  
    // Malaysia Emergency Phone: 8-15 digits
    const malaysiaPhone = formData.emergencyDetails.MalaysiaEmergencyPhone.trim();
    if (!malaysiaPhone) {
      emergencyErrors.MalaysiaEmergencyPhone = 'Malaysia Emergency Phone is required';
    } else if (!/^\d{8,15}$/.test(malaysiaPhone)) {
      emergencyErrors.MalaysiaEmergencyPhone = 'Malaysia Emergency Phone must be 8-15 digits';
    }
  
    // Other Emergency Contact Person: 2-50 characters
    const otherContactPerson = formData.emergencyDetails.OtherEmergencyContactPerson.trim();
    if (!otherContactPerson) {
      emergencyErrors.OtherEmergencyContactPerson = 'Other Emergency Contact Person is required';
    } else if (otherContactPerson.length < 2 || otherContactPerson.length > 50) {
      emergencyErrors.OtherEmergencyContactPerson = 'Other Emergency Contact Person must be between 2 and 50 characters';
    }
  
    // Other Emergency Phone: 8-15 digits
    const otherPhone = formData.emergencyDetails.OtherEmergencyPhone.trim();
    if (!otherPhone) {
      emergencyErrors.OtherEmergencyPhone = 'Other Emergency Phone is required';
    } else if (!/^\d{8,15}$/.test(otherPhone)) {
      emergencyErrors.OtherEmergencyPhone = 'Other Emergency Phone must be 8-15 digits';
    }
  
    return emergencyErrors;
  };

  const validateEmployerDetails = () => {
    const employerErrors: { [key: string]: string } = {};
  
    // Employer Full Name: 2-50 characters
    const employerFullName = formData.employerDetails.EmployerFullName.trim();
    if (!employerFullName) {
      employerErrors.EmployerFullName = 'Employer Full Name is required';
    } else if (employerFullName.length < 2 || employerFullName.length > 50) {
      employerErrors.EmployerFullName = 'Employer Full Name must be between 2 and 50 characters';
    }
  
    // Company Name: 2-100 characters
    const companyName = formData.employerDetails.CompanyName.trim();
    if (!companyName) {
      employerErrors.CompanyName = 'Company Name is required';
    } else if (companyName.length < 2 || companyName.length > 100) {
      employerErrors.CompanyName = 'Company Name must be between 2 and 100 characters';
    }
  
    // Mobile Number: 8-15 digits (international format)
    const mobileNumber1 = formData.employerDetails.MobileNumberemp.trim();
    if (!mobileNumber1) {
      employerErrors.MobileNumberemp = 'Mobile Number is required';
    } else if (!/^\d{8,15}$/.test(mobileNumber1)) {
      employerErrors.MobileNumberemp = 'Mobile Number must be 8-15 digits';
    }
  
    // ID Number: 6-20 alphanumeric characters
    const idNumber = formData.employerDetails.IDNumber.trim();
    if (!idNumber) {
      employerErrors.IDNumber = 'ID Number is required';
    } else if (!/^[a-zA-Z0-9]+$/.test(idNumber)) {
      employerErrors.IDNumber = 'ID Number must contain only letters and numbers (no special characters)';
    } else if (idNumber.length < 6 || idNumber.length > 20) {
      employerErrors.IDNumber = 'ID Number must be between 6 and 20 characters';
    }
  
    // Employer Address: 5-200 characters
    const employerAddress = formData.employerDetails.EmployerAddress.trim();
    if (!employerAddress) {
      employerErrors.EmployerAddress = 'Employer Address is required';
    } else if (employerAddress.length < 5 || employerAddress.length > 200) {
      employerErrors.EmployerAddress = 'Employer Address must be between 5 and 200 characters';
    }
  
    // City: 2-50 characters
    const city = formData.employerDetails.City.trim();
    if (!city) {
      employerErrors.City = 'City is required';
    } else if (city.length < 2 || city.length > 50) {
      employerErrors.City = 'City must be between 2 and 50 characters';
    }
  
    // State: 2-50 characters
    const state = formData.employerDetails.State.trim();
    if (!state) {
      employerErrors.State = 'State is required';
    } else if (state.length < 2 || state.length > 50) {
      employerErrors.State = 'State must be between 2 and 50 characters';
    }
  
    // Employer Country: 2-50 characters
    const employerCountry = formData.employerDetails.EmployerCountry.trim();
    if (!employerCountry) {
      employerErrors.EmployerCountry = 'Employer Country is required';
    } else if (employerCountry.length < 2 || employerCountry.length > 50) {
      employerErrors.EmployerCountry = 'Employer Country must be between 2 and 50 characters';
    }
  
    // Pin Code: 4-10 digits
    const pinCode = formData.employerDetails.PinCode.trim();
    if (!pinCode) {
      employerErrors.PinCode = 'Pin Code is required';
    } else if (!/^\d{4,10}$/.test(pinCode)) {
      employerErrors.PinCode = 'Pin Code must be 4-10 digits';
    }
  
    return employerErrors;
  };

  // const validatePassportDetails = () => {
  //   const passportErrors: { [key: string]: string } = {};
  
  //   // Passport Number: Required, alphanumeric only, 6-12 characters
  //   const passportNumber = formData.passportDetails.PassportNumber.trim();
  //   if (!passportNumber) {
  //     passportErrors.PassportNumber = 'Passport Number is required';
  //   } else if (!/^[a-zA-Z0-9]+$/.test(passportNumber)) {
  //     passportErrors.PassportNumber = 'Passport Number must contain only letters and numbers (no special characters)';
  //   } else if (passportNumber.length < 6 || passportNumber.length > 12) {
  //     passportErrors.PassportNumber = 'Passport Number must be between 6 and 12 characters';
  //   }
  
  //   // Surname: Required, 2-50 characters
  //   const surname = formData.passportDetails.Surname.trim();
  //   if (!surname) {
  //     passportErrors.Surname = 'Surname is required';
  //   } else if (surname.length < 2 || surname.length > 50) {
  //     passportErrors.Surname = 'Surname must be between 2 and 50 characters';
  //   }
  
  //   // Given Names: Required, 2-50 characters
  //   const givenNames = formData.passportDetails.GivenNames.trim();
  //   if (!givenNames) {
  //     passportErrors.GivenNames = 'Given Names are required';
  //   } else if (givenNames.length < 2 || givenNames.length > 50) {
  //     passportErrors.GivenNames = 'Given Names must be between 2 and 50 characters';
  //   }
  
  //   // Nationality: Required, 2-50 characters
  //   const nationality = formData.passportDetails.Nationality.trim();
  //   if (!nationality) {
  //     passportErrors.Nationality = 'Nationality is required';
  //   } else if (nationality.length < 2 || nationality.length > 50) {
  //     passportErrors.Nationality = 'Nationality must be between 2 and 50 characters';
  //   }
  
  //   // Date of Issue: Required, not in future, not before 1900
  //   const dateOfIssue = formData.passportDetails.DateOfIssue.trim();
  //   const currentDate = new Date();
  //   const minDate = new Date('1900-01-01');
  //   const issueDateObj = new Date(dateOfIssue);
  //   if (!dateOfIssue) {
  //     passportErrors.DateOfIssue = 'Date of Issue is required';
  //   } else if (isNaN(issueDateObj.getTime())) {
  //     passportErrors.DateOfIssue = 'Invalid Date of Issue';
  //   } else if (issueDateObj > currentDate) {
  //     passportErrors.DateOfIssue = 'Date of Issue cannot be in the future';
  //   } else if (issueDateObj < minDate) {
  //     passportErrors.DateOfIssue = 'Date of Issue cannot be before 1900';
  //   }
  
  //   // Date of Expiry: Required, after Date of Issue, not more than 20 years from today
  //   const dateOfExpiry = formData.passportDetails.DateOfExpiry.trim();
  //   const expiryDateObj = new Date(dateOfExpiry);
  //   const maxExpiryDate = new Date();
  //   maxExpiryDate.setFullYear(maxExpiryDate.getFullYear() + 20); // 20 years from today
  //   if (!dateOfExpiry) {
  //     passportErrors.DateOfExpiry = 'Date of Expiry is required';
  //   } else if (isNaN(expiryDateObj.getTime())) {
  //     passportErrors.DateOfExpiry = 'Invalid Date of Expiry';
  //   } else if (dateOfIssue && expiryDateObj <= issueDateObj) {
  //     passportErrors.DateOfExpiry = 'Expiry date must be later than the Date of Issue';
  //   } else if (expiryDateObj > maxExpiryDate) {
  //     passportErrors.DateOfExpiry = 'Expiry date cannot be more than 20 years from today';
  //   }
  
  //   // Place of Issue: Required, 2-100 characters
  //   const placeOfIssue = formData.passportDetails.PlaceOfIssue.trim();
  //   if (!placeOfIssue) {
  //     passportErrors.PlaceOfIssue = 'Place of Issue is required';
  //   } else if (placeOfIssue.length < 2 || placeOfIssue.length > 100) {
  //     passportErrors.PlaceOfIssue = 'Place of Issue must be between 2 and 500 characters';
  //   }
  
  //   return passportErrors;
  // };

  const validatePassportDetails = () => {
    const passportErrors: { [key: string]: string } = {};
  
    // Passport Number: Required, alphanumeric only, 6-12 characters
    const passportNumber = formData.passportDetails.PassportNumber.trim();
    if (!passportNumber) {
      passportErrors.PassportNumber = 'Passport Number is required';
    } else if (!/^[a-zA-Z0-9]+$/.test(passportNumber)) {
      passportErrors.PassportNumber = 'Passport Number must contain only letters and numbers (no special characters)';
    } else if (passportNumber.length < 6 || passportNumber.length > 12) {
      passportErrors.PassportNumber = 'Passport Number must be between 6 and 12 characters';
    }
  
    // Surname: Required, 2-50 characters
    const surname = formData.passportDetails.Surname.trim();
    if (!surname) {
      passportErrors.Surname = 'Surname is required';
    } else if (surname.length < 2 || surname.length > 50) {
      passportErrors.Surname = 'Surname must be between 2 and 50 characters';
    }
  
    // Given Names: Required, 2-50 characters
    const givenNames = formData.passportDetails.GivenNames.trim();
    if (!givenNames) {
      passportErrors.GivenNames = 'Given Names are required';
    } else if (givenNames.length < 2 || givenNames.length > 50) {
      passportErrors.GivenNames = 'Given Names must be between 2 and 50 characters';
    }
  
    // Nationality: Required, 2-50 characters
    const nationality = formData.passportDetails.Nationality.trim();
    if (!nationality) {
      passportErrors.Nationality = 'Nationality is required';
    } else if (nationality.length < 2 || nationality.length > 50) {
      passportErrors.Nationality = 'Nationality must be between 2 and 50 characters';
    }
  
    // Date of Issue: Required, not in future, not before 1900
    const dateOfIssue = formData.passportDetails.DateOfIssue.trim();
    if (!dateOfIssue) {
      passportErrors.DateOfIssue = 'Date of Issue is required';
    } else {
      const issueDateObj = new Date(dateOfIssue);
      const currentDate = new Date();
      const minDate = new Date('1900-01-01');
  
      if (isNaN(issueDateObj.getTime())) {
        passportErrors.DateOfIssue = 'Invalid Date of Issue';
      } else if (issueDateObj > currentDate) {
        passportErrors.DateOfIssue = 'Date of Issue cannot be in the future';
      } else if (issueDateObj < minDate) {
        passportErrors.DateOfIssue = 'Date of Issue cannot be before 1900';
      }
    }
  
    // Date of Expiry: Required, after Date of Issue, not more than 20 years from today
    const dateOfExpiry = formData.passportDetails.DateOfExpiry.trim();
    if (!dateOfExpiry) {
      passportErrors.DateOfExpiry = 'Date of Expiry is required';
    } else {
      const expiryDateObj = new Date(dateOfExpiry);
      const maxExpiryDate = new Date();
      maxExpiryDate.setFullYear(maxExpiryDate.getFullYear() + 20); // 20 years from today
  
      if (isNaN(expiryDateObj.getTime())) {
        passportErrors.DateOfExpiry = 'Invalid Date of Expiry';
      } else if (formData.passportDetails.DateOfIssue && expiryDateObj <= new Date(formData.passportDetails.DateOfIssue)) {
        passportErrors.DateOfExpiry = 'Expiry date must be later than the Date of Issue';
      } else if (expiryDateObj > maxExpiryDate) {
        passportErrors.DateOfExpiry = 'Expiry date cannot be more than 20 years from today';
      }
    }
  
    // Place of Issue: Required, 2-100 characters
    const placeOfIssue = formData.passportDetails.PlaceOfIssue.trim();
    if (!placeOfIssue) {
      passportErrors.PlaceOfIssue = 'Place of Issue is required';
    } else if (placeOfIssue.length < 2 || placeOfIssue.length > 100) {
      passportErrors.PlaceOfIssue = 'Place of Issue must be between 2 and 100 characters';
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
      setSnackbarMessage('Please fill in all required fields and check if you have entered all the date fields correctly');
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
      ...validatePassportDetails(),
    };
  
    console.log('Validation Errors:', allErrors); // Debug log
  
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      setSnackbarMessage('Please fill in all required fields and check if you have entered all the date fields correctly');
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
  // const handleSubmit = async (event: React.FormEvent) => {
  //   event.preventDefault();

  //   const allErrors = {
  //     ...validateBasicDetails(),
  //     ...validateNativeDetails(),
  //     ...validateMalaysiaWorkDetails(),
  //     ...validateMalaysiaResidenceDetails(),
  //     ...validateEmergencyDetails(),
  //     ...validateEmployerDetails(),
  //     ...validatePassportDetails()
  //   };

    
  //   if (Object.keys(allErrors).length > 0) {
  //     setErrors(allErrors);
  //     setSnackbarMessage('Please fill in all required fields and check if you have entered all the date fields correctly');
  //     setOpenSnackbar(true);
  //     return;
  //   }
  //   try {
  //     const response = await fetch(`${AppConfig.API_BASE_URL}/BasicDetails/AddBasicDetailsByAdmin`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(formData),
  //     });

  //     const data = await response.json();
  //     if (data.ResponseCode === 1) {
  //       alert('Details added successfully');
  //       onSubmit();
  //     } else {
  //       alert(data.Message || 'Failed to add details');
  //     }
  //   } catch (error) {
  //     console.error('Error adding details:', error);
  //     alert('An error occurred while adding details');
  //   }
  // };

  const handleChange = (section: keyof FormData, field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
  
    // Remove the specific error for this field when it's updated
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  
    // Update form data
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: newValue,
      },
    }));
  };

  // const handleChange = (section: keyof FormData, field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const newValue = event.target.value;
  
  //   setErrors((prev) => ({
  //     ...prev,
  //     [field]: '', // Clear error when user starts typing
  //   }));
  
  //   setFormData((prev) => ({
  //     ...prev,
  //     [section]: {
  //       ...prev[section],
  //       [field]: newValue,
  //     },
  //   }));
  // };
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
              {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
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

              </LocalizationProvider> */}
<LocalizationProvider dateAdapter={AdapterDayjs}>
  <DatePicker
    label="Date of Birth"
    value={formData.basicDetails.DOB ? dayjs(formData.basicDetails.DOB) : null}
    onChange={(newValue) => {
      setFormData((prev) => ({
        ...prev,
        basicDetails: {
          ...prev.basicDetails,
          DOB: newValue ? newValue.toDate() : null, // Convert Dayjs to Date
        },
      }));
    }}
    slotProps={{
      textField: {
        fullWidth: true,
        error: !!errors.DOB,
        helperText: errors.DOB,
      },
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
                inputProps={{
                  maxLength: 20, // Example boundary value
                }}
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
                inputProps={{
                  maxLength: 30, // Example boundary value
                }}
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
                inputProps={{
                  maxLength: 10, 
                  minLength :5// Example boundary value
                }}
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
                inputProps={{
                  maxLength: 10, // Example boundary value
                }}
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
  value={formData.employerDetails.MobileNumberemp}
  onChange={handleChange('employerDetails', 'MobileNumberemp')}
  error={!!errors.MobileNumber}
  helperText={errors.MobileNumber}
  inputProps={{
    maxLength: 15, // Ensure the input doesn't exceed 15 characters
    pattern: '[0-9]*', // Restrict input to digits only
  }}
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
                inputProps={{ 
                maxLength:20,
                pattern: '[A-za-z0-9]*', // Restrict input to digits only
                
                }}
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