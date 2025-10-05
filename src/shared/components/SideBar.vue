<template>
  <v-navigation-drawer
    app
    permanent
    class="modern-sidebar"
    elevation="3"
    width="280"
  >
    <div class="sidebar-header">
      <div class="logo-container">
        <div class="logo-icon-wrapper">
          <v-icon color="white" size="28">mdi-shield-account</v-icon>
        </div>
        <div class="logo-text">
          <div class="app-name">FocusGuard</div>
          <div class="app-subtitle">Productivity Suite</div>
        </div>
      </div>
    </div>

    <v-list
      density="compact"
      class="sidebar-menu"
      nav
    >
      <template v-for="(item, index) in menuItems" :key="index">
        <div v-if="item.children" class="custom-menu-group">
          <v-list-item
            class="menu-item"
            :class="{ 'active-group': openStates[item.name] }"
            @click="toggleMenu(item.name)"
          >
            <template #prepend>
              <div class="icon-wrapper">
                <v-icon
                  class="menu-icon"
                  :class="{ 'active-icon': openStates[item.name] }"
                >
                  {{ item.icon }}
                </v-icon>
              </div>
            </template>

            <v-list-item-title class="menu-title">
              {{ item.name }}
            </v-list-item-title>

            <template #append>
              <v-icon
                class="arrow-icon"
                :class="{ 'rotate-arrow': openStates[item.name] }"
              >
                mdi-chevron-down
              </v-icon>
            </template>
          </v-list-item>

          <transition name="slide-down">
            <div v-if="openStates[item.name]" class="submenu-container">
              <v-list-item
                v-for="(child, cIndex) in item.children"
                :key="child.name"
                :to="child.route"
                class="submenu-item"
                active-class="active-subitem"
                @click="handleSubmenuClick"
              >
                <template #prepend>
                  <div class="submenu-indicator">
                    <div class="submenu-dot"></div>
                  </div>
                </template>

                <v-list-item-title class="submenu-title">
                  {{ child.name }}
                </v-list-item-title>

                <template #append>
                  <v-icon
                    v-if="child.icon"
                    size="small"
                    class="submenu-icon"
                  >
                    {{ child.icon }}
                  </v-icon>
                </template>
              </v-list-item>
            </div>
          </transition>
        </div>

        <v-list-item
          v-else
          :to="item.route"
          class="menu-item"
          active-class="active-item"
          @click="closeAllMenus"
        >
          <template #prepend>
            <div class="icon-wrapper">
              <v-icon class="menu-icon">
                {{ item.icon }}
              </v-icon>
            </div>
          </template>

          <v-list-item-title class="menu-title">
            {{ item.name }}
          </v-list-item-title>
        </v-list-item>

        <v-divider
          v-if="index < menuItems.length - 1"
          class="menu-divider"
        />
      </template>
    </v-list>

    <div class="sidebar-footer">
      <div class="user-section" v-if="authStore.user">
        <v-avatar size="40" color="rgba(255, 255, 255, 0.2)" class="user-avatar">
          <v-icon color="white" size="20">mdi-account</v-icon>
        </v-avatar>
        <div class="user-info">
          <div class="user-name">{{ authStore.user.name }}</div>
          <div class="user-status">
            <span class="status-dot"></span>
            En línea
          </div>
        </div>
      </div>

      <v-btn
        class="logout-btn"
        variant="tonal"
        color="red-darken-1"
        size="large"
        block
        @click="handleLogout"
      >
        <v-icon start>mdi-logout</v-icon>
        Cerrar Sesión
      </v-btn>
    </div>
  </v-navigation-drawer>
</template>

<script>
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/authStore";
import { menuItems } from "../data/menu.js";

export default {
  name: "Sidebar",
  data() {
    return {
      menuItems,
      openStates: {}
    };
  },
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();

    const handleLogout = () => {
      authStore.logout();
      router.push({ name: "login" });
    };

    return {
      authStore,
      handleLogout
    };
  },
  methods: {
    toggleMenu(menuName) {
      const newState = { ...this.openStates };

      if (newState[menuName]) {
        newState[menuName] = false;
      } else {
        Object.keys(newState).forEach(key => {
          newState[key] = false;
        });
        newState[menuName] = true;
      }

      this.openStates = newState;
    },

    handleSubmenuClick() {},

    closeAllMenus() {
      const newState = {};
      this.menuItems.forEach(item => {
        if (item.children) {
          newState[item.name] = false;
        }
      });
      this.openStates = newState;
    }
  },
  mounted() {
    const initialState = {};
    this.menuItems.forEach(item => {
      if (item.children) {
        initialState[item.name] = false;
      }
    });
    this.openStates = initialState;
  }
};
</script>

<style scoped>
.modern-sidebar {
  background: linear-gradient(180deg, #1e2a38 0%, #18202c 100%);
  color: white;
  border-right: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.sidebar-header {
  padding: 24px 24px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-icon-wrapper {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.05));
  border-radius: 16px;
  padding: 10px;
  box-shadow: inset 0 0 12px rgba(0, 0, 0, 0.2);
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.app-name {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.4px;
}

.app-subtitle {
  font-size: 12px;
  opacity: 0.7;
}

.sidebar-menu {
  padding: 12px 12px 0;
  flex-grow: 1;
}

.menu-item {
  border-radius: 12px;
  margin-bottom: 6px;
  transition: background 0.2s ease, transform 0.2s ease;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(4px);
}

.active-item {
  background: rgba(76, 161, 175, 0.25) !important;
}

.active-group {
  background: rgba(76, 161, 175, 0.15);
}

.icon-wrapper {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-icon {
  color: rgba(255, 255, 255, 0.85);
}

.active-icon {
  color: #4ca1af;
}

.menu-title {
  font-weight: 500;
  letter-spacing: 0.3px;
}

.arrow-icon {
  transition: transform 0.2s ease;
}

.rotate-arrow {
  transform: rotate(180deg);
}

.submenu-container {
  padding-left: 12px;
}

.submenu-item {
  border-radius: 10px;
  margin: 4px 0;
  padding-left: 12px;
}

.submenu-item:hover {
  background: rgba(76, 161, 175, 0.18);
}

.active-subitem {
  background: rgba(76, 161, 175, 0.25) !important;
  color: white !important;
}

.submenu-indicator {
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submenu-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(76, 161, 175, 0.9);
}

.submenu-title {
  font-size: 14px;
}

.submenu-icon {
  color: rgba(255, 255, 255, 0.5);
}

.sidebar-footer {
  padding: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.user-name {
  font-weight: 600;
}

.user-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  opacity: 0.8;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4caf50;
}

.logout-btn {
  font-weight: 600;
}
</style>
