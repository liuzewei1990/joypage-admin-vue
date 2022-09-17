<template>
    <section class="main pading">
        <el-row>
            <el-col :span="24" class="pading">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <!-- <span>BcSelect演示</span> -->
                    </div>
                    <bcselect></bcselect>
                </el-card>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24" class="pading">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>子域调用父域方法-----------【Tab类】</span>
                    </div>
                    <div>
                        <el-button type="primary" @click="addTab">添加tab</el-button>
                        <el-button type="success" @click="removeTab">移除tab（移除新添加的tab）</el-button>
                        <el-button type="danger" @click="switchTab">切换指定tab（切换新添加的tab）</el-button>
                    </div>
                </el-card>

                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>子域调用父域方法-----------【消息和弹窗】</span>
                    </div>
                    <div>
                        <el-button type="warning" @click="message">message</el-button>
                        <el-button type="success" @click="alert">alert</el-button>
                        <el-button type="primary" @click="openVnode">openVnode</el-button>
                        <el-button type="danger" @click="msgbox">msgbox</el-button>
                    </div>
                </el-card>

                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>子域调用父域方法-----------【退出登录】一般用于子域监测到登录过期时调用</span>
                    </div>
                    <div>
                        <el-button type="success" @click="exit">调用父域退出登录（无提示）</el-button>
                        <el-button type="warning" @click="exitMessage">调用父域退出登录（有弹窗提示）</el-button>
                        <el-button type="warning" @click="isCollapseFn">收缩左侧菜单</el-button>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24" class="pading">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>common插件方法</span>
                        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
                    </div>
                    <div>
                        <el-button type="primary" @click="throwComponent">抛出一个组件</el-button>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24" class="pading">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>子域访问登陆信息</span>
                        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
                    </div>
                    <div>
                        <p>用户账号：{{ $store.state.finsuitStoreUserInfo.userInfo.ACCOUNT }}</p>
                        <p>用户名称：{{ $store.state.finsuitStoreUserInfo.userInfo.NAME }}</p>
                        <p>用户角色：{{ $store.state.finsuitStoreUserInfo.userInfo.ROLE_NAME }}</p>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24" class="pading">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>子域访问tabs数据</span>
                    </div>
                    <div>
                        <pre>{{ $store.state.finsuitStoreMenuTabs }}</pre>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24" class="pading">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>子域访问左侧菜单数据</span>
                    </div>
                    <div>
                        <pre>{{ $store.state.finsuitStoreMenuList }}</pre>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </section>
</template>

<script>
    let tabObj = {
        id: "10000003",
        href: "https://fanyi.baidu.com/",
        title: "翻译一下",
        icon: "icon-text",
        spread: false
    };
    import devToolVue from "@/main/components/DevTool/devTool.vue";
    import bcselect from "./bcselect.vue";
    export default {
        components: { bcselect },
        data() {
            return {
                isCollapse: false
            };
        },
        created() {
            window._this = this;
        },
        mounted() {
            window.pageAppear = this.pageAppear;

            // 正常应该写到入口文件中去，注意多次监听。
            window.addEventListener(
                "message",
                (e) => {
                    let { message, data } = e.data;
                    this.$emit(message, e.data);
                },
                false
            );
        },
        //方法集合
        methods: {
            pageAppear() {
                this.$message("页面返回");
            },
            addTab() {
                window.parent.postMessage({ message: "addTab", data: tabObj });
            },
            removeTab() {
                window.parent.postMessage({ message: "removeTab", data: "10000003" });
            },
            switchTab() {
                window.parent.postMessage({ message: "switchTab", data: tabObj });
            },
            toLogin() {
                window.parent.postMessage({ message: "toLogin" });
            },
            message() {
                window.parent.postMessage({
                    message: "message",
                    data: {
                        message: "我是通过子域调起来的消息提示",
                        type: "error"
                    }
                });
            },
            alert() {
                window.parent.exportApi.alert("<strong>这是 <i>HTML</i> 片段</strong>", "HTML 片段", {
                    dangerouslyUseHTMLString: true
                });
            },
            openVnode() {
                window.parent.exportApi
                    .msgbox({
                        title: "内容可以是VNode",
                        message: this.$vnode,
                        showCancelButton: true,
                        confirmButtonText: "确定",
                        cancelButtonText: "取消"
                    })
                    .then((action) => {
                        this.$message({
                            type: "info",
                            message: "action: " + action
                        });
                    });
            },
            msgbox() {
                let a = window.parent.exportApi.msgbox({
                    type: "success",
                    title: "此操作将永久删除该文件, 是否继续?",
                    message: "提示",
                    showCancelButton: true,
                    confirmButtonText: "确定",
                    cancelButtonText: "取消"
                });

                a.then((data) => {
                    window.parent.exportApi.message(data);
                });

                a.catch((data) => {
                    window.parent.exportApi.message(data);
                });

                // return
                // window.parent.postMessage({
                //   message: "msgbox",
                //   data: {
                //     type: "success",
                //     title: "此操作将永久删除该文件, 是否继续?",
                //     message: "提示",
                //     showCancelButton: true,
                //     confirmButtonText: "确定",
                //     cancelButtonText: "取消",
                //   },
                // })
                // this.$off("msgbox").$on("msgbox", (data) => {
                //   window.parent.postMessage({
                //     message: "message",
                //     data: {
                //       message: data,
                //       type: "error",
                //     },
                //   })
                // })
            },
            exit() {
                window.parent.postMessage({ message: "exit" });
            },
            exitMessage() {
                window.parent.postMessage({ message: "exitMessage" });
            },
            isCollapseFn() {
                this.isCollapse = !this.isCollapse;

                window.parent.exportApi.isCollapse(this.isCollapse);
            },

            async throwComponent() {
                // this.alert0()
                this.alerts();
                // this.alert2()
                // this.alert3()
            },
            async alert0() {
                this.Alert0 = this.$newComponent(require("./index.vue").default);
                setTimeout(() => {
                    this.Alert0.close();
                }, 2000);
                await this.Alert0.throw();
            },
            async alerts() {
                this.Alert = window.parent.exportApi.newComponent(require("../../components/Alert/index.vue").default, false);
                this.Alert.aaa = "你经常那段时间承诺书";
                this.Alert.throw();
                this.Alert.aaa = "mcmccd";

                await this.Alert.throw();

                this.Alert.aaa = "v你的军队空军健康的女科技发达";
                this.Alert.throw();
                console.log("Alert :>> ", this.Alert);
            },
            async alert2() {
                this.Alert2 = window.parent.exportApi.newComponent(require("../../components/Alert/index2.vue").default);
                this.Alert2.bbb = "啵啵啵啵啵啵啵啵啵啵啵啵";
                this.Alert2.throw();
                this.Alert2.throw();
                this.Alert2.throw();
                console.log("Alert2 :>> ", this.Alert2);
            },

            async alert3() {
                let aa = window.parent.exportApi.newComponent(devToolVue);
                console.log(aa, 111);
                aa.throw();
            }
        }
    };
</script>
<style lang="less" scoped>
    .main {
    }
    .pading {
        padding: 10px;
    }
</style>
