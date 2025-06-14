import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { User } from 'firebase/auth';
import { createStepGoal, updateStepGoal } from '../services/stepGoal';
import type {
  CreateStepGoalData,
  UpdateStepGoalData,
} from '../services/stepGoal';

export const useCreateStepGoalMutation = (user: User | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStepGoalData) => {
      if (!user) throw new Error('User not authenticated');
      return createStepGoal(user.uid, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['stepGoal', user?.uid],
      });
    },
  });
};

export const useUpdateStepGoalMutation = (user: User | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateStepGoalData) => {
      if (!user) throw new Error('User not authenticated');
      return updateStepGoal(user.uid, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['stepGoal', user?.uid],
      });
    },
  });
};
