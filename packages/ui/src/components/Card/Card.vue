<template>
  <section class="ui-card">
    <header v-if="$slots.header" class="ui-card__header">
      <slot name="header" />
    </header>
    <div class="ui-card__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.ui-card {
  border-radius: var(--radius-md);
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  box-shadow: var(--shadow);
}

.ui-card__header {
  padding: 16px 18px 0;
  color: var(--c-muted);
  font-size: 13px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.ui-card__body {
  padding: 18px;
}
</style>
