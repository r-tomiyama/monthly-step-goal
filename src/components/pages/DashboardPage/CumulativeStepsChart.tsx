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
  Dot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { auth } from '../../../config/firebase';
import { useMonthlyStepsQuery } from '../../../hooks/useMonthlyStepsQuery';
import { useStepGoalQuery } from '../../../hooks/useStepGoalQuery';
import { StepGoalSetting } from './StepGoalSetting';
import { AchievementForecast } from './AchievementForecast';

interface ChartData {
  date: string;
  steps: number;
}

interface CumulativeChartData {
  date: string;
  cumulativeSteps: number | null;
}

interface TickProps {
  x: number;
  y: number;
  payload: { value: string };
}

interface DotProps {
  cx: number;
  cy: number;
  payload: CumulativeChartData;
}

export const CumulativeStepsChart = () => {
  const [user] = useAuthState(auth);
  const {
    data: monthlySteps,
    isLoading,
    error,
  } = useMonthlyStepsQuery(user || null);
  const { data: stepGoal } = useStepGoalQuery(user || null);

  const content = isLoading ? (
    <IsLoading />
  ) : error || !monthlySteps ? (
    <ErrorContent />
  ) : (
    <CumulativeStepsChartContent
      monthlySteps={monthlySteps}
      stepGoal={stepGoal}
    />
  );

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography variant="h6">今月の累積歩数</Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <AchievementForecast />
            <StepGoalSetting />
          </Box>
        </Box>
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
  stepGoal,
}: {
  monthlySteps: ChartData[];
  stepGoal: { dailyStepGoal: number } | null | undefined;
}) => {
  const dailyGoal = stepGoal?.dailyStepGoal || 3000;

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
      const isFutureDate = day.date > todayStr;
      const cumulativeSteps = isFutureDate
        ? acc[index - 1]?.cumulativeSteps || 0
        : index === 0
          ? day.steps
          : (acc[index - 1]?.cumulativeSteps || 0) + day.steps;
      acc.push({
        date: day.date,
        cumulativeSteps: isFutureDate ? null : cumulativeSteps,
      });
      return acc;
    },
    []
  );

  const totalSteps =
    cumulativeData.filter((data) => data.cumulativeSteps !== null).pop()
      ?.cumulativeSteps || 0;
  const validDaysCount = cumulativeData.filter(
    (data) => data.cumulativeSteps !== null
  ).length;
  const totalDaysOnGraph = cumulativeData.length; // グラフ上に表示する全日数
  const monthlyGoal = totalDaysOnGraph > 0 ? dailyGoal * totalDaysOnGraph : 0;
  const achievementRate =
    monthlyGoal > 0 ? (totalSteps / monthlyGoal) * 100 : 0;
  const maxCumulativeSteps = Math.max(totalSteps, monthlyGoal);
  const yAxisMax = Math.max(maxCumulativeSteps, monthlyGoal * 1.25);

  // 現在の1日平均歩数による予測線データ
  const dailyAverage = validDaysCount > 0 ? totalSteps / validDaysCount : 0;
  const combinedData = cumulativeData.map((day, index) => {
    return {
      ...day,
      goalCumulative: dailyGoal * (index + 1), // 未来まで表示
      predictionCumulative: dailyAverage * (index + 1),
    };
  });

  return (
    <Box>
      {/* 達成率を大きく目立たせる */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color:
              achievementRate >= 100
                ? '#4caf50'
                : achievementRate >= 75
                  ? '#ff9800'
                  : '#f44336',
            mb: 1,
          }}
        >
          {achievementRate.toFixed(1)}%
        </Typography>
        <Typography variant="body2" color="textSecondary">
          達成率
        </Typography>
      </Box>

      {/* その他の統計情報 */}
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          justifyContent: 'center',
        }}
      >
        <Typography variant="body2" color="textSecondary">
          累積歩数: {totalSteps.toLocaleString()} 歩
        </Typography>
        <Typography variant="body2" color="textSecondary">
          月間目標: {monthlyGoal.toLocaleString()} 歩
        </Typography>
        <Typography variant="body2" color="textSecondary">
          平均: {Math.round(dailyAverage).toLocaleString()}歩/日
        </Typography>
      </Box>
      <Box sx={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <AreaChart
            data={combinedData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              fontSize={12}
              interval="preserveStartEnd"
              tick={(props: TickProps) => {
                const { x, y, payload } = props;
                const isToday = payload.value === todayStr;
                return (
                  <g transform={`translate(${x},${y})`}>
                    <text
                      x={0}
                      y={0}
                      dy={16}
                      textAnchor="middle"
                      fill={isToday ? '#2196f3' : '#666'}
                      fontSize={12}
                      fontWeight={isToday ? 'bold' : 'normal'}
                    >
                      {payload.value}
                    </text>
                  </g>
                );
              }}
            />
            <YAxis
              fontSize={12}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              domain={[0, yAxisMax]}
            />
            <Tooltip
              formatter={(value: number, name: string) => {
                const displayName =
                  name === 'cumulativeSteps'
                    ? '実績'
                    : name === 'goalCumulative'
                      ? '目標'
                      : name === 'predictionCumulative'
                        ? '予測'
                        : name;
                return [value?.toLocaleString() || 0, displayName];
              }}
              labelStyle={{ color: '#000' }}
              labelFormatter={(label) => {
                const isToday = label === todayStr;
                return isToday ? `${label} (今日)` : label;
              }}
            />
            <Area
              dataKey="cumulativeSteps"
              stroke="#1976d2"
              fill="#1976d2"
              fillOpacity={0.3}
              strokeWidth={2}
              dot={(props: unknown) => {
                const { cx, cy, payload } = props as DotProps;
                const isToday = payload.date === todayStr;
                if (isToday) {
                  return (
                    <Dot
                      cx={cx}
                      cy={cy}
                      r={6}
                      fill="#2196f3"
                      stroke="#2196f3"
                      strokeWidth={3}
                    />
                  );
                }
                return (
                  <Dot
                    cx={cx}
                    cy={cy}
                    r={0}
                    fill="transparent"
                    stroke="transparent"
                  />
                );
              }}
            />
            <Area
              dataKey="goalCumulative"
              stroke="#ff5722"
              strokeDasharray="5 5"
              fill="none"
              strokeWidth={2}
            />
            <Area
              dataKey="predictionCumulative"
              stroke="#9c27b0"
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
