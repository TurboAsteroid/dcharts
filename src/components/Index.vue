<template>
  <v-container>
      <v-layout wrap>
          <v-flex xs3>
              <v-btn @click="addArr" color="info" block>Добавить набор данных</v-btn>
          </v-flex>
          <v-flex xs6></v-flex>
          <v-flex xs3>
              <v-btn @click="toStore" color="success" block>Сохранить бибилиотеку</v-btn>
          </v-flex>
      </v-layout>
    <v-layout wrap>
      <v-flex
        :key="j+'obj'"
        v-for="(obj, j) in library"
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
                <v-flex xs12>
                  <v-text-field
                    v-model="obj.link"
                    label="link"
                  ></v-text-field>
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
  </v-container>
</template>

<script>
import createData from '../modules/dataQueryDb'
export default {
  data: () => ({

  }),
  computed: {
    library () { 
      return this.$store.state.oldLibrary 
    }
  },
  methods: {
    addField (j) {
      this.library[j].data.push(0)
    },
    removeRow (j, i) {
      this.library[j].data.splice(i, 1)
    },
    removeCol (j) {
      this.library.splice(j, 1)
    },
    addArr () {
      this.library.push({
        id: -1,
        data: [0],
        name: 'набор данных',
        val1: 0,
        val2: 0,
        link: 'null',
        children: []
      })
    },
    toStore () {
      for (let j = 0; j < this.library.length; j++) {
        for (let i = 0; i < this.library[j].data.length; i++) {
          this.library[j].data[i] = parseInt(this.library[j].data[i])
        }
        this.library[j].val1 = parseInt(this.library[j].val1)
        this.library[j].val2 = parseInt(this.library[j].val2)
      }
      
      let result = createData(this.library, this.$store.getters.library);
      console.log('result',result)

      this.$store.commit('library', this.library)
      //this.$store.dispatch('setLibrary', this.library)
      // this.$router.push('secondPage')
    },

  }
}
</script>
