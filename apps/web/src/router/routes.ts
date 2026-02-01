import { createRoute } from '@kitbag/router';
import TodayPage from '../pages/TodayPage.vue';
import AchievementsPage from '../pages/AchievementsPage.vue';

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

export const rootRoute = createRoute({
  name: 'root',
  path: '/',
});

rootRoute.onBeforeRouteEnter((_to, { replace }) => {
  replace('today');
});

export const routes = [rootRoute, todayRoute, achievementsRoute] as const;
