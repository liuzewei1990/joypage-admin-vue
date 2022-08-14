import http from '@common/finsuit-http/index.js'
import { sxl_interceptors } from '@common/finsuit-http/common.interceptors.js'
import config from '../config/config.index.js'

/**
 * API统一管理规范
 * @param {Obj} params  请求体参数
 * @param {Obj} head    请求头参数
 * @returns Promise
 */


/* 配置管理-公共模块-首页标签筛选接口 */
//获取所有标签
export const getAllLable = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/LableSelectController/getAllLable", params, head, false, true);
//功能开关
export const updSwitchStr = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "LableSelectController/updSwitchStr", params, head, false, true);
//获取列表页
export const queryLableSelectList = (params = {}, head = {}) => http.omp.post(config.baseUrlHost, "/LableSelectController/queryLableSelectList", params, head, false, true);
//新增保存
export const createLableSelect = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/LableSelectController/createLableSelect", params, head, false, true);
//修改保存
export const updLableSelect = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/LableSelectController/updLableSelect", params, head, false, true);
//删除
export const deleteLableSelect = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/LableSelectController/deleteLableSelect", params, head, false, true);


/* 配置管理-首页配置-未登陆 */
//获取配置开关
export const getSwitch = (params = '', head = {}) => http.omp.get(config.baseUrlHost, "/homePageConfig/getSwitch", params, head, false, true);
//修改配置开关
export const updateSwitch = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/homePageConfig/updateSwitch", params, head, false, true);
//页面初始化
export const forConfigPage = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/homePageConfig/forConfigPage", params, head, false, true);
//获取配置详情--查看单条数据接口
export const configDetail = (params = '', head = {}) => http.omp.get(config.baseUrlHost, "/homePageConfig/configDetail/" + params, '', head, false, true);
//获取配置列表
export const getConfigList = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/homePageConfig/configList", params, head, false, true);
//新增保存
export const addConfig = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/homePageConfig/addConfig", params, head, false, true);
//修改保存
export const updateConfig = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/homePageConfig/updateConfig", params, head, false, true);
//删除
export const delConfig = (params = '', head = {}) => http.omp.get(config.baseUrlHost, "/homePageConfig/delConfig/" + params, '', head, false, true);
//图片上传
export const forUpload = (params = {}, head = {}) => http.omp.postFrom(config.baseUrlHost, "/finsuitFileUpload/forUpload", params, head, false, true);
//根据内容类型获得内容
export const getContentByContentType = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/homePageConfig/getContentByContentType", params, head, false, true);


/* 配置管理-普惠理财账户 */
// 查询产品机构类型
export const getSelectData = (params = '', head = {}) => http.omp.postParse(config.baseUrlHost, "/cInclusiveAdvInvestment/selectData", params, head, false, true);

// 1、收益升级
//获取收益列表数据--查询接口
export const getEarningsSelect = (params = '', head = {}) => http.omp.postParse(config.baseUrlHost, "/cInclusiveAccountProfit/select", params, head, false, true).then(sxl_interceptors);
//新增或者修改
export const updateEarningsSave = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/cInclusiveAccountProfit/save", params, head, false, true).then(sxl_interceptors);
//删除
export const getEarningsDelete = (params = '', head = {}) => http.omp.postParse(config.baseUrlHost, "/cInclusiveAccountProfit/delete", params, head, false, true).then(sxl_interceptors);
//导入
export const getEarningsImportFile = (params = {}, head = {}) => http.omp.postFrom(config.baseUrlHost, "/cInclusiveAccountProfit/importFile", params, head, false, true).then(sxl_interceptors);
//导出直接在页面请求地址


/* 2、普惠账户-投资进阶 */

