<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>d</span>
        <span class="font-weight-light">Charts</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
        <span class="mr-2">v0.0.1</span>
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
