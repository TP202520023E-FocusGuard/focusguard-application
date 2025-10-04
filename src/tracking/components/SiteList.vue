<template>
<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream
>>>>>>> Stashed changes
  <v-container fluid>
    <v-card class="pa-4">
      <v-card-title class="text-h6">
        Clasificación de Sitios Web
      </v-card-title>

      <!-- Filtros -->
      <v-btn-toggle
        v-model="selectedFilter"
        class="my-4"
        divided
        mandatory
      >
        <v-btn
          v-for="cat in categoriesFilter"
          :key="cat"
          :value="cat"
          color="primary"
          variant="outlined"
        >
          {{ cat }}
        </v-btn>
      </v-btn-toggle>

      <!-- Tabla de sitios -->
      <v-data-table
        :headers="headers"
        :items="filteredSites"
        class="elevation-1"
        item-value="id"
        density="comfortable"
      >
        <template #item.category="{ item }">
          <v-select
            v-model="item.category"
            :items="categoryOptions"
            density="compact"
            variant="outlined"
            hide-details
            @update:model-value="() => updateCategory(item)"
          />
        </template>

        <template #item.estado="{ item }">
          <v-tooltip location="top">
            <template #activator="{ props }">
              <v-chip
                v-bind="props"
                :color="categoryColor(item.category)"
                variant="flat"
                class="text-white text-capitalize"
                size="small"
                prepend-icon="mdi-tag"
                elevation="1"
              >
                {{ item.category }}
              </v-chip>
            </template>
            <span>Categoría asignada: {{ item.category }}</span>
          </v-tooltip>
        </template>
      </v-data-table>
<<<<<<< Updated upstream
=======
=======
  <v-container fluid class="pa-4">
    <v-card class="elegant-card pa-4" elevation="2">
      <!-- Header mejorado -->
      <div class="text-center mb-4">
        <v-icon color="primary" size="48" class="mb-2">mdi-web</v-icon>
        <h2 class="text-h5 font-weight-bold primary--text mb-1">
          Clasificación de Sitios Web
        </h2>
        <p class="text-caption text--secondary">
          Organiza y categoriza tus sitios web según su productividad
        </p>
      </div>

      <!-- Filtros mejorados -->
      <v-card variant="outlined" class="pa-3 mb-4">
        <div class="text-caption font-weight-medium mb-2 text-center">Filtrar por categoría:</div>
        <div class="d-flex flex-wrap gap-2 justify-center">
          <v-chip
            v-for="cat in categoriesFilter"
            :key="cat"
            :color="selectedFilter === cat ? 'primary' : 'grey lighten-3'"
            :text-color="selectedFilter === cat ? 'white' : 'grey darken-2'"
            @click="selectedFilter = cat"
            class="filter-chip"
            size="small"
            :prepend-icon="getFilterIcon(cat)"
          >
            {{ cat }}
          </v-chip>
        </div>
      </v-card>

      <!-- Tabla mejorada -->
      <v-card variant="outlined" class="elevation-1">
        <v-data-table
          :headers="headers"
          :items="filteredSites"
          :items-per-page="10"
          item-value="id"
          density="comfortable"
          class="site-table"
        >
          <!-- Columna Dominio -->
          <template #item.name="{ item }">
            <div class="d-flex align-center">
              <v-avatar size="32" :color="getDomainColor(item.name)" class="mr-3">
                <v-icon :color="getDomainIconColor(item.name)" size="18">
                  {{ getDomainIcon(item.name) }}
                </v-icon>
              </v-avatar>
              <div>
                <div class="text-body-2 font-weight-medium">{{ extractDomainName(item.name) }}</div>
                <div class="text-caption text--secondary">{{ item.name }}</div>
              </div>
            </div>
          </template>

          <!-- Columna Categoría -->
          <template #item.category="{ item }">
            <v-select
              v-model="item.category"
              :items="categoryOptions"
              item-title="title"
              item-value="value"
              density="compact"
              variant="outlined"
              hide-details
              :color="categoryColor(item.category)"
              @update:model-value="() => updateCategory(item)"
              class="category-select"
              :prepend-icon="getCategoryIcon(item.category)"
            >
              <template #item="{ props, item: option }">
                <v-list-item v-bind="props">
                  <template #prepend>
                    <v-icon :color="categoryColor(option.value)" size="small">
                      {{ getCategoryIcon(option.value) }}
                    </v-icon>
                  </template>
                </v-list-item>
              </template>
            </v-select>
          </template>

          <!-- Columna Estado -->
          <template #item.estado="{ item }">
            <v-tooltip location="top">
              <template #activator="{ props }">
                <v-chip
                  v-bind="props"
                  :color="categoryColor(item.category)"
                  variant="flat"
                  class="text-white font-weight-medium"
                  size="small"
                  :prepend-icon="getCategoryIcon(item.category)"
                  elevation="1"
                  :class="`category-chip ${item.category.toLowerCase().replace(' ', '-')}`"
                >
                  {{ item.category }}
                </v-chip>
              </template>
              <span>Categoría: {{ item.category }}</span>
            </v-tooltip>
          </template>

          <!-- Empty state -->
          <template #no-data>
            <div class="text-center py-8">
              <v-icon size="64" color="grey lighten-2" class="mb-2">mdi-web-off</v-icon>
              <div class="text-h6 text--secondary">No hay sitios web</div>
              <div class="text-caption text--secondary mt-1">Agrega algunos sitios para comenzar</div>
            </div>
          </template>
        </v-data-table>
      </v-card>

      <!-- Estadísticas rápidas -->
      <v-card variant="tonal" class="mt-4 pa-3">
        <div class="d-flex justify-space-around text-center">
          <div v-for="stat in siteStats" :key="stat.label" class="stat-item">
            <div class="text-h6 font-weight-bold" :class="stat.color">{{ stat.value }}</div>
            <div class="text-caption text--secondary">{{ stat.label }}</div>
          </div>
        </div>
      </v-card>
