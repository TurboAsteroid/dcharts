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
    activeTreeId: null,
    dialogTree: false,
    dialogAlert: false,
    dialogAddLibrary: false,
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
    currentDashbord: {},
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
    charts:[],
  },
  mutations: {
    changeDialogTree:(state, {bool, boolAlert, value}) => {
      bool !== undefined ? state.dialogTree = bool : {};
      if(boolAlert !== undefined) {
        state.dialogAlert = boolAlert;
      }
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
        state.dialogAlert = false;
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
      state.oldLibrarys = Object.assign([], result);
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
    activationLibrarys({dispatch},) {
      axios.post('http://10.1.100.170:4000', {
        query:
          `mutation ActivationLibrary($activeLibs: [inputActive]){
            activationLib(activeLibs: $activeLibs) 
          }`,
        variables: {
          activeLibs: this.state.activeLib
        }
      }).then(() => {
        if(this.state.currentTree.addLib) {
          let currentTree = this.state.treesLibrary[this.state.treesLibrary.findIndex(x => x.id === this.state.currentTree.id)];
          this.state.currentTree = {
            id: currentTree.id,
            name: currentTree.name,
            date: currentTree.date
          };
          delete this.state.currentTree.addLib;
          dispatch('getTree',{tree: currentTree});
        }
      });
    },
    activationTree({}, {treeID}) {
      axios.post('http://10.1.100.170:4000', {
        query:
          `mutation ActivationTree(
            $treeID: ID
          ) {
            activationTree(treeID: $treeID) 
          }`,
        variables: {
          treeID
        }
      });
    },
    activationIndicators({}, {selected, currentIndicators}) {
      let activeInd = [];
      if(currentIndicators) {
        for(let o of currentIndicators) {
          if(selected.find(x => x === o.id)) {
            activeInd.push({id: o.id, active: 1});
          } else {
            activeInd.push({id: o.id, active: 0});
          }
        }
      }
      return axios.post('http://10.1.100.170:4000', {
        query:`
          mutation ActivationIndicators($activeInd: [inputActive]) {
            activationIndicators(activeInd: $activeInd)
          }
        `,
        variables: {
          activeInd
        }
      });
    },

    getActiveLibrarys({}) {
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
        for(let o of lib) {
          o.id = parseInt(o.id);
          o["dataSets"] = [];
          this.state.activeLib.push({id: o.id, active: 1});
          this.state.selected.push(o.id);
          this.state.oldLibrarys.push(o);
        }
      });
    },
    getLibrarysList({}) {
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
        let libList = res.data.data.getLibrarysList;
        this.state.selected = [];
        for(let o of libList) {
          o.id = parseInt(o.id);
          o["dataSets"] = [];
          o.active ? this.state.selected.push(o.id) : '';
        }
        this.state.librarysList = Object.assign([], libList);
      }); 
    },
    getLibrarys({}, {currentLib, boolTree}) {
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
            boolLibID: LibID ? true : false,
            linkLibID,
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
    getTreesLibrary({}) {
      axios.post('http://10.1.100.170:4000', {
        query:`
          query {
            getTreesLibrary {
              id
              name
              date
              levels
              active
            }
          }
        `
      }).then(res => {
        this.state.treesLibrary = res.data.data.getTreesLibrary;
      });
    },
    getTree({dispatch, commit},{tree, getLastTree, addData}) {
      let treeID;
      let report;
      if(tree) {
        treeID = tree.id;
      }
      return axios.post('http://10.1.100.170:4000', {
        query: `
          query GetTree($treeID: Int, $lastTree: Boolean, $addData: Boolean){
            getTree(treeID: $treeID, lastTree: $lastTree) {
              id
              name
              active
              source
              inTree
              dataSets(addData: $addData) {
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
            getLibraryIdInTree(treeID: $treeID, lastTree: $lastTree)
            getActiveTree
          }
          fragment dataSet on DataSet {
            id
            data
            name
            labels
            inTree
            link
            status {
              icon
              iconClass
            }
            val1 {
              value
              label
            }
            val2 {
              value
              label
            }
            indicators {
              id
              name
              source
              active
              data
              labels
              val1 {
                value
                label
              }
              val2 {
                value
                label
              }
              status {
                icon
                iconClass
              }
            }
          }
        `,
        variables: {
          treeID: parseInt(treeID),
          lastTree: getLastTree || false,
          addData: addData || false
        }
      }).then(res => {
        this.state.oldLibrarys = res.data.data.getTree;
        this.state.activeTreeId = res.data.data.getActiveTree;
        report = {
          id: 0,
          data:[],
          name:'Библиотеки',
          children:[],
          librarysID: res.data.data.getLibraryIdInTree
        };
        this.state.oldLibrarys ? addElementsInTree(report, { data: this.state.oldLibrarys }) : {};
        if(getLastTree && this.state.oldLibrarys.length) {
          let lastTree = this.state.treesLibrary.find(x => x.active === true);
          this.state.currentTree = {
            id: lastTree.id,
            name: lastTree.name,
            date: lastTree.date
          };
        }
      }).then(() => {

        if(!report.children.length || report.children.length !== report.librarysID.length) {
          dispatch('getLibrarysList').then(() => {
            if(this.state.librarysList.length) {
              this.state.selected = [];
              let libList = [];

              report.librarysID.forEach(x => {
                libList.push(this.state.librarysList.find(i => i.id === x));
              });
              libList.forEach(x => {
                x.active ? this.state.selected.push(x.id) : {}
              });
              this.state.librarysList = Object.assign([], libList);
              commit('changeDialogTree', { boolAlert: true });
              
              if (treeID) {
                this.state.currentTree.id = treeID;
                this.state.currentTree.name = tree.name;
              }
              this.state.currentTree.addLib = true;
            }
          });
        } else {
          commit('changeDialogTree',{ bool: false, value: tree });
          this.state.report = report;
        }
      }).catch(e => console.error(e));
    },
    getIndicators({}, {currentDataSet}) {
      let id;
      if(currentDataSet.hasOwnProperty('datasetID') && currentDataSet.hasOwnProperty('link')) {
        currentDataSet.datasetID ? id = currentDataSet.datasetID : id = currentDataSet.id;
      } else {
        id = currentDataSet.id;
      }
      return axios.post('http://10.1.100.170:4000', {
        query:`
          query GetIndicators($id: ID, $boolLink: Boolean){
            getIndicators(id: $id, boolLink: $boolLink){
              id
              name
              source
              data
              labels
              val1 {
                value
                label
              }
              val2 {
                value
                label
              }
              active
            }
          }
        `,
        variables: {
          id,
          boolLink: currentDataSet.link ? true : false
        }
      }).then(res => {
        res.data.data.getIndicators.length ? currentDataSet.indicators = res.data.data.getIndicators : {}
      });
    },
    getDataByParametr({}, {link}) {
      let currentLink = link.split('.'),
        source = currentLink[0],
        parametr = currentLink[1];
        return axios.post('http://10.1.100.170:4000', {
          query:` 
            query GetData (
              $salary: String, 
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
            salary: parametr,
            salaryBool: source === "Salary"
          }
        }).then(res => {});
    },
    getCharts({}, {currentNode}) {
      let boolLink = false,
          boolDataset = false;
      let id;
      if(!currentNode.hasOwnProperty('datasetID') && currentNode.hasOwnProperty('link') || currentNode.children.length && currentNode.link) {
        id = currentNode.id;
        boolLink = true;
      } else {
        currentNode.datasetID ? id = currentNode.datasetID : id = currentNode.id;
        boolDataset = true;
      }

      return axios.post('http://10.1.100.170:4000', {
        query:`
          query GetCharts($id: ID, $treeID: ID,$boolLink: Boolean, $boolDataset: Boolean){
            getCharts(id: $id, treeID: $treeID, boolLink: $boolLink, boolDataset: $boolDataset) {
              title
              active
            }
          }
        `,
        variables: {
          id,
          treeID: this.state.activeTreeId,
          boolLink,
          boolDataset
        }
      }).then(res => {
        this.state.charts = res.data.data.getCharts;
      });
    },

    changeLibrarys({commit}, {library}) {
      let lib = JSON.parse(JSON.stringify(library));
      if(this.state.oldLibrarys.some(x => x.id === lib.id)) {
        this.state.oldLibrarys[this.state.oldLibrarys.findIndex(x => x.id === lib.id)].name = lib.name;
      } else {
        this.state.oldLibrarys.push(lib);
      }

      commit('changeDialogLibrary',{ boolCreate: false, boolSetting: false});
      let datasets = [];
      for(let o of lib.dataSets) { // убираю id у созданных наборов, чтобы можно было создавать записи в бд
        datasets.push(o);
        if(o.datasetID && typeof o.id === 'string' || o.datasetID === 0) {
          o.id = '';
        }
      }

      axios.post('http://10.1.100.170:4000', {
        query:
          `mutation ChangeLibrary(
            $library: inputLibrary
            $datasets: [inputDataSet]
          ) {
            changeLib(library: $library)
            changeIndicators(indicators: $datasets)
          }`,
        variables: {
          library: lib,
          datasets
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
    setTree({dispatch}, {tree}) {
      if(this.state.currentTree.name) {
        let treeLib = Object.assign({}, this.state.currentTree);
        delete treeLib.active;
        return axios.post('http://10.1.100.170:4000', {
          query:`
            mutation ChangeTree($tree: [inputTree], $treeLibrary: inputTreeLibrary) {
              changeTree(tree: $tree, treeLibrary: $treeLibrary)
            }
          `,
          variables:{
            treeLibrary: treeLib,
            tree: tree.children
          }
        }).then(res => {
          let id = res.data.data.changeTree ? res.data.data.changeTree : null;
          id ? dispatch('activationTree', {treeID: id}) : {};
        });
      }
      
    },
    deleteTree({}, {treeID}) {
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
    },
  },
  getters: {
    oldLibrarys: state => state.oldLibrarys,

    dialog: state => state.dialog,
    library: state => state.library,
    report: state => state.report,
  }
});
