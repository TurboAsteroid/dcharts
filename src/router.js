import Vue from 'vue'
import Router from 'vue-router'
import Index from './components/Index.vue'
import CertainParameter from './components/CertainParameter.vue'
import ReportConfigurator from './components/ReportConfigurator.vue'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
      meta: { nameRu: 'Библиотека' }
    },
    {
      path: '/secondPage*',
      name: 'certainparameter',
      component: CertainParameter,
      meta: { nameRu: 'Отчёт' }
    },
    {
      path: '/reportConfigurator',
      name: 'reportConfigurator',
      component: ReportConfigurator,
      meta: { nameRu: 'Создание отчёта' }
    }
  ]
})
