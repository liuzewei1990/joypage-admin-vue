import defer from "@/common/finsuit-h5/libs/defer.js"
import Queue from "@/common/finsuit-h5/libs/queue.js"
import Vue from "vue"
import MaskContainer from "./container.vue"

const queue = new Queue()
const map = new Map()

function getInstance(Component = {}, prototype = {}, el = document.createElement("div")) {
  const ComponentConstructor = Vue.extend(Component)
  ComponentConstructor.prototype.$store = prototype.$store || {}
  return new ComponentConstructor({ el })
}

function getMaskInstance(ContentComponent = {}, prototype = {}, keepAlive) {
  let app = map.get(ContentComponent)
  if (keepAlive === false || !app) {
    app = getInstance(MaskContainer)
    app._contentComponent = getInstance(ContentComponent, prototype)
    app.$el.querySelector(".container").appendChild(app._contentComponent.$el)
    app.$on("onHide", () => {
      app.$el.remove()
    })
    keepAlive && map.set(ContentComponent, app)
  }
  return app
}

export default function (ContentComponent = {}, keepAlive = true) {
  // 获取当前vue实例的store，注入到ContentComponent组件中
  let $store = this.$store
  let maskInstance = getMaskInstance(ContentComponent, { $store }, keepAlive)
  let contentInstance = maskInstance._contentComponent

  let task = () => {
    let { promise, resolve, reject } = defer()
    document.body.appendChild(maskInstance.$el)
    maskInstance.visible = true
    // 点击蒙层关闭或用户手动关闭或自动关闭，执行resolve回调
    maskInstance.$once("onHide", resolve)
    // 注入到组件中，按子组件逻辑关闭，执行resolve回调
    contentInstance.resolve = () => {
      maskInstance.visible = false
      resolve()
    }
    // 注入到组件中，按子组件逻辑关闭，执行reject回调
    contentInstance.reject = () => {
      maskInstance.visible = false
      reject()
    }
    return promise
  }

  // 手动打开
  contentInstance.throw = function () {
    // 加入任务队列
    return queue(task)
  }

  // 手动关闭
  contentInstance.close = function () {
    maskInstance.visible = false
  }
  return contentInstance
}
