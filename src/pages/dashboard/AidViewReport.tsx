import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Chip, Paper, Grid, TextField, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, IconButton, Menu, MenuItem, Slider } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { 
  DataGrid, 
  GridColDef, 
  GridRowParams 
} from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import ApprovalConfirmationDialog from '../../components/ApprovalConfirmationDialog';
import ApprovalSuccessPopup from '../../components/ApprovalSuccessPopup';
import ActionSuccessPopup from '../../components/ActionSuccessPopup';
import DenialConfirmationDialog from '../../components/DenialConfirmationDialog';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import MemberDetails from '../dashboard/MemberDetails';
import { NonMemberDetails } from '../dashboard/NonMemberDetails';  // Import NonMemberDetails component
import AppConfig from '../../AppConfig';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';

// Mock data - replace this with actual data fetching logic


interface AidViewProps {
  requestId: string;
  onBack: () => void;
}

interface LogEntry {
  date: string;
  action: 'Completed' | 'Denied' | 'Comment Added' | 'Under Review';
  comment: string;
}

interface Comment {
  CommentID: number;
  RequestID: string;
  CommenterCode: string;
  Comment: string;
  AdminUserFlg: number;
  Status: number;
  Name: string;
  CreatedOn: string;
  AttachmentPath: string;
  RecordingPath: string;
  LastModifiedBy: string | null;
}

interface AidDetails {
  typeOfAid: string;
  description: string;
  name: string;
  dateSubmitted: string;
  aidForUserCode: string;
  memberCode: string;
  requestId: string;
  status: string;
  UserId: number;
  RecordingPath: string;
}

interface Member {
  mode: string;
  details?: any;
}

// Add this helper function at the top of your component
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'under review':
      return '#4CAF50'; // Light green for Under Review
    case 'sent':
      return '#2E7D32'; // Dark green for Sent
    case 'denied':
      return '#FFA500'; // Keep orange for Denied
    default:
      return '#FFA500'; // Default orange
  }
};

const getStatusTextColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'under review':
    case 'sent':
      return '#FFFFFF'; // White text for green backgrounds
    default:
      return '#000000'; // Black text for orange background
  }
};

