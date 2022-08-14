import http from '@common/finsuit-http/index.js'
import config from '../config/config.index.js'

/**
 * API统一管理规范
 * @param {Obj} params  请求体参数
 * @param {Obj} head    请求头参数
 * @returns Promise
 */


/* 接口描述 */
// export const demo = (params = {}, head = {}) => http.omp.get(config.baseUrlHost, "/fuisuitSys/v3.0/main", params, head, false, false);

/* 权限管理 */
//角色列表
export const getRoleManages = (params) => http.omp.get(config.baseUrlHost, "/fuisuitRoleManagement/v3.0/forListRoles", params);
//角色tree
export const getRolesTree = (params) => http.omp.get(config.baseUrlHost, "/fuisuitRoleManagement/v3.0/forInitGrantTreeJson", params);
//新增保存
export const getRoleAddSave = (params, head = {}) => http.omp.get(config.baseUrlHost, "/fuisuitRoleManagement/v3.0/forAddRole", params, head, false, true);
//编辑保存
export const getRoleEditSave = (params, head = {}) => http.omp.get(config.baseUrlHost, "/fuisuitRoleManagement/v3.0/forUpdRole", params, head, false, true);
//授权保存
export const getRoleGrantSave = (params, head = {}) => http.omp.post(config.baseUrlHost, "/fuisuitRoleManagement/v3.0/forSaveGrant", params, head, false, true);
//删除用户
export const getRoleDelete = (params) => http.omp.get(config.baseUrlHost, "/fuisuitRoleManagement/v3.0/forDelRole", params);
//删除用户
export const getRoleDeletes = (params) => http.omp.get(config.baseUrlHost, "/fuisuitRoleManagement/v3.0/forDelRoles", params);
