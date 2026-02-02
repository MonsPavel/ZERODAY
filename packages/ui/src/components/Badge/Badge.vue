<script setup lang="ts">
type BadgeTone = 'default' | 'good' | 'neutral' | 'bad' | 'locked' | 'unlocked';

const props = withDefaults(
  defineProps<{
    tone?: BadgeTone;
  }>(),
  {
    tone: 'default',
  },
);
</script>

<template>
  <span class="ui-badge" :class="`ui-badge--${props.tone}`">
    <slot />
  </span>
</template>

<style scoped>
.ui-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid var(--c-border);
  font-size: 12px;
  font-weight: 600;
  background: var(--c-surface);
  color: var(--c-text);
}

.ui-badge--locked {
  background: var(--c-surface);
  color: var(--c-muted);
}

.ui-badge--good {
  background: var(--good);
  color: var(--accent-contrast);
}

.ui-badge--neutral {
  background: var(--neutral);
  color: var(--accent-contrast);
}

.ui-badge--bad {
  background: var(--bad);
  color: var(--accent-contrast);
}

.ui-badge--unlocked {
  background: var(--accent);
  color: var(--accent-contrast);
}
</style>
