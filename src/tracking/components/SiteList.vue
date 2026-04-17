<!-- components/SiteList.vue -->
<template>
  <v-container fluid class="pa-4">
    <v-card class="elegant-card pa-4" elevation="2">
      <div class="text-center mb-4">
        <v-icon color="primary" size="48" class="mb-2">mdi-web</v-icon>
        <h2 class="text-h5 font-weight-bold primary--text mb-1">
          Clasificación de Sitios Web
        </h2>
        <p class="text-caption text--secondary">
          Organiza y categoriza tus sitios web según su productividad
        </p>
      </div>

      <v-alert v-if="loading" type="info" variant="tonal" class="mb-4">
        <div class="d-flex align-center">
          <v-progress-circular indeterminate size="20" class="mr-3"></v-progress-circular>
          Cargando sitios web...
        </div>
      </v-alert>

      <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-4">
        <div class="d-flex align-center justify-space-between">
          <span>{{ errorMessage }}</span>
          <v-btn color="error" variant="text" size="small" @click="$emit('retry')" prepend-icon="mdi-refresh">
            Reintentar
          </v-btn>
        </div>
      </v-alert>

      <template v-if="!errorMessage && !loading">
        <v-card variant="outlined" class="pa-3 mb-4">
          <div class="text-caption font-weight-medium mb-2 text-center">Filtrar por categoría:</div>
          <div class="d-flex flex-wrap gap-2 justify-center">
            <v-chip
              v-for="cat in categoriesFilter"
              :key="cat"
              :color="selectedFilter === cat ? 'primary' : 'grey lighten-3'"
              :text-color="selectedFilter === cat ? 'white' : 'grey darken-2'"
              @click="$emit('filter-change', cat)"
              class="filter-chip"
              size="small"
              :prepend-icon="getFilterIcon(cat)"
            >
              {{ cat }}
            </v-chip>
          </div>
        </v-card>

        <v-card variant="outlined" class="elevation-1">
          <v-data-table
            :headers="headers"
            :items="filteredSites"
            :items-per-page="10"
            item-value="id"
            density="comfortable"
            class="site-table"
          >
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

            <template #item.classification="{ item }">
              <v-menu location="bottom" :close-on-content-click="true">
                <template v-slot:activator="{ props }">
                  <v-btn 
                    v-bind="props"
                    variant="outlined"
                    density="compact"
                    :color="classificationColor(item.classification)"
                    :prepend-icon="getClassificationIcon(item.classification)"
                    class="classification-btn"
                  >
                    {{ item.classification }}
                    <v-icon end>mdi-chevron-down</v-icon>
                  </v-btn>
                </template>
                
                <v-card width="220" class="classification-menu-card">
                  <v-list density="compact" class="classification-menu-list">
                    <v-list-item
                      v-for="option in classificationOptions"
                      :key="option.value"
                      @click="$emit('classification-update', item, option.value)"
                      :class="{ 'active-classification': item.classification === option.value }"
                      class="classification-menu-item"
                    >
                      <template #prepend>
                        <v-icon :color="classificationColor(option.value)" size="small">
                          {{ getClassificationIcon(option.value) }}
                        </v-icon>
                      </template>
                      <v-list-item-title class="classification-menu-title">
                        {{ option.title }}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-menu>
            </template>

            <template #no-data>
              <div class="text-center py-8">
                <v-icon size="64" color="grey lighten-2" class="mb-2">mdi-web-off</v-icon>
                <div class="text-h6 text--secondary">No hay sitios web</div>
                <div class="text-caption text--secondary mt-1">Agrega algunos sitios para comenzar</div>
              </div>
            </template>
          </v-data-table>
        </v-card>

        <v-card variant="tonal" class="mt-4 pa-3">
          <div class="d-flex justify-space-around text-center">
            <div v-for="stat in siteStats" :key="stat.label" class="stat-item">
              <div class="text-h6 font-weight-bold" :class="stat.color">{{ stat.value }}</div>
              <div class="text-caption text--secondary">{{ stat.label }}</div>
            </div>
          </div>
        </v-card>
      </template>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "SiteList",
  props: {
    sites: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    errorMessage: {
      type: String,
      default: null
    },
    selectedFilter: {
      type: String,
      default: "Todos"
    },
    filteredSites: {
      type: Array,
      default: () => []
    },
    siteStats: {
      type: Array,
      default: () => []
    }
  },
  emits: ['filter-change', 'classification-update', 'retry'],
  data() {
    return {
      categoriesFilter: [
        "Todos",
        "Sin Categoría",
        "Productivo",
        "Neutral",
        "Doble Filo",
        "Distractivo"
      ],
      headers: [
        { title: "Dominio", value: "name", width: "60%" },
        { title: "Clasificación", value: "classification", width: "40%" }
      ],
      classificationOptions: [
        { title: "Sin Categoría", value: "Sin Categoría" },
        { title: "Productivo", value: "Productivo" },
        { title: "Neutral", value: "Neutral" },
        { title: "Doble Filo", value: "Doble Filo" },
        { title: "Distractivo", value: "Distractivo" }
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
        
        // Entretenimiento
        'netflix.com': { icon: 'mdi-television-play', color: '#E50914', bg: '#FFE5E7', name: 'Netflix' },
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
        
        // Default - DEBE ESTAR SIEMPRE AL FINAL
        'default': { icon: 'mdi-earth', color: '#666666', bg: '#F5F5F5', name: 'Sitio Web' }
      }
    };
  },
  methods: {
    extractDomainName(fullUrl) {
      if (!fullUrl) return 'Desconocido';
      try {
        let domain = fullUrl.toLowerCase();
        domain = domain.replace(/^(https?:\/\/)?(www\.)?/, '');
        domain = domain.split('/')[0];
        domain = domain.split('?')[0];
        return domain;
      } catch (error) {
        console.warn("Error extrayendo dominio:", fullUrl, error);
        return 'Desconocido';
      }
    },
    
    getDomainInfo(domain) {
      if (!domain) {
        console.warn("Dominio vacío, usando default");
        return this.domainPatterns.default;
      }
      
      try {
        const cleanDomain = this.extractDomainName(domain);
        console.log("Buscando info para dominio:", cleanDomain);
        
        // Buscar coincidencia exacta primero
        for (const [pattern, info] of Object.entries(this.domainPatterns)) {
          if (pattern !== 'default' && cleanDomain === pattern) {
            console.log("Coincidencia exacta encontrada:", pattern);
            return info;
          }
        }
        
        // Buscar coincidencia parcial
        for (const [pattern, info] of Object.entries(this.domainPatterns)) {
          if (pattern !== 'default' && cleanDomain.includes(pattern)) {
            console.log("Coincidencia parcial encontrada:", pattern);
            return info;
          }
        }
        
        console.log("Usando default para dominio:", cleanDomain);
        return this.domainPatterns.default;
        
      } catch (error) {
        console.error("Error en getDomainInfo:", domain, error);
        return this.domainPatterns.default;
      }
    },
    
    getDomainIcon(domain) {
      const info = this.getDomainInfo(domain);
      return info?.icon || 'mdi-earth';
    },
    
    getDomainColor(domain) {
      const info = this.getDomainInfo(domain);
      return info?.bg || '#F5F5F5';
    },
    
    getDomainIconColor(domain) {
      const info = this.getDomainInfo(domain);
      return info?.color || '#666666';
    },

    classificationColor(classification) {
      const colors = {
        "Productivo": "success",
        "Neutral": "grey",
        "Doble Filo": "warning",
        "Distractivo": "error",
        "Sin Categoría": "blue-grey"
      };
      return colors[classification] || "primary";
    },
    
    getClassificationIcon(classification) {
      const icons = {
        "Productivo": "mdi-check-circle",
        "Neutral": "mdi-minus-circle",
        "Doble Filo": "mdi-alert-circle",
        "Distractivo": "mdi-close-circle",
        "Sin Categoría": "mdi-help-circle"
      };
      return icons[classification] || "mdi-help-circle";
    },
    
    getFilterIcon(classification) {
      const icons = {
        "Todos": "mdi-view-dashboard",
        "Sin Categoría": "mdi-help-circle",
        "Productivo": "mdi-check-circle",
        "Neutral": "mdi-minus-circle",
        "Doble Filo": "mdi-alert-circle",
        "Distractivo": "mdi-close-circle"
      };
      return icons[classification] || "mdi-circle";
    }
  }
};
</script>

