/**
 * 使用window.parent.exportApi调用 或者 postMessage以下方法名即可
 * 例如1：window.parent.exportApi.addTab(tabObj);
 * 例如2：window.parent.postMessage({ message: "addTab", data: tabObj });
 * 方法演示地址：npm run dev -template
 */

export default function () {
    let exportApi = {};

    /**
     * 添加一个菜单
     * menuItem.id 菜单唯一id
     * menuItem.text 菜单标题
     * menuItem.children 子菜单list,没有给空[]
     * menuItem.attributes.icon 菜单icon
     * menuItem.attributes.url 菜单地址
     */
    exportApi.addMenu = (menuItem = {}) => {
        menuItem = new Object(menuItem);
        this.$store.dispatch("addMenu", menuItem);
    };

    /**
     * 添加一个tab
     * tabObj.id    Tab唯一id
     * tabObj.title Tab标题
     * tabObj.href  Tab链接
     * tabObj.icon  Tab的icon
     * tabObj.pid   可选参数：Tab的宿主id(对应左侧menu的id)
     */
    exportApi.addTab = (tabObj = {}) => {
        tabObj = new Object(tabObj);
        this.$store.dispatch("addTab", tabObj);
    };

    /**
     * 移除一个tab
     * tabId
     */
    exportApi.removeTab = (tabId = "") => {
        this.$store.dispatch("removeTab", tabId);
    };

    /**
     * 切花到指定tab
     * tabObj.id    Tab唯一id
     * tabObj.title Tab标题
     * tabObj.href  Tab链接
     * tabObj.icon  Tab的icon
     * tabObj.pid   可选参数：Tab的宿主id(对应左侧menu的id)
     */
    exportApi.switchTab = (tabObj = {}) => {
        tabObj = new Object(tabObj);
        this.$store.dispatch("switchTab", tabObj);
    };

    /**
     * 跳转到登录页
     */
    exportApi.toLogin = () => {
        this.$router.push({ path: "/login" });
    };

    /**
     * 弹出消息
     * 同element-ui参数相同
     */
    exportApi.message = (options) => {
        this.$message(options);
    };

    /**
     * alert对话框
     * 同element-ui参数相同
     */
    exportApi.alert = (options) => {
        return this.$alert(options);
    };

    /**
     * confirm对话框
     * 同element-ui参数相同
     */
    exportApi.confirm = (options) => {
        return this.$confirm(options);
    };

    /**
     * prompt对话框
     * 同element-ui参数相同
     */
    exportApi.prompt = (options) => {
        return this.$prompt(options);
    };

    /**
     * msgbox对话框
     * 同element-ui参数相同
     */
    exportApi.msgbox = (options) => {
        return this.$msgbox(options);
    };

    /**
     * 退出登录
     * options 预留参数
     */
    exportApi.exit = (options = {}) => {
        options = new Object(options);
        this.$logout({ ...options });
    };

    /**
     * 收缩左侧菜单
     * true || false
     */
    exportApi.isCollapse = (flag) => {
        this.$store.commit("IS_COLLAPSE", !!flag);
    };

    /**
     * 询问是否退出登录
     * options 预留参数
     */
    exportApi.exitMessage = (options = {}) => {
        options = new Object(options);
        this.$logout({ showTip: true, ...options });
    };

    exportApi.newComponent = (options = {}) => {
        return this.$newComponent(options);
    };

    window.addEventListener("message", function (e) {
        let { message, data } = e.data;

        if (!message) return;
        let promise = exportApi[message] && exportApi[message](data);
        if (promise === undefined) return;

        // 回传消息返回值
        promise
            .then((data) => {
                e.source.postMessage({ message: message, data: data });
            })
            .catch((error) => {
                e.source.postMessage({ message: message, data: error });
            });
    });

    window.exportApi = exportApi;
}
