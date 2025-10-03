<template>
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
    };
  },
  computed: {
    filteredSites() {
      if (this.selectedFilter === "Todos") return this.sites;
      return this.sites.filter(site => site.category === this.selectedFilter);
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
        console.log(`El sitio ${site.name} fue actualizado a ${site.category}`);
      } catch (error) {
        console.error("Error actualizando categoría:", error);
      }
    },
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
    }
  },
  mounted() {
    this.fetchSites();
  }
};
</script>
