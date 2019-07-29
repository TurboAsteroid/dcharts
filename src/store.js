import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import sortLinks from './modules/sortLinks'
import addDataToReport from '../server/modules/addDataToReport'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
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
    library: [],
    oldLibrary: [],
    report: {}
  },
  mutations: {
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
      commit('library', library);
    },
    getTree({commit}) {
      axios.post('http://localhost:4000', {
        query: 
          `query {
            getTree {
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
          
        }`
      }).then(res => {
        let tree = res.data.data.getTree
        
        this.state.report = tree;
        console.log('Tree: ', this.state.report)
        
      });
    },
    setTree({commit}, {tree}) {
      axios.post('http://localhost:4000', {
        query:`
          mutation ChangeTree($tree: treeInput!) {
            changeTree(tree: $tree) {
              id
            }
          }
        `,
        variables:{
          tree
        }
      });
    },
    getDataByParametr({}, report) {
      let links = sortLinks(report);
      let param = links.find(x => x.linkSource === "Salary");
      let result = {};
      axios.post('http://localhost:4000', {
        query:` 
          query GetData($salary: [String], $salaryBool: Boolean!){
            getData(salary: $salary, salaryBool: $salaryBool) {
              getSalary(salary: $salary) @include(if: $salaryBool){
                id
                data
                labels
              }
            }
          }
        `,
        variables:{
          report,
          salary: param.linkParametr,
          salaryBool: links.some(x => x.linkSource === "Salary")
        }
      }).then((res) => {
        let addData = res.data.data.getData
        console.log('addData: ', addData)
        for(let o of Object.keys(addData)) {
          // console.log(addData[o])
          result = addDataToReport(report, addData[o])
          this.state.report = result;
          // console.log(result)
        }
      })
    }
  },
  getters: {
    dialog: state => state.dialog,
    library: state => Object.assign(state.library),
    report: state => Object.assign(state.report)
  }
});
