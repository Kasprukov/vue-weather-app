<template>
    <div class="weather-chart">
      <h3>{{ showFiveDayForecast ? $t('fiveDayForecast') : $t('dailyForecast') }}</h3>
      <canvas ref="chartRef"></canvas>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue'
  import Chart from 'chart.js/auto'
  
  const props = defineProps({
    hourlyData: {
      type: Array,
      required: true
    },
    dailyData: {
      type: Array,
      required: true
    },
    showFiveDayForecast: {
      type: Boolean,
      default: false
    }
  })
  
  const chartRef = ref(null)
  let chart = null
  
  const createChart = () => {
    if (chartRef.value) {
      const ctx = chartRef.value.getContext('2d')
      
      if (chart) {
        chart.destroy()
      }
  
      const data = props.showFiveDayForecast ? props.dailyData : props.hourlyData
  
      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.map(item => {
            const date = new Date(item.dt * 1000)
            return props.showFiveDayForecast
              ? date.toLocaleDateString([], { weekday: 'short' })
              : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }),
          datasets: [{
            label: 'Temperature (°C)',
            data: data.map(item => item.temp),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: false
            }
          }
        }
      })
    }
  }
  
  onMounted(() => {
    createChart()
  })
  
  watch([() => props.hourlyData, () => props.dailyData, () => props.showFiveDayForecast], () => {
    createChart()
  }, { deep: true })
  </script>
  
  <style scoped>
  .weather-chart {
    margin-top: 20px;
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  h3 {
    margin-bottom: 15px;
    color: #333;
  }
  </style>
  