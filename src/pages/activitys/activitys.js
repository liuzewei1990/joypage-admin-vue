/* eslint-disable no-new */
import Vue from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import store from "./store/index.js";

/* 使用finsuit开发插件 */
import finsuit from "@common/finsuit-h5";
Vue.use(finsuit);

/* 注册配置文件 */
import config from "./config/config.index.js";
Vue.prototype["$Config"] = config;

/* 注册api接口 */
import * as api from "./apis/index.js";
Vue.prototype["$api"] = api;

/* 注册埋点api接口 */
import * as trackEvents from "./apis/track-events-api.js";
Vue.prototype["$trackEvents"] = trackEvents;

/* 验证器函数 */
import * as validator from "./utils/validator.js";
Vue.prototype["$validator"] = validator;

/* 通用select组件 */
import BcSelect from "@common/finsuit-components/BcSelect/index.vue";
Vue.component("BcSelect", BcSelect);

const app = new Vue({
    data() {
        return {
            // 用于新增或修改的路由，返回列表必要时刷新列表数据
            RefreshTableList: null
        };
    },
    router,
    store,
    components: { App },
    template: "<App/>"
});

app.$bootstrap();

//相当于 app.$mount("#app")
