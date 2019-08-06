import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import sortLinks from './modules/sortLinks'
import addDataToReport from '../server/modules/addDataToReport'
import { ifError } from 'assert';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    dialogTree: false,
    dialogAddLibrary: false,
    setting: false,
    dialogCreateSetting: false,
    currentLibrary: {
      id: 0,
      name: '',
      dataSet:[]
    },
    librarysList:[],
    selectedLibrary:[],
    currentDashbord: {},


    librarys:[],
    oldLibrarys:[],
    allLib: [
      {
        id: 1,
        name: 'Средние зарплаты',
        source: 'Salary',
        dataSet:[
          {
            id: 2,
            name: 'Компания',
            link_name: 'Salary.company',
            val1: {
              value: 30000,
              label: 'min'
            },
            val2: {
              value: 50000,
              label: 'max'
            },
          },
          {
            id: 45,
            name: 'Пол',
            link_name: 'Salary.sex',
            val1: {
              value: 30000,
              label: 'min'
            },
            val2: {
              value: 50000,
              label: 'max'
            },
          },
          {
            id: 23,
            name: 'Мужчины',
            link_name: 'Salary.male',
            val1: {
              value: 30000,
              label: 'min'
            },
            val2: {
              value: 50000,
              label: 'max'
            },
          },
          {
            id: 200,
            name: 'Женщины',
            link_name: 'Salary.female',
            val1: {
              value: 30000,
              label: 'min'
            },
            val2: {
              value: 50000,
              label: 'max'
            },
          }
        ]
      },
      {
        id: 3,
        name: 'Продукция.Цветная металлургия',
        source: 'Production',
        dataSet:[
          {
            id: 4,
            name: 'Золото в слитках',
            link_name: 'Production.au',
            val1: {
              value: 30000,
              label: 'min'
            },
            val2: {
              value: 50000,
              label: 'max'
            },
          },
          {
            id: 5,
            name: 'серебро в слитках',
            link_name: 'Production.arg',
            val1: {
              value: 30000,
              label: 'min'
            },
            val2: {
              value: 50000,
              label: 'max'
            },
          },
          {
            id: 6,
            name: 'Катоды медные',
            link_name: 'Production.cu',
            val1: {
              value: 30000,
              label: 'min'
            },
            val2: {
              value: 50000,
              label: 'max'
            },
          }
        ]
      },
      {
        id:7,
        name: 'Test 1',
        source:'',
        dataSet:[
          {
            id: 8,
            name: 'Карандаши',
            link_name: '',
            val1: {
              value: 300,
              label: 'min'
            },
            val2: {
              value: 500,
              label: 'max'
            },
            data:[320,390,450],
            labels:['03.08.19', '03.09.19', '03.10.19']
          },
          {
            id: 80,
            name: 'Настроение',
            link_name: '',
            val1: {
              value: 300,
              label: 'min'
            },
            val2: {
              value: 500,
              label: 'max'
            },
            data:[320,390,450],
            labels:['03.08.19', '03.09.19', '03.10.19']
          }
        ]
      }
    ],
    
