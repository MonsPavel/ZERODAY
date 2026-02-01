import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import type { ApiError } from '@/shared/api/types';
import { createTask, deleteTask, getToday, toggleTask } from '@/shared/api/http';

const todayKey = ['today'] as const;
const gameKey = ['gameState'] as const;

export const useTodayQuery = () =>
  useQuery({
    queryKey: todayKey,
    queryFn: getToday,
  });

export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todayKey });
      queryClient.invalidateQueries({ queryKey: gameKey });
    },
  });
};

export const useToggleTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todayKey });
      queryClient.invalidateQueries({ queryKey: gameKey });
    },
  });
};

export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todayKey });
      queryClient.invalidateQueries({ queryKey: gameKey });
    },
  });
};

export const isApiError = (error: unknown): error is ApiError => {
  if (!error || typeof error !== 'object') {
    return false;
  }
  return 'code' in error && 'message' in error;
};