>>>>>>> Stashed changes
>>>>>>> Stashed changes
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "SiteList",
  data() {
    return {
      sites: [],
      selectedFilter: "Todos",
      categoriesFilter: [
        "Todos",
        "Sin Categoría",
        "Productivo",
        "Neutral",
        "Doble Filo",
        "Distractor"
      ],
      headers: [
<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream
>>>>>>> Stashed changes
        { title: "Dominio", value: "name" },
        { title: "Categoría", value: "category" },
        { title: "Estado", value: "estado" }
      ],
      categoryOptions: [
        "Sin Categoría",
        "Productivo",
        "Neutral",
        "Doble Filo",
        "Distractor"
      ]
<<<<<<< Updated upstream
=======
=======
        { title: "Dominio", value: "name", width: "40%" },
        { title: "Categoría", value: "category", width: "30%" },
        { title: "Estado", value: "estado", width: "30%" }
      ],
      categoryOptions: [
        { title: "Sin Categoría", value: "Sin Categoría" },
        { title: "Productivo", value: "Productivo" },
        { title: "Neutral", value: "Neutral" },
        { title: "Doble Filo", value: "Doble Filo" },
        { title: "Distractor", value: "Distractor" }
      ],
      domainPatterns: {
        // Redes Sociales
        'facebook.com': { icon: 'mdi-facebook', color: '#1877F2', bg: '#E7F3FF', name: 'Facebook' },
        'instagram.com': { icon: 'mdi-instagram', color: '#E4405F', bg: '#FDEBF1', name: 'Instagram' },
        'twitter.com': { icon: 'mdi-twitter', color: '#1DA1F2', bg: '#E8F5FE', name: 'Twitter' },
        'x.com': { icon: 'mdi-twitter', color: '#1DA1F2', bg: '#E8F5FE', name: 'X' },
        'linkedin.com': { icon: 'mdi-linkedin', color: '#0A66C2', bg: '#E8F0FA', name: 'LinkedIn' },
        'youtube.com': { icon: 'mdi-youtube', color: '#FF0000', bg: '#FFE5E5', name: 'YouTube' },
        'tiktok.com': { icon: 'mdi-music-note', color: '#000000', bg: '#F0F0F0', name: 'TikTok' },
        'whatsapp.com': { icon: 'mdi-whatsapp', color: '#25D366', bg: '#E6F7ED', name: 'WhatsApp' },
        
        // Entretenimiento - ICONOS CORREGIDOS
        'netflix.com': { icon: 'mdi-netflix', color: '#E50914', bg: '#FFE5E7', name: 'Netflix' },
        'spotify.com': { icon: 'mdi-spotify', color: '#1DB954', bg: '#E6F7ED', name: 'Spotify' },
        'twitch.tv': { icon: 'mdi-twitch', color: '#9146FF', bg: '#F0E6FF', name: 'Twitch' },
        'discord.com': { icon: 'mdi-discord', color: '#5865F2', bg: '#E8EAFF', name: 'Discord' },
        'primevideo.com': { icon: 'mdi-television-classic', color: '#00A8E1', bg: '#E6F7FF', name: 'Prime Video' },
        
        // Productividad
        'gmail.com': { icon: 'mdi-gmail', color: '#EA4335', bg: '#FFE8E6', name: 'Gmail' },
        'google.com': { icon: 'mdi-google', color: '#4285F4', bg: '#E8F0FE', name: 'Google' },
        'drive.google.com': { icon: 'mdi-google-drive', color: '#34A853', bg: '#E6F4EA', name: 'Google Drive' },
        'github.com': { icon: 'mdi-github', color: '#181717', bg: '#F0F0F0', name: 'GitHub' },
        'gitlab.com': { icon: 'mdi-gitlab', color: '#FC6D26', bg: '#FEF0E8', name: 'GitLab' },
        'notion.so': { icon: 'mdi-note', color: '#000000', bg: '#F0F0F0', name: 'Notion' },
        'slack.com': { icon: 'mdi-slack', color: '#4A154B', bg: '#F3E8F3', name: 'Slack' },
        'teams.microsoft.com': { icon: 'mdi-microsoft-teams', color: '#6264A7', bg: '#F0F0F7', name: 'Microsoft Teams' },
        'outlook.com': { icon: 'mdi-email', color: '#0072C6', bg: '#E6F0FF', name: 'Outlook' },
        
        // Educación
        'coursera.org': { icon: 'mdi-school', color: '#0056D2', bg: '#E6EEFF', name: 'Coursera' },
        'udemy.com': { icon: 'mdi-video', color: '#A435F0', bg: '#F5E6FF', name: 'Udemy' },
        'khanacademy.org': { icon: 'mdi-book-open', color: '#14BF96', bg: '#E6F7F2', name: 'Khan Academy' },
        'edx.org': { icon: 'mdi-school', color: '#02262B', bg: '#E6ECED', name: 'edX' },
        
        // Comercio
        'amazon.com': { icon: 'mdi-cart', color: '#FF9900', bg: '#FFF5E6', name: 'Amazon' },
        'mercadolibre.com': { icon: 'mdi-shopping', color: '#00A2E8', bg: '#E6F5FF', name: 'Mercado Libre' },
        'ebay.com': { icon: 'mdi-shopping', color: '#0064D2', bg: '#E6F0FF', name: 'eBay' },
        
        // Noticias
        'reddit.com': { icon: 'mdi-reddit', color: '#FF4500', bg: '#FFE8E6', name: 'Reddit' },
        'news.ycombinator.com': { icon: 'mdi-newspaper', color: '#FF6600', bg: '#FFF0E6', name: 'Hacker News' },
        
        // Default
        'default': { icon: 'mdi-earth', color: '#666666', bg: '#F5F5F5', name: 'Sitio Web' }
      }
>>>>>>> Stashed changes
>>>>>>> Stashed changes
    };
  },
  computed: {
    filteredSites() {
      if (this.selectedFilter === "Todos") return this.sites;
<<<<<<< Updated upstream
      return this.sites.filter(site => site.category === this.selectedFilter);
=======
<<<<<<< Updated upstream
      return this.sites.filter(site => site.category === this.selectedFilter);
=======
      if (this.selectedFilter === "Sin Categoría") {
        return this.sites.filter(site => !site.category || site.category === "Sin Categoría");
      }
      return this.sites.filter(site => site.category === this.selectedFilter);
    },
    siteStats() {
      const total = this.sites.length;
      const categorized = this.sites.filter(site => site.category && site.category !== "Sin Categoría").length;
      const productive = this.sites.filter(site => site.category === "Productivo").length;
      
      return [
        { label: "Total Sitios", value: total, color: "primary--text" },
        { label: "Categorizados", value: categorized, color: "green--text" },
        { label: "Productivos", value: productive, color: "success--text" }
      ];
>>>>>>> Stashed changes
>>>>>>> Stashed changes
    }
  },
  methods: {
    async fetchSites() {
      try {
        const response = await axios.get("http://localhost:3001/sites");
        this.sites = response.data;
      } catch (error) {
        console.error("Error cargando sitios:", error);
      }
    },
    async updateCategory(site) {
      try {
        await axios.put(`http://localhost:3001/sites/${site.id}`, site);
<<<<<<< Updated upstream
        console.log(`El sitio ${site.name} fue actualizado a ${site.category}`);
=======
<<<<<<< Updated upstream
        console.log(`El sitio ${site.name} fue actualizado a ${site.category}`);
=======
        console.log(`Sitio ${site.name} actualizado a: ${site.category}`);
        this.$forceUpdate();
>>>>>>> Stashed changes
>>>>>>> Stashed changes
      } catch (error) {
        console.error("Error actualizando categoría:", error);
      }
    },
<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream
>>>>>>> Stashed changes
    categoryColor(category) {
      switch (category) {
        case "Productivo":
          return "green";
        case "Neutral":
          return "grey";
        case "Doble Filo":
          return "orange";
        case "Distractor":
          return "red";
        case "Sin Categoría":
          return "blue-grey";
        default:
          return "primary";
      }
<<<<<<< Updated upstream
=======
=======
    
    // FUNCIÓN PRINCIPAL PARA EXTRAER DOMINIO Y ASIGNAR ICONO
    extractDomainName(fullUrl) {
      if (!fullUrl) return 'Desconocido';
      
      // Limpiar la URL y extraer el dominio
      let domain = fullUrl.toLowerCase();
      
      // Remover protocolos
      domain = domain.replace(/^(https?:\/\/)?(www\.)?/, '');
      
      // Remover paths y parámetros
      domain = domain.split('/')[0];
      domain = domain.split('?')[0];
      
      return domain;
    },
    
    getDomainInfo(domain) {
      if (!domain) return this.domainPatterns.default;
      
      const cleanDomain = this.extractDomainName(domain);
      console.log('🔍 Analizando dominio:', domain, '->', cleanDomain);
      
      // Buscar coincidencia EXACTA primero
      for (const [pattern, info] of Object.entries(this.domainPatterns)) {
        if (pattern !== 'default' && cleanDomain === pattern) {
          console.log('✅ Coincidencia EXACTA:', pattern);
          return info;
        }
      }
      
      // Si no hay coincidencia exacta, buscar parcial
      for (const [pattern, info] of Object.entries(this.domainPatterns)) {
        if (pattern !== 'default' && cleanDomain.includes(pattern)) {
          console.log('✅ Coincidencia PARCIAL:', pattern);
          return info;
        }
      }
      
      console.log('❌ No se encontró coincidencia para:', cleanDomain);
      return this.domainPatterns.default;
    },
    
    getDomainIcon(domain) {
      return this.getDomainInfo(domain).icon;
    },
    
    getDomainColor(domain) {
      return this.getDomainInfo(domain).bg;
    },
    
    getDomainIconColor(domain) {
      return this.getDomainInfo(domain).color;
    },
    
    getDisplayName(domain) {
      return this.getDomainInfo(domain).name;
    },

    categoryColor(category) {
      const colors = {
        "Productivo": "success",
        "Neutral": "grey",
        "Doble Filo": "warning",
        "Distractor": "error",
        "Sin Categoría": "blue-grey"
      };
      return colors[category] || "primary";
    },
    
    getCategoryIcon(category) {
      const icons = {
        "Productivo": "mdi-check-circle",
        "Neutral": "mdi-minus-circle",
        "Doble Filo": "mdi-alert-circle",
        "Distractor": "mdi-close-circle",
        "Sin Categoría": "mdi-help-circle"
      };
      return icons[category] || "mdi-help-circle";
    },
    
    getFilterIcon(category) {
      const icons = {
        "Todos": "mdi-view-dashboard",
        "Sin Categoría": "mdi-help-circle",
        "Productivo": "mdi-check-circle",
        "Neutral": "mdi-minus-circle",
        "Doble Filo": "mdi-alert-circle",
        "Distractor": "mdi-close-circle"
      };
      return icons[category] || "mdi-circle";
>>>>>>> Stashed changes
>>>>>>> Stashed changes
    }
  },
  mounted() {
    this.fetchSites();
  }
};
</script>
<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream
=======

