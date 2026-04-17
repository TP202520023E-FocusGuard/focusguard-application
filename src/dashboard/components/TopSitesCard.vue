<template>
  <v-card 
    class="top-sites-card" 
    elevation="2" 
    rounded="lg"
    hover
  >
    <v-card-text class="pa-3">
      
      <!-- Header -->
      <div class="card-header">
        <div class="header-content">
          <v-icon color="#9C27B0" size="20" class="header-icon">mdi-web</v-icon>
          <h3 class="card-title">Sitios más visitados</h3>
        </div>
        <div class="header-stats">
          <div class="total-visits">
            <span class="total-number">{{ totalVisits }}</span>
            <span class="total-label">visitas</span>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-4">
        <v-progress-circular indeterminate color="primary" />
      </div>

      <!-- Empty -->
      <div v-else-if="topSites.length === 0" class="text-center py-4">
        <span class="text-grey">No hay datos disponibles</span>
      </div>

      <!-- List -->
      <div v-else class="sites-list">
        <div 
          v-for="(site, index) in topSites" 
          :key="site.id"
          class="site-item"
          :class="getRankClass(index)"
        >
          <div class="site-rank">
            <div class="rank-badge" :class="getRankBadgeClass(index)">
              {{ index + 1 }}
            </div>
          </div>
          
          <div class="site-content">
            <div class="site-main">
              <div class="site-name">{{ site.name }}</div>
            </div>
            
            <div class="site-stats">
              <div class="stat">
                <span class="stat-value">{{ site.visits }}</span>
                <span class="stat-label">visitas</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ site.time }}</span>
                <span class="stat-label">tiempo</span>
              </div>
            </div>
          </div>
          
          <div class="site-trend" :class="site.trend">
            <v-icon 
              size="14" 
              :color="site.trend === 'up' ? '#4CAF50' : '#F44336'"
            >
              mdi-{{ site.trend === 'up' ? 'trending-up' : 'trending-down' }}
            </v-icon>
          </div>
        </div>
      </div>

    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { topSiteService } from '../services/TopSiteService'

const topSites = ref([])
const loading = ref(false)

const fetchTopSites = async () => {
  loading.value = true
  try {
    const data = await topSiteService.getTopSites()

    topSites.value = (data || []).slice(0, 5).map((site) => ({
      id: site.name,
      name: site.name,
      visits: site.visits,
      time: site.time_minutes < 60
        ? `${site.time_minutes.toFixed(1)} min`
        : `${site.time_hours.toFixed(2)} h`,
      trend: 'up' // luego puedes hacerlo dinámico
    }))

  } catch (error) {
    console.error("Error cargando top sites:", error)
    topSites.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchTopSites)

const totalVisits = computed(() => {
  return topSites.value.reduce((total, site) => total + site.visits, 0)
})

const getRankClass = (index) => {
  if (index === 0) return 'first-rank'
  if (index === 1) return 'second-rank'
  if (index === 2) return 'third-rank'
  return 'other-rank'
}

const getRankBadgeClass = (index) => {
  if (index === 0) return 'rank-gold'
  if (index === 1) return 'rank-silver'
  if (index === 2) return 'rank-bronze'
  return 'rank-other'
}
</script>

<style scoped>
.top-sites-card {
  height: 100%;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
}

.top-sites-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12) !important;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-icon {
  background: rgba(156, 39, 176, 0.1);
  padding: 5px;
  border-radius: 6px;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.9);
  margin: 0;
}

.header-stats {
  text-align: right;
}

.total-visits {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.total-number {
  font-size: 1.1rem;
  font-weight: 700;
  color: #9C27B0;
  line-height: 1;
}

.total-label {
  font-size: 0.7rem;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 500;
  margin-top: 2px;
}

.sites-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.site-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.site-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #E0E0E0;
  transition: all 0.2s ease;
}

.site-item.first-rank::before {
  background: #FFD700;
}

.site-item.second-rank::before {
  background: #C0C0C0;
}

.site-item.third-rank::before {
  background: #CD7F32;
}

.site-item:hover {
  background: rgba(156, 39, 176, 0.03);
  transform: translateX(2px);
}

.site-rank {
  flex-shrink: 0;
}

.rank-badge {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.75rem;
  color: white;
}

.rank-gold {
  background: linear-gradient(135deg, #FFD700, #FFA000);
}

.rank-silver {
  background: linear-gradient(135deg, #C0C0C0, #909090);
}

.rank-bronze {
  background: linear-gradient(135deg, #CD7F32, #8B4513);
}

.rank-other {
  background: linear-gradient(135deg, #9C27B0, #7B1FA2);
}

.site-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.site-main {
  flex: 1;
}

.site-name {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.9);
  font-size: 0.8rem;
  line-height: 1.2;
}

.site-stats {
  display: flex;
  gap: 12px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  font-size: 0.7rem;
  text-align: center;
}

.stat-value {
  font-weight: 700;
  color: rgba(0, 0, 0, 0.9);
  line-height: 1;
}

.stat-label {
  color: rgba(0, 0, 0, 0.5);
  font-size: 0.6rem;
  font-weight: 500;
}

.site-trend {
  padding: 2px 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.site-trend.up {
  background: rgba(76, 175, 80, 0.1);
}

.site-trend.down {
  background: rgba(244, 67, 54, 0.1);
}
</style>