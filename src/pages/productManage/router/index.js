import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

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
            name: "productCategory",
            path: "/productCategory",
            component: require("../view/productCategoryManage/productCategory").default,
            meta: { title: "产品类别管理", requiresAuth: false, keepAlive: true }
            // redirect: "/",
        },
        {
            name: "productSeries",
            path: "/productSeries",
            component: require("../view/productSeriesManage/productSeries").default,
            meta: { title: "产品系列管理", requiresAuth: false, keepAlive: true }
            // redirect: "/",
        },
        {
            name: "depositProduct",
            path: "/depositProduct",
            component: require("../view/productManage/depositProduct").default,
            meta: { title: "产品管理-存款产品管理", requiresAuth: false, keepAlive: true }
            // redirect: "/",
        },
        {
            name: "financialFund",
            path: "/financialFund",
            component: require("../view/productManage/financialFund").default,
            meta: { title: "产品管理-理财基金管理", requiresAuth: false, keepAlive: true }
            // redirect: "/",
        },
        {
            name: "financingProduct",
            path: "/financingProduct",
            component: require("../view/productManage/financingProduct").default,
            meta: { title: "产品管理-理财产品管理", requiresAuth: false, keepAlive: true }
            // redirect: "/",
        },
        {
            name: "platformRights",
            path: "/platformRights",
            component: require("../view/platformRightsConfigurationManage/platformRights").default,
            meta: { title: "产品管理-平台权益配置管理", requiresAuth: false, keepAlive: true }
            // redirect: "/",
        }
        // {
        //     name: 'platformRightsCopy',
        //     path: '/platformRightsCopy',
        //     component: require('../view/platformRightsConfigurationManage/platformRightsCopy').default,
        //     meta: { title: '产品管理-平台权益配置管理', requiresAuth: false, keepAlive: true },
        //     // redirect: "/",
        // },
    ]
});
