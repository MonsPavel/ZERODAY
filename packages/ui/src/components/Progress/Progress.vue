<script setup lang="ts">
const props = defineProps<{
  value: number;
  label?: string;
}>();

const clampedValue = () => Math.min(100, Math.max(0, props.value));
</script>

<template>
  <div class="ui-progress">
    <div v-if="props.label" class="ui-progress__label">{{ props.label }}</div>
    <div class="ui-progress__track">
      <div class="ui-progress__fill" :style="{ width: `${clampedValue()}%` }" />
    </div>
  </div>
</template>

<style scoped>
.ui-progress {
  display: grid;
  gap: 8px;
}

.ui-progress__label {
  font-size: 13px;
  color: var(--c-muted);
}

.ui-progress__track {
  height: 10px;
  border-radius: 999px;
  background: var(--c-accent-weak);
  overflow: hidden;
  border: 1px solid var(--c-border);
}

.ui-progress__fill {
  height: 100%;
  background: var(--c-accent);
}
</style>
