import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../config/firebase';
import { useMonthlyStepsQuery } from '../../../hooks/useMonthlyStepsQuery';
import { useStepGoalQuery } from '../../../hooks/useStepGoalQuery';

export const AchievementForecast = () => {
  const [user] = useAuthState(auth);
  const { data: monthlySteps, isLoading, error } = useMonthlyStepsQuery(user || null);
  const { data: stepGoal } = useStepGoalQuery(user || null);

  if (isLoading) {
    return (
      <Box display="flex" alignItems="center" color="inherit">
        <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
        <Typography color="inherit">計算中...</Typography>
      </Box>
    );
  }

  if (error || !monthlySteps) {
    return (
      <Typography variant="body2" color="error">
        エラー
      </Typography>
    );
  }

  const dailyGoal = stepGoal?.dailyStepGoal || 3000;
  const totalSteps = monthlySteps.reduce((sum, day) => sum + day.steps, 0);
  const validDaysCount = monthlySteps.filter((day) => day.steps > 0).length;
  const totalDays = monthlySteps.length;
  const dailyAverage = validDaysCount > 0 ? totalSteps / validDaysCount : 0;
  const predictedFinal = dailyAverage * totalDays;
  const monthlyGoal = dailyGoal * totalDays;
  const willAchieve = predictedFinal >= monthlyGoal;

  return (
    <Typography variant="body2" color={willAchieve ? 'success.main' : 'error.main'}>
      {willAchieve ? '達成見込みあり' : '達成見込みなし'}
    </Typography>
  );
};
