<template>
    <div>
        <div class="side-by-side">
            <v-card class="side">
                <v-container>
                    <VueNestable
                            v-model="userData"
                            cross-list
                            group="cross"
                    >
                        <VueNestableHandle
                                slot-scope="{ item }"
                                :item="item"
                        >
                            {{ item.name }}
                        </VueNestableHandle>
                    </VueNestable>
                </v-container>
            </v-card>
            <br/>
            <v-card class="side">
                <v-container>
                    <VueNestable
                            v-model="addedToPage"
                            cross-list
                            group="cross"
                            @change="objLibClk"
                    >
                        <VueNestableHandle
                                slot-scope="{ item }"
                                :item="item"
                        >
                            {{ item.name }}
                        </VueNestableHandle>
                    </VueNestable>
                </v-container>
            </v-card>
        </div>
        <br/>
        <br/>
        {{selectedObjA}}
        <br/><br/><br/><br/>
        {{selectedObjB}}
    </div>
<!--  <v-container>-->
<!--    <v-btn @click="addArr" color="info">Добавить набор данных</v-btn>-->
<!--    <v-btn @click="toStore" color="success">Далее</v-btn>-->
<!--      <v-layout wrap>-->
<!--          <v-flex xs4>-->
<!--              {{userData[selectedObjId]}}-->
<!--          </v-flex>-->
<!--          <v-flex xs4>-->
<!--              <v-container>-->
<!--              <v-card>-->
<!--              <v-container>-->
<!--<libDraggable :tasks="userData" />-->
<!--              </v-container>-->
<!--              </v-card>-->
<!--              </v-container>-->
<!--          </v-flex>-->
<!--          <v-flex xs4>-->
<!--              <v-container>-->
<!--              <v-card>-->
<!--                  <v-container>-->
<!--                      <nested-draggable :tasks="list0"/>-->
<!--&lt;!&ndash;                      <div  v-if="list2.length === 0">Пусто</div>&ndash;&gt;-->
<!--&lt;!&ndash;                      <draggable&ndash;&gt;-->
<!--&lt;!&ndash;                              class="dragArea list-group"&ndash;&gt;-->
<!--&lt;!&ndash;                              :list="list2"&ndash;&gt;-->
<!--&lt;!&ndash;                              group="people"&ndash;&gt;-->
<!--&lt;!&ndash;                              @change="log"&ndash;&gt;-->
<!--&lt;!&ndash;                      >&ndash;&gt;-->
<!--&lt;!&ndash;                          <v-card style="margin: 16px"&ndash;&gt;-->
<!--&lt;!&ndash;                                  class="list-group-item"&ndash;&gt;-->
<!--&lt;!&ndash;                                  v-for="obj in list2"&ndash;&gt;-->
<!--&lt;!&ndash;                                  :key="obj.name"&ndash;&gt;-->
<!--&lt;!&ndash;                          >&ndash;&gt;-->
<!--&lt;!&ndash;                              <v-container>&ndash;&gt;-->
<!--&lt;!&ndash;                                  {{ obj.name }}&ndash;&gt;-->
<!--&lt;!&ndash;                              </v-container>&ndash;&gt;-->
<!--&lt;!&ndash;                          </v-card>&ndash;&gt;-->
<!--&lt;!&ndash;                      </draggable>&ndash;&gt;-->
<!--                  </v-container>-->
<!--              </v-card>-->
<!--              </v-container>-->
<!--          </v-flex>-->
<!--      </v-layout>-->
<!--    <v-layout wrap>-->
<!--      <v-flex-->
<!--        :key="j+'obj'"-->
<!--        v-for="(obj, j) in userData"-->
<!--        xl2-->
<!--      >-->
<!--        <v-container>-->
<!--          <v-card>-->
<!--            <v-container>-->
<!--              <v-layout row>-->
<!--                <v-flex xs9>-->
<!--                  <v-text-field-->
<!--                    v-model="obj.name"-->
<!--                    label="Имя набора данных"-->
<!--                  ></v-text-field>-->
<!--                </v-flex>-->
<!--                <v-flex xs3>-->
<!--                  <v-btn fab dark small color="red" @click="removeCol(j)">-->
<!--                    <v-icon dark>close</v-icon>-->
<!--                  </v-btn>-->
<!--                </v-flex>-->
<!--              </v-layout>-->
<!--              <v-layout row>-->
<!--                <v-flex xs6>-->
<!--                  <v-text-field-->
<!--                    v-model="obj.val1"-->
<!--                    label="Первый порог"-->
<!--                  ></v-text-field>-->
<!--                </v-flex>-->
<!--                <v-flex xs6>-->
<!--                <v-text-field-->
<!--                  v-model="obj.val2"-->
<!--                  label="Второй порог"-->
<!--                ></v-text-field>-->
<!--              </v-flex>-->
<!--              </v-layout>-->
<!--              <v-layout row-->
<!--                        v-for="(item, i) in obj.data"-->
<!--                        :key="i+'item'">-->
<!--                <v-flex xs9>-->
<!--                  <v-text-field-->
<!--                    v-model="obj.data[i]"-->
<!--                    mask="#############"-->
<!--                    label="Значение"-->
<!--                  ></v-text-field>-->
<!--                </v-flex>-->
<!--                <v-flex xs3>-->
<!--                  <v-btn fab outline dark small color="orange" @click="removeRow(j,i)">-->
<!--                    <v-icon dark>close</v-icon>-->
<!--                  </v-btn>-->
<!--                </v-flex>-->
<!--              </v-layout>-->
<!--              <v-btn @click="addField(j)" color="info">Добавить значение</v-btn>-->
<!--            </v-container>-->
<!--          </v-card>-->
<!--        </v-container>-->
<!--      </v-flex>-->
<!--    </v-layout>-->
<!--  </v-container>-->
</template>

