<template>
  <div class="favorites-list">
    <h2>{{ $t('favorites') }}</h2>
    <div v-if="favorites.length === 0" class="no-favorites">
      {{ $t('noFavorites') }}
    </div>
    <div v-else class="favorite-items">
      <div v-for="favorite in favorites" :key="favorite" class="favorite-item">
        <WeatherCard 
          :weather="favoriteWeather[favorite]" 
          :is-favorite="true"
          :error="favoriteErrors[favorite]"
          @toggle-favorite="removeFavorite(favorite)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { getWeatherByCity } from '../utils/api'
import WeatherCard from './WeatherCard.vue'

const props = defineProps({
  favorites: Array
})

const emit = defineEmits(['remove-favorite'])

const favoriteWeather = ref({})
const favoriteErrors = ref({})

const fetchFavoriteWeather = async (city) => {
  try {
    const weather = await getWeatherByCity({ name: city })
    favoriteWeather.value[city] = weather
    favoriteErrors.value[city] = false
  } catch (error) {
    console.error(`Error fetching weather for ${city}:`, error)
    favoriteErrors.value[city] = true
  }
}

const removeFavorite = (city) => {
  emit('remove-favorite', city)
}

onMounted(() => {
  props.favorites.forEach(fetchFavoriteWeather)
})

watch(() => props.favorites, (newFavorites, oldFavorites) => {
  newFavorites.forEach(city => {
    if (!oldFavorites.includes(city)) {
      fetchFavoriteWeather(city)
    }
  })
  Object.keys(favoriteWeather.value).forEach(city => {
    if (!newFavorites.includes(city)) {
      delete favoriteWeather.value[city]
      delete favoriteErrors.value[city]
    }
  })
}, { deep: true })
</script>

<style scoped>
.favorites-list {
  margin-top: 20px;
}

.no-favorites {
  text-align: center;
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
}

.favorite-items {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.favorite-item {
  flex: 1 1 300px;
  max-width: 100%;
}
</style>