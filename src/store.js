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
                val1
                val2
                link
              }
          }`
      }).then(res => {
            let library = res.data.data.getLibrary
            // console.log(library)
            for (let j = 0; j < library.length; j++) {
              for (let i = 0; i < library[j].data.length; i++) {
                library[j].data[i] = parseInt(library[j].data[i])
              }
              library[j].val1 = parseInt(library[j].val1)
              library[j].val2 = parseInt(library[j].val2)
            }   
            this.state.oldLibrary = JSON.parse(JSON.stringify(library));
            commit('library', library)
          }
        )  
    },
    setLibrary({commit}, payload) {
      axios.post('http://localhost:4000', {
        query:
          `mutation ChangeDatabase($data: String!) {
            changeDatabase(data: $data) {
              id
              data
              name
              val1
              val2
              link
            }
          }`,
          variables:{
            data: JSON.stringify(payload)
          }
      }).then(res => console.log(res))
      commit('library', payload)
    }
  },
  getters: {
    library: state => Object.assign(state.library),
    report: state => Object.assign(state.report)
  }
})
