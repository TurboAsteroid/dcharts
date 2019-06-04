<template>
  <v-container>
    <i class="material-icons">10k</i> первая страница  <v-btn @click="$router.push('secondPage')">secondPage ></v-btn>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      a: 1
    })
  }
</script>

<style>

</style>
