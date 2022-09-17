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
            component: require("../view/main/index.vue").default,
            meta: { title: "首页", requiresAuth: false, keepAlive: true }
            // redirect: "/",
        },
        {
            name: "investReward",
            path: "/investReward",
            component: () => import(/* webpackChunkName: "investReward" */ "../view/investReward/index.vue"),
            meta: { title: "投资有礼", requiresAuth: false, keepAlive: true }
        },
        {
            name: "investRewardAdd",
            path: "/investReward/add",
            component: () => import(/* webpackChunkName: "investReward" */ "../view/investReward/add.vue"),
            meta: { title: "投资有礼新增", requiresAuth: false, keepAlive: false }
        }
    ]
});
