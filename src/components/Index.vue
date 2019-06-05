<template>
  <v-container>
    <v-text-field
      v-model="name"
      label="Имя набора данных"
    ></v-text-field>
      <v-layout>
        <v-flex
          xl2
          v-for="(arr, j) in userData"
          :key="j+'arr'"
        >
          <v-container>
          <span
            v-for="(item, i) in userData[j]"
            :key="i+'item'">
          <v-text-field
            v-model="userData[j][i]"
            mask="#############"
            label="Значение"
          ></v-text-field>
            </span>
          <v-btn @click="addField(j)">Добавить значение</v-btn>
          </v-container>
        </v-flex>
      </v-layout>
      <v-btn @click="toStore">Далее</v-btn>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    userData: [[11, 22, 0], [144, 522, 30, 532]],
    name: 'набор данных'
  }),
  methods: {
    addField (j) {
      this.userData[j].push(0)
    },
    toStore () {
      for (let j = 0; j < this.userData.length; j++) {
        for (let i = 0; i < this.userData[j].length; i++) {
          this.userData[j][i] = parseInt(this.userData[j][i])
        }
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
