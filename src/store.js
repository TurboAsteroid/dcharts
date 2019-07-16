import Vue from 'vue'
import Vuex from 'vuex'
// import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    library: [],
    report: {
      name: 'Корневой элемент',
      children: [],
      data: []
    }
  },
  mutations: {
    library (state, data) {
      state.library = data
    },
    report (state, data) {
      state.report = data
    }
  },
  actions: {
    // getLibrary({commit}) {
    //   axios.post('http://localhost:4000', {
    //     query: 
    //       `query {
    //           getLibrary {
    //             id
    //             data
    //             name
    //             val1
    //             val2
    //             link
    //           }
    //       }`
    // }).then(res => {
    //       let library = res.data.data.getLibrary
    //       // console.log(library)
    //       for (let j = 0; j < library.length; j++) {
    //         for (let i = 0; i < library[j].data.length; i++) {
    //           library[j].data[i] = parseInt(library[j].data[i])
    //         }
    //         library[j].val1 = parseInt(library[j].val1)
    //         library[j].val2 = parseInt(library[j].val2)
    //       }   
    // for(let o of this.library) {
      //   for(let e in o.data) {
      //     o.data[e] = parseInt(o.data[e])
      //   }
      //   o.val1 = parseInt(o.val1)
      //   o.val2 = parseInt(o.val2)
      // }
    //       commit('library', library)
    //     }
    //   )
      
    // }
  },
  getters: {
    library: state => Object.assign(state.library),
    report: state => Object.assign(state.report)
  }
})
