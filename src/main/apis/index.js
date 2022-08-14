import http from "@common/finsuit-http/index.js"
import config from "../config/config.index.js"

/**
 * API统一管理规范
 * @param {Obj} params  私有域参数
 * @param {Obj} head    公共域参数
 * @returns Promise
 */

/* 获取菜单权限列表 */
export const getMenuList = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/fuisuitSys/v3.0/main", params, head, false, false)

/* 登陆接口 */
export const login = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/fuisuitSys/v3.0/login", params, head, false, false)

/* 退出接口 */
export const logout = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/fisec_sys/v3.0/logout", params, head, false, false)

/* 用户信息 */
export const setting = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/fuisuitSys/v3.0/setting", params, head, false, false)
