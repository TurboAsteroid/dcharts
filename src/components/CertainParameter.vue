<template>
  <v-container>
    <v-btn @click="goBack" color="success">Назад</v-btn>
    <v-container grid-list-md text-xs-center>
      <v-card>
        <v-card-text>
          <v-container>
            <h2 class="text-xs-center">{{report.name}}</h2>
            <v-layout row wrap v-if="report.data.length">
              <v-flex xs4>
                <line-chart :chart-data="collections"></line-chart>
              </v-flex>
              <v-flex xs4>
                <Bar-chart :chart-data="collections"></Bar-chart>
              </v-flex>
              <v-flex xs4>
                <pie-chart :chart-data="collections"></pie-chart>
              </v-flex>
            </v-layout>
          </v-container>
          <v-divider class="my-2"></v-divider>
          <v-layout row wrap>
            <v-flex v-for="(chart, index) in datacollections.children" v-bind:key="index">
                <v-layout row justify-center align-center>
                  <v-flex xs10>
                    <span class="title">{{chart.name}}</span>
                  </v-flex>
                </v-layout>
                <v-layout row justify-center align-center>
                  <v-flex xs2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <router-link :to="{ path: $route.path + '/' + chart.id }" class="link">
                          <v-avatar :color="chart.co" v-on="on">
                            <v-icon color="white">{{chart.st}}</v-icon>
                          </v-avatar>
                        </router-link>
                      </template>
                      <span>{{chart.name}}</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-container>
  </v-container>
</template>

<script>
import LineChart from './chart/LineChart.js'
import BarChart from './chart/BarChart.js'
import PieChart from './chart/PieChart.js'

export default {
  components: {
    LineChart,
    BarChart,
    PieChart
  },
  data () {
    return {
      datacollections: {},
      collections: {},
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
    if (!this.$store.getters.report.name) {
      this.$router.replace('/')
    }
    // console.log('dsf')
    let routerArr = this.$route.path.split('/').slice(2)
    let report = this.getTreeElement(this.$store.getters.report, routerArr.slice())
    this.fillData(
      this.$store.getters.library.find(element => element.id === routerArr[routerArr.length - 1], this) || {},
      report
    )
  },
  created () {
    this.$store.dispatch('getLibrary')
    if(Object.keys(this.$store.state.report).length !== 0) {
      this.$store.dispatch('getDataByParametr', this.$store.state.report)
    }
  },
  methods: {
    fillData (libraryItem, currentReport) {
      this.datacollections = {
        name: currentReport.name,
        data: currentReport.data,
        children: []
      }
      if (currentReport.data && currentReport.data.length) {
        this.datacollections = Object.assign({}, this.datacollections, {
          top: {
            label: 'Верхний порог',
            backgroundColor: 'rgba(0, 255, 0, 1)',
            borderColor: 'rgba(0, 255, 0, 1)',
            borderWidth: 2,
            data: Array(currentReport.data.length).fill(currentReport.val2.value),
            fill: false,
            type: 'line'
          },
          bot: {
            label: 'Нижний порог',
            backgroundColor: 'rgba(255, 0, 0, 1)',
            borderColor: 'rgba(255, 0, 0, 1)',
            borderWidth: 2,
            data: Array(currentReport.data.length).fill(currentReport.val1.value),
            fill: false,
            type: 'line'
          },
          datasets: [
            {
              label: currentReport.name,
              backgroundColor: this.backgroundColors,
              data: currentReport.data
            }
          ],
          labels: currentReport.labels || this.datacollections.data
        })
      }
      for (let i in currentReport.children) {
        let child = currentReport.children[i]
        this.datacollections.children[i] = {
          id: child.id,
          name: child.name,
          link: child.link
        }
        if (child.data[child.data.length - 1] >= child.val2.value) {
          this.datacollections.children[i].st = 'check_circle'
          this.datacollections.children[i].co = 'green'
        } else if (child.data[child.data.length - 1] < child.val1.value) {
          this.datacollections.children[i].st = 'error'
          this.datacollections.children[i].co = 'red'
        } else {
          this.datacollections.children[i].st = 'warning'
          this.datacollections.children[i].co = 'orange'
        }
      }
    },
    goBack () {
      this.$router.back()
    },
    getTreeElement (root, path) {
      if (path.length > 0 && root.children.length) {
        let tmpNode = path.shift()
        return this.getTreeElement(root.children.find(element => element.id === tmpNode, this), path)
      } else {
        return root
      }
    }
  },
  watch:{
    datacollections: function(val) {
      this.collections = val
    }
  },
  computed: {
    // collections:function () {
    //   // get:() => {
    //     return this.datacollections
    //   // }
    // },
    report: function () {
      if(Object.keys(this.$store.state.report).length !== 0) {
        let routerArr = this.$route.path.split('/').slice(2)
        let report = this.getTreeElement(this.$store.getters.report, routerArr.slice())
        this.fillData(
          this.$store.getters.library.find(element => element.id === routerArr[routerArr.length - 1], this) || {},
          report
        )
        return report
      }
    }
  }
}
</script>
<style>
  .link {
    text-decoration: none;
  }
</style>
