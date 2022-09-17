import http from "@common/finsuit-http/index.js";
import config from "../config/config.index.js";

/**
 * API统一管理规范
 * @param {Obj} params  私有域参数
 * @param {Obj} head    公共域参数
 * @returns Promise
 */

/* 用户管理 */
// export const getUserManages = (params) => http.get(config.baseUrlHost, "/user/page", params);
// export const postAddUser = (params) => http.post(config.baseUrlHost, "/user", params);
// export const patchEditUser = (params) => http.patch(config.baseUrlHost, "/user", params);
// export const getRolesTree = (params) => http.get(config.baseUrlHost, "/user/role/tree", params);
// export const patchConfigRole = (params) => http.patch(config.baseUrlHost, "/user/role", params);
// export const deleteUserManage = (username = "") => http.delete(config.baseUrlHost, "/user/delete/" + username);

/* 用户管理 */
//查询列表
export const getUserManages = (params) => http.omp.get(config.baseUrlHost, "/fuisuitUserManagement/v3.0/forUsermgmt", params);
//角色列表
export const getUserRoles = (params) => http.omp.get(config.baseUrlHost, "/fuisuitRoleManagement/v3.0/forListRoles", params);
//新增保存
export const getUserAddSave = (params) => http.omp.get(config.baseUrlHost, "/fuisuitUserManagement/v3.0/forAddUser", params, false, false, true);
//编辑保存
export const getUserEditSave = (params) => http.omp.get(config.baseUrlHost, "/fuisuitUserManagement/v3.0/forUpdUser", params);
//删除用户
export const getUserDelete = (params) => http.omp.get(config.baseUrlHost, "/fuisuitUserManagement/v3.0/forDelUser", params);
