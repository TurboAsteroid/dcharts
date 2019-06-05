import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    index: {
      userData: [],
      name: ''
    }
  },
  mutations: {
    indexUserData (state, data) {
      state.index.userData = data
    },
    indexUserDataName (state, name) {
      state.index.name = name
    }
  },
  actions: {},
  getters: {
    indexUserData: state => state.index.userData,
    indexUserDataName: state => state.index.name
  }
})
