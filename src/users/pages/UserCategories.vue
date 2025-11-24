<template>
  <v-container>
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

    const loadCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8080/categories');
        categories.value = response.data;
      } catch (error) {
        console.error('Error cargando categorías:', error);
      }
    };

    const handleCategoryUpdate = (updatedCategory) => {
      const index = categories.value.findIndex(c => c.id === updatedCategory.id);
      if (index !== -1) {
        categories.value[index] = updatedCategory;
      }
    };

    const handleSave = (updatedCategories) => {
      console.log('Categorías guardadas:', updatedCategories);
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