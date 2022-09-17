import http from "@common/finsuit-http/index.js";
import config from "../config/config.index.js";
import { sxl_interceptors } from "@common/finsuit-http/common.interceptors.js";

/**
 * API统一管理规范
 * @param {Obj} params  请求体参数
 * @param {Obj} head    请求头参数
 * @returns Promise
 */

// 广告系列管理 分页列表页
export const advSeriesPageList = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/advert/advSeriesPageList", params, head, false, true);
// 修改广告系列
export const updateAdvSeries = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/advert/updateAdvSeries", params, head, false, true);
// 新增广告系列
export const addAdvSeries = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/advert/addAdvSeries", params, head, false, true);
// 删除广告系列
export const delAdvSeries = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, `/advert/delAdvSeries`, params, head, false, true);

//广告列表页查询
export const advertPageList = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/advert/advertPageList", params, head, false, true);

// 根据广告内容类型id获得对应的广告内容/advert/
export const getContentByContentType = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, `/advert/getContentByContentType`, params, head, false, true);

// 初始化广告管理页面参数
export const forAdvertPage = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, `/advert/forAdvertPage`, params, head, false, true);

// 获得广告详情
export const getAdvDetail = (params = {}, id, head = {}) => http.omp.get(config.baseUrlHost, `/advert/getAdvDetail/${id}`, params, head, false, true);

// 置顶广告
export const putTop = (params = {}, id, head = {}) => http.omp.get(config.baseUrlHost, `/advert/putTop/${id}`, params, head, false, true);
//  添加广告
export const addAdvert = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/advert/addAdvert", params, head, false, true);
// 修改
export const updateAdvert = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/advert/updateAdvert", params, head, false, true);
// 删除
export const deleteAdvert = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, `/advert/deleteAdvert/${params.id}`, params, head, false, true);

// 上传图片
export const forUpload = (params = {}, head = {}) => http.omp.postFrom(config.baseUrlHost, `/finsuitFileUpload/forUpload`, params, head, false, true);

// 查询广告位置列表页
export const getAdvertPositPage = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/advert/getAdvertPositPage", params, head, false, true);
// 初始化广告位置管理参数列表
export const forAdvertPositPage = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/advert/forAdvertPositPage", params, head, false, true);
// 查询广告位置详情
export const advPositDetail = (params = {}, id, head = {}) => http.omp.get(config.baseUrlHost, `/advert/advPositDetail/${id}`, params, head, false, true);
// 接口名称: 修改广告位置接口地址:
export const updateAdvPosit = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/advert/updateAdvPosit`, params, head, false, true);
// 接口名称: 根据广告位置id查询对应的渠道和设备列表
export const getFlagAndDeviceTypeByPosit = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, `/advert/getFlagAndDeviceTypeByPosit`, params, head, false, true);

//获取机构
export const selectOrgData = (params = "", head = {}) => http.omp.post(config.baseUrlHost, "/recommendProducts/selectOrgData", params, head, false, true);
//可见用户和选择类型
export const getAvailableUser = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/recommendProducts/getAvailableUser", params, head, false, true);
//根据内容类型获得内容
// export const getContentByContentType = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/homePageConfig/getContentByContentType", params, head, false, true);
//券商活动--广告位置管理列表--新增和修改保存
export const brokersSave = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/cSecuritiesFirmAdverts/save", params, head, false, true);
//券商活动--广告位置管理列表--修改请求数据
export const dataQueryById = (params = "", head = {}) => http.omp.get(config.baseUrlHost, "/cSecuritiesFirmAdverts/queryById", params, head, false, true).then(sxl_interceptors);

// //券商活动--广告位置管理列表
export const getPositionList = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/cSecuritiesFirmPosition/selectList", params, head, false, true).then(sxl_interceptors);
//券商活动--广告位置管理列表--状态
export const getUpdateState = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "cSecuritiesFirmPosition/updateState", params, head, false, true).then(sxl_interceptors);
//券商活动--广告位置管理列表--查询修改回显
export const getUpdatePosition = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "cSecuritiesFirmPosition/queryById", params, head, false, true).then(sxl_interceptors);
//券商活动--广告位置管理列表--提交修改位置
export const getUpdatePositionSave = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/cSecuritiesFirmPosition/save", params, head, false, true).then(sxl_interceptors);
//券商活动--广告位置管理列表--投放列表
export const getPutOnLists = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "cSecuritiesFirmAdverts/selectCSFposition", params, head, false, true).then(sxl_interceptors);
//删除接口
export const getBrokesDelete = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "cSecuritiesFirmAdverts/delete", params, head, false, true).then(sxl_interceptors);
//查询背景色
export const getSelectBackgroud = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "cSecuritiesFirmPosition/selectBackgroud", params, head, false, true).then(sxl_interceptors);
//修改背景色
export const getUpdateBackgroudColor = (params = {}, head = {}) =>
    http.omp.postParse(config.baseUrlHost, "cSecuritiesFirmPosition/updateBackgroudColor", params, head, false, true).then(sxl_interceptors);

//Mock请求
// export const getPositionList = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/finsuit/finsuitPhone/position", params, head, false, true).then(sxl_interceptors);
// export const getPutOnLists = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, "/finsuit/finsuitPhone/deal", params, head, false, true).then(sxl_interceptors);
