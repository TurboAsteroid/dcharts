<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>d</span>
        <span class="font-weight-light">Charts</span>:{{$router.currentRoute.meta.nameRu}}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat exact :to="{ name: 'index'}">
          Библиотека
        </v-btn>
        <v-btn flat exact :to="{ name: 'reportConfigurator'}">
          Создание отчёта
        </v-btn>
        <v-btn flat :to="{ name: 'secondPage'}">
          Отчёт
        </v-btn>
        <span class="mr-2">v0.0.1</span>
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
  }
}
</script>