<style scoped>
/* Tus estilos existentes se mantienen igual */
.elegant-card {
  border-radius: 12px;
  max-width: 100%;
}

.filter-chip {
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.filter-chip:hover {
  transform: translateY(-1px);
}

.site-table {
  border-radius: 8px;
}

.category-chip {
  transition: all 0.2s ease;
}

.category-chip:hover {
  transform: scale(1.05);
}

.category-select {
  min-width: 140px;
}

.stat-item {
  padding: 8px 16px;
}

.gap-2 {
  gap: 8px;
}

/* Estilos específicos para cada categoría */
.category-chip.sin-categoría {
  background: linear-gradient(135deg, #78909c, #546e7a) !important;
}

.category-chip.productivo {
  background: linear-gradient(135deg, #4caf50, #2e7d32) !important;
}

.category-chip.neutral {
  background: linear-gradient(135deg, #9e9e9e, #757575) !important;
}

.category-chip.doble-filo {
  background: linear-gradient(135deg, #ff9800, #f57c00) !important;
}

.category-chip.distractor {
  background: linear-gradient(135deg, #f44336, #c62828) !important;
}

/* Responsive */
@media (max-width: 960px) {
  .elegant-card {
    padding: 16px !important;
  }
  
  .stat-item {
    padding: 4px 8px;
  }
}

@media (max-width: 600px) {
  .elegant-card {
    padding: 12px !important;
    border-radius: 8px;
  }
  
  .d-flex.justify-space-around {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
>>>>>>> Stashed changes
>>>>>>> Stashed changes
