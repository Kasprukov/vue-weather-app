<template>
    <div class="weather-card">
      <div v-if="weather && !error">
        <h2>{{ weather.city.name }}, {{ weather.city.country }}</h2>
        <div class="current-weather">
          <img :src="getWeatherIconUrl(weather.current.weather[0].icon)" :alt="weather.current.weather[0].description">
          <div class="temperature">{{ formatTemperature(weather.current.temp) }}</div>
          <div class="description">{{ weather.current.weather[0].description }}</div>
        </div>
        <div class="details">
          <div>{{ $t('humidity') }}: {{ weather.current.humidity }}%</div>
          <div>{{ $t('windSpeed') }}: {{ weather.current.wind_speed }} m/s</div>
        </div>
        <div class="actions">
          <button @click="$emit('toggle-favorite')">
            {{ isFavorite ? $t('removeFromFavorites') : $t('addToFavorites') }}
          </button>
          <button v-if="!isFavorite" @click="$emit('remove-block')">{{ $t('removeBlock') }}</button>
        </div>
        <div class="forecast-toggle">
          <button @click="toggleForecast">
            {{ showFiveDayForecast ? $t('showDaily') : $t('showFiveDay') }}
          </button>
        </div>
      </div>
      <div v-else-if="error" class="error-message">
        {{ $t('errorFetchingWeather') }}
      </div>
      <div v-else class="loading-message">
        {{ $t('loadingWeather') }}
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps, defineEmits } from 'vue'
  
  const props = defineProps({
    weather: Object,
    isFavorite: Boolean,
    error: Boolean
  })
  
  const emit = defineEmits(['toggle-favorite', 'remove-block', 'toggle-forecast'])
  
  const showFiveDayForecast = ref(false)
  
  const getWeatherIconUrl = (icon) => {
    return `http://openweathermap.org/img/wn/${icon}@2x.png`
  }
  
  const formatTemperature = (temp) => {
    if (temp === undefined || temp === null || isNaN(temp)) {
      return 'N/A'
    }
    return `${Math.round(temp)}°C`
  }
  
  const toggleForecast = () => {
    showFiveDayForecast.value = !showFiveDayForecast.value
    emit('toggle-forecast', showFiveDayForecast.value)
  }
  </script>
  
  <style scoped>
  .weather-card {
    background-color: #f0f0f0;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .current-weather {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-bottom: 20px;
  }
  
  .temperature {
    font-size: 48px;
    font-weight: bold;
    color: #333;
  }
  
  .description {
    text-transform: capitalize;
    color: #666;
  }
  
  .details {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
  }
  
  .actions, .forecast-toggle {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }
  
  button {
    padding: 10px 15px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  button:hover {
    background-color: #45a049;
  }
  
  .error-message, .loading-message {
    text-align: center;
    padding: 20px;
    font-size: 18px;
  }
  
  .error-message {
    color: #f44336;
  }
  
  .loading-message {
    color: #2196F3;
  }
  </style>