<!--  -->
<template>
  <!-- value-key如果为id 因为有重复的产品id，会导致回显的输入框显示错误 -->
  <el-tooltip class="item" :disabled="tooltipDisabled" effect="dark" :content="tooltipContent" :open-delay="1500" placement="right">
    <el-select ref="el-select" v-model="selectVaule" @change="$emit('change',$event)" @blur="blur" @focus="focus" value-key="name" @visible-change="$emit('visibleChange',$event)" :remote-method="remoteMethod" :filter-method="filterMethod" :disabled="disabled" :placeholder="placeholderText" :filterable="filterable" :remote="remote" :clearable="clearable">
      <!-- 特殊处理，隐藏域，解决回显的数据在list列表中不存在，导致回显失败的问题 -->
      <el-option v-show="false" :key="selectVaule.id" :value="selectVaule" :label="selectVaule.name"></el-option>
      <!-- 数据列表 -->
      <el-option v-for="item in dataSet.list" :key="item.id" :value="item" :label="item.name"></el-option>
      <!-- 数据分页 -->
      <el-pagination @current-change="currentChange" :hide-on-single-page="true" :pager-count="6" small layout="prev,pager,next,jumper,->,total" :page-size="pageSize" prev-text="上一页" next-text="下一页" :total="dataSet.total"></el-pagination>
    </el-select>
  </el-tooltip>
</template>

<script>

import { getInvestmentDataList, getCommmonSelectList } from "../../apis/index";
export default {

  props: {
    apiType: {
      type: Number,
      default: 0
    },
    value: {
      type: String,
      default: ""
    },
    placeholderText: {
      type: String,
      default: ""
    },
    api: {
      type: Function,
      default: () => { }
    },

    apiAuto: {
      type: Boolean,
      default: true
    },

    disabled: {
      type: Boolean,
      default: false
    },

    filterable: {
      type: Boolean,
      default: false
    },

    remote: {
      type: Boolean,
      default: false
    },

    clearable: {
      type: Boolean,
      default: false
    },

    tooltipContent: {
      type: String,
      default: ""
    },

    pageSize: {
      type: Number,
      default: 10
    }
  },
  watch: {
    selectVaule (newVal) {
      this.$emit("input", newVal)
    },
    value (newVal) {
      this.selectVaule = newVal
    }
  },
  computed: {
    tooltipDisabled () {
      if (this.isFlag && this.tooltipContent) {
        return this.dataSet.list.length !== 0;
      } else {
        return true
      }
    }
  },
  data () {
    return {
      selectVaule: "",
      // 机构列表
      dataSet: {
        list: [],
        total: 0
      },
      datatypeParam: {
        type: this.apiType,
        currentPage: 1,
        keywords: "",
        orgId: ""
      },
      isFlag: false
    };
  },
  created () {
    this.selectVaule = this.value;
  },
  //方法集合
  methods: {
    //  重置
    resetData () {
      this.datatypeParam.currentPage = 1;
      this.datatypeParam.keywords = "";
      this.datatypeParam.orgId = "";
    },

    // 页码变化时调用
    currentChange (pageNum) {
      this.datatypeParam.currentPage = pageNum;
      this.getCommmonSelectList();
    },

    // 获取数据
    async getCommmonSelectList () {
      try {
        let params = { headerModel: { systemType: "h5", appFlag: "BC" }, datatypeParam: this.datatypeParam };
        let data = await getCommmonSelectList(params);
        this.dataSet.list = data.list || [];
        this.dataSet.total = data.totalRow || 10;
      } catch (error) {
        throw error;
      }
    },

    // 关键字输入时
    remoteMethod (queryValue) {
      // 将分页重置第一页
      this.datatypeParam.currentPage = 1;
      this.datatypeParam.keywords = queryValue;
      this.getCommmonSelectList();
    },

    // 本地检索
    filterMethod (query) {
      console.log("本地检索",query)
      if (query !== '') {
        setTimeout(() => {
          this.selectVaule = this.dataSet.list.filter(item => {
            return item.name.indexOf(query) > -1;
          })[0];
        }, 200);
      } else {
        this.selectVaule = {};
      }
    },

    // 失去焦点情况关键字
    blur () {
      this.datatypeParam.keywords = "";
    },

    // 获取焦点调用数据
    focus () {
      this.isFlag = true;
      this.getCommmonSelectList();
    }
  },
}
</script>
<style lang='less' scoped>
</style>
