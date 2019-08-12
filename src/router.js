import Vue from 'vue';
import Router from 'vue-router';
import Index from './components/Index.vue';
import CertainParameter from './components/CertainParameter.vue';
import ReportConfigurator from './components/ReportConfigurator.vue';

import CertainParameterNew from './components/CertainParametrNew';
import Charts from './components/Charts';
import Librarys from './components/Librarys';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    // {
    //   path: '/',
    //   name: 'index',
    //   component: Index,
    //   meta: { nameRu: 'Библиотека' }
    // },
    {
      path: '/',
      name: 'librarys',
      component: Librarys,
      meta: { nameRu: 'Библиотеки' }
    },
    // {
    //   path: '/secondPage*',
    //   name: 'certainparameter',
    //   component: CertainParameter,
    //   meta: { nameRu: 'Отчёт' }
    // },
    {
      path: '/report*',
      name:'certainparametrnew',
      component: CertainParameterNew,
      meta: { nameRu: 'Отчёт'},
      children: [
        {
          path: ':id',
          components: {
            charts: Charts
          }
        }
      ]
    },
    {
      path: '/reportConfigurator',
      name: 'reportConfigurator',
      component: ReportConfigurator,
      meta: { nameRu: 'Создание отчёта' }
    }
  ]
})
