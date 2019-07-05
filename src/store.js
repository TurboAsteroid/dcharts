import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    library: []
  },
  mutations: {
    library (state, data) {
      state.library = data
    }
  },
  actions: {},
  getters: {
    library: state => state.library
  }
})
