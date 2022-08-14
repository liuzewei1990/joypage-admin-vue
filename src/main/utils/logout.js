/**
 * 退出登录
 */
export default async function (options = {}) {
  if (options.showTip) {
    await this.$alert("当前登录已过期，请退出后重新登录系统。", "登录过期提示！", {
      showClose: false,
      confirmButtonText: "ok",
    })
  }

  this.$store.dispatch("logout")
}
