<!-- 视图面包屑导航 -->
<template>
    <div class="breadcrumb-box">
        <div class="title">
            <span>当前位置：</span>
        </div>
        <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item v-for="(item, index) in breadList" :key="index" :to="item">
                <span class="text">{{ item.meta.title }}</span>
            </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="close" v-show="$route.path !== '/'">
            <!-- <el-button @click="$router.back()" class="btn" size="mini" icon="el-icon-close"></el-button> -->
            <span v-show="$route.path !== '/'" class="el-icon-arrow-left" @click="$router.back()">返回</span>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                breadList: []
            };
        },
        watch: {
            $route() {
                this.getBreadList();
            }
        },
        created() {
            this.getBreadList();
        },
        methods: {
            getBreadList() {
                let matched = this.$route.matched.filter((item) => item.name); //$route.matched 将会是一个包含从上到下的所有对象 (副本)。
                const first = matched[0];
                if (first && first.name !== "index") {
                    //$route.name当前路由名称  ；$route.redirectedFrom重定向来源的路由的名字
                    matched = [this.$router.options.routes[0]].concat(matched);
                }
                this.breadList = matched;
            }
        }
    };
</script>
<style lang="less" scoped>
    .breadcrumb-box {
        height: 20px;
        border-bottom: 1px dashed #eee;
        padding-bottom: 5px;
        margin-bottom: 5px;
        display: flex;
        align-items: center;

        .title {
            font-size: 13px;
            color: #606266;
        }
        .text {
            font-size: 13px;
            color: #606266;
        }
        .close {
            font-size: 13px;
            color: #606266;
            cursor: pointer;
        }

        .breadcrumb {
            flex: 1;
        }
    }
</style>
