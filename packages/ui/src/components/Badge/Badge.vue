<script setup lang="ts">
type BadgeTone = 'default' | 'locked' | 'unlocked';

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
  background: var(--c-accent-weak);
  color: var(--c-text);
}

.ui-badge--unlocked {
  background: var(--c-accent);
  color: var(--c-bg);
}
</style>
