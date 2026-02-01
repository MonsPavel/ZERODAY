import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { finishDay, getGameState } from '@/shared/api/http';
import type { ApiError, GameState } from '@/shared/api/types';

const gameKey = ['gameState'] as const;
const todayKey = ['today'] as const;

export const useGameStateQuery = () =>
  useQuery({
    queryKey: gameKey,
    queryFn: getGameState,
  });

export const useFinishDayMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: finishDay,
    onSuccess: (data) => {
      queryClient.setQueryData<GameState>(gameKey, data);
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
