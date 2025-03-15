import React from 'react';
import { Box, Typography, Button, Paper, Grid } from '@mui/material';

interface NonMember {
  userCode: string;
  name: string;
  email: string;
  mobileNumber: string;
  emergencyContactPersonName: string;
  emergencyContactPersonMobile: string;
  addedByMemberCode: string;
}

interface NonMemberDetailsProps {
  nonMember: NonMember;
  onBack: () => void;
}

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Typography variant="body2" color="textSecondary">{label}</Typography>
    <Typography variant="body1" sx={{ wordBreak: 'break-word', maxWidth: '100%' }}>{value}</Typography>
  </Grid>
);

export const NonMemberDetails: React.FC<NonMemberDetailsProps> = ({ nonMember, onBack }) => {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, mr: 5}}>
        <Button onClick={onBack}>← Back</Button>
        <Typography variant="h5">Non Member Details</Typography>
      </Box>
      <Paper elevation={3} sx={{ flexGrow: 1, overflow: 'auto', p: 3 }}>
        <Grid container spacing={2}>
          <DetailItem label="Non Member User Code" value={nonMember.userCode} />
          <DetailItem label="Name" value={nonMember.name} />
          <DetailItem label="Email" value={nonMember.email} />
          <DetailItem label="Mobile Number" value={nonMember.mobileNumber} />
          <DetailItem label="Emergency Contact Person" value={nonMember.emergencyContactPersonName} />
          <DetailItem label="Emergency Contact Mobile" value={nonMember.emergencyContactPersonMobile} />
          <DetailItem label="Added by" value={nonMember.addedByMemberCode} />
        </Grid>
      </Paper>
    </Box>
  );
};
