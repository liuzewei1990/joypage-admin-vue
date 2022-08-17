import "@common/finsuit-assets/css/reset.css"
import "@common/finsuit-assets/less/common.less"
import "@common/finsuit-assets/icon/iconfont.css"

import modalHelper from "./libs/modalHelper.js"
import bootstrap from "./libs/bootstrap.js"
import bus from "./libs/bus.js"
import * as message from "./libs/message.js"

const finsuit = function (Vue, options = {}) {
  Vue.prototype["$modalHelper"] = modalHelper
  Vue.prototype["$bootstrap"] = bootstrap
  Vue.prototype["$bus"] = bus
  Vue.prototype["$msg"] = message
}

export default {
  install: finsuit,
}
