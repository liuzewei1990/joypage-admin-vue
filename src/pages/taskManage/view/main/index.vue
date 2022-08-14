<!--  -->
<template>
  <section class='main'>
    <!-- tab -->
    <el-tabs v-model="currTabCode" @tab-click="handleClick">
      <el-tab-pane v-for="item in tabs" :key="item.code" :label="item.name" :name="item.code"></el-tab-pane>
    </el-tabs>
    <!-- tab main -->
    <keep-alive>
      <components :is="currTabCode"></components>
    </keep-alive>
  </section>
</template>

<script>
import InvestList from "./modules/investList.vue"
import Test1 from "./modules/test1.vue"
import Test2 from "./modules/test2.vue"
export default {
  components: { InvestList, Test1, Test2 },
  data () {
    return {
      currTabCode: "InvestList",
      tabs: [{
        name: "循环任务",
        code: "InvestList",
      }, {
        name: "常规任务",
        code: "Test1",
      }, {
        name: "投资任务",
        code: "Test2",
      }]
    };
  },
  created () {

  },
  mounted () {

  },
  //方法集合
  methods: {

  },
}
</script>
<style lang='less' scoped>
.main {
  padding: 20px;
}
</style>