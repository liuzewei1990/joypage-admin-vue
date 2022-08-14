
/**
 * 私有store模块
 * 请在modules中注入
 */

const user = {
    state: {
        value: ""
    },
    getters: {

    },
    mutations: {
        SET_ON_LOAD: (state, value) => {
            state.value = value;
        }
    },
    actions: {
        async actionDemo ({ commit, dispatch, state, rootState }, params = {}) {

        }
    }
}

export default user;