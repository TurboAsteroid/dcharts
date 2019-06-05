<template>
  <v-container>
    <v-layout>
      <v-flex
        xl2
      >
        <v-select :items="items" v-model="chartType" label="Standard"></v-select>

        <div>
          <line-chart :is="Line" :chart-data="datacollection"></line-chart>
        </div>
        <div v-if="chartType=='Bar'">
          <Bar-chart :chart-data="datacollection"></Bar-chart>
        </div>
        <div v-if="chartType=='Pie'">
          <pie-chart :chart-data="datacollection"></pie-chart>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
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
    data() {
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
    mounted() {
      this.fillData()
    },
    methods: {
      fillData() {
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
      }
    }
  }
</script>
