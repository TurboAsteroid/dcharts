import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import sortLinks from './modules/sortLinks';
import addDataToReport from '../server/modules/addDataToReport';
import addElementsInTree from './modules/addElementsInTree'
import { ifError } from 'assert';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    selected: [],
    selectedTreeElement:[],
    activeLib: [],

    dialogTree: false,
    dialogAddLibrary: false,
    setting: false,
    create: false,
    // dialogCreateSetting: false,
    dialogCreate: false,
    dialogSetting: false,

    currentLibrary: {
      id: 0,
      name: '',
      dataSets:[],
      active: true,
      source: ''
    },
    currentTree: {},

    librarysList:[],
    treesLibrary:[],
    librarys:[],
    oldLibrarys:[], // все выбранные библиотеки

    report:{
      id: 0,
      data:[],
      name:'Библиотеки',
      children:[]
    },
    oldReport:[],
    
  },
  mutations: {
    changeDialogTree:(state, {bool, value}) => {
      state.dialogTree = bool;
      if (value) {
        state.currentTree = value;
        state.report = {
          id: 0,
          data:[],
          name:'Библиотеки',
          children:[]
        };
      }
    },
    changeDialogLibrary:(state, {boolAdd, boolSetting, boolCreate, newLibrary, deleteLibrary, valueSetting}) => {
      if(boolAdd !== undefined) {
        state.dialogAddLibrary = boolAdd;
      }
      if(boolSetting !== undefined) {
        state.dialogSetting = boolSetting;
        if(valueSetting) {
          state.currentLibrary = JSON.parse(JSON.stringify(valueSetting));
        }
      }
      if(boolCreate !== undefined) {
        state.dialogCreate = boolCreate;
        state.currentLibrary = {
          id: 0,
          name: '',
          dataSets:[],
          active: true,
          source:''
        };
      }
      if(newLibrary) {
        // state.oldLibrarys.push(newLibrary);
        state.allLib.push(newLibrary);
        state.librarysLinks.push({
          id: newLibrary.id,
          title: newLibrary.name,
          source: ''
        });
        state.currentLibrary = {
          id: 0,
          name: '',
          dataSet:[]
        };
      }
      if(deleteLibrary) {
        state.oldLibrarys.splice(state.oldLibrarys.indexOf(x => x.id === deleteLibrary.id), 1)
        state.librarysLinks.splice(state.librarysLinks.indexOf(x => x.title === deleteLibrary.name), 1)
      }
    },
    addLibrarys: (state) => {
      let result = [],
          activeLib = [];

      for(let o of state.selected) {
        let lib = state.librarysList.find(x => x.id === o);
        lib.active = true;
        activeLib.push({id: lib.id, active: 1});
        result.push(lib); 
      }
      state.librarysList.forEach(lib => {
        if(!result.some(x => x.id === lib.id)) {
          lib.active = false;
          activeLib.push({id: lib.id, active: 0})
        }
      });
      // console.log(result)
      state.oldLibrarys = result;
      state.activeLib = activeLib;
    },
    librarys: (state, data) => {
      state.librarys = data;
    },
    report (state, data) {
      state.report = data;
    },
  

  },
  actions: {
    getActiveLibrarys({commit}) {
      // console.log('dsf')
      axios.post('http://10.1.100.170:4000', {
        query: 
          `query {
              getActiveLibrarys {
                id
                name
                source
                active
              }
          }`
      }).then((res) => {
        let lib = res.data.data.getActiveLibrarys;
        this.state.oldLibrarys = [];
        this.state.selected = [];
        // this.state.oldLibrarys = 
        for(let o of lib) {
          o.id = parseInt(o.id);
          o["dataSets"] = [];
          this.state.activeLib.push({id: o.id, active: 1});
          this.state.selected.push(o.id);
          this.state.oldLibrarys.push(o);
        }
      });
    },
    getLibrarysList({commit}) {
      return axios.post('http://10.1.100.170:4000', {
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
        // this.state.selectedLibrary = []
        // console.log(res)
        let libList = res.data.data.getLibrarysList;
        for(let o of libList) {
          o.id = parseInt(o.id);
          o["dataSets"] = [];
        }
        this.state.librarysList = libList;
      }); 
    },
    activationLibrarys({commit},) {
      axios.post('http://10.1.100.170:4000', {
        query:
          `mutation ActivationLibrary(
            $activeLibs: [inputActiveLibrary]
          ) {
            activationLib(activeLibs: $activeLibs) 
          }`,
        variables: {
          activeLibs: this.state.activeLib
        }
      }).then((res) => {
        
      });
    },
    getLibrarys({commit}, {currentLib, boolTree}) {
      let LibID = !currentLib.source ? [parseInt(currentLib.id)] : null,
          linkLibID = currentLib.source ? [parseInt(currentLib.id)] : null;

      axios.post('http://10.1.100.170:4000', {
        query:
          `query GetSelectedLibrary(
              $LibID: [Int], 
              $linkLibID: [Int], 
              $boolLibID: Boolean!, 
              $boolLinkLibID: Boolean!
            ){
            createdLib: getLibrarys(LibID: $LibID)  @include(if: $boolLibID) {
              id
              name
              active
              source
              dataSets {
                id
                datasetID
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
              }  
            }
            linksLib: getLibrarys(LibID: $linkLibID)  @include(if: $boolLinkLibID){
              id
              name
              active
              source
              dataSets {
                ...dataSet
                datasetID
                children {
                  ...dataSet
                  children {
                    ...dataSet
                    children {
                      ...dataSet
                    }
                  }
                }
              }  
            }
          }
          fragment dataSet on DataSet {
            id
            data
            name
            labels
            link
            val1 {
              value
              label
            }
            val2 {
              value
              label
            }    
          }`,
          variables: {
            LibID,
            // boolLibID: LibID.length ? true : false,
            boolLibID: LibID ? true : false,
            linkLibID,
            // boolLinkLibID: linkLibID.length ? true : false,
            boolLinkLibID: linkLibID ? true : false,
          }
      }).then(res => {
        let [createdlibs, linkLibs] = [res.data.data.createdLib, res.data.data.linksLib];
        if(createdlibs && createdlibs[0]) {
          if(boolTree === undefined) {
            this.state.currentLibrary.dataSets = createdlibs[0].dataSets;
          } else {
            currentLib.dataSets = createdlibs[0].dataSets || [];
            this.state.oldLibrarys[this.state.oldLibrarys.findIndex(x => parseInt(x.id) === parseInt(createdlibs[0].id))]
            .dataSets = createdlibs[0].dataSets;
          }
          
        }
        if(linkLibs) {
          if(boolTree === undefined) {
            this.state.currentLibrary.dataSets = linkLibs[0].dataSets;
          } else {
            currentLib.dataSets = linkLibs[0].dataSets;
            this.state.oldLibrarys[this.state.oldLibrarys.findIndex(x => parseInt(x.id) === parseInt(linkLibs[0].id))]
            .dataSets = linkLibs[0].dataSets;
          }
          
        }
      });
    },
    changeLibrarys({commit}, {library}) {
      let lib = JSON.parse(JSON.stringify(library));
      if(this.state.oldLibrarys.some(x => x.id === lib.id)) {
        this.state.oldLibrarys[this.state.oldLibrarys.findIndex(x => x.id === lib.id)].name = lib.name;
      } else {
        // console.log(lib)
        this.state.oldLibrarys.push(lib)
      }

      commit('changeDialogLibrary',{ boolCreate: false, boolSetting: false});
      for(let o of lib.dataSets) { // убираю id у созданных наборов, чтобы можно было создавать записи в бд
        if(o.datasetID && typeof o.id === 'string' || o.datasetID === 0) {
          o.id = ''
        }
      }

      axios.post('http://10.1.100.170:4000', {
        query:
          `mutation ChangeLibrary(
            $library: inputLibrary
          ) {
            changeLib(library: $library) 
          }`,
        variables: {
          library: lib
        }
      }).then((res) => {
        if(res.data.data.changeLib) {
          lib.id = res.data.data.changeLib;
        }
      });
    },
    deleteLibrarysOrDataSets({commit}, {libID, datasetID}) {
      if(libID) {
        this.state.oldLibrarys.splice(this.state.oldLibrarys.findIndex(x => parseInt(x.id) === libID), 1)
        commit('changeDialogLibrary',{ boolCreateSetting: false });
      }

      axios.post('http://10.1.100.170:4000', {
        query: `
          mutation DeleteLibrarysOtDataSets($libID: Int, $datasetID: [Int])  {
            deleteLibrarysOrDataSets(libID: $libID, datasetID: $datasetID)
          }
        `,
        variables: {
          libID,
          datasetID
        }
      });
    },
    getTreesLibrary({commit}) {
      axios.post('http://10.1.100.170:4000', {
        query:`
          query {
            getTreesLibrary {
              id
              name
              date
              levels
            }
          }
        `
      }).then(res => {
        // console.log(res.data.data.getTreesLibrary)
        this.state.treesLibrary = res.data.data.getTreesLibrary;
      });
    },
    getTree({dispatch, commit},{tree, getLastTree}) {
      // console.log(tree)
      let treeID;
      let report;
      if(tree) {
        treeID = tree.id;
      }
      
      // console.log(treeID)
      axios.post('http://10.1.100.170:4000', {
        query: `
          query GetTree($treeID: Int, $lastTree: Boolean){
            getTree(treeID: $treeID, lastTree: $lastTree) {
              id
              name
              active
              source
              inTree
              dataSets {
                ...dataSet
                datasetID
                children {
                  ...dataSet
                  children {
                    ...dataSet
                    children {
                      ...dataSet
                    }
                  }
                }
              }  
            }
            getLibraryIdInTree(treeID: $treeID)
          }
          fragment dataSet on DataSet {
            id
            data
            name
            labels
            inTree
            link
            val1 {
              value
              label
            }
            val2 {
              value
              label
            }    
          }
        `,
        variables: {
          treeID: parseInt(treeID),
          lastTree: getLastTree || false
        }
      }).then(res => {
        // console.log(res.data.data.getLibraryIdInTree)

        this.state.oldLibrarys = res.data.data.getTree;
        report = {
          id: 0,
          data:[],
          name:'Библиотеки',
          children:[],
          librarysID: res.data.data.getLibraryIdInTree
        };
        // console.log(this.state.oldLibrarys)
        addElementsInTree(report, this.state.oldLibrarys);
        if(getLastTree && this.state.treesLibrary.length) {
          let lastTree = this.state.treesLibrary[this.state.treesLibrary.length - 1];
          this.state.currentTree = {
            id: lastTree.id,
            name: lastTree.name,
            date: lastTree.date
          };
        }
      }).then(() => {

        if(!report.children.length) {
          dispatch('getLibrarysList').then(() => {
            if(this.state.librarysList.length) {
              this.state.selected = []
              report.librarysID.forEach(x => {
                this.state.librarysList.splice(
                  this.state.librarysList.findIndex(i => i.id !== x),
                  1
                );
              });
              
              // console.log(this.state.librarysList)
              // commit('changeDialogTree',{bool: false});
              commit('changeDialogLibrary', { boolAdd: true });
            }
          });
        } else {
          commit('changeDialogTree',{bool: false, value: tree});
          this.state.report = report;
        }
      }).catch(e => console.error(e.message));
    },
    setTree({commit}, {tree}) {
      if(this.state.currentTree.name) {
        // console.log(tree.children)
        // console.log(this.state.currentTree)
        axios.post('http://10.1.100.170:4000', {
          query:`
            mutation ChangeTree($tree: [inputTree], $treeLibrary: inputTreeLibrary) {
              changeTree(tree: $tree, treeLibrary: $treeLibrary)
            }
          `,
          variables:{
            treeLibrary: this.state.currentTree,
            tree: tree.children
          }
        });
      }
      
    },
    deleteTree({commit}, {treeID}) {
      axios.post('http://10.1.100.170:4000', {
        query:`
          mutation DeleteTree($treeID: ID!) {
            deleteTree(treeID: $treeID)
          }        
        `, 
        variables: {
          treeID
        }
      });
    }
  },
  getters: {
    oldLibrarys: state => state.oldLibrarys,

    dialog: state => state.dialog,
    library: state => state.library,
    report: state => state.report,
    oldReport: state => state.oldReport,
  }
});
