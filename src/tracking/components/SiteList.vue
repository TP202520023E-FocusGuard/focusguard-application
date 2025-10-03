<template>
  <div class="site-list">
    <h2 class="title">Clasificación de Sitios Web</h2>

    <!-- Filtros -->
    <div class="filters">
      <button 
        v-for="cat in categoriesFilter" 
        :key="cat"
        :class="{ active: selectedFilter === cat }"
        @click="selectedFilter = cat"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Tabla de sitios -->
    <table>
      <thead>
        <tr>
          <th>Dominio</th>
          <th>Categoría</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="site in filteredSites" :key="site.id">
          <td>{{ site.name }}</td>
          <td>
            <select v-model="site.category" @change="updateCategory(site)">
              <option value="Sin Categoría">Sin Categoría</option>
              <option value="Productivo">Productivo</option>
              <option value="Neutral">Neutral</option>
              <option value="Doble Filo">Doble Filo</option>
              <option value="Distractor">Distractor</option>
            </select>
          </td>
          <td>
            <span :class="site.category.toLowerCase().replace(' ', '-')">{{ site.category }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "SiteList",
  data() {
    return {
      sites: [],
      categoriesFilter: ["Todos", "Sin Categoría", "Productivo", "Neutral", "Doble Filo", "Distractor"],
      selectedFilter: "Todos"
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
    }
  },
  mounted() {
    this.fetchSites();
  }
};
</script>

<style scoped>
.site-list {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.title {
  font-size: 22px;
  margin-bottom: 15px;
  color: #333;
}

/* Filtros */
.filters {
  margin-bottom: 15px;
}

.filters button {
  margin-right: 8px;
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #f5f5f5;
  cursor: pointer;
  transition: 0.2s;
}

.filters button.active,
.filters button:hover {
  background: #1976d2;
  color: #fff;
  border-color: #1976d2;
}

/* Tabla */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th, td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

th {
  background-color: #f5f5f5;
}

/* Badge de categoría */
td span {
  padding: 3px 6px;
  border-radius: 6px;
  color: #fff;
  font-weight: bold;
}

td span.productivo { background: #4caf50; }
td span.neutral { background: #9e9e9e; }
td span.doble-filo { background: #ff9800; }
td span.distractor { background: #f44336; }
td span.sin-categoría { background: #607d8b; }

select {
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}
</style>
