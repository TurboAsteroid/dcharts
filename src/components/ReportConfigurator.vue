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
          <dialogAddLibrary/>
          <v-container>
            <v-card>
              <v-layout row>
                <v-flex xs6 md4>
                  <v-card-title>
                    <v-text-field
                      v-model="$store.state.currentTree.name"
                      label="Имя отчета"
                    ></v-text-field>
                  </v-card-title>
                </v-flex>
              </v-layout>
              
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
                              readonly
                              class="headline"
                            ></v-text-field>
                            <!-- <span class="headline">Выбор библиотек</span> -->
                          </v-flex>
                          <v-flex xs10 v-else-if="node && node.data.id !== 0 && !node.data.hasOwnProperty('source')">
                            <v-text-field
                              :value = node.data.name
                              label="Набор данных"
                              readonly
                              class="headline"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs10 v-else-if="node && node.data.id !== 0 && node.data.hasOwnProperty('source')">
                            <v-text-field
                              :value = node.data.name
                              label="Библиотека"
                              readonly
                              class="headline"
                            ></v-text-field>
                          </v-flex>
                        <v-flex xs3>
                          <!-- <v-btn flat outline dark small color="info" @click="''">
                              Выбрать все
                          </v-btn> -->
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
                            @click="getIndicators(item)"
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
                          <v-card-title style="padding: 0;">
                              <v-layout>
                                <v-flex xs1>
                                  <v-checkbox
                                    v-model="selectAll"
                                    color="orange" 
                                    style="padding: 10px; margin: 0; height: 0;"></v-checkbox>
                                </v-flex>
                              </v-layout>
                          </v-card-title>
                          <v-card-text >
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
                    <v-card-title style="padding: 0;">
                      <v-layout>
                        <v-flex xs1>
                          <v-checkbox
                            v-model="selectAll"
                            color="orange" 
                            style="padding: 10px; margin: 0; height: 0;"></v-checkbox>
                        </v-flex>
                      </v-layout>
                    </v-card-title>
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
import dialogAddLibrary from './dialog/DialogAddLibrary'

export default {
  name: 'reportConfigurator',
  components: {
    tree,
    dialogTree,
    dialogAddLibrary
  },
  data: () => ({
    selected: [],
    selectedIndicators: [],
    dialog: false,
    tab: null,
    items:['Список наборов', 'Список показателей'],
    indicators: [
    ],

    node: null,
    currentChild: null,
    child: [],
    result:[],
  }),
  mounted () {
    // console.log(this.$store.state.treesLibrary.length)
    // if(!this.$store.state.treesLibrary.length) {
      this.$store.state.report = {
          id: 0,
          data:[],
          name:'Библиотеки',
          children:[],
      };
      this.$store.dispatch('getTreesLibrary');
      this.$store.dispatch('getTree', {getLastTree: true, addData:false})
    // }
  
  },
  methods: {
    getIndicators(item) {
      if(item === this.items[1] && !this.node.data.source) {
          this.$store.dispatch('getIndicators', { currentDataSet: this.node.data }).then(res => {
            this.indicators = this.node.data.indicators
            this.selectedIndicators = []
            this.indicators.forEach(x => {
              x.active ? this.selectedIndicators.push(x.id) : {}
            })
          })
      }
    },
    addTree() { 
      let newTree = {
          id: '',
          name: '',
          date: '31.07.2019'
      }
      this.tab = null
      this.$store.commit('changeDialogTree',{bool: false, value: newTree})
        
    },
    checkTree() {
      this.$store.commit('changeDialogTree', {bool: true})
      this.$store.dispatch('getTreesLibrary');
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
      this.selected = []
      this.selectedIndicators = []
      this.indicators = []
      this.dialog = true
      this.node = evt
      // this.tab = 0;
      !this.node.data.source ? this.$store.dispatch('getIndicators', { currentDataSet: this.node.data }).then(res => {
        this.indicators = this.node.data.indicators
        this.indicators.forEach(x => {
          x.active ? this.selectedIndicators.push(x.id) : []
        })
      }) : {}
      if((this.node.data.dataSets || !this.node.data.source) && this.node.data.hasOwnProperty('source')) {
        this.$store.dispatch('getLibrarys', {currentLib: this.node.data, boolTree: true})
      } else if(this.node.data.id !== 0 && !this.node.data.dataSets  && this.node.data.link) {
        // this.$store.dispatch('getLibrarys', {currentLib: this.node.data, boolTree: true})
        for(let o of this.librarys) {
          if (o.source) {
            for(let i of o.dataSets) {
              console.log(i)
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
      // this.dialog = false
      this.$store.dispatch('activationIndicators', { selected: this.selectedIndicators, currentIndicators: this.indicators }).then(() => this.dialog = false)
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
    },
    cancel () {
      this.dialog = false
    },
    
  },
  computed: {
    report () {
      return this.$store.state.report
    },
    librarys() {
      return this.$store.getters.oldLibrarys
    },
    tree() {
      return this.$store.state.currentTree
    },
    selectAll: {
      get: function () {
        if(this.tab === 0) {
          if(this.node && this.node.data.dataSets) {
            return this.node.data.dataSets ? this.selected.length === this.node.data.dataSets.length && (this.node.data.dataSets.length ? true : false) : false
          } else if (this.node && this.node.data.id === 0) {
            return this.node.data.children ? this.selected.length === this.librarys.length : false
          }
        } else if(this.tab === 1) {
          if(this.indicators.length) {
            return this.indicators ? this.selectedIndicators.length === this.indicators.length : false
          } else {
            return false
          }
        }
        
      },
      set: function (value) {
        if(this.tab === 0 || !this.tab) {
          let selected = [];
          if (value) {
            if(this.node && this.node.data.id === 0) {
              this.librarys.forEach(x => selected.push(x.id))
            } else if(this.node && this.node.data.dataSets) {
              for (let i = 0; i < this.node.data.dataSets.length; i++) {
                let id = !this.node.data.dataSets[i].datasetID ? this.node.data.dataSets[i].id : JSON.stringify(this.node.data.dataSets[i].datasetID)
                selected.push(id)
              }
            }
          }
          this.selected = selected;
        } else if(this.tab === 1) {
          let selected = []
          if(value) {
            for(let o of this.indicators){
              selected.push(o.id)
            }
          }
          this.selectedIndicators = selected
        }
      }
    }
  }
}
</script>
<style>
.noPadding {
  padding: 0px 0px;
  margin-left: 5px
}
.paddingCardText {
  padding-top: 0;
}
</style>
