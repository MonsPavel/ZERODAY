import { computed, type Ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { getHistory } from '@/shared/api/http';

export const useStatsQuery = (range: Ref<number>) =>
  useQuery({
    queryKey: computed(() => ['stats', range.value]),
    queryFn: () => getHistory(range.value),
  });
