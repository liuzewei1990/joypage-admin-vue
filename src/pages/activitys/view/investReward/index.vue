<!--  -->
<template>
  <section class="">
    <CommonTable :isFluid="false" @height="tableHeight = $event">
      <!--标头查询区-->
      <div slot="search">
        <el-form :inline="true" size="mini" :model="topCheckData" ref="topData">
          <el-form-item label="活动名称" prop="name">
            <el-input v-model="topCheckData.name" placeholder="请输入关键字"></el-input>
          </el-form-item>
          <el-form-item label="用户" prop="user">
            <BcSelect v-model="topCheckData.user" :list="selectJson.userType" :total="selectJson.userType.length" placeholderText="请选择"></BcSelect>
          </el-form-item>
          <el-form-item label="渠道" prop="channel">
            <BcSelect v-model="topCheckData.channel" :list="selectJson.channel" placeholderText="请选择"></BcSelect>
          </el-form-item>
          <el-form-item label="活动状态" prop="status">
            <BcSelect v-model="topCheckData.status" :list="selectJson.status" placeholderText="请选择"></BcSelect>
          </el-form-item>
        </el-form>
      </div>

      <!-- 操作按钮区 -->
      <div slot="action">
        <el-button class="" style="float: left" size="mini" icon="el-icon-plus" type="primary" @click="$router.push('/investReward/add')">新增投22资有礼</el-button>
        <el-button icon="el-icon-refresh" style="float: right" size="mini" @click="resetForm()">重置</el-button>
        <el-button icon="el-icon-search" style="float: right" size="mini" type="primary" @click="queryDataListBtn()">查询</el-button>
      </div>

      <!-- 表格内容 -->
      <el-table ref="elTable" :height="tableHeight" size="mini" :data="tableData.tableDataList" style="width: 100%" stripe border="true" @selection-change="selectionChange" v-loading="loading" element-loading-text="loading...">
        <!-- 展开详情 -->
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form ref="form" size="mini" label-width="90px" :inline="false" label-position="right">
              <!-- 奖励列表 -->
              <el-row>
                <el-col>
                  <el-form-item label="产品列表">
                    <RewardForm v-model="props.row.prdList" isDetail :form="props.row"></RewardForm>
                  </el-form-item>
                </el-col>
              </el-row>

              <!-- 累计额外奖励 -->
              <el-row>
                <el-col class="">
                  <el-form-item label="额外奖励">
                    <TotalRewardForm v-model="props.row.totalRewardList" isDetail></TotalRewardForm>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column prop="id" label="编号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="name" label="活动名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="startTime" label="活动开始时间" header-align="center" align="center" width="140"></el-table-column>
        <el-table-column prop="endTime" label="活动结束时间" header-align="center" align="center" width="140"></el-table-column>
        <el-table-column prop="user.name" label="可见用户" header-align="center" align="center"></el-table-column>
        <el-table-column prop="channel.name" label="渠道" header-align="center" align="center"></el-table-column>
        <el-table-column prop="device.name" label="设备" header-align="center" align="center"></el-table-column>
        <el-table-column prop="isTop" :formatter="(row, column, v) => (v == '1' ? '是' : '否')" label="显示排行榜" header-align="center" align="center"></el-table-column>
        <el-table-column prop="activityStatus" :formatter="(row, column, v) => (v == '1' ? '启用' : '禁用')" label="活动状态" header-align="center" align="center">
          <template slot-scope="scope">
            <el-tag type="success" v-show="scope.row.activityStatus == '1'" disable-transitions>启用</el-tag>
            <el-tag type="primary" v-show="scope.row.activityStatus == '2'" disable-transitions>禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" header-align="center" align="center" width="220px">
          <template slot-scope="scope">
            <el-button size="mini" style="float: left" type="text" @click="rowHandleDetail(scope.row, scope.$index, '2')">详情</el-button>
            <el-button size="mini" style="float: left" type="text" @click="rowHandleEdit(scope.row, scope.$index, '2')">修改</el-button>
            <el-button size="mini" style="float: left" type="text" @click="rowHandleDelete(scope.row, scope.row, '3')">删除</el-button>
            <el-button size="mini" style="float: left" type="text" @click="rowCopyDataById(scope.row, scope.$index, '2')">复制</el-button>
            <el-button size="mini" style="float: left" type="text" @click="rowChangeStatus(scope.row, scope.$index, '2')" v-show="scope.row.activityStatus == '2'">启用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination slot="footer" style="float: right" :page-sizes="[10, 20, 30, 40]" :page-size="topCheckData.length" @size-change="handleSizeChange" @current-change="currentChange" :current-page="topCheckData.currentPage" :pager-count="7" small layout="total, sizes, prev, pager, next, jumper" :total="tableData.totalCount"></el-pagination>
    </CommonTable>
  </section>
</template>