//////////////////////////////
    // dialog: false,
    // currentNote: {
    //   id: 0,
    //   data: [],
    //   labels:[],
    //   name: 'набор данных',
    //   val1: {
    //     value: 0,
    //     label: 'min'
    //   },
    //   val2: {
    //     value: 0,
    //     label: 'max'
    //   },
    //   link: '',
    //   link_name: '',
    //   children: []
    // },
    // currentTree: {},
    // library: [],
    // oldLibrary: [],
    // libraryLink: [],
    // libraryTree: [],
    // report: {
    //   id: '',
    //   data:[],
    //   name:'',
    //   children:[]
    // },
    // oldReport:[]
  },
  mutations: {
    changeDialogTree:(state, {bool, value}) => {
      state.dialogTree = bool;
      if (value) {
        state.currentTree = value;
        state.oldReport = {
          id: 0,
          data:[],
          name:'Корневой элемент',
          children:[]
        };
      }
    },
    changeDialogLibrary:(state, {boolAdd, boolCreateSetting, newLibrary, deleteLibrary, valueSetting}) => {
      if(boolAdd !== undefined) {
        state.dialogAddLibrary = boolAdd;
      }
      if(boolCreateSetting !== undefined) {
        state.dialogCreateSetting = boolCreateSetting;
        state.currentLibrary = {
          id: 0,
          name: '',
          dataSet:[]
        }
      }
      if(valueSetting) {
        state.setting = boolCreateSetting;
        state.currentLibrary = valueSetting;
      }
      if(newLibrary) {
        // state.oldLibrarys.push(newLibrary);
        state.allLib.push(newLibrary)
        state.librarysLinks.push({
          id: newLibrary.id,
          title: newLibrary.name,
          source: ''
        })
        state.currentLibrary = {
          id: 0,
          name: '',
          dataSet:[]
        }
      }
      if(deleteLibrary) {
        state.oldLibrarys.splice(state.oldLibrarys.indexOf(x => x.id === deleteLibrary.id), 1)
        state.librarysLinks.splice(state.librarysLinks.indexOf(x => x.title === deleteLibrary.name), 1)
      }
    },
    addLib: (state, {addLib}) => {
      let result = []
      for(let o of addLib) {
        result.push(state.allLib.find(x => x.name === o.title))
      }
      state.oldLibrarys = result
    },
    librarys: (state, data) => {
      state.librarys = data;
    },

    // changeDialog:(state, {bool, value}) => {
    //   state.dialog = bool;
    //   if(value) {
    //     state.currentNote = state.oldLibrary.find(x => x === value);
    //   } else {
    //     state.currentNote = {
    //       id: parseInt(state.library[state.library.length - 1].id) + 1,
    //       data: [],
    //       labels:[],
    //       name: 'набор данных',
    //       val1: {
    //         value: 0,
    //         label: 'min'
    //       },
    //       val2: {
    //         value: 0,
    //         label: 'max'
    //       },
    //       link: '',
    //       children: []
    //     };
    //   }
    // },
    // library (state, data) {
    //   state.library = data;
    // },
    // report (state, data) {
    //   state.report = data;
    // }
  },
  actions: {
    getLibrarysList({commit}) {
      axios.post('http://localhost:4000', {
        query: 
          `query {
              getLibrarysList {
                id
                name
                source
                active
              }
          }`
      }).then((res) => {
        let libList = res.data.data.getLibrarysList;
        for(let o of libList) {
          o.id = parseInt(o.id)
          if(o.active) {
            this.state.selectedLibrary.push(o)
          }
        }
        this.state.librarysList = libList;
      });
      
    },
    getLibrary({commit}) {
      axios.post('http://localhost:4000', {
        query: 
          `query {
              getLibrary {
                id
                data
                name
                labels
                val1 {
                  value
                  label
                }
                val2 {
                  value
                  label
                }
                link
              }
          }`
      }).then(res => {
            let library = res.data.data.getLibrary
            this.state.oldLibrary = JSON.parse(JSON.stringify(library));
            commit('library', library)
          }
        )  
    },
    setLibrary({commit}, {library, changeLibrary}) {
      console.log('chl',changeLibrary);
      this.state.oldLibrary = JSON.parse(JSON.stringify(library));
      axios.post('http://localhost:4000', {
        query:
          `mutation ChangeDatabase($update: [libraryInput]!, $create: [libraryInput]!, $delete: [Int]!) {
            updateNote(data: $update) {
              id
            }
            createNewNote(data: $create) {
              id
            }
            deleteNote(data: $delete) {
              id
            }
          }`,
          variables:{
            update: changeLibrary.update,
            create: changeLibrary.create,
            delete: changeLibrary.delete.map(e => JSON.parse(e))
          }
      });
      // console.log('library:', library)
      commit('library', library);
    },
    getTree({commit}, treeId = 1) {
      // if(treeId) {
      // }
      axios.post('http://localhost:4000', {
        query: 
          `query GetTree($treeId: Int!){
            getTree(treeId: $treeId) {
              id
              name
              data
              children{
                ...lib
                children{
                  ...lib
                  children{
                    ...lib
                    children{
                      ...lib
                      children{
                        ...lib
                        children{
                          ...lib
                          children{
                            ...lib
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
        }
        fragment lib on Library{
          id
          data
          name
          labels
          link
          val1{
            value
            label
          }
          val2{
            value
            label
          }    
        }`,
        variables:{
          treeId: parseInt(treeId)
        }
      }).then(res => {
        let tree = res.data.data.getTree;
        this.state.oldReport = JSON.parse(JSON.stringify(tree));
        commit('report', tree)
      });
    },
    setTree({commit}, {tree, boolDelete = false, deleteTree = []}) {
      let boolAddTree = false,
          boolUpdateTree = true,
          boolDeleteTree = false,
          currentTree = this.state.currentTree,
          deleteTrees = [];

      if(boolDelete) {
        deleteTrees = deleteTree;
        boolDeleteTree = true;
        boolUpdateTree = false;
      }
      if(!boolDelete && !this.state.libraryTree.some(x => x.id === this.state.currentTree.id)) {
        boolAddTree = true;
        boolUpdateTree = false;
      }
      if(this.state.currentTree.title) {
        if(tree) {
          this.state.oldReport = JSON.parse(JSON.stringify(tree));
        }
        axios.post('http://localhost:4000', {
          query:`
            mutation ChangeTree (
              $tree: treeInput, 
              $currentTree: libraryTreeInput,
              $deleteTrees: [libraryTreeInput]
              $boolAddTree: Boolean!,
              $boolUpdateTree: Boolean!,
              $boolDeleteTree: Boolean!
            ) {
                addLibraryTree (tree: $currentTree) @include(if: $boolAddTree)
                updateLibraryTree (tree: $currentTree) @include(if: $boolUpdateTree)
                deleteLibraryTree (trees: $deleteTrees) @include(if: $boolDeleteTree)
                changeTree(tree: $tree, currentTree: $currentTree) @skip(if: $boolDeleteTree)
            }
          `,
          variables:{
            tree,
            currentTree,
            deleteTrees,
            boolAddTree,
            boolUpdateTree,
            boolDeleteTree
          }
        });
        commit('report', tree);
      }
    },
    getDataByParametr({}, report) {
      let links = sortLinks(report),
          param = links.find(x => x.linkSource === "Salary"),
          result = {};

      if(links.length !== 0) {
        axios.post('http://localhost:4000', {
          query:` 
            query GetData (
              $salary: [String], 
              $salaryBool: Boolean!
            ){
                getData (
                  salary: $salary, 
                  salaryBool: $salaryBool
                ){
                    getSalary(salary: $salary) @include(if: $salaryBool){
                      id
                      data
                      labels
                    }
                }
            }
          `,
          variables:{
            salary: param.linkParametr,
            salaryBool: links.some(x => x.linkSource === "Salary")
          }
        }).then(res => {
          let addData = res.data.data.getData;
          for(let o of Object.keys(addData)) {
            result = addDataToReport(report, addData[o]);
          }
          this.state.report = result;
        })
      }
      
    },
    getLibraryLink() {
      axios.post('http://localhost:4000', {
        query: 
          `query {
            getLibraryLink
          }`
      }).then(res => {
          this.state.libraryLink = JSON.parse(res.data.data.getLibraryLink)
        }
      )  
    },
    getLibraryTree() {
      axios.post('http://localhost:4000', {
        query: 
          `query {
            getLibraryTree {
              id
              title
              date
            }
          }`
      }).then(res => {
          let libTree = res.data.data.getLibraryTree
          this.state.libraryTree = libTree
          this.state.currentTree = libTree[libTree.length - 1]
        }
      )  
    }
  },
  getters: {
    dialog: state => state.dialog,
    library: state => state.library,
    report: state => state.report,
    oldReport: state => state.oldReport,
  }
});
