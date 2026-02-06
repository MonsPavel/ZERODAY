import { createRoute } from '@kitbag/router';
import TodayPage from '../pages/TodayPage.vue';
import AchievementsPage from '../pages/AchievementsPage.vue';
import HistoryPage from '../pages/HistoryPage.vue';
import GoalsPage from '../pages/GoalsPage.vue';
import StatsPage from '../pages/StatsPage.vue';
import LoginPage from '../pages/LoginPage.vue';
import { AUTH_TOKEN_KEY } from '@/stores/auth';

const isAuthenticated = () => Boolean(localStorage.getItem(AUTH_TOKEN_KEY));

const requireAuth = (route: ReturnType<typeof createRoute>) => {
  route.onBeforeRouteEnter((_to, { replace }) => {
    if (!isAuthenticated()) {
      replace('login');
    }
  });
};

export const todayRoute = createRoute({
  name: 'today',
  path: '/today',
  component: TodayPage,
});
requireAuth(todayRoute);

export const achievementsRoute = createRoute({
  name: 'achievements',
  path: '/achievements',
  component: AchievementsPage,
});
requireAuth(achievementsRoute);

export const historyRoute = createRoute({
  name: 'history',
  path: '/history',
  component: HistoryPage,
});
requireAuth(historyRoute);

export const goalsRoute = createRoute({
  name: 'goals',
  path: '/goals',
  component: GoalsPage,
});
requireAuth(goalsRoute);

export const statsRoute = createRoute({
  name: 'stats',
  path: '/stats',
  component: StatsPage,
});
requireAuth(statsRoute);

export const loginRoute = createRoute({
  name: 'login',
  path: '/login',
  component: LoginPage,
});

loginRoute.onBeforeRouteEnter((_to, { replace }) => {
  if (isAuthenticated()) {
    replace('today');
  }
});

export const rootRoute = createRoute({
  name: 'root',
  path: '/',
});

rootRoute.onBeforeRouteEnter((_to, { replace }) => {
  replace(isAuthenticated() ? 'today' : 'login');
});

export const routes = [
  rootRoute,
  loginRoute,
  todayRoute,
  achievementsRoute,
  historyRoute,
  goalsRoute,
  statsRoute,
] as const;
