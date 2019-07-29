<template>
    <!-- <div> -->
        <v-container>
          <v-btn @click="goBackToLibrary" color="primary">Назад</v-btn>
          <v-btn @click="toReport" color="success">Сохранить дерево</v-btn>
          <v-container>
            <v-card>
                <v-container>
                <tree :data="report" node-text="name" layoutType="euclidean" style="height: 800px;" @clicked="onClick"/>
                </v-container>
            </v-card>
          </v-container>     
        
        <!-- модальное окно выбора из библиотеки -->
        <v-layout row justify-center>
            <v-dialog v-model="dialog" persistent max-width="580">
                <v-card>
                    <v-card-title class="headline">Выберите какой элемент добавить</v-card-title>
                    <v-card-text>
                        <v-container fluid>
                            <v-checkbox
                                v-model="selected"
                                v-for="item in $store.getters.library"
                                :key="item.id"
                                :label="item.name"
                                :value="item"
                            ></v-checkbox>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" flat @click="ok">OK</v-btn>
                        <v-btn color="green darken-1" flat @click="cancel">Cancel</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-layout>
        </v-container>
    <!-- </div> -->
</template>

<script>
import { tree } from 'vued3tree'
export default {
  name: 'reportConfigurator',
  components: {
    tree
  },
  data: () => ({
    selected: [],
    dialog: false,
    node: null
  }),
  mounted () {
    if (!this.$store.getters.library.length) {
      this.$router.replace('/')
    }
  },
  methods: {
    goBackToLibrary() {
      this.$router.push('/');
    },
    toReport() {
      this.$store.dispatch('setTree', {tree: this.report})
    },
    onClick (evt) {
      this.dialog = true
      this.node = evt
      this.selected = []
      for (let i = 0; i < evt.data.children.length; i++) {
        let tmpNode = Object.assign({}, evt.data.children[i])
      
        delete tmpNode.children
        this.selected.push(tmpNode)
      }
      // console.log(this.selected)
    },
    ok () {
      this.dialog = false
      for (let i = 0; i < this.node.data.children.length; i++) {
        if (!this.selected.find(function (element) {
          return element.id === this.node.data.children[i].id
        }, this)) {
          this.node.data.children.splice(i, 1)
          i--
        }
      }
      for (let i = 0; i < this.selected.length; i++) {
        let tmpEl = this.node.data.children.find(function (element) {
          return element.id === this.selected[i].id
        }, this)
        if (!tmpEl) {
          let tmpNode = Object.assign({}, this.selected[i])
          tmpNode.children = []
          this.node.data.children.push(tmpNode)
        }
      }
      console.log('newReport: ', this.report)
      console.log('oldReport: ', this.$store.state.report)

      // this.$store.commit('report', this.report)
      
    },
    cancel () {
      this.dialog = false
    }
  },
  computed: {
    report () {
      return this.$store.state.oldReport
    }
  }
}
</script>
