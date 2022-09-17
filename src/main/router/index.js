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
            meta: { title: "比财后台管理系统", requiresAuth: true, keepAlive: true }
            // redirect: "/",
        },
        {
            name: "login",
            path: "/login",
            component: require("../view/login/index.vue").default,
            meta: { title: "用户登陆 - 比财后台管理系统", requiresAuth: false, keepAlive: true }
            // redirect: "/",
        },
        {
            name: "home",
            path: "/home",
            component: () => import(/* webpackChunkName: "home" */ "../view/home/index.vue"),
            meta: { title: "主页", requiresAuth: true, keepAlive: false }
        },
        {
            name: "navList",
            path: "/navList",
            component: () => import(/* webpackChunkName: "navList" */ "../view/navList/index.vue"),
            meta: { title: "系统导航", requiresAuth: true, keepAlive: false }
        }
    ]
});
