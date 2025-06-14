import { useQuery } from '@tanstack/react-query';
import type { User } from 'firebase/auth';
import { getStepGoal } from '../services/stepGoal';

export const useStepGoalQuery = (user: User | null) => {
  return useQuery({
    queryKey: ['stepGoal', user?.uid],
    queryFn: () => {
      if (!user) throw new Error('User not authenticated');
      return getStepGoal(user.uid);
    },
    enabled: !!user,
  });
};
