<!--  -->
<template>
  <section class="" data="额外奖励">
    <!-- 表单列表标题 -->
    <el-row class="row-col-box" v-if="formList.length > 0">
      <el-col span="3" class="row-col-title"> 累计投资金额 </el-col>
      <el-col span="3" class="row-col-title"> 奖励类型 </el-col>
      <el-col span="3" class="row-col-title"> 奖励数值 </el-col>
      <el-col span="3" class="row-col-title"> </el-col>
    </el-row>

    <!-- 表单列表内容 -->
    <el-row class="row-col-content" v-if="isDetail === false" v-for="(formItem, index) in formList" :key="index">
      <el-col span="3">
        <el-form-item class="spacing">
          <el-input type="number" v-model="formItem.totalAmount" maxlength="15"><template slot="append">元</template></el-input>
        </el-form-item>
      </el-col>
      <el-col span="3">
        <el-form-item class="spacing">
          <BcSelect v-model="formItem.rewardType" :list="selectJson.rewardType" @change="formItem._rewardTypeChange(formItem)"></BcSelect>
        </el-form-item>
      </el-col>
      <el-col span="3" class="spacing">
        <el-form-item v-if="formItem.rewardType.id == '1'">
          <el-input type="number" v-model="formItem.rewardValue" maxlength="5"><template slot="append">元</template></el-input>
        </el-form-item>
        <el-form-item v-if="formItem.rewardType.id == '2'">
          <el-input type="number" v-model="formItem.rewardValue" maxlength="5"><template slot="append">积分</template></el-input>
        </el-form-item>
        <el-form-item v-if="formItem.rewardType.id == '3'">
          <!--  modelType="id"新支持的功能，默认为obj， 老代码使用的是obj模式，老代码暂且先不更新，有时间了可以同步过来 -->
          <BcSelect modelType="id" :autoGetApiData="true" v-model="formItem.rewardValue" @clickItem="(item) => (formItem.rewardName = item.REWARD_NAME)" @GetApiData="SetRewardSelectData" itemNameKey="REWARD_NAME" itemValueKey="ID"></BcSelect>
        </el-form-item>
      </el-col>
      <el-col span="3" class="center flex">
        <el-link icon="el-icon-remove" @click="removeFormItem(index)">删除</el-link>
        <el-link icon="el-icon-circle-plus" v-if="formList.length === index + 1" @click="addFormItem(index + 1)">新增</el-link>
      </el-col>
    </el-row>

    <!-- 表单列表内容 -->
    <el-row class="row-col-content" v-if="isDetail === true" v-for="(formItem, index) in formList" :key="index">
      <el-col span="3">
        <el-form-item class="spacing center border-r">
          <span class="td">{{ formItem.totalAmount }}元</span>
        </el-form-item>
      </el-col>
      <el-col span="3">
        <el-form-item class="spacing center border-r">
          <span class="td">{{ formItem.rewardType.name }}</span>
        </el-form-item>
      </el-col>
      <el-col span="3" class="spacing">
        <el-form-item class="spacing center border-r">
          <span class="td" v-if="formItem.rewardType.id == '1'">{{ formItem.rewardValue }}元红包</span>
          <span class="td" v-if="formItem.rewardType.id == '2'">{{ formItem.rewardValue }}积分</span>
          <span class="td" v-if="formItem.rewardType.id == '3'">{{ formItem.rewardName }}</span>
        </el-form-item>
      </el-col>
      <el-col span="3" class="center flex"> </el-col>
    </el-row>

    <!-- 无数据时新增按钮 -->
    <el-row v-if="isDetail === false && formList.length === 0">
      <el-col span="3" class="">
        <el-link icon="el-icon-circle-plus" @click="addFormItem(index + 1)">添加额外奖励</el-link>
      </el-col>
    </el-row>

    <!-- 无数据时占位符 -->
    <el-row class="" v-if="isDetail === true && formList.length === 0">
      未配置额外奖励
      <el-tooltip content="如需额外奖励请到【修改】-【额外奖励】中添加" placement="top"><i class="el-icon-question el-icon--right"></i></el-tooltip>
    </el-row>
  </section>
</template>

<script>
class FormItem {
  constructor() {
    // 累计投资金额
    this.totalAmount = 10000
    // 奖励类型
    this.rewardType = { name: "红包", id: "1" }
    // 奖励数值
    this.rewardValue = ""
    // 奖励名称
    this.rewardName = ""
  }
  // 当奖励类型变化时，清空奖励值
  _rewardTypeChange() {
    this.rewardValue = ""
    this.rewardName = ""
  }
}
export default {
  name: "cdcdcd",
  inject: ["selectJson"],
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      },
    },
    isDetail: {
      type: Boolean,
      default: false,
    },
  },
  components: {},
  data() {
    return {
      isUpdate: false,
      formList: [],
    }
  },
  watch: {
    formList: {
      handler: function (newVal, oldVal) {
        this.$emit("input", newVal)
      },
    },
  },
  created() {
    this.initFormList()
  },
  mounted() {},
  //方法集合
  methods: {
    // 注入实体方法
    initFormList() {
      this.formList = this.value.map((formItem) => {
        // 实体合并 为了继承实体方法
        return Object.assign(new FormItem(), formItem)
      })
    },

    // 设置权益列表
    async SetRewardSelectData($event) {
      let params = { activityCode: "INVEST_GIFTS", rewardType: "2" }
      let data = await this.$api.getRewardInfoList(params)
      // 0 不展示分页
      $event.callback({ list: data, total: 0 })
    },

    // 新增
    addFormItem(index) {
      let newFormItem = new FormItem()
      this.formList.push(newFormItem)
    },

    // 删除
    async removeFormItem(index) {
      let res = await this.$confirm("确定删除吗？", "提示", { type: "warning" })
      this.formList.splice(index, 1)
    },
  },
}
</script>
<style lang="less" scoped>
@import "./common.less";
</style>
