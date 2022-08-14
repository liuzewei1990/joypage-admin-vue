import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    // mode: 'history',
    scrollBehavior: () => ({ y: 0 }),

    routes: [
        {
            name: 'index',
            path: '/',
            component: require('../view/main').default,
            meta: { title: '首页', requiresAuth: false, keepAlive: true },
            // redirect: "/",
        },
        // {
        //     name: "edit",
        //     path: "/edit",
        //     component: () => import(/* webpackChunkName: "edit" */ '../view/edit/index.vue'),
        //     // component: require('../view/edit').default,
        //     meta: { title: '编辑', requiresAuth: false, keepAlive: false },
        // },
        // {
        //     name: 'error',
        //     path: '/error',
        //     component: ErrorPage,
        //     meta: { title: '错误' }
        // },
        // {
        //     path: '*',
        //     redirect: "/error",
        //     meta: { title: '404' }
        // },
    ]
})
