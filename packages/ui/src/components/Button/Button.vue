<script setup lang="ts">
type ButtonVariant = 'primary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md';

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
  }>(),
  {
    variant: 'primary',
    size: 'md',
    disabled: false,
    type: 'button',
  },
);
</script>

<template>
  <button
    class="ui-button"
    :class="[`ui-button--${props.variant}`, `ui-button--${props.size}`]"
    :disabled="props.disabled"
    :type="props.type"
  >
    <slot />
  </button>
</template>

<style scoped>
.ui-button {
  border: 1px solid var(--border);
  background: var(--accent);
  color: var(--accent-contrast);
  border-radius: var(--radius-sm);
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 120ms ease, box-shadow 120ms ease;
}

.ui-button--sm {
  padding: 6px 12px;
  font-size: 13px;
}

.ui-button--md {
  padding: 10px 18px;
  font-size: 14px;
}

.ui-button--ghost {
  background: transparent;
  color: var(--fg);
}

.ui-button--danger {
  background: var(--border);
  color: var(--fg);
}

.ui-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

.ui-button:not(:disabled):active {
  transform: translateY(1px);
}
</style>
