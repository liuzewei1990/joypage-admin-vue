<template>
    <!-- 小程序管理 列表页 -->
    <div class="miniManageList">
        <!-- <el-form :inline="true" :size='size' class='searchForm' :model='searchForm' ref='searchForm'>
      <el-form-item label='搜索' prop='appName'>
        <el-input type='text' v-model='searchForm.appName' placeholder='请输入关键字'></el-input>
      </el-form-item>
      <el-form-item label="时间：" prop='time'>
        <el-date-picker
          v-model="searchForm.time"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format='yyyy-MM-dd HH:mm:ss'     
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择时间范围">
        </el-date-picker>
      </el-form-item>
      
    </el-form> -->
        <el-form class="btnCon">
            <el-form-item>
                <el-button :size="size" icon="el-icon-plus" type="primary" @click="add">新增</el-button>
            </el-form-item>
            <!-- <el-form-item>
        <el-button :size='size' icon='el-icon-search' type="primary" @click="onSubmit">查询</el-button>
        <el-button :size='size' icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item> -->
        </el-form>

        <el-table :data="contentList" style="width: 100%" border="true" :loading="tabLoading">
            <el-table-column prop="appId" label="appId" width="200" header-align="center" align="center"></el-table-column>
            <el-table-column prop="appName" label="名称" header-align="center" align="center"></el-table-column>
            <el-table-column prop="updTime" sortable width="200" label="最近操作时间" header-align="center" align="center"></el-table-column>
            <el-table-column prop="updName" label="操作人" header-align="center" align="center"></el-table-column>
            <el-table-column label="操作" width="200" fixed="right" header-align="center" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="handleDelete(scope.row, scope.$index)">删除</el-button>
                    <el-button size="mini" type="text" @click="handleEdit(scope.row, scope.$index)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页栏-->
        <div class="toolbar" style="padding: 10px 0">
            <el-pagination
                layout="total, prev, pager, next, jumper"
                style="float: right"
                :total="pageParams.totalPage"
                @current-change="refreshPageRequest"
                @size-change="handleSizeChange"
                :current-page="pageParams.pageNum"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageParams.pageSize">
            </el-pagination>
        </div>

        <add-mini :form="form" :status="status" @save="save" @cancle="cancle" v-if="dialogVisible"></add-mini>
    </div>
</template>
<script>
    import { forAppletPageList, delApplet } from "../../../apis/index";
    import addMini from "../../../components/addMini";
    export default {
        components: { addMini },
        data() {
            return {
                dialogVisible: false,
                size: "small",
                tabLoading: true,
                form: Object,
                searchForm: {
                    appName: "",
                    time: ""
                },
                pageParams: {
                    pageSize: 10,
                    pageNum: 1,
                    totalPage: 0
                },
                contentList: [],
                status: "add" // add是新建，edit是修改
            };
        },
        created() {
            this.forAppletPageListFun();
        },
        methods: {
            handleSizeChange() {},
            // 请求分页换页刷新 handleCurrentChange
            refreshPageRequest: function (val) {
                console.log(`当前页: ${val}`);
                this.pageParams.pageNum = val;
                this.forAppletPageListFun();
            },
            // 获取列表数据
            forAppletPageListFun() {
                let params = {
                    pageSize: this.pageParams.pageSize,
                    pageNum: this.pageParams.pageNum,
                    useTimeStart: this.searchForm.time === "" || this.searchForm.time == null ? "" : this.searchForm.time[0],
                    useTimeEnd: this.searchForm.time === "" || this.searchForm.time == null ? "" : this.searchForm.time[1],
                    appName: this.searchForm.appName,
                    useStatus: ""
                };
                forAppletPageList(params).then((res) => {
                    if (Number(res.code) === 0) {
                        this.tabLoading = false;
                        this.contentList = res.data.data;
                        this.pageParams.totalPage = res.data.totalCount;
                    } else {
                        this.tabLoading = false;
                        this.$message.error(res.message);
                    }
                });
            },
            // 删除
            handleDelete(row, index) {
                this.$confirm("确定删除此条数据吗？", "提示", { type: "warning" })
                    .then(() => {
                        let params = "";
                        let data = {
                            id: row.id
                        };
                        delApplet(params, data).then((res) => {
                            if (Number(res.code) === 0) {
                                this.forAppletPageListFun();
                            } else {
                                this.$message({ type: "error", message: res.message });
                            }
                        });
                    })
                    .catch(() => {
                        this.$message({ type: "info", message: "已取消删除" });
                    });
            },
            // 修改
            handleEdit(row, index) {
                this.status = "edit";
                this.form = {
                    appName: row.appName,
                    appId: row.appId,
                    appSecret: row.appSecret,
                    id: row.id,
                    originalId: row.originalId
                };
                this.$nextTick(() => {
                    this.dialogVisible = true;
                });
            },
            // 取消
            cancle() {
                this.dialogVisible = false;
            },
            // 提交
            save() {
                this.pageParams.pageNum = 1;
                this.dialogVisible = false;
                this.forAppletPageListFun();
            },
            // 新增
            add() {
                this.status = "add";
                this.form = {
                    appName: "",
                    appId: "",
                    appSecret: "",
                    originalId: ""
                };
                this.dialogVisible = true;
            },
            // 查询
            onSubmit() {
                this.pageParams.pageNum = 1;
                this.forAppletPageListFun();
            },
            // 重置
            reset() {
                this.contentList = [];
                this.$refs.searchForm.resetFields();
                this.pageParams.pageNum = 1;
                this.forAppletPageListFun();
            }
        }
    };
</script>
<style lang="less" scoped>
    .miniManageList {
        padding: 20px;
        .btnCon {
            display: flex;
            padding-right: 50px;
            justify-content: space-between;
        }
    }
</style>
