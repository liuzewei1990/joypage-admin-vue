import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    // mode: 'history',
    scrollBehavior: () => ({ y: 0 }),

    routes: [
      // 会员等级
      {
          name: 'memberLevelList',
          path: '/memberLevelList',
          component: require('../view/memberLevelList').default,
          meta: { title: '会员等级', requiresAuth: false, keepAlive: false },
      },
      {
        name: 'addMemberLevel',
        path: '/addMemberLevel',
        component: require('../view/addMemberLevel').default,
        meta: { title: '新增会员等级', requiresAuth: false, keepAlive: false },
    },
    ]
})
