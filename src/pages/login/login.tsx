import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Link, InputAdornment, IconButton } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useStyles from '../../styles/styles';
import { useNavigate } from 'react-router-dom';
import AppConfig from '../../AppConfig';
import ImageConfig from '../../ImageConfig';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Login: React.FC = () => {
  const classes = useStyles();
  const theme = createTheme();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
  };

  const handleBackToLoginClick = () => {
    setShowForgotPassword(false);
    setShowResetPassword(false);
  };

  const handleVerificationSent = (email: string) => {
    setResetEmail(email);
    setShowResetPassword(true);
  };

  const handlePasswordReset = () => {
    setShowForgotPassword(false);
    setShowResetPassword(false);
  };

  // Handle mobile number input - only numbers allowed, max 15 characters
  const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and limit to 15 characters
    if (/^\d{0,15}$/.test(value)) {
      setMobileNumber(value);
    }
  };

  // Toggle password visibility
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${AppConfig.API_BASE_URL}/Account/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          MobileNumber: mobileNumber,
          Password: password,
        }),
      });

      const data = await response.json();

      if (data.ResponseCode === 1) {
        const userData = data.ResponseData[0];

        // Check if RoleID is greater than 1
        if (userData.RoleID > 1 && userData.UserStatus === 1) {
          localStorage.setItem('userToken', userData.Token);
          localStorage.setItem('loggedInUserId', userData.UserID.toString());
          localStorage.setItem('userCode', userData.UserCode);
          localStorage.setItem('token', userData.Token);
          navigate('/dashboard', { replace: true });
        } else {
          // If RoleID is 1 or less, show an error
          setErrorMessage('Only active Tamil Community members are allowed to login.');
        }
      } else {
        setErrorMessage(data.ErrorDesc || 'Invalid credentials.Try again or click Forgot password to reset it.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An error occurred during login. Please try again.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box 
        className={classes.loginContainer} 
        sx={{ 
          backgroundImage: `url("${ImageConfig.IMAGE_BASE_URL}images/LoginBG.PNG")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          //position: 'relative',
          // '&::before': {
          //   content: '""',
          //   position: 'absolute',
          //   top: 0,
          //   left: 0,
          //   right: 0,
          //   bottom: 0,
          //   backgroundColor: 'rgba(0, 0, 0, 0.5)',
          //   zIndex: 1,
          // }
        }}
      >
        <Box 
          sx={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: 4, 
            borderRadius: 2, 
            boxShadow: 5,
            //position: 'relative',
            zIndex: 2,
          }}
        >
          {showForgotPassword && !showResetPassword ? (
            <ForgotPassword
              onBackToLogin={handleBackToLoginClick}
              onVerificationSent={handleVerificationSent}
            />
          ) : showResetPassword ? (
            <ResetPassword
              email={resetEmail}
              onBackToLogin={handleBackToLoginClick}
              onPasswordReset={handlePasswordReset}
            />
          ) : (
            <>
              <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  color: '#1E3C72', 
                  textAlign: 'center', 
                  fontFamily: 'Arial, sans-serif', 
                  fontWeight: 'bold' 
                }}
              >
                Tamil Community Admin Portal
              </Typography>
              <form onSubmit={handleLogin}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  variant="outlined"
                  margin="normal"
                  value={mobileNumber}
                  onChange={handleMobileNumberChange}
                  required
                  inputProps={{
                    maxLength: 15,
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                  }}
                  sx={{ borderRadius: 1 }}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  sx={{ borderRadius: 1 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {errorMessage && (
                  <Typography
                    variant="body2"
                    color="error"
                    sx={{ mt: 1, textAlign: 'center' }}
                  >
                    {errorMessage}
                  </Typography>
                )}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  className={classes.submitButton}
                  sx={{ 
                    backgroundColor: '#2A5298', 
                    '&:hover': { backgroundColor: '#1E3C72' }
                  }}
                >
                  Sign In
                </Button>
              </form>
              <Link 
                href="#" 
                className={classes.forgotPassword} 
                onClick={handleForgotPasswordClick}
                sx={{ color: '#2A5298', textAlign: 'center', display: 'block', marginTop: 2 }}
              >
                Forgot Password?
              </Link>
            </>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Login;