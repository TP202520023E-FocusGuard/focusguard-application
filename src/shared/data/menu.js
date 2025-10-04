// src/shared/data/menu.js
export const menuItems = [
  {
    name: "Mi Perfil",
<<<<<<< Updated upstream
    icon: "mdi-account",
    route: "/profile"
=======
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
>>>>>>> Stashed changes
  },
  {
    name: "Configuraciones",
    icon: "mdi-cog",
    children: [
      {
<<<<<<< Updated upstream
        name: "Categorías",
        route: "/settings/categories",
        icon: "mdi-shape"
      },
      {
        name: "Tiempo",
        route: "/settings/time",
        icon: "mdi-clock-outline"
=======
        name: "Tiempo de Ocio",
        route: "/settings/leisure-time",
        icon: "mdi-timer-sand"
>>>>>>> Stashed changes
      }
    ]
  },
  {
    name: "Tracking",
    icon: "mdi-chart-bar",
    route: "/tracking"
  }
];
