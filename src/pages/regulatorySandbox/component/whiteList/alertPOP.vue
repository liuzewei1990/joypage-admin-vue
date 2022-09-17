<template>
    <div class="contentDiv">
        <div class="container">
            <i class="el-icon-warning" style="color: #faad14; font-size: 26px"></i> <b class="title1">{{ title1 }}</b>
            <div class="content" v-if="type1 == '1'">
                <p v-for="(item, index) in content" :key="index">{{ item }}</p>
            </div>
            <div class="content" v-if="type1 == '2'">
                <p>{{ content[0] }}</p>
                <p>{{ content[1] }}</p>
            </div>
            <div class="content" v-if="type1 == '3'">
                <p v-for="(item, index) in content[0]" :key="index">{{ item }}</p>
                <p>{{ content[1][0] }}</p>
                <p>{{ content[1][1] }}</p>
            </div>
            <div class="btnCon">
                <el-button type="primary" @click="sureChild">确定</el-button>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: ["title1", "type1", "content"],
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
            min-height: 200px;
            background: #fff;
            border-radius: 12px;
            padding: 20px;
            .content {
                height: 120px;
                overflow: auto;
                margin-top: 10px;
            }
            .btnCon {
                text-align: right;
                margin-top: 20px;
            }
        }
    }
</style>
