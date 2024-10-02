<template>
  <div class="city-search">
    <input 
      type="text" 
      v-model="query" 
      @input="searchCities" 
      :placeholder="$t('searchCity')"
    >
    <ul v-if="suggestions.length > 0" class="suggestions">
      <li v-for="city in suggestions" :key="city.id" @click="selectCity(city)">
        {{ city.name }}, {{ city.country }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { searchCitiesByName } from '../utils/api'

const query = ref('')
const suggestions = ref([])

const emit = defineEmits(['city-selected'])

const searchCities = async () => {
  if (query.value.length > 2) {
    suggestions.value = await searchCitiesByName(query.value)
  } else {
    suggestions.value = []
  }
}

const selectCity = (city) => {
  query.value = `${city.name}, ${city.country}`
  suggestions.value = []
  emit('city-selected', city)
}
</script>

<style scoped>
.city-search {
  position: relative;
}

input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
}

.suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #ddd;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1;
}

.suggestions li {
  padding: 10px;
  cursor: pointer;
}

.suggestions li:hover {
  background-color: #f0f0f0;
}
</style>