// 组装模块并导出 store 的文件
import Vuex from "vuex"
import Vue from "vue"
Vue.use(Vuex)

/**
 * 引入common中store作为共享store，勿动
 * finsuitStoreConfig:配置
 * finsuitStoreUserInfo：用户信息
 * finsuitStoreMenuList：菜单列表
 * finsuitStoreMenuTabs：tabs列表
 */
import finsuitStoreModules from "@common/finsuit-store/index.js"
import persistedstate from "@common/finsuit-store/cache.js"

/**
 * 引入模块私有store，按需要添加
 */
import main from "./modules/main.js"

/**
 * 导出
 */
export default new Vuex.Store({
  modules: { ...finsuitStoreModules, main },
  plugins: [persistedstate],
})
