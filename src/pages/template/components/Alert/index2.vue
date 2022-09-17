<template>
    <div>我是子组件二{{ bbb }}</div>
</template>

<script>
    export default {
        name: "index2",
        props: {
            bbb: {
                type: String,
                default: ""
            }
        }
    };
</script>

<style lang="scss" scoped></style>
