import http from '@common/finsuit-http/index.js'
import config from '../config/config.index.js'

/**
 * API统一管理规范
 * @param {Obj} params  私有域参数
 * @param {Obj} head    公共域参数
 * @returns Promise
 */

/**
 * 公共接口
 * 
 */

// 获取分享按钮
export const getShareBtn = (params, head) => http.post(config.baseUrlHost, config.baseUrlPath, "SYSTEM_SHARE", params, head, false, false)

// 获取微信分享签名
export const getWxSign = (params, head) => http.post(config.baseUrlHost, config.baseUrlPath, "GET_WEIXIN_SIGN", params, head, false, false)

// 获取产品详情入口
export const getProducdDetailUrl = (params, head) => http.post(config.baseUrlHost, config.baseUrlPath, "GET_RECOMMEND_PRD_LIST", params, head, false, false)

// 获取下载app帮助页面图片地址
export const getDowloadAppHelpData = (params, head) => http.post(config.baseUrlHost, config.baseUrlPath, "SINGINF_GUIDE_PAGE_PIC", params, head, false, false)

//-------------------------------------------------------------------------------------------------

/**
 * 系统管理接口
 */
//菜单管理
//查询列表：http://192.168.10.212:8080/fuisuitSys/v3.0/main
// export const getMenuManages = (params) => http.get(config.baseUrlHost, "/fuisuitMenuManagement/v3.0/forMenumgmt", params);
export const getMenuManages = (params,head) => http.omp.get(config.baseUrlHost, "/fuisuitMenuManagement/v3.0/forMenumgmt", params, head, false, false);
//新增保存
export const getAddSave = (params,head) => http.omp.get(config.baseUrlHost, "/fuisuitMenuManagement/v3.0/forAddMenu", params, head, false, false);
//编辑保存
export const getEditSave = (params,head) => http.omp.get(config.baseUrlHost, "/fuisuitMenuManagement/v3.0/forEditMenu", params, head, false, false);