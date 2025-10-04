import { createRouter, createWebHistory } from "vue-router";
import TrackingPage from "../tracking/pages/TrackingPage.vue";
import UserCategories from "../users/pages/UserCategories.vue";
import LeisureTime from "../settings/pages/LeisureTime.vue";

const routes = [
  { path: "/", redirect: "/tracking" },
  { path: "/tracking", component: TrackingPage },
  { path: "/settings/categories", redirect: "/tracking" },
  { path: "/settings/leisure-time", component: LeisureTime },
  { path: "/profile", redirect: "/tracking" },
  { path: "/profile/categories", component: UserCategories }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