// Add this helper component for audio controls
const AudioControls = ({ recordingPath }: { recordingPath: string }) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audioElement = new Audio(recordingPath);
    audioElement.addEventListener('ended', () => {
      setIsPlaying(false);
    });

    setAudio(audioElement);

    return () => {
      audioElement.pause();
      audioElement.src = '';
    };
  }, [recordingPath]);

  const handlePlayPause = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleStop = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <IconButton 
        onClick={handlePlayPause}
        sx={{ 
          backgroundColor: 'primary.main',
          color: 'white',
          '&:hover': { backgroundColor: 'primary.dark' },
          padding: '4px',
          size: 'small'
        }}
      >
        {isPlaying ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
      </IconButton>
      <IconButton 
        onClick={handleStop}
        sx={{ 
          backgroundColor: 'grey.500',
          color: 'white',
          '&:hover': { backgroundColor: 'grey.700' },
          padding: '4px',
          size: 'small'
        }}
      >
        <StopIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default function AidView({ requestId, onBack }: AidViewProps) {
  const [aidDetails, setAidDetails] = useState<AidDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [approvalDialogOpen, setApprovalDialogOpen] = React.useState(false);
  const [denialDialogOpen, setDenialDialogOpen] = React.useState(false);
  const [successPopupOpen, setSuccessPopupOpen] = React.useState(false);
  const [action, setAction] = React.useState<'Approved' | 'Denied'>('Approved');
  const [selectedMemberCode, setSelectedMemberCode] = React.useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [openLogsDialog, setOpenLogsDialog] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([
    { date: '2024-08-29', action: 'Under Review', comment: 'Reviewing documentation for visa renewal' },
  ]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedCommentText, setEditedCommentText] = useState('');
  const [editedAttachment, setEditedAttachment] = useState<File | null>(null);
  const [showMemberDetails, setShowMemberDetails] = useState(false);
  const [showNonMemberDetails, setShowNonMemberDetails] = useState(false);
  const [selectedNonMember, setSelectedNonMember] = useState<any | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isUnderReview, setIsUnderReview] = useState(false);

  const userCode = localStorage.getItem('userCode'); 
  console.log("usercode is ",userCode);
  // Or however you're storing the logged-in user's code

  const fetchAidDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${AppConfig.API_BASE_URL}/Aid/GetBasicAidByRequestId/${requestId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      
      if (data && data.ResponseData && data.ResponseData.length > 0) {
        const details = data.ResponseData[0][0];
      
        setAidDetails({
          requestId: details.RequestID,
          typeOfAid: details.AidType || 'N/A',
          description: details.Description || 'N/A',
          name: details.FullName || 'N/A',
          status: details.ProcessStatus || 'N/A',
        
          dateSubmitted: new Date(details.CreatedOn).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
            memberCode: details.UserCode || 'N/A',
          aidForUserCode: details.AidForUserCode || 'N/A',
          UserId: details.UserId || 0,
          RecordingPath: details.RecordingPath || 'N/A'
      
        });
      }

      console.log(aidDetails);
    } catch (error) {
      console.error('Failed to fetch aid details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`${AppConfig.API_BASE_URL}/Grievance/GetCommentsByRequestID/${requestId}`);
      const data = await response.json();
      console.log('Comments data:', data);
      
      if (data.ResponseCode === 1 && data.ResponseData) {
        console.log('Setting comments:', data.ResponseData);
        setComments(data.ResponseData[0]);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    fetchAidDetails();
    fetchComments();
  }, [requestId]);

  useEffect(() => {
    if (aidDetails?.RecordingPath) {
      const audioElement = new Audio(`${aidDetails.RecordingPath}`);
      
      audioElement.addEventListener('loadedmetadata', () => {
        setDuration(audioElement.duration);
      });

      audioElement.addEventListener('timeupdate', () => {
        setCurrentTime(audioElement.currentTime);
      });

      audioElement.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });

      setAudio(audioElement);

      return () => {
        audioElement.pause();
        audioElement.src = '';
      };
    }
  }, [aidDetails?.RecordingPath]);

  if (loading || !aidDetails) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  const handleApproveClick = () => {
    setApprovalDialogOpen(true);
  }

  const handleAidLogs = () => {
    setOpenLogsDialog(true);
  };

  const handleDenyClick = () => {
    setDenialDialogOpen(true);
  };

  const handleMarkAsUnderReview = async () => {
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    try {
      const response = await fetch(`${AppConfig.API_BASE_URL}/Aid/UpdateBasicAidStatus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UserId: loggedInUserId,
          RequestID: requestId,
          ProcessStatus: 'Under Review'
        })
      });

      if (response.ok) {
        setLogs([...logs, { date: new Date().toISOString().split('T')[0], action: 'Under Review', comment: 'Request marked as Under Review' }]);
        await fetchAidDetails(); // Refresh aid details
        setIsUnderReview(true); // Set the state to hide the button
      } else {
        console.error('Failed to update status to Under Review');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleMarkAsOnHold = async () => {
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    try {
      const response = await fetch(`${AppConfig.API_BASE_URL}/Aid/UpdateBasicAidStatus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UserId: loggedInUserId,
          RequestID: requestId,
          ProcessStatus: 'On Hold'
        })
      });

      if (response.ok) {
        //setLogs([...logs, { date: new Date().toISOString().split('T')[0], action: 'On Hold', comment: 'Request marked as On Hold' }]);
        await fetchAidDetails(); // Refresh aid details
      } else {
        console.error('Failed to update status to On Hold');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleApprovalConfirm = async (comment: string) => {
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    try {
      const response = await fetch(`${AppConfig.API_BASE_URL}/Aid/UpdateBasicAidStatus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UserId: loggedInUserId,
          RequestID: requestId,
          ProcessStatus: 'Completed'
        })
      });

      if (response.ok) {
        setApprovalDialogOpen(false);
        setAction('Approved');
        setSuccessPopupOpen(true);
        setLogs([...logs, { date: new Date().toISOString().split('T')[0], action: 'Completed', comment }]);
        await fetchAidDetails(); // Refresh aid details
      } else {
        console.error('Failed to update status to Completed');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !userCode) {
      console.error('Comment or user code missing');
      return;
    }

    try {
      let attachmentPath = '';
      
      // First upload the file if there is one
      if (attachment) {
        const fileFormData = new FormData();
        fileFormData.append('File', attachment);

        const uploadResponse = await fetch(`${AppConfig.API_BASE_URL}/Aid/UploadAnyFile`, {
          method: 'POST',
          body: fileFormData
        });

        if (!uploadResponse.ok) {
          throw new Error(`Upload failed: ${uploadResponse.statusText}`);
        }

        const uploadData = await uploadResponse.json();
        if (uploadData.filePath) {
          attachmentPath = uploadData.filePath;
        } else {
          console.error('File upload failed');
          return;
        }
      }
      //const userCode = localStorage.getItem('userCode'); 
      // Then add the comment with the file path
      const userCode = localStorage.getItem('userCode') || '';
      const commentData = {
        RequestID: requestId,
        Comment: newComment.trim(),
        CommenterCode: userCode,
        AdminUserFlg: 1,
        AttachmentPath: attachmentPath || '',
        RecordingPath: ''
      };

      const response = await fetch(`${AppConfig.API_BASE_URL}/Grievance/AddComment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(commentData)
      });

      const data = await response.json();

      if (data.ResponseCode === 1) {
        const newCommentObj: Comment = {
          CommentID: comments.length + 1,
          RequestID: requestId,
          CommenterCode: userCode,
          Comment: newComment.trim(),
          AdminUserFlg: 1,
          Status: 1,
          Name: newComment.trim(),
          CreatedOn: new Date().toISOString(),
          AttachmentPath: attachmentPath || '',
          RecordingPath: '',
          LastModifiedBy: null,
        };
        setComments([...comments, newCommentObj]);
        setNewComment('');
        setAttachment(null);
      } else {
        console.error('Failed to add comment:', data.Message);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleAttachmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setAttachment(event.target.files[0]);
    }
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, commentId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedCommentId(commentId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCommentId(null);
  };

  const handleEditComment = () => {
    handleMenuClose();
    const commentToEdit = comments.find(comment => comment.CommentID === selectedCommentId);
    if (commentToEdit) {
      setEditingCommentId(selectedCommentId);
      setEditedCommentText(commentToEdit.Comment);
      setEditedAttachment(commentToEdit.AttachmentPath ? new File([], '') : null);
    }
  };

  const handleSaveEdit = () => {
    setComments(comments.map(comment => 
      comment.CommentID === editingCommentId 
        ? { ...comment, Comment: editedCommentText, AttachmentPath: editedAttachment ? editedAttachment.name : '', LastModifiedBy: userCode } 
        : comment
    ));
    setEditingCommentId(null);
    setEditedCommentText('');
    setEditedAttachment(null);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedCommentText('');
    setEditedAttachment(null);
  };

  const handleDeleteComment = () => {
    handleMenuClose();
    if (selectedCommentId !== null) {
      setComments(comments.filter(comment => comment.CommentID !== selectedCommentId));
    }
  };

  
  const handleMemberDetails = async () => {
    if (!aidDetails?.memberCode) {
      console.error('No member code available');
      return;
    }

    try {
      // First try to get user ID from the member code
     

      // Then fetch member details using the user ID
      const response = await fetch(`${AppConfig.API_BASE_URL}/BasicDetails/GetByUserId/${aidDetails.UserId}`);
      const data = await response.json();
      
      if (data.ResponseCode === 1) {
        setSelectedMember({
          mode: 'view',
          details: data.ResponseData[0]
        });
        setShowMemberDetails(true);
      } else {
        throw new Error(data.Message || 'Failed to fetch member details');
      }
    } catch (error) {
      console.error('Error fetching member details:', error);
      alert('Error accessing member details');
    }
  };

  const handleDenialConfirm = async (comment: string) => {
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    try {
      const response = await fetch(`${AppConfig.API_BASE_URL}/Aid/UpdateBasicAidStatus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UserId: loggedInUserId,
          RequestID: requestId,
          ProcessStatus: 'Denied'
        })
      });

      if (response.ok) {
        setDenialDialogOpen(false);
        setAction('Denied');
        setSuccessPopupOpen(true);
        setLogs([...logs, { date: new Date().toISOString().split('T')[0], action: 'Denied', comment }]);
        await fetchAidDetails(); // Refresh aid details
      } else {
        console.error('Failed to update status to Denied');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleComplete = () => {
    console.log(`Completing request ${requestId}`);
    setLogs([...logs, { date: new Date().toISOString().split('T')[0], action: 'Completed', comment: 'Request marked as Completed' }]);
  };

  const handleSuccessPopupClose = () => {
    setSuccessPopupOpen(false);
    onBack();
  }

  const handleDeny = () => {
    console.log(`Denying request ${requestId}`);
    setLogs([...logs, { date: new Date().toISOString().split('T')[0], action: 'Denied', comment: 'Request Denied' }]);
  };

  const handleEditAttachmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setEditedAttachment(event.target.files[0]);
    }
  };

  const handleRemoveEditAttachment = () => {
    setEditedAttachment(null);
  };

  const handleApplicantDetails = () => {
    setShowMemberDetails(true);
  };

  const handleMemberDetailsBack = () => {
    setShowMemberDetails(false);
  };

  // const handleUserCodeClick = () => {
  //   if (aidDetails.UserCode.startsWith('TC')) {
  //     setShowMemberDetails(true);
  //   } else if (aidDetails.UserCode.startsWith('NM')) {
  //     // Here, you would typically fetch the non-member details based on the UserCode
  //     // For this example, we'll create a mock non-member object
  //     const mockNonMember = {
       
  //       name: aidDetails.name,
      
      
  //       emergencyContactPersonName: 'Emergency Contact',
  //       emergencyContactPersonMobile: '1234567890',
  //       currentAddress: 'Current Address'
  //     };
  //     setSelectedNonMember(mockNonMember);
  //     setShowNonMemberDetails(true);
  //   }
  // };

  const handleNonMemberDetailsBack = () => {
    setShowNonMemberDetails(false);
  };

  const handlePlayPause = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleStop = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const handleTimeChange = (event: Event, newValue: number | number[]) => {
    if (audio && typeof newValue === 'number') {
      audio.currentTime = newValue;
      setCurrentTime(newValue);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // if (showMemberDetails && selectedMember?.details) {
  //   return (
  //     <MemberDetails 
  //       memberCode={aidDetails.memberCode}
  //       userId={selectedMember.details.UserId || aidDetails.memberCode} // Use the correct user ID
  //       onBack={() => {
  //         setShowMemberDetails(false);
  //         setSelectedMember(null);
  //       }}
  //     />
  //   );
  // }

  console.log('Current comments state:', comments);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Button onClick={onBack}>← Back</Button>
        <Typography variant="h5">Aid Report</Typography>
        <Box>
          {!isUnderReview && (
            <Button variant="contained" color="primary" onClick={handleMarkAsUnderReview} sx={{ mr: 2 }}>
              Mark As Under Review
            </Button>
          )}
        </Box>
      </Box>
      
      <Paper elevation={3} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Aid Details</Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}><Typography><strong>Type of Aid:</strong> {aidDetails.typeOfAid}</Typography></Grid>
            <Grid item xs={6}><Typography><strong>Name:</strong> {aidDetails.name}</Typography></Grid>
            <Grid item xs={6}><Typography><strong>Date Submitted:</strong> {aidDetails.dateSubmitted}</Typography></Grid>
            <Grid item xs={6}><Typography><strong>Member Code:</strong> {aidDetails.memberCode}</Typography></Grid>
            <Grid item xs={6}><Typography><strong>Aid For User Code:</strong> {aidDetails.aidForUserCode}</Typography></Grid>
            <Grid item xs={6}>
              <Typography>
                <strong>Status:</strong>{' '}
                <Box
                  sx={{
                    backgroundColor: getStatusColor(aidDetails.status),
                    color: getStatusTextColor(aidDetails.status),
                    padding: '6px 16px',
                    borderRadius: '16px',
                    fontWeight: 500,
                    display: 'inline-block'
                  }}
                >
                  {aidDetails.status}
                </Box>
              </Typography>
            </Grid>
          </Grid>
          
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Description</Typography>
          <Typography sx={{ whiteSpace: 'pre-line', mb: 2 }}>{aidDetails.description}</Typography>
          
          {aidDetails?.RecordingPath && aidDetails.RecordingPath !== 'N/A' && (
            <Box sx={{ mt: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Recording</Typography>
              <AudioControls recordingPath={aidDetails.RecordingPath} />
            </Box>
          )}
          
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Comments</Typography>
          <List sx={{ borderRadius: 1, p: 2 }}>
            {comments.map((comment) => (
              <ListItem 
                key={`cmt-${comment.CommentID}`}
                alignItems="flex-start" 
                sx={{ 
                  mb: 1, 
                  borderRadius: 1,
                  backgroundColor: '#f5f5f5',
                  color: '#333',
                  '& .MuiListItemText-primary': {
                    '& .MuiTypography-root': {
                      color: '#333',
                    }
                  },
                  '& .MuiListItemText-secondary': {
                    color: 'rgba(0, 0, 0, 0.6)',
                  },
                  boxShadow: 1,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3,
                    backgroundColor: '#eeeeee',
                  },
                  padding: 2
                }}
              >
                <ListItemText
                  primary={
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {comment.Name|| 'Anonymous'}
                      </Typography>
                      <Typography variant="body1">{comment.Comment}</Typography>
                      {comment.RecordingPath && comment.RecordingPath !== '' && (
                        <Box sx={{ mt: 1 }}>
                          <AudioControls recordingPath={comment.RecordingPath} />
                        </Box>
                      )}
                    </Box>
                  }
                  secondary={
                    <Typography variant="caption">
                      {comment.CreatedOn ? new Date(comment.CreatedOn.replace('T', ' ')).toLocaleString() : 'No date'}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Paper>
    </Box>
  );
}
