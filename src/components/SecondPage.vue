<template>
  <v-container grid-list-md text-xs-center>
    <v-layout  row wrap>

      <v-flex xs4  v-for="(chart, index) in datacollections" v-bind:key="index">
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">{{chart.label}}</h3>
              <v-select :items="items" v-model="chartType[index]" label="Standard"></v-select>

              <div v-if="chartType[index]=='Line'">
                <line-chart :chart-data="chart"></line-chart>
              </div>
              <div v-if="chartType[index]=='Bar'">
                <Bar-chart :chart-data="chart"></Bar-chart>
              </div>
              <div v-if="chartType[index]=='Pie'">
                <pie-chart :chart-data="chart"></pie-chart>
              </div>
            </div>
          </v-card-title>
        </v-card>
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
    PieChart
  },
  data () {
    return {
      datacollections: null,
      items: ['Pie', 'Line', 'Bar'],
      chartType: [],
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
    if (!this.$store.getters.indexUserDataName.length || !this.$store.getters.indexUserData.length) {
      this.$router.replace('/')
    }
    this.fillData()
  },
  methods: {
    fillData () {
      this.datacollections = []
      for (let i in this.$store.getters.indexUserDataName) {
        this.datacollections.push({
          labels: this.$store.getters.indexUserData[i],
          datasets: [
            {
              label: this.$store.getters.indexUserDataName[i],
              backgroundColor: this.backgroundColors,
              data: this.$store.getters.indexUserData[i]
            }
          ]
        })
      }

      console.log(this.datacollections)
    }
  }
}
</script>
