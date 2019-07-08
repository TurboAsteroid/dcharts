<template>
    <div>
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
                                v-for="item in library"
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
    </div>
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
    onClick (evt) {
      this.dialog = true
      this.node = evt
      this.selected = []
      if (evt.data.children.length > 0) {
        for (let i = 0; i < evt.data.children.length; i++) {
          this.selected.push(evt.data.children[i])
        }
      }
    },
    ok () {
      this.dialog = false
      for (let i = 0; i < this.selected.length; i++) {
        this.node.data.children.push(this.selected[i])
      }
    },
    cancel () {
      this.dialog = false
    }
  },
  computed: {
    library () {
      return this.$store.getters.library
    },
    report () {
      return { name: 'Корневой элемент', children: this.$store.getters.report }
    }
  }
}
</script>

<style>

</style>
