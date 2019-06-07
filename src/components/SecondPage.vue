<template>
  <v-container grid-list-md text-xs-center>
    <v-btn @click="goBack" color="success">Назад</v-btn>
    <v-layout row wrap>
      <v-flex xs4 v-for="(chart, index) in datacollections" v-bind:key="index">
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">{{chart.name}}</h3>
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
              <div v-if="chartType[index]=='Status'">
                <v-avatar :size="avatarSize" :color="chart.co">
                  <v-icon color="white">{{chart.st}}</v-icon>
                </v-avatar>
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
      items: ['Pie', 'Line', 'Bar', 'Status'],
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
    if (!this.$store.getters.indexUserData.length) {
      this.$router.replace('/')
    }
    this.fillData()
  },
  methods: {
    fillData () {
      this.datacollections = []
      for (let i in this.$store.getters.indexUserData) {
        this.datacollections[i] = {
          name: this.$store.getters.indexUserData[i].name,
          top: {
            label: 'Верхний порог',
            backgroundColor: 'rgba(0, 255, 0, 1)',
            borderColor: 'rgba(0, 255, 0, 1)',
            borderWidth: 2,
            data: Array(this.$store.getters.indexUserData[i].data.length).fill(this.$store.getters.indexUserData[i].val2),
            fill: false,
            type: 'line'
          },
          bot: {
            label: 'Нижний порог',
            backgroundColor: 'rgba(255, 0, 0, 1)',
            borderColor: 'rgba(255, 0, 0, 1)',
            borderWidth: 2,
            data: Array(this.$store.getters.indexUserData[i].data.length).fill(this.$store.getters.indexUserData[i].val1),
            fill: false,
            type: 'line'
          },
          datasets: [
            {
              label: this.$store.getters.indexUserData[i].name,
              backgroundColor: this.backgroundColors,
              data: this.$store.getters.indexUserData[i].data
            }
          ],
          labels: this.$store.getters.indexUserData[i].data
        }
        let average = 0
        for (let j in this.$store.getters.indexUserData[i].data) {
          average += this.$store.getters.indexUserData[i].data[j]
        }
        average /= this.$store.getters.indexUserData[i].data.length
        if (average >= this.$store.getters.indexUserData[i].val2) {
          this.datacollections[i].st = 'check_circle'
          this.datacollections[i].co = 'green'
        } else if (average < this.$store.getters.indexUserData[i].val1) {
          this.datacollections[i].st = 'error'
          this.datacollections[i].co = 'red'
        } else {
          this.datacollections[i].st = 'warning'
          this.datacollections[i].co = 'orange'
        }
      }
    },
    goBack () {
      this.$router.back()
    }
  }
}
</script>
