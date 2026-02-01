import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { createGoal, deleteGoal, getActiveGoals, toggleGoal } from '@/shared/api/http';
import type { GoalType } from '@/shared/api/types';

const goalsKey = ['goals', 'active'] as const;
const gameKey = ['gameState'] as const;

export const useActiveGoalsQuery = () =>
  useQuery({
    queryKey: goalsKey,
    queryFn: getActiveGoals,
  });

export const useCreateGoalMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { title: string; type: GoalType; targetInt: number }) =>
      createGoal(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalsKey });
      queryClient.invalidateQueries({ queryKey: gameKey });
    },
  });
};

export const useToggleGoalMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalsKey });
      queryClient.invalidateQueries({ queryKey: gameKey });
    },
  });
};

export const useDeleteGoalMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalsKey });
      queryClient.invalidateQueries({ queryKey: gameKey });
    },
  });
};
