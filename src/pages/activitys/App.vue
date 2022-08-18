<template>
  <div id="main">
    <keep-alive>
      <router-view ref="krv" v-if="$route.meta.keepAlive" @hook:activated="enter('krv')" @hook:deactivated="leave('krv')"></router-view>
    </keep-alive>
    <router-view ref="rv" v-if="!$route.meta.keepAlive" @hook:mounted="enter('rv')" @hook:destroyed="leave('rv')"></router-view>
  </div>
</template>

<script>
export default {
  methods: {
    enter(refName) {
      let routerViewInstance = this.$refs[refName]
      let pageAppear = routerViewInstance && routerViewInstance.$options.pageAppear && routerViewInstance.$options.pageAppear.bind(routerViewInstance)
      pageAppear && this.$bus.$on("pageAppear", pageAppear)
    },
    leave(refName) {
      let routerViewInstance = this.$refs[refName]
      let pageAppear = routerViewInstance && routerViewInstance.$options.pageAppear && routerViewInstance.$options.pageAppear.bind(routerViewInstance)
      pageAppear && this.$bus.$off("pageAppear", pageAppear)
    },
  },
}
</script>

<style lang="less" scoped></style>
