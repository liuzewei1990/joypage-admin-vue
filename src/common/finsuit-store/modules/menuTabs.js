/**
 * 右侧tab相关store模块
 */

export default {
  state: {
    // 当前显示的tabid, 默认home
    activeIndex2: 9999,
    // 所有打开的tab
    menuTabs: [],
  },

  mutations: {
    SET_TABS: (state, tabs) => {
      state.menuTabs = tabs
    },

    ADD_TAB: (state, tabObj) => {
      state.menuTabs.push(tabObj)
    },

    SWITCH_TAB: (state, tabId) => {
      state.activeIndex2 = tabId
    },
  },
  actions: {
    /**
     * 添加tab 接收tab对象
     */
    addTab({ commit, dispatch, state, rootState }, tabObj = {}) {
      if (!tabObj.id) {
        throw new Error("请指定Tab唯一id")
      }
      if (!tabObj.title) {
        throw new Error("addTab方法报错，请至少给个标题吧")
      }
      if (!tabObj.href) {
        throw new Error("无效的菜单链接")
      }
      let tabs = state.menuTabs
      // 没有则添加到menuTabs中
      if (!tabs.find((item) => item.id === tabObj.id)) commit("ADD_TAB", tabObj)
      dispatch("switchTab", tabObj)
    },

    /**
     * 关闭tab
     * tabId:要删除的tabId
     */
    removeTab({ commit, dispatch, state, rootState }, tabId) {
      let tabs = state.menuTabs
      if (tabs.length === 1) return

      if (tabId === state.activeIndex2) {
        let currTabIndex = state.menuTabs.findIndex((item) => item.id === tabId)
        let tabObj = state.menuTabs[--currTabIndex]
        dispatch("switchTab", tabObj)
      }
      commit(
        "SET_TABS",
        tabs.filter((item) => item.id !== tabId),
      )
    },

    /**
     * 关闭全部tab
     */
    removeAllTab({ commit, dispatch, state, rootState }) {
      let tabs = state.menuTabs
      let homeTab = state.menuTabs[0]
      commit(
        "SET_TABS",
        tabs.filter((item) => item.id === homeTab.id),
      )
      dispatch("switchTab", homeTab)
    },

    /**
     * 关闭其他tab 有bug ：当删除其他时 会出现重载当前iframe的问题
     */
    removeOutTab({ commit, dispatch, state, rootState }) {
      let tabs = state.menuTabs
      let homeTab = state.menuTabs[0]
      commit(
        "SET_TABS",
        tabs.filter((item) => item.id === homeTab.id || item.id === state.activeIndex2),
      )
    },

    /**
     * 切换tab
     * tabObj:要切换的tabObj
     */
    switchTab({ commit, dispatch, state, rootState }, tabObj) {
      let tabs = state.menuTabs
      if (!tabs.find((item) => item.id == tabObj.id)) {
        console.error("请确认tabId是否已经打开或存在！")
        return false
      }

      // 切换tab
      commit("SWITCH_TAB", tabObj.id)
      // 一级菜单跟随
      // commit("SET_MENU_CODE", tabObj.pid || rootState.finsuitStoreMenuList.menuListCode);
      commit("SET_MENU_CODE", tabObj.pid === undefined ? rootState.finsuitStoreMenuList.menuListCode : tabObj.pid)
    },
  },
}
