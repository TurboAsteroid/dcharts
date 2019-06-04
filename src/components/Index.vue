<template>
  <v-container>
    первая страница  <v-btn @click="$router.push('secondPage')">secondPage ></v-btn>
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