<style scoped>
.elegant-card {
  border-radius: 12px;
  max-width: 100%;
}

.filter-chip {
  cursor: pointer;
  transition: all 0.1s ease;
  font-weight: 500;
}

.filter-chip:hover {
  transform: translateY(-1px);
}

.site-table {
  border-radius: 8px;
}

.classification-btn {
  min-width: 140px !important;
  justify-content: start !important;
  transition: all 0.2s ease;
}

.classification-btn:hover {
  transform: scale(1.05);
}

.stat-item {
  padding: 8px 16px;
}

.gap-2 {
  gap: 8px;
}

:deep(.classification-menu-card) {
  background: white !important;
  border: 1px solid #e0e0e0 !important;
  border-radius: 8px !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
}

:deep(.classification-menu-list) {
  background: white !important;
  border-radius: 8px !important;
  padding: 4px 0 !important;
}

:deep(.classification-menu-item) {
  background: white !important;
  min-height: 40px !important;
  border-radius: 4px !important;
  margin: 2px 8px !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
}

:deep(.classification-menu-item:hover) {
  background: #f8f9fa !important;
  transform: translateX(2px);
}

:deep(.active-classification) {
  background: #e3f2fd !important;
  color: #1976d2 !important;
}

:deep(.classification-menu-title) {
  color: #333 !important;
  font-weight: 500 !important;
  font-size: 0.875rem !important;
}

:deep(.active-classification .classification-menu-title) {
  color: #1976d2 !important;
  font-weight: 600 !important;
}

:deep(.v-overlay__content) {
  z-index: 9999 !important;
}

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
  
  .classification-btn {
    min-width: 120px !important;
    font-size: 0.8rem !important;
  }
}
</style>