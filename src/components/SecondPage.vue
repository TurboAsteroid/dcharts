<template>
  <div>
    <div class="small">
      <v-select :items="items" v-model="chartType" label="Standard"></v-select>

      <div v-if="chartType=='Line'">
        <line-chart :chart-data="datacollection"></line-chart>
      </div>
      <div v-if="chartType=='Bar'">
        <Bar-chart :chart-data="datacollection"></Bar-chart>
      </div>
      <div v-if="chartType=='Pie'">
        <pie-chart :chart-data="datacollection"></pie-chart>
      </div>
    </div>
  </div>

</template>

<script>
  import LineChart from './LineChart.js'
  import BarChart from './BarChart.js'
  import PieChart from './PieChart.js'

  export default {
    components: {
      LineChart,
      BarChart,
      PieChart,
    },
    data () {
      return {
        datacollection: null,
        items: ['Line', 'Bar', 'Pie'],
        chartType: "",
        backgroundColors: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ]
      }
    },
    mounted () {
      this.fillData()
    },
    methods: {
      fillData () {

        this.datacollection = {
          labels: this.$store.getters.indexUserData,
          datasets: [
            {
              label: this.$store.getters.indexUserDataName,
              backgroundColor: this.backgroundColors,
              data: this.$store.getters.indexUserData
            }
          ]
        }
      },
      getRandomInt () {
        return Math.floor(Math.random() * (50 - 5 + 1)) + 5
      }
    }
  }
</script>

<style>

</style>
