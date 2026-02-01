import type {
  ApiError,
  DayToday,
  FinishDayOk,
  GameState,
  HistoryDayDetail,
  HistoryResponse,
  Task,
} from './types';

const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const buildUrl = (path: string) => `${baseUrl}${path}`;

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(buildUrl(path), {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (response.ok) {
    return (await response.json()) as T;
  }

  let payload: ApiError | undefined;
  try {
    payload = (await response.json()) as ApiError;
  } catch {
    payload = undefined;
  }

  const error: ApiError = payload ?? {
    code: 'UNKNOWN',
    message: 'Request failed',
  };
  throw error;
};

export const getToday = () => request<DayToday>('/day/today');

export const createTask = (payload: { title: string; note?: string }) =>
  request<Task>('/tasks', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const toggleTask = (id: number) =>
  request<Task>(`/tasks/${id}/toggle`, {
    method: 'PATCH',
  });

export const deleteTask = (id: number) =>
  request<{ ok: true }>(`/tasks/${id}`, {
    method: 'DELETE',
  });

export const finishDay = () =>
  request<FinishDayOk>('/day/finish', {
    method: 'POST',
  });

export const getGameState = () => request<GameState>('/game/state');

export const getHistory = (days: number) =>
  request<HistoryResponse>(`/history?days=${days}`);

export const getHistoryDay = (date: string) =>
  request<HistoryDayDetail>(`/history/${date}`);
