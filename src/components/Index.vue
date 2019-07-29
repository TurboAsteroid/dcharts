<template>
  <v-container>
      <v-layout wrap>
          <v-flex xs3>
              <v-btn @click.stop="addArr()" color="info" block>Добавить набор данных</v-btn>
          </v-flex>
          <v-flex xs6></v-flex>
          <v-flex xs3>
              <v-btn @click="toStore" color="success" block>Сохранить бибилиотеку</v-btn>
          </v-flex>
      </v-layout>
    <dialogComponent/>
    <v-layout wrap>
      <v-flex
        :key="j+'obj'"
        v-for="(obj, j) in library"
        xl3 sm6
      >
        <v-container>
          <v-card>
            <v-container>
              <v-layout row>
                <v-flex xs8>
                  <v-text-field
                  v-model="obj.name"
                  label="Имя набора данных"
                ></v-text-field>
                </v-flex>
                <v-flex xs2>
                  <v-btn fab dark small color="orange" @click="$store.commit('changeDialog', {bool: true, value: obj})">
                    <v-icon dark>settings</v-icon>
                  </v-btn>
                </v-flex>
                <v-flex xs2>
                  <v-btn fab dark small color="red" @click="removeCol(j)">
                    <v-icon dark>close</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import findChangeLibrary from '../modules/changeLibrary'
import dialogComponent from './Dialog'
export default {
  components:{
    dialogComponent
  },
  data: () => ({
    dialog: false
  }),
  computed: {
    library () {
      return this.$store.state.oldLibrary
    }
  },
  methods: {
    changeDialog: e => this.$store.commit("changeDialog", e),
    removeCol (j) {
      this.library.splice(j, 1)
    },
    addArr () {
      this.library.push({
        id: parseInt(this.library[this.library.length - 1].id) + 1,
        data: [],
        labels:[],
        name: 'набор данных',
        val1: {
          value: 0,
          label: 'min'
        },
        val2: {
          value: 0,
          label: 'max'
        },
        link: '',
        children: []
      })
      this.$store.commit('changeDialog', {bool: true, value: this.library[this.library.length - 1]})
    },
    toStore () {
      for (let j = 0; j < this.library.length; j++) {
        for (let i = 0; i < this.library[j].data.length; i++) {
          this.library[j].data[i] = parseInt(this.library[j].data[i])
        }
        // this.library[j].id = parseInt(this.library[j].id)
        this.library[j].val1.value = parseInt(this.library[j].val1.value)
        this.library[j].val2.value = parseInt(this.library[j].val2.value)
      }
      let result = findChangeLibrary(this.library, this.$store.getters.library)

      // this.$store.commit('library', this.library)
      
      this.$store.dispatch('setLibrary', { library: this.library, changeLibrary: result })
      // this.$router.push('secondPage')
    }
  }
}
</script>
