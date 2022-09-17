<!-- 内容区通用布局组件,父级需要时flex布局 -->
<template>
    <div class="content-layout" :class="{ fluid: !isFluid }">
        <!-- 搜索区域 -->
        <div class="content-search" v-if="$slots.search">
            <slot name="search"></slot>
        </div>
        <!-- 操作区域 -->
        <div class="content-action" v-if="$slots.action">
            <slot name="action"></slot>
        </div>
        <!-- 主体内容区域 -->
        <div class="content-main" ref="contentMain">
            <slot></slot>
        </div>
        <!-- 底部footer -->
        <div class="content-footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script>
    import "./global-table.css";
    export default {
        name: "common-table",
        components: {},
        props: {
            isFluid: { type: Boolean, default: true }
        },
        data() {
            return {
                height: 0
            };
        },
        mounted() {
            this.setTableHeight();
            window.addEventListener("resize", this.setTableHeight);
        },
        methods: {
            setTableHeight() {
                this.$nextTick(() => {
                    this.height = document.documentElement.clientHeight - this.$refs.contentMain.getBoundingClientRect().top - 37;
                    this.$emit("height", this.height);
                });
            }
        }
    };
</script>
<style lang="less" scoped>
    //@import url(); 引入公共css类
    .content-layout {
        padding: 10px 20px;
        box-sizing: border-box;
        min-width: 800px;
    }

    .content-search {
        padding: 0px 0 0px 0;
        box-sizing: border-box;
        border-bottom: 1px solid #eee;
    }
    .content-action {
        padding: 10px 0px;
        box-sizing: border-box;
    }

    .content-main {
        //   padding: 10px 10px 0;
        box-sizing: border-box;
        overflow: hidden;
    }
    .content-footer {
        padding-bottom: 2px;
        box-sizing: border-box;
        .pagination {
            float: right;
        }
    }

    //flex布局方案
    .fluid {
        position: absolute;
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px;
        display: flex;
        flex-direction: column;
        .content-main {
            flex: 1;
            overflow: hidden;
        }
    }
</style>
