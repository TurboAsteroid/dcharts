<template>
    <!-- <div> -->
        <v-container>
          <v-container grid-list-md>
            <v-layout wrap align-center justify-center>
                <v-btn @click="$store.commit('changeDialogTree', {bool: true})" color="info">Выбрать дерево</v-btn>
                <v-btn @click="toReport" color="success">Сохранить дерево</v-btn>
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
            <v-dialog v-model="dialog" persistent max-width="580">
                <v-card>
                    <v-card-title>
                      <v-layout row align-center>
                          <v-flex xs10 v-if="node && node.data.id === 0">
                            <span class="headline">Выбор библиотек</span>
                          </v-flex>
                          <v-flex xs10 v-else-if="node && node.data.id !== 0">
                            <span class="headline">Набор: {{node.data.name}}</span>
                          </v-flex>
                          <v-flex xs2>
                              <v-tooltip bottom>
                                  <template v-slot:activator="{ on }">
                                      <v-btn flat outline fab dark small v-on="on" color="red" @click="cancel">
                                          <v-icon dark>close</v-icon>
                                      </v-btn>
                                  </template>
                            <span>Отмена</span>
                          </v-tooltip>
                        </v-flex>
                        <v-flex xs2>
                              <v-tooltip bottom>
                                  <template v-slot:activator="{ on }">
                                      <v-btn flat outline fab dark small v-on="on" color="success" @click="ok">
                                          <v-icon dark>done</v-icon>
                                      </v-btn>
                                  </template>
                            <span>ОК</span>
                          </v-tooltip>
                        </v-flex>
                      </v-layout>
                  </v-card-title>

                  <v-divider/>

                  <v-card-text>
                     <v-list two-line>
                       <span v-if="node && node.data.id === 0">
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
                                      :value="item"
                                      color="info"
                                  ></v-checkbox>
                                </v-list-tile-action>
                              </v-list-tile>
                              <v-divider v-if="index != librarys.length - 1"></v-divider>
                            </v-flex>
                        </v-layout>
                       </span>

                       <span v-else-if="node && node.data.dataSets">
                          <!-- <v-treeview
                            :items="node.data.dataSets"

                          >
                          <template v-slot:label="{ item }">
                              <v-checkbox
                                v-model="selected"
                                :label="item.name"
                                :value="item"
                                color="info"
                              ></v-checkbox>
                          </template>
                        </v-treeview> -->
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
                                        :value="item"
                                        color="info"
                                    ></v-checkbox>
                                  </v-list-tile-action>
                                </v-list-tile>
                                <v-divider v-if="index != node.data.dataSets.length - 1"></v-divider>
                              </v-flex>
                          </v-layout>
                       </span>
                     </v-list>
                  </v-card-text>
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
    dialog: false,
    node: null,
    currentChild: null,
    child: [],
    result:[]
  }),
  mounted () {
    // if (!this.$store.getters.library.length) {
    //   this.$router.replace('/')
    // }
    // if(this.$store.state.currentTree.id) {
    //   this.$store.dispatch('getTree', this.$store.state.currentTree.id)
    // }
  },
  methods: {
    goBackToLibrary() {
      this.$router.push('/');
    },
    toReport() {
      this.$store.dispatch('setTree', { tree: this.report })
    },
    onClick (evt) {
      console.log(evt)
      // if(evt.data.children) {
        this.dialog = true
        this.node = evt
        if(this.node.data.dataSets && this.node.data.hasOwnProperty('source') || !this.node.data.source && this.node.data.hasOwnProperty('source') ) {
          console.log('dsf')
          this.$store.dispatch('getLibrarys', {currentLib: this.node.data, boolTree: true})
        } else if(this.node.data.id !== 0 && !this.node.data.dataSets && this.node.data.link) {
          for(let o of this.librarys) {
            if (o.source) {
              for(let i of o.dataSets) {
                this.findCild(i);
              }
            }
          }
          this.node.data.dataSets = this.result
        }
        this.selected = []

        for (let i = 0; i < evt.data.children.length; i++) {
          let tmpNode = Object.assign({}, evt.data.children[i])
          delete tmpNode.children
          this.selected.push(tmpNode)
        }
      // }
      
    },
    findCild(parent) {
      if(parent.link === this.node.data.link) {
        this.result = parent.children
        return 0;
      } else if (parent.children && parent.children.length) {
        for(let o of parent.children) {
          this.findCild(o);
        }
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
      this.selected = []
    },
    cancel () {
      this.dialog = false
    },
    
  },
  computed: {
    // report () {
    //   if (Object.keys(this.$store.state.oldReport).length !== 0) {
    //     return this.$store.state.oldReport
    //   }
    // },
    report () {
      // let report = {
      //   id: 0,
      //   name: 'Библиотеки',
      //   children: []

      //   // children: [...this.$store.state.oldLibrarys]
      // }
      return this.$store.state.report
    },
    librarys() {
      return this.$store.getters.oldLibrarys
    }
  }
}
</script>
