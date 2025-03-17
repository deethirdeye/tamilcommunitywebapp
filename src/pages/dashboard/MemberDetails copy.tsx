import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Grid, TextField, DialogContentText, DialogContent, Dialog, DialogTitle, DialogActions, CircularProgress } from '@mui/material';
import { useTheme } from '@emotion/react';
import ActionSuccessPopup from '../../components/ActionSuccessPopup';
import AppConfig from '../../AppConfig';

interface MemberDetailsProps {
  memberCode: string; 
  userId: string;
  onBack: () => void;
}

interface ApiResponse {
  ResponseCode: number;
  Message: string;
  ErrorDesc: string;
  ResponseData: MemberDetailsData[];
}

interface MemberDetailsData {
  basicDetails: BasicDetails;
  nativeDetails: NativeDetails;
  malaysiaWorkDetails: MalaysiaWorkDetails;
  malaysiaResidenceDetails: MalaysiaResidenceDetails;
  emergencyDetails: EmergencyDetails;
  employerDetails: EmployerDetails;
  passportDetails: PassportDetails;
}

interface BasicDetails {
  Email: string;
  DOB: string;
  CurrentLocation: string;
  FullName: string;
  MobileNumber: string;
}

interface NativeDetails {
  NativeAddress: string;
  NativeCity: string;
  NativeState: string;
  NativePinCode: string;
  NativeContactPersonName: string;
  NativeContactPersonPhone: string;
}

interface MalaysiaWorkDetails {
  MalaysiaWorkAddress: string;
  MalaysiaCity: string;
  MalaysiaState: string;
  MalaysiaPinCode: string;
  MalaysiaWorkContactPersonName: string;
  MalaysiaWorkContactPersonPhone: string;
}

interface MalaysiaResidenceDetails {
  MalaysiaAddress: string;
  MalaysiaResidenceCity: string;
  MalaysiaResidenceState: string;
  MalaysiaResidencePinCode: string;
  MalaysiaContactPersonName: string;
  MalaysiaContactPersonPhone: string;
}

interface EmergencyDetails {
  MalaysiaEmergencyContactPerson: string;
  MalaysiaEmergencyPhone: string;
  OtherEmergencyContactPerson: string;
  OtherEmergencyPhone: string;
}

interface EmployerDetails {
  EmployerFullName: string;
  CompanyName: string;
  MobileNumber: string;
  IDNumber: string;
  EmployerAddress: string;
  City: string;
  State: string;
  EmployerCountry: string;
  PinCode: string;
}

interface PassportDetails {
  PassportNumber: string;
  Surname: string;
  GivenNames: string;
  Nationality: string;
  DateOfIssue: string;
  DateOfExpiry: string;
  PlaceOfIssue: string;
}

