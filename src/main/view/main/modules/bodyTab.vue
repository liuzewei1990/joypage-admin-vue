<!-- 右侧主体组件 -->
<template>
    <section class="body-tab-container">
        <!-- 首页tab按钮 -->
        <div class="tab-home-btn" :class="{ active: activeIndex2 === 9999 }" @click="openHome"><i class="el-icon-s-home"></i>首页</div>

        <!-- tab iframe页面 -->
        <el-tabs class="menu-tabs" v-model="activeIndex2" type="card" @tab-remove="deleteTab" @tab-click="clickTab">
            <!-- 注意：key 一定要有，且不能为index索引值，否则当删除tab时，会更新剩余dom,造成刷新iframe的后果 -->
            <el-tab-pane :name="item.id" :aaaaaa="item" v-for="item in menuTabs" :key="item.id" :closable="item.id != 9999">
                <span slot="label"><i class="el-icon-menu"></i> {{ item.title }}</span>
                <div class="el-iframe-container">
                    <iframe class="iframe" :ref="item.id" :src="item.href" frameborder="0" @load="iframeOnload"></iframe>
                </div>
            </el-tab-pane>
        </el-tabs>

        <!-- 刷新按钮 -->
        <div class="tab-refresh-btn" :class="{ active: activeIndex2 === 9999 }" @click="refreshTab"><i class="el-icon-refresh-right"></i></div>

        <!-- 页面操作按钮 -->
        <div class="tab-action-btn">
            <el-dropdown @command="tabActionClick">
                <span class="el-dropdown-link">
                    <!-- <i class="el-icon-menu"></i> -->
                    <span>页面操作</span>
                    <i class="el-icon-caret-bottom"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="refreshTab"><i class="el-icon-refresh"></i><span>刷新当前</span></el-dropdown-item>
                    <el-dropdown-item command="removeOutTab"><i class="el-icon-remove-outline"></i><span>关闭其他</span></el-dropdown-item>
                    <el-dropdown-item command="removeAllTab"><i class="el-icon-circle-close"></i><span>关闭全部</span></el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </section>
</template>

<script>
    import { mapState, mapActions, mapGetters } from "vuex";
    export default {
        components: {},
        data() {
            return {};
        },
        inject: ["$bus"],
        computed: {
            ...mapState({
                activeIndex2: (state) => state.finsuitStoreMenuTabs.activeIndex2,
                menuTabs: (state) => state.finsuitStoreMenuTabs.menuTabs
            })
        },
        watch: {
            activeIndex2(value) {
                let tabId = value;
                this.pageAppear(tabId);
            }
        },
        created() {},
        mounted() {},
        //方法集合
        methods: {
            ...mapActions(["switchCollapse", "removeTab", "removeAllTab", "removeOutTab", "switchTab", "openHome"]),

            // 点击tab
            clickTab(tab) {
                let tabObj = this.menuTabs.find((item) => item.id == tab.name);
                this.switchTab(tabObj);
            },
            // 删除tab
            deleteTab(tabTitle) {
                this.removeTab(tabTitle);
            },
            // 删除全部tab
            deleteAllTab() {
                if (this.menuTabs.length === 1) {
                    this.$message({
                        message: "没有可以关闭的窗口了@_@",
                        type: "warning"
                    });
                    return;
                }
                this.removeAllTab();
            },
            // 删除其他tab
            deleteOutTab() {
                if (this.menuTabs.length === 1) {
                    this.$message({
                        message: "没有可以关闭的窗口了@_@",
                        type: "warning"
                    });
                    return;
                }
                this.removeOutTab();
            },

            // 刷新当前tab
            refreshTab() {
                let iframe = this.$refs[this.activeIndex2][0];
                if (iframe.isRefresh) {
                    this.$message({
                        message: "您点击的速度超过了服务器的响应速度，还是等两秒再刷新吧！",
                        type: "warning"
                    });
                } else {
                    iframe.contentWindow.location.reload();
                    iframe.isRefresh = true;
                    setTimeout(() => {
                        iframe.isRefresh = false;
                    }, 2000);
                }
            },

            /**
             * 点击页面操作按钮
             */
            tabActionClick(command) {
                switch (command) {
                    case "refreshTab":
                        this.refreshTab();
                        break;
                    case "removeOutTab":
                        this.deleteOutTab();
                        break;
                    case "removeAllTab":
                        this.deleteAllTab();
                        break;
                    default:
                        break;
                }
            },

            // iframe显示
            pageAppear(tabId) {
                // 如果是首次创建iframe是没有的
                if (!this.$refs[tabId]) return;
                let iframe = this.$refs[tabId][0];
                this.$bus.$emit("pageAppear", iframe);
            },

            // iframe加载完毕
            iframeOnload(e) {
                //   console.log(e);
            }
        }
    };
</script>
<style lang="less" scoped>
    .body-tab-container {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        overflow: hidden;

        /* home首页按钮 */
        .tab-home-btn {
            cursor: pointer;
            position: absolute;
            left: 0;
            top: 0;
            z-index: 1;
            height: 41px;
            width: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            color: #303133;
            i {
                font-size: 15px;
                margin-right: 5px;
            }
        }
        .active {
            color: #1d96ff;
        }

        /* iframe */
        .el-tabs {
            height: 100%;
            // background: #000;
            padding-top: 40px;
            box-sizing: border-box;
            box-shadow: none;
            //   border: none;
            /* tab选项卡 */
            /deep/.el-tabs__header {
                margin-top: -40px;
                margin-bottom: 0;
                padding-right: 180px;
                padding-left: 80px;
                height: 40px;
                .el-tabs__item {
                    font-size: 13px;
                }

                .el-tabs__nav > div:nth-child(1) {
                    display: none;
                }
            }
            /deep/.el-tabs__content {
                padding: 0px;
                height: 100%;
            }

            /* tab选项卡 ifarame容器 */
            .el-iframe-container {
                position: absolute;
                height: 100%;
                width: 100%;
                .iframe {
                    position: absolute;
                    height: 100%;
                    width: 100%;
                    border: none;
                    animation: moveTop 0.6s;
                }
            }
        }

        .tab-refresh-btn {
            cursor: pointer;
            position: absolute;
            right: 120px;
            top: 0;
            z-index: 1;
            height: 41px;
            width: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            color: #303133;
            i {
                font-size: 16px;
                margin-right: 5px;
            }
        }

        /* 更多操作 */
        .tab-action-btn {
            cursor: pointer;
            position: absolute;
            right: 0;
            top: 0;
            z-index: 1;
            width: 120px;
            height: 40px;
            border-left: 1px solid #e4e7ed;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .tab-action-btn:hover,
        .tab-refresh-btn:hover,
        .tab-home-btn:hover {
            color: #1d96ff;
            background: #f3f3f3;
        }

        @keyframes moveTop {
            0% {
                opacity: 0;
                transform: translateY(10px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }
    }
</style>
