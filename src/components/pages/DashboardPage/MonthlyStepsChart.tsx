import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { auth } from '../../../config/firebase';
import { useMonthlyStepsQuery } from '../../../hooks/useMonthlyStepsQuery';

interface ChartData {
  date: string;
  steps: number;
}

export const MonthlyStepsChart = () => {
  const [user] = useAuthState(auth);
  const {
    data: monthlySteps,
    isLoading,
    error,
  } = useMonthlyStepsQuery(user || null);

  const content = isLoading ? (
    <IsLoading />
  ) : error || !monthlySteps ? (
    <ErrorContent />
  ) : (
    <MonthlyStepsChartContent monthlySteps={monthlySteps} />
  );

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          今月の歩数
        </Typography>
        {content}
      </CardContent>
    </Card>
  );
};

const IsLoading = () => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" p={2}>
      <CircularProgress />
      <Typography sx={{ ml: 2 }}>月間歩数データを取得中...</Typography>
    </Box>
  );
};

const ErrorContent = () => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" p={2}>
      <Typography color="error">月間歩数データの取得に失敗しました</Typography>
    </Box>
  );
};

const MonthlyStepsChartContent = ({
  monthlySteps,
}: {
  monthlySteps: ChartData[];
}) => {
  const dailyGoal = 3000;
  const totalSteps = monthlySteps.reduce((sum, day) => sum + day.steps, 0);
  const daysWithSteps = monthlySteps.filter((day) => day.steps > 0).length;
  const averageSteps =
    daysWithSteps > 0 ? Math.round(totalSteps / daysWithSteps) : 0;
  const goalAchievementDays = monthlySteps.filter(
    (day) => day.steps >= dailyGoal
  ).length;
  const maxSteps = Math.max(...monthlySteps.map((day) => day.steps));
  const yAxisMax = Math.max(maxSteps, dailyGoal + 1000);

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="body2" color="textSecondary">
          総歩数: {totalSteps.toLocaleString()} 歩
        </Typography>
        <Typography variant="body2" color="textSecondary">
          平均: {averageSteps.toLocaleString()} 歩/日
        </Typography>
        <Typography variant="body2" color="textSecondary">
          目標達成: {goalAchievementDays}日 (目標: {dailyGoal.toLocaleString()}{' '}
          歩/日)
        </Typography>
      </Box>
      <Box sx={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <BarChart
            data={monthlySteps}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" fontSize={12} interval="preserveStartEnd" />
            <YAxis
              fontSize={12}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              domain={[0, yAxisMax]}
            />
            <Tooltip
              formatter={(value: number) => [value.toLocaleString(), '歩数']}
              labelStyle={{ color: '#000' }}
            />
            <Bar dataKey="steps" fill="#1976d2" radius={[2, 2, 0, 0]} />
            <ReferenceLine
              y={dailyGoal}
              stroke="#ff5722"
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{
                value: `目標: ${dailyGoal.toLocaleString()}歩`,
                position: 'insideTopLeft',
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};
