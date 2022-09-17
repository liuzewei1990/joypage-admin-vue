<template>
    <div class="contentDiv">
        <div class="container">
            <b class="title1">{{ title1 }}</b>
            <div class="content">
                <p v-for="(item, index) in content" :key="index">{{ item }}</p>
            </div>
            <div class="btnCon">
                <el-button type="primary" @click="sureChild">确定</el-button>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: ["title1", "content"],
        data() {
            return {};
        },
        methods: {
            sureChild() {
                this.$emit("sureChild");
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
