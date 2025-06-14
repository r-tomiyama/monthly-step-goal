import { useQuery } from '@tanstack/react-query';
import type { User } from 'firebase/auth';
import { fetchMonthlySteps } from '../services';

export const useMonthlyStepsQuery = (user: User | null) => {
  return useQuery({
    queryKey: ['steps', 'monthly', user?.uid],
    queryFn: () => {
      if (!user) throw new Error('User not authenticated');
      return fetchMonthlySteps(user);
    },
    enabled: !!user,
  });
};
