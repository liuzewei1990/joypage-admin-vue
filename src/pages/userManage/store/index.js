// 组装模块并导出 store 的文件
import Vuex from 'vuex'
import Vue from 'vue'
import finsuitStoreModules from '@common/finsuit-store/index.js'
import persistedstate from "@common/finsuit-store/cache.js"

Vue.use(Vuex);

export default new Vuex.Store({
    modules: finsuitStoreModules,
    plugins: [persistedstate]
});