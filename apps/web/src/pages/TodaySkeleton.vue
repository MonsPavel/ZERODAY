<script setup lang="ts">
import { UiCard } from '@zeroday/ui';
</script>

<template>
  <div class="stack">
    <UiCard class="punk-card">
      <template #header>Punk bro</template>
      <div class="stack">
        <div class="row">
          <div class="skeleton skeleton-icon" />
          <div class="skeleton skeleton-badge" />
          <div class="skeleton skeleton-time" />
        </div>
        <div class="skeleton skeleton-line" />
        <div class="skeleton skeleton-line short" />
        <div class="skeleton skeleton-progress" />
      </div>
    </UiCard>

    <UiCard class="streak-card">
      <template #header>Стрик</template>
      <div class="stack">
        <div class="row">
          <div class="skeleton skeleton-number" />
          <div class="skeleton skeleton-meta" />
        </div>
        <div class="skeleton skeleton-progress" />
      </div>
    </UiCard>

    <UiCard>
      <template #header>Цели</template>
      <div class="stack">
        <div class="skeleton skeleton-line" />
        <div class="skeleton skeleton-line short" />
      </div>
    </UiCard>

    <UiCard>
      <template #header>Достижения</template>
      <div class="stack">
        <div class="skeleton skeleton-line" />
        <div class="skeleton skeleton-line short" />
      </div>
    </UiCard>

    <UiCard>
      <template #header>Добавить задачу</template>
      <div class="stack">
        <div class="skeleton skeleton-input" />
        <div class="skeleton skeleton-input" />
        <div class="skeleton skeleton-button-wide" />
      </div>
    </UiCard>

    <UiCard class="tasks-card">
      <template #header>Задачи</template>
      <div class="stack">
        <div v-for="row in 4" :key="row" class="task-row">
          <div class="task-main">
            <div class="skeleton skeleton-button" />
            <div class="task-text">
              <div class="skeleton skeleton-line" />
              <div class="skeleton skeleton-line short" />
            </div>
          </div>
          <div class="task-actions">
            <div class="skeleton skeleton-badge" />
            <div class="skeleton skeleton-button" />
          </div>
        </div>
      </div>
    </UiCard>

    <UiCard>
      <template #header>Закрыть день</template>
      <div class="stack">
        <div class="skeleton skeleton-button-wide" />
        <div class="skeleton skeleton-line short" />
      </div>
    </UiCard>
  </div>
</template>

<style scoped>
.stack {
  display: grid;
  gap: 12px;
}

.row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.punk-card {
  min-height: 170px;
}

.streak-card {
  min-height: 120px;
}

.tasks-card {
  min-height: 240px;
}

.task-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
}

.task-row:last-child {
  border-bottom: none;
}

.task-main {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.task-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.task-text {
  display: grid;
  gap: 6px;
  width: 180px;
}

.skeleton {
  background: var(--skeleton);
  border-radius: var(--radius-sm);
  opacity: 0.5;
}

.skeleton-line {
  height: 12px;
  width: 100%;
}

.skeleton-line.short {
  width: 60%;
}

.skeleton-icon {
  width: 20px;
  height: 20px;
  border-radius: 999px;
}

.skeleton-badge {
  width: 72px;
  height: 20px;
}

.skeleton-time {
  width: 60px;
  height: 12px;
}

.skeleton-progress {
  height: 10px;
  width: 100%;
  border-radius: 999px;
}

.skeleton-number {
  width: 36px;
  height: 28px;
}

.skeleton-meta {
  width: 80px;
  height: 14px;
}

.skeleton-button {
  width: 36px;
  height: 24px;
}

.skeleton-button-wide {
  width: 140px;
  height: 28px;
}

.skeleton-input {
  width: 100%;
  height: 36px;
}
</style>
