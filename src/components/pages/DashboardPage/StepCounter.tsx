import { DirectionsWalk } from '@mui/icons-material';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../config/firebase';
import { useStepsQuery } from '../../../hooks/useStepsQuery';

export const StepCounter = () => {
  const [user] = useAuthState(auth);
  const { data: steps, isLoading, error } = useStepsQuery(user || null);

  if (isLoading) {
    return (
      <Box display="flex" alignItems="center" color="inherit">
        <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
        <Typography color="inherit">取得中...</Typography>
      </Box>
    );
  }

  if (error || typeof steps === 'undefined') {
    return (
      <Box display="flex" alignItems="center" color="inherit">
        <DirectionsWalk sx={{ mr: 1 }} />
        <Typography color="inherit">エラー</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" alignItems="center" color="inherit">
      <DirectionsWalk sx={{ mr: 1 }} />
      <Typography color="inherit">
        今日: {steps?.toLocaleString() || '0'}歩
      </Typography>
    </Box>
  );
};
