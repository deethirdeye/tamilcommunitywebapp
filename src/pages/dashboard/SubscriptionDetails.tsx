import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Grid,
  Link,
  Chip
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

interface SubscriptionDetailsProps {
  subscription: {
    id: number;
    memberCode: string;
    name: string;
    subscriptionPeriod: string;
    startDate: string;
    endDate: string;
    status: string;
    paymentAmount?: number;
    paymentDate?: string;
    paymentMethod?: string;
    receiptUrl?: string;
  };
  onBack: () => void;
  onApprove: (id: number) => void;
  onDeny: (id: number) => void;
}

const DetailItem = ({ label, value }: { label: string; value: string | number | React.ReactNode }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Typography variant="body2" color="textSecondary">{label}</Typography>
    <Typography variant="body1" sx={{ wordBreak: 'break-word', maxWidth: '100%' }}>
      {value}
    </Typography>
  </Grid>
);

export const SubscriptionDetails: React.FC<SubscriptionDetailsProps> = ({ 
  subscription, 
  onBack,
  onApprove,
  onDeny
}) => {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, mr: 5}}>
        <Button onClick={onBack}>← Back</Button>
        <Typography variant="h5">Subscription Details</Typography>
      </Box>
      <Paper elevation={3} sx={{ flexGrow: 1, overflow: 'auto', p: 3 }}>
        <Grid container spacing={3}>
          <DetailItem label="Member Code" value={subscription.memberCode} />
          <DetailItem label="Name" value={subscription.name} />
          <DetailItem label="Subscription Period" value={subscription.subscriptionPeriod} />
          <DetailItem label="Start Date" value={subscription.startDate} />
          <DetailItem label="End Date" value={subscription.endDate} />
          <DetailItem 
            label="Status" 
            value={
              <Chip
                label={subscription.status}
                color={
                  subscription.status === 'Active' 
                    ? 'success' 
                    : subscription.status === 'Approval Pending' 
                      ? 'warning' 
                      : 'error'
                }
                size="small"
              />
            }
          />
          
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>Payment Details</Typography>
          </Grid>
          
          <DetailItem label="Payment Amount" value={`$${subscription.paymentAmount}`} />
          <DetailItem label="Payment Date" value={subscription.paymentDate || ''} />
          <DetailItem label="Payment Method" value={subscription.paymentMethod || ''} />
          
          {subscription.receiptUrl && (
            <Grid item xs={12}>
              <Link href={subscription.receiptUrl} target="_blank" rel="noopener">
                <Button startIcon={<DownloadIcon />}>
                  View Receipt
                </Button>
              </Link>
            </Grid>
          )}

          {subscription.status === 'Approval Pending' && (
            <Grid item xs={12} sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button 
                variant="outlined" 
                color="error" 
                onClick={() => onDeny(subscription.id)}
              >
                Deny
              </Button>
              <Button 
                variant="contained" 
                color="success" 
                onClick={() => onApprove(subscription.id)}
              >
                Approve
              </Button>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Box>
  );
};
