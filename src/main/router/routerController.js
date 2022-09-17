import router from "./index.js";
import store from "../store/index.js";

router.beforeEach((to, from, next) => {
    document.title = to.meta.title;
    if (to.path === "/login" && store.getters.isLogin) {
        next({ path: "/" });
        return;
    }

    if (to.matched.some((m) => m.meta.requiresAuth)) {
        //判断是否登录
        if (store.getters.isLogin) {
            next();
        } else {
            next({ path: "/login" });
        }
    } else {
        next();
    }
});

router.afterEach((to) => {});
