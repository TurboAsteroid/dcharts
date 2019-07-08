<template>
  <v-container grid-list-md text-xs-center>
    <v-btn @click="goBack" color="success">Назад</v-btn>
    <v-divider class="my-5"></v-divider>
    <v-layout row wrap>
      <v-flex v-for="(chart, index) in datacollections" v-bind:key="index">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <router-link :to="{ name: 'certainparameter', params: { reportName: chart.link }}" class="link">
              <v-avatar :color="chart.co" v-on="on">
                <v-icon color="white">{{chart.st}}</v-icon>
              </v-avatar>
            </router-link>
          </template>
          <span>{{chart.name}}</span>
        </v-tooltip>
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
      items: ['Круговая диаграмма', 'График', 'Диаграмма', 'Статус'],
      chartType: [
        'Статус',
        'Статус',
        'Статус',
        'Круговая диаграмма',
        'Диаграмма',
        'График',
        'Диаграмма',
        'График',
        'Диаграмма',
        'Статус',
        'Статус',
        'Статус',
        'Статус'
      ],
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
    if (!this.$store.getters.library.length) {
      this.$router.replace('/')
      return
    }
    this.fillData()
  },
  methods: {
    fillData () {
      this.datacollections = []
      for (let i in this.$store.getters.library) {
        this.datacollections[i] = {
          name: this.$store.getters.library[i].name,
          link: this.$store.getters.library[i].link,
          top: {
            label: 'Верхний порог',
            backgroundColor: 'rgba(0, 255, 0, 1)',
            borderColor: 'rgba(0, 255, 0, 1)',
            borderWidth: 2,
            data: Array(this.$store.getters.library[i].data.length).fill(this.$store.getters.library[i].val2),
            fill: false,
            type: 'line'
          },
          bot: {
            label: 'Нижний порог',
            backgroundColor: 'rgba(255, 0, 0, 1)',
            borderColor: 'rgba(255, 0, 0, 1)',
            borderWidth: 2,
            data: Array(this.$store.getters.library[i].data.length).fill(this.$store.getters.library[i].val1),
            fill: false,
            type: 'line'
          },
          datasets: [
            {
              label: this.$store.getters.library[i].name,
              backgroundColor: this.backgroundColors,
              data: this.$store.getters.library[i].data
            }
          ],
          labels: this.$store.getters.library[i].data
        }
        let average = 0
        for (let j in this.$store.getters.library[i].data) {
          average += this.$store.getters.library[i].data[j]
        }
        average /= this.$store.getters.library[i].data.length
        if (average >= this.$store.getters.library[i].val2) {
          this.datacollections[i].st = 'check_circle'
          this.datacollections[i].co = 'green'
        } else if (average < this.$store.getters.library[i].val1) {
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
