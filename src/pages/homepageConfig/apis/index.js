import http from '@common/finsuit-http/index.js'
import config from '../config/config.index.js'

/**
 * API统一管理规范
 * @param {Obj} params  请求体参数
 * @param {Obj} head    请求头参数
 * @returns Promise
 */
// 会员等级查询
export const queryParameter = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, `/ComprehensiveManage/queryUserGroupList`, params, head, false, true);

// 上传图片
export const forUpload = (params = {}, head = {}) => http.omp.postFrom(config.baseUrlHost, `/finsuitFileUpload/forUpload`, params, head, false, true);
// 首页 综合 列表
export const comprehensiveList = (params = {}, head = {}) => http.omp.post(config.baseUrlHost, `/ComprehensiveManage/queryComprehensiveList`, params, head, false, true);

// 新增
export const createComprehensive = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/ComprehensiveManage/createComprehensive`, params, head, false, true);
// 修改
export const updateComprehensive = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/ComprehensiveManage/updateComprehensive`, params, head, false, true);
// 删除
export const deleteComprehensive = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/ComprehensiveManage/deleteComprehensive`, params, head, false, true);
// 校验是否包含该排序值
export const isHaveSeqOrder = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/ComprehensiveManage/isHaveSeqOrder`, params, head, false, true);
// 产品下拉选项
export const queryPrdList = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/prdFloatRateManage/queryPrdList`, params, head, false, true);
// 根据广告内容类型id获得对应的广告内容/advert/
export const getContentByContentType = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, `/advert/getContentByContentType`, params, head, false, true);
// 综合详情页
export const queryComprehensive = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, `/ComprehensiveManage/queryComprehensive`, params, head, false, true);
// 机构 资讯模糊查询
export const CMgetContentByContentType = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, `/ComprehensiveManage/getContentByContentType`, params, head, false, true);








