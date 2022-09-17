import http from "@common/finsuit-http/index.js";
import config from "../config/config.index.js";

/**
 * API统一管理规范
 * @param {Obj} params  请求体参数
 * @param {Obj} head    请求头参数
 * @returns Promise
 */

/* 上传图片 */
export const forUpload = (params = {}, head = {}) => http.omp.postFrom(config.baseUrlHost, "/finsuitFileUpload/forUpload", params, head, false, true);

/* 产品类别管理接口 */
//查询产品类别列表
export const forPrdTypeList = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/prdCategory/forPrdTypeList", params, head, false, true);
//产品主类型初始化数据
export const forPrdCategoryPage = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/prdCategory/forPrdCategoryPage", params, head, false, true);
//根据大类产品请求子类产品
export const getPrdTypeByParentId = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/prdCategory/getPrdTypeByParentId", params, head, false, true);
//修改类别列表
export const updatePrdType = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/prdCategory/updatePrdType", params, head, false, true);
//通过产品大类，产品小类型请求类别的利率名称
export const getPrdTypeByTypeCode = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/prdCategory/getPrdTypeByTypeCode", params, head, false, true);
//产品大类 启用or 修改别名
export const updateStatusApi = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/prdCategory/updateStatus", params, head, false, true);
//产品大类 列表查询删除状态
export const deleteStatusApi = (params = "", head = {}) => http.omp.get(config.baseUrlHost, "/prdCategory/selectCount", params, head, false, true);
//产品大类 列表删除
export const deleteApi = (params = "", head = {}) => http.omp.get(config.baseUrlHost, "/prdCategory/delete", params, head, false, true);

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
//根据产品大类编码和产品系列id获得产品系列下的--利率名称，上下架方式
export const getPrdSeriesById = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/prdSeries/getPrdSeriesById", params, head, false, true);

/* 产品管理--存款产品管理、理财产品、理财基金共用接口 */
// 币种管理--根据产品区域请求币种
export const getCurrencyAndOrg = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/currency/getCurrencyAndOrg", params, head, false, true);
//存款系列--根据产品小类和机构ID请求存款系列
export const getSeriesByPrdType = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/prdSeries/getSeriesByPrdType", params, head, false, true);

/* 产品管理--存款产品管理 */
//进入存款产品管理初始化参--下拉框
export const forDepositPage = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/prdDeposit/forDepositPage", params, head, false, true);
//获取产品管理列表数据
export const forDepositList = (params = {}, head = {}) => http.omp.post(config.baseUrlHost, "/prdDeposit/forDepositList", params, head, false, true);
//新增保存
export const addDeposit = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/prdDeposit/addDeposit", params, head, false, true);
//修改保存
export const updateDeposit = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/prdDeposit/updateDeposit", params, head, false, true);
//单个删除
export const deleteDeposit = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/prdDeposit/deleteDeposit", params, head, false, true);
//克隆产品
export const cloneDeposit = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/prdDeposit/cloneDeposit", params, head, false, true);
//复制链接
export const getLongLink = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/prdDeposit/getLongLink", params, head, false, true);
//存款导入
export const importDeposit = (params = {}, head = {}) => http.omp.postFrom(config.baseUrlHost, "/prdDeposit/importDeposit", params, head, false, true);
//存款导出
export const exportDeposit = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/prdDeposit/exportDeposit", params, head, false, true);

/* 产品管理--理财产品管理 */
//进入存款产品管理初始化参--下拉框
export const forFinancePage = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/prdFinance/forFinancePage", params, head, false, true);
//获取产品管理列表数据
export const forFinanceList = (params = {}, head = {}) => http.omp.post(config.baseUrlHost, "/prdFinance/forFinanceList", params, head, false, true);
//新增保存
export const addFinance = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/prdFinance/addFinance", params, head, false, true);
//修改保存
export const updateFinance = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/prdFinance/updateFinance", params, head, false, true);
//单个删除
export const deleteFinance = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/prdFinance/deleteFinance", params, head, false, true);
//克隆产品
export const cloneFinance = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/prdFinance/cloneFinance", params, head, false, true);
//复制链接
export const getLongLinkFinance = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/prdFinance/getLongLink", params, head, false, true);
//存款导入理财产品--没有接口
export const importFinance = (params = {}, head = {}) => http.omp.postFrom(config.baseUrlHost, "/prdFinance/importFinance", params, head, false, true);
//存款导出理财产品
export const exportFinance = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/prdFinance/exportFinance", params, head, false, true);
//存款导入保险理财
export const importInsuranceFina = (params = {}, head = {}) => http.omp.postFrom(config.baseUrlHost, "/prdFinance/importInsuranceFina", params, head, false, true);
//存款导出保险理财
export const exportInsuranceFina = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/prdFinance/exportInsuranceFina", params, head, false, true);
//存款导入投融资产品
export const importInvestFina = (params = {}, head = {}) => http.omp.postFrom(config.baseUrlHost, "/prdFinance/importInvestFina", params, head, false, true);
//存款导出投融资产品
export const exportInvestFina = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/prdFinance/exportInvestFina", params, head, false, true);

/* 产品管理--基金产品管理 */
//进入存款产品管理初始化参--下拉框
export const forFundPage = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/prdFund/forFundPage", params, head, false, true);
//获取产品管理列表数据
export const forFundList = (params = {}, head = {}) => http.omp.post(config.baseUrlHost, "/prdFund/forFundList", params, head, false, true);
//新增保存
export const addFund = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/prdFund/addFund", params, head, false, true);
//修改保存
export const updateFund = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/prdFund/updateFund", params, head, false, true);
//单个删除
export const deleteFund = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/prdFund//deleteFund", params, head, false, true);
//克隆产品
export const cloneFund = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/prdFund/cloneFund", params, head, false, true);
//复制链接
export const getLongLinkFund = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/prdFund/getLongLink", params, head, false, true);
//导入纯债基金
export const importPureDebtFund = (params = {}, head = {}) => http.omp.postFrom(config.baseUrlHost, "/prdFund/importPureDebtFund", params, head, false, true);
//导出纯债基金
export const exportPureDebtFund = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/prdFund/exportPureDebtFund", params, head, false, true);
//存款导入货基产品
export const importExportFund = (params = {}, head = {}) => http.omp.postFrom(config.baseUrlHost, "/prdFund/importExportFund", params, head, false, true);
//存款导出货基产品
export const exportExportFund = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/prdFund/exportExportFund", params, head, false, true);

/* 产品管理--平台权益配置管理 */
//进入页面初始化下拉框
export const queryParameter = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/prdFloatRateManage/queryParameter", params, head, false, true);
//权益补贴对应产品下拉框
export const queryPrdList = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/prdFloatRateManage/queryPrdList", params, head, false, true);
//查询列表接口
export const queryPrdFloatRateList = (params = {}, head = {}) => http.omp.post(config.baseUrlHost, "/prdFloatRateManage/queryPrdFloatRateList", params, head, false, true);
//新增保存
export const createPrdFloatRate = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/prdFloatRateManage/createPrdFloatRate", params, head, false, true);
//修改保存
export const updPrdFloatRate = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/prdFloatRateManage/updPrdFloatRate", params, head, false, true);
//单个删除
export const deletePrdFloatRate = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/prdFloatRateManage/deletePrdFloatRate", params, head, false, true);
//异业渠道
export const getYiYeChannel = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "prdFloatRateManage/getYiYeChannel ", params, head, false, true);
