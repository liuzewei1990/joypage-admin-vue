<!--  -->
<template>
  <section class="bit-dev-tool" @click="openDevTool">
    <span class="icon el-icon-setting"></span>
  </section>
</template>

<script>
export default {
  components: {},
  data() {
    return {}
  },
  created() {},
  mounted() {},
  //方法集合
  methods: {
    // 打开调试工具
    openDevTool() {
      let devTool = this.$newComponent(require("./devTool.vue").default)
      devTool.$on("close", devTool.close)
      devTool.throw()
    },
  },
}
</script>
<style lang="less" scoped>
.bit-dev-tool {
  position: absolute;
  right: 30px;
  bottom: 30px;
  width: 50px;
  height: 50px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 500px;
  font-size: 30px;
  color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
