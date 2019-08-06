<template>
    <v-app>
        <v-navigation-drawer 
        width="330"
        app
        permanent>
          <v-toolbar>
          </v-toolbar>
          <v-list dense class="pt-0">
            <v-treeview 
            :items="items"
            open-all
            activatable
            >
              <template slot="label" slot-scope="{ item }">
                  <router-link
                      tag="div"
                      :to="{ path: $route.path + '/' + item.id, query: {
                        obj: item
                      }}" 
                      class="link">
                          {{ item.name }}
                  </router-link>
              </template>
              <template v-slot:prepend="{ item }" >
                <v-icon :color="item.status">
                  {{ status[item.status] }}
                </v-icon>
              </template>
            </v-treeview>
          </v-list>
        </v-navigation-drawer>
        <!-- <v-content> -->
          <v-container>
            <!-- <v-layout> -->
            <router-view name="charts"></router-view>

            <!-- </v-layout> -->

          </v-container>
        <!-- </v-content> -->
    </v-app>
</template>

<script>
export default {
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
        this.$router.replace('/report')
    },
    methods: {
        currentLink(item) {
            console.log(item)
            this.$store.state.currentDashbord = item
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