<script>
import CommonTable from "@common/finsuit-components/CommonTable/index.vue"
import RewardForm from "./modules/RewardForm.vue"
import TotalRewardForm from "./modules/TotalRewardForm.vue"
import selectJson from "./select.json"
import transformApiData from "./transformApiData.js"
export default {
  provide: { selectJson },
  components: { CommonTable, RewardForm, TotalRewardForm },
  data() {
    return {
      selectJson,
      tableHeight: 0,
      //表格loading
      loading: false,
      // 表格数据
      tableData: {
        tableDataList: [],
        totalCount: 0,
      },

      // 顶部查询条件
      topCheckData: {
        currentPage: 1,
        length: 10,
        name: "",
        user: selectJson["userType"][0],
        channel: selectJson["channel"][0],
        status: selectJson["status"][0],
      },
    }
  },
  mounted() {
    this.init()
  },
  pageAppear() {
    this.init()
  },
  //方法集合
  methods: {
    async init() {
      await this.getDataList()
    },
    // 筛选相关-点击查询
    queryDataListBtn() {
      this.toTablePage(1)
    },

    //筛选相关-点击重置
    resetForm() {
      this.$refs.topData.resetFields()
      this.toTablePage(1)
    },

    // 表格相关-页码变化时调用
    currentChange(pageNum) {
      this.toTablePage(pageNum)
    },

    // 表格相关-pageSize变化时
    handleSizeChange(pageSize) {
      this.topCheckData.length = pageSize
      this.toTablePage()
    },

    // 指定页码-刷新数据
    toTablePage(page) {
      if (page) this.topCheckData.currentPage = page
      this.getDataList()
    },

    // 表格相关-获取列表数据
    async getDataList() {
      this.loading = true
      let params = {}
      params["awardName"] = this.topCheckData.name
      params["userType"] = this.topCheckData.user.id
      params["releaseChannel"] = this.topCheckData.channel.id
      params["activityStatus"] = this.topCheckData.status.id
      params["currentPage"] = this.topCheckData.currentPage
      params["pageSize"] = this.topCheckData.length

      try {
        let data = await this.$api.investRewardQueryList(params)
        this.tableData.tableDataList = transformApiData(data.retList || [])
        this.tableData.totalCount = data.totalCount
        // 默认展开活动状态为开启的模版详情
        // await this.$nextTick()
        // let row = this.tableData.tableDataList.find((item) => item.activityStatus == "1") || {}
        // this.$refs["elTable"].toggleRowExpansion(row)
      } catch (error) {
        this.$msg.error(error.message)
      }
      setTimeout(() => {
        this.loading = false
      }, 100)
    },

    // 展开详情
    rowHandleDetail(row, index) {
      this.$refs["elTable"].toggleRowExpansion(row)
    },

    // 修改当前项
    rowHandleEdit(row, index) {
      let detail = encodeURIComponent(JSON.stringify(row))
      this.$router.push({ path: "/investReward/add", query: { pageType: "修改", detail: detail } })
    },

    // 复制当前条数据
    async rowCopyDataById(row, index) {
      await this.$confirm(`确定要复制【编号:${row.id}】的活动模版吗？`, "提示", { type: "warning" })
      try {
        // 一定要拷贝一份 在delete id 避免引用
        let detail = JSON.parse(JSON.stringify(row))
        delete detail.id
        detail = encodeURIComponent(JSON.stringify(detail))
        this.$router.push({ path: "/investReward/add", query: { pageType: "复制", detail: detail } })
      } catch (error) {
        this.$msg.fail("操作失败")
      }
    },

    // 表格相关-单个删除
    async rowHandleDelete(row, index) {
      if (row.activityStatus == "1") {
        this.$msg.error("不可删除正在启用中的活动模版")
        return
      }
      await this.$confirm(`确定要删除此条内容？`, "提示", { type: "warning" })
      try {
        let params = { id: row.id }
        let data = await this.$api.investRewardDeleteData(params)
        this.$msg.success("操作成功")
        // 删除完成，刷新数据
        this.getDataList()
      } catch (error) {
        this.$msg.fail("操作失败")
      }
    },

    // 表格相关-修改活动状态
    async rowChangeStatus(row, index) {
      await this.$confirm(`确定要启用【编号:${row.id}】的活动吗？`, "提示", { type: "warning" })
      try {
        let params = { id: row.id }
        let data = await this.$api.investRewardToStatus(params)
        this.$msg.success("操作成功")
        // 删除完成，刷新数据
        this.getDataList()
      } catch (error) {
        this.$msg.fail("操作失败")
      }
    },
  },

  activated() {
    // 如果是修改的情况，应该刷新当前查询条件
    if (this.$root.RefreshTableList === true) {
      this.toTablePage()
    }
    // 如果是新增的情况，应该重置第一页
    if (typeof this.$root.RefreshTableList === "number") {
      this.resetForm()
    }
    this.$root.RefreshTableList = null
  },
}
</script>
<style lang="less" scoped>
/deep/ .el-table__expanded-cell {
  padding: 10px;
}
</style>
