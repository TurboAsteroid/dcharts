<template>
    <v-app>
        <v-navigation-drawer 
        width="330"
        app
        permanent>
          <v-toolbar>
          </v-toolbar>
          <v-list dense class="pt-3">
            <tree 
              :tree-data="report"
            >
            </tree>
          </v-list>
        </v-navigation-drawer>
          <v-container style="margin: 0px 0px;">
            <router-view name="charts"></router-view>
          </v-container>
    </v-app>
</template>

<script>
import Tree from "./tree/Tree";


export default {
    components: {
      Tree
    },
    data () {
        return {
          status:{
            green:'check_circle',
            error:'error',
            warning:'warning'
          },
          items: [
        {
          id: 1,
          name: 'Средняя зарплата',
          status: 'warning',
          children: [
            { 
              id: 2, 
              name: 'Компания',
              status: 'warning',
              children: [
                {
                  id: 3,
                  name: 'Пол',
                  status: 'green',
                  data: [43528, 44564],
                  labels: ["мужчины", "женщины"],
                  name: 'Средняя зарплата по полу',
                  val1: 42000,
                  val2: 45000,
                  link: 'sex',
                  children: [
                    {
                      id: 4,
                      name: 'Мужчины',
                      status: 'green',
                    },
                    {
                      id: 5,
                      name: 'Женщины',
                      status: 'green',
                    }
                  ]
                },
                {
                  id: 6,
                  name: 'Возраст',
                  status: 'error',
                  children: []
                }
              ]
            },
            // { id: , name: 'Chrome : app' },
            // { id: , name: 'Webstorm : app' }
          ],
          indicators: [
          ],
        },
        {
          id: 7,
          name: 'Продукция. Цветная металлургия',
          status: 'error',
          children: [
            {
              id: 8,
              name: 'Золото в слитках',
              status: 'error',
            },
            {
              id: 9,
              name: 'Серебро в слитках',
              status: 'error',
            },
            {
              id: 10,
              name: 'Катоды медные',
              status: 'green',
            }
          ]
        }
        
      ]
        }
    },
    mounted(){
    if(!this.$store.state.treesLibrary.length) {      
      this.$store.dispatch('getTreesLibrary');
      this.$store.dispatch('getTree', {getLastTree: true})
    }
        this.$router.replace('/report')
    },
    methods: {
      currentLink(item) {
        console.log(item)
        this.$store.state.currentDashbord = item
      }
    },
    computed: {
      report() {
        return this.$store.state.report.children
      }
    }
}
</script>

<style>
.link {
  text-decoration: none;
  cursor: pointer;
}
</style>
