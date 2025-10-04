import { createRouter, createWebHistory } from "vue-router";
import TrackingPage from "../tracking/pages/TrackingPage.vue";
<<<<<<< Updated upstream
=======
import UserCategories from "../users/pages/UserCategories.vue";
import LeisureTime from "../settings/pages/LeisureTime.vue";
>>>>>>> Stashed changes

const routes = [
  { path: "/", redirect: "/tracking" },
  { path: "/tracking", component: TrackingPage },
  { path: "/settings/categories", redirect: "/tracking" },
<<<<<<< Updated upstream
  { path: "/settings/time", redirect: "/tracking" },
  { path: "/profile", redirect: "/tracking" }
=======
  { path: "/settings/leisure-time", component: LeisureTime },
  { path: "/profile", redirect: "/tracking" },
  { path: "/profile/categories", component: UserCategories }
>>>>>>> Stashed changes
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
