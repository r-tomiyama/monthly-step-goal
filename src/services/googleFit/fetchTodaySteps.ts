import type { User } from 'firebase/auth';
import { getAccessToken } from '../tokenStorage';

const FITNESS_API_BASE = 'https://www.googleapis.com/fitness/v1';

export async function fetchTodaySteps(user: User): Promise<number> {
  const accessToken = await getAccessToken(user);

  const today = new Date();
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  return fetchStepDataForDate(accessToken, startOfDay, endOfDay);
}

async function fetchStepDataForDate(
  accessToken: string,
  startDate: Date,
  endDate: Date
): Promise<number> {
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

    let totalSteps = 0;
    if (data.bucket && data.bucket.length > 0) {
      for (const bucket of data.bucket) {
        if (bucket.dataset && bucket.dataset.length > 0) {
          for (const dataset of bucket.dataset) {
            if (dataset.point && dataset.point.length > 0) {
              for (const point of dataset.point) {
                if (point.value && point.value.length > 0) {
                  totalSteps += point.value[0].intVal || 0;
                }
              }
            }
          }
        }
      }
    }

    return totalSteps;
  } catch (error) {
    console.error('Error fetching step data:', error);
    throw error;
  }
}
