import http from '@common/finsuit-http/index.js'
import config from '../config/config.index.js'

/**
 * API统一管理规范
 * @param {Obj} params  请求体参数
 * @param {Obj} head    请求头参数
 * @returns Promise
 */

 /* 机构管理--公共接口 */
//查询银行名称
export const queryOrgNameByBankType = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/bankBackStageManage/queryOrgNameByBankType", params, head, false, true);
//查询机构银行下产品名称
export const queryPrdByOrgId = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/bankBackStageManage/queryPrdByOrgId", params, head, false, true);
//查询电子银行名称（直销银行名称）
export const queryDirectBankNameByBankType = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/bankBackStageManage/queryDirectBankNameByBankType", params, head, false, true);
//图片上传
export const forUpload = (params = {}, head = {}) => http.omp.postFrom(config.baseUrlHost, "/finsuitFileUpload/forUpload", params, head, false, true);
//查询省的接口
export const selProvince = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/welfareSendCoupon/selProvince", params, head, false, true);
//查询市的接口
// export const queryGeoCityByParentAdcode = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/finsuitMmarketingMemberExport/queryGeoCityByParentAdcode", params, head, false, true);
//查询银行（机构）所属类型和行情机构分类
export const queryTypeByKey = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/bankBackStageManage/queryTypeByKey", params, head, false, true);
//银行卡名称
//1、直接请求中台地址，会跨域
// export const queryBankCardName = (params = {}, head = {}) => http.omp.postParse(config.openApiBaseUrlHost, '/apis/admin/orgCards/queryAll' ,params, head, false, true);
//2、直接请求后台
export const queryBankCard = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "bankBackStageManage/queryBankCard", params, head, false, true);
//请求 隶属于比财公司 字段
export const configData = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/bankBackStageManage/configData", params, head, false, true);

//省市联动接口
export const getProvinceCity = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/provinceCity/getData", params, head, false, true);
//省市接口请求,mock数据
// export const getProvinceCityList = (params = {}, head = {}) => http.omp.postParse('http://easy-mock.liuup.com/mock/60bddb463613fa05c7da75ab/Provinces_and_cities', "/finsuit/finsuitPhone/deal", params, head, false, true);


/* 商业银行管理 */
//商业银行列表查询
export const queryCommercialBankList = (params = {}, head = {}) => http.omp.post(config.baseUrlHost, "/bankBackStageManage/queryCommercialBankList", params, head, false, true);
//商业银行创建-新增
export const createCommercialBank = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/bankBackStageManage/createCommercialBank", params, head, false, true);
//商业银行更新-修改
export const updateCommercialBank = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/bankBackStageManage/updateCommercialBank", params, head, false, true);
//商业银行删除
export const deleteCommercialBank = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/bankBackStageManage/deleteCommercialBank", params, head, false, true);


/* 银行动态管理 */
//银行动态列表查询
export const queryBankDynamicsList = (params = {}, head = {}) => http.omp.post(config.baseUrlHost, "/bankMaintainAndDynamics/queryBankDynamicsList", params, head, false, true);
//银行动态创建-新增
export const createBankDynamics = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/bankMaintainAndDynamics/createBankDynamics", params, head, false, true);
//银行动态更新-修改
export const updBankDynamics = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/bankMaintainAndDynamics/updBankDynamics", params, head, false, true);
//银行动态删除
export const delBankDynamics = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/bankMaintainAndDynamics/delBankDynamics", params, head, false, true);


/* 直销银行管理 */
//直销银行列表查询
export const queryOrgList = (params = {}, head = {}) => http.omp.post(config.baseUrlHost, "/bankBackStageManage/queryOrgList", params, head, false, true);
//直销银行创建-新增
export const createOrg = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/bankBackStageManage/createOrg", params, head, false, true);
//直销银行更新-修改
export const updateOrg = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/bankBackStageManage/updateOrg", params, head, false, true);
//直销银行删除
export const deleteOrg = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/bankBackStageManage/deleteOrg", params, head, false, true);
//直销银行-查看排序值是否重复
export const checkDuplicateSortNum = (params = {}, head = {}) => http.omp.post(config.baseUrlHost, "/bankBackStageManage/checkDuplicateSortNum", params, head, false, true);


