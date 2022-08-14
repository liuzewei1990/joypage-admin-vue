/**
 * 用户信息相关store模块
 */

import Cookies from "js-cookie"
const TOKEN_KEY = "Finsuit-Token"
export default {
  state: {
    token: Cookies.get(TOKEN_KEY),
  },
  getters: {
    isLogin: (state) => {
      if (state.token) return true
      else return false
    },
  },
  mutations: {
    ["USER_TOKEN"](state, token) {
      state.token = token
    },
  },
  actions: {
    // 前端登陆
    login({ commit, dispatch, state, rootState }, token) {
      commit("USER_TOKEN", token)
      // 随浏览器关闭而失效
      Cookies.set(TOKEN_KEY, token)
    },

    // 前端退出
    logout({ commit, dispatch, state, rootState }) {
      commit("USER_TOKEN", "")
      Cookies.remove(TOKEN_KEY)
      window.location.reload()
    },
  },
}
