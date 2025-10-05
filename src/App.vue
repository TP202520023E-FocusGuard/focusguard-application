<template>
  <v-app>
    <Sidebar v-if="!isAuthLayout" />
    <v-main :class="[{ 'auth-layout': isAuthLayout }, 'app-main']">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import Sidebar from "./shared/components/SideBar.vue";

const route = useRoute();

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
</style>
