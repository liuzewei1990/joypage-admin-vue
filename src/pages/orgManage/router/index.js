import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    // mode: 'history',
    scrollBehavior: () => ({ y: 0 }),

    routes: [
        {
            name: 'bankDynamic',
            path: '/bankDynamic',
            component: require('../view/bankManage/bankDynamic').default,
            meta: { title: '银行动态管理', requiresAuth: false, keepAlive: true },
            // redirect: "/",
        },
        {
            name: 'commercialBank',
            path: '/commercialBank',
            component: require('../view/bankManage/commercialBank').default,
            meta: { title: '银行管理', requiresAuth: false, keepAlive: true },
            // redirect: "/",
        },
        {
            name: 'bindingCard',
            path: '/bindingCard',
            component: require('../view/bankManage/bindingCard').default,
            meta: { title: '绑定卡管理', requiresAuth: false, keepAlive: true },
            // redirect: "/",
        },
        {
            name: 'directBank',
            path: '/directBank',
            component: require('../view/bankManage/directBank').default,
            meta: { title: '直销银行管理', requiresAuth: false, keepAlive: true },
            // redirect: "/",
        },
        {
            name: 'maintenanceTime',
            path: '/maintenanceTime',
            component: require('../view/bankManage/maintenanceTime').default,
            meta: { title: '维护时间管理', requiresAuth: false, keepAlive: true },
            // redirect: "/",
        },
        {
            name: 'fundCompany',
            path: '/fundCompany',
            component: require('../view/fundCompany').default,
            meta: { title: '基金公司管理', requiresAuth: false, keepAlive: true },
            // redirect: "/",
        },
        {
            name: 'securitiesCompany',
            path: '/securitiesCompany',
            component: require('../view/securitiesCompany').default,
            meta: { title: '证券公司管理', requiresAuth: false, keepAlive: true },
            // redirect: "/",
        },
        {
            name: 'orgDisplayConfig',
            path: '/orgDisplayConfig',
            component: require('../view/orgDisplayConfig').default,
            meta: { title: '机构展示配置', requiresAuth: false, keepAlive: true },
            // redirect: "/",
        },
        {
            name: 'orgConfigPage',
            path: '/orgConfigPage',
            component: require('../view/orgConfigPage').default,
            meta: { title: '机构展示修改', requiresAuth: false, keepAlive: true },
            // redirect: "/",
        },
    ]
})
