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
        }
        // {
        //     name: "demo",
        //     path: "/demo",
        //     component: () => import(/* webpackChunkName: "demo" */ '../view/demo/index.vue'),
        //     meta: { title: 'this is demo', requiresAuth: false, keepAlive: false },
        // }
    ]
});
