const webpack = require("webpack");
const path = require("path");
const cdn = require("./cdn.js");
module.exports = {
    // 开发环境启动运行编译
    runtimeCompiler: process.env.BABEL_ENV !== "production",
    // 不打包
    productionSourceMap: false,
    devServer: {
        proxy: {
            "/omp": {
                target: "https://app-test4.bicai365.com",
                secure: false,
                changeOrigin: true,
                cookieDomainRewrite: {
                    "*": "192.168.137.1:8080"
                }
            }
        }
    },
    pages: {
        main: {
            entry: path.resolve("./src/main/index.js"),
            template: path.resolve("./src/main/index.html"),
            filename: process.env.BABEL_ENV === "development" ? `main/index.html` : "index.html"
        }
    },

    chainWebpack: (config) => {
        // 通过该插件为当前html注入模板变量
        // config.plugin('html-template').tap((args) => {
        //     args[0].cdn = cdn
        //     return args
        // })
        // 还可以做的其他事儿
        // config.plugin('html-template').tap(args => {
        //     args[0].title = '外部联网协议配置系统'
        //     return args
        // })
        // Ts支持
        // config.resolve.extensions
        //     .add('ts')
        //     .add('tsx')
    },
    configureWebpack: (config) => {
        config.externals = cdn.externals;

        // config.plugins.push(new webpack.NormalModuleReplacementPlugin(
        //     /element-plus[\/\\]lib[\/\\]locale[\/\\]lang[\/\\]en/,
        //     'element-plus/lib/locale/lang/zh-cn',
        // ))
    },
    // 如果需要做pwa,请先安装npm i @vue/cli-plugin-pwa -D
    pwa: {}
};
