import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Link } from '@mui/material';
import useStyles from '../../styles/styles';
import AppConfig from '../../AppConfig';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
  onVerificationSent: (email: string) => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBackToLogin, onVerificationSent }) => {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${AppConfig.API_BASE_URL}/Account/forgot-password-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.ResponseCode === 1) {
        alert('Verification code has been sent to your email');
        onVerificationSent(email);
      } else {
        alert(data.ErrorDesc || 'This email is not registered with us');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('This email is not registered with us');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" component="h3" gutterBottom>
        Forgot Password?
      </Typography>
      <Typography paragraph>
        Enter your Email ID associated with your account and we'll send you a verification code.
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email ID"
          variant="outlined"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!emailError}
          helperText={emailError}
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          className={classes.submitButton}
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send Verification Code'}
        </Button>
      </form>
      <Link href="#" className={classes.forgotPassword} onClick={onBackToLogin}>
        ← Back to Login
      </Link>
    </Box>
  );
};

export default ForgotPassword;
