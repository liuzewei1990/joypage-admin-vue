import http from '@common/finsuit-http/index.js'
import config from '../config/config.index.js'

/**
 * API统一管理规范
 * @param {Obj} params  请求体参数
 * @param {Obj} head    请求头参数
 * @returns Promise
 */
// 上传图片
export const forUpload = (params = {}, head = {}) => http.omp.postFrom(config.baseUrlHost, `/finsuitFileUpload/forUpload`, params, head, false, true);
//  会员等级新增
export const createUserLv = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/UserLvManage/createUserLv`, params, head, false, true);
// 会员等级修改
export const updUserLv = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/UserLvManage/updUserLv`, params, head, false, true);
//  会员等级查询
export const queryUserLvList = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, `/UserLvManage/queryUserLvList`, params, head, false, true);