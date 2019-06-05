import Vue from 'vue'
import Router from 'vue-router'
import Index from './components/Index.vue'
import SecondPage from './components/SecondPage.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/secondPage',
      name: 'secondPage',
      component: SecondPage
    }
  ]
})
