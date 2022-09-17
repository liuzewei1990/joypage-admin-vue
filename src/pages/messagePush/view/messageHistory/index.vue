<template>
    <!-- 推送历史 -->
    <div class="messageHistory">
        <el-form :inline="true" :size="size" :model="formSearch" ref="formSearch" class="demo-form-inline btnCon">
            <el-form-item label="推送方式：" prop="pushWay">
                <el-select v-model="formSearch.pushWay" clearable placeholder="请选择推送方式">
                    <el-option v-for="item in typeOptions" :key="item.name" :label="item.name" :value="item.value"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="发送时间：" prop="time">
                <el-date-picker
                    v-model="formSearch.time"
                    type="datetimerange"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="选择时间"
                    end-placeholder="选择时间"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    align="right">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="目标渠道：" prop="appFlag" style="display: inline-block">
                <el-select style="width: 40%" v-model="formSearch.appFlag" clearable placeholder="">
                    <el-option v-for="item in appFlagOptions" :key="item.name" :label="item.name" :value="item.value"> </el-option>
                </el-select>

                <el-form-item class="item" prop="plateformType" style="display: inline-block; margin-left: 10px">
                    <el-select style="width: 40%" v-model="formSearch.plateformType" clearable placeholder="">
                        <el-option v-for="item in plateformTypeOptions" :key="item.name" :label="item.name" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>
            </el-form-item>
        </el-form>
        <div class="editBtn">
            <el-button :size="size" icon="el-icon-search" type="primary" @click="onSubmit">查询</el-button>
            <el-button :size="size" icon="el-icon-refresh" @click="reset">重置</el-button>
        </div>
        <!-- 表格内容栏 多选el-table-column 中 type="selection" 取索引type="index" default-expand-all 默认全部展开-->
        <el-table :data="messageHistoryList" style="width: 100%; margn-top: 20px" border="true" :loading="tabLoading">
            <el-table-column type="index" :index="indexMethod" label="序号" width="100" header-align="center" align="center"></el-table-column>
            <el-table-column prop="pushTime" width="170" label="发送时间" header-align="center" align="center"></el-table-column>
            <el-table-column prop="status" label="发送状态" header-align="center" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.status == 1">待发送</span>
                    <span v-if="scope.row.status == 2">已发送</span>
                    <span v-if="scope.row.status == 3">发送异常</span>
                    <span v-if="scope.row.status == 4">已撤销</span>
                </template>
            </el-table-column>
            <el-table-column prop="summary" width="220" label="内容" header-align="center" align="center"></el-table-column>
            <el-table-column prop="pushWay" width="220" label="推送方式" header-align="center" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.pushWay == 2">Push </span>
                    <span v-if="scope.row.pushWay == 3">站内信 </span>
                </template>
            </el-table-column>
            <el-table-column prop="systemType" label="目标渠道" header-align="center" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.systemType == 0">全部 </span>
                    <span v-if="scope.row.systemType == 1">android </span>
                    <span v-if="scope.row.systemType == 2">ios </span>
                </template>
            </el-table-column>
            <el-table-column prop="appFlag" label="目标平台" header-align="center" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.appFlag == 'ALL'">全部 </span>
                    <span v-if="scope.row.appFlag == 'BC'">比财 </span>
                    <span v-if="scope.row.appFlag == 'PC'">拼财 </span>
                </template>
            </el-table-column>
            <el-table-column prop="pushType" width="100" label="目标人群" header-align="center" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.pushType == 1">全部用户 </span>
                    <span v-if="scope.row.pushType == 3">excel用户 </span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200" fixed="right" header-align="center" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="getActInfoByIdFun(scope.row, scope.$index)">查看</el-button>
                    <el-button size="mini" type="text" @click="handleEdit(scope.row, scope.$index)">转发</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页栏-->
        <div class="toolbar" style="padding: 10px 0">
            <el-pagination
                layout="total, prev, pager, next, jumper"
                style="float: right"
                :total="totalSize"
                @current-change="refreshPageRequest"
                @size-change="handleSizeChange"
                :current-page="pageRequest.pageNum"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageRequest.pageSize">
            </el-pagination>
        </div>

        <message-preview
            ref="messagePreview"
            status="his"
            :message="form"
            v-if="dialogFormVisible"
            :dialogFormVisible="dialogFormVisible"
            @sure="sure"
            @cancel="cancel"
            title="发送预览"
            cancelTxt=""
            sureTxt="确 定"></message-preview>
    </div>
</template>

