<template>
  <v-container>
    <v-btn @click="addArr" color="info">Добавить набор данных</v-btn>
      <v-layout wrap>
        <v-flex
          :key="j+'arr'"
          v-for="(arr, j) in userData"
          xl2
        >
          <v-container>
            <v-card>
              <v-container>
                <v-text-field
                  v-model="name[j]"
                  label="Имя набора данных"
                ></v-text-field>
                <span
                  v-for="(item, i) in userData[j]"
                  :key="i+'item'">
                  <v-text-field
                    v-model="userData[j][i]"
                    mask="#############"
                    label="Значение"
                  ></v-text-field>
                </span>
                <v-btn @click="addField(j)" color="info">Добавить значение</v-btn>
              </v-container>
            </v-card>
          </v-container>
        </v-flex>
      </v-layout>
      <v-btn @click="toStore" color="success">Далее</v-btn>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    userData: [[11, 22, 0], [144, 522, 30, 532]],
    name: ['набор данных', 'набор данных2']
  }),
  methods: {
    addField (j) {
      this.userData[j].push(0)
    },
    addArr () {
      this.userData.push([0])
      this.name.push('новый набор данных')
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
