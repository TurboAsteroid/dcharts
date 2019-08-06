<template>
    <v-container grid-list-lg my-0 py-0>
        <v-layout wrap justify-center>
            <v-flex xs6>
                <v-card color="gray" class="resize">
                    <!-- <line-chart :chart-data="datacollections"></line-chart> -->
                </v-card>
            </v-flex>

            <v-flex xs6>
                <v-card color="gray" class="resize">
                </v-card>
            </v-flex>

            <v-flex xs6>
                <v-card color="gray" class="resize">
                </v-card>
            </v-flex>

            <v-flex xs6>
                <v-card color="gray" class="resize">
                    <v-card-title class="headline">
                        Показатели
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-list subheader>
                            <v-list-tile
                                v-for="item in items"
                                :key="item.title"
                                avatar
                                @click="''"
                            >
                                <v-list-tile-avatar>
                                    <v-icon dark :class="[item.iconClass]">{{ item.icon }}</v-icon>
                                </v-list-tile-avatar>

                                <v-list-tile-content>
                                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
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
    },
    data () {
      return {
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
        }
    }
}
</script>

<style>
    .resize {
        width: 730px;
        height: 400px;
    }
</style>
