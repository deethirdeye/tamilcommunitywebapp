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

interface ApprovalConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (comment: string) => void;
  requestId: string;
  name: string;
  typeOfAid: string;
}

export default function ApprovalConfirmationDialog({
  open,
  onClose,
  onConfirm,
  requestId,
  name,
  typeOfAid,
}: ApprovalConfirmationDialogProps) {
  const [comment, setComment] = React.useState('');

  const handleConfirm = () => {
    onConfirm(comment);
    setComment('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: '#4caf50', color: 'white', textAlign: 'center' }}>
        Approval Confirmation
      </DialogTitle>
      <DialogContent>
        <Typography variant="h6" sx={{ mt: 2, mb: 3, textAlign: 'center' }}>
          Are you sure you want to mark this request as completed?
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
          placeholder="We have reviewed your request concerning the expired visa and are pleased to inform you that your application for urgent assistance has been approved. Our team is working to provide the necessary support for your situation."
        /> */}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', p: 3 }}>
        <Button onClick={onClose} variant="contained" color="inherit" sx={{ minWidth: 100 }}>
          Cancel
        </Button>
        <Button onClick={handleConfirm} variant="contained" color="success" sx={{ minWidth: 100 }}>
          Yes, Mark as completed
        </Button>
      </DialogActions>
    </Dialog>
  );
}
