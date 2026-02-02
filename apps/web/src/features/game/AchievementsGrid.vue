<script setup lang="ts">
import { computed } from 'vue';
import { UiBadge } from '@zeroday/ui';
import type { AchievementUnlocked } from '@/shared/api/types';
import { ACHIEVEMENTS_MAP, type AchievementCode } from './achievements.map';

const props = defineProps<{
  achievements: AchievementUnlocked[];
}>();

const LABELS = {
  unlocked: 'Открыто',
  locked: 'Закрыто',
} as const;

const ordered = computed(() => {
  const unlockedMap = new Map(props.achievements.map((item) => [item.code, item]));
  const catalog = Object.entries(ACHIEVEMENTS_MAP).map(([code, info]) => ({
    code: code as AchievementCode,
    ...info,
    unlocked: unlockedMap.get(code),
  }));

  return catalog.sort((a, b) => {
    if (a.unlocked && b.unlocked) {
      return b.unlocked.unlockedAt.localeCompare(a.unlocked.unlockedAt);
    }
    if (a.unlocked) {
      return -1;
    }
    if (b.unlocked) {
      return 1;
    }
    return a.title.localeCompare(b.title);
  });
});
</script>

<template>
  <div class="grid">
    <div
      v-for="item in ordered"
      :key="item.code"
      :class="['card', !item.unlocked && 'card--locked']"
    >
      <div class="row">
        <UiBadge :tone="item.unlocked ? 'unlocked' : 'locked'">
          {{ item.unlocked ? LABELS.unlocked : LABELS.locked }}
        </UiBadge>
        <span class="muted">{{ item.code }}</span>
      </div>
      <div class="title">{{ item.title }}</div>
      <div class="desc">{{ item.description }}</div>
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

@media (max-width: 480px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.card {
  border: 1px solid var(--c-border);
  border-radius: var(--radius-sm);
  padding: 10px;
  background: var(--c-surface);
  transition: opacity 120ms ease, transform 120ms ease;
}

.card--locked {
  opacity: 0.45;
}

.row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.title {
  font-weight: 600;
  font-size: 13px;
}

.desc {
  font-size: 12px;
  color: var(--c-muted);
}

.muted {
  color: var(--c-muted);
}
</style>
