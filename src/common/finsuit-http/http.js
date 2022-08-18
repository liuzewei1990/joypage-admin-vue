import axios from "axios"
import qs from "qs"
import Vue from "vue"
import Router from "vue-router"
Vue.use(Router)
const axiosFinsuit = axios.create()

/**
 * 版本注意问题：
 * 1、当前使用axios@0.18.0版本.
 * 2、目前最新版本axios@0.19.0不支持自定义配置参数，会导致isLoading和isGetCode无效,获取不到。
 */

//默认axios不发送cookie，需要全局设置以下项，允许跨域发送cookie。
axiosFinsuit.defaults.withCredentials = true

//全局请求拦截器
axiosFinsuit.interceptors.request.use(
  function (config) {
    if (config.isLoading) {
      // 显示loading...
    }

    return config
  },
  function (error) {
    return Promise.reject(error)
  },
)

//全局响应拦截器
axiosFinsuit.interceptors.response.use(
  function (response) {
    // 配置信息
    let config = response.config

    // 关闭loading...

    //如果HTTP状态码不正常直接return reject错误
    if (!(response.status === 200 || response.status === 201)) {
      return Promise.reject(new Error("HTTP状态码：" + response.status + "异常"))
    }

    // 校验数据格式 是否为json
    if (Object.prototype.toString.call(response.data) !== "[object Object]") {
      window.parent.exportApi.exitMessage()
      // window.parent.exportApi.message({ type: "error", message: "服务器异常" })
      return Promise.reject(new Error("response data not object"))
    }

    // 处理公共逻辑...待完善

    return response
  },
  function (error) {
    // 关闭loading...
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = "请求错误"
          break

        case 401:
          error.message = "未授权，请登录"
          break

        case 403:
          error.message = "拒绝访问"
          break

        case 404:
          error.message = "请求错误，未找到该资源"
          break

        case 408:
          error.message = "请求超时"
          break

        case 500:
          error.message = "服务器内部错误"
          break

        case 501:
          error.message = "服务未实现"
          break

        case 502:
          error.message = "网关错误"
          break

        case 503:
          error.message = "服务不可用"
          break

        case 504:
          error.message = "网关超时"
          break

        case 505:
          error.message = "HTTP版本不受支持"
          break

        default:
      }
      error.code = error.response.status
    } else if (error.code == "ECONNABORTED") {
      error.code = 601
      error.message = "请求超时,请重试"
    } else if (error.code == undefined) {
      error.code = 602
      error.message = "服务不可用"
    } else {
      error.code = 603
      error.message = "未知错误"
    }
    window.parent.exportApi.message({ type: "error", message: error.message })
    return Promise.reject(error)
  },
)

export { axiosFinsuit }
