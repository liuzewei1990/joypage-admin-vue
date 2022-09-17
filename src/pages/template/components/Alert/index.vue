<template>
    <div class="z1">
        <div>我是子组件一{{ aaa }}{{ $store.state.finsuitStoreUserInfo }}</div>
        <el-button @click="resolve">成功</el-button>
        <el-button @click="reject">失败</el-button>
    </div>
</template>

<script>
    export default {
        name: "index",
        props: {
            resolve: {
                type: Function,
                default: () => {}
            },
            reject: {
                type: Function,
                default: () => {}
            }
        },
        data() {
            return {
                aaa: 222
            };
        },
        created() {
            console.log("this - 子组件:>> ", this);
            // setTimeout(() => {
            //   this.reject()
            // }, 2000)
        }
    };
</script>

<style lang="less" scoped></style>
