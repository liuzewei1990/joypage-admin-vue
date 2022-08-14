<template>
  <div id="main">
    <!-- <BreadcrumbTab></BreadcrumbTab> -->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
// import BreadcrumbTab from "@common/finsuit-components/BreadcrumbTab"
export default {
  components: {
    // BreadcrumbTab
  },
}
</script>

<style lang="less" scoped></style>
