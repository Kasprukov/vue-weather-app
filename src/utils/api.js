import axios from 'axios'

const API_KEY = '803b8d6931ea182a75638dee0fe7b08a'
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

export const getWeatherByCity = async (city) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: city.name,
        appid: API_KEY,
        units: 'metric',
        lang: localStorage.getItem('lang') || 'en'
      }
    })
    return processWeatherData(response.data)
  } catch (error) {
    console.error('Error fetching weather data:', error)
    throw error
  }
}

export const getWeatherByCoords = async (lat, lon) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric',
        lang: localStorage.getItem('lang') || 'en'
      }
    })
    return processWeatherData(response.data)
  } catch (error) {
    console.error('Error fetching weather data:', error)
    throw error
  }
}

export const searchCitiesByName = async (query) => {
  try {
    const response = await axios.get(`https://api.openweathermap.org/geo/1.0/direct`, {
      params: {
        q: query,
        limit: 5,
        appid: API_KEY
      }
    })
    return response.data
  } catch (error) {
    console.error('Error searching cities:', error)
    return []
  }
}

const processWeatherData = (data) => {
  return {
    city: data.city,
    current: {
      ...data.list[0],
      temp: data.list[0].main.temp,
      humidity: data.list[0].main.humidity,
      wind_speed: data.list[0].wind.speed,
      weather: data.list[0].weather
    },
    hourly: data.list.slice(0, 24).map(item => ({
      dt: item.dt,
      temp: item.main.temp,
      weather: item.weather[0]
    })),
    daily: data.list.filter((item, index) => index % 8 === 0).slice(0, 5).map(item => ({
      dt: item.dt,
      temp: item.main.temp,
      weather: item.weather[0]
    }))
  }
}