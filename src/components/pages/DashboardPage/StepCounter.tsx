import { CheckCircle, DirectionsWalk } from '@mui/icons-material';
import {
  Box,
  CircularProgress,
  LinearProgress,
  Typography,
} from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../config/firebase';
import { useStepGoalQuery } from '../../../hooks/useStepGoalQuery';
import { useStepsQuery } from '../../../hooks/useStepsQuery';

export const StepCounter = () => {
  const [user] = useAuthState(auth);
  const { data: steps, isLoading, error } = useStepsQuery(user || null);
  const { data: stepGoal } = useStepGoalQuery(user || null);

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

  const dailyGoal = stepGoal?.dailyStepGoal || 3000;
  const currentSteps = steps || 0;
  const achievementRate = Math.min((currentSteps / dailyGoal) * 100, 100);
  const isGoalAchieved = currentSteps >= dailyGoal;

  return (
    <Box display="flex" alignItems="center" color="inherit" gap={1}>
      {isGoalAchieved ? (
        <CheckCircle sx={{ color: 'success.main' }} />
      ) : (
        <DirectionsWalk />
      )}
      <Box>
        <Typography color="inherit" variant="body2">
          今日: {currentSteps.toLocaleString()}歩 / {dailyGoal.toLocaleString()}
          歩
        </Typography>
        <Box sx={{ width: 120, mt: 0.5 }}>
          <LinearProgress
            variant="determinate"
            value={achievementRate}
            color={isGoalAchieved ? 'success' : 'primary'}
            sx={{ height: 4, borderRadius: 2 }}
          />
        </Box>
      </Box>
    </Box>
  );
};
