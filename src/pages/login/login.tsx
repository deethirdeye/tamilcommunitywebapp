import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Link } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useStyles from '../../styles/styles';
import { useNavigate } from 'react-router-dom';
import AppConfig from '../../AppConfig';
import ImageConfig from '../../ImageConfig';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';

const Login: React.FC = () => {
  const classes = useStyles();
  const theme = createTheme();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
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

  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
    
  //   try {
  //     const response = await fetch(`${AppConfig.API_BASE_URL}/Account/login`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         MobileNumber: mobileNumber,
  //         Password: password,
  //       }),
  //     });

  //     const data = await response.json();
      
  //     if (data.ResponseCode === 1) {
  //       const userData = data.ResponseData[0];
  //       localStorage.setItem('userToken', userData.Token);
  //       localStorage.setItem('loggedInUserId', userData.UserID.toString());
  //       localStorage.setItem('userCode', userData.UserCode);
  //       localStorage.setItem('token', userData.Token);
  //       navigate('/dashboard', { replace: true });
  //     } else {
  //       alert(data.ErrorDesc || 'Login failed. Please try again.');
  //     }
  //   } catch (error) {
  //     console.error('Login error:', error);
  //     alert('An error occurred during login. Please try again.');
  //   }
  // };

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
          alert('Only active Tamil Community members are allowed to login.');
        }
      } else {
        alert(data.ErrorDesc || 'Invalid credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login. Please try again.');
    }
  };
  

  return (
    <ThemeProvider theme={theme}>
      <Box 
        className={classes.loginContainer} 
        sx={{ 
          backgroundImage: `url("${ImageConfig.IMAGE_BASE_URL}images/LoginBG.PNG")`, // Replace with your image path
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay for opacity
            zIndex: 1,
          }
        }}
      >
        <Box 
          sx={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slightly more opaque white background
            padding: 4, 
            borderRadius: 2, 
            boxShadow: 5, // Increased shadow for prominence
            position: 'relative', // Ensure the box is positioned relative to the parent
            zIndex: 2, // Ensure the box is above the overlay
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
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                  sx={{ borderRadius: 1 }} // Rounded corners
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  sx={{ borderRadius: 1 }} // Rounded corners
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  className={classes.submitButton}
                  sx={{ 
                    backgroundColor: '#2A5298', 
                    '&:hover': { backgroundColor: '#1E3C72' } // Button color
                  }}
                >
                  Sign In
                </Button>
              </form>
              <Link 
                href="#" 
                className={classes.forgotPassword} 
                onClick={handleForgotPasswordClick}
                sx={{ color: '#2A5298', textAlign: 'center', display: 'block', marginTop: 2 }} // Center align the link
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
