<template>
  <v-container>
    <!-- Lista de categorías sin filtros -->
    <CategoryList
      :categories="categories"
      @update="handleCategoryUpdate"
      @save="handleSave"
    />
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import CategoryList from '../components/CategoryList.vue';

export default {
  components: { CategoryList },
  setup() {
    const categories = ref([]);

    // Carga las categorías desde el servidor
    const loadCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3001/categories');
        categories.value = response.data;
      } catch (error) {
        console.error('Error cargando categorías:', error);
      }
    };

    // Maneja la actualización de una categoría
    const handleCategoryUpdate = (updatedCategory) => {
      // Actualiza la categoría en el array local
      const index = categories.value.findIndex(c => c.id === updatedCategory.id);
      if (index !== -1) {
        categories.value[index] = updatedCategory;
      }
    };

    // Maneja el guardado de todas las categorías
    const handleSave = (updatedCategories) => {
      console.log('Categorías guardadas:', updatedCategories);
      // Aquí puedes agregar lógica adicional al guardar
    };

    onMounted(loadCategories);

    return {
      categories,
      handleCategoryUpdate,
      handleSave
    };
  }
};
</script>