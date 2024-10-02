<template>
  <div id="app">
    <header>
      <h1>{{ $t('weatherApp') }}</h1>
      <div class="language-switcher">
        <button @click="changeLanguage('en')">EN</button>
        <button @click="changeLanguage('uk')">UK</button>
      </div>
    </header>
    <main>
      <div class="weather-blocks">
        <div v-for="(block, index) in weatherBlocks" :key="index" class="weather-block">
          <CitySearch @city-selected="updateWeather(index, $event)" />
          <WeatherCard 
            :weather="block.weather" 
            :is-favorite="isFavorite(block.weather?.city?.name)"
            :error="block.error"
            @toggle-favorite="toggleFavorite(block.weather?.city?.name)"
            @remove-block="confirmRemoveBlock(index)"
            @toggle-forecast="toggleForecast(index)"
          />
          <WeatherChart 
            v-if="block.weather && block.weather.hourly && block.weather.daily" 
            :hourly-data="block.weather.hourly"
            :daily-data="block.weather.daily"
            :show-five-day-forecast="block.showFiveDayForecast"
          />
        </div>
      </div>
      <button @click="addWeatherBlock" :disabled="weatherBlocks.length >= 5">
        {{ $t('addBlock') }}
      </button>
    </main>
    <FavoritesList 
      :favorites="favorites" 
      @remove-favorite="removeFavorite"
    />
    <Modal v-if="showModal" @close="showModal = false">
      <h2>{{ modalTitle }}</h2>
      <p>{{ modalMessage }}</p>
      <button @click="confirmModal">{{ $t('confirm') }}</button>
      <button @click="showModal = false">{{ $t('cancel') }}</button>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import CitySearch from './components/CitySearch.vue'
import WeatherCard from './components/WeatherCard.vue'
import WeatherChart from './components/WeatherChart.vue'
import FavoritesList from './components/FavoritesList.vue'
import Modal from './components/Modal.vue'
import { getWeatherByCity, getWeatherByCoords } from './utils/api'
import { getUserLocation } from './utils/geolocation'

const { t, locale } = useI18n()

const weatherBlocks = ref([{ weather: null, error: false, showFiveDayForecast: false }])
const favorites = ref([])
const showModal = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')
const modalCallback = ref(null)

onMounted(async () => {
  const userLocation = await getUserLocation()
  if (userLocation) {
    try {
      const weather = await getWeatherByCoords(userLocation.lat, userLocation.lon)
      weatherBlocks.value[0].weather = weather
    } catch (error) {
      console.error('Error fetching weather data:', error)
      weatherBlocks.value[0].error = true
    }
  }
  loadFavorites()
})

const updateWeather = async (index, city) => {
  try {
    const weather = await getWeatherByCity(city)
    weatherBlocks.value[index].weather = weather
    weatherBlocks.value[index].error = false
  } catch (error) {
    console.error('Error updating weather data:', error)
    weatherBlocks.value[index].weather = null
    weatherBlocks.value[index].error = true
  }
}

const addWeatherBlock = () => {
  if (weatherBlocks.value.length < 5) {
    weatherBlocks.value.push({ weather: null, error: false, showFiveDayForecast: false })
  }
}

const confirmRemoveBlock = (index) => {
  modalTitle.value = t('removeBlock')
  modalMessage.value = t('confirmRemoveBlock')
  modalCallback.value = () => removeWeatherBlock(index)
  showModal.value = true
}

const removeWeatherBlock = (index) => {
  weatherBlocks.value.splice(index, 1)
}

const isFavorite = (cityName) => {
  return favorites.value.includes(cityName)
}

const toggleFavorite = (cityName) => {
  if (isFavorite(cityName)) {
    removeFavorite(cityName)
  } else {
    addFavorite(cityName)
  }
}

const addFavorite = (cityName) => {
  if (favorites.value.length >= 5) {
    modalTitle.value = t('favoriteLimit')
    modalMessage.value = t('favoriteRemoveMessage', { city: favorites.value[0] })
    showModal.value = true
  } else {
    favorites.value.push(cityName)
    saveFavorites()
  }
}

const removeFavorite = (cityName) => {
  favorites.value = favorites.value.filter(city => city !== cityName)
  saveFavorites()
}

const saveFavorites = () => {
  localStorage.setItem('favorites', JSON.stringify(favorites.value))
}

const loadFavorites = () => {
  const storedFavorites = localStorage.getItem('favorites')
  if (storedFavorites) {
    favorites.value = JSON.parse(storedFavorites)
  }
}

const confirmModal = () => {
  if (modalCallback.value) {
    modalCallback.value()
  }
  showModal.value = false
}

const changeLanguage = (lang) => {
  locale.value = lang
}

const toggleForecast = (index) => {
  weatherBlocks.value[index].showFiveDayForecast = !weatherBlocks.value[index].showFiveDayForecast
}

watch(favorites, saveFavorites)
</script>

<style scoped>
#app {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.language-switcher button {
  margin-left: 10px;
}

.weather-blocks {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.weather-block {
  flex: 1 1 300px;
  max-width: 100%;
}

button {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .weather-block {
    flex-basis: 100%;
  }
}
</style>