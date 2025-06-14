import { DirectionsWalk } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../config/firebase';
import { useStepsQuery } from '../../../hooks/useStepsQuery';

export const StepCounter = () => {
  const [user] = useAuthState(auth);
  const { data: steps, isLoading, error } = useStepsQuery(user || null);

  const content = isLoading ? (
    <IsLoading />
  ) : error || typeof steps === 'undefined' ? (
    <ErrorContent />
  ) : (
    <StepCounterContent steps={steps} />
  );

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>{content}</CardContent>
    </Card>
  );
};

const IsLoading = () => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" p={2}>
      <CircularProgress />
      <Typography sx={{ ml: 2 }}>歩数を取得中...</Typography>
    </Box>
  );
};

const ErrorContent = () => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" p={2}>
      <DirectionsWalk sx={{ fontSize: 40, mr: 2, color: 'error.main' }} />
      <Typography variant="h6" color="error">
        エラーが発生しました
      </Typography>
    </Box>
  );
};

const StepCounterContent = ({ steps }: { steps: number }) => {
  const dailyGoal = 3000;
  const achievement = (steps / dailyGoal) * 100;

  return (
    <Box display="flex" alignItems="center">
      <DirectionsWalk sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
      <Box>
        <Typography variant="h6" color="textSecondary">
          本日の歩数
        </Typography>
        <Typography variant="h4" color="primary">
          {steps?.toLocaleString() || '0'} 歩
        </Typography>
        <Typography variant="body2" color="textSecondary">
          目標: {dailyGoal.toLocaleString()} 歩 (
          {achievement >= 100 ? '達成!' : `${achievement.toFixed(0)}%`})
        </Typography>
      </Box>
    </Box>
  );
};
