import type { User } from 'firebase/auth';
import { getAccessToken } from '../tokenStorage';

const FITNESS_API_BASE = 'https://www.googleapis.com/fitness/v1';

export interface DailyStepData {
  date: string;
  steps: number;
}

export async function fetchMonthlySteps(user: User): Promise<DailyStepData[]> {
  const accessToken = await getAccessToken(user);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  endOfMonth.setHours(23, 59, 59, 999);

  return fetchStepDataForMonth(accessToken, startOfMonth, endOfMonth);
}

async function fetchStepDataForMonth(
  accessToken: string,
  startDate: Date,
  endDate: Date
): Promise<DailyStepData[]> {
  const requestBody = {
    aggregateBy: [{ dataTypeName: 'com.google.step_count.delta' }],
    bucketByTime: {
      durationMillis: 86400000, // 1 day
    },
    startTimeMillis: startDate.getTime(),
    endTimeMillis: endDate.getTime(),
  };

  try {
    const response = await fetch(
      `${FITNESS_API_BASE}/users/me/dataset:aggregate`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error(`Google Fit API error: ${response.status}`);
    }

    const data = await response.json();
    const dailySteps: DailyStepData[] = [];

    if (data.bucket && data.bucket.length > 0) {
      for (const bucket of data.bucket) {
        const bucketStartTime = new Date(
          Number.parseInt(bucket.startTimeMillis)
        );
        const dateString = bucketStartTime.toLocaleDateString('ja-JP', {
          month: '2-digit',
          day: '2-digit',
        });

        let stepCount = 0;
        if (bucket.dataset && bucket.dataset.length > 0) {
          for (const dataset of bucket.dataset) {
            if (dataset.point && dataset.point.length > 0) {
              for (const point of dataset.point) {
                if (point.value && point.value.length > 0) {
                  stepCount += point.value[0].intVal || 0;
                }
              }
            }
          }
        }

        dailySteps.push({
          date: dateString,
          steps: stepCount,
        });
      }
    }

    return dailySteps;
  } catch (error) {
    console.error('Error fetching monthly step data:', error);
    throw error;
  }
}
