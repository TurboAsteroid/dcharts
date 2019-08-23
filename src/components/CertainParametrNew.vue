<template>
    <v-app>
        <v-navigation-drawer 
          width="350"
          app
          permanent
        >
          <v-toolbar>
          </v-toolbar>
          <v-list dense class="pt-3">
            <tree 
              :tree-data="report"
            >
            </tree>
          </v-list>
        </v-navigation-drawer>
          <div style="margin: 0px 0px;">
            <router-view name="charts"></router-view>
          </div>
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
        }
    },
    mounted(){      
      this.$store.dispatch('getTreesLibrary')
      this.$store.dispatch('getTree', {getLastTree: true, addData: true})
      this.$router.replace('/report')
    },
    methods: {
      currentLink(item) {
        this.$store.state.currentDashbord = item
      }
    },
    computed: {
      report() { // отчет
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
