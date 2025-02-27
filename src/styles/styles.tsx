import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createUseStyles } from 'react-jss';

// Create your custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#007bff', // Your desired primary color
    },
  },
});
const drawerWidth = 250;
// JSS styles using react-jss
const useStyles = createUseStyles({
  loginContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#BAE4FF',
  },
  illustration: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationImg: {
    maxWidth: '80%',
    height: 'auto',
  },
  loginBox: {
    flex: 1,
    maxWidth: '400px',
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    marginRight: '60px',
  },
  submitButton: {
    padding: '12px',
    backgroundColor: theme.palette.primary.main, // Uses theme color
    color: '#fff',
    marginTop: '20px', 
    marginBottom: '20px',// Added top margin of 40px
    '&:hover': {
      backgroundColor: '#0056b3',
    },
  },
  forgotPassword: {
    textAlign: 'right',
    marginTop: '30px',
    paddingTop: '20px',
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  dashboardContainer: {
    padding: '20px',
  },
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: '20px',
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
});

export default useStyles;
