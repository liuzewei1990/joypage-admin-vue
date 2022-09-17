<template>
    <div class="listIndex">
        <!-- <router-link tag='button' to='/shareList/indexShareList' active-class='active-tab'>首页分享</router-link>
    <router-link tag='button' to='/shareList/activeShareList' active-class='active-tab'>活动分享</router-link>
    <router-link tag='button' to='/shareList/settingShareList' active-class='active-tab'>设置页分享</router-link> -->
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
</template>
<script>
    import { getActivity, forUpload } from "../apis/index";
    export default {
        created() {
            this.getActivityFun();
        },
        methods: {
            // 获取所有活动
            getActivityFun() {
                getActivity().then((res) => {
                    console.log(res);
                    if (res.result) {
                        sessionStorage.setItem("activityList", JSON.stringify(res.data));
                    }
                });
            },
            changeListFun(type) {
                this.type = type;
                if (this.$route.query.type) {
                    this.$route.query.type = type;
                } else {
                }
            }
        }
    };
</script>
<style lang="less" scoped>
    .listIndex {
        padding: 20px;
        > button {
            background: transparent;
            border: none;
            margin-right: 20px;
            outline: none;
            padding: 20px;
            padding-top: 0;
        }
        .active-tab {
            border-bottom: 1.5px solid #409eff;
            color: #409eff;
        }
    }
</style>
