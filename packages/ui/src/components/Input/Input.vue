<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
  placeholder?: string;
  disabled?: boolean;
  type?: string;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
}>();

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};
</script>

<template>
  <input
    class="ui-input"
    :value="props.modelValue"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :type="props.type ?? 'text'"
    @input="onInput"
  />
</template>

<style scoped>
.ui-input {
  width: 100%;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--c-border);
  background: var(--c-surface);
  color: var(--c-text);
}

.ui-input::placeholder {
  color: var(--c-muted);
}

.ui-input:disabled {
  opacity: 0.6;
}
</style>
