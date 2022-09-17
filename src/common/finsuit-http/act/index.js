import qs from "qs";
// 全局通用请求器
import { axiosFinsuit } from "../http.js";
// 活动组拦截器
import actInterceptors from "./interceptors-act.js";
const act = {};
export default act;

/**
 * POST请求 使用拦截器：ompInterceptors
 * @param {*} baseURL 基础url
 * @param {*} url path路径
 * @param {*} data 请求体数据
 * @param {*} headers 请求头
 * @param {*} isLoading 是否需要loading
 * @param {*} isGetCode 是否需要code
 */

act.post = function (baseURL, url, data, headers, isLoading, isGetCode) {
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
            // "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            "X-Requested-With": "XMLHttpRequest",
            ...headers
        }
    }).then(actInterceptors);
};

/**
 * GET请求 使用拦截器：ompInterceptors
 * @param {*} baseURL 基础url
 * @param {*} url path路径
 * @param {*} params 请求体数据
 * @param {*} headers 请求头
 * @param {*} isLoading 是否需要loading
 * @param {*} isGetCode 是否需要code
 */

act.get = function (baseURL, url, params, headers, isLoading, isGetCode) {
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
            ...headers
        }
    }).then(actInterceptors);
};
