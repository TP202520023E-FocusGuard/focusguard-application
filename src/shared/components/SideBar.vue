<template>
  <v-navigation-drawer 
    app 
    permanent 
    class="modern-sidebar"
    elevation="3"
    width="280"
  >
    <!-- Header elegante -->
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

    <!-- Menú principal SIN v-list-group -->
    <v-list 
      density="compact" 
      class="sidebar-menu"
      nav
    >
      <template v-for="(item, index) in menuItems" :key="index">
        
        <!-- Items con children - Lógica personalizada -->
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

          <!-- Subitems con transición -->
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

        <!-- Items simples -->
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

        <!-- Separador sutil -->
        <v-divider 
          v-if="index < menuItems.length - 1" 
          class="menu-divider"
        />
      </template>
    </v-list>

    <!-- Footer del sidebar -->
    <div class="sidebar-footer">
      <div class="user-section">
        <v-avatar size="40" color="rgba(255, 255, 255, 0.2)" class="user-avatar">
          <v-icon color="white" size="20">mdi-account</v-icon>
        </v-avatar>
        <div class="user-info">
          <div class="user-name">Usuario</div>
          <div class="user-status">
            <span class="status-dot"></span>
            En línea
          </div>
        </div>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script>
import { menuItems } from "../data/menu.js";

export default {
  name: "Sidebar",
  data() {
    return {
      menuItems,
      openStates: {}
    };
  },
  methods: {
    toggleMenu(menuName) {
      // Crear nuevo estado
      const newState = { ...this.openStates };
      
      // Si el menú clickeado ya está abierto, cerrarlo
      if (newState[menuName]) {
        newState[menuName] = false;
      } else {
        // Cerrar todos los demás y abrir el clickeado
        Object.keys(newState).forEach(key => {
          newState[key] = false;
        });
        newState[menuName] = true;
      }
      
      this.openStates = newState;
    },
    
    handleSubmenuClick() {
      // No hacer nada especial, solo navegar
    },
    
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
    // Inicializar todos los estados como cerrados
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
  background: linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-secondary) 100%) !important;
  border: none;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
}

/* Header */
.sidebar-header {
  padding: 24px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon-wrapper {
  background: linear-gradient(135deg, var(--theme-accent) 0%, var(--theme-secondary) 100%) !important;
  border-radius: 12px;
  padding: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.logo-text {
  line-height: 1.3;
}

.app-name {
  font-size: 1.3rem;
  font-weight: 700;
  color: white;
  letter-spacing: 0.5px;
}

.app-subtitle {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 400;
  margin-top: 2px;
}

/* Menú */
.sidebar-menu {
  background: transparent !important;
  padding: 16px 12px;
  flex-grow: 1;
}

.custom-menu-group {
  margin: 2px 0;
}

.menu-item {
  border-radius: 12px;
  margin: 4px 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 48px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.menu-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 3px;
  background: linear-gradient(135deg, var(--theme-accent), var(--theme-secondary)) !important;
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.menu-item:hover::before,
.menu-item.active-group::before {
  transform: scaleY(1);
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.08) !important;
  transform: translateX(4px);
}

.menu-item.active-group {
  background: rgba(255, 255, 255, 0.12) !important;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.menu-icon {
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  font-size: 20px;
}

.menu-icon.active-icon {
  color: white;
  transform: scale(1.1);
}

.menu-title {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  font-size: 0.95rem;
  letter-spacing: 0.3px;
}

.arrow-icon {
  color: rgba(255, 255, 255, 0.6);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 18px;
}

.rotate-arrow {
  transform: rotate(180deg);
  color: white;
}

/* Submenú Container */
.submenu-container {
  margin-left: 24px;
  border-left: 2px solid rgba(255, 255, 255, 0.1);
  padding-left: 8px;
}

.submenu-item {
  border-radius: 8px;
  margin: 2px 0;
  min-height: 40px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.03);
}

.submenu-item:hover {
  background: rgba(255, 255, 255, 0.08) !important;
  transform: translateX(4px);
}

.submenu-item.active-subitem {
  background: rgba(255, 255, 255, 0.12) !important;
  border-left-color: var(--theme-accent) !important;
}

.submenu-indicator {
  display: flex;
  align-items: center;
  margin-right: 16px;
}

.submenu-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
}

.submenu-item.active-subitem .submenu-dot {
  background: white;
  transform: scale(1.3);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
}

.submenu-title {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.87rem;
  font-weight: 400;
  transition: all 0.3s ease;
}

.submenu-item:hover .submenu-title {
  color: white;
}

.submenu-icon {
  color: rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
}

.submenu-item:hover .submenu-icon {
  color: white;
  transform: scale(1.1);
}

/* Animaciones */
.slide-down-enter-active {
  animation: slideDown 0.3s ease-out;
}

.slide-down-leave-active {
  animation: slideUp 0.2s ease-in;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
    max-height: 0;
  }
  to {
    opacity: 1;
    transform: translateY(0);
    max-height: 200px;
  }
}

@keyframes slideUp {
  from {
    opacity: 1;
    transform: translateY(0);
    max-height: 200px;
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
    max-height: 0;
  }
}

/* Divisores */
.menu-divider {
  border-color: rgba(255, 255, 255, 0.08);
  margin: 16px 0;
}

/* Footer */
.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
}

.user-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  background: rgba(255, 255, 255, 0.15) !important;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.user-avatar:hover {
  transform: scale(1.05);
  border-color: rgba(255, 255, 255, 0.4);
}

.user-info {
  line-height: 1.3;
  flex-grow: 1;
}

.user-name {
  font-size: 0.9rem;
  color: white;
  font-weight: 600;
}

.user-status {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 2px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 6px #4ade80;
}

/* Estados activos para items simples */
:deep(.active-item) {
  background: rgba(255, 255, 255, 0.12) !important;
}

:deep(.active-item .menu-icon) {
  color: white;
  transform: scale(1.1);
}

:deep(.active-item .menu-title) {
  color: white;
  font-weight: 600;
}

/* Efecto de onda al hacer clic */
.menu-item {
  position: relative;
  overflow: hidden;
}

.menu-item::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  transform: translate(-50%, -50%);
  transition: width 0.3s, height 0.3s;
}

.menu-item:active::after {
  width: 100px;
  height: 100px;
}

/* Responsive */
@media (max-width: 960px) {
  .sidebar-header {
    padding: 16px 12px;
  }
  
  .app-name {
    font-size: 1.1rem;
  }
  
  .menu-title {
    font-size: 0.85rem;
  }
  
  .submenu-container {
    margin-left: 20px;
  }
}
</style>