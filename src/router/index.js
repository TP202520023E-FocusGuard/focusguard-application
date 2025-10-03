import { createRouter, createWebHistory } from "vue-router";

// Importaremos nuestras páginas (por ahora vacías)
import TrackingPage from "../tracking/pages/TrackingPage.vue";
import UsersPage from "../users/pages/UsersPage.vue";
import SettingsPage from "../shared/pages/SettingsPage.vue";

const routes = [
  { path: "/tracking", component: TrackingPage },
  { path: "/users", component: UsersPage },
  { path: "/settings", component: SettingsPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