export default function MemberDetails({ memberCode, userId, onBack }: MemberDetailsProps) {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [openSuccessPopup, setOpenSuccessPopup] = useState(false);
  const [openActivateDialog, setOpenActivateDialog] = useState(false);
  const [activateComment, setActivateComment] = useState('');
  const [actionType, setActionType] = useState<'Removed' | 'Activated'>('Removed');
  const [openLogsDialog, setOpenLogsDialog] = useState(false);
  const [memberDetails, setMemberDetails] = useState<MemberDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<Array<{ date: string; action: string; comment: string }>>([]);

  useEffect(() => {
    const fetchMemberDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`${AppConfig.API_BASE_URL}/BasicDetails/GetByUserId/${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: ApiResponse = await response.json();
        
        if (data.ResponseCode === 1 && data.ResponseData?.length > 0) {
          setMemberDetails(data.ResponseData[0]);
        } else {
          throw new Error(data.Message || 'No data available for this member');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch member details');
        console.error('Error fetching member details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchMemberDetails();
    }
  }, [userId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !memberDetails) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">{error || 'No data available'}</Typography>
        <Button onClick={onBack} sx={{ mt: 2 }}>Back</Button>
      </Box>
    );
  }

  const DetailSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      {children}
    </Paper>
  );

  const DetailItem = ({ label, value }: { label: string; value: string }) => (
    <Grid item xs={12} sm={6} md={3}>
      <Typography variant="body2" color="textSecondary">{label}</Typography>
      <Typography variant="body1" sx={{ wordBreak: 'break-word', maxWidth: '100%' }}>{value}</Typography>
    </Grid>
  );

  const handleRemove = () => {
    setOpenDialog(true);
  };

  const handleConfirmRemove = async () => {
    try {
      const response = await fetch(
        `${AppConfig.API_BASE_URL}/Account/DeleteAdminUser?userCode=${memberCode}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Status: 0,
            LastModifiedOn: new Date().toISOString(),
            LastModifiedBy: localStorage.getItem('loggedInUserId') || '0'
          }),
        }
      );

      const data = await response.json();
      if (data.ResponseCode === 1) {
        setOpenDialog(false);
        setOpenSuccessPopup(true);
        setTimeout(() => {
          onBack();
        }, 1000);
      } else {
        alert(data.ErrorDesc || 'Failed to remove member');
      }
    } catch (error) {
      console.error('Error removing member:', error);
      alert('An error occurred while removing the member');
    }
  };

  const handleActivate = () => {
    setOpenActivateDialog(true);
  };

  const handleConfirmActivate = () => {
    // Implement the logic to activate the member here
    console.log(`Activating member ${memberCode} with comment: ${activateComment}`);
    setOpenActivateDialog(false);
    setOpenSuccessPopup(true);
    // Delay the onBack call to allow the popup to be visible
    setTimeout(() => {
      onBack();
    }, 1000);
  };

  const handleMemberLogs = () => {
    setOpenLogsDialog(true);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Button onClick={onBack}>← Back</Button>
        <Typography variant="h5">Applicant View</Typography>
        {/* <Box>
          <Button variant="contained" color="error" onClick={handleRemove} sx={{ mr: 2 }}>Remove Member</Button>
          <Button variant="contained" color="primary" onClick={handleActivate} sx={{ mr: 2 }}>Activate User</Button>
          <Button variant="contained" color="info" onClick={handleMemberLogs}>Member Logs</Button>
        </Box> */}
      </Box>
      <Paper elevation={3} sx={{ flexGrow: 1, overflow: 'auto', p: 3, position: 'relative' }}>
        <DetailSection title="Basic Details">
          <Grid container spacing={2}>
            <DetailItem label="Full Name" value={memberDetails.basicDetails.FullName} />
            <DetailItem label="Email" value={memberDetails.basicDetails.Email} />
            <DetailItem label="Mobile No." value={memberDetails.basicDetails.MobileNumber} />
            <DetailItem label="Date of Birth" value={memberDetails.basicDetails.DOB} />
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary">Current Location</Typography>
              <Typography variant="body1">{memberDetails.basicDetails.CurrentLocation}</Typography>
            </Grid>
          </Grid>
        </DetailSection>

        <DetailSection title="Native Details">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary">Native Address</Typography>
              <Typography variant="body1">{memberDetails.nativeDetails.NativeAddress}</Typography>
            </Grid>
            <DetailItem label="Native City" value={memberDetails.nativeDetails.NativeCity} />
            <DetailItem label="Native State" value={memberDetails.nativeDetails.NativeState} />
            <DetailItem label="Native Pin Code" value={memberDetails.nativeDetails.NativePinCode} />
            <DetailItem label="Contact Person Name" value={memberDetails.nativeDetails.NativeContactPersonName} />
            <DetailItem label="Contact Person Phone" value={memberDetails.nativeDetails.NativeContactPersonPhone} />
          </Grid>
        </DetailSection>

        <DetailSection title="Malaysia Residence Details">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary">Malaysia Residency Address</Typography>
              <Typography variant="body1" sx={{ wordBreak: 'break-word', maxWidth: '100%' }}>{memberDetails.malaysiaResidenceDetails.MalaysiaAddress}</Typography>
            </Grid>
            <DetailItem label="Malaysia Contact Person Name" value={memberDetails.malaysiaResidenceDetails.MalaysiaContactPersonName} />
            <DetailItem label="Mobile No." value={memberDetails.malaysiaResidenceDetails.MalaysiaContactPersonPhone} />
          </Grid>
        </DetailSection>

        <DetailSection title="Malaysia Workplace Details">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary">Malaysia Workplace Address</Typography>
              <Typography variant="body1" sx={{ wordBreak: 'break-word', maxWidth: '100%' }}>{memberDetails.malaysiaWorkDetails.MalaysiaWorkAddress}</Typography>
            </Grid>
            <DetailItem label="Malaysia Work Contact Person Name" value={memberDetails.malaysiaWorkDetails.MalaysiaWorkContactPersonName} />
            <DetailItem label="Mobile No." value={memberDetails.malaysiaWorkDetails.MalaysiaWorkContactPersonPhone} />
          </Grid>
        </DetailSection>

        <DetailSection title="Malaysia Emergency Contact Details">
          <Grid container spacing={2}>
            <DetailItem label="Emergency Contact Person" value={memberDetails.emergencyDetails.MalaysiaEmergencyContactPerson} />
            <DetailItem label="Mobile No." value={memberDetails.emergencyDetails.MalaysiaEmergencyPhone} />
            <DetailItem label="Other Emergency Contact Person" value={memberDetails.emergencyDetails.OtherEmergencyContactPerson} />
            <DetailItem label="Mobile No." value={memberDetails.emergencyDetails.OtherEmergencyPhone} />
          </Grid>
        </DetailSection>

        <DetailSection title="Employer Details">
          <Grid container spacing={2}>
            <DetailItem label="Full Name" value={memberDetails.employerDetails.EmployerFullName} />
            <DetailItem label="Company Name" value={memberDetails.employerDetails.CompanyName} />
            <DetailItem label="Mobile No." value={memberDetails.employerDetails.MobileNumber} />
            <DetailItem label="ID Number" value={memberDetails.employerDetails.IDNumber} />
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary">Employer Address</Typography>
              <Typography variant="body1" sx={{ wordBreak: 'break-word', maxWidth: '100%' }}>{memberDetails.employerDetails.EmployerAddress}</Typography>
            </Grid>
          </Grid>
        </DetailSection>

        <DetailSection title="Passport Details">
          <Grid container spacing={2}>
            <DetailItem label="Passport No." value={memberDetails.passportDetails.PassportNumber} />
            <DetailItem label="Surname" value={memberDetails.passportDetails.Surname} />
            <DetailItem label="Given Name" value={memberDetails.passportDetails.GivenNames} />
            <DetailItem label="Nationality" value={memberDetails.passportDetails.Nationality} />
            <DetailItem label="Date of Issue" value={memberDetails.passportDetails.DateOfIssue} />
            <DetailItem label="Date of Expiry" value={memberDetails.passportDetails.DateOfExpiry} />
            <DetailItem label="Place of Issue" value={memberDetails.passportDetails.PlaceOfIssue} />
          </Grid>
        </DetailSection>
        
        <Box sx={{ position: 'sticky', bottom: '16px', right: '16px', textAlign: 'right' }}>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleRemove} 
            sx={{ mr: 2 }}
          >
            Delete Member
          </Button>
          <Button variant="contained" color="primary" onClick={onBack}>
            OK
          </Button>
        </Box>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#f44336', color: 'white', textAlign: 'center' }}>
          Confirm Member Removal
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ mt: 2, mb: 3, textAlign: 'center' }}>
            Are you sure you want to remove this member? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', p: 3 }}>
          <Button onClick={() => setOpenDialog(false)} variant="contained" color="inherit" sx={{ minWidth: 100 }}>
            Cancel
          </Button>
          <Button onClick={handleConfirmRemove} variant="contained" color="error" sx={{ minWidth: 100 }}>
            Yes, Remove
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openActivateDialog} onClose={() => setOpenActivateDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#2196f3', color: 'white', textAlign: 'center' }}>
          Confirm Member Activation
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ mt: 2, mb: 3, textAlign: 'center' }}>
            Are you sure you want to activate this member? This action cannot be undone.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            id="activateComment"
            label="Activation Comment"
            type="text"
            fullWidth
            variant="outlined"
            value={activateComment}
            onChange={(e) => setActivateComment(e.target.value)}
            placeholder="Please provide a reason for activating this member."
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', p: 3 }}>
          <Button onClick={() => setOpenActivateDialog(false)} variant="contained" color="inherit" sx={{ minWidth: 100 }}>
            Cancel
          </Button>
          <Button onClick={handleConfirmActivate} variant="contained" color="primary" sx={{ minWidth: 100 }}>
            Yes, Activate
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openLogsDialog} onClose={() => setOpenLogsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#2196f3', color: 'white', textAlign: 'center' }}>
          Member Logs
        </DialogTitle>
        <DialogContent>
          {logs.map((log, index) => (
            <Paper key={index} elevation={3} sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1">
                <strong>Date:</strong> {log.date}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Action:</strong> {log.action}
              </Typography>
              <Typography variant="body1">
                <strong>Comment:</strong> {log.comment}
              </Typography>
            </Paper>
          ))}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', p: 3 }}>
          <Button onClick={() => setOpenLogsDialog(false)} variant="contained" color="primary" sx={{ minWidth: 100 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <ActionSuccessPopup
        open={openSuccessPopup}
        onClose={() => setOpenSuccessPopup(false)}
        action={actionType as "Denied" | "Comp"}
      />
    </Box>
  );
}
