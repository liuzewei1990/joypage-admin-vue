import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    // mode: 'history',
    scrollBehavior: () => ({ y: 0 }),

    routes: [
      // 广告类型管理
        {
            name: 'advertList',
            path: '/advertList',
            component: require('../view/advertTypeManage/advertList').default,
            meta: { title: '广告类型管理', requiresAuth: false, keepAlive: false },
            // redirect: "/",
        },
        {
          name: 'addAdvert',
          path: '/addAdvert',
          component: require('../view/advertTypeManage/addAdvert').default,
          meta: { title: '添加广告', requiresAuth: false, keepAlive: false },
          // redirect: "/",
        },
        {
          name: 'editAdvert',
          path: '/editAdvert',
          component: require('../view/advertTypeManage/editAdvert').default,
          meta: { title: '修改广告', requiresAuth: false, keepAlive: false },
          // redirect: "/",
        },
        // 广告位置管理
        {
          name: 'adverLocationtList',
          path: '/adverLocationtList',
          component: require('../view/advertLocationManage/adverLocationtList').default,
          meta: { title: '广告位置管理', requiresAuth: false, keepAlive: false },
          // redirect: "/",
        },
        {
          name: 'editAdverLocationt',
          path: '/editAdverLocationt',
          component: require('../view/advertLocationManage/editAdverLocationt').default,
          meta: { title: '修改广告位置', requiresAuth: false, keepAlive: false },
          // redirect: "/",
        },
        // 广告系列管理
        {
          name: 'advertSeriesList',
          path: '/advertSeriesList',
          component: require('../view/advertSeriesManage/advertSeriesList').default,
          meta: { title: '广告系列管理', requiresAuth: false, keepAlive: false },
          // redirect: "/",
        },
        // 券商活动H5落地页广告位置管理
        {
          name: 'brokersLocationList',
          path: '/brokersLocationList',
          component: require('../view/brokersLocationManage/brokersLocationList').default,
          meta: { title: '券商活动H5落地页--广告位置管理', requiresAuth: false, keepAlive: false },
          // redirect: "/",
        },
        //券商活动H5落地页广告位置管理--新增的子列表
        {
          name: 'brokersLocationListSub',
          path: '/brokersLocationListSub',
          component: require('../view/brokersLocationManage/brokersLocationListSub').default,
          meta: { title: '券商活动H5落地页--广告位置管理', requiresAuth: false, keepAlive: false },
          // redirect: "/",
        },
        // 券商活动H5落地页新增修改
        {
          name: 'brokersAdvertAdd',
          path: '/brokersAdvertAdd',
          component: require('../view/brokersLocationManage/brokersAdvertAdd').default,
          meta: { title: '广告配置新增投放', requiresAuth: false, keepAlive: false },
          // redirect: "/",
        },

    ]
})
