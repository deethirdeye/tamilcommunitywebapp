// SignOutButton.tsx
import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SignOutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Add your sign-out logic here (e.g., clearing tokens, state, etc.)
    navigate('/login'); // Redirect to the login page after signing out
  };

  return (
    <Button 
      variant="contained" 
      color="secondary" 
      onClick={handleSignOut} 
      sx={{ margin: 2, width: '90%' }} // Adjust styling as needed
    >
      Sign Out
    </Button>
  );
};

export default SignOutButton;