<template>
  <div>
    <CommonTable>
      <el-page-header slot="search" content="快速导航"> </el-page-header>

      <div v-for="(oneItem, oneIndex) in menuList" :key="oneIndex">
        <div>{{ oneItem.text }}</div>

        <div v-for="(towItem, towIndex) in oneItem.children" :key="towIndex">
          <span>{{ towItem.text }}:</span>
          <el-tag type="danger" size="mini" v-for="(threeItem, threeIndex) in towItem.children" :key="threeIndex" @click="toTab(threeItem)">{{ threeItem.text }}</el-tag>
        </div>
      </div>
    </CommonTable>
  </div>
</template>

<script>
import CommonTable from "@common/finsuit-components/CommonTable"
import { mapState, mapActions, mapGetters } from "vuex"
export default {
  components: { CommonTable },
  computed: {
    ...mapGetters(["menuCollapseStatus"]),
    ...mapState({
      isCollapse: (state) => state.finsuitStoreConfig.isCollapse,
      activeIndex2: (state) => state.finsuitStoreMenuTabs.activeIndex2,
      menuListCode: (state) => state.finsuitStoreMenuList.menuListCode,
      defaultActive: (state) => state.finsuitStoreMenuList.defaultActive,
      menuList: (state) => state.finsuitStoreMenuList.menuList,
    }),
  },

  methods: {
    toTab(item) {
      console.log(item)
    },
  },
}
</script>

<style></style>
