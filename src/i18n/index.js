import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    weatherApp: 'Weather App',
    searchCity: 'Search city',
    addBlock: 'Add Weather Block',
    removeBlock: 'Remove Block',
    confirmRemoveBlock: 'Are you sure you want to remove this weather block?',
    addToFavorites: 'Add to Favorites',
    removeFromFavorites: 'Remove from Favorites',
    favorites: 'Favorites',
    remove: 'Remove',
    favoriteLimit: 'Favorite Limit Reached',
    favoriteRemoveMessage: 'To add a new favorite, please remove {city} first.',
    confirm: 'Confirm',
    cancel: 'Cancel',
    humidity: 'Humidity',
    windSpeed: 'Wind Speed',
    errorFetchingWeather: 'Error fetching weather data. Please try again.',
    loadingWeather: 'Loading weather data...',
    hourlyForecast: 'Hourly Forecast',
    dailyForecast: 'Daily Forecast',
    fiveDayForecast: '5-Day Forecast',
    showDaily: 'Show Daily',
    showFiveDay: 'Show 5-Day'
  },
  uk: {
    weatherApp: 'Додаток погоди',
    searchCity: 'Пошук міста',
    addBlock: 'Додати блок погоди',
    removeBlock: 'Видалити блок',
    confirmRemoveBlock: 'Ви впевнені, що хочете видалити цей блок погоди?',
    addToFavorites: 'Додати до обраного',
    removeFromFavorites: 'Видалити з обраного',
    favorites: 'Обране',
    remove: 'Видалити',
    favoriteLimit: 'Досягнуто ліміту обраних',
    favoriteRemoveMessage: 'Щоб додати нове обране місто, спочатку видаліть {city}.',
    confirm: 'Підтвердити',
    cancel: 'Скасувати',
    humidity: 'Вологість',
    windSpeed: 'Швидкість вітру',
    errorFetchingWeather: 'Помилка отримання даних про погоду. Будь ласка, спробуйте ще раз.',
    loadingWeather: 'Завантаження даних про погоду...',
    hourlyForecast: 'Погодинний прогноз',
    dailyForecast: 'Щоденний прогноз',
    fiveDayForecast: 'Прогноз на 5 днів',
    showDaily: 'Показати щоденний',
    showFiveDay: 'Показати на 5 днів'
  }
}

export const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('lang') || 'en',
  fallbackLocale: 'en',
  messages
})