<template>
    <div>
        <v-container>
            <v-card>
                <v-container>
                <tree :data="library" node-text="name" layoutType="euclidean" style="height: 800px;" @clicked="onClick"/>
                </v-container>
            </v-card>
        </v-container>
        <!-- модальное окно выбора из библиотеки -->
        <v-layout row justify-center>
            <v-dialog v-model="dialog" persistent max-width="400">
                <v-card>
                    <v-card-title class="headline">Выберите какой элемент добавить</v-card-title>
                    <v-card-text>один элемент в любом случае будет сейчас добавлен в дерево в ту ноду что вы кликнули, ниже библиотека всех элементов {{$store.getters.library}}</v-card-text>
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
    dialog: false,
    library:
      {
        name: '',
        children: [
          {
            id: 1,
            data: [95, 97, 99, 100],
            name: 'СИЗ: Промышленная безопасность',
            val1: 98,
            val2: 100,
            children: []
          },
          {
            id: 2,
            data: [95, 99, 100, 98],
            name: 'ЛПП: Промышленная безопасность',
            val1: 98,
            val2: 100,
            children: []
          },
          {
            id: 3,
            data: [99, 93, 100, 98],
            name: 'Численность: Кадровая комплектация',
            val1: 95,
            val2: 100,
            children: []
          },
          {
            id: 4,
            data: [5, 2, 17, 10, 2, 7],
            name: 'Текучесть: Кадровая комплектация',
            val1: 3,
            val2: 12,
            children: []
          },
          {
            id: 5,
            data: [99, 100, 101, 98, 100, 99],
            name: 'Трудовая дисциплина: Кадровая комплектация',
            val1: 100,
            val2: 99,
            children: []
          },
          {
            id: 6,
            data: [3054, 2602, 4125],
            name: 'Количество обученных сотрудников',
            val1: 2500,
            val2: 2600,
            children: []
          },
          {
            id: 7,
            data: [100, 99, 98, 102, 105, 95],
            name: 'Фонд оплаты труда',
            val1: 100,
            val2: 99,
            children: []
          },
          {
            id: 8,
            data: [43528, 44564, 42888, 45821, 41433],
            name: 'Средняя заработная плата',
            val1: 42000,
            val2: 45000,
            children: []

          },
          {
            id: 9,
            data: [97, 99, 105, 99, 99, 103],
            name: 'Ежедневный учет: Производство',
            val1: 98,
            val2: 100,
            children: []
          },
          {
            id: 10,
            data: [96, 106, 101, 100, 100, 102],
            name: 'Ежемесячный учет: Производство',
            val1: 98,
            val2: 100,
            children: []
          },
          {
            id: 11,
            data: [100, 100, 105, 101, 102, 103],
            name: 'Накопительный учет: Производство',
            val1: 98,
            val2: 100,
            children: []
          },
          {
            id: 12,
            data: [100, 99, 98, 102, 100, 99],
            name: 'Накопительный итог: Данные СБ',
            val1: 100,
            val2: 102,
            children: []
          },
          {
            id: 13,
            data: [150, 135],
            name: 'Социальная напряженность',
            val1: 80,
            val2: 140,
            children: []
          }
        ]
      }
  }),
  methods: {
    onClick (evt) {
      this.dialog = true
      this.addToTree(evt)
    },
    addToTree (evt) {
      evt.data.children.push({
        id: 13,
        data: [150, 135],
        name: 'что-то новенькое',
        val1: 80,
        val2: 140,
        children: []
      })
      console.log(this.tree)
    },
    ok () {
      this.dialog = false
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
      this.events.push({ eventName, data: data.data })
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
    library: () => {
      return { name: '', children: this.$store.getters.library }
    }
  }
}
</script>

<style>

</style>
