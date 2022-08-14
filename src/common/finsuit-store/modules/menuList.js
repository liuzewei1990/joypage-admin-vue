/**
 * 左侧菜单相关store模块
 */
export default {
  state: {
    // 当前菜单模块code
    menuListCode: 0,
    // menu菜单默认选中 index 对应组件的index属性
    defaultActive: 0,
    // 左侧菜单
    menuList: [],
  },
  getters: {
    // 是否收缩菜单
    menuCollapseStatus: (state) => {
      // 查看当前索引值是否有自己菜单，决定是否收缩菜单
      let currActiveMenu = state.menuList[state.menuListCode]
      if (!currActiveMenu) return true

      currActiveMenu.attributes = currActiveMenu.attributes || {}

      if (currActiveMenu.attributes.url && currActiveMenu.children.length === 0) {
        return true
      } else {
        return false
      }
    },
  },
  mutations: {
    ["SET_MENU_LIST"](state, menuList) {
      state.menuList = menuList
    },

    ["SET_MENU_CODE"](state, index) {
      state.menuListCode = index
    },
  },
  actions: {
    addMenu({ commit, dispatch, state, rootState }, menuItem = {}) {
      menuItem.children = menuItem.children || []
      menuItem.attributes = menuItem.attributes || {}
      state.menuList.push(menuItem)
    },
  },
}
