/* eslint-disable no-new */
import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store/index"

// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor);

/* 使用finsuit开发插件 */
import finsuit from "@common/finsuit-h5"
Vue.use(finsuit);

/* 注册配置文件 */
import config from "./config/config.index.js"
Vue.prototype["$Config"] = config;


/* 注册api接口 */
import * as api from "./apis/index.js"
Vue.prototype["$api"] = api;


/* 注册埋点api接口 */
import * as trackEvents from "./apis/track-events-api.js"
Vue.prototype["$trackEvents"] = trackEvents;


const app = new Vue({
    router,
    store,
    components: { App },
    template: "<App/>"
});

app.$bootstrap();

//相当于 app.$mount("#app")