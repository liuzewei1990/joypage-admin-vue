import http from "@common/finsuit-http/index.js"
import config from "../config/config.index.js"

/**
 * API统一管理规范
 * @param {Obj} params  请求体参数
 * @param {Obj} head    请求头参数
 * @returns Promise
 */

/**
 * 投资有礼活动
 * @param {*} params
 * @param {*} head
 * @returns
 */

// 查询
export const investRewardQueryList = (params = {}, head = {}) => http.act.post(config.baseUrlHost, "/investGifts/getInvestGifts", params, head, false, false)
// 修改活动状态
export const investRewardToStatus = (params = {}, head = {}) => http.act.post(config.baseUrlHost, "/investGifts/updInvestStatus", params, head, false, false)
// 删除单条
export const investRewardDeleteData = (params = {}, head = {}) => http.act.post(config.baseUrlHost, "/investGifts/delInvestGiftsInfo", params, head, false, false)
// 复制
export const investRewardCopyData = (params = {}, head = {}) => http.act.post(config.baseUrlHost, "/copy", params, head, false, false)
// 新增
export const investRewardAddData = (params = {}, head = {}) => http.act.post(config.baseUrlHost, "/investGifts/addInvestGifts", params, head, false, false)
// 发放奖励
export const investPostReward = (params = {}, head = {}) => http.act.post(config.baseUrlHost, "/investGifts/provideReward", params, head, false, false)

/**
 * 投资有礼活动
 * @param {*} params
 * @param {*} head
 * @returns
 */

// demo
export const demo = (params = {}, head = {}) => http.act.post(config.baseUrlHost, "/demo", params, head, false, false)

/**
 * 查询产品列表
 * @param {*} params orgId || 所有
 * @param {*} head
 * @returns
 */

export const getPrdListByOrgId = (params = {}, head = {}) => http.act.post(config.baseUrlHost, "/wealCoupon/getPrdListByOrgId", params, head, false, false)

/**
 * 查询机构列表
 * @param {*} params 无
 * @param {*} head
 * @returns
 */
export const getOrgList = (params = {}, head = {}) => http.act.post(config.baseUrlHost, "/investGifts/getOrgList", params, head, false, false)

// 根据类型查询权益
export const getWealBenefitByType = (params = {}, head = {}) => http.act.post(config.baseUrlHost, "/wealReward/getWealBenefitByType", params, head, false, false)
/* 奖励信息下拉 */
export const getRewardInfoList = (params = {}, head = {}) => http.act.post(config.baseUrlHost, "/actTeam/getRewardInfoList", params, head, false, false)
