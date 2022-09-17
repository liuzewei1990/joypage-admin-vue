import http from "@common/finsuit-http/index.js";
import config from "../config/config.index.js";

/**
 * API统一管理规范
 * @param {Obj} params  请求体参数
 * @param {Obj} head    请求头参数
 * @returns Promise
 */

/* 接口描述 */
/*****************平台设置****************** */
// 查询列表平台设置
export const query = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, `/cRsBankAppFlag/query`, params, head, false, true);
// 查询单个平台设置
export const selectOne = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, `/cRsBankAppFlag/selectOne`, params, head, false, true);
//  保存平台设置
export const save = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, `/cRsBankAppFlag/save`, params, head, false, true);
//  删除平台
export const deleteFlag = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, `/cRsBankAppFlag/delete`, params, head, false, true);
//  批量 删除平台
export const deleteBatch = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, `/cRsBankAppFlag/deleteBatch`, params, head, false, true);

// 查询机构银行
export const org = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/cRsBankAppFlag/query/org`, params, head, false, true);
/*********************用户营销   银行和产品配置********************** */
//  查询产品或银行用户条件
export const MCselectOne = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, `/cRsMarketingUserCondition/selectOne`, params, head, false, true);
//  保存或更新主表数据
export const BankPrdsave = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/cRsMarketingBankPrd/save`, params, head, false, true);
//  新增或修改银行配置
export const MCsave = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/cRsMarketingUserCondition/save`, params, head, false, true);
//  单个查询产品或银行的配置
export const BankPrdselectOne = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/cRsMarketingBankPrd/selectOne`, params, head, false, true);
//  分页查询产品和银行的配置  列表
export const BankPrdpageQuery = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/cRsMarketingBankPrd/pageQuery`, params, head, false, true);
//  查询产品带分页
export const prdindexall = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/prdindex/all`, params, head, false, true);
//  删除银行或产品配置
export const BankPrddelete = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/cRsMarketingBankPrd/delete`, params, head, false, true);
//  批量删除银行或产品配置
export const BankPrddeleteBatch = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/cRsMarketingBankPrd/deleteBatch`, params, head, false, true);
// 银行机构查询是否存在
export const BankPrdcheckExist = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/cRsMarketingBankPrd/checkExist`, params, head, false, true);
// 查询广告位、活动和内容
export const selectGet = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, `/select/get`, params, head, false, true);
//  查询产品无分页 根据银行查银行产品
export const bankPrd = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/prdindex/bankPrd`, params, head, false, true);
/****************************外链 银行和产品配置******************************************* */
// 删除银行或产品的配置
export const ExternalLinkDelete = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/cRsExternalLinkBankPrd/delete`, params, head, false, true);
// 分页查询银行或产品的配置
export const ExternalLinkBankPrdpageQuery = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/cRsExternalLinkBankPrd/pageQuery`, params, head, false, true);
//  保存银行或产品的配置
export const ExternalLinkBankPrdsave = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/cRsExternalLinkBankPrd/save`, params, head, false, true);
// ID查询银行或产品配置
export const ExternalLinkBankPrdselectOne = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/cRsExternalLinkBankPrd/selectOne`, params, head, false, true);
//  批量删除银行或产品配置
export const ExternalLinkBankPrddeleteBatch = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/cRsExternalLinkBankPrd/deleteBatch`, params, head, false, true);
//  新增或修改条件的配置
export const ExternalLinkMCsave = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/cRsExternalLinkUserCondition/save`, params, head, false, true);
/*******************************黑名单***************************** */
// 检验黑名单手机号
export const Blacklistcheck = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/cRsBlacklist/check`, params, head, false, true);
// 保存数据
export const Blacklistsave = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/cRsBlacklist/save`, params, head, false, true);
// 单个黑名单查询
export const BlacklistselectOne = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/cRsBlacklist/selectOne`, params, head, false, true);
// 分页查询数据
export const BlacklistpageQuery = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/cRsBlacklist/pageQuery`, params, head, false, true);
// 批量删除黑名单
export const BlacklistDelete = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/cRsBlacklist/delete`, params, head, false, true);
/*******************************白盒****************************** */
// 检验白名单手机号
export const Whitelistcheck = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/cRsWhitelist/check`, params, head, false, true);
// 保存数据
export const Whitelistsave = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/cRsWhitelist/save`, params, head, false, true);
// 单个白名单查询
export const WhitelistselectOne = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/cRsWhitelist/selectOne`, params, head, false, true);
//  分页查询数据
export const WhitelistpageQuery = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/cRsWhitelist/pageQuery`, params, head, false, true);
// 批量删除白名单
export const WhitelistDelete = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/cRsWhitelist/delete`, params, head, false, true);
