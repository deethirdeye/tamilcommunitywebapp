import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
} from '@mui/material';

interface DenialConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (comment: string) => void;
  requestId: string;
  name: string;
  typeOfAid: string;
}

export default function DenialConfirmationDialog({
  open,
  onClose,
  onConfirm,
  requestId,
  name,
  typeOfAid,
}: DenialConfirmationDialogProps) {
  const [comment, setComment] = React.useState('');

  const handleConfirm = () => {
    onConfirm(comment);
    setComment('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: '#f44336', color: 'white', textAlign: 'center' }}>
        Denial Confirmation
      </DialogTitle>
      <DialogContent>
        <Typography variant="h6" sx={{ mt: 2, mb: 3, textAlign: 'center' }}>
          Are you sure you want to deny this aid request?
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography><strong>Request ID:</strong> {requestId}</Typography>
          <Typography><strong>Name:</strong> {name}</Typography>
          <Typography><strong>Type of Aid:</strong> {typeOfAid}</Typography>
        </Box>
        {/* <TextField
          label="Reviewer Comments"
          multiline
          rows={4}
          fullWidth
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Please provide a reason for denying this aid request."
        /> */}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', p: 3 }}>
        <Button onClick={onClose} variant="contained" color="inherit" sx={{ minWidth: 100 }}>
          Cancel
        </Button>
        <Button onClick={handleConfirm} variant="contained" color="error" sx={{ minWidth: 100 }}>
          Yes, Deny
        </Button>
      </DialogActions>
    </Dialog>
  );
}
