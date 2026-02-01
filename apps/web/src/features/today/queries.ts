import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import type { ApiError } from '@/shared/api/types';
import { createTask, deleteTask, finishDay, getToday, toggleTask } from '@/shared/api/http';

const todayKey = ['today'] as const;

export const useTodayQuery = () =>
  useQuery({
    queryKey: todayKey,
    queryFn: getToday,
  });

export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: todayKey }),
  });
};

export const useToggleTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: todayKey }),
  });
};

export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: todayKey }),
  });
};

export const useFinishDayMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: finishDay,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: todayKey }),
  });
};

export const isApiError = (error: unknown): error is ApiError => {
  if (!error || typeof error !== 'object') {
    return false;
  }
  return 'code' in error && 'message' in error;
};
