<template>
    <div class="contentDiv">
        <div class="container">
            <b class="title">{{ title }}</b>
            <div class="content">
                <span v-for="(item, index) in content" :key="index">ID:{{ item.id }} </span>
            </div>
            <div class="btnCon">
                <el-button @click="editOther">修改其他</el-button>
                <el-button type="primary" @click="editSelf">修改本条</el-button>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: ["title", "content"],
        data() {
            return {};
        },
        methods: {
            editOther() {
                this.$emit("editOther");
            },
            editSelf() {
                this.$emit("editSelf");
            }
        }
    };
</script>
<style lang="less" scoped>
    .contentDiv {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3000;
        .container {
            width: 500px;
            height: 200px;
            background: #fff;
            border-radius: 12px;
            padding: 20px;
            .content {
                height: 120px;
                overflow: auto;
            }
            .btnCon {
                text-align: right;
                margin-top: 20px;
            }
        }
    }
</style>
