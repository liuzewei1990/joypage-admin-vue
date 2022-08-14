import qs from "qs"
// 全局通用请求器
import { axiosFinsuit } from "../http.js"
// omp拦截器
import ompInterceptors from "./interceptors-omp.js"
const omp = {}
export default omp

/**
 * POST请求 使用拦截器：ompInterceptors
 * @param {*} baseURL 基础url
 * @param {*} url path路径
 * @param {*} data 请求体数据
 * @param {*} headers 请求头
 * @param {*} isLoading 是否需要loading
 * @param {*} isGetCode 是否需要code
 */

omp.post = function (baseURL, url, data, headers, isLoading, isGetCode) {
  return axiosFinsuit({
    method: "post",
    url: url,
    baseURL: baseURL,
    data: qs.stringify(data),
    isLoading,
    isGetCode,
    timeout: 10000,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      "X-Requested-With": "XMLHttpRequest",
      ...headers,
    },
  }).then(ompInterceptors)
}

/**
 * GET请求 使用拦截器：ompInterceptors
 * @param {*} baseURL 基础url
 * @param {*} url path路径
 * @param {*} params 请求体数据
 * @param {*} headers 请求头
 * @param {*} isLoading 是否需要loading
 * @param {*} isGetCode 是否需要code
 */

omp.get = function (baseURL, url, params, headers, isLoading, isGetCode) {
  return axiosFinsuit({
    method: "GET",
    url: url,
    baseURL: baseURL,
    params: params,
    isLoading,
    isGetCode,
    timeout: 10000,
    headers: {
      // "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...headers,
    },
  }).then(ompInterceptors)
}

//data参数传json对象
omp.postParse = function (baseURL, url, data, headers, isLoading, isGetCode) {
  return axiosFinsuit({
    method: "post",
    url: url,
    baseURL: baseURL,
    data: data,
    isLoading,
    isGetCode,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...headers,
    },
  }).then(ompInterceptors)
}

//data参数传json对象
omp.postFrom = function (baseURL, url, data, headers, isLoading, isGetCode) {
  return axiosFinsuit({
    method: "post",
    url: url,
    baseURL: baseURL,
    data: data,
    isLoading,
    isGetCode,
    timeout: 10000,
    headers: {
      "Content-type": "multipart/form-data",
      "X-Requested-With": "XMLHttpRequest",
      ...headers,
    },
  }).then(ompInterceptors)
}

/**
 * POST请求 使用拦截器：ompInterceptors  urlencoded 数组stringfiy后用点
 * @param {*} baseURL 基础url
 * @param {*} url path路径
 * @param {*} data 请求体数据
 * @param {*} headers 请求头
 * @param {*} isLoading 是否需要loading
 * @param {*} isGetCode 是否需要code
 */

omp.postDots = function (baseURL, url, data, headers, isLoading, isGetCode) {
  return axiosFinsuit({
    method: "post",
    url: url,
    baseURL: baseURL,
    data: qs.stringify(data, { arrayFormat: "indices", allowDots: true }),
    isLoading,
    isGetCode,
    timeout: 10000,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      "X-Requested-With": "XMLHttpRequest",
      ...headers,
    },
  }).then(ompInterceptors)
}
