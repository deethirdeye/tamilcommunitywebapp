import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Link } from '@mui/material';
import useStyles from '../../styles/styles';
import AppConfig from '../../AppConfig';

interface ResetPasswordProps {
  email: string;
  onBackToLogin: () => void;
  onPasswordReset: () => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ email, onBackToLogin, onPasswordReset }) => {
  const classes = useStyles();
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    verificationCode: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const validateFields = () => {
    const newErrors = {
      verificationCode: verificationCode ? '' : 'Verification code is required',
      newPassword: newPassword ? '' : 'New password is required',
      confirmPassword: confirmPassword ? '' : 'Confirm password is required',
    };

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${AppConfig.API_BASE_URL}/Account/ResetPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          VerificationCode: verificationCode,
          NewPassword: newPassword,
        }),
      });

      const data = await response.json();

      if (data.ResponseCode === 1) {
        alert('Password reset successful');
        onPasswordReset();
      } else {
        alert(data.ErrorDesc || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while resetting password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" component="h3" gutterBottom>
        Reset Password
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Verification Code"
          variant="outlined"
          fullWidth
          required
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          error={!!errors.verificationCode}
          helperText={errors.verificationCode}
          sx={{ mb: 2 }}
        />
        <TextField
          label="New Password"
          type="password"
          variant="outlined"
          fullWidth
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          error={!!errors.newPassword}
          helperText={errors.newPassword}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Confirm Password"
          type="password"
          variant="outlined"
          fullWidth
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          className={classes.submitButton}
          disabled={isLoading}
        >
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </Button>
      </form>
      <Link href="#" className={classes.forgotPassword} onClick={onBackToLogin}>
        ← Back to Login
      </Link>
    </Box>
  );
};

export default ResetPassword;
