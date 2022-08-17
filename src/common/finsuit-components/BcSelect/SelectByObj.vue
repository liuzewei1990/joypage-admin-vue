<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<!--  -->
<template>
  <!-- value-key如果为id 因为有重复的产品id，会导致回显的输入框显示错误 -->
  <el-select :class="{ 'bc-select': true, 'auto-w': isAutoWidth }" ref="el-select" v-model="selectVaule" :loading="loading" @change="$emit('change', $event)" @blur="blur" @focus="focus" :value-key="itemNameKey" @visible-change="visibleChange($event)" :remote-method="remoteMethod" :disabled="disabled" :placeholder="placeholder" :filterable="filterable" :remote="remote" :clearable="clearable" :multiple="multiple">
    <!-- 特殊处理，隐藏域，解决回显的数据在list列表中不存在，导致回显失败的问题 -->
    <template v-if="multiple">
      <!-- 多选 -->
      <el-option v-for="item in selectVaule" :key="item[itemValueKey]" :value="item" :label="item[itemNameKey]" class="default-option-hide" v-if="item[itemValueKey] !== undefined"></el-option>
    </template>
    <template v-else>
      <!-- 单选 -->
      <el-option class="default-option-hide" v-if="selectVaule[itemValueKey] !== undefined" :key="selectVaule[itemValueKey]" :value="selectVaule" :label="selectVaule[itemNameKey]"></el-option>
    </template>

    <!-- 数据列表 -->
    <el-option v-for="item in dataset.list" :key="item[itemValueKey]" :value="item" :label="item[itemNameKey]"></el-option>

    <!-- 数据分页 -->
    <el-pagination :current-page.sync="datatypeParam.currentPage" @current-change="currentChange" :hide-on-single-page="true" :pager-count="6" small layout="prev,pager,next,jumper,->,total" :page-size="pageSize" prev-text="上一页" next-text="下一页" :total="dataset.total"></el-pagination>
  </el-select>
</template>

<script>
export default {
  props: {
    /**
     * options列表
     */
    list: {
      type: Array,
      default: () => [],
    },
    /**
     * options总条数 可显示分页
     */
    total: {
      type: Number,
      default: 0,
    },

    /**
     * 分页最大条数大小
     */
    pageSize: {
      type: Number,
      default: 10,
    },

    /**
     * v-model
     */
    value: {
      type: String,
      default: "",
    },

    /**
     * input placeholder
     */
    placeholder: {
      type: String,
      default: "",
    },

    /**
     * 是否禁用
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * 是否可搜索
     */
    filterable: {
      type: Boolean,
      default: false,
    },

    /**
     * 是否为远程搜索
     */
    remote: {
      type: Boolean,
      default: false,
    },

    /**
     * 是否可以清空选项
     */
    clearable: {
      type: Boolean,
      default: false,
    },

    /**
     * item label 键名
     */
    itemNameKey: {
      type: String,
      default: "name",
    },

    /**
     * item value 键名
     */
    itemValueKey: {
      type: String,
      default: "id",
    },

    /**
     * 是否设置为自适应宽度
     */
    isAutoWidth: {
      type: Boolean,
      default: true,
    },

    /**
     * 是否可以多选
     */
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    selectVaule(newVal) {
      this.$emit("input", newVal)
    },
    value(newVal) {
      this.selectVaule = newVal
    },
    list(newVal) {
      // 某人非要那样用，所以这里也处理一下loading
      this.loading = false
      this.dataset.list = newVal
    },
    total(newVal) {
      this.dataset.total = newVal
    },
    pageSize(newVal) {
      this.datatypeParam.pageSize = newVal
    },
  },
  data() {
    return {
      selectVaule: "",
      // 机构列表
      dataset: {
        list: [],
        total: 0,
      },
      datatypeParam: {
        pageSize: 10,
        currentPage: 1,
        keywords: "",
      },
      isFlag: false,
      loading: false,
    }
  },
  created() {
    this.selectVaule = this.value
    this.dataset.list = this.list
    this.dataset.total = this.total
    this.datatypeParam.pageSize = this.pageSize
  },
  //方法集合
  methods: {
    //  重置 暂时用不上
    resetData() {
      this.datatypeParam.currentPage = 1
      this.datatypeParam.keywords = ""
    },

    // 页码变化时调用
    currentChange(pageNum) {
      // 注意：pageNum无须赋值，因为使用了:current-page.sync

      // 1、这里由 focus 代替 getCommmonSelectList执行
      // 2、解决切换页码关键字消失的问题
      this.$refs["el-select"].focus()
      this.getCommmonSelectList()

      // 派发到父级使用，父级需要的话
      this.$emit("paginationChange", pageNum)
    },

    // 获取数据
    async getCommmonSelectList() {
      //  只有空数据的时候显示loading
      if (this.dataset.list.length === 0) this.loading = true

      // 拷贝实时参数
      let query = JSON.parse(JSON.stringify(this.datatypeParam))

      //  数据的回调
      let callback = (dataset = {}) => {
        this.loading = false
        this.dataset.list = dataset.list || []
        this.dataset.total = dataset.total || 0
      }

      //  触发事件-父级调用接口请求数据
      this.$emit("GetApiData", { query, callback })
    },

    // 关键字输入时
    remoteMethod(queryValue) {
      this.loading = true
      // 输入时 将分页重置第一页
      this.datatypeParam.currentPage = 1
      // 记录关键字
      this.datatypeParam.keywords = queryValue
      // 触发事件去 - 发起请求
      this.getCommmonSelectList()
    },

    // 失去焦点情况关键字
    blur($event) {
      // 派发到父级使用，父级需要的话
      this.$emit("blur", $event)
    },

    // 获取焦点调用数据
    focus($event) {
      // 派发到父级使用，父级需要的话
      this.$emit("focus", $event)
    },

    // 当收起或展开时触发
    visibleChange($event) {
      // 每次展开时 列表为空时--调用数据
      if ($event === true && this.dataset.list.length === 0) {
        this.getCommmonSelectList()
      }

      // 每当收起时 处理关键字
      if ($event === false) {
        // 收起时 如果有关键字同时清空列表，避免展开时显示旧数据
        if (this.datatypeParam.keywords != "") {
          this.dataset.list = []
          this.dataset.total = 0
        }

        // 收起时清空关键字
        this.datatypeParam.keywords = ""
      }

      // 派发到父级使用，父级需要的话
      this.$emit("visible-change", $event)
    },
  },
}
</script>
<style lang="less">
// .bc-select {
// }

/* 是否自适应宽度 */
.auto-w {
  width: 100%;
}

/* 特殊处理 */
.default-option-hide {
  display: none !important;
}

/* 控制下拉的最大高度，增加可视区域 */
.el-select-dropdown__wrap {
  max-height: 400px;
}

/* 控制分页数字列表的宽度 防止抖动 */
.el-select-dropdown .el-pagination .el-pager {
  width: 200px;
}
</style>