<script>
// import nestedDraggable from './nested-draggable'
// import libDraggable from './lib-draggable'
import { VueNestable, VueNestableHandle } from 'vue-nestable'

export default {
  components: {
    // nestedDraggable,
    // libDraggable,
    VueNestable,
    VueNestableHandle
  },
  data: () => ({
    addedToPage: [],
    nestableItems1: [
      {
        id: 0,
        text: 'Andy'
      }, {
        id: 1,
        text: 'Harry',
        children: [{
          id: 2,
          text: 'David'
        }]
      }, {
        id: 3,
        text: 'Lisa'
      }
    ],
    nestableItems2: [
      {
        id: 4,
        text: 'Mike'
      }, {
        id: 5,
        text: 'Edgar'
      }
    ],
    list0: [
    ],
    userData: [
      {
        id: 1,
        data: [95, 97, 99, 100],
        name: 'СИЗ: Промышленная безопасность',
        val1: 98,
        val2: 100,
        tasks: []
      },
      {
        id: 2,
        data: [95, 99, 100, 98],
        name: 'ЛПП: Промышленная безопасность',
        val1: 98,
        val2: 100,
        tasks: []
      },
      {
        id: 3,
        data: [99, 93, 100, 98],
        name: 'Численность: Кадровая комплектация',
        val1: 95,
        val2: 100,
        tasks: []
      },
      {
        id: 4,
        data: [5, 2, 17, 10, 2, 7],
        name: 'Текучесть: Кадровая комплектация',
        val1: 3,
        val2: 12,
        tasks: []
      },
      {
        id: 5,
        data: [99, 100, 101, 98, 100, 99],
        name: 'Трудовая дисциплина: Кадровая комплектация',
        val1: 100,
        val2: 99,
        tasks: []
      },
      {
        id: 6,
        data: [3054, 2602, 4125],
        name: 'Количество обученных сотрудников',
        val1: 2500,
        val2: 2600,
        tasks: []
      },
      {
        id: 7,
        data: [100, 99, 98, 102, 105, 95],
        name: 'Фонд оплаты труда',
        val1: 100,
        val2: 99,
        tasks: []
      },
      {
        id: 8,
        data: [43528, 44564, 42888, 45821, 41433],
        name: 'Средняя заработная плата',
        val1: 42000,
        val2: 45000,
        tasks: []
      },
      {
        id: 9,
        data: [97, 99, 105, 99, 99, 103],
        name: 'Ежедневный учет: Производство',
        val1: 98,
        val2: 100,
        tasks: []
      },
      {
        id: 10,
        data: [96, 106, 101, 100, 100, 102],
        name: 'Ежемесячный учет: Производство',
        val1: 98,
        val2: 100,
        tasks: []
      },
      {
        id: 11,
        data: [100, 100, 105, 101, 102, 103],
        name: 'Накопительный учет: Производство',
        val1: 98,
        val2: 100,
        tasks: []
      },
      {
        id: 12,
        data: [100, 99, 98, 102, 100, 99],
        name: 'Накопительный итог: Данные СБ',
        val1: 100,
        val2: 102,
        tasks: []
      },
      {
        id: 13,
        data: [150, 135],
        name: 'Социальная напряженность',
        val1: 80,
        val2: 140,
        tasks: []
      }],
    selectedObjA: -1,
    selectedObjB: -1,
    list2: [
    ]
  }),
  methods: {
    objLibClk (a, b) {
      this.selectedObjA = a
      this.selectedObjB = b
      console.log(a)
      console.log(b)
    },
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
