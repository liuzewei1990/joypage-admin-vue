import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    // mode: 'history',
    scrollBehavior: () => ({ y: 0 }),

    routes: [
      {
        name: 'shareList',
        path: '/shareList',
        component: require('../view/listIndex').default,
        meta: { title: '分享管理', requiresAuth: false, keepAlive: false },
        redirect: '/shareList/activeShareList',
        // 活动分享
        children: [
          {
            name: 'activeShareList',
            path: 'activeShareList',
            component: require('../view/activeShare/shareList').default,
          },
          {
            name: 'indexShareList',
            path: 'indexShareList',
            component: require('../view/indexShare/shareList').default,
          },
          {
            name: 'settingShareList',
            path: 'settingShareList',
            component: require('../view/settingShare/shareList').default,
          }
        ]
      },
      {
        name: 'addShare',
        path: '/addIndexShare',
        component: require('../view/indexShare/addShare').default,
        meta: { title: '首页分享', requiresAuth: false, keepAlive: false },
      },
      {
        name: 'addShare',
        path: '/addActiveShare',
        component: require('../view/activeShare/addShare').default,
        meta: { title: '活动分享', requiresAuth: false, keepAlive: false },
      },
      {
        name: 'addShare',
        path: '/addSettingShare',
        component: require('../view/settingShare/addShare').default,
        meta: { title: '设置分享', requiresAuth: false, keepAlive: false },
      },  
    ]
})
