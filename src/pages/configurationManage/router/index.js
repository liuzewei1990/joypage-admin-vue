/*
 * @Author: your name
 * @Date: 2021-05-18 11:01:25
 * @LastEditTime: 2021-07-16 17:03:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \finsuit-admin-joypage\src\pages\configurationManage\router\index.js
 */
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
            name: "HomePageTag",
            path: "/",
            component: require("../view/public/homePageTag").default,
            meta: { title: "配置管理-公共模块-首页标签筛选", requiresAuth: false, keepAlive: true }
            // redirect: "/",
        },
        {
            name: "Unlogin",
            path: "/unlogin",
            component: require("../view/homepageConfig/unlogin").default,
            meta: { title: "配置管理-首页配置-未登陆", requiresAuth: false, keepAlive: true }
            // redirect: "/",
        },
        {
            name: "EarningsUpgrades",
            path: "/earningsUpgrades",
            component: require("../view/hpFinancialAccount/earningsUpgrades").default,
            meta: { title: "配置管理-普惠理财账户-收益升级配置", requiresAuth: false, keepAlive: true }
            // redirect: "/",
        },
        {
            name: "InvestmentAdvanced",
            path: "/investmentAdvanced",
            component: require("../view/hpFinancialAccount/investmentAdvanced").default,
            meta: { title: "配置管理-普惠理财账户-投资进阶配置", requiresAuth: false, keepAlive: true }
            // redirect: "/",
        },
        {
            name: "RecommendProducts",
            path: "/recommendProducts",
            component: require("../view/hpFinancialAccount/recommendProducts").default,
            meta: { title: "配置管理--普惠理财账-推荐产品", requiresAuth: false, keepAlive: true }
            // redirect: "/",
        },
        {
            name: "RecommendAdd",
            path: "/recommendAdd",
            component: require("../view/hpFinancialAccount/recommendAdd").default,
            meta: { title: "配置管理--普惠理财账-新增", requiresAuth: false, keepAlive: false }
            // redirect: "/",
        },
        {
            name: "ProductConfig",
            path: "/productConfig",
            component: require("../view/IntelligentInterest/productConfig").default,
            meta: { title: "配置管理-智能投顾页配置-产品配置", requiresAuth: false, keepAlive: true }
            // redirect: "/",
        },
        {
            name: "ModuleConfig",
            path: "/moduleConfig",
            component: require("../view/IntelligentInterest/moduleConfig").default,
            meta: { title: "配置管理--智能投顾页配置-模块配置", requiresAuth: false, keepAlive: true }
            // redirect: "/",
        }
    ]
});
