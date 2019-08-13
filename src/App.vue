<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>d</span>
        <span class="font-weight-light">Charts</span>:{{$router.currentRoute.meta.nameRu}}
          <span style="font-size: 10px">v0.0.1</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <!-- <v-btn flat exact :to="{ name: 'index'}">
          Библиотека
        </v-btn> -->
        
        <!-- <v-btn flat :to="{ path: '/secondPage'}" :disabled="active">
          Отчёт
        </v-btn> -->
        <v-btn flat exact :to="{ path: '/'}">
          Библиотеки
        </v-btn>
        <v-btn flat exact :to="{ name: 'reportConfigurator'}" :disabled="active">
          Создание отчёта
        </v-btn>
        <v-btn flat :to="{ path: '/report'}" :disabled="active">
          Отчёт
        </v-btn>
      </v-toolbar-items>

    </v-toolbar>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      //
    }
  },
  computed: {
    active () {
      // if (!this.$store.getters.library.length) {
      //   return true
      // }
      return false
    }
  },
  mounted () {
    this.$store.dispatch('getActiveLibrarys');
    // this.$store.dispatch('getLibrary')
    // this.$store.dispatch('getTree')
    // this.$store.dispatch('getLibraryLink')
    // this.$store.dispatch('getLibraryTree')
    
  }
}
</script>