<script>
    import { getActInfoList, getActInfoById } from "../../apis/index";
    import messagePreview from "../../components/messagePreview";
    export default {
        name: "advertListManage",
        components: { messagePreview },
        data() {
            return {
                dialogFormVisible: false,
                status: "his",
                formSearch: {
                    pushWay: "",
                    time: null,
                    plateformType: "",
                    appFlag: ""
                },
                typeOptions: [
                    {
                        name: "Push",
                        value: "2"
                    },
                    {
                        name: "站内信",
                        value: "3"
                    }
                ],
                appFlagOptions: [
                    {
                        name: "全部",
                        value: "ALL"
                    },
                    {
                        name: "拼财",
                        value: "PC"
                    },
                    {
                        name: "比财",
                        value: "BC"
                    }
                ],
                plateformTypeOptions: [
                    {
                        name: "全部",
                        value: "0"
                    },
                    {
                        name: "android",
                        value: "1"
                    },
                    {
                        name: "ios",
                        value: "2"
                    }
                ],
                saveLoading: false,
                totalSize: 0, //总数
                pageRequest: {
                    pageNum: 1,
                    pageSize: 10
                },
                size: "small",
                loading: false, //请求产品类别时loading
                messageHistoryList: [],
                tabLoading: true,
                form: Object
            };
        },
        mounted() {
            this.getActInfoListFun();
        },
        created() {},
        methods: {
            // 转发
            handleEdit(row, index) {
                this.$router.push({
                    path: `/sendMessage?id=${row.id}`
                });
            },
            // 获取详情
            getActInfoByIdFun(row, index) {
                console.log(row);
                this.$nextTick(() => {
                    this.dialogFormVisible = true;
                    this.form = row;
                });
                // this.dialogFormVisible=true
                // let params= {
                //   id: row.id
                // }
                // getActInfoById(params).then((res) => {

                // })
            },

            // 获取table数据
            getActInfoListFun() {
                let params = {
                    length: this.pageRequest.pageSize,
                    start: (this.pageRequest.pageNum - 1) * this.pageRequest.pageSize,
                    status: this.status,
                    appFlag: this.formSearch.appFlag,
                    startTime: this.formSearch.time == null ? "" : this.formSearch.time[0],
                    endTime: this.formSearch.time == null ? "" : this.formSearch.time[1],
                    systemType: this.formSearch.plateformType,
                    pushWay: this.formSearch.pushWay
                };
                getActInfoList(params).then((res) => {
                    if (res.result) {
                        this.totalSize = res.data.totalCount;
                        this.messageHistoryList = res.data.data;
                    }
                });
            },
            // 弹框点击确认
            sure() {
                this.dialogFormVisible = false;
            },
            cancel() {
                this.dialogFormVisible = false;
            },
            // 保存
            save() {},
            handleSizeChange() {},
            // 请求分页换页刷新 handleCurrentChange
            refreshPageRequest: function (val) {
                console.log(`当前页: ${val}`);
                this.pageRequest.pageNum = val;
                this.getActInfoListFun();
            },
            indexMethod(index) {
                return (this.pageRequest.pageNum - 1) * this.pageRequest.pageSize + (index + 1);
            },
            onSubmit() {
                this.pageRequest.pageNum = 1;
                this.messageHistoryList = [];
                this.getActInfoListFun();
            },
            reset() {
                this.messageHistoryList = [];
                this.$refs.formSearch.resetFields();
                this.pageRequest.pageNum = 1;
                this.getActInfoListFun();
            }
        }
    };
</script>

<style lang="less" scoped>
    .messageHistory {
        padding: 20px;
        .tabCon {
            margin-bottom: 20px;
            .tab {
                background: transparent;
                border: none;
                margin-right: 20px;
                outline: none;
                padding: 20px;
                padding-top: 0;
            }
            .active-tab {
                border-bottom: 1.5px solid #409eff;
                color: #409eff;
            }
        }
        .btnCon {
            display: flex;
            /deep/ .el-input,
            /deep/ .el-select {
                width: 100px;
            }
            /deep/ .el-date-editor--datetimerange.el-input,
            .el-date-editor--datetimerange.el-input__inner {
                width: 340px;
            }
            /deep/ .el-form-item--mini.el-form-item,
            .el-form-item--small.el-form-item {
                margin-right: 25px;
            }
        }
        .editBtn {
            margin-bottom: 20px;
        }
        .el-table thead {
            color: #909399;
            font-weight: 500;
            font-size: 14px;
        }
        .el-table--mini td,
        .el-table--mini th {
            padding: 10px 0;
        }
        .el-select.el-select--small {
            width: 100%;
        }
    }
</style>
