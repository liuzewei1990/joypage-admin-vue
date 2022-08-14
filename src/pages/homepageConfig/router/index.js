import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    // mode: 'history',
    scrollBehavior: () => ({ y: 0 }),

    routes: [
      // 首页配置 综合管理
        {
            name: 'compositeSetting',
            path: '/compositeSettingList',
            component: require('../view/compositeSetting/compositeSettingList').default,
            meta: { title: '综合管理', requiresAuth: false, keepAlive: false },
            // redirect: "/",
        },
        {
          name: 'AddCompositeSetting',
          path: '/AddCompositeSetting',
          component: require('../view/compositeSetting/AddCompositeSetting').default,
          meta: { title: '新增综合管理', requiresAuth: false, keepAlive: false },
          // redirect: "/",
      },
        
    ]
})
