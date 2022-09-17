/**
 * 用户信息相关store模块
 */

export default {
    state: {
        // iframe共享的用户信息
        userInfo: {}
    },
    mutations: {
        ["USER_INFO"](state, userInfo) {
            state.userInfo = userInfo;
        }
    },
    actions: {}
};
