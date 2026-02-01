import { createRoute } from '@kitbag/router';
import TodayPage from '../pages/TodayPage.vue';
import AchievementsPage from '../pages/AchievementsPage.vue';
import HistoryPage from '../pages/HistoryPage.vue';
import GoalsPage from '../pages/GoalsPage.vue';

export const todayRoute = createRoute({
  name: 'today',
  path: '/today',
  component: TodayPage,
});

export const achievementsRoute = createRoute({
  name: 'achievements',
  path: '/achievements',
  component: AchievementsPage,
});

export const historyRoute = createRoute({
  name: 'history',
  path: '/history',
  component: HistoryPage,
});

export const goalsRoute = createRoute({
  name: 'goals',
  path: '/goals',
  component: GoalsPage,
});

export const rootRoute = createRoute({
  name: 'root',
  path: '/',
});

rootRoute.onBeforeRouteEnter((_to, { replace }) => {
  replace('today');
});

export const routes = [rootRoute, todayRoute, achievementsRoute, historyRoute, goalsRoute] as const;
