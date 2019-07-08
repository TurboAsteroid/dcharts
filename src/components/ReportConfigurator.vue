<template>
    <div>
        <v-container>
            <v-card>
                <v-container>
                <tree :data="root" node-text="name" layoutType="euclidean" style="height: 800px;" @clicked="onClick" @retract="onRetract"/>
                </v-container>
            </v-card>
        </v-container>
        <!-- модальное окно выбора из библиотеки -->
        <v-layout row justify-center>
            <v-dialog v-model="dialog" persistent max-width="400">
                <v-card>
                    <v-card-title class="headline">Выберите какой элемент добавить</v-card-title>
                    <v-card-text>
                        <v-radio-group v-model="selectedForAdd">
                            <v-radio
                                    v-for="item in library.children"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item"
                            ></v-radio>
                        </v-radio-group>
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
    selectedForAdd: {
      id: -1,
      data: [],
      name: 'что-то новенькое',
      val1: -1,
      val2: -1,
      children: []
    },
    root: {
      id: -1,
      data: [],
      name: 'Корневой элемент',
      val1: -1,
      val2: -1,
      children: []
    },
    dialog: false
  }),
  mounted () {
    if (!this.$store.getters.library.length) {
      this.$router.replace('/')
    }
  },
  methods: {
    onClick (evt) {
      this.dialog = true
      this.place = evt
    },
    addToTree (evt) {
      evt.data.children.push(this.selectedForAdd)
    },
    ok () {
      this.dialog = false
      this.addToTree(this.place)
    },
    cancel () {
      this.dialog = false
    },
    onExpand (evt) {
      this.onEvent('onExpand', evt)
    },
    onRetract (evt) {
      this.onEvent('onRetract', evt)
    },
    onEvent (eventName, data) {
      console.log(eventName)
      console.log(data)
      data.remove()
      // this.events.push({ eventName, data: data.data })
    },
    toStore () {
      for (let j = 0; j < this.library.length; j++) {
        for (let i = 0; i < this.library[j].data.length; i++) {
          this.library[j].data[i] = parseInt(this.library[j].data[i])
        }
        this.library[j].val1 = parseInt(this.library[j].val1)
        this.library[j].val2 = parseInt(this.library[j].val2)
      }
      this.$store.commit('indexlibrary', this.library)
      this.$router.push('secondPage')
    }
  },
  computed: {
    library () {
      return { name: '', children: this.$store.getters.library }
    }
  }
}
</script>

<style>

</style>
