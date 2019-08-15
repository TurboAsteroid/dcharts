<template>
    <!-- <div> -->
        <v-container>
          <v-container grid-list-md>
            <v-layout wrap align-center justify-center>
              <!-- <v-flex xs2> -->
                <v-btn @click="checkTree" color="info">Выбрать отчет</v-btn>
              <!-- </v-flex> -->
              <!-- <v-flex xs2> -->
                <v-btn @click="addTree()" color="warning">Создать отчет</v-btn>                
              <!-- </v-flex> -->
              <!-- <v-flex xs2> -->
                <v-btn @click="toReport" color="success">Сохранить отчет</v-btn>                
              <!-- </v-flex> -->
            </v-layout>
            <v-divider></v-divider>
          </v-container>
          <dialogTree/>
          <v-container>
            <v-card>
              <!-- <v-layout row>
                <v-flex xs6 md4>
                  <v-card-title>
                    <v-text-field
                      v-model="$store.state.currentTree.title"
                      label="Имя дерева"
                    ></v-text-field>
                  </v-card-title>
                </v-flex>
              </v-layout> -->
              
              <v-container>
                <tree :data="report" node-text="name" layoutType="euclidean" :zoomable="true" style="height: 800px;" @clicked="onClick" @retract="onClick"/>
                <!-- <tree :data="report" node-text="name" layoutType="euclidean" :zoomable="true" style="height: 800px;" @clicked="onClick" @retract="onClick"/> -->
              </v-container>
            </v-card>
          </v-container>     
        
        <!-- модальное окно выбора библиотеки -->
        <v-layout row justify-center>
            <v-dialog v-model="dialog" persistent max-width="700">
                <v-card>
                    <v-card-title>
                      <v-layout row align-center>
                          <v-flex xs10 v-if="node && node.data.id === 0">
                            <v-text-field
                              value = "Выбор библиотек"
                              label="Набор данных"
                              readonly
                              class="headline"
                            ></v-text-field>
                            <!-- <span class="headline">Выбор библиотек</span> -->
                          </v-flex>
                          <v-flex xs10 v-else-if="node && node.data.id !== 0">
                            <v-text-field
                              :value = node.data.name
                              label="Набор данных"
                              readonly
                              class="headline"
                            ></v-text-field>
                          </v-flex>
                        <v-flex xs3>
                          <v-btn flat outline dark small color="info" @click="selectAll">
                              Выбрать все
                          </v-btn>
                        </v-flex>
                        <v-flex xs4>
                          <v-btn flat outline  dark small color="success" @click="ok">
                            Изменить отчет
                          </v-btn>
                        </v-flex>
                        <v-flex xs1>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn flat outline fab dark small v-on="on" color="grey" @click="cancel">
                                    <v-icon dark>close</v-icon>
                                </v-btn>
                            </template>
                            <span>Отмена</span>
                          </v-tooltip>
                        </v-flex>
                      </v-layout>
                  </v-card-title>

                  <v-divider/>
                  <!-- Начало: Добавление наборов в дерево -->
                  <span v-if="node && node.data.id !== 0">
                    <v-tabs
                        v-model="tab"
                        grow
                        >
                        <v-tabs-slider color="info"></v-tabs-slider>
                        <v-tab
                            v-for="item in items"
                            :key="item"
                        >
                          {{ item }}
                        </v-tab>
                    </v-tabs>
                    <v-tabs-items v-model="tab">
                      <v-tab-item
                          v-for="item in items"
                          :key="item"
                      >
                        <v-card flat>
                          <v-divider></v-divider>
                          <v-card-text>
                            <!-- Начало: Выбор наборов -->
                            <span v-if="item === items[0]">
                              <v-list two-line>
                                <span v-if="node && node.data.dataSets">
                                  <v-layout row 
                                    v-for="(item, index) in node.data.dataSets"
                                    :key="index"
                                    align-center
                                    >
                                      <v-flex xs12 >
                                        <v-list-tile
                                            @click="''"
                                        >
                                          <v-list-tile-action>
                                            <v-checkbox
                                                v-model="selected"
                                                :label="item.name"
                                                :value="currentId(item)"
                                                color="info"
                                            ></v-checkbox>
                                          </v-list-tile-action>
                                        </v-list-tile>
                                        <v-divider v-if="index != node.data.dataSets.length - 1"></v-divider>
                                      </v-flex>
                                  </v-layout>
                                </span>
                              </v-list>
                            </span>
                            <!-- Конец: Выбор наборов -->


                            <!-- Начало: Выбор показателей -->
                            <span v-if="item === items[1] && node && node.data.id !== 0">
                              <v-list two-line>
                                <span>
                                  <v-layout row 
                                    v-for="(item, index) in indicators"
                                    :key="index"
                                    align-center
                                  >
                                    <v-flex xs12 >
                                      <v-list-tile
                                          @click="''"
                                      >
                                        <v-list-tile-action>
                                          <v-checkbox
                                              v-model="selectedIndicators"
                                              :label="item.name"
                                              :value="item.id"
                                              color="info"
                                          ></v-checkbox>
                                        </v-list-tile-action>
                                      </v-list-tile>
                                      <v-divider v-if="index != indicators.length - 1"></v-divider>
                                    </v-flex>
                                  </v-layout>
                                </span>
                              </v-list>
                            </span>
                            <!-- Конец: Выбор показателей -->
                          </v-card-text>
                        </v-card>
                      </v-tab-item>
                    </v-tabs-items>
                  </span>
                  <!-- Конец: Добавление наборов в дерево -->


                  <!-- Начало: Добавление библиотек в дерево-->
                  <span v-else>
                    <v-card-text>
                      <v-list two-line>
                        <v-layout row 
                          v-for="(item, index) in librarys"
                          :key="index"
                          align-center
                        >
                          <v-flex xs12 >
                            <v-list-tile
                                @click="''"
                            >
                              <v-list-tile-action>
                                <v-checkbox
                                    v-model="selected"
                                    :label="item.name"
                                    :value="item.id"
                                    color="info"
                                ></v-checkbox>
                              </v-list-tile-action>
                            </v-list-tile>
                            <v-divider v-if="index != librarys.length - 1"></v-divider>
                          </v-flex>
                        </v-layout>
                      </v-list>
                    </v-card-text>
                  </span>
                  <!-- Конец: Добавление библиотек в дерево -->
                  
                </v-card>
            </v-dialog>
        </v-layout>
      </v-container>
    <!-- </div> -->
