import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import sortLinks from './modules/sortLinks'
import addDataToReport from '../server/modules/addDataToReport'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    dialogTree: false,
    dialogAddLibrary: false,
    dialogCreateLibrary: false,
    librarys:[],
    oldLibrarys: [],

    dialog: false,
    currentNote: {
      id: 0,
      data: [],
      labels:[],
      name: 'набор данных',
      val1: {
        value: 0,
        label: 'min'
      },
      val2: {
        value: 0,
        label: 'max'
      },
      link: '',
      children: []
    },
    currentTree: {},
    library: [],
    oldLibrary: [],
    libraryLink: [],
    libraryTree: [],
    report: {
      id: '',
      data:[],
      name:'',
      children:[]
    },
    oldReport:[]
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
    changeDialogLibrary:(state, {boolAdd, boolCreate, newLibrary}) => {
      if(boolAdd !== undefined) {
        state.dialogAddLibrary = boolAdd;
      }
      if(boolCreate !== undefined) {
        state.dialogCreateLibrary = boolCreate;
      }
      if(newLibrary) {
        state.librarys.push(newLibrary)
      }
    },
    librarys: (state, data) => {
      state.librarys = data;
    },

    changeDialog:(state, {bool, value}) => {
      state.dialog = bool;
      if(value) {
        state.currentNote = state.oldLibrary.find(x => x === value);
      } else {
        state.currentNote = {
          id: parseInt(state.library[state.library.length - 1].id) + 1,
          data: [],
          labels:[],
          name: 'набор данных',
          val1: {
            value: 0,
            label: 'min'
          },
          val2: {
            value: 0,
            label: 'max'
          },
          link: '',
          children: []
        };
      }
    },
    library (state, data) {
      state.library = data;
    },
    report (state, data) {
      state.report = data;
    }
  },
  actions: {
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
    oldReport: state => state.oldReport
  }
});
