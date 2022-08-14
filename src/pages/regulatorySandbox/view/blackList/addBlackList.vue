<template>
<!-- 新增/修改 手机号黑名单-->
  <div class='addShare' v-loading='loading'>
    <div class='titleDiv'>{{title}}</div>
    <!-- 修改 -->
    <edit-black-list v-if='$route.query.id'></edit-black-list>
    <!-- 新增 -->
    <add-black-list v-else></add-black-list>
    
  </div>
</template>
<script>
import addBlackList from '../../component/blackList/addBlackList'
import editBlackList from '../../component/blackList/editBlackList'
const cityOptions = [
  {
    value: 'BC',
    label: '比财APP'
  },
  {
    value: 'PC',
    label: '拼财APP'
  },
  {
    value: 'PMP',
    label: '拼财小程序'
  }
  ];
const cityOptions1 = [
  {
    value: 'YY',
    label: '异业'
  },
  {
    value: 'TY',
    label: '同业'
  },
  {
    value: 'ZT',
    label: '直投'
  }
];
export default {
  components: {addBlackList,editBlackList},
  data () {
    return {
    }
  },
  computed: {
    title() {
      return `${this.$route.query.name}手机号黑名单`
    }
  },
  created () {
    this.$route.meta.title=`${this.$route.query.name}手机号黑名单`
  },
  mounted () {
   
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
.titleDiv {
  padding: 20px 0 0 20px;
}
</style>