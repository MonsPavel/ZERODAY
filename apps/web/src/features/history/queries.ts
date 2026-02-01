import { computed, type Ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { getHistory, getHistoryDay } from '@/shared/api/http';

export const useHistoryQuery = (days: Ref<number>) =>
  useQuery({
    queryKey: computed(() => ['history', days.value]),
    queryFn: () => getHistory(days.value),
  });

export const useHistoryDayQuery = (date: Ref<string | null>) =>
  useQuery({
    queryKey: computed(() => ['historyDay', date.value]),
    queryFn: () => getHistoryDay(date.value ?? ''),
    enabled: computed(() => Boolean(date.value)),
  });
