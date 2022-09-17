import http from "@common/finsuit-http/index.js";
import config from "../config/config.index.js";

/**
 * API统一管理规范
 * @param {Obj} params  请求体参数
 * @param {Obj} head    请求头参数
 * @returns Promise
 */
// 上传图片
export const forUpload = (params = {}, head = {}) => http.omp.postFrom(config.baseUrlHost, `/finsuitFileUpload/forUpload`, params, head, false, true);

// 消息列表
export const getActInfoList = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, `/finsuitPhone/v3.0/activityInfo/getActInfoList`, params, head, false, true);
// 获取银行存款数据
export const forFinsuitPrdIndexListSelect = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, `/finsuitPrdIndex/forFinsuitPrdIndexListSelect`, params, head, false, true);
// 纯债产品 货币基金 理财 3个一起
export const forFinsuitPrdIndexList = (params = {}, head = {}) => http.omp.post(config.baseUrlHost, `/finsuitPrdIndex/forFinsuitPrdIndexList`, params, head, false, true);
// /根据产品名称模糊获取产品列表
export const forFinsuitPrdIndexListGet = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, `/finsuitPrdIndex/forFinsuitPrdIndexList`, params, head, false, true);
// 活动list
export const getActivityList = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, `/finsuitPhone/v3.0/activityInfo/getActivityList`, params, head, false, true);
// 添加活动
export const addActInfo = (params = {}, head = {}) => http.omp.post(config.baseUrlHost, `/finsuitPhone/v3.0/activityInfo/addActInfo`, params, head, false, true);
// 上传表格
export const importActInfoByExcel = (params = {}, head = {}) => http.omp.postFrom(config.baseUrlHost, `/finsuitPhone/activityInfo/importActInfoByExcel`, params, head, false, true);
// 查看详情
export const getActInfoById = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, `/finsuitPhone/v3.0/activityInfo/getActInfoById`, params, head, false, true);
// 删除
export const revokeActInfoById = (params = {}, head = {}) => http.omp.post(config.baseUrlHost, `/finsuitPhone/v3.0/activityInfo/revokeActInfoById`, params, head, false, true);
