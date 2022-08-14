import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    // mode: 'history',
    scrollBehavior: () => ({ y: 0 }),

    routes: [
        // {
        //     name: 'index',
        //     path: '/',
        //     component: require('../view/main').default,
        //     meta: { title: '产品管理', requiresAuth: false, keepAlive: true },
        //     // redirect: "/",
        // },
        {
            name: 'currencyManage',
            path: '/currency',
            component: require('../view/currencyManage').default,
            meta: { title: '配置管理-币种管理', requiresAuth: false, keepAlive: true },
            // redirect: "/",
        },
        {
            name: 'productHistoricalDataManage',
            path: '/productHistoricalData',
            component: require('../view/productHistoricalDataManage').default,
            meta: { title: '配置管理-产品历史数据', requiresAuth: false, keepAlive: true },
            // redirect: "/",
        },
        {
            name: 'productLabelManage',
            path: '/productLabel',
            component: require('../view/productLabelManage').default,
            meta: { title: '配置管理-产品状态标签管理', requiresAuth: false, keepAlive: true },
            // redirect: "/",
        },
        {
            name: 'productWithdrawalPrompt',
            path: '/productWithdrawalPrompt',
            component: require('../view/productWithdrawalPrompt').default,
            meta: { title: '配置管理-产品支取提示', requiresAuth: false, keepAlive: true },
            // redirect: "/",
        },
        {
            name: 'yuEBaoRevenueManage',
            path: '/yuEBaoRevenue',
            component: require('../view/yuEBaoRevenueManage').default,
            meta: { title: '配置管理-余额宝收益管理', requiresAuth: false, keepAlive: true },
            // redirect: "/",
        },
        // {
        //     name: "demo",
        //     path: "/demo",
        //     component: () => import(/* webpackChunkName: "demo" */ '../view/demo/index.vue'),
        //     meta: { title: 'this is demo', requiresAuth: false, keepAlive: false },
        // }
    ]
})
