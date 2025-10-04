<template>
  <v-app>
    <Sidebar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import Sidebar from "./shared/components/Sidebar.vue"; // ruta relativa
import { menuItems } from "./shared/data/menu"; // Importa el menú
export default {
  name: "App",
  components: { Sidebar }
};
</script>

<style>
.app-container {
  display: flex;
  height: 100vh;
}

.main-content {
  flex: 1;
  padding: 2rem;
  background-color: #f0f2f5;
  overflow-y: auto;
}
</style>
