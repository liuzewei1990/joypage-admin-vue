import http from "@common/finsuit-http/index.js";
import config from "../config/config.index.js";

/**
 * API统一管理规范
 * @param {Obj} params  请求体参数
 * @param {Obj} head    请求头参数
 * @returns Promise
 */
// 初始化 类型
export const forAdvertPage = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, `/advert/forAdvertPage`, params, head, false, true);

// 上传图片
export const forUpload = (params = {}, head = {}) => http.omp.postFrom(config.baseUrlHost, `/finsuitFileUpload/forUpload`, params, head, false, true);

// 根据 内容类型id获得对应的广告内容/advert/
export const getContentByContentType = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, `/advert/getContentByContentType`, params, head, false, true);
// 根据产品id查询产品
export const queryPrdList = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/prdFloatRateManage/queryPrdList`, params, head, false, true);

// 财富
// 新建或修改
export const saveWealth = (params = {}, head = {}) => http.omp.postDots(config.baseUrlHost, `/tWealthTransitionalPage/save`, params, head, false, true);
// 查询列表
export const getlistWealth = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, `/tWealthTransitionalPage/getlist`, params, head, false, true);
// 删除
export const deleteWealth = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, `/tWealthTransitionalPage/delete`, params, head, false, true);

// 二级菜单
// 新增
export const TwoMenusave = (params = {}, head = {}) => http.omp.postDots(config.baseUrlHost, `/tWealthTwoMenu/save`, params, head, false, true);
// 查询列表
export const TwoMenugetlist = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, `/tWealthTwoMenu/getlist`, params, head, false, true);
// 删除
export const TwoMenugetdelete = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, `/tWealthTwoMenu/delete`, params, head, false, true);
// 排序
export const TwoMenugetorder = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, `/tWealthTwoMenu/order`, params, head, false, true);
// 详情
export const TwoMenugeselectOne = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, `/tWealthTwoMenu/selectOne`, params, head, false, true);

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
