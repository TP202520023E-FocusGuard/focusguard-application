import { createRouter, createWebHashHistory } from "vue-router";
import TrackingPage from "../tracking/pages/TrackingPage.vue";
import UserCategories from "../users/pages/UserCategories.vue";
import PersonalInfo from "../users/pages/PersonalInfo.vue";
import LeisureTime from "../settings/pages/LeisureTime.vue";
import ThemeSelector from "../components/ThemeSelector.vue";
import LoginView from "../auth/pages/LoginView.vue";
import RegisterView from "../auth/pages/RegisterView.vue";
import ResetPasswoard from "../auth/pages/ResetPasswoard.vue";
import DashboardPage from "../dashboard/pages/DashboardPage.vue";
import { useAuthStore } from "../stores/authStore";
import GoalsPage from "../goals/pages/GoalsPage.vue";

const routes = [
  { path: "/", redirect: "/tracking" },
  {
    path: "/tracking",
    component: TrackingPage,
    name: "tracking",
    meta: { requiresAuth: true }
  },
  { path: "/settings/categories", redirect: "/tracking" },
  {
    path: "/settings/leisure-time",
    component: LeisureTime,
    name: "leisure-time",
    meta: { requiresAuth: true }
  },
  { path: "/profile", redirect: "/profile/info" },
  {
    path: "/profile/info",
    component: PersonalInfo,
    name: "personal-info",
    meta: { requiresAuth: true }
  },
  /*{
    path: "/profile/categories",
    component: UserCategories,
    name: "user-categories",
    meta: { requiresAuth: true }
  },
  {
    path: "/settings/appearance",
    component: ThemeSelector,
    name: "theme-selector",
    meta: { requiresAuth: true }
  },*/
  {
    path: "/auth/login",
    name: "login",
    component: LoginView,
    meta: { guestOnly: true, layout: "auth" }
  },
  {
    path: "/auth/register",
    name: "register",
    component: RegisterView,
    meta: { guestOnly: true, layout: "auth" }
  },
  {
    path: "/auth/forgot-password",
    name: "forgot-password",
    component: ResetPasswoard,
    meta: { guestOnly: true, layout: "auth" }
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/auth/login"
  },
  {
    path: "/dashboard",
    component: DashboardPage,
    name: "dashboard",
    meta: { requiresAuth: true }
  },
  {
    path: "/goals",
    component: GoalsPage,
    name: "goals",
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  const publicRoutes = ["login", "register"];

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return next({ name: "tracking" });
  }

  if (!to.meta.requiresAuth) {
    return next();
  }

  if (!authStore.isAuthenticated) {
    return next({ name: "login", query: { redirect: to.fullPath } });
  }

  const isValid = await authStore.validateSession();

  if (!isValid) {
    authStore.logout();
    return next("/auth/login");
  }

  next();
});

export default router;
