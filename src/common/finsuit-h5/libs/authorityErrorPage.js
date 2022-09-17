/**
 * 校验页面权限方法，如果没有权限 则渲染AuthorityErrorPage 没有权限访问的页面
 */

import Vue from "vue";
import AuthorityErrorPage from "@common/finsuit-components/AuthorityErrorPage/index.vue";
const AuthorityErrorPageConstructor = Vue.extend(AuthorityErrorPage);
export default new AuthorityErrorPageConstructor();