/* 银行产品维护时间管理 */
//维护时间管理列表查询
export const queryBankProductsWeiList = (params = {}, head = {}) => http.omp.post(config.baseUrlHost, "/bankMaintainAndDynamics/queryBankProductsWeiList", params, head, false, true);
//维护时间管理创建-新增
export const createBankProductsWei = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/bankMaintainAndDynamics/createBankProductsWei", params, head, false, true);
//维护时间管理更新-修改
export const updBankProductsWei = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/bankMaintainAndDynamics/updBankProductsWei", params, head, false, true);
//维护时间管理删除
export const delBankProductsWei = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/bankMaintainAndDynamics/delBankProductsWei", params, head, false, true);


/* 电子账户绑定卡管理 */
//维护时间管理列表查询
export const queryElecAccountList = (params = {}, head = {}) => http.omp.post(config.baseUrlHost, "/bankBackStageManage/queryElecAccountList", params, head, false, true);
//维护时间管理创建-新增
export const createElecAccount = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/bankBackStageManage/createElecAccount", params, head, false, true);
//维护时间管理更新-修改
export const updateElecAccount = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/bankBackStageManage/updateElecAccount", params, head, false, true);
//维护时间管理删除
export const deleteElecAccount = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/bankBackStageManage/deleteElecAccount", params, head, false, true);
//批量删除
export const deleteElecAccountList = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/bankBackStageManage/deleteElecAccountList", params, head, false, true);


/* 基金公司管理 */
//基金公司管理列表查询
export const queryFundCompanyNames = (params = {}, head = {}) => http.omp.post(config.baseUrlHost, "/orgBackStageManage/queryFundCompanyNames", params, head, false, true);
//基金公司管理列表查询
export const queryFundCompanyList = (params = {}, head = {}) => http.omp.post(config.baseUrlHost, "/orgBackStageManage/queryFundCompanyList", params, head, false, true);
//基金公司管理创建-新增
export const createFundCompany = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/orgBackStageManage/createFundCompany", params, head, false, true);
//基金公司管理更新-修改
export const updFundCompany = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/orgBackStageManage/updFundCompany", params, head, false, true);
//基金公司管理删除
export const deleteFundCompany = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/orgBackStageManage/deleteFundCompany", params, head, false, true);



/* 证券公司管理 */
//证券公司管理列表查询
export const querySecuritiesNames = (params = {}, head = {}) => http.omp.post(config.baseUrlHost, "/orgBackStageManage/querySecuritiesNames", params, head, false, true);
//证券公司管理列表查询
export const querySecuritiesList = (params = {}, head = {}) => http.omp.post(config.baseUrlHost, "/orgBackStageManage/querySecuritiesList", params, head, false, true);
//证券公司管理创建-新增
export const createSecurities = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/orgBackStageManage/createSecurities", params, head, false, true);
//证券公司管理更新-修改
export const updSecurities = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/orgBackStageManage/updSecurities", params, head, false, true);
//证券公司管理删除
export const deleteSecurities = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/orgBackStageManage/deleteSecurities", params, head, false, true);

/* 机构管理 */
//机构展示配置
export const getData = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/cOrgCarefullyChosen/getData", params, head, false, true);
//机构下拉列表分页
export const selectData = (params = '', head = {}) => http.omp.get(config.baseUrlHost, "/cOrgCarefullyChosen/selectData", params, head, false, true);
//机构保存
export const orgSave = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/cOrgCarefullyChosen/save", params, head, false, true);
//机构删除
export const orgDelete = (params = '', head = {}) => http.omp.get(config.baseUrlHost, "/cOrgCarefullyChosen/delete", params, head, false, true);

//请求机构类型的树形结构
export const getOrgTypeList= (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "cOrgType/selectType?status=3", params, head, false, true);
//mock数据 
// export const getOrgTypeList= (params = {}, head = {}) => http.omp.get("http://easy-mock.liuup.com/mock/6184f0776016ce245cb3069d/orgTypeTree", "finsuit/list", params, head, false, true);
