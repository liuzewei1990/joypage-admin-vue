import http from "@common/finsuit-http/index.js"
import config from "../config/config.index.js"

/**
 * API统一管理规范
 * @param {Obj} params  请求体参数
 * @param {Obj} head    请求头参数
 * @returns Promise
 */

/* 接口描述 */
export const demo = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/fuisuitSys/v3.0/main", params, head, false, false)

export const getContentByContentType = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/homePageConfig/getContentByContentType", params, head, false, true)
