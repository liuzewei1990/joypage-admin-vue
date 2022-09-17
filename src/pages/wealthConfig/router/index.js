import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
    // mode: 'history',
    scrollBehavior: () => ({ y: 0 }),

    routes: [
        // 财富管理  登录页
        {
            name: "wealthlogonList",
            path: "/wealth/logonList",
            component: require("../view/wealth/logon/logonList").default,
            meta: { title: "财富-登录页配置", requiresAuth: false, keepAlive: false }
        },
        {
            name: "wealthAddlogon",
            path: "/wealth/addlogon",
            component: require("../view/wealth/logon/addlogon").default,
            meta: { title: "新增", requiresAuth: false, keepAlive: false }
        },
        // 财富管理  二级菜单
        {
            name: "wealthsecondList",
            path: "/wealth/secondList",
            component: require("../view/wealth/second/secondList").default,
            meta: { title: "财富-二级菜单管理", requiresAuth: false, keepAlive: false }
        },
        {
            name: "wealthaddSecond",
            path: "/wealth/addSecond",
            component: require("../view/wealth/second/addSecond").default,
            meta: { title: "新增", requiresAuth: false, keepAlive: false }
        }
    ]
});
