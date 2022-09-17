import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
    // mode: 'history',
    scrollBehavior: () => ({ y: 0 }),

    routes: [
        {
            name: "index",
            path: "/",
            component: require("../view/main").default,
            meta: { title: "首页", requiresAuth: false, keepAlive: true }
            // redirect: "/",
        },
        {
            name: "addInvestItem",
            path: "/addInvestItem",
            component: require("../view/addInvestItem").default,
            meta: { title: "新增投资任务", requiresAuth: false, keepAlive: false }
            // redirect: "/",
        },
        {
            name: "addLoopItem",
            path: "/addLoopItem",
            component: require("../view/addLoopItem").default,
            meta: { title: "新增循环任务", requiresAuth: false, keepAlive: false }
            // redirect: "/",
        },
        {
            name: "addRoutineItem",
            path: "/addRoutineItem",
            component: require("../view/addRoutineItem").default,
            meta: { title: "新增常规任务", requiresAuth: false, keepAlive: false }
            // redirect: "/",
        }
        // {
        //     name: "addInvestItem",
        //     path: "/addInvestItem",
        //     component: () => import(/* webpackChunkName: "addInvestItem" */ '../view/addInvestItem/index.vue'),
        //     meta: { title: '新增投资任务', requiresAuth: false, keepAlive: false },
        // }
    ]
});
