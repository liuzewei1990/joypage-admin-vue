/*
 * @Author: your name
 * @Date: 2021-05-18 11:01:25
 * @LastEditTime: 2021-05-19 15:16:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \finsuit-admin-joypage\src\pages\memberLevel\config\config.index.js
 */

/**
 * 项目配置文件
 */
// const pathname =  window.location.pathname
const CONFIG = {
  v: "1.1.0(build Time 2019-08-13 17:18)",
  //开发环境配置
  development: {
    NODE_ENV: process.env.NODE_ENV,
    // 活动code
    actityCode: "ANSWER_ACTIVITY",
    // api host
    baseUrlHost: "/omp",
    //baseUrlHost: "https://app-test4.bicai365.com/omp",
    // baseUrlHost: "http://192.168.10.38:8080/omp",
    // baseUrlHost: "http://192.168.10.105:8080/omp",
    // baseUrlHost: "http://192.168.100.249:8989",
    // baseUrlHost: "http://easy-mock.liuup.com/mock/5eb8fbc7339f163501d4ffe9/finsuit-admin-joypage",
    // api path
    baseUrlPath: "/finsuitPhone/deal",
    baseUrlPath: "/finsuit/finsuitPhone/deal",
    // 阿里云静态文件地址
    aliyuncHost: "https://finsuit-test.oss-cn-beijing.aliyuncs.com/",
  },

  //测试环境配置
  productionTest: {
    NODE_ENV: process.env.NODE_ENV,
    // 活动code
    actityCode: "ANSWER_ACTIVITY",
    // api host
    //   baseUrlHost: (window.location.protocol + '//' + window.location.host) + (window.location.host.indexOf('app-test') != -1 ? "/omp" : '/finsuit'),
    baseUrlHost: window.location.protocol + "//" + window.location.host + "/omp", //单独走测试环境
    // api path
    baseUrlPath: "/finsuit/finsuitPhone/deal",
    // 阿里云静态文件地址
    aliyuncHost: "https://finsuit-test.oss-cn-beijing.aliyuncs.com/",
  },

  //生产环境配置
  production: {
    NODE_ENV: process.env.NODE_ENV,
    // 活动code
    actityCode: "ANSWER_ACTIVITY",
    // api host
    // baseUrlHost:(window.location.protocol + '//' + window.location.host) + (window.location.pathname.substring(0,window.location.pathname.substr(1).indexOf("/")+1)),  //判断多种情况的时候,截取pathname地址第一个/后面的内容
    // baseUrlHost:(window.location.protocol + '//' + window.location.host) + (window.location.host.indexOf('app-test') != -1 ? "/omp" : '/finsuit'), //判断omp两种情况的时候'/omp'或者'/finsuit'的情况
    baseUrlHost: window.location.protocol + "//" + window.location.host + "/finsuit", //走生产和灰度环境
    // api path
    baseUrlPath: "/finsuit/finsuitPhone/deal",
    // 阿里云静态文件地址
    aliyuncHost: "https://finsuit.oss-cn-beijing.aliyuncs.com/",
  },
}
export default CONFIG[process.env.VUE_APP_ENV]
