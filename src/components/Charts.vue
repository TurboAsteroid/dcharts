<template>
    <v-container grid-list-lg my-0 py-0>
        <v-layout>
            <v-flex xs12 md4>
                <v-card>
                    <v-card-title> 
                        <v-text-field
                            readonly
                            :value="currentDashbord.name"
                            class="headline"
                        >
                        </v-text-field>
                        
                        <v-menu :close-on-content-click="false" bottom offset-y>
                            <template v-slot:activator="{ on }">
                                <v-btn outline fab small color="orange" v-on="on">
                                    <v-icon dark >settings</v-icon>
                                </v-btn>
                            </template>
                            <v-list>
                                <v-list-tile v-for="(item, i) in charts" :key="i" @click="''">
                                    <v-list-tile-action>
                                        <v-checkbox
                                            type="checkbox"
                                            color="info"
                                            v-model="item.active"
                                        ></v-checkbox>
                                    </v-list-tile-action>
                                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                                </v-list-tile>
                            </v-list>
                        </v-menu>
                    </v-card-title>
                    
                </v-card>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex xs12 lg6 xl4 v-if="charts[0].active && dataCollections">
                <v-card>
                    <v-card-text>
                        <line-chart :chart-data="dataCollections"></line-chart>
                    </v-card-text>
                </v-card>
            </v-flex>

            <v-flex xs12 lg6 xl4 v-if="charts[1].active && dataCollections">
                <v-card>
                    <v-card-text>
                        <Bar-chart :chart-data="dataCollections"></Bar-chart>
                    </v-card-text>
                </v-card>
            </v-flex>

            <v-flex xs12 lg6 xl4 v-if="charts[2].active && dataCollections">
                <v-card>
                    <v-card-text>
                        <pie-chart :chart-data="dataCollections"></pie-chart>
                    </v-card-text>
                </v-card>  
            </v-flex>

            <v-flex xs12 lg6 xl4 v-if="charts[3].active && dataCollections">
                <v-card>
                    <v-card-title class="headline">
                        Показатели
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-list subheader v-if="currentDashbord.indicators && currentDashbord.indicators.length">
                            <v-layout
                                row
                                v-for="(indicator, idx) in currentDashbord.indicators"
                                :key="idx"
                                align-center
                                @click="getCharts(indicator)"
                            >
                                <v-flex xs12 py-0>
                                    <v-list-tile
                                        avatar
                                        @click="''"
                                    >
                                        <v-list-tile-avatar>
                                            <v-icon dark :class="[indicator.status.iconClass]">{{ indicator.status.icon }}</v-icon>
                                        </v-list-tile-avatar>

                                        <v-list-tile-content>
                                            <v-list-tile-title>{{ indicator.name }}</v-list-tile-title>
                                        </v-list-tile-content>
                                    </v-list-tile>
                                        <v-divider v-if="idx != currentDashbord.indicators.length - 1"></v-divider>
                                </v-flex>

                            </v-layout>
                            
                        </v-list>
                        <v-layout align-center v-else>
                            <v-flex xs1>
                                <v-icon large>warning</v-icon>
                            </v-flex>
                            <v-flex xs11>
                                <span class="headline">
                                    Показатели не назначены
                            </span>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>   
            </v-flex>
            <v-flex xs12 lg6 xl4 v-if="!dataCollections">
                <v-card>
                    <v-card-text>
                        <v-layout align-center>
                            <v-flex xs1>
                                <v-icon large>warning</v-icon>
                            </v-flex>
                            <v-flex xs11>
                                <span class="headline">
                                Отсутствуют данные
                            </span>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>   
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import LineChart from './chart/LineChart'
import BarChart from './chart/BarChart.js'
import PieChart from './chart/PieChart.js'

export default {
        components: {
        LineChart,
        BarChart,
        PieChart
    },
    mounted() {
        // console.log(this.currentDashbord)
    },
    data () {
      return {
          charts: [
          {
            title: 'Линейная диаграмма',
            active: true
          },
          {
            title: 'Столбчатая диаграмма',
            active: true
          },
          {
            title: 'Круговая диаграмма',
            active: true
          },
          {
              title: 'Показатели',
              active: true
          }
        ],
        //   datacollections: {},
        //   collections: {},
        //   backgroundColors: [
        //     'rgba(255, 99, 132, 0.2)',
        //     'rgba(54, 162, 235, 0.2)',
        //     'rgba(255, 206, 86, 0.2)',
        //     'rgba(75, 192, 192, 0.2)',
        //     'rgba(153, 102, 255, 0.2)',
        //     'rgba(255, 159, 64, 0.2)'
        //   ],
        datacollections: {},
        backgroundColors: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
      }
    },
    computed: {
        currentDashbord() {
            return this.$route.query.obj
        },
        dataCollections() {
            return this.$route.query.dataCollections
        },
        report: function () {
        }

    },
    methods: {
        getCharts(indicator) {
            // this.$store.state.currentDashbord = i;
            if(indicator.data.length && indicator.labels.length) {
                this.datacollections = {}
                this.fillData(Object.assign({},indicator))
                this.$router.push({ 
                    path: `${this.$route.path}/${indicator.id}`, 
                    query: { 
                        obj: indicator ,
                        dataCollections: Object.assign({},this.datacollections)
                    } 
                })
            }
        },
        fillData (currentReport) {
            this.datacollections = {
                name: currentReport.name,
                data: currentReport.data,
                children: []
            }
            let collections = {}
            if (currentReport.data && currentReport.data.length) {
                collections = {
                    name: currentReport.name,
                    data: currentReport.data,
                    children: [],
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
                }
                this.datacollections = JSON.parse(JSON.stringify(collections))
            }
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

}
</script>

<style>
.name {
    cursor: pointer;
}
    /* .resize {
        width: 730px;
        height: 400px;
    } */
</style>