</template>

<script>
import { tree } from 'vued3tree'
import dialogTree from './dialog/DialogTree'
export default {
  name: 'reportConfigurator',
  components: {
    tree,
    dialogTree
  },
  data: () => ({
    selected: [],
    selectedIndicators: [],

    dialog: false,
    tab: null,
    items:['Список наборов', 'Список показателей'],
    indicators: [
        {
            id: 1,
            name: 'test1',
        },
        {
            id: 2,
            name: 'test2',
        },
        {
            id: 3,
            name: 'test3',
        },
    ],

    node: null,
    currentChild: null,
    child: [],
    result:[]
  }),
  mounted () {
    // if(this.$store.state.oldLibrarys) {
    // this.$store.state.oldLibrarys = []

    // }
    // this.$store.dispatch('getActiveLibrarys');
    // if (!this.$store.getters.library.length) {
    //   this.$router.replace('/')
    // }
    // if(this.$store.state.currentTree.id) {
    //   this.$store.dispatch('getTree', this.$store.state.currentTree.id)
    // }
    // this.$router.replace('/reportConfigurator')
  },
  methods: {
    addTree() { 
      let newTree = {
          // id: parseInt(this.libraryTree[this.libraryTree.length - 1].id) + 1,
          id: '',
          title: '',
          date: '31.07.2019'
      }
      this.$store.commit('changeDialogTree',{bool: false, value: newTree})
        
    },
    checkTree() {
      this.$store.commit('changeDialogTree', {bool: true})
      this.$store.dispatch('getTreesLibrary');
    },
    selectAll() {
      console.log(this.node.data)

      this.selected = []
      if(this.node.data.id === 0) {
        this.librarys.forEach(x => this.selected.push(x.id))
      } else {
          for (let i = 0; i < this.node.data.dataSets.length; i++) {
            let id = !this.node.data.dataSets[i].datasetID ? this.node.data.dataSets[i].id : JSON.stringify(this.node.data.dataSets[i].datasetID)
            this.selected.push(id)
          }
      }
      
    },
    currentId(item) {
      let id = !item.datasetID ? item.id : JSON.stringify(item.datasetID)
      return id
    },
    goBackToLibrary() {
      this.$router.push('/');
    },
    toReport() {
      this.$store.dispatch('setTree', { tree: this.report })
    },
    onClick (evt) {
      // console.log(evt)
      this.selected = []
      this.dialog = true
      this.node = evt
      // this.node.data.children.length ? this.tab = 0 : this.tab = 1 
      if((this.node.data.dataSets || !this.node.data.source) && this.node.data.hasOwnProperty('source')) {
        console.log('dsf')
        this.$store.dispatch('getLibrarys', {currentLib: this.node.data, boolTree: true})
      } else if(this.node.data.id !== 0 && !this.node.data.dataSets && this.node.data.link) {
        
        for(let o of this.librarys) {
          if (o.source) {
            for(let i of o.dataSets) {
              this.findChild(i);
            }
          }
        }
        this.node.data.dataSets = this.result
      }
        
      for (let i = 0; i < this.node.data.children.length; i++) {
        let id = !this.node.data.children[i].datasetID ? this.node.data.children[i].id : JSON.stringify(this.node.data.children[i].datasetID)
        this.selected.push(id)
      }
      
    },
    findChild(parent) {
      if(parent.link === this.node.data.link) {
        this.result = parent.children
        return 0;
      } else if (parent.children && parent.children.length) {
        for(let o of parent.children) {
          this.findChild(o);
        }
      }
    },
    ok () {
      this.dialog = false
      for (let i = 0; i < this.node.data.children.length; i++) {
        if (!this.selected.find(function (element) {
          return element === this.node.data.children[i].id
        }, this)) {
          this.node.data.children.splice(i, 1)
          i--
        }
      }
      
      for (let i = 0; i < this.selected.length; i++) {
        let tmpEl
          tmpEl = this.node.data.children.find(function (element) {
          return element.id === this.selected[i]
        }, this)
        if (!tmpEl) {
          if(this.node.data.id === 0) {
            let tmpLib = Object.assign({}, this.librarys.find(x => x.id === this.selected[i]))
            if(!this.node.data.children.some(x => x.id === tmpLib.id)) {
              tmpLib.children = []
              this.node.data.children.push(tmpLib)
            }
          } else {
            let tmpNodeDataSets = Object.assign([], this.node.data.dataSets)
            let tmpNode = Object.assign({}, tmpNodeDataSets.find(x => {
              if(x.id === this.selected[i] || JSON.stringify(x.datasetID) === this.selected[i]) {
                return x
              }
            }))
            tmpNode.children = []
            this.node.data.children.push(tmpNode)
          }
        }
      }
      this.selected = []
    },
    cancel () {
      this.dialog = false
      this.selected = []

    },
    
  },
  computed: {
    // report () {
    //   if (Object.keys(this.$store.state.oldReport).length !== 0) {
    //     return this.$store.state.oldReport
    //   }
    // },
    report () {
      return this.$store.state.report
    },
    librarys() {
      return this.$store.getters.oldLibrarys
    },
  }
}
</script>
