// src/shared/data/menu.js
export const menuItems = [
  {
    name: "Mi Perfil",
    icon: "mdi-account",
    route: "/profile"
  },
  {
    name: "Configuraciones",
    icon: "mdi-cog",
    children: [
      {
        name: "Categorías",
        route: "/settings/categories",
        icon: "mdi-shape"
      },
      {
        name: "Tiempo",
        route: "/settings/time",
        icon: "mdi-clock-outline"
      }
    ]
  },
  {
    name: "Tracking",
    icon: "mdi-chart-bar",
    route: "/tracking"
  }
];
