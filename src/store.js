import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    library: [],
    report: []
  },
  mutations: {
    library (state, data) {
      state.library = data
    },
    report (state, data) {
      state.report = data
    }
  },
  actions: {},
  getters: {
    library: state => Object.assign(state.library),
    report: state => Object.assign(state.report)
  }
})
