import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SendIcon from '@mui/icons-material/Send';
import AppConfig from '../AppConfig';

interface StatItemProps {
  value: number;
  label: string;
  icon: React.ReactNode;
  color?: string;
}

interface AidRequest {
  ProcessStatus: string;
  // ... other properties
}

const StatItem: React.FC<StatItemProps> = ({ value, label, icon, color = 'primary.main' }) => (
  <Paper elevation={3} sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <Box>
      <Typography variant="h6" component="div">
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
    <Box sx={{ color: color, fontSize: 32 }}>
      {icon}
    </Box>
  </Paper>
);

const StatsOverview: React.FC = () => {
  const [stats, setStats] = useState({
    total: 0,
    underReview: 0,
    onHold: 0,
    denied: 0,
    completed: 0,
    yetToStartReview: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${AppConfig.API_BASE_URL}/Aid/GetAllBasicAidRequests`);
        const data = await response.json();
        
        if (data.ResponseData && data.ResponseData[0]) {
          const requests = data.ResponseData[0];
          
          // Calculate stats
          const newStats = {
            total: requests.length,
            underReview: requests.filter((req: AidRequest) => 
              req.ProcessStatus === "Under Review").length,
            onHold: requests.filter((req: AidRequest) => 
              req.ProcessStatus === "On Hold").length,
            denied: requests.filter((req: AidRequest) => 
              req.ProcessStatus === "Denied").length,
            completed: requests.filter((req: AidRequest) => 
              req.ProcessStatus === "Completed").length,
            yetToStartReview: requests.filter((req: AidRequest) => 
              req.ProcessStatus === "Sent").length
          };
          
          setStats(newStats);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <Box sx={{ width: '100%', mb: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={2}>
          <StatItem 
            value={stats.total} 
            label="Total Requests" 
            icon={<AssignmentIcon fontSize="inherit" />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatItem 
            value={stats.underReview} 
            label="Under Review" 
            icon={<HourglassEmptyIcon fontSize="inherit" />}
            color="#ffc658"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatItem 
            value={stats.onHold} 
            label="On Hold" 
            icon={<PauseCircleOutlineIcon fontSize="inherit" />}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatItem 
            value={stats.denied} 
            label="Denied" 
            icon={<CancelOutlinedIcon fontSize="inherit" />}
            color="#f44336"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatItem 
            value={stats.completed} 
            label="Completed" 
            icon={<CheckCircleOutlineIcon fontSize="inherit" />}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatItem 
            value={stats.yetToStartReview} 
            label="Yet to Start Review" 
            icon={<SendIcon fontSize="inherit" />}
            color="#9c27b0"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatsOverview;
