<template>
  <v-container grid-list-md text-xs-left>
    <v-btn @click="goBack" color="success">Назад</v-btn>

    <v-card>
      <v-card-text>
        <h2 class="text-xs-center">{{datacollections[0].name}}</h2>
        <v-layout row wrap>
          <v-flex xs4>
            <line-chart :chart-data="datacollections[0]"></line-chart>
          </v-flex>
          <v-flex xs4>
            <Bar-chart :chart-data="datacollections[0]"></Bar-chart>
          </v-flex>
          <v-flex xs4>
            <pie-chart :chart-data="datacollections[0]"></pie-chart>
          </v-flex>
        </v-layout row wrap>
        <v-divider class="my-5"></v-divider>
        <v-layout row wrap>
          <v-flex v-for="(chart, index) in datacollections" v-bind:key="index">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <router-link :to="{ name: 'certainparameter', params: { page: chart.link }}" class="link">
                  <v-avatar :color="chart.co" v-on="on">
                    <v-icon color="white">{{chart.st}}</v-icon>
                  </v-avatar>
                </router-link>
                <!-- <v-btn @click="goInside(chart, $event)" fab small :color="chart.co" v-on="on">
                   <v-icon color="white">{{chart.st}}</v-icon>
                 </v-btn> -->
              </template>
              <span>{{chart.name}}</span>
            </v-tooltip>
            <!-- <v-card>

              <v-card-title primary-title>
                <h3 class="headline mb-0">{{chart.name}}</h3>
              </v-card-title>
              <v-container>
                <v-select :items="items" v-model="chartType[index]" label="Тип отображения"></v-select>



                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-avatar :color="chart.co" v-on="on">
                      <v-icon color="white">{{chart.st}}</v-icon>
                    </v-avatar>
                  </template>
                  <span>{{chart.name}}</span>
                </v-tooltip>
              </v-container>
            </v-card>-->
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
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
    data() {
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
    mounted() {
      if (!this.$store.getters.indexUserData.length) {
        this.$router.replace('/')
      }
      this.fillData()
    },
    methods: {
      fillData() {
        this.datacollections = []
        for (let i in this.$store.getters.indexUserData) {
          this.datacollections[i] = {
            name: this.$store.getters.indexUserData[i].name,
            link: this.$store.getters.indexUserData[i].link,
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
      goBack() {
        this.$router.back()
      },
      goInside(chart, e) {
        this.$router.push(this.$route.fullPath + '/' + chart.link)
      }
    }
  }
</script>

<style>
  .link {
    text-decoration: none;
  }
</style>