// 表格数据
export const getInvestmentDataList = (params = '', head = {}) => http.omp.postParse(config.baseUrlHost, "/cInclusiveAdvInvestment/select", params, head, false, true).then(sxl_interceptors);
export const getCommmonSelectList = (params = '', head = {}) => http.omp.postParse(config.baseUrlHost, "/cInclusiveAdvInvestment/selectData", params, head, false, true).then(sxl_interceptors);
export const getOrgTypeInfo = (params = '', head = {}) => http.omp.postParse(config.baseUrlHost, "/cInclusiveAdvInvestment/product/id", params, head, false, true).then(sxl_interceptors);
export const investSubmitFormAddSave = (params = '', head = {}) => http.omp.postParse(config.baseUrlHost, "/cInclusiveAdvInvestment/save", params, head, false, true).then(sxl_interceptors);
export const investDelete = (params = '', head = {}) => http.omp.postParse(config.baseUrlHost, "/cInclusiveAdvInvestment/delete", params, head, false, true).then(sxl_interceptors);
export const investImportFile = (params = '', head = {}) => http.omp.postFrom(config.baseUrlHost, "/cInclusiveAdvInvestment/importFile", params, head, false, true).then(sxl_interceptors);


/* 3、普惠账户-推荐产品 */
//表格列表数据
export const getRecommendedList = (params = '', head = {}) => http.omp.postParse(config.baseUrlHost, "/recommendProducts/select", params, head, false, true).then(sxl_interceptors);
//新增和修改
export const getRecommendedSave = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/recommendProducts/save", params, head, false, true);
//可见用户和选择类型
export const getAvailableUser = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/recommendProducts/getAvailableUser", params, head, false, true);
//是否开启/单条数据
export const getUpdateState = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/recommendProducts/updateState", params, head, false, true).then(sxl_interceptors);
//删除
export const getRecommendedDelete = (params = '', head = {}) => http.omp.postParse(config.baseUrlHost, "/recommendProducts/delete", params, head, false, true).then(sxl_interceptors);
//获取机构
export const selectOrgData = (params = '', head = {}) => http.omp.post(config.baseUrlHost, "/recommendProducts/selectOrgData", params, head, false, true).then(sxl_interceptors);
//获取产品
export const selectProductData = (params = '', head = {}) => http.omp.get(config.baseUrlHost, "/recommendProducts/product", params, head, false, true).then(sxl_interceptors);
//回显数据
export const queryById = (params = '', head = {}) => http.omp.post(config.baseUrlHost, "/recommendProducts/queryById", params, head, false, true).then(sxl_interceptors);
//验证排序
export const createRecommendProducts = (params = '', head = {}) => http.omp.post(config.baseUrlHost, "/recommendProducts/createRecommendProducts", params, head, false, true).then(sxl_interceptors);
//投放渠道
// export const appFlag = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/prdFloatRateManage/queryParameter", params, head, false, true);

/* 智能投顾-模块配置*/
//获取收益列表数据--查询接口
export const getModuleListData = (params = '', head = {}) => http.omp.get(config.baseUrlHost, "/cSmartInvsetModular/getlist", params, head, false, false);
//新增或者修改
export const updateModuleSave = (params = {}, head = {}) => http.omp.post(config.baseUrlHost, "/cSmartInvsetModular/save", params, head, false, true);
//删除
export const getModuleDelete = (params = '', head = {}) => http.omp.get(config.baseUrlHost, "/cSmartInvsetModular/delete", params, head, false, true);

/* 智能投顾-产品配置*/
//获取收益列表数据--查询接口
export const getPrdListData = (params = '', head = {}) => http.omp.get(config.baseUrlHost, "/cSmartInvestPrd/getlist", params, head, false, false);
//新增或者修改
export const updatePrdSave = (params = {}, head = {}) => http.omp.post(config.baseUrlHost, "/cSmartInvestPrd/save", params, head, false, true);
//删除
export const getPrdDelete = (params = '', head = {}) => http.omp.get(config.baseUrlHost, "/cSmartInvestPrd/delete", params, head, false, true);

