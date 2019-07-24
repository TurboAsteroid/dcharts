import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    library: [],
    oldLibrary: [],
    report: {
      id: 0,
      name: 'Корневой элемент',
      children: [],
      data: []
    }
  },
  mutations: {
    library (state, data) {
      state.library = data;
      // state.oldLibrary = JSON.parse(JSON.stringify(state.library))
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
            // console.log(res.data.data.getLibrary)
            let library = res.data.data.getLibrary
            this.state.oldLibrary = JSON.parse(JSON.stringify(library));
            // console.log(oldLibrary)
            // for (let j = 0; j < library.length; j++) {
            //   for (let i = 0; i < library[j].data.length; i++) {
            //     library[j].data[i] = parseInt(library[j].data[i]);
            //     oldLibrary[j].data[i] = parseInt(oldLibrary[j].data[i]);
            //   }
              
            //   library[j].val1.value = parseInt(library[j].val1.value)
            //   library[j].val2.value = parseInt(library[j].val2.value)

            //   oldLibrary[j].val1.value = parseInt(oldLibrary[j].val1.value)
            //   oldLibrary[j].val2.value = parseInt(oldLibrary[j].val2.value)
            // }   
            
            // console.log(library)
            commit('library', library)
          }
        )  
    },
    setLibrary({commit}, {library, changeLibrary}) {
      console.log('chl',changeLibrary);
      
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
    }
  },
  getters: {
    library: state => Object.assign(state.library),
    report: state => Object.assign(state.report)
  }
});
