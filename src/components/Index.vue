<template>
  <v-container>
    <i class="material-icons">10k</i> первая страница
    <v-btn @click="$router.push('secondPage')">secondPage ></v-btn>

    <v-container>
      <v-layout>
        <v-flex
          xl1
        >
          <v-text-field
            v-model="name"
            lable="Имя набора данных"
          ></v-text-field>
          <span
            v-for="(item, i) in userData"
            :key="i">
          <v-text-field
            v-model="userData[i]"
          ></v-text-field>
            </span>
          <v-btn @click="addField">Добавить</v-btn><v-btn @click="toStore">Далее</v-btn>
          {{userData}}
        </v-flex>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      userData: [11, 22, 0],
      name: 'набор данных'
    }),
    methods: {
      addField () {
        this.userData.push(0)
      },
      toStore () {
        this.$store.commit('indexUserData', this.userData)
        this.$store.commit('indexUserDataName', this.name)
      }
    },
  }
</script>

<style>

</style>
