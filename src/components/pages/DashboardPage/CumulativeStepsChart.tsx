import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  Area,
  AreaChart,
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

interface CumulativeChartData {
  date: string;
  cumulativeSteps: number;
}

export const CumulativeStepsChart = () => {
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
    <CumulativeStepsChartContent monthlySteps={monthlySteps} />
  );

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          今月の累積歩数
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
      <Typography sx={{ ml: 2 }}>累積歩数データを取得中...</Typography>
    </Box>
  );
};

const ErrorContent = () => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" p={2}>
      <Typography color="error">累積歩数データの取得に失敗しました</Typography>
    </Box>
  );
};

const CumulativeStepsChartContent = ({
  monthlySteps,
}: {
  monthlySteps: ChartData[];
}) => {
  const dailyGoal = 3000;

  const today = new Date();
  const todayStr = today.toLocaleDateString('ja-JP', {
    month: '2-digit',
    day: '2-digit',
  });

  const validStepsData = monthlySteps.filter(
    (day) => day.steps > 0 || day.date >= todayStr
  );

  const cumulativeData: CumulativeChartData[] = validStepsData.reduce(
    (acc: CumulativeChartData[], day, index) => {
      const cumulativeSteps =
        index === 0 ? day.steps : acc[index - 1].cumulativeSteps + day.steps;
      acc.push({
        date: day.date,
        cumulativeSteps,
      });
      return acc;
    },
    []
  );

  const totalSteps =
    cumulativeData[cumulativeData.length - 1]?.cumulativeSteps || 0;
  const validDaysCount = validStepsData.length;
  const monthlyGoal = dailyGoal * validDaysCount;
  const achievementRate = (totalSteps / monthlyGoal) * 100;
  const maxCumulativeSteps = Math.max(totalSteps, monthlyGoal);
  const yAxisMax = Math.max(maxCumulativeSteps, monthlyGoal * 1.1);

  const goalData = validStepsData.map((day, index) => ({
    date: day.date,
    goalCumulative: dailyGoal * (index + 1),
  }));

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="body2" color="textSecondary">
          累積歩数: {totalSteps.toLocaleString()} 歩
        </Typography>
        <Typography variant="body2" color="textSecondary">
          月間目標: {monthlyGoal.toLocaleString()} 歩
        </Typography>
        <Typography variant="body2" color="textSecondary">
          達成率: {achievementRate.toFixed(1)}%
        </Typography>
      </Box>
      <Box sx={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <AreaChart
            data={cumulativeData}
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
              formatter={(value: number) => [
                value.toLocaleString(),
                '累積歩数',
              ]}
              labelStyle={{ color: '#000' }}
            />
            <Area
              dataKey="cumulativeSteps"
              stroke="#1976d2"
              fill="#1976d2"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Area
              data={goalData}
              dataKey="goalCumulative"
              stroke="#ff5722"
              strokeDasharray="5 5"
              fill="none"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};
