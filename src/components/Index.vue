<template>
  <v-container>
    <v-btn @click="addArr" color="info">Добавить набор данных</v-btn>
    <v-layout wrap>
      <v-flex
        :key="j+'obj'"
        v-for="(obj, j) in userData"
        xl2
      >
        <v-container>
          <v-card>
            <v-container>
              <v-layout row>
                <v-flex xs9>
                  <v-text-field
                    v-model="obj.name"
                    label="Имя набора данных"
                  ></v-text-field>
                </v-flex>
                <v-flex xs3>
                  <v-btn fab dark small color="red" @click="removeCol(j)">
                    <v-icon dark>close</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs6>
                  <v-text-field
                    v-model="obj.val1"
                    label="Первый порог"
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                <v-text-field
                  v-model="obj.val2"
                  label="Второй порог"
                ></v-text-field>
              </v-flex>
              </v-layout>
              <v-layout row
                        v-for="(item, i) in obj.data"
                        :key="i+'item'">
                <v-flex xs9>
                  <v-text-field
                    v-model="obj.data[i]"
                    mask="#############"
                    label="Значение"
                  ></v-text-field>
                </v-flex>
                <v-flex xs3>
                  <v-btn fab outline dark small color="orange" @click="removeRow(j,i)">
                    <v-icon dark>close</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
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
    userData: [{
      data: [131, 22, 0],
      name: '3набор данных',
      val1: 50,
      val2: 100
    },
    {
      data: [1344, 522, 30, 532],
      name: '3набор данных 2',
      val1: 100,
      val2: 600
    }]
  }),
  methods: {
    addField (j) {
      this.userData[j].data.push(0)
    },
    removeRow (j, i) {
      this.userData[j].data.splice(i, 1)
    },
    removeCol (j) {
      this.userData.splice(j, 1)
    },
    addArr () {
      this.userData.push({
        data: [0],
        name: 'набор данных',
        val1: 0,
        val2: 0
      })
    },
    toStore () {
      for (let j = 0; j < this.userData.length; j++) {
        for (let i = 0; i < this.userData[j].data.length; i++) {
          this.userData[j].data[i] = parseInt(this.userData[j].data[i])
        }
        this.userData[j].val1 = parseInt(this.userData[j].val1)
        this.userData[j].val2 = parseInt(this.userData[j].val2)
      }
      this.$store.commit('indexUserData', this.userData)
      this.$router.push('secondPage')
    }
  }
}
</script>

<style>

</style>
