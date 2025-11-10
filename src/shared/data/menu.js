// src/shared/data/menu.js
export const menuItems = [
  {
    name: "Mi Perfil",
    icon: "mdi-account-circle",
    children: [
      {
        name: "Información personal",
        route: "/profile/info",
      },
      {
        name: "Mis Categorías",  // <-- Nuevo submenú
        route: "/profile/categories",  // Ruta sugerida (ajústala según tu router)
        icon: "mdi-shape-plus"  // Icono sugerido (ajústalo según tus preferencias)
      }
    ],
  },
  {
    name: "Configuraciones",
    icon: "mdi-cog",
    children: [
      {
        name: "Tiempo de Ocio",
        route: "/settings/leisure-time",
        icon: "mdi-timer-sand"
      },
      {
        name: "Apariencia",
        route: "/settings/appearance",
        icon: "mdi-palette"
      }
    ]
  },
  {
    name: "Tracking",
    icon: "mdi-chart-bar",
    route: "/tracking"
  },
  {
    name: "Dashboard",
    icon: "mdi-view-dashboard",
    route: "/dashboard"
  }
];
