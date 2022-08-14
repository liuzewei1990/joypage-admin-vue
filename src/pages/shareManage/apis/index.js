import http from '@common/finsuit-http/index.js'
import config from '../config/config.index.js'

/**
 * API统一管理规范
 * @param {Obj} params  请求体参数
 * @param {Obj} head    请求头参数
 * @returns Promise
 */

// 上传图片
export const forUpload = (params = {}, head = {}) => http.omp.postFrom(config.baseUrlHost, `/finsuitFileUpload/forUpload`, params, head, false, true);
// 活动分享
// 分享 查列表
export const getActShareList = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/actShare/getActShareList`, params, head, false, true);
// 新增
export const addActShare = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/actShare/addActShare`, params, head, false, true);
// 修改
export const updateActShare = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/actShare/updateActShare`, params, head, false, true);
// 删除
export const delActShare = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/actShare/delActShare`, params, head, false, true);
// id查详情
export const queryActShareById = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/actShare/queryActShareById`, params, head, false, true);
// 获取所有活动
export const getActivity = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/wealReward/getActivity`, params, head, false, true);
// 首页分享和设置页分享
// 页面初始化参数
export const forSharePage = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, `/shareManager/forSharePage`, params, head, false, true);
//  获得分享方式
export const getShareTypeByDestination = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/shareManager/getShareTypeByDestination`, params, head, false, true);
// 列表页
export const forSharePageList = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/shareManager/forSharePageList`, params, head, false, true);
// 新增
export const addShare = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/shareManager/addShare`, params, head, false, true);
// : 修改
export const updateShare = (params = {}, head = {}) => http.omp.postParse(config.baseUrlHost, `/shareManager/updateShare`, params, head, false, true);
//  删除
export const delShare = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, `/shareManager/delShare/${params.id}`, params, head, false, true);
// 详情
export const forShareDetail = (params = {}, id, head = {}) => http.omp.get(config.baseUrlHost, `/shareManager/forShareDetail/${id}`, params, id, head, false, true);