import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import 'material-design-icons-iconfont'
import 'roboto-fontface'
import 'vuetify/dist/vuetify.min.css'
import Vuetify from 'vuetify'

Vue.use(Vuetify)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
