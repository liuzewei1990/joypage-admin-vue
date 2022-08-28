import "@common/finsuit-assets/css/reset.css"
import "@common/finsuit-assets/less/common.less"
import "@common/finsuit-assets/icon/iconfont.css"

import modalHelper from "./libs/modalHelper.js"
import bootstrap from "./libs/bootstrap.js"
import bus from "./libs/bus.js"
import * as message from "./libs/message.js"
import newComponent from "../finsuit-plugins/newComponent/index.js"

const finsuit = function (Vue, options = {}) {
  Vue.prototype["$modalHelper"] = modalHelper
  Vue.prototype["$bootstrap"] = bootstrap
  Vue.prototype["$bus"] = bus
  Vue.prototype["$msg"] = message
  Vue.prototype["$newComponent"] = newComponent
}

export default {
  install: finsuit,
}
