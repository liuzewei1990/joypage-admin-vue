<template>
  <el-tree
    ref="dfdfdfd"
    class="filter-tree"
    :data="treeData"
    :props="defaultProps"
    show-checkbox
    default-expand-all
    :filter-node-method="filterNode"
    @check-change='checkTree'
    >
  </el-tree>
</template>
<script>
export default {
  data () {
    return {
      filterText: '',
      treeData: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      },
      {
        id: 4,
        label: '一级 4',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      },
      {
        id: 5,
        label: '一级 5',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      },
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    // 选中树节点
    checkTree (data) {
       console.log(this.$refs.dfdfdfd.getCheckedNodes()) //当前选中节点
    },
    
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
  }
}
</script>
<style lang="less" scoped>

</style>