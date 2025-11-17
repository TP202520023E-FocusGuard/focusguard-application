<!-- pages/TrackingPage.vue -->
<template>
  <div class="tracking-page">
    <SiteList
      :sites="sites"
      :loading="loading"
      :error-message="errorMessage"
      :selected-filter="selectedFilter"
      :filtered-sites="filteredSites"
      :site-stats="siteStats"
      @filter-change="handleFilterChange"
      @classification-update="handleClassificationUpdate"
      @retry="fetchSites"
    />
  </div>
</template>

<script>
import SiteList from "../components/SiteList.vue";
import { siteService } from "../services/TrackingService";

export default {
  name: "TrackingPage",
  components: { SiteList },
  data() {
    return {
      sites: [],
      selectedFilter: "Todos",
      loading: false,
      errorMessage: null
    };
  },
  computed: {
    filteredSites() {
      return siteService.filterSites(this.sites, this.selectedFilter);
    },
    siteStats() {
      return siteService.getSiteStats(this.sites);
    }
  },
  methods: {
    async fetchSites() {
      try {
        this.loading = true;
        this.errorMessage = null;
        
        this.sites = await siteService.getSites();
        console.log(`✅ ${this.sites.length} sitios cargados exitosamente`);

      } catch (error) {
        console.error("❌ Error cargando sitios:", error);
        this.errorMessage = "Error al cargar los sitios web: " + error.message;
      } finally {
        this.loading = false;
      }
    },

    async handleClassificationUpdate(site, newClassification) {
      try {
        if (site.classification === newClassification) return;

        await siteService.updateSiteClassification(site.rawData.id, newClassification);
        
        // Actualizar UI localmente
        site.classification = newClassification;
        this.errorMessage = null;

        console.log(`✅ Sitio ${site.name} actualizado a: ${site.classification}`);

      } catch (error) {
        console.error("❌ Error actualizando clasificación:", error);
        this.errorMessage = "Error al actualizar clasificación: " + error.message;
      }
    },

    handleFilterChange(filter) {
      this.selectedFilter = filter;
    }
  },
  mounted() {
    this.fetchSites();
  }
};
</script>

<style scoped>
.tracking-page {
  padding: 20px;
}
</style>