import http from "@common/finsuit-http/index.js";
import config from "../config/config.index.js";

/**
 * API统一管理规范
 * @param {Obj} params  请求体参数
 * @param {Obj} head    请求头参数
 * @returns Promise
 */

//  分页列表页
export const addApplet = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/wechatApplet/addApplet", params, head, false, true);
// 微信小程序列表页
export const forAppletPageList = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/wechatApplet/forAppletPageList", params, head, false, true);
// : 删除小程序
export const delApplet = (params = {}, data = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/wechatApplet/delApplet/${data.id}`, params, head, false, true);
// 修改微信小程序
export const updateApplet = (params = {}, data = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/wechatApplet/updateApplet`, params, head, false, true);
// 上传图片
export const forUpload = (params = {}, head = {}) => http.omp.postFrom(config.baseUrlHost, `/finsuitFileUpload/forUpload`, params, head, false, true);
// 获取所有小程序数据
export const getAppletList = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, `/wechatApplet/getAppletList`, params, head, false, true);
// 小程序日活分页列表
export const forDayLivePageList = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/wechatApplet/forDayLivePageList`, params, head, false, true);
// 小程序日活列表页初始化参数
export const forDayLivePage = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, `/wechatApplet/forDayLivePage`, params, head, false, true);
//  新增或修改日活
export const addOrUpdateDayLive = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/wechatApplet/addOrUpdateDayLive`, params, head, false, true);
// 单个修改日活上限
export const updateUpperLimitSingle = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/wechatApplet/updateUpperLimitSingle`, params, head, false, true);
// 批量修改日活上限
export const updateUpperLimitBatch = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/wechatApplet/updateUpperLimitBatch`, params, head, false, true);
