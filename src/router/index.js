import { createRouter, createWebHistory } from "vue-router";
import TrackingPage from "../tracking/pages/TrackingPage.vue";

const routes = [
  { path: "/", redirect: "/tracking" },
  { path: "/tracking", component: TrackingPage },
  { path: "/settings/categories", redirect: "/tracking" },
  { path: "/settings/time", redirect: "/tracking" },
  { path: "/profile", redirect: "/tracking" }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
