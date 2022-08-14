<!-- 首页 -->
<template>
  <section class="">
    <p class="title">{{ $store.state.finsuitStoreUserInfo.userInfo.NAME }}欢迎您！</p>
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
  methods: {},
}
</script>
<style lang="less" scoped>
.title {
  margin: 30px;
  color: #1d96ff;
  font-size: 30px;
  font-weight: 100;
}
</style>
