<template>
  <el-container>
    <el-header style="background: rgb(250 250 250)">
      <el-page-header :content="`${pageType}活动模版`" style="margin-top: 20px" @back="$router.back()"></el-page-header>
    </el-header>
    <el-main style="">
      <section class="page">
        <el-form ref="form" :model="form" :rules="rules" size="mini" label-width="90px" :inline="false" label-position="right">
          <!-- 奖励名称 -->
          <el-row>
            <el-col :xs="xs" :sm="sm" :md="md" :lg="lg" :xl="xl">
              <el-form-item label="活动名称" prop="name">
                <el-input v-model="form.name" :maxlength="10"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 奖励列表 -->
          <el-row>
            <el-col>
              <el-form-item label="产品列表" prop="prdList">
                <RewardForm v-model="form.prdList" @validate="$refs['form'].validateField($event)"></RewardForm>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 累计额外奖励 -->
          <el-row>
            <el-col class="">
              <el-form-item label="额外奖励">
                <TotalRewardForm v-model="form.totalRewardList"></TotalRewardForm>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 排行榜 -->
          <el-row>
            <el-col :xs="xs" :sm="sm" :md="md" :lg="lg" :xl="xl">
              <el-form-item label="显示排行榜">
                <el-switch v-model="form.isTop" :active-value="1" :inactive-value="2"></el-switch>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 数据注水 -->
          <el-row v-show="form.isTop == '1'">
            <el-col>
              <el-form-item label="排行榜注水">
                <TopListForm v-model="form.topList"></TopListForm>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 选择用户 -->
          <el-row>
            <el-col :xs="xs" :sm="sm" :md="md" :lg="lg" :xl="xl">
              <el-form-item label="选择用户">
                <BcSelect v-model="form.user" :list="selectJson.userType"></BcSelect>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 时间 -->
          <el-row>
            <el-col :xs="xs" :sm="sm" :md="md" :lg="lg" :xl="xl">
              <el-form-item label="生效时间" prop="startTime">
                <el-date-picker type="datetime" v-model="form.startTime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00" style="width: 100%"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :xs="xs" :sm="sm" :md="md" :lg="lg" :xl="xl">
              <el-form-item label="结束时间" prop="endTime">
                <el-date-picker type="datetime" v-model="form.endTime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00" style="width: 100%"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 渠道 -->
          <el-row>
            <el-col :xs="xs" :sm="sm" :md="md" :lg="lg" :xl="xl">
              <el-form-item label="发布渠道">
                <BcSelect v-model="form.channel" :list="selectJson.channel"></BcSelect>
              </el-form-item>
            </el-col>
            <el-col :xs="xs" :sm="sm" :md="md" :lg="lg" :xl="xl">
              <el-form-item label="发布设备">
                <BcSelect v-model="form.device" :list="selectJson.device"></BcSelect>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item>
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <el-button @click="cancel">取消</el-button>
          </el-form-item>
        </el-form>

        <!-- {{form}} -->
      </section>
    </el-main>
  </el-container>
</template>
<script>
import RewardForm from "./modules/RewardForm"
import TopListForm from "./modules/TopListForm"
import TotalRewardForm from "./modules/TotalRewardForm"
import selectJson from "./select.json"
import transformApiDataPost from "./transformApiDataPost"
export default {
  provide: { selectJson },
  components: { RewardForm, TopListForm, TotalRewardForm },
  data() {
    return {
      selectJson,
      pageType: this.$route.query["pageType"] || "新增",
      xs: 11,
      sm: 9,
      md: 7,
      lg: 5,
      xl: 3,
      form: {
        // 奖励名称
        name: "",
        // 产品奖励模板列表
        // prdList: [{ prdType: { name: "非直连产品", id: "1" }, upload: [{ name: "", url: "https://finsuit-test.oss-cn-beijing.aliyuncs.com/ACT/6d1b01a8-30d5-4892-9969-a2a377a65f29.png" }] }],
        prdList: [{}],
        // 累计额外奖励
        totalRewardList: [],
        // 是否显示排行榜
        isTop: "1",
        // 排行榜数据注水
        topList: [{}],
        // 用户群体
        user: selectJson.userType[0],
        // 开始时间
        startTime: "",
        // 结束时间
        endTime: "",
        // 发布渠道
        channel: selectJson.channel[0],
        // 发布设备
        device: selectJson.device[0],
      },
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" },
        ],
        prdList: [
          {
            required: true,
            message: "应该至少添加一个活动产品",
          },
        ],
        startTime: [{ type: "string", required: true, message: "请选择日期", trigger: "change" }],
        endTime: [{ type: "string", required: true, message: "请选择时间", trigger: "change" }],
      },
    }
  },
  created() {
    this.init()
  },
  mounted() {
    // console.log(this);
  },
  methods: {
    init() {
      // 是否是回显修改
      let queryDetail = this.$route.query["detail"]
      if (queryDetail) {
        queryDetail = JSON.parse(decodeURIComponent(queryDetail))
        console.log("queryDetail:", queryDetail)
        this.form = queryDetail
      }
    },

    onSubmit() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          await this.$confirm(`确定要提交吗？`, "提示", { type: "warning" })
          this.submit()
        } else {
          console.log("error submit!!")
          return false
        }
      })
    },

    async submit() {
      // 转换后台接口字段
      let param = transformApiDataPost(this.form)
      let params = { ...param }
      let data = await this.$api.investRewardAddData(params)

      // back路由后根据情况刷新表格数据
      if (this.pageType === "新增") {
        this.$msg.success("添加成功")
        this.$root.RefreshTableList = 1
      }
      if (this.pageType === "复制") {
        this.$msg.success("复制成功")
        this.$root.RefreshTableList = 1
      }
      if (this.pageType === "修改") {
        this.$msg.success("修改成功")
        this.$root.RefreshTableList = true
      }

      this.$router.back()
    },

    // 取消
    async cancel() {
      let res = await this.$confirm(`确定要返回吗？`, "提示", { type: "warning" })
      this.$router.back()
    },
  },
}
</script>
<style lang="less" scoped>
.page {
  //   padding: 0 40px;
  box-sizing: border-box;
  /deep/.el-form-item__label {
    font-size: 13px;
  }
}
</style>
