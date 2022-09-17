import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
    // mode: 'history',
    scrollBehavior: () => ({ y: 0 }),

    routes: [
        {
            name: "miniManageList",
            path: "/miniManageList",
            component: require("../view/miniManage/miniManage/miniManageList").default,
            meta: { title: "小程序设置", requiresAuth: false, keepAlive: false }
            // redirect: "/",
        },
        {
            name: "miniConfigureManageList",
            path: "/miniConfigureManageList",
            component: require("../view/miniManage/miniConfigureManage/miniConfigureManageList").default,
            meta: { title: "小程序配置设置", requiresAuth: false, keepAlive: false }
            // redirect: "/",
        },
        {
            name: "DAUManageList",
            path: "/DAUManageList",
            component: require("../view/miniManage/DAUManage/DAUManageList").default,
            meta: { title: "日活限定管理", requiresAuth: false, keepAlive: false }
            // redirect: "/",
        }
    ]
});
