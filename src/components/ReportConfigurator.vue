<template>
    <!-- <div> -->
        <v-container>
          <v-btn @click="goBackToLibrary" color="primary">Назад</v-btn>
          <v-btn @click="$store.commit('changeDialogTree', {bool: true})" color="warning">Выбрать дерево</v-btn>
          <v-btn @click="toReport" color="success">Сохранить дерево</v-btn>
          <dialogTree/>
          <v-container>
            <v-card>
              <v-layout row>
                <v-flex xs6 md4>
                  <v-card-title>
                    <v-text-field
                      v-model="$store.state.currentTree.title"
                      label="Имя дерева"
                    ></v-text-field>
                  </v-card-title>
                </v-flex>
              </v-layout>
              
              <v-container>
              <tree :data="report" node-text="name" layoutType="euclidean" :zoomable="true" style="height: 800px;" @clicked="onClick" @retract="onClick"/>
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
import dialogTree from './DialogTree'
export default {
  name: 'reportConfigurator',
  components: {
    tree,
    dialogTree
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
    if(this.$store.state.currentTree.id) {
      this.$store.dispatch('getTree', this.$store.state.currentTree.id)
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
    },
    cancel () {
      this.dialog = false
    }
  },
  computed: {
    report () {
      if(Object.keys(this.$store.state.oldReport).length !== 0) {
        return this.$store.state.oldReport
      }
    }
  }
}
</script>
