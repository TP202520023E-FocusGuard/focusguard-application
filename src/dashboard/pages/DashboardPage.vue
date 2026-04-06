<template>
  <div class="dashboard-page">
    <v-container fluid class="pa-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-h4 font-weight-bold">Dashboard</h1>
      </div>

      <!-- Goal Card -->
      <v-row class="mb-6">
        <v-col cols="12">
          <GoalCard />
        </v-col>
      </v-row>

      <!-- Middle Section -->
      <v-row class="mb-6">
        <v-col cols="12" md="6">
          <TopSitesCard />
        </v-col>
        <v-col cols="12" md="6">
          <RestTimeCard />
        </v-col>
      </v-row>

      <!-- Bottom Section -->
      <v-row>
        <v-col cols="12">
          <LeisureContentCard />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import GoalCard from '../components/GoalCard.vue'
import TopSitesCard from '../components/TopSitesCard.vue'
import RestTimeCard from '../components/RestTimeCard.vue'
import LeisureContentCard from '../components/LeisureContentCard.vue'
</script>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  background: #f8f9fa;
}
</style>