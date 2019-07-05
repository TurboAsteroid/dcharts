<template>
  <v-container>
    <v-btn @click="addArr" color="info">Добавить набор данных</v-btn>
    <v-btn @click="toStore" color="success">Далее</v-btn>
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
export default {
  data: () => ({
    library:
      [
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
  }),
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
        data: [0],
        name: 'набор данных',
        val1: 0,
        val2: 0
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
      this.$store.commit('library', this.library)
      this.$router.push('secondPage')
    }
  }
}
</script>

<style>

</style>
