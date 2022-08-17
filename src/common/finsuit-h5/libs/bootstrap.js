/**
 * 页面挂载方法：用于页面挂载拦截使用
 */

import authorityErrorPage from "./authorityErrorPage.js"
export default function () {
  let locationUrl = location.pathname + location.hash
  locationUrl = locationUrl.split("?")[0]

  if (this.$store.getters.isLogin && checkAuthorityUrlByMenuList(locationUrl, this.$store.state.finsuitStoreMenuList.menuList)) {
    // 当主框架的tabs切换时，会调用子window的pageAppear方法，子window在派发事件到各个路由的监听者
    window.pageAppear = () => {
      this.$bus.$emit("pageAppear")
    }
    this.$mount("#app")
  } else {
    authorityErrorPage.$mount("#app")
  }
}

// 递归匹配当前访问的url是否在菜单权限列表中，判定是否有权访问该页面
function checkAuthorityUrlByMenuList(locationUrl, menuList) {
  // 开发环境跳过校验
  if (process.env.NODE_ENV === "development") return true
  let length = menuList.length
  let res = null
  for (let index = 0; index < length; index++) {
    const item = menuList[index]
    if (locationUrl === item.attributes.url) {
      res = item
      break
    } else if (item.children.length) {
      res = checkAuthorityUrlByMenuList(locationUrl, item.children)
      if (res) break
    }
  }
  return res
}
