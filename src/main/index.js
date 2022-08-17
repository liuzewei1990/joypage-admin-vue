/* eslint-disable no-new */
import Vue from "vue"
import App from "./App.vue"
import router from "./router/index.js"
import store from "./store/index.js"

import finsuit from "@common/finsuit-h5"
Vue.use(finsuit)

/* 注册配置文件 */
import config from "./config/config.index.js"
Vue.prototype["$Config"] = config

/* 注册api接口 */
import * as api from "./apis/index.js"
Vue.prototype["$api"] = api

/* 注册埋点api接口 */
import * as trackEvents from "./apis/track-events-api.js"
Vue.prototype["$trackEvents"] = trackEvents

/* 注册组件抛出器 */
import ThrowComponent from "@common/finsuit-plugins/throwComponent/index.js"
Vue.prototype["$throwComponent"] = new ThrowComponent()

/* 登录退出 */
import signout from "./utils/logout.js"
Vue.prototype["$logout"] = signout

/* 导入路由拦截器 */
import "./router/routerController.js"

const app = new Vue({
  provide: { $bus: new Vue() },
  router,
  store,
  components: { App },
  template: "<App/>",
})

/* 注册iframePostMessageApi接口 */
import iframePostMessageApi from "./utils/iframePostMessageApi.js"
import iframeActiveApi from "./utils/iframeActiveApi.js"
// 监听postmessage
iframePostMessageApi.call(app)
iframeActiveApi.call(app)

// app.$bootstrap();
app.$mount("#app")
