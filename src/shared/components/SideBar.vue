<template>
  <v-navigation-drawer app permanent color="indigo-darken-3">
    <!-- Título -->
    <v-list-item>
      <v-list-item-title class="text-white text-h6">FocusGuard</v-list-item-title>
    </v-list-item>

    <!-- Menú -->
    <v-list density="compact">
      <template v-for="(item, index) in menuItems" :key="index">
        <!-- Submenú -->
        <v-list-group
          v-if="item.children"
          v-model="openIndex[index]"
          :value="false"
          :prepend-icon="item.icon"
          class="text-white"
        >
          <template #activator="{ props }">
            <v-list-item v-bind="props">
              <v-list-item-title class="text-white">{{ item.name }}</v-list-item-title>
            </v-list-item>
          </template>

          <v-list-item
            v-for="(child, cIndex) in item.children"
            :key="cIndex"
            :to="child.route"
            link
            active-class="text-deep-purple-accent-4"
          >
            <v-list-item-title>{{ child.name }}</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <!-- Item directo -->
        <v-list-item
          v-else
          :to="item.route"
          link
          active-class="text-deep-purple-accent-4"
        >
          <v-icon start class="text-white">{{ item.icon }}</v-icon>
          <v-list-item-title class="text-white">{{ item.name }}</v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { menuItems } from "../data/menu.js";

export default {
  name: "Sidebar",
  data() {
    return {
      menuItems,
      openIndex: Array(menuItems.length).fill(false), // inicializar todos cerrados
    };
  },
};
</script>

<style scoped>
.v-list-item {
  border-radius: 6px;
  transition: background 0.2s;
}
.v-list-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
