import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
    // mode: 'history',
    scrollBehavior: () => ({ y: 0 }),

    routes: [
        // 监管沙盒  /   平台配置
        {
            name: "platformConfig",
            path: "/platformConfigList",
            component: require("../view/platformConfig/platformConfigList").default,
            meta: { title: "平台配置", requiresAuth: false, keepAlive: false }
        },
        {
            name: "addPlatformConfig",
            path: "/addPlatformConfig",
            component: require("../view/platformConfig/addPlatformConfig").default,
            meta: { title: "新增平台配置", requiresAuth: false, keepAlive: false }
        },
        {
            name: "bankList",
            path: "/bank/bankList",
            component: require("../view/userMarketMange/bank/bankList.vue").default,
            meta: { title: "用户营销管理-银行", requiresAuth: false, keepAlive: false }
        },
        {
            name: "addBank",
            path: "/bank/addBank",
            component: require("../view/userMarketMange/bank/addBank.vue").default,
            meta: { title: "新增银行配置", requiresAuth: false, keepAlive: false }
        },
        {
            name: "productList",
            path: "/product/productList",
            component: require("../view/userMarketMange/product/productList.vue").default,
            meta: { title: "用户营销管理-产品", requiresAuth: false, keepAlive: false }
        },
        {
            name: "addProduct",
            path: "/product/addProduct",
            component: require("../view/userMarketMange/product/addProduct.vue").default,
            meta: { title: "新增银行产品配置", requiresAuth: false, keepAlive: false }
        },
        {
            name: "outlinkBankList",
            path: "/sandboxExternalLink/bankList",
            component: require("../view/sandboxExternalLink/bank/bankList.vue").default,
            meta: { title: "外链管理-银行", requiresAuth: false, keepAlive: false }
        },
        {
            name: "outlinkBankAddBank",
            path: "/sandboxExternalLink/addBank",
            component: require("../view/sandboxExternalLink/bank/addBank.vue").default,
            meta: { title: "新增银行外链配置", requiresAuth: false, keepAlive: false }
        },
        {
            name: "outlinkProductList",
            path: "/sandboxExternalLink/productList",
            component: require("../view/sandboxExternalLink/product/productList.vue").default,
            meta: { title: "外链管理-产品", requiresAuth: false, keepAlive: false }
        },
        {
            name: "outlinkaddProduct",
            path: "/sandboxExternalLink/addProduct",
            component: require("../view/sandboxExternalLink/product/addProduct.vue").default,
            meta: { title: "新增产品外链配置", requiresAuth: false, keepAlive: false }
        },
        {
            name: "addBlackList",
            path: "/addBlackList",
            component: require("../view/blackList/addBlackList.vue").default,
            meta: { title: "新增手机号黑名单", requiresAuth: false, keepAlive: false }
        },
        {
            name: "blackList",
            path: "/blackList",
            component: require("../view/blackList/blackList.vue").default,
            meta: { title: "沙盒黑名单管理", requiresAuth: false, keepAlive: false }
        },
        {
            name: "addWhiteList",
            path: "/addWhiteList",
            component: require("../view/whiteList/addWhiteList.vue").default,
            meta: { title: "新增手机号黑名单", requiresAuth: false, keepAlive: false }
        },
        {
            name: "whiteList",
            path: "/whiteList",
            component: require("../view/whiteList/whiteList.vue").default,
            meta: { title: "沙盒黑名单管理", requiresAuth: false, keepAlive: false }
        }
    ]
});
