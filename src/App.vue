<template>
  <v-app>
    <Sidebar v-if="!isAuthLayout" />
    <v-main :class="[{ 'auth-layout': isAuthLayout }, 'app-main']">
      <router-view v-slot="{ Component }">
        <transition :name="isAuthLayout ? 'page-fade' : 'page-slide'" mode="out-in">
          <component :is="Component" :key="$route.path" />
        </transition>
      </router-view>
    </v-main>
  </v-app>
</template>

<script setup>

import { computed } from "vue";
import { useRoute } from "vue-router";
import { onMounted } from "vue";
import { useAuthStore } from "./stores/authStore";

import Sidebar from "./shared/components/SideBar.vue";

const route = useRoute();
onMounted(() => {
  window.addEventListener("storage", (event) => {
    if (event.key === "focusguard-logout-event") {
      const auth = useAuthStore();

      auth.logout();

      router.push("/auth/login");
    }
  });
});
const isAuthLayout = computed(() => route.meta?.layout === "auth");
</script>

<style>
.app-main {
  min-height: 100vh;
  background-color: #f5f7fb;
}

.auth-layout {
  padding: 0 !important;
}

.page-slide-enter-active {
  transition: all 0.1s ease-out;
}

.page-slide-leave-active {
  transition: all 0.15s ease-in;
}

.page-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.page-transition-enter-active {
  transition: opacity 0.1s ease;
}

.page-transition-leave-active {
  transition: opacity 0.15s ease;
}

.page-transition-enter-from,
.page-transition-leave-to {
  opacity: 0;
}
</style>