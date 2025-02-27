import React, { useEffect } from 'react';
import { Box, Typography, Fade } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

interface ActionSuccessPopupProps {
  open: boolean;
  onClose: () => void;
  action: 'Denied' | 'Comp';
}

const ActionSuccessPopup: React.FC<ActionSuccessPopupProps> = ({ open, onClose, action }) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  return (
    <Fade in={open}>
      <Box
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          borderRadius: '16px',
          padding: '20px 40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 9999,
        }}
      >
        <CheckCircleOutlineIcon sx={{ fontSize: 60, color: '#4caf50', mb: 2 }} />
        <Typography variant="h6" component="div">
          {action === 'Denied' ? 'Denied' : 'Completed'}
        </Typography>
      </Box>
    </Fade>
  );
};

export default ActionSuccessPopup;
