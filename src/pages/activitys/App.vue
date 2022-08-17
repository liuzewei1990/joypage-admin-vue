<template>
  <div id="main">
    <!-- <BreadcrumbTab></BreadcrumbTab> -->
    <keep-alive>
      <router-view ref="krv" v-if="$route.meta.keepAlive" @hook:activated="activated('krv')" @hook:deactivated="deactivated('krv')"></router-view>
    </keep-alive>
    <router-view ref="rv" v-if="!$route.meta.keepAlive" @hook:mounted="activated('rv')" @hook:destroyed="deactivated('rv')"></router-view>
  </div>
</template>

<script>
// import BreadcrumbTab from "@common/finsuit-components/BreadcrumbTab"
export default {
  components: {
    // BreadcrumbTab
  },
  methods: {
    activated(refName) {
      let routerViewInstance = this.$refs[refName]
      routerViewInstance && routerViewInstance.pageAppear && this.$bus.$on("pageAppear", routerViewInstance.pageAppear)
    },
    deactivated(refName) {
      let routerViewInstance = this.$refs[refName]
      routerViewInstance && routerViewInstance.pageAppear && this.$bus.$off("pageAppear", routerViewInstance.pageAppear)
    },
  },
}
</script>

<style lang="less" scoped></style>
