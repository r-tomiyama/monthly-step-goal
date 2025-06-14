import { useQuery } from '@tanstack/react-query';
import type { User } from 'firebase/auth';
import { fetchTodaySteps } from '../services';

export const useStepsQuery = (user: User | null) => {
  return useQuery({
    queryKey: ['steps', 'today', user?.uid],
    queryFn: () => {
      if (!user) throw new Error('User not authenticated');
      return fetchTodaySteps(user);
    },
    enabled: !!user,
  });
};
