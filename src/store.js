import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    library: [],
    oldLibrary: [],
    report: {
      name: 'Корневой элемент',
      children: [],
      data: []
    }
  },
  mutations: {
    library (state, data) {
      state.library = data
      state.oldLibrary = JSON.parse(JSON.stringify(state.library))
    },
    report (state, data) {
      state.report = data
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
            for (let j = 0; j < library.length; j++) {
              for (let i = 0; i < library[j].data.length; i++) {
                library[j].data[i] = parseInt(library[j].data[i])
              }
              library[j].val1.value = parseInt(library[j].val1.value)
              library[j].val2.value = parseInt(library[j].val2.value)
            }   
            this.state.oldLibrary = JSON.parse(JSON.stringify(library));
            commit('library', library)
          }
        )  
    },
    setLibrary({commit}, {library, changeLibrary}) {
      console.log('chl',changeLibrary)
      axios.post('http://localhost:4000', {
        query:
          `mutation ChangeDatabase($update: String!, $create: String!, $delete: String!) {
            updateNote(data: $update) {
              id
              data
              name
              val1
              val2
              link
            }
            createNewNote(data: $create) {
              id
              data
              name
              val1
              val2
              link
            }
            deleteNote(data: $delete) {
              id
            }
          }`,
          variables:{
            update: JSON.stringify(changeLibrary.update),
            create: JSON.stringify(changeLibrary.create),
            delete: JSON.stringify(changeLibrary.delete)
          }
      }).then(res => console.log('res',res))
      commit('library', library)
    }
  },
  getters: {
    library: state => Object.assign(state.library),
    report: state => Object.assign(state.report)
  }
})
