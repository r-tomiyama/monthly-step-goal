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
  return (
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
          />
          <Tooltip
            formatter={(value: number) => [value.toLocaleString(), '歩数']}
            labelStyle={{ color: '#000' }}
          />
          <Bar dataKey="steps" fill="#1976d2" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};
