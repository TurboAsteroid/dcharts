import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    index: {
      userData: []
    }
  },
  mutations: {
    indexUserData (state, data) {
      state.index.userData = data
    }
  },
  actions: {},
  getters: {
    indexUserData: state => state.index.userData
  }
})
