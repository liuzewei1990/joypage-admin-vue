## 运营后台开发框架
[TOC]
> Vue+ElementUI 开发的iframe版后台管理

### 新菜单功能快速开发指南
- 第一步：快速复制template项目集成包创建新的微项目，并改用新的名称，该名称也对应服务器部署目录名，也就是assetsPublicPath，例如：joyPage
- 第二步：修改文件夹名称为joyPage，将复制的新项目目录中template.js 和 template.html 重命名 : joyPage
- 第三步：npm run dev -joyPage 启动这个项目的开发环境， 浏览器输入http://0.0.0.0:8080/[PUBLIC_PATH]/joyPage/index.html访问
- 第四步：npm run build:test joyPage 打包测试环境到productionTest文件夹中。
- 第五步：npm run build:prod joyPage 打包测试环境到production文件夹中。
- 注意事项：一个微项目的目录名 + 入口文件 + html模板文件 名称必须是统一的。
  
### npm命令说明

``` bash
# install dependencies
npm install

# 启动开发环境 代表启动全部微项目 并设置开发环境配置 一般情况启动自己的就好 避免浪费内存
npm run dev

# 启动开发环境 代表启动指定微项目 并设置开发环境配置
npm run dev -project1 -project2 -project3 -project4......

# 发布测试包 打包指定的微项目 并设置测试环境配置
npm run build:test [项目名称必填]

# 发布生产包 打包指定的微项目 并设置生产环境配置
npm run build:prod [项目名称必填]
```

### 微项目架构特点
- **项目规范 - 约束规范** ：多个微项目应用一套脚手架，一套公共库，一套公共模块，统一项目规范。
- **开发阶段 - 独立开发** ：一键启动所有微项目开发环境，支持微项目之间间接联调。独立开发所属项目包，完全解决代码冲突问题，公共模块分离；
- **发布阶段 - 独立发布** ：支持测试环境和生产环境发布，走不通配置，微项目单独打包，单独生成dist包；
- **部署阶段 - 独立部署** ：支持一键部署所有微项目生产包，支持独立项目部署，利用浏览器缓存，优化公共库的缓存。

### 目录说明
``` bash
├─common
│  ├─finsuit-assets--------------------全局公共资源文件
│  ├─finsuit-components----------------全局公共组件
│  ├─finsuit-h5------------------------全局公共插件库
│  ├─finsuit-http----------------------全局公共请求器
│  └─finsuit-store---------------------全局公共store
│
├─config-------------------------------项目配置文件
│
├─main --------------------------------后台iframe主框架
│  ├─apis
│  ├─assets
│  ├─config
│  ├─router
│  ├─store
│  ├─utils
│  └─view
│      ├─home ------后台首页
│      ├─login------登陆页面
│      └─main-------主控制器
│
└─pages
    ├─template ------------------------菜单模块A
    │  ├─apis ------接口文件
    │  ├─assets ----资源文件
    │  ├─components-组件文件
    │  ├─router-----路由文件
    │  ├─store------vuex文件
    │  ├─utils------工具文件
    │  └─view-------页面文件
    ├─template ------------------------菜单模块B
    │  ├─apis ------接口文件
    │  ├─assets ----资源文件
    │  ├─components-组件文件
    │  ├─router-----路由文件
    │  ├─store------vuex文件
    │  ├─utils------工具文件
    │  └─view-------页面文件
    │
    │─更多模块...
```
### 项目说明

- 1、开发者需遵循独立开发、独立测试、独立部署规范，负责维护自己的功能模块。
- 2、开发时注意不要改动其他人的模块代码，误删、误改、误提交等等。。。
- 3、避免随意改动common包和main主框架。。。避免出现未知错误
- 4、发布打包时注意项目配置文件。

### 开发环境三个注意点
- 1、开发环境开发时，建议启动自己的模块项目，避免全部启动浪费电脑性能。
- 2、开发环境开发时，建议独立访问自己模块本地地址，例如：http://192.168.137.1:8080/[PUBLIC_PATH]/[modelus]/index.html
- 3、开发环境开发时，如遇到需要在主框架中联调时，可在easy-mock中修改菜单权限的菜单mock地址为本地地址即可。mock地址：http://easy-mock.liuup.com/

### iframe通信交互 -- 父域调用子域
- 1、window.pageAppear = function(){}   切换到当前Tab时调用，注意：首次打开不会调用。和App中pageAppear概念一样。
- 2、注：实际使用中只需在methods中声明pageAppear方法即可，当切换到当前Tab时调用，框架会自动调用该方法


### iframe通信交互 -- 子域调用父域
``` bash
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
    }

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
    }

    /**
     * 移除一个tab
     * tabId
     */
    exportApi.removeTab = (tabId = "") => {
        this.$store.dispatch("removeTab", tabId);
    }

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
    }

    /**
     * 跳转到登录页
     */
    exportApi.toLogin = () => {
        this.$router.push({ path: "/login" });
    }

    /**
     * 弹出消息
     * 同element-ui参数相同
     */
    exportApi.message = (options) => {
        this.$message(options);
    }

    /**
     * alert对话框
     * 同element-ui参数相同
     */
    exportApi.alert = (options) => {
        return this.$alert(options);
    }

    /**
     * confirm对话框
     * 同element-ui参数相同
     */
    exportApi.confirm = (options) => {
        return this.$confirm(options);
    }

    /**
     * prompt对话框
     * 同element-ui参数相同
     */
    exportApi.prompt = (options) => {
        return this.$prompt(options);
    }

    /**
     * msgbox对话框
     * 同element-ui参数相同
     */
    exportApi.msgbox = (options) => {
        return this.$msgbox(options);
    }

    /**
     * 退出登录
     * options 预留参数
     */
    exportApi.exit = (options = {}) => {
        options = new Object(options);
        this.$logout({ ...options });
    }

    /**
     * 收缩左侧菜单
     * true || false
     */
    exportApi.isCollapse = (flag) => {
        this.$store.commit("IS_COLLAPSE", !!flag);
    }

    /**
     * 询问是否退出登录
     * options 预留参数
     */
    exportApi.exitMessage = (options = {}) => {
        options = new Object(options);
        this.$logout({ showTip: true, ...options });
    }

    window.addEventListener("message", function (e) {

        let { message, data } = e.data;

        if (!message) return;
        let promise = exportApi[message] && exportApi[message](data);
        if (promise === undefined) return;

        // 回传消息返回值
        promise.then(data => {
            e.source.postMessage({ message: message, data: data })
        }).catch(error => {
            e.source.postMessage({ message: message, data: error })
        })
    });

    window.exportApi = exportApi;

}

`