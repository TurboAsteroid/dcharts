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
            <v-flex xs12 lg6 xl4 v-if="charts[0].active">
                <v-card>
                    <v-card-text>
                        <line-chart :chart-data="dataCollections"></line-chart>
                    </v-card-text>
                </v-card>
            </v-flex>

            <v-flex xs12 lg6 xl4 v-if="charts[1].active">
                <v-card>
                    <v-card-text>
                        <Bar-chart :chart-data="dataCollections"></Bar-chart>
                    </v-card-text>
                </v-card>
            </v-flex>

            <v-flex xs12 lg6 xl4 v-if="charts[2].active">
                <v-card>
                    <v-card-text>
                        <pie-chart :chart-data="dataCollections"></pie-chart>
                    </v-card-text>
                </v-card>  
            </v-flex>

            <v-flex xs12 lg6 xl4>
                <v-card>
                    <v-card-title class="headline">
                        Показатели
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-list subheader>
                            <v-list-tile
                                v-for="indicator in currentDashbord.indicators"
                                :key="indicator.id"
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
                        </v-list>
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
        items: [
          { icon: 'check_circle', iconClass: 'green', title: 'Показатель 1'},
          { icon: 'error', iconClass: 'red', title: 'Показатель 2'},
          { icon: 'warning', iconClass: 'orange', title: 'Показатель 3'},
          { icon: 'check_circle', iconClass: 'green', title: 'Показатель 4'},
          { icon: 'check_circle', iconClass: 'green', title: 'Золото в слитках'},
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
        fillData (libraryItem, currentReport) {
           
            // for (let i in currentReport.children) {
            //         let child = currentReport.children[i]
            //         this.datacollections.children[i] = {
            //         id: child.id,
            //         name: child.name,
            //         link: child.link
            //     }
            //     if (child.data[child.data.length - 1] >= child.val2.value) {
            //     this.datacollections.children[i].st = 'check_circle'
            //     this.datacollections.children[i].co = 'green'
            //     } else if (child.data[child.data.length - 1] < child.val1.value) {
            //     this.datacollections.children[i].st = 'error'
            //     this.datacollections.children[i].co = 'red'
            //     } else {
            //     this.datacollections.children[i].st = 'warning'
            //     this.datacollections.children[i].co = 'orange'
            //     }
            // }
        },
        // goBack () {
        // this.$router.back()
        // },
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
