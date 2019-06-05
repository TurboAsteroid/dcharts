<template>
  <v-container>
    <v-container>
      <v-layout>
        <v-flex
          xl2
        >
          <v-text-field
            v-model="name"
            label="Имя набора данных"
          ></v-text-field>
          <span
            v-for="(item, i) in userData"
            :key="i">
          <v-text-field
            v-model="userData[i]"
            mask="#############"
            label="Значение"
          ></v-text-field>
            </span>
          <v-btn @click="addField">Добавить значение</v-btn>
          <v-btn @click="toStore">Далее</v-btn>
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
      for (let i = 0; i < this.userData.length; i++) {
        this.userData[i] = parseInt(this.userData[i])
      }
      this.$store.commit('indexUserData', this.userData)
      this.$store.commit('indexUserDataName', this.name)
      this.$router.push('secondPage')
    }
  }
}
</script>

<style>

</style>
