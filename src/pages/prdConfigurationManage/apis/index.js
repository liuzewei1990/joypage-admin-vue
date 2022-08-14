import http from '@common/finsuit-http/index.js'
import config from '../config/config.index.js'

/**
 * API统一管理规范
 * @param {Obj} params  请求体参数
 * @param {Obj} head    请求头参数
 * @returns Promise
 */


/* 产品类别管理接口 */
//查询产品类别列表
export const forPrdTypeList = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/prdCategory/forPrdTypeList", params, head, false, true);
//产品主类型初始化数据
export const forPrdCategoryPage = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/prdCategory/forPrdCategoryPage", params, head, false, true);
//根据大类产品请求子类产品
export const getPrdTypeByParentId = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/prdCategory/getPrdTypeByParentId", params, head, false, true);
//修改类别列表
export const updatePrdType = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/prdCategory/updatePrdType", params, head, false, true);


/* 产品系列管理接口 */
//进入产品系列列表初始化参--下拉框
export const forPrdSeriesPage = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/prdSeries/forPrdSeriesPage", params, head, false, true);
//获取产品系列列表页
export const listPrdSeries = (params = {}, head = {}) => http.omp.post(config.baseUrlHost, "/prdSeries/listPrdSeries", params, head, false, true);
//新增保存
export const addPrdSeries = (params = {}, head = {}) => http.omp.post(config.baseUrlHost, "/prdSeries/addPrdSeries", params, head, false, true);
//修改保存get
export const updPrdSeries = (params = {}, head = {}) => http.omp.post(config.baseUrlHost, "/prdSeries/updPrdSeries", params, head, false, true);
//删除
export const delPrdSeries = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/prdSeries/delPrdSeries", params, head, false, true);

/* 产品管理--存款产品管理 */
//进入存款产品管理初始化参--下拉框
export const forDepositPage = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/prdDeposit/forDepositPage", params, head, false, true);
// 币种管理--根据产品区域请求币种  
export const getCurrencyAndOrg = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/currency/getCurrencyAndOrg", params, head, false, true);
//存款系列--根据产品小类和机构ID请求存款系列
export const getSeriesByOrgAndPrdType = (params = {}, head = {}) => http.omp.post(config.baseUrlHost, "/prdSeries/getSeriesByOrgAndPrdType", params, head, false, true);
//获取产品管理列表数据
export const forDepositList = (params = {}, head = {}) => http.omp.post(config.baseUrlHost, "/prdDeposit/forDepositList", params, head, false, true);
//新增保存
export const addDeposit = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/prdDeposit/addDeposit", params, head, false, true);
//修改保存
export const updateDeposit = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/prdDeposit/updateDeposit", params, head, false, true);
//单个删除
export const deleteDeposit = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/prdDeposit/deleteDeposit", params, head, false, true);
//克隆产品
export const cloneDeposit = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/prdDeposit/cloneDeposit", params, head, false, true);
//复制链接
export const getLongLink = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/prdDeposit/getLongLink", params, head, false, true);
//存款导入
export const importDeposit = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/prdDeposit/importDeposit", params, head, false, true);
//存款导出
export const exportDeposit = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/prdDeposit/exportDeposit", params, head, false, true);



